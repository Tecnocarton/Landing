// Utilidades para Firebase
// Este archivo contiene funciones auxiliares para trabajar con Firebase

/**
 * Valida que todas las variables de entorno de Firebase estén configuradas
 * @returns {boolean} true si todas las variables están presentes
 */
export const validateFirebaseConfig = () => {
  const requiredEnvs = [
    'NEXT_PUBLIC_FIREBASE_API_KEY',
    'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
    'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
    'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET',
    'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
    'NEXT_PUBLIC_FIREBASE_APP_ID',
    'NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID',
  ];

  const missing = requiredEnvs.filter(
    (env) => !process.env[env] || process.env[env] === ''
  );

  if (missing.length > 0) {
    console.warn(
      '⚠️ Variables de entorno de Firebase faltantes:',
      missing.join(', ')
    );
    return false;
  }

  return true;
};

/**
 * Obtiene el estado de la configuración de Firebase
 * @returns {object} Estado con información detallada
 */
export const getFirebaseStatus = () => {
  const hasGTM = !!process.env.NEXT_PUBLIC_GTM_ID;
  const firebaseConfigured = validateFirebaseConfig();

  return {
    gtmConfigured: hasGTM,
    firebaseConfigured,
    gtmId: process.env.NEXT_PUBLIC_GTM_ID,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  };
};

/**
 * Genera un evento personalizado con parámetros predeterminados
 * @param {string} eventName - Nombre del evento
 * @param {object} params - Parámetros adicionales
 * @returns {object} Objeto del evento formateado
 */
export const createEvent = (eventName, params = {}) => {
  return {
    name: eventName,
    params: {
      ...params,
      timestamp: new Date().toISOString(),
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
      url: typeof window !== 'undefined' ? window.location.href : '',
    },
  };
};

/**
 * Convierte un evento a formato de Google Analytics
 * @param {object} event - Objeto del evento
 * @returns {object} Evento formateado para GA
 */
export const toGAFormat = (event) => {
  return {
    event_name: event.name,
    ...event.params,
  };
};

/**
 * Log helper para debugging en desarrollo
 * @param {string} message - Mensaje a registrar
 * @param {object} data - Datos adicionales
 */
export const logAnalyticsEvent = (message, data = {}) => {
  if (process.env.NODE_ENV === 'development') {
    console.log(`📊 [Analytics] ${message}`, data);
  }
};

/**
 * Obtiene información del navegador/dispositivo
 * @returns {object} Información del dispositivo
 */
export const getDeviceInfo = () => {
  if (typeof window === 'undefined') {
    return null;
  }

  return {
    isMobile: /iPhone|iPad|Android/i.test(navigator.userAgent),
    isTablet: /iPad|Android/i.test(navigator.userAgent),
    language: navigator.language,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  };
};

/**
 * Rastraea la duración de sesión
 * @returns {object} Métodos para iniciar y finalizar sesión
 */
export const createSessionTracker = () => {
  let startTime = Date.now();

  return {
    getSessionDuration: () => {
      return Math.round((Date.now() - startTime) / 1000); // en segundos
    },
    resetSessionTimer: () => {
      startTime = Date.now();
    },
  };
};

/**
 * Obtiene parámetros de URL (para UTM, etc.)
 * @returns {object} Parámetros de URL
 */
export const getURLParams = () => {
  if (typeof window === 'undefined') {
    return {};
  }

  const params = {};
  const searchParams = new URLSearchParams(window.location.search);

  searchParams.forEach((value, key) => {
    params[key] = value;
  });

  return params;
};

/**
 * Rastrear scroll profundo en página
 * @param {function} callback - Función a ejecutar cuando se alcanza profundidad
 * @param {number} threshold - Porcentaje de scroll (0-100)
 */
export const trackScrollDepth = (callback, threshold = 50) => {
  if (typeof window === 'undefined') return;

  let hasTriggered = false;

  const handleScroll = () => {
    if (hasTriggered) return;

    const scrollPercentage =
      (window.scrollY /
        (document.documentElement.scrollHeight - window.innerHeight)) *
      100;

    if (scrollPercentage >= threshold) {
      hasTriggered = true;
      callback();
      window.removeEventListener('scroll', handleScroll);
    }
  };

  window.addEventListener('scroll', handleScroll);

  return () => window.removeEventListener('scroll', handleScroll);
};

/**
 * Rastrear tiempo en página
 * @param {function} callback - Función a ejecutar después de cierto tiempo
 * @param {number} ms - Milisegundos
 */
export const trackTimeOnPage = (callback, ms = 10000) => {
  if (typeof window === 'undefined') return;

  const timer = setTimeout(() => {
    callback();
  }, ms);

  return () => clearTimeout(timer);
};
