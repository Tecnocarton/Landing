/**
 * Configuración del sitio Tecnocartón
 *
 * Este archivo contiene todos los datos de contacto y configuración
 * que pueden ser editados fácilmente sin modificar el código.
 */

export const siteConfig = {
  // Información de la empresa
  company: {
    name: 'Tecnocartón',
    legalName: 'Tecnocartón SpA',
    description: 'Soluciones de cartón corrugado con capacidad industrial y flexibilidad artesanal.',
    foundedYear: 2003,
    logo: '/logotipo.png',
  },

  // Datos de contacto
  contact: {
    email: 'ventas@tecnocarton.cl',
    phone: '', // Por configurar
    phoneClean: '', // Sin espacios para links tel:
    whatsapp: '', // Por configurar
    whatsappMessage: 'Hola, me interesa cotizar productos de embalaje',
  },

  // Dirección
  address: {
    street: 'Las Violetas',
    city: 'Padre Hurtado',
    region: 'Región Metropolitana',
    country: 'Chile',
    full: 'Las Violetas, Padre Hurtado, RM',
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
    emailSubjectPrefix: 'Cotización Web',
    responseTime: '24 horas hábiles',
  },

  // Configuración de reclutamiento
  recruitment: {
    recipientEmail: 'reclutamiento@tecnocarton.cl',
    emailSubjectPrefix: 'Postulación Web',
    responseTime: '5 días hábiles',
  },

  // SEO y metadata
  seo: {
    title: 'Tecnocarton - Soluciones de embalaje',
    description: 'Fabricantes de cartón corrugado desde 2003. Planchas, rollos, cajas a medida, cajas autoarmables, esquineros y consumibles. Entrega en todo Chile.',
    keywords: 'cartón corrugado, embalaje, cajas, planchas corrugadas, Chile, packaging',
    ogImage: '/og-image.jpg',
  },

  // Estadísticas para mostrar en el sitio
  stats: {
    monthlyProduction: '200M+',
    dailyCapacity: '10t',
    yearsExperience: 20,
    customerSatisfaction: 98,
  },
};

// Productos disponibles
export const products = [
  {
    id: 'planchas',
    name: 'Planchas Corrugadas',
    desc: '12C, 14C, 17C, 20C',
    minOrder: 'Mín. 1.500 unidades',
    image: '/productos/plancha.png',
    available: true
  },
  {
    id: 'rollos',
    name: 'Rollos de Corrugado',
    desc: 'Múltiples gramajes',
    minOrder: 'Mín. 300 kg',
    image: '/productos/carton corrugado.png',
    available: true
  },
  {
    id: 'troquelado',
    name: 'Cartón Troquelado',
    desc: 'Diseños personalizados',
    minOrder: 'Mín. 2.000 unidades',
    image: '/productos/troquelado.png',
    available: true
  },
  {
    id: 'cajas',
    name: 'Cajas a Medida',
    desc: 'Troqueladas y RSC',
    available: false,
    comingSoon: true
  },
  {
    id: 'autoarmables',
    name: 'Cajas Autoarmables',
    desc: 'Rápido armado',
    available: false,
    comingSoon: true
  }
];

// Tipos de cartón
export const cardboardTypes = [
  { type: '12C', weight: '~420 gr/m²', use: 'Productos ligeros' },
  { type: '14C', weight: '~450 gr/m²', use: 'Uso medio' },
  { type: '17C', weight: '~480 gr/m²', use: 'Uso general' },
  { type: '20C', weight: '~610 gr/m²', use: 'Cargas pesadas' }
];

// Pasos del proceso de producción (simplificado a 4 pasos)
export const processSteps = [
  { num: '01', title: 'Materia Prima', desc: 'Bobinas de papel kraft y liner de proveedores certificados', icon: 'package' },
  { num: '02', title: 'Corrugado y Laminado', desc: 'Formación de onda mediante calor y presión, unión con adhesivo base almidón', icon: 'layers' },
  { num: '03', title: 'Corte y Control', desc: 'Corte de precisión milimétrica con verificación de gramaje y resistencia', icon: 'check-square' },
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
  ]
};

// Casos de éxito
export const caseStudies = [
  {
    industry: 'E-commerce',
    company: 'Tienda Online Líder',
    challenge: 'Necesitaban cajas autoarmables que redujeran tiempo de empaque',
    solution: 'Diseñamos cajas con cierre automático sin cinta',
    result: '40% menos tiempo de empaque'
  },
  {
    industry: 'Agroindustria',
    company: 'Exportadora Frutícola',
    challenge: 'Requerían cajas resistentes a humedad para exportación',
    solution: 'Corrugado 20C con tratamiento especial',
    result: 'Cero reclamos por daño en tránsito'
  },
  {
    industry: 'Manufactura',
    company: 'Fábrica de Muebles',
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
  { name: 'Cartones RYR', logo: '/clientes/cartones ryr.png' },
  { name: 'CIC', logo: '/clientes/cic.jpeg' },
  { name: 'Colbox', logo: '/clientes/colbox.png' },
  { name: 'Copelec', logo: '/clientes/copelec.jpg' },
  { name: 'Ecomat', logo: '/clientes/ecomat.jpg' },
  { name: 'Ferretería Mueblista', logo: '/clientes/ferreteria_mueblista.png' },
  { name: 'Idelab', logo: '/clientes/idelab.png' },
  { name: 'Reminisen', logo: '/clientes/reminisen.jpg' },
  { name: 'Tubexa', logo: '/clientes/tubexa.gif' }
];

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
  { id: 'vendedor', name: 'Vendedor/Ejecutivo Comercial' },
  { id: 'administrativo', name: 'Administrativo' },
  { id: 'mantencion', name: 'Técnico en Mantención' },
  { id: 'otro', name: 'Otro' }
];
