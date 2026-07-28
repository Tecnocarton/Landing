/**
 * Ensamblado y formateo de la especificación técnica del cartón.
 *
 * REGLA DE NEGOCIO: el gramaje es SOLO el número (12, 14, 17, 20) — es el peso
 * del papel por m² y manda en cuánta carga aguanta el cartón. La onda es la
 * letra (C, B, E) — es el perfil del corrugado interior y manda en el espesor,
 * la rigidez y la superficie de impresión. Son dos ejes distintos y NUNCA se
 * concatenan en el copy público ("12C" no es un gramaje).
 *
 * Única excepción: los códigos de caja de stock (`12C30x20x20`) son SKU —
 * gramaje + onda + medidas internas. Viven en config/stockBoxes.js y no siguen
 * esta regla a propósito.
 *
 * Módulo PURO (sin React ni imports de config) para poder testearlo con
 * `node --test lib/*.test.mjs`, igual que lib/boxFinder.mjs y lib/whatsapp.mjs.
 */

/**
 * Adjunta la resistencia a cada gramaje.
 *
 * Lanza si alguna clave no calza en vez de degradar a "Consultar": un desalineo
 * entre `cardboardTypes` (config/site.js) y `resistenciaPorGramaje`
 * (config/productos.js) debe romper el build, no vaciar la tabla en silencio.
 *
 * @param {Array<{gramaje: string, weight?: string, use?: string}>} tipos
 * @param {Record<string, string>} resistencias
 * @returns {Array<Object>}
 */
export function buildGramajes(tipos = [], resistencias = {}) {
  const faltantes = tipos.filter((t) => !resistencias[t.gramaje]).map((t) => t.gramaje);
  if (faltantes.length) {
    throw new Error(
      `lib/specs: falta la resistencia para el/los gramaje(s) ${faltantes.join(', ')}. ` +
        'Revisa que las claves de resistenciaPorGramaje (config/productos.js) coincidan ' +
        'con cardboardTypes[].gramaje (config/site.js). Recuerda: el gramaje va sin la letra de onda.'
    );
  }
  return tipos.map((t) => ({ ...t, resistencia: resistencias[t.gramaje] }));
}

/** "12 · 14 · 17 · 20" — nunca con la letra de onda pegada. */
export function formatGramajes(gramajes = [], sep = ' · ') {
  return gramajes.map((g) => g.gramaje).join(sep);
}

/** "C · B · E" */
export function formatOndas(ondas = [], sep = ' · ') {
  return ondas.map((o) => o.onda).join(sep);
}
