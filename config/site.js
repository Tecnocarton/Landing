/**
 * Configuración del sitio Tecnocarton
 *
 * Este archivo contiene todos los datos de contacto y configuración
 * que pueden ser editados fácilmente sin modificar el código.
 */

export const siteConfig = {
  // Información de la empresa
  company: {
    name: 'Tecnocarton',
    legalName: 'Tecnocarton Ltda.',
    description: 'Soluciones de cartón corrugado con capacidad industrial y flexibilidad artesanal.',
    foundedYear: 2003,
    logo: '/logotipo-SF.svg',
  },

  // Datos de contacto.
  // El canal telefónico es SOLO WhatsApp (decisión comercial): no publicamos
  // link `tel:` en el sitio ni `telephone` en el JSON-LD.
  contact: {
    email: 'ventas@tecnocarton.cl',
    // lib/whatsapp.mjs lo normaliza a dígitos (→ 56983177177), así que el
    // formato legible con + y espacios es válido. Debe incluir el 56.
    whatsapp: '+56 9 8317 7177',
    whatsappMessage: 'Hola, me interesa cotizar productos de embalaje',
  },

  // Horario de atención. Fuente única: la consumen el catálogo, el cotizador y
  // el JSON-LD (LocalBusiness) vía lib/hours.mjs.
  hours: {
    weekday: {
      label: 'Lunes a jueves',
      days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday'],
      opens: '08:00',
      closes: '17:30',
    },
    friday: {
      label: 'Viernes',
      days: ['Friday'],
      opens: '08:00',
      closes: '14:30',
    },
  },

  // Dirección
  address: {
    street: 'Cam - Félix Del Solar, Padre Hurtado, Región Metropolitana',
    city: 'Padre hurtado',
    region: 'Región Metropolitana',
    country: 'Chile',
    full: 'Cam - Félix Del Solar, Padre Hurtado, Región Metropolitana',
  },

  // Redes sociales
  social: {
    linkedin: 'https://www.linkedin.com/company/tecnocarton/',
    instagram: '', // Por confirmar
    facebook: '', // Por confirmar
  },

  // Configuración del formulario
  form: {
    recipientEmail: 'ventas@tecnocarton.cl',
    emailSubjectPrefix: 'Cotización web',
    responseTime: '24 horas hábiles',
  },

  // Catálogo descargable (F3.2)
  // Mientras `pdfUrl` esté vacío, /catalogo se descarga con "Guardar como PDF"
  // del navegador (la página ya trae estilos de impresión). Si más adelante hay
  // un PDF diseñado, se deja en /public y se apunta aquí (ej: '/catalogo-tecnocarton.pdf').
  catalog: {
    pdfUrl: '',
  },

  // Configuración de reclutamiento
  recruitment: {
    recipientEmail: 'reclutamiento@tecnocarton.cl',
    emailSubjectPrefix: 'Postulación Web',
    responseTime: '5 días hábiles',
  },

  // SEO y metadata
  seo: {
    title: 'Fábrica de cartón corrugado para empresas | Tecnocarton',
    description: 'Fabricante directo de cartón corrugado desde 2003. Planchas, rollos y cajas a medida por volumen (pedidos desde 500 unidades) para empresas en Chile. Cotización en 24 h.',
    keywords: 'fábrica cartón corrugado, cajas de cartón por mayor, cartón corrugado por volumen, planchas corrugadas, embalaje industrial, cajas a medida empresas, Chile',
    ogImage: '/og-image.jpg',
  },

  // Estadísticas para mostrar en el sitio.
  //
  // NO publicar cifras de capacidad de producción (unidades/mes, toneladas/día):
  // son sensibles para público general y ese tipo de consulta se responde
  // directamente por correo a ventas@tecnocarton.cl.
  stats: {
    deliveryDays: '3 a 5',
    deliveryTime: '3 a 5 días hábiles',
    yearsExperience: 20,
    customerSatisfaction: 98,
  },
};

// Productos disponibles.
// minOrderQty/minOrderUnit son la fuente única de los mínimos de pedido:
// el label `minOrder` se deriva de ellos y BoxFinder lee minOrderQty directo.
const formatMinOrder = (qty, unit) => `Mín. ${qty.toLocaleString('es-CL')} ${unit}`;

