/**
 * Optimización de imágenes de public/ a WebP.
 * Uso: node scripts/optimize-images.mjs
 * Genera .webp (calidad 78, ancho máx 1920px) junto al original;
 * los originales pesados se eliminan a mano tras actualizar las referencias.
 */
import sharp from 'sharp';
import { statSync } from 'node:fs';
import path from 'node:path';

const PUBLIC = new URL('../public/', import.meta.url).pathname;

const TARGETS = [
  { in: 'stock_cajas.png', out: 'stock_cajas.webp' },
  { in: 'img1.jpeg', out: 'img1.webp' },
  { in: 'img2.jpeg', out: 'img2.webp' },
  { in: 'proceso.png', out: 'proceso.webp' },
  { in: 'productos/carton corrugado.png', out: 'productos/carton-corrugado.webp' },
  { in: 'productos/plancha.png', out: 'productos/plancha.webp' },
];

const kb = (bytes) => `${Math.round(bytes / 1024)} KB`;

for (const t of TARGETS) {
  const src = path.join(PUBLIC, t.in);
  const dest = path.join(PUBLIC, t.out);
  const before = statSync(src).size;
  await sharp(src)
    .rotate() // aplica la orientación EXIF antes de convertir (las fotos de celular la traen)
    .resize({ width: 1920, height: 1920, fit: 'inside', withoutEnlargement: true })
    .webp({ quality: 78 })
    .toFile(dest);
  const after = statSync(dest).size;
  console.log(`${t.in}: ${kb(before)} -> ${t.out}: ${kb(after)}`);
}
