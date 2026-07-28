/**
 * Páginas por industria (SEO local Chile).
 *
 * Cada industria describe los dolores del rubro, cómo ayuda Tecnocarton,
 * productos recomendados (referencia a slugs de /productos/[slug]),
 * un caso de éxito reutilizado desde config/site.js (o null) y un FAQ propio.
 *
 * El copy está dirigido a jefes de bodega y compras (B2B), en español de Chile.
 */
import { caseStudies } from './site';

// Referencias a los productos por su slug de /productos/[slug].
// El slug es la fuente de verdad para el enlace; el nombre es solo para mostrar.
// `id` es el mismo identificador que usa el cotizador (config/site.js `products`):
// mientras las fichas técnicas estén en BETA, el enlace cae a /?producto=<id>#cotizar.
const PRODUCTO = {
  planchas: { slug: 'planchas-carton-corrugado', id: 'planchas', nombre: 'Planchas corrugadas' },
  rollos: { slug: 'rollos-corrugado', id: 'rollos', nombre: 'Rollos de corrugado' },
  cajas: { slug: 'cajas-a-medida', id: 'cajas', nombre: 'Cajas a medida' },
};

// Reutiliza un caso de éxito de site.js buscándolo por el slug de esta industria
// (`industriaSlug` en caseStudies es la fuente de verdad del cruce).
const casoPorIndustria = (slug) =>
  caseStudies.find((caso) => caso.industriaSlug === slug) || null;