export const products = [
  {
    id: 'planchas',
    name: 'Planchas corrugadas',
    desc: '12, 14, 17 y 20, en onda C, B y E',
    minOrderQty: 500,
    minOrderUnit: 'unidades',
    image: '/productos/plancha.webp',
    available: true
  },
  {
    id: 'rollos',
    name: 'Rollos de corrugado',
    desc: 'Múltiples gramajes',
    minOrderQty: 500,
    minOrderUnit: 'kg',
    image: '/productos/carton-corrugado.webp',
    available: true
  },
  {
    id: 'cajas',
    name: 'Cajas a medida',
    desc: 'Impresión hasta 2 colores',
    minOrderQty: 500,
    minOrderUnit: 'unidades',
    image: '/Caja-Convencional-1.jpg',
    available: true
  },
].map((p) => ({ ...p, minOrder: formatMinOrder(p.minOrderQty, p.minOrderUnit) }));

// Rangos de cantidad por producto para el selector del cotizador.
// Calibrados a volumen B2B para calificar por volumen y filtrar consultas B2C
// (ver docs/sem-seo-b2b.md).
// Cada producto arranca en su pedido mínimo (minOrderQty: 500 en las tres
// líneas) y escala; los tramos superiores siguen el ejemplo del cliente.
export const quantityRanges = {
  planchas: ['500 - 1.500', '1.500 - 5.000', '5.000 - 10.000', '10.000 - 20.000', 'Más de 20.000'],
  cajas: ['500 - 1.000', '1.000 - 3.000', '3.000 - 8.000', '8.000 - 15.000', 'Más de 15.000'],
  rollos: ['500 - 1.000', '1.000 - 2.500', '2.500 - 5.000', 'Más de 5.000'],
};

// Gramajes de cartón.
//
// El gramaje es SOLO el número (12, 14, 17, 20): es el peso del papel por m² y
// manda en cuánta carga aguanta el cartón. La letra C/B/E es el TIPO DE ONDA y
// es un eje APARTE (ver `ondas` en config/productos.js). No se concatenan.
//
// Excepción: los códigos de caja de stock tipo "12C30x20x20" son SKU (gramaje
// 12 + onda C + medidas internas). Ver config/stockBoxes.js.
export const cardboardTypes = [
  { gramaje: '12', weight: '~420 gr/m²', use: 'Productos ligeros' },
  { gramaje: '14', weight: '~450 gr/m²', use: 'Uso medio' },
  { gramaje: '17', weight: '~480 gr/m²', use: 'Uso general' },
  { gramaje: '20', weight: '~610 gr/m²', use: 'Cargas pesadas' }
];

// Pasos del proceso de producción (simplificado a 4 pasos)
export const processSteps = [
  { num: '01', title: 'Materia prima', desc: 'Bobinas de papel liner, medium y recicladas de proveedores certificados', icon: 'package' },
  { num: '02', title: 'Corrugado y laminado', desc: 'Formación de onda mediante calor y presión, unión con adhesivo base almidón', icon: 'layers' },
  { num: '03', title: 'Corte y control', desc: 'Corte de precisión milimétrica con verificación de gramaje y resistencia', icon: 'check-square' },
  { num: '04', title: 'Despacho', desc: 'Entrega con flota propia en todo RM', icon: 'truck' }
];

// Información de sostenibilidad (Ley REP)
export const sustainability = {
  title: 'Compromiso sustentable',
  subtitle: 'Economía circular & Ley REP',
  description: 'Nuestros productos están alineados con la ley de responsabilidad extendida del productor (REP), contribuyendo activamente a la economía circular.',
  features: [
    {
      title: '100% Reciclable',
      desc: 'Todo nuestro cartón corrugado es completamente reciclable',
      icon: 'recycle'
    },
    {
      title: 'Materia prima certificada',
      desc: 'Utilizamos papel proveniente de bosques gestionados responsablemente',
      icon: 'leaf'
    },
    {
      title: 'Adhesivos naturales',
      desc: 'Base almidón, biodegradables y seguros para el medio ambiente',
      icon: 'droplet'
    },
    {
      title: 'Cumplimiento Ley REP',
      desc: 'Facilitamos el cumplimiento de metas de reciclaje para envases y embalajes',
      icon: 'shield-check'
    }
  ],

  // Ley REP explicada con datos concretos (F3.3 · transparencia).
  //
  // Solo se incluyen datos verificables de la normativa: número y año de la ley,
  // su condición de producto prioritario y el decreto que fija las metas.
  // NOTA PARA EL PROPIETARIO: si se quieren publicar los porcentajes de meta
  // por material del DS 12/2021, hay que tomarlos del texto oficial del decreto
  // y agregarlos acá; no se inventan cifras.
  rep: {
    title: 'Qué es la Ley REP y en qué te afecta',
    intro:
      'Si tu empresa pone envases y embalajes en el mercado chileno, la Ley REP te hace responsable de que esos envases se recolecten y valoricen. El material que elijas cambia lo difícil (y lo caro) que es cumplir.',
    claves: [
      {
        dato: 'Ley N° 20.920',
        titulo: 'Marco de responsabilidad extendida del productor',
        desc:
          'Vigente desde 2016, obliga a los productores a financiar y organizar la recolección y valorización de los residuos de sus productos.',
      },
      {
        dato: 'Producto prioritario',
        titulo: 'Los envases y embalajes están dentro',
        desc:
          'Envases y embalajes es uno de los productos prioritarios de la ley, junto a neumáticos, aceites lubricantes, aparatos eléctricos y electrónicos, pilas y baterías.',
      },
      {
        dato: 'DS N° 12/2021',
        titulo: 'Metas crecientes por material',
        desc:
          'El decreto de metas del Ministerio del Medio Ambiente fija porcentajes de recolección y valorización que suben año a año, separando el canal domiciliario del no domiciliario.',
      },
    ],
    // Por qué el corrugado juega a favor del cliente en ese escenario.
    ventajas: [
      'Monomaterial: el corrugado es papel, sin laminados plásticos que dificulten su reciclaje.',
      'Adhesivo base almidón: se disuelve en el proceso de repulpeo, no contamina la fibra.',
      '100% reciclable y con cadena de reciclaje ya instalada en Chile.',
      'Se puede reutilizar varias veces antes de reciclarse, bajando el volumen declarado.',
    ],
  },
};

