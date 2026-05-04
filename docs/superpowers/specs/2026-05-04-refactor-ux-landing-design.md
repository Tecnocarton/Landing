# Spec: Refactor progresivo + UX funcional — Tecnocarton Landing

**Fecha:** 2026-05-04
**Enfoque:** Opción A — Refactor quirúrgico sin cambio de estructura de archivos

---

## 1. Catálogo de productos (`config/site.js`)

### 1.1 Producto: Cajas a medida (`id: 'cajas'`)

| Campo | Valor anterior | Valor nuevo |
|---|---|---|
| `desc` | `'Troqueladas y RSC'` | `'Impresión hasta 2 colores'` |
| `available` | `false` | `true` |
| `comingSoon` | `true` | campo eliminado |
| `image` | ninguna | `'/productos/caja-convencional.png'` |
| `minOrder` | ninguno | `'Mín. 500 unidades'` |

> La imagen debe agregarse manualmente en `/public/productos/caja-convencional.png`.

### 1.2 Producto: Cajas autoarmables (`id: 'autoarmables'`)

Eliminar el objeto completo del array `products`. No hay referencias adicionales en el JSX que no se resuelvan dinámicamente desde el array.

---

## 2. Refactor de `landing.jsx`

### 2.1 Reemplazar `useEffect` duplicados por hooks de `lib/hooks.js`

Agregar import de `useScrolled` y `useCarousel` desde `'../lib/hooks'`.

Eliminar:
- `useEffect` de scroll listener (líneas ~138–142) → reemplazar por `const scrolled = useScrolled(50)`
- `useEffect` de carousel interval (líneas ~145–150) → reemplazar por `const [currentSlide, setCurrentSlide] = useCarousel(carouselImages.length, 5000)`

Mantener:
- `useEffect` de click outside del menú (líneas ~153–161) — no tiene equivalente en `lib/hooks.js`

### 2.2 Eliminar componentes definidos pero no usados

Eliminar completamente:
- Componente `StatCard` (memo, líneas ~33–59)
- Componente `ProductCard` (memo, líneas ~62–103)
- Sus respectivos `.displayName`

Ambos están definidos pero las secciones de stats y productos usan implementaciones inline distintas. Su presencia es dead code.

### 2.3 Fix UX: validación del paso 0 del formulario

El botón "Continuar" del paso 0 (selección de producto) debe deshabilitarse cuando `formData.producto === ''`.

Cambio en el JSX del botón:
- `disabled={formData.producto === ''}`
- Estilos de estado deshabilitado: `opacity: 0.5`, `cursor: 'not-allowed'`

Sin cambios en pasos 1 y 2 — ya tienen validación correcta.

---

## 3. Hover del carrusel de clientes: inline → CSS

### 3.1 Nueva clase en `landing.css`

Agregar `.client-card` con transición base y `.client-card:hover` con los estilos de hover actuales.

```css
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
  box-shadow: 0 8px 30px rgba(0,0,0,0.12);
  background: white;
}
```

### 3.2 En `landing.jsx`

En el carrusel de clientes, reemplazar el objeto de estilos inline con `filter`, `opacity`, `transition` y `background` por `className="client-card"`. Eliminar los handlers `onMouseEnter` y `onMouseLeave` del div.

---

## Archivos modificados

| Archivo | Tipo de cambio |
|---|---|
| `config/site.js` | Catálogo: actualizar `cajas`, eliminar `autoarmables` |
| `components/landing.jsx` | Usar hooks existentes, eliminar dead code, fix botón paso 0, quitar handlers hover |
| `components/landing.css` | Agregar `.client-card` y `.client-card:hover` |

## Archivos NO modificados

- `lib/hooks.js` — se usa tal cual, sin cambios
- `lib/design-tokens.js` — fuera de alcance de esta iteración
- Todos los demás componentes y páginas

---

## Criterios de éxito

- `landing.jsx` ya no redefine lógica que existe en `lib/hooks.js`
- No hay componentes React definidos sin ser usados
- El carrusel de clientes no usa `onMouseEnter`/`onMouseLeave` para estilos
- El paso 0 del formulario no permite avanzar sin seleccionar producto
- El catálogo muestra "Cajas a medida" como disponible con nueva descripción
- "Cajas autoarmables" no aparece en ninguna parte del sitio
