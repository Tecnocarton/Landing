// Módulo centralizado de Analytics
// Integra Google Analytics 4, Google Tag Manager y Google Ads Conversions
'use client';

// ============================================
// CONFIGURACIÓN DE CONVERSIONES GOOGLE ADS
// ============================================
const GOOGLE_ADS_CONVERSIONS = {
  // Conversión principal: Formulario de cotización
  cotizacion: {
    send_to: 'AW-17883826137/9EHDCNSOwegbENmP1s9C',
    value: 100000, // Valor estimado en CLP
    currency: 'CLP',
  },
  // Conversión secundaria: Formulario trabaja con nosotros
  postulacion: {
    send_to: 'AW-17883826137/POSTULACION_LABEL', // Reemplazar con la etiqueta real cuando se configure
    value: 10000,
    currency: 'CLP',
  },
};

// ============================================
// FUNCIONES DE GOOGLE TAG MANAGER (dataLayer)
// ============================================

/**
 * Envía un evento al dataLayer de GTM
 * @param {string} eventName - Nombre del evento
 * @param {Object} eventData - Datos adicionales del evento
 */
export const pushToDataLayer = (eventName, eventData = {}) => {
  if (typeof window === 'undefined') return;

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event: eventName,
    ...eventData,
  });
};

// ============================================
// FUNCIONES DE GOOGLE ADS CONVERSIONS
// ============================================

/**
 * Registra una conversión en Google Ads
 * @param {string} conversionType - Tipo de conversión ('cotizacion' | 'postulacion')
 * @param {Object} additionalParams - Parámetros adicionales opcionales
 */
export const trackGoogleAdsConversion = (conversionType, additionalParams = {}) => {
  if (typeof window === 'undefined' || typeof window.gtag !== 'function') {
    console.warn('gtag no disponible para conversión de Google Ads');
    return;
  }

  const conversionConfig = GOOGLE_ADS_CONVERSIONS[conversionType];
  if (!conversionConfig) {
    console.warn(`Tipo de conversión no configurado: ${conversionType}`);
    return;
  }

  try {
    window.gtag('event', 'conversion', {
      send_to: conversionConfig.send_to,
      value: conversionConfig.value,
      currency: conversionConfig.currency,
      ...additionalParams,
    });
  } catch (error) {
    console.error('Error registrando conversión de Google Ads:', error);
  }
};

// ============================================
// EVENTOS DE NEGOCIO - COTIZACIÓN
// ============================================

/**
 * Registra el envío exitoso del formulario de cotización
 * Dispara eventos en: GTM dataLayer + Google Ads Conversion
 * @param {Object} formData - Datos del formulario
 */
export const trackCotizacionEnviada = (formData = {}) => {
  // 1. Evento para GTM (activadores personalizados)
  pushToDataLayer('cotizacion_enviada', {
    producto: formData.producto || '',
    empresa: formData.empresa || '',
  });

  // 2. Conversión de Google Ads
  trackGoogleAdsConversion('cotizacion', {
    transaction_id: formData.quoteNumber || `COT-${Date.now()}`,
  });
};

// ============================================
// EVENTOS DE NEGOCIO - POSTULACIÓN
// ============================================

/**
 * Registra el envío exitoso del formulario de postulación
 * Dispara eventos en: GTM dataLayer + Google Ads Conversion
 * @param {Object} formData - Datos del formulario
 */
export const trackPostulacionEnviada = (formData = {}) => {
  // 1. Evento para GTM (activadores personalizados)
  pushToDataLayer('postulacion_enviada', {
    oferta: formData.oferta || '',
    nombre: formData.nombre || '',
  });

  // 2. Conversión de Google Ads (cuando se configure la etiqueta)
  trackGoogleAdsConversion('postulacion');
};

// ============================================
// EVENTOS ADICIONALES
// ============================================

/**
 * Registra clics en botones de contacto (WhatsApp, teléfono, email)
 * @param {string} contactType - Tipo de contacto ('whatsapp' | 'phone' | 'email')
 */
export const trackContactClick = (contactType) => {
  pushToDataLayer('contact_click', {
    contact_type: contactType,
  });
};

/**
 * Registra navegación a secciones importantes
 * @param {string} sectionName - Nombre de la sección
 */
export const trackSectionView = (sectionName) => {
  pushToDataLayer('section_view', {
    section_name: sectionName,
  });
};
