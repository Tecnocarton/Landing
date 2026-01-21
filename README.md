# Tecnocarton Landing

Landing page corporativa para **Tecnocarton SpA**, fabricante de soluciones de embalaje en cartón corrugado desde 2003.

## Descripción

Este proyecto es una landing page moderna construida con **Next.js 14** y **React 18**, diseñada para:

- Presentar los productos y servicios de Tecnocarton
- Capturar cotizaciones mediante un formulario multi-paso
- Mostrar casos de éxito y clientes
- Recibir postulaciones laborales

### Funcionalidades Principales

| Funcionalidad | Descripción |
|---------------|-------------|
| **Formulario de Cotización** | Formulario de 3 pasos con validación en tiempo real |
| **Animaciones Magic UI** | Componentes animados (NumberTicker, FlipWords, TextGenerateEffect) |
| **Carrusel de Clientes** | Scroll infinito con logos de clientes |
| **Integración Email** | Envío de cotizaciones vía Resend API |
| **Analytics** | Google Analytics 4 + Google Tag Manager + Ads Conversion |
| **Responsive** | Diseño adaptativo para móvil, tablet y desktop |

---

## Instalación

### Prerrequisitos

- Node.js >= 18.x
- npm >= 9.x o yarn >= 1.22

### Pasos

```bash
# 1. Clonar el repositorio
git clone https://github.com/tecnocarton/landing.git
cd landing

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno
cp .env.example .env.local

# 4. Ejecutar en desarrollo
npm run dev
```

### Variables de Entorno

Crear archivo `.env.local` con las siguientes variables:

```env
# Resend (Email)
RESEND_API_KEY=re_xxxxxxxxxxxxx

# Redis (Contador de cotizaciones - opcional en desarrollo)
REDIS_URL=redis://localhost:6379

# Google Analytics
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
NEXT_PUBLIC_GTM_ID=GTM-XXXXXXX

# Google Ads Conversion
NEXT_PUBLIC_GOOGLE_ADS_ID=AW-XXXXXXXXX
NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_LABEL=XXXXXXXXX
```

### Scripts Disponibles

```bash
npm run dev      # Servidor de desarrollo (http://localhost:3000)
npm run build    # Build de producción
npm run start    # Servidor de producción
npm run lint     # Linting con ESLint
```

---

## Configuración en IDEs

### VS Code (Recomendado)

#### Extensiones Requeridas

```json
{
  "recommendations": [
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode",
    "bradlc.vscode-tailwindcss",
    "dsznajder.es7-react-js-snippets"
  ]
}
```

#### Settings Recomendados

Crear `.vscode/settings.json`:

```json
{
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit"
  },
  "tailwindCSS.includeLanguages": {
    "javascript": "javascript",
    "javascriptreact": "javascript"
  },
  "files.associations": {
    "*.css": "tailwindcss"
  }
}
```

### WebStorm / IntelliJ

1. Habilitar ESLint: `Settings > Languages & Frameworks > JavaScript > Code Quality Tools > ESLint`
2. Habilitar Tailwind CSS: `Settings > Languages & Frameworks > Style Sheets > Tailwind CSS`

---

## Debug

### Debugging en VS Code

Crear `.vscode/launch.json`:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Next.js: debug server-side",
      "type": "node-terminal",
      "request": "launch",
      "command": "npm run dev"
    },
    {
      "name": "Next.js: debug client-side",
      "type": "chrome",
      "request": "launch",
      "url": "http://localhost:3000"
    },
    {
      "name": "Next.js: debug full stack",
      "type": "node-terminal",
      "request": "launch",
      "command": "npm run dev",
      "serverReadyAction": {
        "pattern": "- Local:.+(https?://.+)",
        "uriFormat": "%s",
        "action": "debugWithChrome"
      }
    }
  ]
}
```

### Debug de APIs

```bash
# Ver logs de API en tiempo real
npm run dev

# Las APIs están en /app/api/
# - /api/contact - Formulario de cotización
# - /api/postulacion - Formulario de empleo
```

### Debug de Estilos

Los estilos utilizan CSS variables definidas en `/components/landing.css`:

```css
/* Inspeccionar variables en DevTools */
:root {
  --color-primary: #1B4D5C;
  --color-accent: #E67635;
  /* ... */
}
```

---

## Cómo Colaborar

### Workflow de Git

```bash
# 1. Crear rama desde dev
git checkout dev
git pull origin dev
git checkout -b feature/nombre-feature

