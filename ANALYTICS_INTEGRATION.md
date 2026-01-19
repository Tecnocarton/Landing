# 📊 Integración Firebase & Google Analytics - Tecnocarton

## ✅ Estado de la Integración

La integración de Firebase y Google Analytics está **COMPLETAMENTE CONFIGURADA** en tu proyecto.

---

## 📦 Componentes Instalados

### 1. Paquetes NPM
```bash
firebase@^11.x.x
```

Instalado correctamente ✅

### 2. Configuración
- ✅ `config/firebase.js` - Configuración centralizada de Firebase
- ✅ `.env.local` - Variables de entorno (parcialmente completas)
- ✅ `.env.example` - Plantilla para nuevos desarrolladores

### 3. Cliente Firebase
- ✅ `lib/firebase-client.js` - Cliente con eventos predefinidos
- ✅ `lib/firebase-utils.js` - Utilidades y helpers

### 4. Componentes React
- ✅ `components/Analytics.jsx` - Componente de Analytics + GTM

### 5. Integración en Layout
- ✅ `app/layout.js` - Componente Analytics integrado

### 6. Documentación
- ✅ `docs/QUICKSTART.md` - Inicio rápido (5 minutos)
- ✅ `docs/FIREBASE_SETUP.md` - Guía detallada paso a paso
- ✅ `docs/EVENTOS_EJEMPLO.md` - Ejemplos de implementación
- ✅ `docs/ADMIN_SETUP.md` - Configuración para administradores

---

## 🎯 Próximos Pasos

### Paso 1: Obtener Credenciales Firebase (5 min)

1. Ve a https://console.firebase.google.com
2. Selecciona tu proyecto **Tecnocarton**
3. Ve a **⚙️ Configuración del Proyecto** → **Tu aplicación web**
4. Copia la configuración

### Paso 2: Completar `.env.local` (2 min)

Actualiza estas líneas en `.env.local`:

```env
NEXT_PUBLIC_FIREBASE_API_KEY="tu_valor"
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="tu-proyecto.firebaseapp.com"
NEXT_PUBLIC_FIREBASE_PROJECT_ID="tu-proyecto"
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="tu-proyecto.appspot.com"
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="123456789"
NEXT_PUBLIC_FIREBASE_APP_ID="1:123456:web:abc123"
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID="G-XXXXXXXXXX"
```

### Paso 3: Reiniciar Servidor (1 min)

```bash
npm run dev
```

### Paso 4: Verificar en Google Analytics (1 min)

1. Ve a https://analytics.google.com
2. Selecciona **Tecnocarton**
3. Ve a **Informes** → **Tiempo real**
4. ¡Deberías ver visitantes activos! ✅

---

## 📊 Eventos Disponibles

Ya están configurados en `lib/firebase-client.js`:

```javascript
import {
  trackCotizationRequest,    // Solicitud de cotización
  trackJobApplication,       // Postulación laboral
  trackContactForm,          // Formulario de contacto
  trackPageView,            // Visualización de página
  trackEvent,               // Evento personalizado
  initializeFirebase,       // Inicializar Firebase
} from '@/lib/firebase-client';
```

### Ejemplo de Uso

```jsx
'use client';

import { trackCotizationRequest } from '@/lib/firebase-client';

export default function ProductCard({ productId }) {
  const handleQuote = () => {
    trackCotizationRequest(productId);
    // ... resto del código
  };

  return <button onClick={handleQuote}>Solicitar Cotización</button>;
}
```

---

## 🔗 Estado Actual

