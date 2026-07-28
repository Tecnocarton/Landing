/**
 * Registro de cotizaciones en Google Sheets vía un Web App de Google Apps Script.
 *
 * Por qué un Apps Script y no la URL de la planilla: el link "/pubhtml" es la
 * vista publicada de SOLO LECTURA; para insertar filas se necesita un endpoint
 * de escritura. El Apps Script (doPost) expone justamente eso sin credenciales
 * de servicio ni dependencias extra.
 *
 * OJO — Apps Script SIEMPRE responde HTTP 200 (y suele redirigir a
 * googleusercontent.com). `res.ok` por sí solo no dice nada: el estado real
 * viaja en el body JSON (`{ ok, row, sheet }` o `{ ok: false, error }`). Por eso
 * acá se parsea el body y no se confía en el código de estado.
 *
 * Configuración (env vars):
 *   SHEETS_WEBHOOK_URL     URL del Web App desplegado (termina en /exec)
 *   SHEETS_WEBHOOK_SECRET  (opcional) token compartido para validar el origen
 *
 * En Vercel las env vars se congelan al desplegar: cambiarlas no afecta a un
 * deploy ya construido, hay que hacer Redeploy. Y el ámbito importa — una
 * variable marcada solo "Production" no existe en las URLs de preview.
 *
 * Es no-op si SHEETS_WEBHOOK_URL no está configurada, y NUNCA lanza:
 * un fallo al registrar no debe romper el envío de la cotización. Pero TODO
 * camino de fallo deja un log: si la planilla no recibe una fila, la razón
 * está en los Runtime Logs de la Function, nunca en silencio.
 */

// El Web App puede quedar colgado (autorización vencida, cuota). Sin timeout,
// la respuesta al cliente esperaría indefinidamente. 15 s y no menos: un Apps
// Script en arranque frío responde bastante más lento desde la región de la
// Function que desde una máquina local, y esto corre en paralelo al email
// (Promise.allSettled en app/api/contact/route.js), así que no demora la
// respuesta al cliente más de lo que ya demora Resend.
const TIMEOUT_MS = 15000;

/**
 * Huella de la configuración para los logs. Nunca incluye los valores: solo
 * lo justo para reconocer un valor mal pegado en el panel de Vercel (un salto
 * de línea, un truncamiento, la URL de la versión /dev en vez de /exec).
 */
function configFingerprint(url, secret) {
  return {
    urlLargo: url.length,
    urlTerminaEnExec: url.endsWith('/exec'),
    secretoPresente: secret.length > 0,
    secretoLargo: secret.length,
  };
}

export async function appendQuoteToSheet(values) {
  // trim(): pegar en el panel de Vercel arrastra espacios o un salto de línea
  // con facilidad, y eso rompe el fetch con un error que no apunta a la causa.
  const url = (process.env.SHEETS_WEBHOOK_URL || '').trim();
  const secret = (process.env.SHEETS_WEBHOOK_SECRET || '').trim();

  if (!url) {
    // Con un `return` mudo, "la variable no llegó al deploy" y "todo salió
    // bien" se ven igual en los logs. Este aviso es lo que separa ambos casos.
    console.warn(
      'Sheets: SHEETS_WEBHOOK_URL no está definida en este entorno; la cotización NO se registró en la planilla.'
    );
    return { ok: false, skipped: true };
  }

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ secret, values }),
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });

    const text = await res.text();
    let payload = null;
    try {
      payload = JSON.parse(text);
    } catch {
      // Respuesta HTML: normalmente una pantalla de login o de error de Google,
      // señal de que el despliegue no es "cualquier usuario" o está desactualizado.
    }

    if (!res.ok || !payload || payload.ok !== true) {
      const error =
        payload?.error ?? 'respuesta no reconocida (¿el Web App está desplegado como "cualquier usuario"?)';
      console.error('Sheets: registro FALLIDO', {
        status: res.status,
        error,
        // 'unauthorized' = el secreto de este entorno no coincide con la
        // constante SECRET del Apps Script. Es el caso típico cuando el
        // registro funciona en local y no en producción.
        pista:
          payload?.error === 'unauthorized'
            ? 'El secreto de este entorno no coincide con el del Apps Script.'
            : undefined,
        config: configFingerprint(url, secret),
        body: text.slice(0, 300),
      });
      return { ok: false, status: res.status, error };
    }

    console.log(`Sheets: cotizacion registrada en la fila ${payload.row} de "${payload.sheet}"`);
    return { ok: true, row: payload.row, sheet: payload.sheet };
  } catch (error) {
    // AbortSignal.timeout lanza un TimeoutError genérico: sin este mensaje, el
    // log no deja claro que el Web App simplemente no alcanzó a responder.
    const esTimeout = error?.name === 'TimeoutError' || error?.name === 'AbortError';
    console.error(
      esTimeout
        ? `Sheets: el Web App no respondió en ${TIMEOUT_MS / 1000} s; la cotización NO quedó en la planilla.`
        : 'Error al registrar cotizacion en Google Sheets:',
      { error: String(error), config: configFingerprint(url, secret) }
    );
    return { ok: false, error: String(error), timeout: esTimeout };
  }
}
