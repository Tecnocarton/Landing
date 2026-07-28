import { test } from 'node:test';
import assert from 'node:assert/strict';
import { fitsInBox, unitsPerBox, recommendBoxes } from './boxFinder.mjs';

// Fixture: mismo catálogo que config/stockBoxes.js (medidas internas en cm).
const boxes = [
  { code: '12C30x20x20', largo: 30, ancho: 20, alto: 20 },
  { code: '12C30x23x17', largo: 30, ancho: 23, alto: 17 },
  { code: '12C30x23x29', largo: 30, ancho: 23, alto: 29 },
  { code: '12C40x30x30', largo: 40, ancho: 30, alto: 30 },
  { code: '12C45x30x30', largo: 45, ancho: 30, alto: 30 },
  { code: '12C50x30x30', largo: 50, ancho: 30, alto: 30 },
  { code: '12C50x39x39', largo: 50, ancho: 39, alto: 39 },
  { code: '12C50x40x30', largo: 50, ancho: 40, alto: 30 },
  { code: '12C60x39x39', largo: 60, ancho: 39, alto: 39 },
  { code: '12C60x40x30', largo: 60, ancho: 40, alto: 30 },
];

const box30 = boxes[0]; // 12C30x20x20

test('fitsInBox: calza permitiendo rotación del producto', () => {
  // 17x30x20 es 30x20x17 reordenado → cabe en 30x20x20
  assert.equal(fitsInBox({ largo: 17, ancho: 30, alto: 20 }, box30), true);
});

test('fitsInBox: no calza si una dimensión excede la caja', () => {
  assert.equal(fitsInBox({ largo: 31, ancho: 10, alto: 10 }, box30), false);
});

test('unitsPerBox: cubo 10x10x10 en 30x20x20 → 12 unidades', () => {
  assert.equal(unitsPerBox({ largo: 10, ancho: 10, alto: 10 }, box30), 12);
});

test('unitsPerBox: 0 si el producto no cabe', () => {
  assert.equal(unitsPerBox({ largo: 70, ancho: 50, alto: 50 }, box30), 0);
});

test('recommendBoxes multi: 10x10x10 x1000 → menos cajas = 12C60x40x30 (72 u/caja, 14 cajas)', () => {
  const { fits, options } = recommendBoxes(
    { largo: 10, ancho: 10, alto: 10 },
    1000,
    boxes,
    { mode: 'multi' }
  );
  assert.equal(fits, true);
  assert.equal(options.length, 3);
  assert.equal(options[0].box.code, '12C60x40x30');
  assert.equal(options[0].unitsPerBox, 72);
  assert.equal(options[0].boxesNeeded, 14);
  // Ranking por menos cajas necesarias
  assert.deepEqual(
    options.map((o) => o.boxesNeeded),
    [14, 17, 19]
  );
});

test('recommendBoxes single: 28x18x18 → caja más ajustada = 12C30x20x20, cajas = cantidad', () => {
  const { fits, options } = recommendBoxes(
    { largo: 28, ancho: 18, alto: 18 },
    500,
    boxes,
    { mode: 'single' }
  );
  assert.equal(fits, true);
  assert.equal(options[0].box.code, '12C30x20x20');
  assert.equal(options[0].unitsPerBox, 1);
  assert.equal(options[0].boxesNeeded, 500);
});

test('recommendBoxes: producto más grande que toda caja → fits=false', () => {
  const { fits, options } = recommendBoxes(
    { largo: 70, ancho: 50, alto: 50 },
    100,
    boxes,
    { mode: 'multi' }
  );
  assert.equal(fits, false);
  assert.equal(options.length, 0);
});

test('recommendBoxes: dimensiones inválidas → fits=false', () => {
  const { fits } = recommendBoxes({ largo: 0, ancho: 10, alto: 10 }, 100, boxes);
  assert.equal(fits, false);
});
