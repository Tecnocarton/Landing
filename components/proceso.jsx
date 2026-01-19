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
import {
  siteConfig,
  processSteps,
  sustainability
} from '../config/site';

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

export default function Proceso() {
  const [scrolled, setScrolled] = useState(false);
  const [currentYear, setCurrentYear] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    setCurrentYear(new Date().getFullYear().toString());
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
    const iconProps = { size: 32, color: '#059669', strokeWidth: 2 };
    switch (iconName) {
      case 'recycle': return <Recycle {...iconProps} />;
      case 'leaf': return <Leaf {...iconProps} />;
      case 'droplet': return <Droplet {...iconProps} />;
      case 'shield-check': return <ShieldCheck {...iconProps} />;
      default: return null;
    }
  };

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', background: '#FAFAFA', minHeight: '100vh' }}>
      <style dangerouslySetInnerHTML={{ __html: `
        .gradient-text {
          background: linear-gradient(135deg, #2E6A80 0%, #EE7E31 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .btn-primary {
          background: linear-gradient(135deg, #EE7E31 0%, #d66a1f 100%);
          color: white;
          border: none;
          padding: 16px 32px;
          border-radius: 8px;
          font-weight: 700;
          font-size: 16px;
          cursor: pointer;
          box-shadow: 0 4px 15px rgba(238,126,49,0.3);
          text-decoration: none;
          display: inline-block;
        }
        .card {
          background: white;
          border-radius: 16px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.05);
        }
        .nav-link {
          color: #2E6A80;
          text-decoration: none;
          font-weight: 500;
          padding: 8px 16px;
          border-radius: 6px;
          transition: background 0.2s ease;
        }
        .nav-link:hover {
          background: rgba(46,106,128,0.1);
        }
        /* Responsive Design */
        .desktop-nav {
          display: flex;
        }
        .hamburger {
          display: none;
          flex-direction: column;
          gap: 5px;
          cursor: pointer;
          padding: 8px;
        }
        .hamburger span {
          display: block;
          width: 24px;
          height: 2px;
          background: #2E6A80;
          transition: all 0.3s;
        }
        .mobile-menu {
          display: none;
          position: absolute;
          top: 100%;
          left: 0;
          right: 0;
          background: white;
          padding: 16px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.1);
          flex-direction: column;
          gap: 8px;
        }
        .mobile-menu.open {
          display: flex;
        }
        @media (max-width: 768px) {
          .desktop-nav {
            display: none !important;
          }
          .hamburger {
            display: flex !important;
          }
          .process-grid {
            grid-template-columns: 1fr !important;
          }
          .sustainability-grid {
            grid-template-columns: 1fr !important;
          }
          .section-padding {
            padding: 60px 16px !important;
          }
          .hero-section {
            padding: 120px 16px 60px !important;
          }
          .nav-container {
            padding: 12px 16px !important;
          }
          .footer-grid {
            grid-template-columns: 1fr !important;
            text-align: center;
          }
        }
        @media (max-width: 500px) {
          .hero-section {
            padding: 100px 12px 40px !important;
          }
          .btn-primary {
            padding: 12px 24px;
            font-size: 14px;
          }
          .process-card {
            padding: 24px !important;
          }
        }
      ` }} />

      {/* Navigation */}
      <motion.nav
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
        <div className="nav-container" style={{ maxWidth: 1200, margin: '0 auto', padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative' }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 12, textDecoration: 'none' }}>
            <img
              src={siteConfig.company.logo}
              alt={siteConfig.company.name}
              style={{ height: 67.5, width: 'auto', objectFit: 'contain' }}
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="desktop-nav" style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <Link href="/proceso" className="nav-link" style={{ background: 'rgba(46,106,128,0.1)' }}>Proceso</Link>
            <Link href="/trabaja-con-nosotros" className="nav-link">Trabaja con Nosotros</Link>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link href="/#cotizar" className="btn-primary" style={{ marginLeft: 16 }}>Cotizar Ahora</Link>
            </motion.div>
          </div>

          {/* Hamburger Menu */}
          <div
            className="hamburger"
            onClick={(e) => {
              e.stopPropagation();
              setIsMenuOpen(!isMenuOpen);
            }}
          >
            <span></span>
            <span></span>
            <span></span>
          </div>

          {/* Mobile Menu */}
          <div className={`mobile-menu ${isMenuOpen ? 'open' : ''}`}>
            <Link href="/proceso" onClick={() => setIsMenuOpen(false)} className="nav-link" style={{ background: 'rgba(46,106,128,0.1)' }}>Proceso</Link>
            <Link href="/trabaja-con-nosotros" onClick={() => setIsMenuOpen(false)} className="nav-link">Trabaja con Nosotros</Link>
            <Link href="/#cotizar" onClick={() => setIsMenuOpen(false)} className="btn-primary" style={{ textAlign: 'center', marginTop: 8 }}>Cotizar Ahora</Link>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section className="hero-section" style={{
        paddingTop: 140,
        paddingBottom: 60,
        background: 'linear-gradient(135deg, #2E6A80 0%, #1a4a5c 100%)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', textAlign: 'center' }}
        >
          <h1 style={{
            fontSize: 'clamp(32px, 5vw, 48px)',
            fontWeight: 900,
            color: 'white',
            marginBottom: 16
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
            <h2 style={{ fontSize: 14, fontWeight: 700, color: '#EE7E31', textTransform: 'uppercase', letterSpacing: 2, marginBottom: 12 }}>
              Compromiso de calidad
            </h2>
            <h3 className="gradient-text" style={{ fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 900, marginBottom: 16 }}>
              Nuestro proceso productivo
            </h3>
            <p style={{ color: '#6B7280', maxWidth: 600, margin: '0 auto', lineHeight: 1.7 }}>
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
              style={{ width: '100%', height: 'auto', display: 'block' }}
            />
          </motion.div>

          {/* Process Steps Cards */}
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
                      ? 'linear-gradient(135deg, #2E6A80, #3d8299)'
                      : 'linear-gradient(135deg, #EE7E31, #f5a66d)',
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
                  color: i % 2 === 0 ? '#2E6A80' : '#EE7E31',
                  marginBottom: 8,
                  textTransform: 'uppercase',
                  letterSpacing: 1
                }}>Paso {step.num}</div>
                <h4 style={{ fontSize: 18, fontWeight: 700, color: '#2E6A80', marginBottom: 12 }}>{step.title}</h4>
                <p style={{ fontSize: 14, color: '#6B7280', lineHeight: 1.6 }}>{step.desc}</p>
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
            <h2 style={{ fontSize: 14, fontWeight: 700, color: '#059669', textTransform: 'uppercase', letterSpacing: 2, marginBottom: 12 }}>
              {sustainability.subtitle}
            </h2>
            <h3 style={{ fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 900, marginBottom: 16, color: '#2E6A80' }}>
              {sustainability.title}
            </h3>
            <p style={{ color: '#6B7280', maxWidth: 700, margin: '0 auto', lineHeight: 1.7 }}>
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
                <h4 style={{ fontSize: 18, fontWeight: 700, color: '#2E6A80', marginBottom: 12 }}>{feature.title}</h4>
                <p style={{ fontSize: 14, color: '#6B7280', lineHeight: 1.6 }}>{feature.desc}</p>
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
              background: 'linear-gradient(135deg, #059669 0%, #10B981 100%)',
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
              <div style={{ fontSize: 14, opacity: 0.9 }}>Responsabilidad extendida del productor - Chile</div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{ padding: '60px 24px', background: 'white' }}>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          transition={{ duration: 0.6 }}
          style={{ maxWidth: 800, margin: '0 auto', textAlign: 'center' }}
        >
          <h3 style={{ fontSize: 'clamp(24px, 4vw, 32px)', fontWeight: 700, color: '#2E6A80', marginBottom: 16 }}>
            ¿Listo para cotizar?
          </h3>
          <p style={{ color: '#6B7280', marginBottom: 32, fontSize: 16 }}>
            Solicita una cotización sin compromiso y recibe respuesta en menos de 24 horas.
          </p>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link href="/#cotizar" className="btn-primary" style={{ fontSize: 18, padding: '18px 40px' }}>
              Solicitar Cotización
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer style={{
        background: '#1a1a2e',
        color: 'white',
        padding: '40px 24px 24px'
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', textAlign: 'center' }}>
          <Link href="/">
            <img
              src={siteConfig.company.logo}
              alt={siteConfig.company.name}
              style={{ height: 60, width: 'auto', objectFit: 'contain', marginBottom: 16 }}
            />
          </Link>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 14, marginBottom: 8 }}>
            {siteConfig.address.full}
          </p>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13 }}>
            © {currentYear} {siteConfig.company.name}. Todos los derechos reservados.
          </p>
          {siteConfig.social.linkedin && (
            <motion.a
              href={siteConfig.social.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ color: '#0077B5' }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                color: 'rgba(255,255,255,0.6)',
                textDecoration: 'none',
                marginTop: 16,
                fontSize: 14
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
              LinkedIn
            </motion.a>
          )}
        </div>
      </footer>
    </div>
  );
}
