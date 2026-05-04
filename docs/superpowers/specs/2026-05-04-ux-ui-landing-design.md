# Spec: UX/UI — Navegación responsive, accesibilidad y separación visual

**Fecha:** 2026-05-04
**Enfoque:** Opción A — CSS puro para nav, ARIA para accesibilidad, alternancia de fondos

---

## 1. Navegación responsive

### Objetivo
En desktop (≥ 768px): links `Proceso`, `Trabaja con nosotros` y botón `Cotizar ahora` visibles directamente en el nav. Sin hamburger.
En móvil (< 768px): comportamiento actual — hamburger + dropdown animado. Sin cambios en JSX ni lógica React.

### 1.1 Cambios en `landing.jsx`

Dentro del `<nav>`, junto al botón hamburger existente, agregar un `<div className="desktop-nav">` con los tres links:

```jsx
<div className="desktop-nav">
  <a href="/proceso" className="nav-link">Proceso</a>
  <a href="/trabaja-con-nosotros" className="nav-link">Trabaja con Nosotros</a>
  <a
    href="#cotizar"
    onClick={(e) => scrollToSection(e, 'cotizar')}
    className="btn-primary desktop-nav-cta"
    style={{ textDecoration: 'none' }}
  >
    Cotizar ahora
  </a>
</div>
```

El hamburger y el `mobile-menu` existentes NO se modifican en JSX.

### 1.2 Cambios en `landing.css`

```css
/* Desktop nav — visible en pantallas grandes */
.desktop-nav {
  display: none; /* oculto por defecto (mobile-first) */
}

@media (min-width: 768px) {
  .desktop-nav {
    display: flex;
    align-items: center;
    gap: 24px;
  }
  /* Ocultar hamburger y dropdown en desktop */
  .hamburger.always-visible {
    display: none;
  }
  .mobile-menu {
    display: none !important;
  }
  .desktop-nav-cta {
    padding: 10px 24px;
    font-size: 14px;
  }
}
```

### 1.3 Skip link para teclado

Agregar como primer elemento dentro del `<body>` (antes del `<nav>`), en `landing.jsx`:

```jsx
<a href="#main-content" className="skip-link">
  Saltar al contenido principal
</a>
```

Y en el `<main>` o primer `<section>` del contenido, agregar `id="main-content"`.

CSS en `landing.css`:
```css
.skip-link {
  position: absolute;
  top: -100%;
  left: 8px;
  background: var(--color-primary);
  color: white;
  padding: 8px 16px;
  border-radius: 0 0 6px 6px;
  font-weight: 600;
  font-size: 14px;
  text-decoration: none;
  z-index: 9999;
  transition: top 0.2s;
}
.skip-link:focus {
  top: 0;
}
```

### 1.4 Focus states para nav desktop

En `landing.css`, agregar `:focus-visible` explícito para los links del nav desktop:
```css
.desktop-nav .nav-link:focus-visible {
  outline: 2px solid var(--color-accent);
  outline-offset: 4px;
  border-radius: 4px;
}
.desktop-nav-cta:focus-visible {
  outline: 2px solid white;
  outline-offset: 4px;
}
```

### 1.5 Sin cambios en lógica React
`isMenuOpen`, `handleClickOutside` y el `useEffect` del click-outside se mantienen intactos — siguen operando para móvil.

---

## 2. Accesibilidad del formulario stepper

### Objetivo
Hacer el formulario de 3 pasos accesible para lectores de pantalla sin alterar estilos ni lógica de validación.

### 2.1 ARIA live region en el contenedor del paso activo

El `<div>` que envuelve el contenido del paso activo recibe:
```jsx
aria-live="polite"
aria-atomic="true"
```

Esto anuncia automáticamente el cambio de contenido al avanzar o retroceder pasos.

### 2.2 Labels en los step indicators

Cada indicador de paso del stepper recibe `aria-label` descriptivo y `aria-current` en el paso activo:

```jsx
{['Producto', 'Especificaciones', 'Contacto'].map((step, i) => (
  <div
    key={i}
    role="listitem"
    aria-label={`Paso ${i + 1} de 3: ${step}${activeStep > i ? ' — completado' : activeStep === i ? ' — actual' : ' — pendiente'}`}
    aria-current={activeStep === i ? 'step' : undefined}
    style={{ display: 'flex', alignItems: 'center', gap: 8 }}
  >
    ...
  </div>
))}
```

El contenedor del stepper recibe `role="list"`.

### 2.3 `role="group"` con `aria-labelledby` en el formulario

El `<div>` contenedor del formulario (el que envuelve los tres pasos) recibe:
```jsx
role="group"
aria-labelledby="form-step-title"
```

El `<h4>` del título de cada paso recibe `id="form-step-title"`, dando contexto semántico al grupo activo.

---

## 3. Separación visual de secciones

### Objetivo
Crear alternancia de fondos entre secciones consecutivas que actualmente comparten el mismo color `#F8FAFB`.

### Cambios en `landing.jsx`

| Sección | Fondo actual | Fondo nuevo |
|---|---|---|
| Productos (`id="productos"`) | `#F8FAFB` | sin cambio |
| Casos de éxito (`id="casos"`) | `#F8FAFB` | `white` / `#FFFFFF` |
| Clientes (sección sin id) | `white` | `#F8FAFB` |

Solo se modifica el atributo `background` en el `style` inline de cada `<section>`.

---

## 4. `prefers-reduced-motion`

Agregar al final de `landing.css` una media query que desactiva transiciones para usuarios que lo prefieren:

```css
@media (prefers-reduced-motion: reduce) {
  .client-card,
  .footer-link,
  .footer-linkedin-btn,
  .footer-linkedin-link,
  .skip-link,
  .desktop-nav .nav-link {
    transition: none;
  }
}
```

Esto cubre todas las clases CSS nuevas añadidas en el refactor y en este spec.

---

## Archivos modificados

| Archivo | Cambios |
|---|---|
| `components/landing.jsx` | Skip link, `id="main-content"` en hero, `<div className="desktop-nav">`, ARIA en stepper, alternancia de fondos |
| `components/landing.css` | `.skip-link`, `.desktop-nav`, media queries responsive, focus states, `prefers-reduced-motion` |

## Archivos NO modificados
- `lib/hooks.js`, `config/site.js`, `app/layout.js`, otras páginas

---

## Criterios de éxito

- Skip link visible al recibir foco con teclado, oculto visualmente en reposo
- En viewport ≥ 768px: links de nav visibles en línea, hamburger oculto
- En viewport < 768px: hamburger visible, links de nav ocultos, dropdown funciona igual
- Links del nav desktop tienen `:focus-visible` con outline visible
- El stepper del formulario tiene `aria-live`, `aria-current` y `role="group"`
- Sección "Casos de éxito" tiene fondo blanco
- Sección "Clientes" tiene fondo `#F8FAFB`
- `prefers-reduced-motion: reduce` desactiva transiciones de clases nuevas
- Sin cambios en comportamiento ni estilos existentes fuera de lo especificado
