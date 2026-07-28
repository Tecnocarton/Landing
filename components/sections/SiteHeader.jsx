'use client'

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { siteConfig } from '../../config/site';
import { scrollToSection } from '../../lib/motion';

// Enlace a /cajas-stock solo donde el BoxFinder (BETA) está activo (localhost).
const BOXFINDER_BETA = process.env.NEXT_PUBLIC_ENABLE_BOXFINDER_BETA === 'true';

// Fichas técnicas (/productos) y catálogo (/catalogo): contenido en BETA, aún en
// revisión. Sin el flag esas rutas hacen notFound(), así que tampoco se enlazan.
const FICHAS_BETA = process.env.NEXT_PUBLIC_ENABLE_FICHAS_BETA === 'true';

const LINKS = [
  ...(FICHAS_BETA ? [{ href: '/productos', label: 'Productos' }] : []),
  ...(BOXFINDER_BETA ? [{ href: '/cajas-stock', label: 'Cajas de stock' }] : []),
  { href: '/industrias', label: 'Industrias' },
  { href: '/nosotros', label: 'Nosotros' },
  { href: '/proceso', label: 'Proceso' },
  { href: '/trabaja-con-nosotros', label: 'Trabaja con nosotros' },
];

/**
 * Header único de todo el sitio (montado una sola vez en app/layout.js).
 * Compacto (logo 56) y sticky, con el mismo menú + hamburguesa en todas las
 * páginas. Reutiliza las clases de components/landing.css (desktop-nav,
 * nav-link, hamburger, mobile-menu, btn-primary, nav-shimmer).
 */
export default function SiteHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  // Cerrar el menú al hacer click fuera
  useEffect(() => {
    const close = () => setIsMenuOpen(false);
    if (isMenuOpen) document.addEventListener('click', close);
    return () => document.removeEventListener('click', close);
  }, [isMenuOpen]);

  // Cerrar el menú al cambiar de ruta
  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  const isHome = pathname === '/';
  const cotizarHref = isHome ? '#cotizar' : '/#cotizar';
  const onCotizar = (e) => {
    if (isHome) scrollToSection(e, 'cotizar');
    setIsMenuOpen(false);
  };

  return (
    <header
      className="nav-shimmer"
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        background: '#FEFEFE',
        boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
      }}
    >
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '12px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative' }}>
        <Link href="/" aria-label="Ir al inicio" style={{ display: 'flex', alignItems: 'center' }}>
          <img
            src={siteConfig.company.logo}
            alt={siteConfig.company.name}
            style={{ height: 56, width: 'auto', objectFit: 'contain' }}
          />
        </Link>

        {/* Desktop */}
        <div className="desktop-nav">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="nav-link"
              aria-current={pathname === l.href ? 'page' : undefined}
            >
              {l.label}
            </Link>
          ))}
          <a href={cotizarHref} onClick={onCotizar} className="btn-primary desktop-nav-cta" style={{ textDecoration: 'none' }}>
            Cotizar
          </a>
        </div>

        {/* Hamburguesa (móvil) */}
        <button
          className={`hamburger always-visible ${isMenuOpen ? 'open' : ''}`}
          onClick={(e) => { e.stopPropagation(); setIsMenuOpen(!isMenuOpen); }}
          aria-label={isMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
          aria-expanded={isMenuOpen}
          aria-controls="main-menu"
        >
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
        </button>

        {/* Menú móvil */}
        <nav id="main-menu" className={`mobile-menu ${isMenuOpen ? 'open' : ''}`} aria-label="Menú principal">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setIsMenuOpen(false)}
              className="nav-link"
              aria-current={pathname === l.href ? 'page' : undefined}
            >
              {l.label}
            </Link>
          ))}
          <a href={cotizarHref} onClick={onCotizar} className="btn-primary" style={{ textAlign: 'center', textDecoration: 'none', marginTop: 8 }}>
            Cotizar
          </a>
        </nav>
      </div>
    </header>
  );
}