export const industrias = [
  {
    slug: 'ecommerce',
    nombre: 'E-commerce',
    tituloSEO: 'Cajas de cartón corrugado para e-commerce en Chile',
    descripcionSEO:
      'Cajas de cartón corrugado a medida para e-commerce en Chile. Reduce tiempos de empaque y protege cada envío. Fabricante directo, cotización sin costo.',
    heroCopy:
      'Empaca más rápido, envía más barato y reduce las devoluciones por daño. Fabricamos cajas a medida para tiendas online que despachan volumen todos los días.',
    pains: [
      'Empaque lento que frena la salida de pedidos en horas peak.',
      'Cajas sobredimensionadas que encarecen el envío por courier.',
      'Productos que llegan dañados y generan devoluciones y reembolsos.',
      'Envíos sin imagen de marca que no aportan a la experiencia de compra.',
    ],
    soluciones: [
      'Cajas a medida con cierre automático, para empacar sin cinta y en menos tiempo.',
      'Dimensiones ajustadas al producto que reducen volumen y costo de courier.',
      'Cartón con resistencia calibrada (onda C, B o E) para proteger en el traslado.',
      'Impresión hasta 2 colores para reforzar tu marca en cada entrega.',
    ],
    productosRecomendados: [PRODUCTO.cajas, PRODUCTO.planchas],
    casoExito: casoPorIndustria('ecommerce'),
    faq: [
      {
        q: '¿Cuál es el pedido mínimo de cajas para e-commerce?',
        a: 'El mínimo para cajas a medida es de 500 unidades. Si necesitas menos, podemos orientarte con planchas o formatos estándar; escríbenos y lo revisamos.',
      },
      {
        q: '¿Pueden fabricar cajas con cierre sin cinta?',
        a: 'Sí. Diseñamos cajas con cierre automático y solapas autoarmables que bajan el tiempo de empaque y el consumo de cinta.',
      },
      {
        q: '¿Imprimen el logo de mi tienda en la caja?',
        a: 'Sí, ofrecemos impresión hasta 2 colores para que cada envío refuerce la imagen de tu marca.',
      },
      {
        q: '¿Despachan a todo Chile?',
        a: 'Contamos con flota propia para la Región Metropolitana y coordinamos despacho a regiones según volumen. Indícanos tu comuna al cotizar.',
      },
    ],
  },
  {
    slug: 'alimentos-y-agro',
    nombre: 'Alimentos y agro',
    tituloSEO: 'Cajas de cartón corrugado para alimentos y agro en Chile',
    descripcionSEO:
      'Cajas y planchas de cartón corrugado para alimentos y agro en Chile. Resistencia a humedad y estiba, listas para exportación. Fabricante directo en RM.',
    heroCopy:
      'Envases que aguantan la cadena de frío, la estiba en pallet y el rotulado para exportación. Programamos con anticipación los volúmenes de cada temporada.',
    pains: [
      'Cajas que pierden resistencia con la humedad de cámaras de frío.',
      'Envases que colapsan al estibar pallets durante el almacenaje.',
      'Exigencias de rotulado y trazabilidad para exportación.',
      'Volúmenes altos en temporada de cosecha difíciles de asegurar.',
    ],
    soluciones: [
      'Cartón de mayor gramaje (17 y 20) para soportar estiba y peso.',
      'Planchas y cajas dimensionadas a pallet y cámara de frío.',
      'Impresión de rotulado y códigos para trazabilidad y despacho.',
      'Programación anticipada de entregas para los peaks de cosecha.',
    ],
    productosRecomendados: [PRODUCTO.cajas, PRODUCTO.planchas],
    casoExito: null,
    faq: [
      {
        q: '¿El cartón resiste la humedad de las cámaras de frío?',
        a: 'Trabajamos gramajes y ondas de mayor resistencia para condiciones exigentes. Cuéntanos la temperatura y humedad de tu cadena y recomendamos el material adecuado.',
      },
      {
        q: '¿Sirven para exportación de fruta y hortalizas?',
        a: 'Sí. Fabricamos planchas y cajas dimensionadas a pallet, con opción de rotulado para trazabilidad y control en despacho.',
      },
      // NO publicar cifras de capacidad de producción: ese tipo de consulta se
      // responde por correo, caso a caso. (Aquí vivía una FAQ con un volumen
      // anual que además era incorrecto.)
      {
        q: '¿Cuál es el mínimo de pedido?',
        a: 'Tanto para planchas como para cajas a medida es de 500 unidades. Escríbenos y ajustamos la propuesta a tu volumen.',
      },
    ],
  },
  {
    slug: 'muebles-y-manufactura',
    nombre: 'Muebles y manufactura',
    tituloSEO: 'Cartón corrugado para muebles y manufactura en Chile',
    descripcionSEO:
      'Planchas y cajas de cartón corrugado para muebles y manufactura en Chile. Protege piezas de todo tamaño y reduce costos. Fabricante directo, cotiza gratis.',
    heroCopy:
      'Un solo proveedor para embalar piezas de distinto tamaño, proteger cantos y esquinas, y mantener tu línea de producción abastecida sin quiebres.',
    pains: [
      'Piezas de distintos tamaños difíciles de embalar con un solo formato.',
      'Cantos y esquinas que se dañan durante el traslado.',
      'Alto costo de embalaje al usar material sobredimensionado.',
      'Líneas de producción que se detienen por falta de material.',
    ],
    soluciones: [
      'Sistema modular de planchas cortadas a medida para varios formatos.',
      'Refuerzos de cartón para proteger cantos y esquinas de las piezas.',
      'Formatos ajustados que reducen material y costo de embalaje.',
      'Suministro programado para no frenar la producción.',
    ],
    productosRecomendados: [PRODUCTO.planchas, PRODUCTO.cajas],
    casoExito: casoPorIndustria('muebles-y-manufactura'),
    faq: [
      {
        q: '¿Puedo embalar piezas de distintos tamaños con un solo proveedor?',
        a: 'Sí. Con planchas cortadas a medida y cajas armables cubres varios formatos sin sobredimensionar el embalaje.',
      },
      {
        q: '¿Fabrican refuerzos y protecciones de esquina?',
        a: 'Trabajamos planchas y refuerzos de cartón para proteger cantos y esquinas. Indícanos la pieza y proponemos la solución.',
      },
      {
        q: '¿Entregan de forma programada para no frenar la línea?',
        a: 'Sí, coordinamos suministro regular con despacho programado para mantener tu producción sin quiebres de material.',
      },
      {
        q: '¿Qué gramaje conviene para piezas pesadas?',
        a: 'Para cargas exigentes recomendamos gramaje 17 o 20. Lo definimos según el peso y la forma de tus piezas, junto con la onda más adecuada.',
      },
    ],
  },
  {
    slug: 'construccion-y-ferreteria',
    nombre: 'Construcción y ferretería',
    tituloSEO: 'Cartón corrugado para construcción y ferretería en Chile',
    descripcionSEO:
      'Planchas y cajas de cartón corrugado para construcción y ferretería en Chile. Protege superficies y embala carga pesada. Fabricante directo, cotiza sin costo.',
    heroCopy:
      'Protección económica para pisos, cristales y superficies terminadas, y embalaje resistente para fittings, herramientas e insumos pesados.',
    pains: [
      'Superficies terminadas (pisos, ventanas, cerámicas) que se rayan en obra.',
      'Productos pesados o de forma irregular difíciles de embalar.',
      'Cajas que no soportan el peso de fittings, herramientas o insumos.',
      'Necesidad de material de protección a bajo costo y en volumen.',
    ],
    soluciones: [
      'Planchas de cartón para proteger pisos, cristales y superficies en obra.',
      'Cajas y separadores reforzados para piezas pesadas o irregulares.',
      'Cartón de alto gramaje (20) para cargas exigentes.',
      'Precio de fábrica en formatos de protección, sin intermediarios.',
    ],
    productosRecomendados: [PRODUCTO.planchas, PRODUCTO.cajas],
    casoExito: null,
    faq: [
      {
        q: '¿Sirve el cartón para proteger pisos y superficies en obra?',
        a: 'Sí. Las planchas de cartón corrugado son una protección económica y reciclable para pisos, cristales y superficies terminadas.',
      },
      {
        q: '¿Aguanta productos pesados de ferretería?',
        a: 'Con cartón de alto gramaje (20) y refuerzos fabricamos embalaje para fittings, herramientas e insumos pesados.',
      },
      {
        q: '¿Venden planchas por volumen a precio de fábrica?',
        a: 'Sí, somos fabricantes directos. El mínimo de planchas es 500 unidades y trabajamos precio de fábrica sin intermediarios.',
      },
      {
        q: '¿Despachan a obras en la Región Metropolitana?',
        a: 'Contamos con flota propia para la RM. Indícanos la dirección de la obra al momento de cotizar.',
      },
    ],
  },
  {
    slug: 'logistica-industrial',
    nombre: 'Logística industrial',
    tituloSEO: 'Cartón corrugado para logística y centros de distribución en Chile',
    descripcionSEO:
      'Cajas y planchas de cartón corrugado para logística y centros de distribución en Chile. Optimiza pallet y estiba. Fabricante directo, cotización sin costo.',
    heroCopy:
      'Cajas dimensionadas al pallet, estiba segura y suministro programado para que tu centro de distribución nunca frene el despacho por falta de embalaje.',
    pains: [
      'Cajas que no aprovechan la medida del pallet y desperdician espacio.',
      'Roturas por mala estiba y manipulación en bodega.',
      'Quiebres de stock de embalaje que frenan el despacho.',
      'Demasiados SKU de cajas difíciles de estandarizar.',
    ],
    soluciones: [
      'Cajas dimensionadas para optimizar el llenado del pallet.',
      'Cartón calibrado y refuerzos de esquina para estiba segura.',
      'Suministro regular y programado para evitar quiebres de stock.',
      'Estandarización de formatos para reducir la cantidad de SKU.',
    ],
    productosRecomendados: [PRODUCTO.cajas, PRODUCTO.planchas, PRODUCTO.rollos],
    casoExito: casoPorIndustria('logistica-industrial'),
    faq: [
      {
        q: '¿Pueden fabricar cajas a la medida de mi pallet?',
        a: 'Sí. Diseñamos cajas dimensionadas para optimizar el llenado del pallet y aprovechar mejor cada despacho.',
      },
      {
        q: '¿Ofrecen refuerzos para estiba?',
        a: 'Trabajamos cartón calibrado y refuerzos de esquina que mejoran la estiba y reducen las roturas en la manipulación.',
      },
      {
        q: '¿Cómo evitan los quiebres de stock de embalaje?',
        a: 'Coordinamos suministro regular y programado según tu rotación, para que el despacho no se detenga por falta de material.',
      },
      {
        q: '¿Ayudan a estandarizar formatos y reducir SKU?',
        a: 'Sí. Revisamos tus medidas actuales y proponemos una grilla de formatos que reduce la cantidad de SKU de cajas.',
      },
    ],
  },
];

// Búsqueda por slug para las páginas dinámicas.
export const getIndustria = (slug) =>
  industrias.find((industria) => industria.slug === slug) || null;
