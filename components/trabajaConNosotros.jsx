'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { TrendingUp, Users, Shield } from 'lucide-react';
import { siteConfig, jobOffers, theme } from '../config/site';
import { trackPostulacionEnviada } from '../lib/analytics';
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
    transition: { staggerChildren: 0.1, delayChildren: 0.1 }
  }
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1 }
};

const benefits = [
  {
    icon: <TrendingUp size={32} color={theme.colors.primaryLight} strokeWidth={2} />,
    iconBg: '#E8F4F8',
    title: 'Crecimiento',
    desc: 'Oportunidades de desarrollo y capacitación continua'
  },
  {
    icon: <Users size={32} color={theme.colors.accent} strokeWidth={2} />,
    iconBg: 'rgba(230,118,53,0.1)',
    title: 'Buen ambiente',
    desc: 'Equipo colaborativo y ambiente laboral positivo'
  },
  {
    icon: <Shield size={32} color={theme.colors.success} strokeWidth={2} />,
    iconBg: '#E8F9F0',
    title: 'Estabilidad',
    desc: 'Empresa sólida con más de 20 años en el mercado'
  }
];

export default function TrabajaConNosotros() {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    motivacion: '',
    cv: null
  });
  const [formErrors, setFormErrors] = useState({});
  const [formStatus, setFormStatus] = useState({ loading: false, success: false, error: null });
  const [selectedOffer, setSelectedOffer] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const activeOffers = jobOffers.filter(offer => offer.active);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.type !== 'application/pdf') {
      setFormErrors(prev => ({ ...prev, cv: 'Solo se permiten archivos PDF' }));
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setFormErrors(prev => ({ ...prev, cv: 'El archivo no puede superar los 2MB' }));
      return;
    }
    setFormData(prev => ({ ...prev, cv: file }));
    setFormErrors(prev => ({ ...prev, cv: null }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = {};
    if (!formData.nombre || formData.nombre.trim().length < 2) errors.nombre = 'Nombre requerido';
    if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) errors.email = 'Email inválido';
    if (!formData.telefono || formData.telefono.replace(/\D/g, '').length < 8) errors.telefono = 'Teléfono inválido';
    if (!formData.motivacion || formData.motivacion.trim().length < 20) errors.motivacion = 'Cuéntanos más sobre ti (mínimo 20 caracteres)';
    if (!formData.cv) errors.cv = 'Debes adjuntar tu CV';

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setFormStatus({ loading: true, success: false, error: null });

    try {
      const submitData = new FormData();
      submitData.append('nombre', formData.nombre);
      submitData.append('email', formData.email);
      submitData.append('telefono', formData.telefono);
      submitData.append('motivacion', formData.motivacion);
      submitData.append('cv', formData.cv);

      const response = await fetch('/api/postulacion', { method: 'POST', body: submitData });
      const data = await response.json();

      if (data.success) {
        setFormStatus({ loading: false, success: true, error: null });
        trackPostulacionEnviada({
          nombre: formData.nombre,
          oferta: selectedOffer?.titulo || 'Postulación espontánea',
        });
        setTimeout(() => {
          setFormData({ nombre: '', email: '', telefono: '', motivacion: '', cv: null });
          setFormStatus({ loading: false, success: false, error: null });
        }, 5000);
      } else {
        setFormStatus({ loading: false, success: false, error: data.message || 'Error al enviar' });
      }
    } catch (error) {
      console.error('Error:', error);
      setFormStatus({ loading: false, success: false, error: 'Error de conexión. Intenta nuevamente.' });
    }
  };

  return (
    <div style={{ fontFamily: "'DM Sans', 'Segoe UI', system-ui, sans-serif", minHeight: '100vh', background: '#F8FAFB' }}>
      <style dangerouslySetInnerHTML={{ __html: `
        .file-input-wrapper {
          position: relative;
          border: 2px dashed var(--color-border-input);
          border-radius: 12px;
          padding: 24px;
          text-align: center;
          cursor: pointer;
          transition: all 0.3s;
        }
        .file-input-wrapper:hover {
          border-color: var(--color-primary);
          background: rgba(27,77,92,0.02);
        }
        .file-input-wrapper.has-file {
          border-color: var(--color-success);
          background: var(--color-success-bg);
        }
        .file-input-wrapper.error {
          border-color: var(--color-error);
        }
        @media (max-width: 768px) {
          .benefits-grid { grid-template-columns: 1fr !important; }
          .jobs-grid { grid-template-columns: 1fr !important; }
          .form-card { padding: 24px !important; }
        }
        @media (max-width: 500px) {
          .form-card { padding: 16px !important; }
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
            <Link href="/proceso" className="nav-link">Proceso</Link>
            <Link href="/trabaja-con-nosotros" className="nav-link" style={{ background: 'rgba(46,106,128,0.08)' }}>Trabaja con Nosotros</Link>
            <Link href="/#cotizar" className="btn-primary desktop-nav-cta" style={{ textDecoration: 'none' }}>
              Cotizar Ahora
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
              Cotizar Ahora
            </Link>
          </nav>
        </div>
      </motion.nav>

      {/* Hero */}
      <section style={{
        background: `linear-gradient(135deg, ${theme.colors.primaryLight} 0%, ${theme.colors.primaryDark} 100%)`,
        padding: '140px 24px 80px',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <SectionBeams />
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          style={{ maxWidth: 700, margin: '0 auto', position: 'relative', zIndex: 1 }}
        >
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            style={{
              display: 'inline-block',
              background: 'rgba(230,118,53,0.2)',
              color: theme.colors.accentLight,
              padding: '8px 16px',
              borderRadius: 20,
              fontSize: 13,
              fontWeight: 600,
              marginBottom: 20,
              border: '1px solid rgba(230,118,53,0.3)'
            }}
          >
            Únete al equipo
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            style={{ fontSize: 'clamp(32px, 5vw, 48px)', fontWeight: 900, color: 'white', marginBottom: 16, letterSpacing: '-0.02em' }}
          >
            Trabaja con nosotros
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            style={{ fontSize: 18, color: 'rgba(255,255,255,0.85)', lineHeight: 1.7 }}
          >
            Únete a nuestro equipo y forma parte de una empresa líder en soluciones de embalaje.
            Buscamos personas comprometidas y con ganas de crecer profesionalmente.
          </motion.p>
        </motion.div>
      </section>

      {/* Benefits */}
      <section className="section-padding" style={{ padding: '80px 24px', background: 'white' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={fadeInUp}
            transition={{ duration: 0.6 }}
            style={{ textAlign: 'center', marginBottom: 48 }}
          >
            <div className="section-label">Beneficios</div>
            <h2 style={{ fontSize: 'clamp(24px, 4vw, 36px)', fontWeight: 900, color: theme.colors.primaryLight, marginBottom: 0, letterSpacing: '-0.02em' }}>
              ¿Por qué trabajar en Tecnocarton?
            </h2>
          </motion.div>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            variants={staggerContainer}
            className="benefits-grid"
            style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 24 }}
          >
            {benefits.map((benefit, i) => (
              <motion.div
                key={i}
                variants={fadeInUp}
                whileHover={{ y: -8, boxShadow: '0 20px 40px rgba(46,106,128,0.15)' }}
                transition={{ duration: 0.3 }}
                className="card"
                style={{ padding: 32, textAlign: 'center' }}
              >
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                  style={{
                    width: 72,
                    height: 72,
                    background: benefit.iconBg,
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 20px'
                  }}
                >
                  {benefit.icon}
                </motion.div>
                <h4 style={{ fontSize: 18, fontWeight: 700, color: theme.colors.primaryLight, marginBottom: 8 }}>{benefit.title}</h4>
                <p style={{ fontSize: 14, color: theme.colors.textMuted, lineHeight: 1.6 }}>{benefit.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Job Offers */}
      {activeOffers.length > 0 && (
        <section className="section-padding" style={{ padding: '60px 24px', background: '#F8FAFB' }}>
          <div style={{ maxWidth: 1000, margin: '0 auto' }}>
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-100px' }}
              variants={fadeInUp}
              transition={{ duration: 0.6 }}
              style={{ textAlign: 'center', marginBottom: 40 }}
            >
              <div className="section-label">Ofertas de Empleo</div>
              <h2 style={{ fontSize: 'clamp(24px, 4vw, 36px)', fontWeight: 900, color: theme.colors.primaryLight, marginBottom: 12, letterSpacing: '-0.02em' }}>
                Vacantes disponibles
              </h2>
              <p style={{ color: theme.colors.textMuted, maxWidth: 500, margin: '0 auto' }}>
                Conoce nuestras ofertas laborales vigentes y postula directamente al cargo que te interesa.
              </p>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-50px' }}
              variants={staggerContainer}
              className="jobs-grid"
              style={{ display: 'grid', gap: 24 }}
            >
              {activeOffers.map((offer) => (
                <motion.div
                  key={offer.id}
                  variants={fadeInUp}
                  whileHover={{ boxShadow: '0 12px 30px rgba(46,106,128,0.12)' }}
                  transition={{ duration: 0.3 }}
                  className="card"
                  style={{
                    padding: 0,
                    overflow: 'hidden',
                    border: `2px solid ${selectedOffer === offer.id ? theme.colors.primaryLight : 'transparent'}`
                  }}
                >
                  <div
                    style={{
                      padding: 24,
                      cursor: 'pointer',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      flexWrap: 'wrap',
                      gap: 16
                    }}
                    onClick={() => setSelectedOffer(selectedOffer === offer.id ? null : offer.id)}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8, flexWrap: 'wrap' }}>
                        <h4 style={{ fontSize: 20, fontWeight: 700, color: theme.colors.primaryLight, margin: 0 }}>{offer.title}</h4>
                        <span className="badge badge-primary">{offer.department}</span>
                        <span className="badge badge-accent">{offer.type}</span>
                      </div>
                      <p style={{ color: theme.colors.textMuted, margin: 0, fontSize: 14 }}>{offer.description}</p>
                    </div>
                    <div style={{
                      width: 36,
                      height: 36,
                      borderRadius: '50%',
                      background: selectedOffer === offer.id ? theme.colors.primaryLight : '#F3F4F6',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'all 0.3s',
                      flexShrink: 0
                    }}>
                      <svg
                        width="16" height="16" viewBox="0 0 24 24" fill="none"
                        stroke={selectedOffer === offer.id ? 'white' : theme.colors.textMuted}
                        strokeWidth="2"
                        style={{ transform: selectedOffer === offer.id ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s' }}
                      >
                        <polyline points="6 9 12 15 18 9"/>
                      </svg>
                    </div>
                  </div>

                  <div style={{ maxHeight: selectedOffer === offer.id ? 400 : 0, overflow: 'hidden', transition: 'max-height 0.3s ease-in-out' }}>
                    <div style={{ padding: '0 24px 24px', borderTop: `1px solid ${theme.colors.borderInput}` }}>
                      <div style={{ paddingTop: 20 }}>
                        <h5 style={{ fontSize: 13, fontWeight: 700, color: theme.colors.textSecondary, marginBottom: 12, textTransform: 'uppercase', letterSpacing: 1 }}>
                          Requisitos
                        </h5>
                        <ul style={{ margin: 0, paddingLeft: 20, color: theme.colors.textMuted, lineHeight: 1.8 }}>
                          {offer.requirements.map((req, i) => (
                            <li key={i} style={{ marginBottom: 4 }}>{req}</li>
                          ))}
                        </ul>
                        <a
                          href="#postular"
                          onClick={(e) => {
                            e.preventDefault();
                            setFormData(prev => ({ ...prev, motivacion: `Postulación para: ${offer.title}\n\n` }));
                            document.getElementById('postular').scrollIntoView({ behavior: 'smooth' });
                          }}
                          className="btn-primary"
                          style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginTop: 20, textDecoration: 'none' }}
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
                          </svg>
                          Postular a este cargo
                        </a>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
      )}

      {/* Application Form */}
      <section id="postular" className="section-padding" style={{ padding: '80px 24px', background: `linear-gradient(135deg, ${theme.colors.primaryLight} 0%, ${theme.colors.primaryDark} 100%)`, position: 'relative', overflow: 'hidden' }}>
        <SectionBeams />
        <div style={{ maxWidth: 700, margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={fadeInUp}
            transition={{ duration: 0.6 }}
            style={{ textAlign: 'center', marginBottom: 40 }}
          >
            <h2 style={{ fontSize: 14, fontWeight: 700, color: theme.colors.accent, textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 12 }}>
              {activeOffers.length > 0 ? 'Postulación espontánea' : 'Postula ahora'}
            </h2>
            <h3 style={{ fontSize: 'clamp(24px, 4vw, 36px)', fontWeight: 900, color: 'white', marginBottom: 12, letterSpacing: '-0.02em' }}>
              Envíanos tu postulación
            </h3>
            <p style={{ color: 'rgba(255,255,255,0.8)' }}>
              {activeOffers.length > 0
                ? 'Si no encuentras una vacante que se ajuste a tu perfil, envíanos tu CV para futuras oportunidades.'
                : `Completa el formulario y adjunta tu CV. Te contactaremos en menos de ${siteConfig.recruitment.responseTime}.`
              }
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            variants={scaleIn}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="card form-card"
            style={{ padding: 40 }}
          >
            <AnimatePresence>
              {formStatus.error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  style={{
                    background: '#FEF2F2',
                    border: '1px solid #FECACA',
                    borderRadius: 8,
                    padding: 16,
                    marginBottom: 20,
                    color: theme.colors.error,
                    fontSize: 14
                  }}
                >
                  {formStatus.error}
                </motion.div>
              )}
            </AnimatePresence>

            {formStatus.success ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                style={{ textAlign: 'center', padding: 40 }}
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 200, delay: 0.1 }}
                  style={{
                    width: 80, height: 80,
                    background: `linear-gradient(135deg, ${theme.colors.success}, ${theme.colors.successLight})`,
                    borderRadius: '50%',
                    margin: '0 auto 16px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}
                >
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                    <path d="M20 6L9 17l-5-5"/>
                  </svg>
                </motion.div>
                <h4 style={{ fontSize: 24, fontWeight: 700, color: theme.colors.success }}>
                  ¡Hemos recibido tu postulación!
                </h4>
                <p style={{ color: theme.colors.textMuted, marginTop: 8 }}>
                  Te contactaremos en menos de {siteConfig.recruitment.responseTime}.
                </p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div style={{ display: 'grid', gap: 20 }}>
                  {/* Nombre */}
                  <div>
                    <label htmlFor="nombre" style={{ display: 'block', marginBottom: 8, fontWeight: 600, color: theme.colors.textSecondary }}>
                      Nombre completo *
                    </label>
                    <input
                      type="text"
                      id="nombre"
                      name="nombre"
                      autoComplete="name"
                      placeholder="Tu nombre completo"
                      value={formData.nombre}
                      onChange={handleInputChange}
                      className={formErrors.nombre ? 'error' : ''}
                    />
                    {formErrors.nombre && (
                      <span style={{ color: theme.colors.error, fontSize: 12, marginTop: 4, display: 'block' }}>
                        {formErrors.nombre}
                      </span>
                    )}
                  </div>

                  {/* Email y Teléfono */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
                    <div>
                      <label htmlFor="email" style={{ display: 'block', marginBottom: 8, fontWeight: 600, color: theme.colors.textSecondary }}>
                        Email *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        autoComplete="email"
                        placeholder="tu@email.com"
                        value={formData.email}
                        onChange={handleInputChange}
                        className={formErrors.email ? 'error' : ''}
                      />
                      {formErrors.email && (
                        <span style={{ color: theme.colors.error, fontSize: 12, marginTop: 4, display: 'block' }}>
                          {formErrors.email}
                        </span>
                      )}
                    </div>
                    <div>
                      <label htmlFor="telefono" style={{ display: 'block', marginBottom: 8, fontWeight: 600, color: theme.colors.textSecondary }}>
                        Teléfono *
                      </label>
                      <input
                        type="tel"
                        id="telefono"
                        name="telefono"
                        autoComplete="tel"
                        placeholder="+56 9 1234 5678"
                        value={formData.telefono}
                        onChange={handleInputChange}
                        className={formErrors.telefono ? 'error' : ''}
                      />
                      {formErrors.telefono && (
                        <span style={{ color: theme.colors.error, fontSize: 12, marginTop: 4, display: 'block' }}>
                          {formErrors.telefono}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Motivación */}
                  <div>
                    <label htmlFor="motivacion" style={{ display: 'block', marginBottom: 8, fontWeight: 600, color: theme.colors.textSecondary }}>
                      ¿Por qué quieres trabajar con nosotros? *
                    </label>
                    <textarea
                      id="motivacion"
                      name="motivacion"
                      rows={4}
                      placeholder="Cuéntanos sobre tu experiencia y motivación para unirte a nuestro equipo..."
                      value={formData.motivacion}
                      onChange={handleInputChange}
                      className={formErrors.motivacion ? 'error' : ''}
                    />
                    {formErrors.motivacion && (
                      <span style={{ color: theme.colors.error, fontSize: 12, marginTop: 4, display: 'block' }}>
                        {formErrors.motivacion}
                      </span>
                    )}
                  </div>

                  {/* CV Upload */}
                  <div>
                    <label style={{ display: 'block', marginBottom: 8, fontWeight: 600, color: theme.colors.textSecondary }}>
                      Adjuntar CV *
                    </label>
                    <label
                      className={`file-input-wrapper ${formData.cv ? 'has-file' : ''} ${formErrors.cv ? 'error' : ''}`}
                      style={{ display: 'block' }}
                    >
                      <input type="file" accept=".pdf" onChange={handleFileChange} style={{ display: 'none' }} />
                      {formData.cv ? (
                        <div>
                          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke={theme.colors.success} strokeWidth="2" style={{ margin: '0 auto 8px', display: 'block' }}>
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                            <polyline points="14 2 14 8 20 8"/><path d="M9 15l2 2 4-4"/>
                          </svg>
                          <div style={{ fontWeight: 600, color: theme.colors.success }}>{formData.cv.name}</div>
                          <div style={{ fontSize: 13, color: theme.colors.textMuted, marginTop: 4 }}>
                            {(formData.cv.size / 1024 / 1024).toFixed(2)} MB — Haz clic para cambiar
                          </div>
                        </div>
                      ) : (
                        <div>
                          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2" style={{ margin: '0 auto 8px', display: 'block' }}>
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                            <polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
                          </svg>
                          <div style={{ fontWeight: 600, color: theme.colors.textSecondary }}>Haz clic para subir tu CV</div>
                          <div style={{ fontSize: 13, color: theme.colors.textMuted, marginTop: 4 }}>Solo PDF, máximo 2MB</div>
                        </div>
                      )}
                    </label>
                    {formErrors.cv && (
                      <span style={{ color: theme.colors.error, fontSize: 12, marginTop: 4, display: 'block' }}>
                        {formErrors.cv}
                      </span>
                    )}
                  </div>

                  {/* Submit */}
                  <button
                    type="submit"
                    className="btn-primary"
                    style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
                    disabled={formStatus.loading}
                  >
                    {formStatus.loading ? (
                      <>
                        <svg style={{ animation: 'spin 1s linear infinite', width: 20, height: 20 }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
                        </svg>
                        Enviando...
                      </>
                    ) : (
                      <>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
                        </svg>
                        Enviar postulación
                      </>
                    )}
                  </button>

                  <p style={{ textAlign: 'center', fontSize: 13, color: theme.colors.textSubtle }}>
                    Al enviar aceptas que procesemos tus datos para fines de selección de personal.
                  </p>
                </div>
              </form>
            )}
          </motion.div>
        </div>
      </section>

      <SharedFooter />
    </div>
  );
}
