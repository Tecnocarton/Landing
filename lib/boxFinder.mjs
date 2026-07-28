/**
 * Algoritmo de sugerencia de cajas de stock.
 *
 * Funciones puras, sin dependencias ni imports, para que puedan testearse
 * directamente con `node --test`. Reciben el catálogo de cajas por parámetro.
 *
 * Convención de dimensiones: objetos con { largo, ancho, alto } en cm.
 * Una caja "calza" un producto si éste cabe en ALGUNA orientación (se permite
 * rotar el producto). Las medidas de las cajas se tratan como internas útiles.
 */

/** Devuelve [largo, ancho, alto] de un objeto con esas propiedades. */
function toTriple({ largo, ancho, alto }) {
  return [Number(largo), Number(ancho), Number(alto)];
}

/** Las 6 permutaciones (orientaciones) de un triple [a, b, c]. */
function orientations([a, b, c]) {
  return [
    [a, b, c], [a, c, b],
    [b, a, c], [b, c, a],
    [c, a, b], [c, b, a],
  ];
}

/** true si todas las dimensiones son números finitos y > 0. */
function isValidTriple([a, b, c]) {
  return [a, b, c].every((n) => Number.isFinite(n) && n > 0);
}

/**
 * ¿El producto cabe en la caja en alguna orientación?
 * Test clásico de calce con rotación: ordenar ambos de mayor a menor y comparar
 * componente a componente.
 */
export function fitsInBox(prod, box) {
  const p = toTriple(prod);
  const b = toTriple(box);
  if (!isValidTriple(p) || !isValidTriple(b)) return false;
  const ps = [...p].sort((x, y) => y - x);
  const bs = [...b].sort((x, y) => y - x);
  return ps[0] <= bs[0] && ps[1] <= bs[1] && ps[2] <= bs[2];
}

/**
 * Máximo de unidades del producto que caben en la caja, empaquetadas en grilla
 * (axis-aligned), probando las 6 orientaciones del producto. Heurística sin
 * orientaciones mixtas: estimación conservadora, suficiente para orientar.
 */
export function unitsPerBox(prod, box) {
  const p = toTriple(prod);
  const [boxL, boxW, boxH] = toTriple(box);
  if (!isValidTriple(p) || !isValidTriple([boxL, boxW, boxH])) return 0;

  let best = 0;
  for (const [pl, pw, ph] of orientations(p)) {
    const count =
      Math.floor(boxL / pl) * Math.floor(boxW / pw) * Math.floor(boxH / ph);
    if (count > best) best = count;
  }
  return best;
}

function volume(triple) {
  const [a, b, c] = toTriple(triple);
  return a * b * c;
}

/**
 * Recomienda cajas de stock para un producto y una cantidad.
 *
 * @param {{largo:number,ancho:number,alto:number}} prod - dimensiones del producto (cm)
 * @param {number} quantity - cantidad de productos a encajar
 * @param {Array<{code:string,largo:number,ancho:number,alto:number}>} boxes - catálogo de stock
 * @param {{mode?: 'multi'|'single', topN?: number}} [opts]
 * @returns {{fits: boolean, options: Array<{box:object, unitsPerBox:number, boxesNeeded:number, efficiency:number}>}}
 *
 * - mode 'multi' (default): calcula cuántas unidades caben por caja y cuántas
 *   cajas se necesitan. Ordena por menos cajas necesarias, desempata por mayor
 *   aprovechamiento.
 * - mode 'single': una unidad por caja. Ordena por la caja más ajustada (menor
 *   volumen que aún calza el producto).
 */
export function recommendBoxes(prod, quantity, boxes, opts = {}) {
  const { mode = 'multi', topN = 3 } = opts;
  const p = toTriple(prod);
  if (!isValidTriple(p)) return { fits: false, options: [] };

  const qty = Math.max(1, Math.floor(Number(quantity) || 0));
  // volume() espera un objeto {largo,ancho,alto}; usar `prod`, no el triple `p`.
  const volProd = volume(prod);

  let options;
  if (mode === 'single') {
    options = boxes
      .filter((box) => fitsInBox(prod, box))
      .map((box) => {
        const volBox = volume(box);
        return {
          box,
          unitsPerBox: 1,
          boxesNeeded: qty,
          efficiency: volProd / volBox,
        };
      })
      .sort((a, b) => volume(a.box) - volume(b.box));
  } else {
    options = boxes
      .map((box) => {
        const upb = unitsPerBox(prod, box);
        if (upb < 1) return null;
        const volBox = volume(box);
        return {
          box,
          unitsPerBox: upb,
          boxesNeeded: Math.ceil(qty / upb),
          efficiency: (upb * volProd) / volBox,
        };
      })
      .filter(Boolean)
      .sort((a, b) =>
        a.boxesNeeded !== b.boxesNeeded
          ? a.boxesNeeded - b.boxesNeeded
          : b.efficiency - a.efficiency
      );
  }

  return { fits: options.length > 0, options: options.slice(0, topN) };
}
