// Cliente Firebase para el lado del cliente
'use client';

import { initializeApp } from 'firebase/app';
import { getAnalytics, logEvent } from 'firebase/analytics';
import firebaseConfig from '../config/firebase';

let app;
let analytics;

// Inicializar Firebase solo en el cliente
const initializeFirebase = () => {
  if (typeof window !== 'undefined' && !app) {
    try {
      app = initializeApp(firebaseConfig);
      analytics = getAnalytics(app);
      console.log('Firebase inicializado correctamente');
    } catch (error) {
      console.error('Error inicializando Firebase:', error);
    }
  }
  return { app, analytics };
};

// Función para registrar eventos personalizados
export const trackEvent = (eventName, eventParams = {}) => {
  if (typeof window === 'undefined') return;

  const { analytics: gaInstance } = initializeFirebase();
  if (gaInstance) {
    try {
      logEvent(gaInstance, eventName, eventParams);
    } catch (error) {
      console.error('Error registrando evento:', error);
    }
  }
};

// Eventos específicos del negocio
export const trackCotizationRequest = (productType) => {
  trackEvent('cotizacion_solicitada', {
    product_type: productType,
    timestamp: new Date().toISOString(),
  });
};

export const trackJobApplication = (position) => {
  trackEvent('postulacion_enviada', {
    position: position,
    timestamp: new Date().toISOString(),
  });
};

export const trackContactForm = (formType) => {
  trackEvent('formulario_contacto', {
    form_type: formType,
    timestamp: new Date().toISOString(),
  });
};

export const trackPageView = (pageName) => {
  trackEvent('page_view', {
    page_name: pageName,
    timestamp: new Date().toISOString(),
  });
};

// Exportar la función de inicialización
export { initializeFirebase };
