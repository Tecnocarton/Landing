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
 * Es no-op si SHEETS_WEBHOOK_URL no está configurada, y NUNCA lanza:
 * un fallo al registrar no debe romper el envío de la cotización.
 */

// El Web App puede quedar colgado (autorización vencida, cuota). Sin timeout,
// la respuesta al cliente esperaría indefinidamente.
const TIMEOUT_MS = 8000;

export async function appendQuoteToSheet(values) {
  const url = process.env.SHEETS_WEBHOOK_URL;
  if (!url) return { ok: false, skipped: true };

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        secret: process.env.SHEETS_WEBHOOK_SECRET || '',
        values,
      }),
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
      console.error('Sheets: registro FALLIDO', {
        status: res.status,
        error: payload?.error ?? 'respuesta no reconocida (¿el Web App está desplegado como "cualquier usuario"?)',
        body: text.slice(0, 300),
      });
      return { ok: false, status: res.status, error: payload?.error ?? 'respuesta no reconocida' };
    }

    console.log(`Sheets: cotizacion registrada en la fila ${payload.row} de "${payload.sheet}"`);
    return { ok: true, row: payload.row, sheet: payload.sheet };
  } catch (error) {
    console.error('Error al registrar cotizacion en Google Sheets:', error);
    return { ok: false, error: String(error) };
  }
}
