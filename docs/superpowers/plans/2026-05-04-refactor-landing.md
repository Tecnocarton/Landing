# Refactor progresivo Landing Tecnocarton — Plan de implementación

> **Para agentes:** REQUIRED SUB-SKILL: Usa superpowers:subagent-driven-development (recomendado) o superpowers:executing-plans para implementar este plan tarea por tarea. Los pasos usan sintaxis checkbox (`- [ ]`) para seguimiento.

**Goal:** Limpiar deuda técnica concreta en la landing de Tecnocarton: conectar hooks existentes, eliminar dead code, mover hover a CSS, y actualizar el catálogo de productos.

**Architecture:** Refactor quirúrgico sobre los tres archivos existentes sin cambiar estructura de carpetas. Cada tarea es independiente y segura de aplicar por separado. No se modifica comportamiento visible del usuario.

**Tech Stack:** Next.js App Router, React 18, Framer Motion, CSS custom properties, `lib/hooks.js` (hooks propios ya existentes).

---

## Mapa de archivos

| Archivo | Cambios |
|---|---|
| `config/site.js` | Actualizar `cajas a medida`, eliminar `autoarmables` |
| `components/landing.jsx` | Importar y usar `useScrolled`/`useCarousel`, eliminar `StatCard`/`ProductCard` muertos |
| `components/landing.css` | Agregar `.client-card` y `.client-card:hover` |
| `components/landing.jsx` | Reemplazar handlers hover del carrusel de clientes por `className="client-card"` |

> **NO modificar:** `lib/hooks.js`, `lib/design-tokens.js`, `app/layout.js`, ni ninguna otra página.

---

## Tarea 1: Actualizar catálogo de productos en `config/site.js`

**Archivos:**
- Modificar: `config/site.js`

- [ ] **Paso 1: Abrir `config/site.js` y localizar el array `products`**

Busca el bloque que empieza en la línea ~75. Verás cuatro entradas: `planchas`, `rollos`, `cajas`, `autoarmables`.

- [ ] **Paso 2: Reemplazar el objeto `cajas` completo**

Busca:
```js
  {
    id: 'cajas',
    name: 'Cajas a medida',
    desc: 'Troqueladas y RSC',
    available: false,
    comingSoon: true
  },
```

Reemplazar por:
```js
  {
    id: 'cajas',
    name: 'Cajas a medida',
    desc: 'Impresión hasta 2 colores',
    minOrder: 'Mín. 500 unidades',
    image: '/productos/caja-convencional.png',
    available: true
  },
```

- [ ] **Paso 3: Eliminar el objeto `autoarmables` completo**

Busca y elimina este bloque (incluyendo la coma anterior si la hay):
```js
  {
    id: 'autoarmables',
    name: 'Cajas autoarmables',
    desc: 'Rápido armado',
    available: false,
    comingSoon: true
  }
```

- [ ] **Paso 4: Verificar que el array `products` queda con exactamente 3 entradas**

El resultado debe ser:
```js
export const products = [
  {
    id: 'planchas',
    name: 'Planchas corrugadas',
    desc: '12C, 14C, 17C, 20C',
    minOrder: 'Mín. 1.500 unidades',
    image: '/productos/plancha.png',
    available: true
  },
  {
    id: 'rollos',
    name: 'Rollos de corrugado',
    desc: 'Múltiples gramajes',
    minOrder: 'Mín. 300 kg',
    image: '/productos/carton corrugado.png',
    available: true
  },
  {
    id: 'cajas',
    name: 'Cajas a medida',
    desc: 'Impresión hasta 2 colores',
    minOrder: 'Mín. 500 unidades',
    image: '/productos/caja-convencional.png',
    available: true
  },
];
```

- [ ] **Paso 5: Commit**

```bash
git add config/site.js
git commit -m "feat: actualizar catálogo — cajas a medida disponible, eliminar autoarmables"
```

---

## Tarea 2: Reemplazar `useEffect` duplicados por hooks de `lib/hooks.js` en `landing.jsx`

**Archivos:**
- Modificar: `components/landing.jsx`

- [ ] **Paso 1: Agregar imports de `useScrolled` y `useCarousel`**

Busca la línea 3 de `landing.jsx`:
```js
import React, { useState, useEffect, useCallback, memo } from 'react';
```

Reemplazar por:
```js
import React, { useState, useEffect, useCallback, memo } from 'react';
import { useScrolled, useCarousel } from '../lib/hooks';
```

- [ ] **Paso 2: Eliminar el `useEffect` del scroll listener**

