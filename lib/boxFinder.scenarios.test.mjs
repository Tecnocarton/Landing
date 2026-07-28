/**
 * Escenarios realistas y casos límite para la sugerencia de cajas (BETA).
 * Complementa boxFinder.test.mjs. Usa el catálogo real de config/stockBoxes.js.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { fitsInBox, unitsPerBox, recommendBoxes } from './boxFinder.mjs';
import { stockBoxes as boxes } from '../config/stockBoxes.js';

const ceil = Math.ceil;

// Invariantes que TODA recomendación multi debe cumplir, para cualquier entrada válida.
function assertMultiInvariants(prod, qty, { fits, options }) {
  assert.ok(options.length <= 3, 'topN por defecto = 3');
  if (options.length > 0) assert.equal(fits, true);
  let prevBoxes = -Infinity;
  for (const o of options) {
    assert.ok(o.unitsPerBox >= 1, 'cada caja sugerida acomoda al menos 1 unidad');
    assert.equal(o.boxesNeeded, ceil(qty / o.unitsPerBox), 'boxesNeeded = ceil(qty / u.p.caja)');
    assert.ok(o.efficiency > 0 && o.efficiency <= 1.0000001, 'aprovechamiento en (0, 1]');
    assert.ok(fitsInBox(prod, o.box), 'la caja sugerida realmente calza el producto');
    assert.ok(o.boxesNeeded >= prevBoxes, 'ordenado por menos cajas necesarias');
    prevBoxes = o.boxesNeeded;
  }
}

test('escenario e-commerce: parcela 22x15x10, 300 u — invariantes multi', () => {
  const prod = { largo: 22, ancho: 15, alto: 10 };
  const res = recommendBoxes(prod, 300, boxes, { mode: 'multi' });
  assert.equal(res.fits, true);
  assertMultiInvariants(prod, 300, res);
});

test('escenario libro/caja plana: 25x18x3, 1000 u — invariantes multi', () => {
  const prod = { largo: 25, ancho: 18, alto: 3 };
  const res = recommendBoxes(prod, 1000, boxes, { mode: 'multi' });
  assert.equal(res.fits, true);
  assertMultiInvariants(prod, 1000, res);
});

test('multi con cantidad chica: cubo 10x10x10 x20 → gana la caja de mayor capacidad (menos cajas)', () => {
  // Documenta el comportamiento del heurístico: prioriza MENOS cajas.
  // Varias cajas caben en 1 sola; el desempate por aprovechamiento teórico (100%)
  // deja primero, por orden de catálogo, a 12C40x30x30 (36 u/caja).
  const { options } = recommendBoxes({ largo: 10, ancho: 10, alto: 10 }, 20, boxes, { mode: 'multi' });
  assert.equal(options[0].box.code, '12C40x30x30');
  assert.equal(options[0].unitsPerBox, 36);
  assert.equal(options[0].boxesNeeded, 1);
});

test('single: producto 28x18x18 → caja más ajustada 12C30x20x20 y 1 caja por unidad', () => {
  const { fits, options } = recommendBoxes({ largo: 28, ancho: 18, alto: 18 }, 250, boxes, { mode: 'single' });
  assert.equal(fits, true);
  assert.equal(options[0].box.code, '12C30x20x20');
  assert.equal(options[0].unitsPerBox, 1);
  assert.equal(options[0].boxesNeeded, 250);
  // single ordena por volumen de caja ascendente (más ajustada primero)
  const vols = options.map((o) => o.box.largo * o.box.ancho * o.box.alto);
  assert.deepEqual(vols, [...vols].sort((a, b) => a - b));
});

test('cantidad = 1: boxesNeeded = 1 en ambos modos', () => {
  const prod = { largo: 15, ancho: 12, alto: 8 };
  assert.equal(recommendBoxes(prod, 1, boxes, { mode: 'multi' }).options[0].boxesNeeded, 1);
  assert.equal(recommendBoxes(prod, 1, boxes, { mode: 'single' }).options[0].boxesNeeded, 1);
});

test('producto que calza EXACTO en la caja más grande (60x40x30) → fits y 1 u/caja', () => {
  const prod = { largo: 60, ancho: 40, alto: 30 };
  const { fits, options } = recommendBoxes(prod, 10, boxes, { mode: 'multi' });
  assert.equal(fits, true);
  const exacta = options.find((o) => o.box.code === '12C60x40x30');
  assert.ok(exacta, 'la caja exacta aparece entre las opciones');
  assert.equal(exacta.unitsPerBox, 1);
  assert.equal(Math.round(exacta.efficiency * 100), 100);
});

test('producto excede toda caja por un lado (61 cm) → fits=false', () => {
  const { fits, options } = recommendBoxes({ largo: 61, ancho: 10, alto: 10 }, 100, boxes, { mode: 'multi' });
  assert.equal(fits, false);
  assert.equal(options.length, 0);
});

test('cantidad inválida (0/NaN) se normaliza a 1, no rompe', () => {
  const prod = { largo: 15, ancho: 12, alto: 8 };
  assert.equal(recommendBoxes(prod, 0, boxes, { mode: 'multi' }).options[0].boxesNeeded, 1);
  assert.equal(recommendBoxes(prod, NaN, boxes, { mode: 'multi' }).options[0].boxesNeeded, 1);
});

test('rotación: producto alto y angosto 8x8x28 calza en 30x20x20 (rotado)', () => {
  assert.equal(fitsInBox({ largo: 8, ancho: 8, alto: 28 }, boxes[0]), true);
  assert.ok(unitsPerBox({ largo: 8, ancho: 8, alto: 28 }, boxes[0]) >= 1);
});