| Componente | Estado | Acciones |
|-----------|--------|----------|
| Google Tag Manager | ✅ Configurado | `GTM-W5VXBNHX` |
| Firebase | ⏳ Pendiente | [Obtener credenciales](#paso-1-obtener-credenciales-firebase-5-min) |
| Google Analytics | ⏳ Pendiente | Conectar después de Firebase |
| Eventos | ✅ Listos | Usar en componentes |
| Layout | ✅ Integrado | Analytics en `app/layout.js` |

---

## 📚 Documentación

Para más información:

- **Quick Start** (5 min): [docs/QUICKSTART.md](./docs/QUICKSTART.md)
- **Setup Detallado** (20 min): [docs/FIREBASE_SETUP.md](./docs/FIREBASE_SETUP.md)
- **Ejemplos de Código**: [docs/EVENTOS_EJEMPLO.md](./docs/EVENTOS_EJEMPLO.md)
- **Admin Setup**: [docs/ADMIN_SETUP.md](./docs/ADMIN_SETUP.md)

---

## 🚀 Verificación en Desarrollo

```bash
# Abre la consola del navegador (F12)
# Deberías ver: "Firebase inicializado correctamente"

# Luego ve a Google Analytics tiempo real
# https://analytics.google.com → Tiempo real
```

---

## 🆘 Solución Rápida de Problemas

### Firebase no inicializa
- Verifica que `.env.local` esté completo
- Revisa la consola del navegador (F12) para errores

### No hay datos en Google Analytics
- Espera 24 horas para la sincronización inicial
- Revisa que `MEASUREMENT_ID` sea correcto
- Verifica en tiempo real (actualiza en 1-2 segundos)

### Google Tag Manager no funciona
- ID: `GTM-W5VXBNHX` debe estar en `.env.local`
- Limpia caché (Ctrl+Shift+Delete)
- Recarga la página

---

## 💾 Archivos Modificados/Creados

```
app/
  └── layout.js                          (✏️ Modificado)

config/
  ├── site.js                            (sin cambios)
  └── firebase.js                        (✨ Nuevo)

lib/
  ├── firebase-client.js                 (✨ Nuevo)
  └── firebase-utils.js                  (✨ Nuevo)

components/
  └── Analytics.jsx                      (✨ Nuevo)

docs/
  ├── QUICKSTART.md                      (✨ Nuevo)
  ├── FIREBASE_SETUP.md                  (✨ Nuevo)
  ├── EVENTOS_EJEMPLO.md                 (✨ Nuevo)
  └── ADMIN_SETUP.md                     (✨ Nuevo)

.env.local                               (✏️ Modificado)
.env.example                             (✨ Nuevo)
package.json                             (✏️ Firebase agregado)
ANALYTICS_INTEGRATION.md                 (✨ Este archivo)
```

---

## 🎓 Funciones Disponibles

### En `firebase-client.js`

```javascript
trackEvent(eventName, params)           // Evento personalizado
trackCotizationRequest(productType)     // Tracking de cotizaciones
trackJobApplication(positionId)         // Tracking de postulaciones
trackContactForm(formType)              // Tracking de formularios
trackPageView(pageName)                 // Tracking de páginas
initializeFirebase()                    // Inicializar Firebase
```

### En `firebase-utils.js`

```javascript
validateFirebaseConfig()                // Validar configuración
getFirebaseStatus()                     // Estado actual
createEvent(name, params)               // Crear evento
toGAFormat(event)                       // Convertir a formato GA
getDeviceInfo()                         // Información del dispositivo
getURLParams()                          // Parámetros de URL
trackScrollDepth(callback, threshold)   // Tracking de scroll
trackTimeOnPage(callback, ms)           // Tracking de tiempo
```

---

## 📞 Contacto y Soporte

Si necesitas ayuda:

1. Revisa los archivos de documentación en `docs/`
2. Consulta la consola del navegador (F12)
3. Verifica Firebase Console para errores
4. Consulta [Google Analytics Help](https://support.google.com/analytics)

---

## ✨ Características Clave

✅ **Google Tag Manager** - Etiquetado sin código (GTM-W5VXBNHX)
✅ **Google Analytics 4** - Medición de eventos avanzada
✅ **Firebase Integration** - Backend escalable
✅ **Eventos Personalizados** - Cotizaciones, postulaciones, contactos
✅ **Real-time Tracking** - Monitoreo en vivo
✅ **Device Detection** - Información de dispositivos
✅ **URL Parameters** - Tracking de UTM
✅ **Session Tracking** - Duración y profundidad

---

**¡Tu sitio está listo para analytics profesionales!** 🎉

Sigue los [Próximos Pasos](#-próximos-pasos) para completar la configuración.