Dentro del componente `TecnocartonLanding`, busca y elimina este bloque completo (~línea 138):
```js
  // Passive scroll listener for better performance (client-passive-event-listeners)
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
```

- [ ] **Paso 3: Eliminar la declaración `const [scrolled, setScrolled] = useState(false)`**

Busca (~línea 132):
```js
  const [scrolled, setScrolled] = useState(false);
```
Eliminar esa línea.

- [ ] **Paso 4: Agregar `useScrolled` justo después de los otros `useState`**

Después de la línea `const [currentSlide, setCurrentSlide] = useState(0);`, agrega:
```js
  const scrolled = useScrolled(50);
```

- [ ] **Paso 5: Eliminar el `useEffect` del carousel interval**

Busca y elimina este bloque completo (~línea 145):
```js
  // Carousel auto-rotation
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [carouselImages.length]);
```

- [ ] **Paso 6: Eliminar la declaración `const [currentSlide, setCurrentSlide] = useState(0)`**

Busca (~línea 133):
```js
  const [currentSlide, setCurrentSlide] = useState(0);
```
Eliminar esa línea.

- [ ] **Paso 7: Agregar `useCarousel` reemplazando las declaraciones eliminadas**

Donde estaban los dos `useState` de `scrolled` y `currentSlide`, agrega al final del bloque de hooks:
```js
  const [currentSlide, setCurrentSlide] = useCarousel(carouselImages.length, 5000);
```

- [ ] **Paso 8: Verificar que `useEffect` sigue importado (lo necesita el click-outside)**

La línea de import debe quedar:
```js
import React, { useState, useEffect, useCallback, memo } from 'react';
```
`useEffect` debe mantenerse porque el `useEffect` de click-outside del menú sigue en el componente.

- [ ] **Paso 9: Verificar en el navegador que el scroll del nav y el carousel siguen funcionando**

Abre `http://localhost:3000` (o corre `npm run dev` si no está corriendo). Confirma:
- La navbar cambia de estilo al hacer scroll
- Las imágenes del hero rotan cada 5 segundos

- [ ] **Paso 10: Commit**

```bash
git add components/landing.jsx
git commit -m "refactor: usar useScrolled y useCarousel de lib/hooks en lugar de useEffect duplicados"
```

---

## Tarea 3: Eliminar componentes dead code (`StatCard` y `ProductCard`)

**Archivos:**
- Modificar: `components/landing.jsx`

- [ ] **Paso 1: Eliminar el componente `StatCard`**

Busca y elimina el bloque completo desde la línea ~33 hasta ~59 (incluyendo `StatCard.displayName`):
```js
// Memoized StatCard component for rerender optimization
const StatCard = memo(({ stat }) => (
  <motion.div
    variants={fadeInUp}
    whileHover={{ y: -8, boxShadow: '0 20px 40px rgba(46,106,128,0.2)' }}
    transition={{ duration: 0.3 }}
    className="card stat-card"
    style={{
      padding: 24,
      background: 'rgba(255,255,255,0.95)',
      textAlign: 'center'
    }}
  >
    <div className="stat-number" style={{ fontSize: 36, fontWeight: 900, color: theme.colors.primaryLight, marginBottom: 8 }}>
      {stat.isText ? stat.value : (
        <>
          <NumberTicker value={stat.value} />
          {stat.suffix}
        </>
      )}
    </div>
    <div style={{ fontSize: 14, color: theme.colors.textMuted, fontWeight: 500 }}>
      {stat.label}
    </div>
  </motion.div>
));

StatCard.displayName = 'StatCard';
```

- [ ] **Paso 2: Eliminar el componente `ProductCard`**

Busca y elimina el bloque completo desde la línea ~62 hasta ~103 (incluyendo `ProductCard.displayName`):
```js
// Memoized ProductCard component
const ProductCard = memo(({ product }) => (
  <motion.div
    variants={fadeInUp}
    whileHover={{ y: -8, boxShadow: '0 20px 40px rgba(46,106,128,0.15)' }}
    transition={{ duration: 0.3 }}
    className="card"
    style={{
      padding: 20,
      textAlign: 'center',
      position: 'relative',
      background: 'white'
    }}
  >
    {!product.available && (
      <div className="coming-soon-badge">Coming Soon</div>
    )}
    <div style={{
      width: 64,
      height: 64,
      background: theme.gradients.accent,
      borderRadius: 12,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      margin: '0 auto 16px',
      fontSize: 32
    }}>
      📦
    </div>
    <h4 style={{ fontSize: 16, fontWeight: 700, color: theme.colors.primaryLight, marginBottom: 8 }}>
      {product.name}
    </h4>
    <p style={{ fontSize: 12, color: theme.colors.textMuted, marginBottom: 12 }}>
      {product.desc}
    </p>
    <div style={{ fontSize: 11, color: theme.colors.accent, fontWeight: 600 }}>
      {product.minOrder}
    </div>
  </motion.div>
));

ProductCard.displayName = 'ProductCard';
```

