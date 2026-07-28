import test from 'node:test';
import assert from 'node:assert/strict';
import { SHEET_COLUMNS, buildSheetRow, formatFechaSantiago } from './sheetRow.mjs';

const idx = (nombre) => SHEET_COLUMNS.indexOf(nombre);

const cajasConStock = {
  producto: 'cajas',
  cantidad: '1.000 - 3.000 unidades',
  tiposCarton: ['12', '17'],
  ondas: ['C'],
  formatosRollo: [],
  detalle: 'Impresión 2 colores',
  cajaStock: '12C40x30x30',
  cajaDimsProducto: '30×20×15 cm',
  cajaCantidadProductos: '500',
  cajaUnidadesPorCaja: '12',
  cajaCantidadCajas: '42',
  empaqueModo: 'multi',
  empresa: 'Comercial ACME',
  email: 'compras@acme.cl',
  telefono: '+56 9 1234 5678',
};

test('buildSheetRow respeta el contrato de columnas', () => {
  assert.equal(SHEET_COLUMNS.length, 10);
  assert.equal(buildSheetRow({}).length, SHEET_COLUMNS.length);
  assert.equal(buildSheetRow(cajasConStock).length, SHEET_COLUMNS.length);
  // Ningún undefined: el Apps Script escribe con setValues y un hueco descoloca la fila.
  assert.ok(buildSheetRow({}).every((v) => typeof v === 'string'));
});

test('los campos del BoxFinder que antes se perdían llegan a Detalles adicionales', () => {
  const detalles = buildSheetRow(cajasConStock)[idx('Detalles adicionales')];
  assert.match(detalles, /Caja stock sugerida: 12C40x30x30/);
  assert.match(detalles, /Producto: 30×20×15 cm \(500 u\.\)/);
  // Estos dos salían solo en el email y no llegaban a la planilla:
  assert.match(detalles, /Unidades por caja: 12/);
  assert.match(detalles, /Empaque: varios productos por caja/);
  assert.match(detalles, /Cajas estimadas: 42/);
  assert.match(detalles, /^Impresión 2 colores \|/);
});

test('el modo "1 producto por caja" se escribe legible', () => {
  const row = buildSheetRow({ ...cajasConStock, empaqueModo: 'single' });
  assert.match(row[idx('Detalles adicionales')], /Empaque: 1 producto por caja/);
});

test('rollos pliega los formatos con su unidad', () => {
  const row = buildSheetRow({
    producto: 'rollos',
    formatosRollo: ['80', '120'],
    detalle: '',
  });
  assert.equal(row[idx('Detalles adicionales')], 'Formatos de rollo: 80 kg, 120 kg');
  // Un producto que no es cajas no debe arrastrar datos del BoxFinder.
  assert.doesNotMatch(row[idx('Detalles adicionales')], /Caja stock/);
});

test('arrays vacíos se escriben como celda vacía, nunca undefined', () => {
  const row = buildSheetRow({ producto: 'rollos', tiposCarton: [], ondas: [] });
  assert.equal(row[idx('Tipo de carton')], '');
  assert.equal(row[idx('Onda')], '');
});

test('el gramaje viaja sin la letra de onda pegada', () => {
  const row = buildSheetRow(cajasConStock);
  assert.equal(row[idx('Tipo de carton')], '12, 17');
  assert.equal(row[idx('Onda')], 'C');
});

test('el N° de cotización va en la última columna', () => {
  const row = buildSheetRow(cajasConStock, { quoteNumber: 1042, productName: 'Cajas a medida' });
  assert.equal(row[SHEET_COLUMNS.length - 1], '1042');
  assert.equal(row[idx('N° cotización')], '1042');
  assert.equal(row[idx('Producto Solicitado')], 'Cajas a medida');
});

test('la fecha queda ordenable y en hora de Santiago', () => {
  // Julio es horario estándar en Chile: UTC-4.
  const fecha = formatFechaSantiago(new Date('2026-07-27T18:03:11Z'));
  assert.equal(fecha, '2026-07-27 14:03:11');
  // Ordenable como texto: una fecha anterior debe comparar como menor.
  assert.ok(formatFechaSantiago(new Date('2026-01-05T12:00:00Z')) < fecha);
});
