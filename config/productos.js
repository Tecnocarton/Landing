/**
 * Fichas técnicas de producto (Tecnocarton).
 *
 * Cada objeto describe una línea de producto con datos técnicos reales de
 * cartón corrugado chileno: gramajes, ondas, medidas, mínimos, plazos, usos
 * y preguntas frecuentes. Los mínimos de pedido se derivan de `products`
 * (config/site.js) para mantener una única fuente de verdad.
 *
 * El propietario puede editar copy, usos y FAQ sin tocar el código de las páginas.
 */
import { products, cardboardTypes } from './site';
import { buildGramajes } from '../lib/specs.mjs';

// Resistencia orientativa POR GRAMAJE (carga recomendada / apilamiento).
//
// La tabla es neutral respecto de la onda a propósito: no publicamos valores de
// resistencia por onda porque no los tenemos confirmados con planta. La onda se
// explica en su propia sección (`ondas`) y la nota al pie lo dice explícito.
const resistenciaPorGramaje = {
  12: 'Cargas ligeras (hasta ~10 kg)',
  14: 'Cargas medias (hasta ~20 kg)',
  17: 'Uso general (hasta ~30 kg)',
  20: 'Cargas pesadas (hasta ~50 kg)',
};

// Especificación de gramajes: reutiliza cardboardTypes y agrega resistencia.
// buildGramajes LANZA si las claves no calzan (ver lib/specs.mjs): un desalineo
// rompe el build en vez de vaciar la tabla en silencio.
export const gramajes = buildGramajes(cardboardTypes, resistenciaPorGramaje);

// Ondas de corrugado disponibles. Eje independiente del gramaje.
export const ondas = [
  { onda: 'C', altura: '~4 mm', uso: 'Uso general, amortiguación y apilamiento' },
  { onda: 'B', altura: '~3 mm', uso: 'Rigidez y buena superficie para impresión' },
  { onda: 'E', altura: '~1,5 mm', uso: 'Microcorrugado para retail y estuches' },
];

// Los dos ejes con los que se define el cartón. Se renderizan con el mismo peso
// visual en las fichas y en el catálogo para que la onda no quede como nota al pie.
export const ejes = [
  {
    titulo: 'Gramaje: 12, 14, 17 y 20',
    desc: 'Es el peso del papel por metro cuadrado. Manda en cuánta carga aguanta el cartón: a mayor número, mayor resistencia.',
  },
  {
    titulo: 'Onda: C, B y E',
    desc: 'Es el perfil del corrugado interior. Manda en el espesor, la rigidez y la calidad de la superficie para imprimir.',
  },
];

// Disponibilidad cruzada gramaje × onda: NO está confirmada con planta, así que
// no se afirma. En vez de un "consultar" seco, se nombra la causa real y se
// compromete un plazo de respuesta (el `{plazo}` lo inyecta quien renderiza,
// desde siteConfig.form.responseTime).
export const notaDisponibilidad =
  'Gramaje y onda se eligen por separado y se combinan según la programación de planta y las bobinas disponibles. Dinos la combinación que necesitas —por ejemplo, gramaje 17 en onda B— y te confirmamos disponibilidad, precio y plazo en la misma cotización.';

// Tolerancias de fabricación (F3.3 · transparencia técnica).
//
// Son los rangos de referencia con los que se trabaja el cartón corrugado:
// se publican para que el cliente sepa qué esperar antes de comprar, no como
// compromiso contractual. El valor exacto de cada pedido se confirma en la
// cotización.
//
// NOTA PARA EL PROPIETARIO: confirmar estos rangos con planta y ajustarlos
// acá si difieren de la práctica real (mismo criterio que `quantityRanges`
// en config/site.js).
export const tolerancias = [
  {
    parametro: 'Medidas de corte (largo × ancho)',
    valor: '± 3 mm',
    nota: 'Sobre la medida solicitada en planchas y cortes.',
  },
  {
    parametro: 'Medidas internas de caja',
    valor: '± 5 mm',
    // Solo aplica a cajas armadas: no se muestra en la ficha de planchas ni de rollos.
    soloCajas: true,
    nota: 'El espesor del cartón varía según gramaje y onda; partimos siempre de la medida interna útil.',
  },
  {
    parametro: 'Gramaje',
    valor: '± 5 %',
    nota: 'Variación normal del papel entre bobinas. Se verifica con control de gramaje en cada corrida.',
  },
  {
    parametro: 'Escuadría',
    valor: '± 2 mm',
    nota: 'Diferencia máxima entre diagonales de la plancha.',
  },
  {
    parametro: 'Humedad del cartón',
    valor: '7 % a 9 %',
    nota: 'Rango de equilibrio del corrugado. Fuera de ese rango la resistencia baja, por eso importa dónde se almacena.',
  },
];