// Casos de éxito
//
// `industriaSlug` enlaza cada caso con su página de /industrias/[slug]: es la
// fuente de verdad del cruce (config/industrias.js lo usa para mostrar el caso
// y la home para enlazar hacia la industria).
//
// `cliente` queda en null a propósito: cuando el cliente autorice aparecer con
// nombre, basta escribir acá su nombre EXACTO tal como está en `clients` (más
// abajo) y el logo se muestra solo, sin tocar código. Sin autorización, el caso
// se mantiene anónimo con la descripción genérica de `company`.
export const caseStudies = [
  {
    industry: 'E-commerce',
    industriaSlug: 'ecommerce',
    company: 'Tienda online',
    cliente: null,
    challenge: 'Necesitaban cajas a medida que redujeran tiempo de empaque',
    solution: 'Diseñamos cajas con cierre automático sin cinta',
    result: '40% menos tiempo de empaque'
  },
  {
    industry: 'Industria del embalaje',
    industriaSlug: 'logistica-industrial',
    company: 'Fabricante de cajas',
    cliente: null,
    challenge: 'Requerían planchas corrugadas de alta calidad y corte exacto para producción continua de cajas',
    solution: 'Suministro regular de planchas en gramajes 17 y 20 con corte a medida y despacho programado',
    result: '30% menos tiempo de producción'
  },
  {
    industry: 'Manufactura',
    industriaSlug: 'muebles-y-manufactura',
    company: 'Fábrica de muebles',
    cliente: null,
    challenge: 'Embalaje para piezas de diferentes tamaños',
    solution: 'Sistema modular de planchas y esquineros',
    result: '25% reducción en costos de embalaje'
  }
];

// Empresas que confían en nosotros
// El propietario puede agregar/quitar logos editando esta lista
// Los logos deben estar en /public/clientes/
export const clients = [
  { name: 'La Polar', logo: '/clientes/La_Polar.svg' },
  { name: '3R Pop', logo: '/clientes/3Rpop.png' },
  { name: 'Cartones RYR', logo: '/clientes/cartones-ryr.png' },
  { name: 'CIC', logo: '/clientes/cic.jpeg' },
  { name: 'Colbox', logo: '/clientes/colbox.png' },
  { name: 'Copelec', logo: '/clientes/copelec.jpg' },
  { name: 'Ecomat', logo: '/clientes/ecomat.jpg' },
  { name: 'Ferretería Mueblista', logo: '/clientes/ferreteria_mueblista.png' },
  { name: 'Idelab', logo: '/clientes/idelab.png' },
  { name: 'Reminisen', logo: '/clientes/reminisen.jpg' },
  { name: 'Tubexa', logo: '/clientes/tubexa.gif' }
];

// Logo de un cliente por nombre exacto. Se usa para cruzar los casos de éxito
// con los logos (campo `cliente` de caseStudies); devuelve null si el caso es
// anónimo o si el nombre no está en la lista de clientes.
export const getClientLogo = (name) =>
  (name && clients.find((client) => client.name === name)?.logo) || null;

// Certificaciones de calidad
export const qualityCertifications = [
  { text: 'Control de gramaje' },
  { text: 'Prueba de resistencia' },
  { text: 'Precisión dimensional' },
  { text: 'Material reciclable' }
];

