'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Package,
  Layers,
  CheckSquare,
  Truck,
  Recycle,
  Leaf,
  Droplet,
  ShieldCheck,
  Clock
} from 'lucide-react';
import { siteConfig, processSteps, sustainability, theme } from '../config/site';
import SharedFooter from './shared-footer';
import { SectionBeams } from './ui/section-beams';
import './landing.css';

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 }
  }
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1 }
};

const getProcessIcon = (iconName) => {
  const iconProps = { size: 28, color: 'white', strokeWidth: 2 };
  switch (iconName) {
    case 'package': return <Package {...iconProps} />;
    case 'layers': return <Layers {...iconProps} />;
    case 'check-square': return <CheckSquare {...iconProps} />;
    case 'truck': return <Truck {...iconProps} />;
    default: return null;
  }
};

const getSustainabilityIcon = (iconName) => {
  const iconProps = { size: 32, color: theme.colors.success, strokeWidth: 2 };
  switch (iconName) {
    case 'recycle': return <Recycle {...iconProps} />;
    case 'leaf': return <Leaf {...iconProps} />;
    case 'droplet': return <Droplet {...iconProps} />;
    case 'shield-check': return <ShieldCheck {...iconProps} />;
    default: return null;
  }
};

export default function Proceso() {
  const [scrolled, setScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div style={{ fontFamily: "'DM Sans', 'Segoe UI', system-ui, sans-serif", background: '#F8FAFB', minHeight: '100vh' }}>
      <style dangerouslySetInnerHTML={{ __html: `
        @media (max-width: 768px) {
          .process-grid { grid-template-columns: 1fr !important; }
          .sustainability-grid { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 500px) {
          .process-card { padding: 24px !important; }
        }
      ` }} />

      {/* Navigation */}
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
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 12, textDecoration: 'none' }}>
            <img
              src={siteConfig.company.logo}
              alt={siteConfig.company.name}
              style={{ height: 72, width: 'auto', objectFit: 'contain' }}
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="desktop-nav">
            <Link href="/proceso" className="nav-link" style={{ background: 'rgba(46,106,128,0.08)' }}>Proceso</Link>
            <Link href="/trabaja-con-nosotros" className="nav-link">Trabaja con nosotros</Link>
            <Link href="/#cotizar" className="btn-primary desktop-nav-cta" style={{ textDecoration: 'none' }}>
              Cotizar ahora
            </Link>
          </div>

          {/* Hamburger */}
          <button
            className={`hamburger always-visible ${isMenuOpen ? 'open' : ''}`}
            onClick={(e) => { e.stopPropagation(); setIsMenuOpen(!isMenuOpen); }}
            aria-label={isMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
            aria-expanded={isMenuOpen}
          >
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
          </button>

          {/* Mobile Menu */}
          <nav className={`mobile-menu ${isMenuOpen ? 'open' : ''}`}>
            <Link href="/proceso" onClick={() => setIsMenuOpen(false)} className="nav-link">Proceso</Link>
            <Link href="/trabaja-con-nosotros" onClick={() => setIsMenuOpen(false)} className="nav-link">Trabaja con Nosotros</Link>
            <Link href="/#cotizar" onClick={() => setIsMenuOpen(false)} className="btn-primary" style={{ textAlign: 'center', textDecoration: 'none', marginTop: 8 }}>
              Cotizar ahora
            </Link>
          </nav>
        </div>
      </motion.nav>

      {/* Hero */}
      <section style={{
        paddingTop: 140,
        paddingBottom: 60,
        background: `linear-gradient(135deg, ${theme.colors.primaryLight} 0%, ${theme.colors.primaryDark} 100%)`,
        position: 'relative',
        overflow: 'hidden'
      }}>
        <SectionBeams />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', textAlign: 'center', position: 'relative', zIndex: 1 }}
        >
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            style={{
              display: 'inline-block',
              background: `rgba(230,118,53,0.2)`,
              color: theme.colors.accentLight,
              padding: '8px 16px',
              borderRadius: 20,
              fontSize: 13,
              fontWeight: 600,
              marginBottom: 20,
              border: `1px solid rgba(230,118,53,0.3)`
            }}
          >
            Calidad industrial
          </motion.div>
          <h1 style={{
            fontSize: 'clamp(32px, 5vw, 48px)',
            fontWeight: 900,
            color: 'white',
            marginBottom: 16,
            letterSpacing: '-0.02em'
          }}>
            Proceso de producción
          </h1>
          <p style={{
            fontSize: 18,
            color: 'rgba(255,255,255,0.85)',
            maxWidth: 600,
            margin: '0 auto',
            lineHeight: 1.7
          }}>
            Conoce cada etapa de nuestro proceso productivo y nuestro compromiso con la calidad y la sostenibilidad.
          </p>
        </motion.div>
      </section>

      {/* Process Image Section */}
      <section className="section-padding" style={{ padding: '80px 24px', background: 'white' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={fadeInUp}
            transition={{ duration: 0.6 }}
            style={{ textAlign: 'center', marginBottom: 48 }}
          >
            <div className="section-label">Compromiso de calidad</div>
            <h2 className="gradient-text" style={{ fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 900, marginBottom: 16 }}>
              Nuestro proceso productivo
            </h2>
            <p style={{ color: theme.colors.textMuted, maxWidth: 600, margin: '0 auto', lineHeight: 1.7 }}>
              Cada producto pasa por un riguroso proceso que garantiza la máxima calidad
              y resistencia para proteger lo que más importa: tu mercancía.
            </p>
          </motion.div>

          {/* Imagen del proceso */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            variants={scaleIn}
            transition={{ duration: 0.6 }}
            className="card"
            style={{ padding: 0, overflow: 'hidden', marginBottom: 48 }}
          >
            <img
              src="/proceso.png"
              alt="Proceso de producción Tecnocarton"
              loading="lazy"
              style={{ width: '100%', height: 'auto', display: 'block' }}
            />
          </motion.div>

          {/* Process Steps */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            variants={staggerContainer}
            className="process-grid"
            style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 24 }}
          >
            {processSteps.map((step, i) => (
              <motion.div
                key={i}
                variants={fadeInUp}
                whileHover={{ y: -8, boxShadow: '0 20px 40px rgba(46,106,128,0.15)' }}
                transition={{ duration: 0.3 }}
                className="card process-card"
                style={{ padding: 28, textAlign: 'center' }}
              >
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                  style={{
                    width: 72,
                    height: 72,
                    background: i % 2 === 0
                      ? `linear-gradient(135deg, ${theme.colors.primaryLight}, ${theme.colors.primary})`
                      : `linear-gradient(135deg, ${theme.colors.accent}, ${theme.colors.accentLight})`,
                    borderRadius: 16,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 16px'
                  }}
                >
                  {getProcessIcon(step.icon)}
                </motion.div>
                <div style={{
                  fontSize: 12,
                  fontWeight: 700,
                  color: i % 2 === 0 ? theme.colors.primaryLight : theme.colors.accent,
                  marginBottom: 8,
                  textTransform: 'uppercase',
                  letterSpacing: 1
                }}>Paso {step.num}</div>
                <h4 style={{ fontSize: 18, fontWeight: 700, color: theme.colors.primaryLight, marginBottom: 12 }}>{step.title}</h4>
                <p style={{ fontSize: 14, color: theme.colors.textMuted, lineHeight: 1.6 }}>{step.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Sustainability Section */}
      <section id="sostenibilidad" className="section-padding" style={{ padding: '80px 24px', background: '#F0FDF4' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={fadeInUp}
            transition={{ duration: 0.6 }}
            style={{ textAlign: 'center', marginBottom: 60 }}
          >
            <div className="section-label" style={{ color: theme.colors.success }}>
              {sustainability.subtitle}
            </div>
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 900, marginBottom: 16, color: theme.colors.primaryLight }}>
              {sustainability.title}
            </h2>
            <p style={{ color: theme.colors.textMuted, maxWidth: 700, margin: '0 auto', lineHeight: 1.7 }}>
              {sustainability.description}
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            variants={staggerContainer}
            className="sustainability-grid"
            style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 24 }}
          >
            {sustainability.features.map((feature, i) => (
              <motion.div
                key={i}
                variants={fadeInUp}
                whileHover={{ y: -8, boxShadow: '0 20px 40px rgba(5,150,105,0.15)' }}
                transition={{ duration: 0.3 }}
                className="card"
                style={{
                  padding: 32,
                  textAlign: 'center',
                  background: 'white',
                  border: '2px solid #BBF7D0'
                }}
              >
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                  style={{
                    width: 72,
                    height: 72,
                    background: '#DCFCE7',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 20px'
                  }}
                >
                  {getSustainabilityIcon(feature.icon)}
                </motion.div>
                <h4 style={{ fontSize: 18, fontWeight: 700, color: theme.colors.primaryLight, marginBottom: 12 }}>{feature.title}</h4>
                <p style={{ fontSize: 14, color: theme.colors.textMuted, lineHeight: 1.6 }}>{feature.desc}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* Ley REP badge */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={scaleIn}
            transition={{ duration: 0.5, delay: 0.2 }}
            style={{
              marginTop: 48,
              padding: 24,
              background: `linear-gradient(135deg, ${theme.colors.success} 0%, ${theme.colors.successLight} 100%)`,
              borderRadius: 16,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 16,
              flexWrap: 'wrap'
            }}
          >
            <Clock size={40} color="white" strokeWidth={2} />
            <div style={{ color: 'white', textAlign: 'center' }}>
              <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 4 }}>Comprometidos con la Ley REP</div>
              <div style={{ fontSize: 14, opacity: 0.9 }}>Responsabilidad extendida del productor — Chile</div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{ padding: '80px 24px', background: 'white' }}>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          transition={{ duration: 0.6 }}
          style={{ maxWidth: 800, margin: '0 auto', textAlign: 'center' }}
        >
          <div className="section-label">¿Listo para cotizar?</div>
          <h3 style={{ fontSize: 'clamp(24px, 4vw, 36px)', fontWeight: 900, color: theme.colors.primaryLight, marginBottom: 16, letterSpacing: '-0.02em' }}>
            Solicita tu cotización sin compromiso
          </h3>
          <p style={{ color: theme.colors.textMuted, marginBottom: 32, fontSize: 16 }}>
            Recibe respuesta en menos de 24 horas hábiles.
          </p>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link href="/#cotizar" className="btn-primary" style={{ fontSize: 17, padding: '18px 40px', textDecoration: 'none', display: 'inline-block' }}>
              Solicitar cotización
            </Link>
          </motion.div>
        </motion.div>
      </section>

      <SharedFooter />
    </div>
  );
}
