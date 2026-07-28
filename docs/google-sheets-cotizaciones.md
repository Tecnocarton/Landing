# Registro de cotizaciones en Google Sheets

Cada cotización enviada desde el formulario web se registra automáticamente como una
fila en la planilla, además de llegar por email (Resend). El código ya está integrado en
[`app/api/contact/route.js`](../app/api/contact/route.js) vía
[`lib/sheets.js`](../lib/sheets.js) y [`lib/sheetRow.mjs`](../lib/sheetRow.mjs); solo falta
la configuración de una vez que se describe abajo.

**Por qué no basta la URL de la planilla:** el link que termina en `/pubhtml` es la vista
*publicada de solo lectura*. Para *escribir* filas se usa un Web App de Google Apps Script
ligado a la planilla, que expone un endpoint POST. Sin credenciales de servicio ni
dependencias extra.

## Columnas de la planilla (orden exacto, fila 1)

```
Fecha | Producto Solicitado | Cantidad | Tipo de carton | Onda | Detalles adicionales | Empresa/Nombre | Email | Telefono | N° cotización
```

Son **10 columnas, A → J**. `N° cotización` (columna J) permite cruzar la fila con el
correo que recibe ventas y con el número que el cliente ve en pantalla.

Los campos sin columna propia (caja de stock sugerida por el BoxFinder, unidades por caja,
modo de empaque, formatos de rollo) se pliegan dentro de "Detalles adicionales", separados
por ` | `. El orden y el contenido de la fila están cubiertos por
[`lib/sheetRow.test.mjs`](../lib/sheetRow.test.mjs) (`npm test`).

**Fecha**: formato ordenable `2026-07-27 14:03:11`, en hora de Santiago. Se escribe como
texto (`setNumberFormat('@')`) para que Sheets no reinterprete el día y el mes.

## Dónde escribe

El script calcula **la última fila con datos + 1**, siempre dentro de las columnas del
contrato. Nunca escribe en la fila 1 (encabezados) y nunca deja huecos, aunque alguien
haya dejado contenido suelto muy abajo en la hoja.

## Configuración (una sola vez)

### 1. Preparar la planilla

1. Abre la planilla editable:
   `https://docs.google.com/spreadsheets/d/1FO_YbhkqG9SUA_gV47SlAqnDV4Ugd430wNJ8dmNYZsw/edit`
2. Renombra la pestaña de cotizaciones a exactamente **`Cotizaciones`**.
   El script la resuelve **por nombre**, no por posición: así, agregar o reordenar
   pestañas más adelante no desvía las cotizaciones a la hoja equivocada.
3. Confirma que la **fila 1** tenga los 10 encabezados de arriba. Si la hoja está vacía, el
   script los crea solo la primera vez; si ya tienes las 9 columnas antiguas, escribe
   `N° cotización` en **J1** a mano (el script nunca pisa encabezados existentes).

### 2. Crear el Apps Script

Menú **Extensiones → Apps Script**, borra el contenido y pega esto. Reemplaza
`PON_AQUI_UN_SECRETO` por una clave a tu elección (la misma irá en las variables de entorno).

```javascript
const SHEET_ID   = '1FO_YbhkqG9SUA_gV47SlAqnDV4Ugd430wNJ8dmNYZsw';
const SHEET_NAME = 'Cotizaciones';               // por NOMBRE, no getSheets()[0]
const SECRET     = 'PON_AQUI_UN_SECRETO';        // debe coincidir con SHEETS_WEBHOOK_SECRET

const HEADERS = [
  'Fecha', 'Producto Solicitado', 'Cantidad', 'Tipo de carton', 'Onda',
  'Detalles adicionales', 'Empresa/Nombre', 'Email', 'Telefono', 'N° cotización'
];

function json_(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

function getSheet_() {
  const ss = SpreadsheetApp.openById(SHEET_ID);
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) { sheet = ss.insertSheet(SHEET_NAME); }
  return sheet;
}

// Crea los encabezados SOLO si la fila 1 está vacía. Nunca pisa los existentes.
function ensureHeaders_(sheet) {
  const primera = sheet.getRange(1, 1, 1, HEADERS.length).getValues()[0];
  const vacia = primera.every(function (v) { return String(v).trim() === ''; });
  if (!vacia) return false;
  sheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]).setFontWeight('bold');
  sheet.setFrozenRows(1);
  return true;
}

// Última fila CON DATOS dentro de las columnas del contrato, + 1.
// Nunca devuelve 1: la fila 1 es siempre la de encabezados.
function nextRow_(sheet) {
  const lastRow = sheet.getLastRow();
  if (lastRow < 1) return 2;
  const values = sheet.getRange(1, 1, lastRow, HEADERS.length).getValues();
  var ultima = 0;
  for (var i = values.length - 1; i >= 0; i--) {
    var conDatos = values[i].some(function (v) { return String(v).trim() !== ''; });
    if (conDatos) { ultima = i + 1; break; }
  }
  return Math.max(ultima + 1, 2);
}

function doPost(e) {
  const lock = LockService.getScriptLock();
  try {
    // Dos cotizaciones simultáneas no pueden calcular la misma fila y pisarse.
    lock.waitLock(20000);

    const body = JSON.parse(e.postData.contents);
    if (SECRET && body.secret !== SECRET) return json_({ ok: false, error: 'unauthorized' });

    const values = Array.isArray(body.values) ? body.values : null;
    if (!values) return json_({ ok: false, error: 'values_missing' });
    if (values.length !== HEADERS.length) {
      // Mejor rechazar que escribir las columnas corridas.
      return json_({
        ok: false, error: 'column_mismatch',
        expected: HEADERS.length, received: values.length
      });
    }

    const sheet = getSheet_();
    const headersCreados = ensureHeaders_(sheet);
    const row = nextRow_(sheet);

    const range = sheet.getRange(row, 1, 1, HEADERS.length);
    range.setNumberFormat('@');   // texto: Sheets no reinterpreta fechas ni códigos
    range.setValues([values]);
    SpreadsheetApp.flush();

    return json_({ ok: true, row: row, sheet: SHEET_NAME, headersCreados: headersCreados });
  } catch (err) {
    return json_({ ok: false, error: String(err) });
  } finally {
    try { lock.releaseLock(); } catch (ignorado) {}
  }
}

// Chequeo de salud y diagnóstico.
// Con ?secret=... devuelve JSON con la próxima fila; sin secret, solo "OK".
function doGet(e) {
  if (!SECRET || (e && e.parameter && e.parameter.secret === SECRET)) {
    const sheet = getSheet_();
    return json_({
      ok: true, sheet: SHEET_NAME,
      columnas: HEADERS.length, proximaFila: nextRow_(sheet)
    });
  }
  return ContentService.createTextOutput('OK - script activo')
    .setMimeType(ContentService.MimeType.TEXT);
}
```