# 2. Desarrollar y commitear
git add .
git commit -m "feat: descripción del cambio"

# 3. Push y crear PR
git push origin feature/nombre-feature
```

### Convención de Commits

```
feat:     Nueva funcionalidad
fix:      Corrección de bug
docs:     Cambios en documentación
style:    Cambios de formato (no afectan lógica)
refactor: Refactorización de código
perf:     Mejoras de rendimiento
test:     Agregar o modificar tests
chore:    Tareas de mantenimiento
```

### Checklist antes de PR

- [ ] `npm run build` sin errores
- [ ] Código formateado (`npm run lint`)
- [ ] Variables de entorno documentadas si hay nuevas
- [ ] README actualizado si aplica
- [ ] Responsive verificado (móvil, tablet, desktop)

---

## Ejemplos de Código

### Usar datos del sitio

```javascript
import { siteConfig, products, theme } from '../config/site';

// Acceder a configuración
console.log(siteConfig.company.name); // "Tecnocarton"
console.log(siteConfig.contact.email); // "ventas@tecnocarton.cl"

// Usar colores del tema
const styles = {
  color: theme.colors.primaryLight, // "#2E6A80"
  background: theme.gradients.accent, // "linear-gradient(...)"
};

// Listar productos
products.forEach(product => {
  console.log(product.name, product.minOrder);
});
```

### Agregar nueva sección con animación

```jsx
import { motion } from 'framer-motion';
import { SectionHeader } from './ui/section-header';

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 }
};

function NuevaSeccion() {
  return (
    <section style={{ padding: '80px 24px' }}>
      <SectionHeader
        label="Etiqueta"
        title="Título de la Sección"
      />
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeInUp}
        transition={{ duration: 0.6 }}
      >
        {/* Contenido */}
      </motion.div>
    </section>
  );
}
```

### Usar componentes Magic UI

```jsx
import { NumberTicker } from './ui/number-ticker';
import { FlipWords } from './ui/flip-words';
import { TextGenerateEffect } from './ui/text-generate-effect';

// Contador animado
<NumberTicker value={200} />

// Palabras rotativas
<FlipWords
  words={['innovación', 'calidad', 'servicio']}
  duration={3000}
/>

// Texto con efecto de aparición
<TextGenerateEffect
  words="Texto que aparece palabra por palabra"
  duration={0.4}
  staggerDelay={0.06}
/>
```

---

## Arquitectura

### Estructura del Proyecto

```
Landing/
├── app/                      # Next.js App Router
│   ├── api/                  # API Routes
│   │   ├── contact/          # Endpoint cotizaciones
│   │   └── postulacion/      # Endpoint postulaciones
│   ├── proceso/              # Página /proceso
│   ├── trabaja-con-nosotros/ # Página /trabaja-con-nosotros
│   ├── layout.js             # Layout principal (Analytics)
│   ├── page.js               # Home (Landing)
│   └── globals.css           # Tailwind imports
│
├── components/
│   ├── ui/                   # Componentes reutilizables
│   │   ├── number-ticker.jsx # Contador animado
│   │   ├── flip-words.jsx    # Palabras rotativas
│   │   ├── text-generate-effect.jsx
│   │   ├── section-header.jsx
│   │   └── cn.js             # Utilidad clsx + tailwind-merge
│   ├── landing.jsx           # Componente principal landing
│   └── landing.css           # Estilos del landing
│
├── config/
│   └── site.js               # Configuración centralizada
│                             # (datos empresa, productos, theme)
│
├── lib/
│   └── analytics.js          # Funciones de tracking
│
└── public/
    ├── productos/            # Imágenes de productos
    ├── clientes/             # Logos de clientes
    └── *.jpeg                # Imágenes hero
