/**
 * Construcción de la fila que se escribe en la planilla de cotizaciones.
 *
 * Vive aparte de app/api/contact/route.js para poder testear el contrato de
 * columnas con `node --test lib/*.test.mjs`: el orden y la cantidad de columnas
 * son un acuerdo con el Apps Script (docs/google-sheets-cotizaciones.md) y un
 * desalineo silencioso corrompe la planilla entera.
 *
 * Módulo PURO: sin React, sin config, sin fetch.
 */

/** Encabezados de la planilla, en orden. La fila 1 los contiene. */
export const SHEET_COLUMNS = [
  'Fecha',
  'Producto Solicitado',
  'Cantidad',
  'Tipo de carton',
  'Onda',
  'Detalles adicionales',
  'Empresa/Nombre',
  'Email',
  'Telefono',
  'N° cotización',
];

/**
 * Fecha ordenable en zona horaria de Santiago: "2026-07-27 14:03:11".
 *
 * Se usa el locale 'sv-SE' porque produce ISO (aaaa-mm-dd hh:mm:ss). El formato
 * anterior ('es-CL' → "27-07-2026, 14:03:11") no es ordenable como texto y
 * Sheets puede interpretarlo como mm-dd según la configuración de la planilla.
 *
 * @param {Date} [date]
 * @returns {string}
 */
export function formatFechaSantiago(date = new Date()) {
  return new Intl.DateTimeFormat('sv-SE', {
    timeZone: 'America/Santiago',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  })
    .format(date)
    .replace(',', '');
}

const texto = (v) => (v === null || v === undefined ? '' : String(v));
const lista = (v) => (Array.isArray(v) ? v.filter(Boolean).join(', ') : '');

/**
 * Info que no tiene columna propia y se pliega en "Detalles adicionales".
 * Incluye a propósito `unidades por caja` y el modo de empaque, que antes
 * salían solo en el email y se perdían en la planilla.
 */
function detallesAdicionales(data) {
  const extras = [];

  if (data.producto === 'cajas' && data.cajaStock) {
    extras.push(`Caja stock sugerida: ${texto(data.cajaStock)}`);
    if (data.cajaDimsProducto) {
      const unidades = data.cajaCantidadProductos ? ` (${texto(data.cajaCantidadProductos)} u.)` : '';
      extras.push(`Producto: ${texto(data.cajaDimsProducto)}${unidades}`);
    }
    if (data.cajaUnidadesPorCaja) extras.push(`Unidades por caja: ${texto(data.cajaUnidadesPorCaja)}`);
    if (data.empaqueModo) {
      const modo = data.empaqueModo === 'single' ? '1 producto por caja' : 'varios productos por caja';
      extras.push(`Empaque: ${modo}`);
    }
    if (data.cajaCantidadCajas) extras.push(`Cajas estimadas: ${texto(data.cajaCantidadCajas)}`);
  }

  if (data.producto === 'rollos' && Array.isArray(data.formatosRollo) && data.formatosRollo.length) {
    extras.push(`Formatos de rollo: ${data.formatosRollo.filter(Boolean).map((f) => `${f} kg`).join(', ')}`);
  }

  return [texto(data.detalle), ...extras].filter(Boolean).join(' | ');
}

/**
 * Arma la fila del Sheet. SIEMPRE devuelve SHEET_COLUMNS.length elementos y
 * nunca `undefined` (el Apps Script rechaza el POST si el largo no calza).
 *
 * @param {Object} data Estado saneado del formulario.
 * @param {Object} [options]
 * @param {string} [options.productName] Nombre visible del producto.
 * @param {string|number} [options.quoteNumber] Correlativo de la cotización.
 * @param {Date} [options.date] Inyectable para testear.
 * @returns {string[]}
 */
export function buildSheetRow(data = {}, options = {}) {
  const { productName, quoteNumber, date } = options;

  return [
    formatFechaSantiago(date),
    texto(productName || data.producto),
    texto(data.cantidad),
    lista(data.tiposCarton),
    lista(data.ondas),
    detallesAdicionales(data),
    texto(data.empresa),
    texto(data.email),
    texto(data.telefono),
    texto(quoteNumber),
  ];
}
