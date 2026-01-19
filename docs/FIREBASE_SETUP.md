# Guía de Integración Firebase & Google Analytics

## 📋 Resumen

Esta guía te ayudará a conectar tu proyecto Firebase con Google Analytics en tu sitio web Tecnocarton. La integración incluye:

- ✅ Google Tag Manager (GTM) - Ya configurado con ID: `GTM-W5VXBNHX`
- ✅ Google Analytics a través de Firebase
- ✅ Eventos personalizados para cotizaciones, postulaciones y formularios de contacto

---

## 🔧 Paso 1: Obtener Credenciales de Firebase

### 1.1 Acceder a Firebase Console

1. Ve a [https://console.firebase.google.com](https://console.firebase.google.com)
2. Selecciona tu proyecto: **Tecnocarton** (o el nombre que hayas elegido)

### 1.2 Obtener las Credenciales Web

1. En el panel izquierdo, haz clic en **⚙️ Configuración del proyecto** (ícono de engranaje)
2. Ve a la pestaña **"Su aplicaciones"** o **"Apps"**
3. Busca la aplicación web (si no existe, haz clic en **"Agregar app"** y elige **Web**)
4. Copia el objeto de configuración que aparece

Verás algo como esto:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyDxxxxxxxxxxxxxx",
  authDomain: "tu-proyecto.firebaseapp.com",
  projectId: "tu-proyecto",
  storageBucket: "tu-proyecto.appspot.com",
  messagingSenderId: "1234567890",
  appId: "1:1234567890:web:abcdef123456",
  measurementId: "G-XXXXXXXXXX"
};
```

---

## 🎯 Paso 2: Configurar Variables de Entorno

### 2.1 Actualizar el archivo `.env.local`

Abre el archivo `.env.local` y completa las credenciales de Firebase:

```env
# Firebase & Google Analytics
NEXT_PUBLIC_FIREBASE_API_KEY="AIzaSyDxxxxxxxxxxxxxx"
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="tu-proyecto.firebaseapp.com"
NEXT_PUBLIC_FIREBASE_PROJECT_ID="tu-proyecto"
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="tu-proyecto.appspot.com"
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="1234567890"
NEXT_PUBLIC_FIREBASE_APP_ID="1:1234567890:web:abcdef123456"
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID="G-XXXXXXXXXX"
```

### 2.2 Reiniciar el servidor

Después de actualizar las variables, reinicia tu servidor de desarrollo:

```bash
npm run dev
```

---

## ✅ Paso 3: Verificar la Instalación

### 3.1 En Google Analytics

1. Ve a [https://analytics.google.com](https://analytics.google.com)
2. Selecciona tu propiedad de Tecnocarton
3. En la sección **"Informes"** → **"Tiempo real"**, deberías ver visitantes activos en tu sitio
4. Si ves datos, ¡está funcionando! ✅

### 3.2 En Google Tag Manager

1. Ve a [https://tagmanager.google.com](https://tagmanager.google.com)
2. Selecciona tu contenedor `GTM-W5VXBNHX`
3. Haz clic en **"Resumen"** para ver el estado
4. Verifica que el estado de las etiquetas muestre datos

### 3.3 En la Consola del Navegador

1. Abre tu sitio en un navegador
2. Presiona `F12` o `Ctrl+Shift+I` para abrir las herramientas del desarrollador
3. Ve a la pestaña **"Consola"**
4. Deberías ver el mensaje: **"Firebase inicializado correctamente"**

---

## 📊 Paso 4: Eventos Personalizados Disponibles

Los siguientes eventos ya están integrados en el sitio:

### 📋 Cotización Solicitada
```javascript
import { trackCotizationRequest } from '@/lib/firebase-client';

trackCotizationRequest('planchas'); // o 'rollos', 'troquelado', etc.
```

### 💼 Postulación Enviada
```javascript
import { trackJobApplication } from '@/lib/firebase-client';

trackJobApplication('operador-corrugadora'); // ID de la posición
```

### 📞 Formulario de Contacto
```javascript
import { trackContactForm } from '@/lib/firebase-client';

trackContactForm('cotizacion'); // tipo de formulario
```

### 👁️ Visualización de Página
```javascript
import { trackPageView } from '@/lib/firebase-client';

trackPageView('productos');
```

### 📌 Evento Personalizado Genérico
```javascript
import { trackEvent } from '@/lib/firebase-client';

trackEvent('mi_evento', {
  parametro1: 'valor1',
  parametro2: 'valor2',
});
```

---

## 🔌 Paso 5: Integrar Eventos en Componentes

### Ejemplo: Agregar tracking a un botón de cotización

Antes:
```jsx
<button onClick={handleQuote}>Solicitar Cotización</button>
```

Después:
```jsx
'use client';

import { trackCotizationRequest } from '@/lib/firebase-client';

export default function QuoteButton() {
  const handleQuote = () => {
    trackCotizationRequest('planchas');
    // ... resto del código
  };

  return (
    <button onClick={handleQuote}>Solicitar Cotización</button>
  );
}
```

---

## 📈 Paso 6: Monitorear en Google Analytics

Una vez que los eventos estén registrándose:

1. Ve a [https://analytics.google.com](https://analytics.google.com)
2. Selecciona **"Eventos"** en el menú izquierdo
3. Verás los eventos que se están enviando:
   - `cotizacion_solicitada`
   - `postulacion_enviada`
   - `formulario_contacto`
   - `page_view`
   - Y cualquier evento personalizado

---

## 🔒 Seguridad

- ✅ Las variables `NEXT_PUBLIC_*` son seguras para el cliente (Firebase lo requiere)
- ✅ Nunca expongas `FIREBASE_ADMIN_SDK_KEY` en el cliente
- ✅ Las credenciales están protegidas por restricciones de dominio en Firebase Console

---

## ❓ Solución de Problemas

### Firebase no se inicializa
- Verifica que todas las variables de entorno estén completas
- Revisa la consola del navegador (F12) para mensajes de error
- Asegúrate de que el archivo `.env.local` esté guardado

### No aparecen eventos en Google Analytics
- Espera 5-10 minutos después de hacer cambios (Google Analytics tarda en actualizar)
- Verifica que los eventos se estén registrando en la consola del navegador
- Asegúrate de que `NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID` es correcto

### Google Tag Manager muestra estado inactivo
- Verifica que `NEXT_PUBLIC_GTM_ID` sea `GTM-W5VXBNHX`
- Limpia el caché del navegador (Ctrl+Shift+Delete)
- Recarga la página

### El sitio es lento después de la integración
- Los scripts de Google Analytics se cargan con `strategy="afterInteractive"`
- Esto asegura que no bloqueen la carga inicial
- Si aún es lento, verifica tu conexión a internet

---

## 📚 Recursos Útiles

- [Documentación de Firebase](https://firebase.google.com/docs)
- [Guía de Google Analytics 4](https://support.google.com/analytics)
- [Documentación de Google Tag Manager](https://support.google.com/tagmanager)
- [SDK de Firebase para Web](https://www.npmjs.com/package/firebase)

---

## 📞 Soporte

Si necesitas ayuda adicional:
1. Revisa la consola del navegador (F12) para mensajes de error
2. Verifica los logs de Firebase Console
3. Consulta el estado de GTM en Tag Manager Console

---

**¡Listo!** Tu sitio Tecnocarton ahora está completamente integrado con Firebase y Google Analytics. 🎉
