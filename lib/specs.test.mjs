import test from 'node:test';
import assert from 'node:assert/strict';
import { buildGramajes, formatGramajes, formatOndas } from './specs.mjs';

const TIPOS = [
  { gramaje: '12', weight: '~420 gr/m²', use: 'Productos ligeros' },
  { gramaje: '14', weight: '~450 gr/m²', use: 'Uso medio' },
  { gramaje: '17', weight: '~480 gr/m²', use: 'Uso general' },
  { gramaje: '20', weight: '~610 gr/m²', use: 'Cargas pesadas' },
];

const RESISTENCIAS = {
  12: 'Cargas ligeras (hasta ~10 kg)',
  14: 'Cargas medias (hasta ~20 kg)',
  17: 'Uso general (hasta ~30 kg)',
  20: 'Cargas pesadas (hasta ~50 kg)',
};

const ONDAS = [
  { onda: 'C', altura: '~4 mm' },
  { onda: 'B', altura: '~3 mm' },
  { onda: 'E', altura: '~1,5 mm' },
];

test('buildGramajes adjunta la resistencia y preserva peso y uso', () => {
  const filas = buildGramajes(TIPOS, RESISTENCIAS);
  assert.equal(filas.length, 4);
  assert.deepEqual(filas[0], {
    gramaje: '12',
    weight: '~420 gr/m²',
    use: 'Productos ligeros',
    resistencia: 'Cargas ligeras (hasta ~10 kg)',
  });
  assert.equal(filas[3].resistencia, 'Cargas pesadas (hasta ~50 kg)');
});

test('buildGramajes LANZA si una clave no calza (antes degradaba a "Consultar")', () => {
  // Este es el caso que rompía en silencio: gramaje con la letra de onda pegada.
  assert.throws(
    () => buildGramajes([{ gramaje: '12C' }], RESISTENCIAS),
    /12C/,
    'debe nombrar el gramaje que falta'
  );
  assert.throws(() => buildGramajes(TIPOS, { 12: 'x' }), /14, 17, 20/);
});

test('buildGramajes con lista vacía no lanza', () => {
  assert.deepEqual(buildGramajes([], RESISTENCIAS), []);
  assert.deepEqual(buildGramajes(), []);
});

test('formatGramajes imprime solo el número', () => {
  assert.equal(formatGramajes(TIPOS), '12 · 14 · 17 · 20');
  assert.equal(formatGramajes(TIPOS, ', '), '12, 14, 17, 20');
});

test('formatOndas imprime solo la letra', () => {
  assert.equal(formatOndas(ONDAS), 'C · B · E');
});

test('regresión de nomenclatura: ningún gramaje sale con letra de onda pegada', () => {
  assert.doesNotMatch(formatGramajes(buildGramajes(TIPOS, RESISTENCIAS)), /\d+\s*[CBE]/);
});