### 3. Desplegar como Web App

1. Botón **Implementar → Nueva implementación**.
2. Tipo: **Aplicación web**.
3. **Ejecutar como:** Yo (tu cuenta).
4. **Quién tiene acceso:** Cualquier usuario.
5. **Implementar** → autoriza los permisos que pida Google.
6. Copia la **URL de la aplicación web** (termina en `/exec`).

> Cada vez que edites el script, usa **Implementar → Gestionar implementaciones → editar →
> Versión: Nueva versión** para que los cambios tomen efecto (la URL se mantiene).
> Si te saltas este paso, sigue corriendo la versión anterior y todo "funciona" pero sin
> los cambios.

### 4. Configurar variables de entorno

En **Vercel** (Project → Settings → Environment Variables) para producción, y en
`.env.local` para desarrollo:

```
SHEETS_WEBHOOK_URL=https://script.google.com/macros/s/XXXXXXXX/exec
SHEETS_WEBHOOK_SECRET=PON_AQUI_UN_SECRETO
```

Tras agregarlas en Vercel, hacer **Redeploy**. Sin `SHEETS_WEBHOOK_URL` el registro es
no-op (el sitio funciona igual, solo no escribe en la planilla).

**Orden importante:** haz primero los pasos en Google (pestaña `Cotizaciones`, `J1`, nueva
versión del script) y después despliega el código. Al revés, el script responde
`column_mismatch` y no escribe nada — es un fallo seguro y ruidoso, no corrupción de datos.

## Verificación

```bash
# Diagnóstico: debe devolver JSON con la próxima fila
curl -s "$SHEETS_WEBHOOK_URL?secret=$SHEETS_WEBHOOK_SECRET"
# → {"ok":true,"sheet":"Cotizaciones","columnas":10,"proximaFila":7}
```

Anota `proximaFila`, envía una cotización desde el sitio y vuelve a consultar: debe haber
subido exactamente en 1. En los logs del servidor aparece
`Sheets: cotizacion registrada en la fila N de "Cotizaciones"`.

Si el `curl` devuelve HTML en vez de JSON, la versión publicada es la antigua o el
despliegue no está como "cualquier usuario".

## Comportamiento

- **Apps Script siempre responde HTTP 200** (y a menudo redirige a `googleusercontent.com`).
  El estado real está en el body JSON (`ok`). Por eso `lib/sheets.js` parsea el body y no
  confía en `res.ok`: antes, un secreto mal configurado se reportaba como éxito.
- El registro corre **en paralelo** con el email (`Promise.allSettled`). El status HTTP que
  ve el cliente lo decide solo el email, pero si Resend falla la cotización **igual queda
  registrada** en la planilla.
- **Duplicados:** si el email falla, el usuario ve error y puede reintentar, generando una
  segunda fila. Se reconocen porque tienen los mismos datos con N° de cotización distinto;
  el log del servidor deja constancia (`Email FALLIDO pero la cotizacion #N quedó en la
  planilla, fila M`).
- Un fallo de la planilla nunca rompe el envío: `appendQuoteToSheet` no lanza y el error
  queda en los logs.
- Timeout de 8 s hacia el Web App para no colgar la respuesta al cliente.