// Aclaración que acompaña a las tablas de resistencia y tolerancias.
export const notaResistencia =
  'Las cargas indicadas son referenciales, en condiciones normales de humedad. La resistencia real depende del gramaje, del tipo de onda, de la altura de apilamiento y del tiempo de almacenaje: para cargas críticas evaluamos tu caso antes de producir.';

// Especificación técnica por producto.
//
// Cada ficha recibe su PROPIO objeto (antes las 3 compartían la misma
// referencia, y por eso rollos —que se vende por kilo— mostraba la tolerancia
// de medida interna de caja).
const specsFor = (id) => ({
  gramajes,
  ondas,
  ejes,
  tolerancias: tolerancias.filter((t) => !t.soloCajas || id === 'cajas'),
  notaResistencia,
  notaDisponibilidad,
});

// Mínimos de pedido indexados por id de producto (fuente: config/site.js).
const minOrderById = Object.fromEntries(
  products.map((p) => [p.id, { qty: p.minOrderQty, unit: p.minOrderUnit, label: p.minOrder }])
);

export const productos = [
  {
    slug: 'planchas-carton-corrugado',
    id: 'planchas',
    nombre: 'Planchas de cartón corrugado',
    titulo: 'Planchas de cartón corrugado a medida',
    descripcion:
      'Planchas de cartón corrugado en gramajes 12, 14, 17 y 20, en onda C, B o E. Corte a medida de ~420 a ~610 gr/m² y despacho en 3 a 5 días hábiles en la RM.',
    heroCopy:
      'Planchas corrugadas cortadas a tu medida, en el gramaje y la onda que tu operación necesita. Del gramaje 12 para cargas livianas al 20 para cargas pesadas, con precisión dimensional milimétrica y despacho con flota propia.',
    specs: specsFor('planchas'),
    medidasInfo:
      'Cortamos planchas desde 20 × 20 cm hasta 240 × 140 cm (largo × ancho). Formatos mayores bajo evaluación técnica.',
    minOrder: minOrderById.planchas,
    plazos: {
      normal: '3 a 5 días hábiles',
      urgencia: 'Para urgencias coordinamos entregas parciales según disponibilidad de bobinas.',
    },
    usos: [
      'Fabricación de cajas y estuches',
      'Separadores y divisiones internas',
      'Bases y tapas para pallet',
      'Protección de superficies y pisos en obra',
      'Interfoliado entre capas de producto',
      'Embalaje de muebles y piezas de gran tamaño',
    ],
    faq: [
      {
        q: '¿Las medidas de las planchas son internas o externas?',
        a: 'En planchas trabajamos con la medida de corte real (largo × ancho de la plancha plana). Si la plancha se usará para armar una caja, considera que las medidas internas útiles de esa caja quedan algo menores por los dobleces y el espesor del cartón.',
      },
      {
        q: '¿Qué gramaje elijo según el peso de mi producto?',
        a: 'Como referencia: gramaje 12 (~420 gr/m²) para productos livianos, 14 y 17 para cargas medias y de uso general, y 20 (~610 gr/m²) para cargas pesadas o apilamiento. El gramaje se elige por el peso; la onda (C, B o E) se elige aparte, según el uso y la impresión. Cuéntanos el peso y cómo se manipula y te recomendamos la combinación.',
      },
      {
        q: '¿El gramaje y la onda son lo mismo?',
        a: 'No. El gramaje es el número —12, 14, 17 o 20— e indica el peso del papel por metro cuadrado, es decir, cuánta carga aguanta. La onda es la letra —C, B o E— e indica el perfil del corrugado interior, que define el espesor y la rigidez. Primero se elige el gramaje por el peso y después la onda por el uso.',
      },
      {
        q: '¿Qué onda me conviene: C, B o E?',
        a: 'La onda C (~4 mm) es la más versátil: amortigua y aguanta apilamiento. La onda B (~3 mm) entrega una pieza más rígida y una superficie más pareja para imprimir. La onda E (~1,5 mm) es microcorrugado, pensado para estuches, retail y todo lo que necesita menos volumen y mejor terminación. La onda es independiente del gramaje: se eligen por separado.',
      },
      {
        q: '¿Puedo pedir cualquier gramaje en cualquier onda?',
        a: 'Las combinaciones dependen de la programación de planta y de las bobinas disponibles. Indícanos la que necesitas —por ejemplo, gramaje 17 en onda B— y te confirmamos disponibilidad, precio y plazo en la misma cotización, dentro de 24 horas hábiles.',
      },
      {
        q: '¿Puedo pedir las planchas impresas?',
        a: 'Las planchas se entregan sin impresión. Si necesitas impresión hasta 2 colores, la realizamos sobre cajas ya troqueladas; consúltanos por ese formato.',
      },
      {
        q: '¿Cuál es el pedido mínimo de planchas?',
        a: 'El mínimo es de 500 unidades por formato. Para volúmenes o formatos especiales, escríbenos y evaluamos tu caso.',
      },
      {
        q: '¿En cuánto tiempo entregan?',
        a: 'El plazo habitual es de 3 a 5 días hábiles una vez confirmado el pedido. Para urgencias coordinamos entregas parciales según disponibilidad de bobinas.',
      },
    ],
    imagen: '/productos/plancha.webp',
  },
  {
    slug: 'rollos-corrugado',
    id: 'rollos',
    nombre: 'Rollos de cartón corrugado',
    titulo: 'Rollos de cartón corrugado por metro',
    descripcion:
      'Rollos de cartón corrugado en múltiples gramajes y ondas para embalaje continuo, protección e interfoliado. Despacho en 3 a 5 días hábiles en la RM.',
    heroCopy:
      'Cartón corrugado en rollo continuo para proteger, envolver y separar sin cortes previos. Elige el gramaje y la onda según tu producto y despacha directo desde fábrica.',
    specs: specsFor('rollos'),
    medidasInfo:
      'Bobinas con anchos estándar entre 60 y 140 cm y largo continuo por rollo. Anchos especiales bajo pedido.',
    minOrder: minOrderById.rollos,
    plazos: {
      normal: '3 a 5 días hábiles',
      urgencia: 'Para pedidos urgentes consúltanos por disponibilidad inmediata de bobinas.',
    },
    usos: [
      'Protección y envoltura de productos frágiles',
      'Interfoliado y separación entre capas',
      'Relleno y amortiguación en embalaje',
      'Cobertura de superficies y mobiliario',
      'Líneas de empaque continuas',
    ],
    faq: [
      {
        q: '¿Cómo se cotiza el cartón en rollo?',
        a: 'Los rollos se cotizan por kilo. El mínimo de pedido es de 500 kg, combinables entre gramajes según disponibilidad.',
      },
      {
        q: '¿Qué gramaje conviene para proteger productos frágiles?',
        a: 'Para envoltura y amortiguación livianas funciona bien el gramaje 12 (~420 gr/m²); si necesitas mayor rigidez o proteger piezas pesadas, sube a 17 o 20. Indícanos qué producto vas a proteger y te orientamos.',
      },
      {
        q: '¿El gramaje y la onda son lo mismo?',
        a: 'No. El gramaje es el número —12, 14, 17 o 20— e indica el peso del papel por metro cuadrado, es decir, cuánta carga aguanta. La onda es la letra —C, B o E— e indica el perfil del corrugado interior, que define el espesor y la rigidez. Primero se elige el gramaje por el peso y después la onda por el uso.',
      },
      {
        q: '¿Qué onda me conviene: C, B o E?',
        a: 'La onda C (~4 mm) es la más versátil: amortigua y aguanta apilamiento. La onda B (~3 mm) entrega una pieza más rígida y una superficie más pareja para imprimir. La onda E (~1,5 mm) es microcorrugado, pensado para estuches, retail y todo lo que necesita menos volumen y mejor terminación. La onda es independiente del gramaje: se eligen por separado.',
      },
      {
        q: '¿Puedo pedir cualquier gramaje en cualquier onda?',
        a: 'Las combinaciones dependen de la programación de planta y de las bobinas disponibles. Indícanos la que necesitas —por ejemplo, gramaje 17 en onda B— y te confirmamos disponibilidad, precio y plazo en la misma cotización, dentro de 24 horas hábiles.',
      },
      {
        q: '¿Los rollos vienen impresos?',
        a: 'No, el cartón en rollo se entrega sin impresión. La impresión hasta 2 colores está disponible en nuestras cajas a medida.',
      },
      {
        q: '¿Qué ancho de rollo puedo pedir?',
        a: 'Manejamos anchos estándar entre 60 y 140 cm; los anchos especiales se evalúan según el equipo y la disponibilidad de bobinas.',
      },
      {
        q: '¿Cuál es el plazo de entrega?',
        a: 'Entregamos en 3 a 5 días hábiles en la Región Metropolitana. Para pedidos urgentes, consúltanos por disponibilidad inmediata.',
      },
    ],
    imagen: '/productos/carton-corrugado.webp',
  },
  {
    slug: 'cajas-a-medida',
    id: 'cajas',
    nombre: 'Cajas de cartón a medida',
    titulo: 'Cajas de cartón corrugado a medida',
    descripcion:
      'Cajas de cartón corrugado a medida en onda C, B o E, con impresión hasta 2 colores. Gramajes 12, 14, 17 y 20, y despacho en 3 a 5 días hábiles en la RM.',
    heroCopy:
      'Diseñamos y fabricamos cajas de cartón corrugado según tus medidas internas exactas, el peso que deben soportar y tu imagen de marca. Impresión hasta 2 colores y troqueles a pedido.',
    specs: specsFor('cajas'),
    medidasInfo:
      'Fabricamos cajas con medidas internas desde 10 × 10 × 10 cm hasta 120 × 80 × 80 cm. Formatos especiales y troqueles bajo evaluación técnica.',
    minOrder: minOrderById.cajas,
    plazos: {
      normal: '3 a 5 días hábiles',
      urgencia: 'Para nuevos formatos preparamos una muestra antes de producir el lote.',
    },
    usos: [
      'E-commerce y despacho de pedidos',
      'Cajas máster y de agrupación',
      'Embalaje de alimentos y bebidas',
      'Repuestos y ferretería',
      'Exportación e industria',
      'Retail y exhibición (onda E)',
    ],
    faq: [
      {
        q: '¿Las medidas que indico son internas o externas?',
        a: 'Trabajamos siempre con medidas internas (el espacio útil para tu producto). El cartón agrega unos milímetros al exterior según el gramaje y la onda; por eso partimos de lo que necesitas guardar, no del contorno externo.',
      },
      {
        q: '¿Qué gramaje elijo según el peso?',
        a: 'Como referencia: gramaje 12 (~420 gr/m²) para cargas livianas, 14 y 17 para uso medio y general, y 20 (~610 gr/m²) para cargas pesadas o alto apilamiento. El gramaje se elige por el peso; la onda (C, B o E) se elige aparte, según el uso y la impresión. Dinos el peso y cómo se apilan las cajas y te recomendamos la combinación.',
      },
      {
        q: '¿El gramaje y la onda son lo mismo?',
        a: 'No. El gramaje es el número —12, 14, 17 o 20— e indica el peso del papel por metro cuadrado, es decir, cuánta carga aguanta. La onda es la letra —C, B o E— e indica el perfil del corrugado interior, que define el espesor y la rigidez. Primero se elige el gramaje por el peso y después la onda por el uso.',
      },
      {
        q: '¿Pueden imprimir mi logo en las cajas?',
        a: 'Sí, imprimimos hasta 2 colores mediante flexografía. Envíanos tu logo o diseño en vectores y definimos la posición sobre la caja.',
      },
      {
        q: '¿Cuál es el pedido mínimo de cajas a medida?',
        a: 'El mínimo es de 500 unidades por modelo. Para nuevos formatos preparamos una muestra antes de producir el lote.',
      },
      {
        q: '¿Qué onda me conviene: C, B o E?',
        a: 'La onda C (~4 mm) es la más versátil: amortigua y aguanta apilamiento. La onda B (~3 mm) entrega una pieza más rígida y una superficie más pareja para imprimir. La onda E (~1,5 mm) es microcorrugado, pensado para estuches, retail y todo lo que necesita menos volumen y mejor terminación. La onda es independiente del gramaje: se eligen por separado.',
      },
      {
        q: '¿Puedo pedir cualquier gramaje en cualquier onda?',
        a: 'Las combinaciones dependen de la programación de planta y de las bobinas disponibles. Indícanos la que necesitas —por ejemplo, gramaje 17 en onda B— y te confirmamos disponibilidad, precio y plazo en la misma cotización, dentro de 24 horas hábiles.',
      },
    ],
    imagen: '/Caja-Convencional-1.jpg',
  },
];

export function getProducto(slug) {
  return productos.find((p) => p.slug === slug);
}
