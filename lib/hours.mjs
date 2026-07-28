/**
 * Horario de atención: una sola fuente (siteConfig.hours) para el sitio,
 * el catálogo y el JSON-LD.
 *
 * Antes estaba escrito a mano en tres lugares (catálogo, cotizador y schema.org),
 * así que cambiar el horario obligaba a acordarse de los tres.
 *
 * Módulo PURO para poder testearlo con `node --test lib/*.test.mjs`.
 */

/**
 * Texto legible por tramo: ["Lunes a jueves 08:00–17:30", "Viernes 08:00–14:30"].
 * Usa guion medio (–) porque es un rango, no un menos.
 *
 * @param {Object} hours
 * @param {string} [sep] Separador entre las horas.
 * @returns {string[]}
 */
export function formatHours(hours = {}, sep = '–') {
  return Object.values(hours).map((tramo) => `${tramo.label} ${tramo.opens}${sep}${tramo.closes}`);
}

/**
 * Array `openingHoursSpecification` de schema.org.
 * @param {Object} hours
 * @returns {Array<Object>}
 */
export function openingHoursSpecification(hours = {}) {
  return Object.values(hours).map((tramo) => ({
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: tramo.days,
    opens: tramo.opens,
    closes: tramo.closes,
  }));
}
