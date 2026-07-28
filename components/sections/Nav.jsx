'use client'

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useScrolled } from '../../lib/hooks';
import { siteConfig } from '../../config/site';
import { scrollToSection } from '../../lib/motion';

// /cajas-stock depende del BoxFinder (BETA): el enlace solo aparece donde el
// flag está activo (localhost). En producción la ruta hace notFound().
const BOXFINDER_BETA = process.env.NEXT_PUBLIC_ENABLE_BOXFINDER_BETA === 'true';

// Fichas técnicas (/productos) en BETA: sin el flag la ruta hace notFound().
const FICHAS_BETA = process.env.NEXT_PUBLIC_ENABLE_FICHAS_BETA === 'true';

export default function Nav() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const scrolled = useScrolled(50);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      if (isMenuOpen) setIsMenuOpen(false);
    };
    if (isMenuOpen) {
      document.addEventListener('click', handleClickOutside);
    }
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isMenuOpen]);

  return (
    <motion.nav
      className="nav-shimmer"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 100, damping: 20 }}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        background: '#FEFEFE',
        boxShadow: scrolled ? '0 2px 20px rgba(0,0,0,0.1)' : '0 1px 3px rgba(0,0,0,0.05)',
        transition: 'box-shadow 0.3s'
      }}
    >
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <img
            src={siteConfig.company.logo}
            alt={siteConfig.company.name}
            style={{
              height: 72,
              width: 'auto',
              objectFit: 'contain'
            }}
          />
        </div>

        <div className="desktop-nav">
          {FICHAS_BETA && <a href="/productos" className="nav-link">Productos</a>}
          {BOXFINDER_BETA && <a href="/cajas-stock" className="nav-link">Cajas de stock</a>}
          <a href="/industrias" className="nav-link">Industrias</a>
          <a href="/nosotros" className="nav-link">Nosotros</a>
          <a href="/proceso" className="nav-link">Proceso</a>
          <a href="/trabaja-con-nosotros" className="nav-link">Trabaja con nosotros</a>
          <a
            href="#cotizar"
            onClick={(e) => scrollToSection(e, 'cotizar')}
            className="btn-primary desktop-nav-cta"
            style={{ textDecoration: 'none' }}
          >
            Cotizar ahora
          </a>
        </div>

        {/* Hamburger Menu - Always visible */}
        <button
          className={`hamburger always-visible ${isMenuOpen ? 'open' : ''}`}
          onClick={(e) => {
            e.stopPropagation();
            setIsMenuOpen(!isMenuOpen);
          }}
          aria-label={isMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
          aria-expanded={isMenuOpen}
          aria-controls="main-menu"
        >
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
        </button>

        {/* Dropdown Menu */}
        <nav id="main-menu" className={`mobile-menu ${isMenuOpen ? 'open' : ''}`} aria-label="Menú principal">
          {FICHAS_BETA && <a href="/productos" onClick={() => setIsMenuOpen(false)} className="nav-link">Productos</a>}
          {BOXFINDER_BETA && <a href="/cajas-stock" onClick={() => setIsMenuOpen(false)} className="nav-link">Cajas de stock</a>}
          <a href="/industrias" onClick={() => setIsMenuOpen(false)} className="nav-link">Industrias</a>
          <a href="/nosotros" onClick={() => setIsMenuOpen(false)} className="nav-link">Nosotros</a>
          <a href="/proceso" onClick={() => setIsMenuOpen(false)} className="nav-link">Proceso</a>
          <a href="/trabaja-con-nosotros" onClick={() => setIsMenuOpen(false)} className="nav-link">Trabaja con nosotros</a>
          <a href="#cotizar" onClick={(e) => { scrollToSection(e, 'cotizar'); setIsMenuOpen(false); }} className="btn-primary" style={{ textAlign: 'center', textDecoration: 'none', marginTop: 8 }}>Cotizar ahora</a>
        </nav>
      </div>
    </motion.nav>
  );
}
