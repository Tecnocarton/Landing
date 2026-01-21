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
    legalName: 'Tecnocarton SpA',
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
    title: 'Tecnocarton - Soluciones de embalaje en cartón corrugado',
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
    name: 'Planchas corrugadas',
    desc: '12C, 14C, 17C, 20C',
    minOrder: 'Mín. 1.500 unidades',
    image: '/productos/plancha.png',
    available: true
  },
  {
    id: 'rollos',
    name: 'Rollos de corrugado',
    desc: 'Múltiples gramajes',
    minOrder: 'Mín. 300 kg',
    image: '/productos/carton corrugado.png',
    available: true
  },
  {
    id: 'troquelado',
    name: 'Cartón troquelado',
    desc: 'Diseños personalizados',
    minOrder: 'Mín. 2.000 unidades',
    image: '/productos/troquelado.png',
    available: true
  },
  {
    id: 'cajas',
    name: 'Cajas a medida',
    desc: 'Troqueladas y RSC',
    available: false,
    comingSoon: true
  },
  {
    id: 'autoarmables',
    name: 'Cajas autoarmables',
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
  ]
};

// Casos de éxito
export const caseStudies = [
  {
    industry: 'E-commerce',
    company: 'Tienda online',
    challenge: 'Necesitaban cajas autoarmables que redujeran tiempo de empaque',
    solution: 'Diseñamos cajas con cierre automático sin cinta',
    result: '40% menos tiempo de empaque'
  },
  {
    industry: 'Agroindustria',
    company: 'Exportadora frutícola',
    challenge: 'Requerían cajas resistentes a humedad para exportación',
    solution: 'Corrugado 20C con tratamiento especial',
    result: 'Cero reclamos por daño en tránsito'
  },
  {
    industry: 'Manufactura',
    company: 'Fábrica de muebles',
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

// Estadísticas para el Hero
export const stats = [
  { value: 90, suffix: '%+', label: 'Tasa de recompra' },
  { value: 200, suffix: '+', label: 'Clientes activos' },
  { value: 200, suffix: '+', label: 'Ton/Mes' },
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
  { name: 'Sobre Nosotros', href: null, section: null },
  { name: 'Proceso', href: '/proceso', section: null },
  { name: 'Casos de Éxito', href: null, section: 'casos' },
  { name: 'Trabaja con Nosotros', href: '/trabaja-con-nosotros', section: null }
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
