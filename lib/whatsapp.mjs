/**
 * Construcción de mensajes de WhatsApp pre-llenados (F3.1).
 *
 * Serializa el estado del cotizador (QuoteWizard) o del asistente de cajas
 * (BoxFinder) a un texto legible que el vendedor puede leer de un vistazo,
 * y arma la URL wa.me correspondiente.
 *
 * Módulo PURO a propósito (sin imports de config ni de React): así puede
 * testearse con `node --test lib/*.test.mjs`, igual que lib/boxFinder.mjs.
 * El número y los nombres de producto los inyecta quien lo llama.
 */

// WhatsApp acepta URLs largas, pero mensajes muy extensos se truncan o fallan
// en algunos clientes móviles. Mantenemos el texto bajo este límite.
export const MAX_WHATSAPP_MESSAGE = 1500;

const SALUDO = 'Hola Tecnocarton, quiero cotizar:';

/**
 * Deja solo los dígitos del número (wa.me no acepta +, espacios ni guiones).
 * @param {string} phone
 * @returns {string}
 */
export function normalizePhone(phone) {
  return typeof phone === 'string' ? phone.replace(/\D/g, '') : '';
}

/**
 * ¿Hay un número de WhatsApp utilizable? Misma regla que buildWhatsAppUrl,
 * para que los textos auxiliares aparezcan exactamente cuando aparece el botón.
 * @param {string} phone
 * @returns {boolean}
 */
export function hasWhatsApp(phone) {
  return normalizePhone(phone).length > 0;
}

/** Recorta un texto agregando elipsis, sin cortar a mitad de palabra si se puede. */
function clamp(text, max) {
  if (text.length <= max) return text;
  const cut = text.slice(0, max - 1);
  const lastSpace = cut.lastIndexOf(' ');
  return `${(lastSpace > max * 0.6 ? cut.slice(0, lastSpace) : cut).trimEnd()}…`;
}

/** Normaliza espacios y saltos de línea de un valor libre del formulario. */
function clean(value) {
  if (value === null || value === undefined) return '';
  return String(value).replace(/\s+/g, ' ').trim();
}

/**
 * Detalle de la caja de stock elegida en el BoxFinder, si existe.
 * Ej: "12C40x30x30 (producto 30×20×15 cm · 12 u/caja · 84 cajas)"
 */
function lineaCajaStock(data) {
  if (!data.cajaStock) return '';
  const partes = [];
  if (data.cajaDimsProducto) partes.push(`producto ${clean(data.cajaDimsProducto)}`);
  // En modo "1 producto por caja" el dato de unidades por caja no aporta.
  if (data.empaqueModo !== 'single' && data.cajaUnidadesPorCaja) {
    partes.push(`${clean(data.cajaUnidadesPorCaja)} u/caja`);
  }
  if (data.cajaCantidadCajas) partes.push(`${clean(data.cajaCantidadCajas)} cajas`);
  return partes.length
    ? `${clean(data.cajaStock)} (${partes.join(' · ')})`
    : clean(data.cajaStock);
}

/**
 * Serializa el estado del cotizador a un mensaje legible.
 *
 * @param {Object} data Estado del formulario (shape de QuoteWizard).
 * @param {Object} [options]
 * @param {string} [options.productoNombre] Nombre visible del producto (ej: "Cajas a medida").
 *   Si no se entrega se usa el id crudo de `data.producto`.
 * @param {string} [options.quoteNumber] N° de cotización ya emitido (pantalla de éxito).
 * @param {number} [options.maxLength] Largo máximo del mensaje.
 * @returns {string}
 */
export function buildQuoteMessage(data = {}, options = {}) {
  const { productoNombre, quoteNumber, maxLength = MAX_WHATSAPP_MESSAGE } = options;

  const producto = clean(productoNombre || data.producto);
  const tipos = Array.isArray(data.tiposCarton) ? data.tiposCarton.filter(Boolean) : [];
  const ondas = Array.isArray(data.ondas) ? data.ondas.filter(Boolean) : [];
  const rollos = Array.isArray(data.formatosRollo) ? data.formatosRollo.filter(Boolean) : [];
  const cajaStock = lineaCajaStock(data);

  // Cada línea es [etiqueta, valor]; las vacías se descartan.
  const campos = [
    ['Producto', producto],
    ['Cantidad', clean(data.cantidad)],
    ['Tipo de cartón', tipos.join(', ')],
    ['Onda', ondas.join(', ')],
    ['Formatos de rollo', rollos.length ? `${rollos.join(', ')} kg` : ''],
    ['Caja de stock', cajaStock],
  ].filter(([, valor]) => valor);

  const contacto = [clean(data.empresa), clean(data.email), clean(data.telefono)].filter(Boolean);

  const bloques = [SALUDO];
  if (campos.length) bloques.push(campos.map(([k, v]) => `• ${k}: ${v}`).join('\n'));
  if (contacto.length) bloques.push(`Contacto: ${contacto.join(' · ')}`);
  if (quoteNumber) bloques.push(`N° de cotización: ${clean(quoteNumber)}`);

  const detalle = clean(data.detalle);
  if (detalle) {
    // El detalle es el único campo de largo libre: se recorta para que el
    // resto del mensaje (siempre relevante) nunca se pierda por el límite.
    const sinDetalle = bloques.join('\n\n');
    const disponible = maxLength - sinDetalle.length - '\n\nDetalles: '.length;
    if (disponible > 24) {
      bloques.splice(campos.length ? 2 : 1, 0, `Detalles: ${clamp(detalle, disponible)}`);
    }
  }

  return clamp(bloques.join('\n\n'), maxLength);
}

/**
 * Arma la URL de WhatsApp con el mensaje pre-llenado.
 * Devuelve null si no hay número configurado, para que la UI pueda ocultarse
 * (mismo patrón que components/WhatsAppButton.jsx).
 *
 * @param {string} phone Número comercial (con o sin formato).
 * @param {string} message Texto ya construido.
 * @returns {string|null}
 */
export function buildWhatsAppUrl(phone, message) {
  const numero = normalizePhone(phone);
  if (!numero) return null;
  // encodeURIComponent convierte los \n en %0A, que es lo que espera wa.me.
  return `https://wa.me/${numero}?text=${encodeURIComponent(
    clamp(String(message ?? ''), MAX_WHATSAPP_MESSAGE)
  )}`;
}

/**
 * Atajo: mensaje del cotizador + URL en un solo paso.
 * @returns {string|null}
 */
export function buildQuoteWhatsAppUrl(phone, data, options) {
  return buildWhatsAppUrl(phone, buildQuoteMessage(data, options));
}