```

### Flujo de Datos

```
┌─────────────────────────────────────────────────────────────┐
│                        CLIENTE                               │
├─────────────────────────────────────────────────────────────┤
│  Landing Page (React + Framer Motion)                        │
│  ├── Formulario Cotización (3 pasos)                        │
│  ├── Validación cliente (EMAIL_REGEX)                       │
│  └── Tracking (GA4 + GTM + Google Ads)                      │
└──────────────────────┬──────────────────────────────────────┘
                       │ POST /api/contact
                       ▼
┌─────────────────────────────────────────────────────────────┐
│                      API ROUTES                              │
├─────────────────────────────────────────────────────────────┤
│  /api/contact                                                │
│  ├── Sanitización XSS (sanitizeInput)                       │
│  ├── Validación servidor                                    │
│  ├── Número correlativo (Redis / archivo local)             │
│  └── Envío email (Resend API)                               │
└──────────────────────┬──────────────────────────────────────┘
                       │
           ┌───────────┴───────────┐
           ▼                       ▼
┌──────────────────┐    ┌──────────────────┐
│     REDIS        │    │     RESEND       │
│ (Contador prod)  │    │  (Email API)     │
└──────────────────┘    └──────────────────┘
```

### Componentes UI

```
┌─────────────────────────────────────────┐
│           Magic UI Components            │
├─────────────────────────────────────────┤
│                                         │
│  NumberTicker                           │
│  ├── useSpring (Framer Motion)         │
│  ├── useInView (lazy animation)        │
│  └── prefers-reduced-motion support    │
│                                         │
│  FlipWords                              │
│  ├── AnimatePresence                   │
│  ├── 3D rotation + blur                │
│  └── Screen reader accessible          │
│                                         │
│  TextGenerateEffect                     │
│  ├── Word-by-word reveal               │
│  ├── Staggered animation               │
│  └── Blur effect                       │
│                                         │
│  SectionHeader                          │
│  ├── Reutilizable en 4 secciones       │
│  └── Motion animations                 │
│                                         │
└─────────────────────────────────────────┘
```

---

## Mantenimiento y Actualizaciones

### Cuándo Actualizar este README

- [ ] Se agregue o modifique una funcionalidad relevante
- [ ] Cambien los pasos de instalación o configuración
- [ ] Se requieran nuevas herramientas o plugins
- [ ] Se modifique la arquitectura del proyecto
- [ ] Se agreguen nuevas variables de entorno
- [ ] Cambien las convenciones de código

### Archivos Clave para Modificaciones

| Archivo | Propósito |
|---------|-----------|
| `config/site.js` | Datos de empresa, productos, colores, links |
| `components/landing.css` | Variables CSS, estilos globales |
| `components/landing.jsx` | Componente principal de la landing |
| `app/api/contact/route.js` | Lógica de envío de cotizaciones |
| `lib/analytics.js` | Configuración de tracking |

### Agregar Nuevos Productos

Editar `config/site.js`:

```javascript
export const products = [
  // ... productos existentes
  {
    id: 'nuevo-producto',
    name: 'Nuevo Producto',
    desc: 'Descripción breve',
    minOrder: 'Mín. 500 unidades',
    image: '/productos/nuevo.png',
    available: true
  }
];
```

### Modificar Colores

Los colores están centralizados en dos lugares que deben mantenerse sincronizados:

1. **CSS Variables** - `components/landing.css`:
```css
:root {
  --color-primary: #1B4D5C;
  --color-accent: #E67635;
  /* ... */
}
```

2. **Theme Object** - `config/site.js`:
```javascript
export const theme = {
  colors: {
    primary: '#1B4D5C',
    accent: '#E67635',
    // ...
  }
};
```

---

## Tecnologías

| Tecnología | Versión | Uso |
|------------|---------|-----|
| Next.js | 14.x | Framework React |
| React | 18.x | UI Library |
| Framer Motion | 11.x | Animaciones |
| Tailwind CSS | 4.x | Estilos utilitarios |
| Resend | - | API de Email |
| Redis | - | Contador persistente |

---

## Licencia

Propiedad de **Tecnocarton SpA**. Todos los derechos reservados.

---

## Contacto

- **Email**: ventas@tecnocarton.cl
- **Web**: [tecnocarton.cl](https://tecnocarton.cl)
- **LinkedIn**: [Tecnocarton](https://www.linkedin.com/company/tecnocarton/)
