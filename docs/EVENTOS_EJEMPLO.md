# Ejemplos de Implementación de Eventos Analytics

## 📊 Guía Práctica para Integrar Eventos en Componentes Existentes

---

## 1️⃣ Evento: Cotización Solicitada

**Dónde**: Cuando un usuario hace clic en "Solicitar Cotización"

### Ubicación típica
- Página de productos
- Tarjetas de producto
- Botón en secciones de características

### Código de Ejemplo

```jsx
// components/ProductCard.jsx
'use client';

import { trackCotizationRequest } from '@/lib/firebase-client';

export default function ProductCard({ product }) {
  const handleQuote = () => {
    // Registrar el evento
    trackCotizationRequest(product.id); // ej: 'planchas', 'rollos'

    // Luego ejecutar tu lógica
    // Abrir modal, ir a formulario, etc.
    console.log(`Cotización solicitada para: ${product.name}`);
  };

  return (
    <div className="product-card">
      <h3>{product.name}</h3>
      <p>{product.description}</p>
      <button onClick={handleQuote}>
        Solicitar Cotización
      </button>
    </div>
  );
}
```

---

## 2️⃣ Evento: Postulación Enviada

**Dónde**: Cuando un usuario envía una postulación laboral

### Ubicación típica
- Formulario de postulación
- Botón "Enviar Postulación"
- Modal de confirmación

### Código de Ejemplo

```jsx
// components/JobApplicationForm.jsx
'use client';

import { trackJobApplication } from '@/lib/firebase-client';

export default function JobApplicationForm({ jobId, jobTitle }) {
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Registrar el evento
    trackJobApplication(jobId);

    // Enviar formulario
    try {
      const formData = new FormData(e.target);
      const response = await fetch('/api/applications', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        alert('¡Postulación enviada exitosamente!');
      }
    } catch (error) {
      console.error('Error al enviar postulación:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        name="fullName"
        placeholder="Nombre completo"
        required
      />
      <input
        type="email"
        name="email"
        placeholder="Correo electrónico"
        required
      />
      <textarea
        name="coverLetter"
        placeholder="Carta de presentación"
        required
      />
      <button type="submit">Enviar Postulación</button>
    </form>
  );
}
```

---

## 3️⃣ Evento: Formulario de Contacto

**Dónde**: Cuando un usuario envía un formulario de contacto

### Ubicación típica
- Página de contacto
- Modal de contacto
- Formulario en la sección de soporte

### Código de Ejemplo

```jsx
// components/ContactForm.jsx
'use client';

import { trackContactForm } from '@/lib/firebase-client';

export default function ContactForm({ formType = 'general' }) {
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Registrar el evento
    trackContactForm(formType); // ej: 'general', 'cotizacion', 'soporte'

    // Enviar el formulario
    try {
      const formData = new FormData(e.target);
      const response = await fetch('/api/contact', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        alert('¡Mensaje enviado! Nos pondremos en contacto pronto.');
        e.target.reset();
      }
    } catch (error) {
      console.error('Error al enviar:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        name="email"
        placeholder="Tu correo"
        required
      />
      <input
        type="text"
        name="subject"
        placeholder="Asunto"
        required
      />
      <textarea
        name="message"
        placeholder="Tu mensaje"
        rows="5"
        required
      />
      <button type="submit">Enviar</button>
    </form>
  );
}
```

---

## 4️⃣ Evento: Visualización de Página

**Dónde**: Cuando se carga una sección importante

### Ubicación típica
- Página de productos
- Página de servicios
- Página de empleos
- Páginas de destino especiales

### Código de Ejemplo

```jsx
// components/ProductsPage.jsx
'use client';

import { useEffect } from 'react';
import { trackPageView } from '@/lib/firebase-client';

export default function ProductsPage() {
  useEffect(() => {
    // Registrar la visualización de esta página
    trackPageView('productos');
  }, []);

  return (
    <div>
      <h1>Nuestros Productos</h1>
      {/* Contenido de productos */}
    </div>
  );
}
```

---

## 5️⃣ Evento: Acciones Personalizadas

