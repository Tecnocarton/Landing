import test from 'node:test';
import assert from 'node:assert/strict';
import {
  MAX_WHATSAPP_MESSAGE,
  normalizePhone,
  hasWhatsApp,
  buildQuoteMessage,
  buildWhatsAppUrl,
  buildQuoteWhatsAppUrl,
} from './whatsapp.mjs';

// Número comercial real de Tecnocarton (config/site.js contact.whatsapp).
// Se fija acá a propósito: si alguien lo cambia por error, este test falla.
const NUMERO_COMERCIAL = '+56 9 8317 7177';

// Estado típico del wizard para cajas a medida
const cajasAMedida = {
  producto: 'cajas',
  cantidad: '1.000 - 3.000 unidades',
  tiposCarton: ['12', '17'],
  ondas: ['C'],
  formatosRollo: [],
  detalle: 'Impresión 2 colores en 4 caras',
  cajaStock: '',
  empresa: 'Comercial ACME',
  email: 'compras@acme.cl',
  telefono: '+56 9 1234 5678',
};

test('normalizePhone deja solo dígitos', () => {
  assert.equal(normalizePhone('+56 9 1234 5678'), '56912345678');
  assert.equal(normalizePhone('(56) 2-2345-6789'), '56223456789');
  assert.equal(normalizePhone(''), '');
  assert.equal(normalizePhone(undefined), '');
});

test('buildWhatsAppUrl normaliza el número comercial de Tecnocarton', () => {
  assert.equal(
    buildWhatsAppUrl(NUMERO_COMERCIAL, 'x'),
    'https://wa.me/56983177177?text=x'
  );
});

test('hasWhatsApp usa la misma regla que buildWhatsAppUrl (dígitos, no truthy)', () => {
  for (const vacio of ['', '   ', '—', 'por definir', null, undefined]) {
    assert.equal(hasWhatsApp(vacio), false, `esperaba false para ${JSON.stringify(vacio)}`);
    assert.equal(buildWhatsAppUrl(vacio, 'x'), null);
  }
  assert.equal(hasWhatsApp(NUMERO_COMERCIAL), true);
  assert.ok(buildWhatsAppUrl(NUMERO_COMERCIAL, 'x'));
});

test('buildQuoteMessage incluye producto, cantidad, specs y contacto', () => {
  const msg = buildQuoteMessage(cajasAMedida, { productoNombre: 'Cajas a medida' });

  assert.match(msg, /^Hola Tecnocarton, quiero cotizar:/);
  assert.match(msg, /• Producto: Cajas a medida/);
  assert.match(msg, /• Cantidad: 1\.000 - 3\.000 unidades/);
  assert.match(msg, /• Tipo de cartón: 12, 17/);
  assert.match(msg, /• Onda: C/);
  assert.match(msg, /Detalles: Impresión 2 colores en 4 caras/);
  assert.match(msg, /Contacto: Comercial ACME · compras@acme\.cl · \+56 9 1234 5678/);
});

test('buildQuoteMessage usa el id del producto si no se entrega nombre visible', () => {
  const msg = buildQuoteMessage({ producto: 'planchas' });
  assert.match(msg, /• Producto: planchas/);
});

test('buildQuoteMessage omite los campos vacíos', () => {
  const msg = buildQuoteMessage({ producto: 'rollos', cantidad: '500 - 1.000 kg' });

  assert.match(msg, /• Producto: rollos/);
  assert.match(msg, /• Cantidad: 500 - 1\.000 kg/);
  assert.doesNotMatch(msg, /Tipo de cartón/);
  assert.doesNotMatch(msg, /Onda/);
  assert.doesNotMatch(msg, /Detalles/);
  assert.doesNotMatch(msg, /Contacto/);
});

test('buildQuoteMessage lista los formatos de rollo en kg', () => {
  const msg = buildQuoteMessage({ producto: 'rollos', formatosRollo: ['10', '25'] });
  assert.match(msg, /• Formatos de rollo: 10, 25 kg/);
});

