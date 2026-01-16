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
    description: 'Ingeniería en Embalaje. Soluciones de cartón corrugado con capacidad industrial y flexibilidad artesanal.',
    foundedYear: 2003,
    logo: '/logotipo.png',
  },

  // Datos de contacto
  contact: {
    email: 'ventas1@tecnocarton.cl',
    phone: '+56 9 1234 5678', // Por confirmar con cliente
    phoneClean: '+56912345678', // Sin espacios para links tel:
    whatsapp: '+56912345678', // Por confirmar con cliente
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

  // Redes sociales (completar URLs cuando estén disponibles)
  social: {
    linkedin: '', // Por confirmar
    instagram: '', // Por confirmar
    facebook: '', // Por confirmar
  },

  // Configuración del formulario
  form: {
    recipientEmail: 'ventas1@tecnocarton.cl',
    emailSubjectPrefix: 'Cotización Web',
    responseTime: '24 horas hábiles',
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
    desc: '12C, 17C, 20C',
    available: true
  },
  {
    id: 'rollos',
    name: 'Rollos de Corrugado',
    desc: 'Múltiples gramajes',
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
  },
  {
    id: 'esquineros',
    name: 'Esquineros',
    desc: 'Protección extra',
    available: true
  },
  {
    id: 'consumibles',
    name: 'Consumibles',
    desc: 'Film, cintas, burbuja',
    available: true
  }
];

// Tipos de cartón
export const cardboardTypes = [
  { type: '12C (Sencillo)', weight: '~435 gr/m²', use: 'Productos ligeros' },
  { type: '17C (Doble)', weight: '~473 gr/m²', use: 'Uso general' },
  { type: '20C (Triple)', weight: '~619 gr/m²', use: 'Cargas pesadas' }
];

// Pasos del proceso de producción
export const processSteps = [
  { num: '01', title: 'Recepción de Materia Prima', desc: 'Bobinas de papel kraft y liner de proveedores certificados' },
  { num: '02', title: 'Corrugado', desc: 'Formación de la onda mediante calor y presión controlados' },
  { num: '03', title: 'Encolado y Laminado', desc: 'Unión de liners con adhesivo base almidón' },
  { num: '04', title: 'Corte y Troquelado', desc: 'Precisión milimétrica según especificaciones' },
  { num: '05', title: 'Control de Calidad', desc: 'Verificación de gramaje, resistencia y dimensiones' },
  { num: '06', title: 'Despacho', desc: 'Entrega con flota propia en todo Chile' }
];

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

// Sectores/industrias atendidas
export const sectors = [
  { name: 'E-commerce' },
  { name: 'Repostería' },
  { name: 'Vinos' },
  { name: 'Manufactura' },
  { name: 'Logística' },
  { name: 'Construcción' },
  { name: 'Mudanzas' },
  { name: 'Alimentos' }
];

// Certificaciones de calidad
export const qualityCertifications = [
  { text: 'Control de Gramaje' },
  { text: 'Prueba de Resistencia' },
  { text: 'Precisión Dimensional' },
  { text: 'Material Reciclable' }
];
