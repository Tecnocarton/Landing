# 🚀 Quick Start - Firebase & Google Analytics

## Configuración Rápida en 5 Minutos

### 1️⃣ Obtén las Credenciales (2 min)

Ve a [Firebase Console](https://console.firebase.google.com) y copia tu configuración:

```
⚙️ Configuración del proyecto → Tu aplicación web
```

### 2️⃣ Actualiza `.env.local` (1 min)

```env
NEXT_PUBLIC_FIREBASE_API_KEY="tu_valor_aqui"
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="tu-proyecto.firebaseapp.com"
NEXT_PUBLIC_FIREBASE_PROJECT_ID="tu-proyecto"
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="tu-proyecto.appspot.com"
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="1234567890"
NEXT_PUBLIC_FIREBASE_APP_ID="1:1234567890:web:abcdef"
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID="G-XXXXXXXXXX"
```

### 3️⃣ Reinicia el Servidor (1 min)

```bash
npm run dev
```

### 4️⃣ Verifica en Google Analytics (1 min)

Abre [Google Analytics](https://analytics.google.com) y ve a **Tiempo Real**

### ✅ ¡Listo!

---

## 📦 Archivos Creados

```
Landing/
├── config/
│   └── firebase.js                 ← Configuración de Firebase
├── lib/
│   ├── firebase-client.js          ← Cliente Firebase con eventos
│   └── firebase-utils.js           ← Utilidades y helpers
├── components/
│   └── Analytics.jsx               ← Componente de Analytics
└── docs/
    ├── FIREBASE_SETUP.md           ← Guía detallada
    ├── EVENTOS_EJEMPLO.md          ← Ejemplos de código
    └── QUICKSTART.md               ← Este archivo
```

---

## 🎯 Eventos Disponibles

```javascript
import {
  trackCotizationRequest,    // Cotización solicitada
  trackJobApplication,       // Postulación enviada
  trackContactForm,          // Formulario de contacto
  trackPageView,            // Visualización de página
  trackEvent,               // Evento personalizado
} from '@/lib/firebase-client';

// Uso
trackCotizationRequest('planchas');
trackJobApplication('operador-corrugadora');
trackContactForm('contacto');
trackPageView('productos');
trackEvent('mi_evento', { param: 'valor' });
```

---

## 🔍 Verificación

```bash
# Busca este mensaje en la consola (F12)
"Firebase inicializado correctamente"

# O revisa el estado
npm run dev
```

---

## 📊 Dashboard Recomendado

| Plataforma | URL |
|-----------|-----|
| Google Analytics | https://analytics.google.com |
| Google Tag Manager | https://tagmanager.google.com |
| Firebase Console | https://console.firebase.google.com |

---

## 📞 Necesitas Ayuda?

- Guía completa: [FIREBASE_SETUP.md](./FIREBASE_SETUP.md)
- Ejemplos de código: [EVENTOS_EJEMPLO.md](./EVENTOS_EJEMPLO.md)
- Consola del navegador: F12 → Consola

---

**Estado actual:**
- ✅ Google Tag Manager: `GTM-W5VXBNHX`
- ⏳ Firebase: Pendiente de configurar
- 📊 Google Analytics: Pendiente de conectar

¡Sigue los pasos 1-4 arriba para completar la configuración! 🎉
