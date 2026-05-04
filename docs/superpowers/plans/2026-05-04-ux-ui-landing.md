# UX/UI Landing Tecnocarton — Plan de implementación

> **Para agentes:** REQUIRED SUB-SKILL: Usa superpowers:subagent-driven-development (recomendado) o superpowers:executing-plans para implementar este plan tarea por tarea. Los pasos usan sintaxis checkbox (`- [ ]`) para seguimiento.

**Goal:** Mejorar la navegación responsive, accesibilidad del formulario y separación visual de secciones en la landing de Tecnocarton.

**Architecture:** Tres áreas independientes sobre dos archivos: CSS puro para nav responsive y accesibilidad visual, atributos ARIA en JSX para el formulario stepper, y cambio de fondos en secciones. Sin nueva lógica React, sin cambios en `lib/`, `config/` ni otras páginas.

**Tech Stack:** Next.js App Router, React 18, CSS custom properties (`landing.css`), ARIA/WAI-ARIA.

---

## Mapa de archivos

| Archivo | Cambios |
|---|---|
| `components/landing.css` | `.skip-link`, `.desktop-nav`, media queries, focus states, `prefers-reduced-motion` |
| `components/landing.jsx` | Skip link + `id="main-content"`, `.desktop-nav` div, ARIA en stepper y formulario, fondos de secciones |

> **NO modificar:** `lib/`, `config/`, `app/`, otras páginas.

---

## Tarea 1: CSS — Skip link, desktop nav y accesibilidad

**Archivos:**
- Modificar: `components/landing.css`

- [ ] **Paso 1: Leer el final del archivo `landing.css`**

```bash
tail -30 /Users/tomasmaldonado/Desktop/tecnocarton/Landing/components/landing.css
```

Confirma que las clases `.client-card`, `.footer-link`, etc. están al final. Agregar el nuevo CSS después de ellas.

- [ ] **Paso 2: Agregar clase `.skip-link`**

Al final de `components/landing.css`, agregar:

```css
/* Skip link para navegación por teclado */
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

- [ ] **Paso 3: Agregar `.desktop-nav` y media queries responsive**

Continuar al final del archivo:

```css
/* Desktop nav — links visibles en pantallas grandes */
.desktop-nav {
  display: none;
}