// Ofertas laborales activas
// El propietario puede editar esta lista para mostrar/ocultar ofertas
export const jobOffers = [
  {
    id: 'operador-corrugadora',
    title: 'Operador de corrugadora',
    department: 'Producción',
    type: 'Tiempo completo',
    description: 'Buscamos operador con experiencia en máquinas corrugadoras para unirse a nuestro equipo de producción.',
    requirements: [
      'Experiencia mínima de 2 años en operación de maquinaria industrial',
      'Conocimiento en calibración y ajuste de equipos',
      'Licencia de conducir clase B',
      'Educación media completa'
    ],
    active: true
  },
  {
    id: 'ejecutivo-comercial',
    title: 'Ejecutivo comercial',
    department: 'Ventas',
    type: 'Tiempo completo',
    description: 'Únete a nuestro equipo comercial para desarrollar nuevos clientes y mantener relaciones con clientes existentes.',
    requirements: [
      'Experiencia en ventas B2B, idealmente en sector industrial',
      'Excelentes habilidades de comunicación y negociación',
      'Licencia de conducir clase B',
      'Manejo de herramientas Office'
    ],
    active: true
  },
  {
    id: 'Operador auxiliar',
    title: 'Operador auxiliar',
    department: 'Producción',
    type: 'Tiempo completo',
    description: 'Se requiere ayudante para labores de productivos, carga y descarga de materiales.',
    requirements: [
      'Educación media completa',
      'Capacidad para trabajo físico',
      'Responsable y puntual',
      'Licencia de grúa horquilla'
    ],
    active: true // Ejemplo de oferta inactiva
  }
];

// Cargos disponibles para postulación espontánea
export const availablePositions = [
  { id: 'operador', name: 'Operador auxiliar' },
  { id: 'bodega', name: 'Logística' },
  { id: 'vendedor', name: 'Vendedor/Ejecutivo comercial' },
  { id: 'administrativo', name: 'Administrativo' },
  { id: 'mantencion', name: 'Técnico en mantención' },
  { id: 'otro', name: 'Otro' }
];

// Estadísticas para el Hero
export const stats = [
  { value: 90, suffix: '%+', label: 'Tasa de recompra' },
  { value: 'Nacional', suffix: '', label: 'Cobertura bajo coordinación', isText: true },
  { value: 'RM', suffix: '', label: 'Cobertura de entregas', isText: true }
];

// Propuesta de valor
export const valueProps = [
  { title: 'Integración vertical', desc: 'Control total desde la materia prima hasta el producto final. Sin intermediarios.' },
  { title: 'Cobertura nacional', desc: 'Flota propia para entregas en todo Chile. Rapidez y confiabilidad garantizada.' },
  { title: 'Flexibilidad híbrida', desc: 'Grandes volúmenes industriales o pedidos personalizados. Nos adaptamos a ti.' },
  { title: 'Precios de fábrica', desc: 'Directo del productor. Elimina costos de intermediación y ahorra.' }
];

// Links del footer (Empresa)
export const footerLinks = [
  { name: 'Industrias', href: '/industrias', section: null },
  { name: 'Sobre nosotros', href: '/nosotros', section: null },
  { name: 'Proceso', href: '/proceso', section: null },
  { name: 'Casos de éxito', href: null, section: 'casos' },
  { name: 'Trabaja con nosotros', href: '/trabaja-con-nosotros', section: null }
];

// Theme colors - mantiene sincronía con landing.css :root
export const theme = {
  colors: {
    primary: '#1B4D5C',
    primaryLight: '#2E6A80',
    primaryDark: '#0F3540',
    accent: '#E67635',
    accentLight: '#F29559',
    accentDark: '#C45A1A',
    // Neutros cálidos de fondo (espejo de --color-kraft/--color-kraft-dark en
    // app/globals.css). Estaban solo en CSS y por eso se hardcodeaban en JSX.
    kraft: '#F5F1EA',
    kraftDark: '#E8DFD3',
    surface: '#FFFFFF',
    surfaceElevated: '#FAFBFC',
    surfaceSection: '#F8FAFB',
    text: '#1A2B32',
    textSecondary: '#374151',
    textMuted: '#6B7280',
    textSubtle: '#8E9DA6',
    success: '#059669',
    successLight: '#10B981',
    error: '#DC2626',
    border: '#E2E8EC',
    borderLight: '#F0F3F5',
    borderInput: '#E5E7EB',
  },
  gradients: {
    primary: 'linear-gradient(135deg, #2E6A80, #1B4D5C)',
    accent: 'linear-gradient(135deg, #E67635, #C45A1A)',
    hero: 'linear-gradient(135deg, rgba(27,77,92,0.92), rgba(15,53,64,0.88), rgba(27,77,92,0.9))',
    quote: 'linear-gradient(135deg, #2E6A80, #1a4a5c)',
  }
};