**Dónde**: Para eventos específicos del negocio

### Código de Ejemplo

```jsx
// components/ProductFilter.jsx
'use client';

import { trackEvent } from '@/lib/firebase-client';

export default function ProductFilter() {
  const handleFilterChange = (filterType, filterValue) => {
    // Registrar evento personalizado
    trackEvent('filtro_aplicado', {
      filter_type: filterType, // ej: 'gramaje', 'tipo'
      filter_value: filterValue, // ej: '20C', 'corrugado'
      timestamp: new Date().toISOString(),
    });

    // Aplicar el filtro
    console.log(`Filtrando por ${filterType}: ${filterValue}`);
  };

  return (
    <div className="filters">
      <button onClick={() => handleFilterChange('tipo', 'planchas')}>
        Planchas
      </button>
      <button onClick={() => handleFilterChange('tipo', 'rollos')}>
        Rollos
      </button>
    </div>
  );
}
```

---

## 6️⃣ Casos de Uso Reales en Tecnocarton

### Descarga de Catálogo

```jsx
'use client';

import { trackEvent } from '@/lib/firebase-client';

export default function DownloadCatalog() {
  const handleDownload = () => {
    trackEvent('catalogo_descargado', {
      formato: 'PDF',
      categoria: 'productos',
      timestamp: new Date().toISOString(),
    });

    // Iniciar descarga
    window.open('/catalogo-tecnocarton.pdf', '_blank');
  };

  return (
    <button onClick={handleDownload}>
      📥 Descargar Catálogo
    </button>
  );
}
```

### Visualización de Caso de Éxito

```jsx
'use client';

import { trackEvent } from '@/lib/firebase-client';

export default function CaseStudyCard({ study }) {
  const handleViewDetails = () => {
    trackEvent('caso_exito_visto', {
      industry: study.industry,
      company: study.company,
      timestamp: new Date().toISOString(),
    });
  };

  return (
    <div onClick={handleViewDetails}>
      <h3>{study.company}</h3>
      <p>{study.industry}</p>
    </div>
  );
}
```

### Contacto por WhatsApp

```jsx
'use client';

import { trackEvent } from '@/lib/firebase-client';

export default function WhatsAppButton() {
  const handleWhatsApp = () => {
    trackEvent('contacto_whatsapp', {
      source: window.location.pathname,
      timestamp: new Date().toISOString(),
    });

    // Abrir WhatsApp
    window.open('https://wa.me/56...', '_blank');
  };

  return (
    <button onClick={handleWhatsApp}>
      💬 Contactar por WhatsApp
    </button>
  );
}
```

---

## 📋 Checklist de Implementación

Cuando implementes eventos, asegúrate de:

- [ ] Importar la función de tracking correcta
- [ ] Llamar al evento **ANTES** de ejecutar la acción
- [ ] Usar `'use client'` en componentes con interactividad
- [ ] Incluir parámetros relevantes en el evento
- [ ] Verificar en Google Analytics que los eventos se registren
- [ ] Documentar el evento en tu equipo

---

## 🧪 Verificación en Desarrollo

Para ver los eventos en tiempo real mientras desarrollas:

1. Abre las herramientas de desarrollo (F12)
2. Ve a la pestaña "Red" o "Network"
3. Filtra por "gtag" o "google"
4. Verás las solicitudes cuando ocurran eventos

También en la consola verás:
```
Firebase inicializado correctamente
```

---

## 📊 Próximos Pasos

Después de implementar los eventos:

1. **Monitorea en Google Analytics**
   - Ve a analytics.google.com
   - Selecciona "Eventos" en el menú

2. **Crea conversiones**
   - Define qué eventos son "conversiones"
   - Así podrás medir ROI

3. **Configura alertas**
   - Recibe notificaciones cuando ocurran eventos importantes

4. **Usa datos para mejorar**
   - Analiza qué productos se consultan más
   - Identifica dónde los usuarios se van
   - Optimiza tu sitio basándote en datos reales

---

¡Listo! Ahora puedes empezar a trackear eventos en tu sitio. 🚀