@media (min-width: 768px) {
  .desktop-nav {
    display: flex;
    align-items: center;
    gap: 24px;
  }
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

- [ ] **Paso 4: Agregar focus states para nav desktop**

Continuar al final del archivo:

```css
/* Focus states para navegación por teclado — desktop nav */
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

- [ ] **Paso 5: Agregar `prefers-reduced-motion`**

Continuar al final del archivo:

```css
/* Respeto por preferencia de movimiento reducido */
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

- [ ] **Paso 6: Verificar que el CSS es válido**

```bash
grep -n "\.skip-link\|\.desktop-nav\|prefers-reduced-motion" /Users/tomasmaldonado/Desktop/tecnocarton/Landing/components/landing.css
```

Expected: al menos 6 líneas con esos selectores.

- [ ] **Paso 7: Commit**

```bash
git add components/landing.css
git commit -m "feat: agregar CSS para nav responsive, skip link, focus states y prefers-reduced-motion"
```

---

## Tarea 2: JSX — Skip link y desktop nav en el nav

**Archivos:**
- Modificar: `components/landing.jsx` (área del nav, ~líneas 230–270)

- [ ] **Paso 1: Leer el área del nav en `landing.jsx`**

Lee desde la línea 225 hasta la 270 para ubicar la estructura exacta del `<motion.nav>`.

- [ ] **Paso 2: Agregar el skip link antes del `<motion.nav>`**

Localiza el inicio del JSX del componente (`return (`). El primer elemento del `return` es el `<div>` contenedor. Dentro de ese `<div>`, antes del `<motion.nav>`, agregar:

```jsx
<a href="#main-content" className="skip-link">
  Saltar al contenido principal
</a>
```

- [ ] **Paso 3: Agregar `id="main-content"` a la sección hero**

La sección hero es el `<section style={{ minHeight: '100vh', ... }}>` que aparece justo después del `</motion.nav>` (~línea 268). Agregar `id="main-content"`:

```jsx
<section id="main-content" style={{
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'center',
  position: 'relative',
  overflow: 'hidden'
}}>
```

- [ ] **Paso 4: Agregar el `<div className="desktop-nav">` dentro del nav**

Dentro del `<div>` de contenido del nav (el que tiene `maxWidth: 1200`), después del bloque del logo y antes del botón hamburger, agregar:

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

El resultado del nav debe quedar con esta estructura de hijos:
```
[div logo] → [div.desktop-nav] → [button.hamburger] → [nav.mobile-menu]
```

- [ ] **Paso 5: Verificar build**

```bash
cd /Users/tomasmaldonado/Desktop/tecnocarton/Landing && npm run build
```

Expected: sin errores.

- [ ] **Paso 6: Commit**

```bash
git add components/landing.jsx
git commit -m "feat: agregar skip link y desktop nav responsive"
```

---

## Tarea 3: JSX — Accesibilidad del formulario stepper

**Archivos:**
- Modificar: `components/landing.jsx` (área del formulario, ~líneas 790–960)

- [ ] **Paso 1: Leer el área del stepper y formulario**

Lee desde la línea 790 hasta la 870 para ubicar:
- El `<div>` contenedor de los step indicators (~línea 811)
- El `<motion.div>` que es el form card (~línea 838)
- El `<>` o div que envuelve el contenido de los pasos activos

- [ ] **Paso 2: Agregar `role="list"` al contenedor del stepper**

Busca:
```jsx
<div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginBottom: 40, flexWrap: 'wrap' }}>
  {['Producto', 'Especificaciones', 'Contacto'].map((step, i) => (
```

Reemplazar por:
```jsx
<div role="list" style={{ display: 'flex', justifyContent: 'center', gap: 8, marginBottom: 40, flexWrap: 'wrap' }}>
  {['Producto', 'Especificaciones', 'Contacto'].map((step, i) => (
```

- [ ] **Paso 3: Agregar `role="listitem"`, `aria-label` y `aria-current` a cada step indicator**

Busca el div interno de cada step:
```jsx
<div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
```

Reemplazar por:
```jsx
<div
  key={i}
  role="listitem"
  aria-label={`Paso ${i + 1} de 3: ${step}${activeStep > i ? ' — completado' : activeStep === i ? ' — actual' : ' — pendiente'}`}
  aria-current={activeStep === i ? 'step' : undefined}
  style={{ display: 'flex', alignItems: 'center', gap: 8 }}
>
```

- [ ] **Paso 4: Agregar `role="group"` y `aria-labelledby` al form card**

Localiza el `<motion.div>` del form card (~línea 838, el que tiene `className="card"` con padding y borderRadius). Agregar los atributos ARIA:

```jsx
<motion.div
  role="group"
  aria-labelledby="form-step-title"
  initial="hidden"
  whileInView="visible"
  ...
>
```

- [ ] **Paso 5: Agregar `id="form-step-title"` a los `<h4>` de cada paso**

Hay tres `<h4>` que encabezan cada paso. Cada uno recibe `id="form-step-title"`:

Paso 0 (selección de producto):
```jsx
<h4 id="form-step-title" style={{ fontSize: 20, fontWeight: 700, color: '#2E6A80', marginBottom: 24, textAlign: 'center' }}>
  ¿Qué producto necesitas?
</h4>
```

Paso 1 (especificaciones):
```jsx
<h4 id="form-step-title" style={{ fontSize: 20, fontWeight: 700, color: '#2E6A80', marginBottom: 24, textAlign: 'center' }}>
  Especificaciones del pedido
</h4>
```

Paso 2 (contacto):
```jsx
<h4 id="form-step-title" style={{ fontSize: 20, fontWeight: 700, color: '#2E6A80', marginBottom: 24, textAlign: 'center' }}>
  Datos de contacto
</h4>
```

> Nota: IDs duplicados en el DOM están permitidos cuando solo uno es visible a la vez (como en este stepper). El `aria-labelledby` del grupo siempre apuntará al `<h4>` del paso visible.

- [ ] **Paso 6: Agregar `aria-live` y `aria-atomic` al contenedor del contenido del paso activo**

Localiza el `<div>` o `<>` que envuelve las condiciones `{activeStep === 0 && ...}`, `{activeStep === 1 && ...}`, `{activeStep === 2 && ...}`. Es el hijo directo del form card que contiene el bloque `{formStatus.success ? ... : <>...</>}`.

El wrapper interno que renderiza los pasos debe recibir:
```jsx
<div aria-live="polite" aria-atomic="true">
  {formStatus.success ? (
    ...
  ) : (
    <>
      {activeStep === 0 && (...)}
      {activeStep === 1 && (...)}
      {activeStep === 2 && (...)}
    </>
  )}
</div>
```

- [ ] **Paso 7: Verificar build**

```bash
cd /Users/tomasmaldonado/Desktop/tecnocarton/Landing && npm run build
```

Expected: sin errores.

- [ ] **Paso 8: Commit**

```bash
git add components/landing.jsx
git commit -m "feat: agregar ARIA accessibility al formulario stepper (aria-live, aria-current, role=group)"
```

---

## Tarea 4: JSX — Alternancia de fondos entre secciones

**Archivos:**
- Modificar: `components/landing.jsx` (sección `id="casos"`, ~línea 695)

- [ ] **Paso 1: Verificar el fondo actual de las secciones**

```bash
grep -n "id=\"casos\"\|id=\"productos\"\|clients-section" /Users/tomasmaldonado/Desktop/tecnocarton/Landing/components/landing.jsx
```

Expected: líneas con `background: '#F8FAFB'` en casos y productos, y `background: '#F8FAFB'` en clients-section.

- [ ] **Paso 2: Cambiar el fondo de la sección "Casos de éxito"**

Busca:
```jsx
<section id="casos" className="section-padding" style={{ padding: '80px 24px', background: '#F8FAFB' }}>
```

Reemplazar por:
```jsx
<section id="casos" className="section-padding" style={{ padding: '80px 24px', background: 'white' }}>
```

- [ ] **Paso 3: Verificar fondos resultantes**

```bash
grep -n "background.*F8FAFB\|background.*white\|background.*#FFF" /Users/tomasmaldonado/Desktop/tecnocarton/Landing/components/landing.jsx | grep -i "section"
```

El patrón debe ser:
- Productos: `#F8FAFB`
- Casos: `white`
- Cotizar: gradiente azul (no cambia)
- Clientes: `#F8FAFB` (ya estaba así — no necesita cambio)

- [ ] **Paso 4: Verificar build**

```bash
cd /Users/tomasmaldonado/Desktop/tecnocarton/Landing && npm run build
```

Expected: sin errores.

- [ ] **Paso 5: Commit**

```bash
git add components/landing.jsx
git commit -m "fix: alternar fondos entre secciones productos/casos para separación visual"
```

---

## Verificación final

```bash
# Sin errores de build
cd /Users/tomasmaldonado/Desktop/tecnocarton/Landing && npm run build

# Skip link presente
grep -n "skip-link\|main-content" components/landing.jsx

# Desktop nav presente
grep -n "desktop-nav" components/landing.jsx components/landing.css

# ARIA en stepper
grep -n "aria-live\|aria-current\|role=\"list\"\|role=\"group\"\|form-step-title" components/landing.jsx

# Sección casos con fondo blanco
grep -n "id=\"casos\"" components/landing.jsx

# prefers-reduced-motion en CSS
grep -n "prefers-reduced-motion" components/landing.css

# Git log
git log --oneline -6
```
