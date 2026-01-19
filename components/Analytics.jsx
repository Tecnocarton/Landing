// Componente cliente para inicializar Firebase SDK
// Los scripts de GTM y GA4 se cargan en layout.js con beforeInteractive
'use client';

import { useEffect } from 'react';
import { initializeFirebase } from '../lib/firebase-client';

export default function Analytics() {
  useEffect(() => {
    // Inicializar Firebase SDK para eventos personalizados
    initializeFirebase();
  }, []);

  return null;
}
