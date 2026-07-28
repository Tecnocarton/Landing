/**
 * Validación del paso de especificaciones del cotizador.
 *
 * Vive en lib/ y sin dependencias de React para poder testearla directamente
 * con `node --test`, igual que boxFinder.mjs, specs.mjs y whatsapp.mjs.
 * La consume components/sections/QuoteWizard.jsx.
 */

// Mínimo de caracteres para dar el detalle por completo: obliga a escribir algo
// útil (medidas, impresión) y no solo un "-" para saltarse el campo.
export const DETALLE_MIN_LENGTH = 10;

/**
 * Valida el paso de especificaciones completo. El usuario debe entregar TODA la
 * información técnica antes de pasar a contacto: sin esto llegaban cotizaciones
 * con solo el rango de cantidad y había que pedir el resto por correo.
 *
 * @param {Object} data Estado del formulario (shape de EMPTY_FORM en QuoteWizard).
 * @returns {Object} Errores por campo; objeto vacío si el paso está completo.
 */
export function validateSpecs(data = {}) {
  const errors = {};
  const tiposCarton = data.tiposCarton || [];
  const ondas = data.ondas || [];
  const formatosRollo = data.formatosRollo || [];
  const detalle = data.detalle || '';

  if (!data.cantidad) {
    errors.cantidad = 'Selecciona un rango de cantidad';
  }

  if (data.producto === 'planchas' || data.producto === 'cajas') {
    if (tiposCarton.length === 0) {
      errors.tiposCarton = 'Selecciona al menos un tipo de cartón';
    }
    if (ondas.length === 0) {
      errors.ondas = 'Selecciona al menos una onda';
    }
  }

  if (data.producto === 'rollos' && formatosRollo.length === 0) {
    errors.formatosRollo = 'Selecciona al menos un formato de rollo';
  }

  // El detalle es donde vienen las medidas. Se exceptúa la caja de stock elegida
  // en el asistente: ahí las dimensiones ya quedaron registradas en el código.
  if (!data.cajaStock && detalle.trim().length < DETALLE_MIN_LENGTH) {
    errors.detalle =
      data.producto === 'cajas'
        ? 'Indica las dimensiones internas (largo × ancho × alto) y demás detalles'
        : 'Cuéntanos las medidas y especificaciones que necesitas';
  }

  return errors;
}