- [ ] **Paso 3: Verificar que `memo` ya no se usa en el archivo**

Ejecuta en terminal:
```bash
grep -n "memo\|StatCard\|ProductCard" components/landing.jsx
```
Expected: sin resultados. Si `memo` aparece, significa que quedó en el import — eliminarlo de la línea de import de React:
```js
import React, { useState, useEffect, useCallback } from 'react';
```

- [ ] **Paso 4: Verificar que el sitio compila sin errores**

```bash
npm run build
```
Expected: compilación exitosa sin warnings de variables no usadas.

- [ ] **Paso 5: Commit**

```bash
git add components/landing.jsx
git commit -m "refactor: eliminar componentes StatCard y ProductCard definidos pero no usados"
```

---

## Tarea 4: Mover hover del carrusel de clientes a CSS

**Archivos:**
- Modificar: `components/landing.css`
- Modificar: `components/landing.jsx`

- [ ] **Paso 1: Agregar clase `.client-card` al final de `landing.css`**

Al final del archivo `components/landing.css`, agregar:
```css
/* Client carousel card hover */
.client-card {
  filter: grayscale(100%);
  opacity: 0.7;
  transition: all 0.3s ease;
  background: #E5E7EB;
}

.client-card:hover {
  filter: grayscale(0%);
  opacity: 1;
  transform: scale(1.05);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
  background: white;
}
```

- [ ] **Paso 2: En `landing.jsx`, localizar el div del carrusel de clientes**

Busca el `div` que tiene estos estilos inline (~línea 1393):
```jsx
<div
  key={i}
  style={{
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 200,
    height: 120,
    padding: '16px 28px',
    background: '#E5E7EB',
    borderRadius: 16,
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
    filter: 'grayscale(100%)',
    opacity: 0.7,
    transition: 'all 0.3s ease'
  }}
  onMouseEnter={e => {
    e.currentTarget.style.filter = 'grayscale(0%)';
    e.currentTarget.style.opacity = '1';
    e.currentTarget.style.transform = 'scale(1.05)';
    e.currentTarget.style.boxShadow = '0 8px 30px rgba(0,0,0,0.12)';
    e.currentTarget.style.background = 'white';
  }}
  onMouseLeave={e => {
    e.currentTarget.style.filter = 'grayscale(100%)';
    e.currentTarget.style.opacity = '0.7';
    e.currentTarget.style.transform = 'scale(1)';
    e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.08)';
    e.currentTarget.style.background = '#E5E7EB';
  }}
>
```

- [ ] **Paso 3: Reemplazar el div con la versión limpia usando `className="client-card"`**

Reemplazar el bloque completo por:
```jsx
<div
  key={i}
  className="client-card"
  style={{
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 200,
    height: 120,
    padding: '16px 28px',
    borderRadius: 16,
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
  }}
>
```

Los estilos de `background`, `filter`, `opacity` y `transition` pasan a ser responsabilidad de `.client-card` en CSS. Los handlers `onMouseEnter`/`onMouseLeave` se eliminan completamente.

- [ ] **Paso 4: Verificar hover en el navegador**

En `http://localhost:3000`, desplazarse hasta la sección de clientes. Al pasar el cursor sobre cada logo:
- Debe verse a color (sin escala de grises)
- Fondo debe cambiar a blanco
- Debe escalar ligeramente

- [ ] **Paso 5: Commit**

```bash
git add components/landing.css components/landing.jsx
git commit -m "refactor: mover hover del carrusel de clientes de JS inline a CSS"
```

---

## Verificación final

- [ ] Ejecutar `npm run build` y confirmar compilación sin errores
- [ ] Abrir el sitio en el navegador y recorrer: hero carousel, sección productos (verificar "Cajas a medida" disponible sin badge "Próximamente"), formulario de cotización (paso 0 bloquea avance sin producto), carrusel de clientes (hover funciona)
- [ ] Ejecutar `grep -n "StatCard\|ProductCard\|autoarmables" components/landing.jsx config/site.js` — debe retornar vacío
- [ ] Ejecutar `grep -n "onMouseEnter\|onMouseLeave" components/landing.jsx` — debe retornar vacío (o solo si hay otros elementos que los usen fuera del carrusel)
