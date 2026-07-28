import test from 'node:test';
import assert from 'node:assert/strict';

import { validateSpecs, DETALLE_MIN_LENGTH } from './quoteSpecs.mjs';

// Especificaciones completas de referencia para cada producto.
const cajasCompleto = {
  producto: 'cajas',
  cantidad: '1.000 a 5.000 unidades',
  tiposCarton: ['12'],
  ondas: ['C'],
  formatosRollo: [],
  detalle: 'Caja 30x20x15 cm interior, impresión 2 caras',
  cajaStock: '',
};

const planchasCompleto = {
  producto: 'planchas',
  cantidad: '500 a 1.000 unidades',
  tiposCarton: ['14', '17'],
  ondas: ['C'],
  formatosRollo: [],
  detalle: 'Ancho 1200 x largo 2000 mm',
  cajaStock: '',
};

const rollosCompleto = {
  producto: 'rollos',
  cantidad: '500 a 1.000 kg',
  tiposCarton: [],
  ondas: [],
  formatosRollo: ['20'],
  detalle: 'Alto 1.2 m, para embalaje de muebles',
  cajaStock: '',
};

test('un paso de especificaciones completo no arroja errores', () => {
  for (const data of [cajasCompleto, planchasCompleto, rollosCompleto]) {
    assert.deepEqual(validateSpecs(data), {}, `falló para ${data.producto}`);
  }
});

test('la cantidad es obligatoria en todos los productos', () => {
  for (const data of [cajasCompleto, planchasCompleto, rollosCompleto]) {
    const errors = validateSpecs({ ...data, cantidad: '' });
    assert.ok(errors.cantidad, `falló para ${data.producto}`);
  }
});

test('cajas y planchas exigen tipo de cartón y onda', () => {
  for (const data of [cajasCompleto, planchasCompleto]) {
    const errors = validateSpecs({ ...data, tiposCarton: [], ondas: [] });
    assert.ok(errors.tiposCarton);
    assert.ok(errors.ondas);
  }
});

test('rollos exige al menos un formato y no pide tipo de cartón ni onda', () => {
  const errors = validateSpecs({ ...rollosCompleto, formatosRollo: [] });
  assert.ok(errors.formatosRollo);
  assert.equal(errors.tiposCarton, undefined);
  assert.equal(errors.ondas, undefined);
});

test('el detalle es obligatorio y no se satisface con un relleno mínimo', () => {
  assert.ok(validateSpecs({ ...cajasCompleto, detalle: '' }).detalle);
  assert.ok(validateSpecs({ ...cajasCompleto, detalle: '   ' }).detalle);
  assert.ok(validateSpecs({ ...cajasCompleto, detalle: '-' }).detalle);
  // Justo bajo el mínimo falla; justo en el mínimo pasa.
  assert.ok(validateSpecs({ ...cajasCompleto, detalle: 'a'.repeat(DETALLE_MIN_LENGTH - 1) }).detalle);
  assert.equal(
    validateSpecs({ ...cajasCompleto, detalle: 'a'.repeat(DETALLE_MIN_LENGTH) }).detalle,
    undefined,
  );
});

test('la caja de stock del asistente exime del detalle: las medidas ya van en el código', () => {
  const desdeBoxFinder = {
    producto: 'cajas',
    cantidad: '120 cajas',
    tiposCarton: ['12'],
    ondas: ['C'],
    formatosRollo: [],
    detalle: '',
    cajaStock: '12C30x20x20',
  };
  assert.deepEqual(validateSpecs(desdeBoxFinder), {});
});

test('un formulario vacío acumula todos los errores del producto', () => {
  const errors = validateSpecs({
    producto: 'cajas',
    cantidad: '',
    tiposCarton: [],
    ondas: [],
    formatosRollo: [],
    detalle: '',
    cajaStock: '',
  });
  assert.deepEqual(Object.keys(errors).sort(), ['cantidad', 'detalle', 'ondas', 'tiposCarton']);
});

test('tolera un objeto incompleto sin reventar (defensa ante estados parciales)', () => {
  assert.doesNotThrow(() => validateSpecs({}));
  assert.doesNotThrow(() => validateSpecs());
});