test('buildQuoteMessage serializa la caja de stock del BoxFinder', () => {
  const msg = buildQuoteMessage({
    producto: 'cajas',
    cantidad: '84 cajas',
    cajaStock: '12C40x30x30',
    cajaDimsProducto: '30×20×15 cm',
    cajaUnidadesPorCaja: '12',
    cajaCantidadCajas: '84',
    empaqueModo: 'multi',
  });

  assert.match(msg, /• Caja de stock: 12C40x30x30 \(producto 30×20×15 cm · 12 u\/caja · 84 cajas\)/);
});

test('buildQuoteMessage omite las unidades por caja cuando es 1 producto por caja', () => {
  const msg = buildQuoteMessage({
    producto: 'cajas',
    cajaStock: '12C30x20x20',
    cajaDimsProducto: '25×15×10 cm',
    cajaUnidadesPorCaja: '1',
    cajaCantidadCajas: '1200',
    empaqueModo: 'single',
  });

  assert.match(msg, /• Caja de stock: 12C30x20x20 \(producto 25×15×10 cm · 1200 cajas\)/);
  assert.doesNotMatch(msg, /u\/caja/);
});

test('buildQuoteMessage agrega el N° de cotización cuando existe', () => {
  const msg = buildQuoteMessage(cajasAMedida, {
    productoNombre: 'Cajas a medida',
    quoteNumber: 'COT-000123',
  });
  assert.match(msg, /N° de cotización: COT-000123/);
});

test('buildQuoteMessage respeta el límite y conserva los campos clave', () => {
  const msg = buildQuoteMessage(
    { ...cajasAMedida, detalle: 'x'.repeat(5000) },
    { productoNombre: 'Cajas a medida' }
  );

  assert.ok(msg.length <= MAX_WHATSAPP_MESSAGE, `largo ${msg.length}`);
  // El recorte cae sobre el detalle, no sobre producto/cantidad/contacto.
  assert.match(msg, /• Producto: Cajas a medida/);
  assert.match(msg, /• Cantidad: 1\.000 - 3\.000 unidades/);
  assert.match(msg, /Contacto: Comercial ACME/);
  assert.match(msg, /…/);
});

test('buildQuoteMessage normaliza saltos de línea del detalle', () => {
  const msg = buildQuoteMessage({ producto: 'cajas', detalle: 'línea 1\n\nlínea 2' });
  assert.match(msg, /Detalles: línea 1 línea 2/);
});

test('buildWhatsAppUrl arma la URL wa.me con el mensaje codificado', () => {
  const url = buildWhatsAppUrl('+56 9 1234 5678', 'Hola\nchao');

  assert.equal(url, 'https://wa.me/56912345678?text=Hola%0Achao');
  // Los saltos de línea deben viajar como %0A (requisito del plan F3.1)
  assert.ok(url.includes('%0A'));
});

test('buildWhatsAppUrl devuelve null sin número configurado', () => {
  assert.equal(buildWhatsAppUrl('', 'Hola'), null);
  assert.equal(buildWhatsAppUrl(undefined, 'Hola'), null);
  assert.equal(buildWhatsAppUrl('sin dígitos', 'Hola'), null);
});

test('buildQuoteWhatsAppUrl compone mensaje y URL', () => {
  const url = buildQuoteWhatsAppUrl('56912345678', cajasAMedida, {
    productoNombre: 'Cajas a medida',
  });

  assert.ok(url.startsWith('https://wa.me/56912345678?text='));
  assert.ok(decodeURIComponent(url.split('?text=')[1]).includes('Cajas a medida'));
});

test('la URL completa se mantiene manejable para clientes móviles', () => {
  const url = buildQuoteWhatsAppUrl('56912345678', {
    ...cajasAMedida,
    detalle: 'detalle muy largo '.repeat(400),
  });

  const texto = decodeURIComponent(url.split('?text=')[1]);
  assert.ok(texto.length <= MAX_WHATSAPP_MESSAGE);
});
