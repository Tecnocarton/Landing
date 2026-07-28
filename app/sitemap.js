import { SITE_URL } from '../lib/seo';
import { productos } from '../config/productos';
import { industrias } from '../config/industrias';

// Fichas técnicas (/productos, /productos/[slug]) y catálogo (/catalogo) están
// en BETA: sin el flag devuelven notFound(), así que no entran al sitemap.
const FICHAS_BETA = process.env.NEXT_PUBLIC_ENABLE_FICHAS_BETA === 'true';

// Rutas estáticas con su prioridad. Se excluye deliberadamente /cajas-stock:
// esa página está gateada tras NEXT_PUBLIC_ENABLE_BOXFINDER_BETA y en
// producción devuelve notFound(), por lo que no debe indexarse.
const staticRoutes = [
  { path: '/', priority: 1 },
  ...(FICHAS_BETA
    ? [
        { path: '/productos', priority: 0.8 },
        { path: '/catalogo', priority: 0.7 },
      ]
    : []),
  { path: '/industrias', priority: 0.8 },
  { path: '/nosotros', priority: 0.8 },
  { path: '/proceso', priority: 0.7 },
  { path: '/trabaja-con-nosotros', priority: 0.7 },
];

export default function sitemap() {
  const lastModified = new Date();

  const toEntry = ({ path, priority }) => ({
    url: path === '/' ? SITE_URL : `${SITE_URL}${path}`,
    lastModified,
    changeFrequency: 'monthly',
    priority,
  });

  // Rutas dinámicas: mismos slugs que consume generateStaticParams()
  // en app/productos/[slug]/page.js y app/industrias/[slug]/page.js
  // (campo `slug` de cada objeto en config/productos.js y config/industrias.js).
  const productoRoutes = FICHAS_BETA
    ? productos.map((p) => ({
        path: `/productos/${p.slug}`,
        priority: 0.6,
      }))
    : [];

  const industriaRoutes = industrias.map((i) => ({
    path: `/industrias/${i.slug}`,
    priority: 0.6,
  }));

  return [...staticRoutes, ...productoRoutes, ...industriaRoutes].map(toEntry);
}