import test from 'node:test';
import assert from 'node:assert/strict';
import { formatHours, openingHoursSpecification } from './hours.mjs';

const HOURS = {
  weekday: {
    label: 'Lunes a jueves',
    days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday'],
    opens: '08:00',
    closes: '17:30',
  },
  friday: { label: 'Viernes', days: ['Friday'], opens: '08:00', closes: '14:30' },
};

test('formatHours arma el texto legible en orden', () => {
  assert.deepEqual(formatHours(HOURS), ['Lunes a jueves 08:00–17:30', 'Viernes 08:00–14:30']);
  assert.deepEqual(formatHours(HOURS, ' a ')[1], 'Viernes 08:00 a 14:30');
  assert.deepEqual(formatHours(), []);
});

test('openingHoursSpecification produce el schema.org esperado', () => {
  const spec = openingHoursSpecification(HOURS);
  assert.equal(spec.length, 2);
  assert.equal(spec[0]['@type'], 'OpeningHoursSpecification');
  assert.deepEqual(spec[0].dayOfWeek, ['Monday', 'Tuesday', 'Wednesday', 'Thursday']);
  assert.equal(spec[0].opens, '08:00');
  assert.equal(spec[1].closes, '14:30');
});

test('los días son siempre un array (Google acepta ambos, pero no mezclamos formas)', () => {
  for (const tramo of openingHoursSpecification(HOURS)) {
    assert.ok(Array.isArray(tramo.dayOfWeek), 'dayOfWeek debe ser array');
  }
});
