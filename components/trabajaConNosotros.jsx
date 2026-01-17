'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { siteConfig, jobOffers } from '../config/site';

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

export default function TrabajaConNosotros() {
  const [currentYear, setCurrentYear] = useState('');
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    motivacion: '',
    cv: null
  });

  // Obtener el año actual solo en el cliente para evitar error de hidratación
  useEffect(() => {
    setCurrentYear(new Date().getFullYear().toString());
  }, []);
  const [formErrors, setFormErrors] = useState({});
  const [formStatus, setFormStatus] = useState({ loading: false, success: false, error: null });
  const [selectedOffer, setSelectedOffer] = useState(null);

  // Filtrar solo ofertas activas
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
    if (file) {
      // Validar tipo de archivo (solo PDF)
      if (file.type !== 'application/pdf') {
        setFormErrors(prev => ({ ...prev, cv: 'Solo se permiten archivos PDF' }));
        return;
      }
      // Validar tamaño (máximo 2MB)
      if (file.size > 2 * 1024 * 1024) {
        setFormErrors(prev => ({ ...prev, cv: 'El archivo no puede superar los 2MB' }));
        return;
      }
      setFormData(prev => ({ ...prev, cv: file }));
      setFormErrors(prev => ({ ...prev, cv: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validar campos
    const errors = {};
    if (!formData.nombre || formData.nombre.trim().length < 2) {
      errors.nombre = 'Nombre requerido';
    }
    if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Email inválido';
    }
    if (!formData.telefono || formData.telefono.replace(/\D/g, '').length < 8) {
      errors.telefono = 'Teléfono inválido';
    }
    if (!formData.motivacion || formData.motivacion.trim().length < 20) {
      errors.motivacion = 'Cuéntanos más sobre ti (mínimo 20 caracteres)';
    }
    if (!formData.cv) {
      errors.cv = 'Debes adjuntar tu CV';
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setFormStatus({ loading: true, success: false, error: null });

    try {
      // Crear FormData para enviar archivo
      const submitData = new FormData();
      submitData.append('nombre', formData.nombre);
      submitData.append('email', formData.email);
      submitData.append('telefono', formData.telefono);
      submitData.append('motivacion', formData.motivacion);
      submitData.append('cv', formData.cv);

      const response = await fetch('/api/postulacion', {
        method: 'POST',
        body: submitData
      });

      const data = await response.json();

      if (data.success) {
        setFormStatus({ loading: false, success: true, error: null });
        // Reset form
        setTimeout(() => {
          setFormData({
            nombre: '',
            email: '',
            telefono: '',
            motivacion: '',
            cv: null
          });
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
    <div style={{ minHeight: '100vh', background: '#F8FAFB' }}>
      {/* Google Fonts - Roboto */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap" rel="stylesheet" />

      <style dangerouslySetInnerHTML={{ __html: `
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
        }
        .btn-primary {
          background: linear-gradient(135deg, #EE7E31, #f5a66d);
          color: white;
          padding: 14px 28px;
          border: none;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s;
        }
        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(238,126,49,0.4);
        }
        .btn-primary:disabled {
          opacity: 0.7;
          cursor: not-allowed;
          transform: none;
        }
        .btn-secondary {
          background: white;
          color: #2E6A80;
          padding: 14px 28px;
          border: 2px solid #2E6A80;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s;
        }
        .btn-secondary:hover {
          background: #2E6A80;
          color: white;
        }
        .card {
          background: white;
          border-radius: 16px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.08);
        }
        input, textarea, select {
          width: 100%;
          padding: 14px 16px;
          border: 2px solid #E5E7EB;
          border-radius: 8px;
          font-size: 15px;
          transition: all 0.3s;
          background: white;
        }
        input:focus, textarea:focus, select:focus {
          outline: none;
          border-color: #2E6A80;
          box-shadow: 0 0 0 3px rgba(46,106,128,0.1);
        }
        input.error, textarea.error, select.error {
          border-color: #EF4444;
        }
        .file-input-wrapper {
          position: relative;
          border: 2px dashed #E5E7EB;
          border-radius: 8px;
          padding: 24px;
          text-align: center;
          cursor: pointer;
          transition: all 0.3s;
        }
        .file-input-wrapper:hover {
          border-color: #2E6A80;
          background: rgba(46,106,128,0.02);
        }
        .file-input-wrapper.has-file {
          border-color: #059669;
          background: rgba(5,150,105,0.05);
        }
        .file-input-wrapper.error {
          border-color: #EF4444;
        }
        .gradient-text {
          background: linear-gradient(135deg, #2E6A80 0%, #1a4a5c 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      ` }} />

      {/* Header */}
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
          boxShadow: '0 2px 20px rgba(0,0,0,0.1)'
        }}
      >
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 12, textDecoration: 'none' }}>
            <img
              src={siteConfig.company.logo}
              alt={siteConfig.company.name}
              style={{
                height: 67.5,
                width: 'auto',
                objectFit: 'contain'
              }}
            />
          </Link>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link href="/" className="btn-secondary" style={{ textDecoration: 'none' }}>
              Volver al inicio
            </Link>
          </motion.div>
        </div>
      </motion.nav>

      {/* Hero */}
      <section style={{
        background: 'linear-gradient(135deg, #2E6A80 0%, #1a4a5c 100%)',
        padding: '140px 24px 80px',
        textAlign: 'center'
      }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          style={{ maxWidth: 700, margin: '0 auto' }}
        >
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            style={{ fontSize: 'clamp(32px, 5vw, 48px)', fontWeight: 900, color: 'white', marginBottom: 16 }}
          >
            Trabaja con nosotros
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            style={{ fontSize: 18, color: 'rgba(255,255,255,0.8)', lineHeight: 1.7 }}
          >
            Únete a nuestro equipo y forma parte de una empresa líder en soluciones de embalaje.
            Buscamos personas comprometidas y con ganas de crecer profesionalmente.
          </motion.p>
        </motion.div>
      </section>

      {/* Benefits */}
      <section style={{ padding: '60px 24px', background: 'white' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={fadeInUp}
            transition={{ duration: 0.6 }}
          >
            <h2 style={{ textAlign: 'center', fontSize: 14, fontWeight: 700, color: '#EE7E31', textTransform: 'uppercase', letterSpacing: 2, marginBottom: 12 }}>
              Beneficios
            </h2>
            <h3 className="gradient-text" style={{ textAlign: 'center', fontSize: 'clamp(24px, 4vw, 36px)', fontWeight: 900, marginBottom: 40 }}>
              ¿Por qué trabajar en Tecnocarton?
            </h3>
          </motion.div>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            variants={staggerContainer}
            style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 24 }}
          >
            {[
              { icon: '📈', title: 'Crecimiento', desc: 'Oportunidades de desarrollo y capacitación continua' },
              { icon: '🤝', title: 'Buen ambiente', desc: 'Equipo colaborativo y ambiente laboral positivo' },
              { icon: '⚖️', title: 'Estabilidad', desc: 'Empresa sólida con más de 20 años en el mercado' }
            ].map((benefit, i) => (
              <motion.div
                key={i}
                variants={fadeInUp}
                whileHover={{ y: -8, boxShadow: '0 20px 40px rgba(46,106,128,0.15)' }}
                transition={{ duration: 0.3 }}
                className="card"
                style={{ padding: 24, textAlign: 'center' }}
              >
                <motion.div
                  whileHover={{ scale: 1.2 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                  style={{ fontSize: 40, marginBottom: 12 }}
                >{benefit.icon}</motion.div>
                <h4 style={{ fontSize: 18, fontWeight: 700, color: '#2E6A80', marginBottom: 8 }}>{benefit.title}</h4>
                <p style={{ fontSize: 14, color: '#6B7280', lineHeight: 1.6 }}>{benefit.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Job Offers Section */}
      {activeOffers.length > 0 && (
        <section style={{ padding: '60px 24px', background: '#F8FAFB' }}>
          <div style={{ maxWidth: 1000, margin: '0 auto' }}>
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-100px' }}
              variants={fadeInUp}
              transition={{ duration: 0.6 }}
              style={{ textAlign: 'center', marginBottom: 40 }}
            >
              <h2 style={{ fontSize: 14, fontWeight: 700, color: '#EE7E31', textTransform: 'uppercase', letterSpacing: 2, marginBottom: 12 }}>
                Ofertas de Empleo
              </h2>
              <h3 className="gradient-text" style={{ fontSize: 'clamp(24px, 4vw, 36px)', fontWeight: 900, marginBottom: 12 }}>
                Vacantes disponibles
              </h3>
              <p style={{ color: '#6B7280', maxWidth: 500, margin: '0 auto' }}>
                Conoce nuestras ofertas laborales vigentes y postula directamente al cargo que te interesa.
              </p>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-50px' }}
              variants={staggerContainer}
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
                    border: selectedOffer === offer.id ? '2px solid #2E6A80' : '2px solid transparent'
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
                        <h4 style={{ fontSize: 20, fontWeight: 700, color: '#2E6A80', margin: 0 }}>{offer.title}</h4>
                        <span style={{
                          background: '#E8F4F8',
                          color: '#2E6A80',
                          padding: '4px 12px',
                          borderRadius: 20,
                          fontSize: 12,
                          fontWeight: 600
                        }}>{offer.department}</span>
                        <span style={{
                          background: 'rgba(238,126,49,0.1)',
                          color: '#EE7E31',
                          padding: '4px 12px',
                          borderRadius: 20,
                          fontSize: 12,
                          fontWeight: 600
                        }}>{offer.type}</span>
                      </div>
                      <p style={{ color: '#6B7280', margin: 0, fontSize: 14 }}>{offer.description}</p>
                    </div>
                    <div style={{
                      width: 36,
                      height: 36,
                      borderRadius: '50%',
                      background: selectedOffer === offer.id ? '#2E6A80' : '#F3F4F6',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'all 0.3s',
                      flexShrink: 0
                    }}>
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke={selectedOffer === offer.id ? 'white' : '#6B7280'}
                        strokeWidth="2"
                        style={{
                          transform: selectedOffer === offer.id ? 'rotate(180deg)' : 'rotate(0deg)',
                          transition: 'transform 0.3s'
                        }}
                      >
                        <polyline points="6 9 12 15 18 9"/>
                      </svg>
                    </div>
                  </div>

                  {/* Expanded content */}
                  <div style={{
                    maxHeight: selectedOffer === offer.id ? 400 : 0,
                    overflow: 'hidden',
                    transition: 'max-height 0.3s ease-in-out'
                  }}>
                    <div style={{ padding: '0 24px 24px', borderTop: '1px solid #E5E7EB' }}>
                      <div style={{ paddingTop: 20 }}>
                        <h5 style={{ fontSize: 14, fontWeight: 700, color: '#374151', marginBottom: 12, textTransform: 'uppercase', letterSpacing: 1 }}>
                          Requisitos
                        </h5>
                        <ul style={{ margin: 0, paddingLeft: 20, color: '#6B7280', lineHeight: 1.8 }}>
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
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 8,
                            marginTop: 20,
                            textDecoration: 'none'
                          }}
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <line x1="22" y1="2" x2="11" y2="13"/>
                            <polygon points="22 2 15 22 11 13 2 9 22 2"/>
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

      {/* Form Section */}
      <section id="postular" style={{ padding: '60px 24px 80px' }}>
        <div style={{ maxWidth: 700, margin: '0 auto' }}>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={fadeInUp}
            transition={{ duration: 0.6 }}
            style={{ textAlign: 'center', marginBottom: 40 }}
          >
            <h2 style={{ fontSize: 14, fontWeight: 700, color: '#EE7E31', textTransform: 'uppercase', letterSpacing: 2, marginBottom: 12 }}>
              {activeOffers.length > 0 ? 'Postulación espontánea' : 'Postula ahora'}
            </h2>
            <h3 className="gradient-text" style={{ fontSize: 'clamp(24px, 4vw, 36px)', fontWeight: 900, marginBottom: 12 }}>
              Envíanos tu postulación
            </h3>
            <p style={{ color: '#6B7280' }}>
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
            className="card"
            style={{ padding: 40 }}
          >
            {formStatus.error && (
              <div style={{
                background: '#FEF2F2',
                border: '1px solid #FECACA',
                borderRadius: 8,
                padding: 16,
                marginBottom: 20,
                color: '#DC2626',
                fontSize: 14
              }}>
                {formStatus.error}
              </div>
            )}

            {formStatus.success ? (
              <div style={{ textAlign: 'center', padding: 40 }}>
                <div style={{
                  width: 80,
                  height: 80,
                  background: 'linear-gradient(135deg, #059669, #10B981)',
                  borderRadius: '50%',
                  margin: '0 auto 16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                    <path d="M20 6L9 17l-5-5"/>
                  </svg>
                </div>
                <h4 style={{ fontSize: 24, fontWeight: 700, color: '#059669' }}>
                  ¡Hemos recibido tu postulación!
                </h4>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div style={{ display: 'grid', gap: 20 }}>
                  {/* Nombre */}
                  <div>
                    <label htmlFor="nombre" style={{ display: 'block', marginBottom: 8, fontWeight: 600, color: '#374151' }}>
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
                      <span style={{ color: '#EF4444', fontSize: 12, marginTop: 4, display: 'block' }}>
                        {formErrors.nombre}
                      </span>
                    )}
                  </div>

                  {/* Email y Teléfono */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
                    <div>
                      <label htmlFor="email" style={{ display: 'block', marginBottom: 8, fontWeight: 600, color: '#374151' }}>
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
                        <span style={{ color: '#EF4444', fontSize: 12, marginTop: 4, display: 'block' }}>
                          {formErrors.email}
                        </span>
                      )}
                    </div>
                    <div>
                      <label htmlFor="telefono" style={{ display: 'block', marginBottom: 8, fontWeight: 600, color: '#374151' }}>
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
                        <span style={{ color: '#EF4444', fontSize: 12, marginTop: 4, display: 'block' }}>
                          {formErrors.telefono}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Motivación */}
                  <div>
                    <label htmlFor="motivacion" style={{ display: 'block', marginBottom: 8, fontWeight: 600, color: '#374151' }}>
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
                      style={{ fontFamily: "'Roboto', sans-serif" }}
                    />
                    {formErrors.motivacion && (
                      <span style={{ color: '#EF4444', fontSize: 12, marginTop: 4, display: 'block' }}>
                        {formErrors.motivacion}
                      </span>
                    )}
                  </div>

                  {/* CV Upload */}
                  <div>
                    <label style={{ display: 'block', marginBottom: 8, fontWeight: 600, color: '#374151' }}>
                      Adjuntar CV *
                    </label>
                    <label
                      className={`file-input-wrapper ${formData.cv ? 'has-file' : ''} ${formErrors.cv ? 'error' : ''}`}
                      style={{ display: 'block' }}
                    >
                      <input
                        type="file"
                        accept=".pdf"
                        onChange={handleFileChange}
                        style={{ display: 'none' }}
                      />
                      {formData.cv ? (
                        <div>
                          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2" style={{ margin: '0 auto 8px', display: 'block' }}>
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                            <polyline points="14 2 14 8 20 8"/>
                            <path d="M9 15l2 2 4-4"/>
                          </svg>
                          <div style={{ fontWeight: 600, color: '#059669' }}>{formData.cv.name}</div>
                          <div style={{ fontSize: 13, color: '#6B7280', marginTop: 4 }}>
                            {(formData.cv.size / 1024 / 1024).toFixed(2)} MB - Haz clic para cambiar
                          </div>
                        </div>
                      ) : (
                        <div>
                          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2" style={{ margin: '0 auto 8px', display: 'block' }}>
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                            <polyline points="17 8 12 3 7 8"/>
                            <line x1="12" y1="3" x2="12" y2="15"/>
                          </svg>
                          <div style={{ fontWeight: 600, color: '#374151' }}>Haz clic para subir tu CV</div>
                          <div style={{ fontSize: 13, color: '#6B7280', marginTop: 4 }}>
                            Solo PDF, máximo 2MB
                          </div>
                        </div>
                      )}
                    </label>
                    {formErrors.cv && (
                      <span style={{ color: '#EF4444', fontSize: 12, marginTop: 4, display: 'block' }}>
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
                          <line x1="22" y1="2" x2="11" y2="13"/>
                          <polygon points="22 2 15 22 11 13 2 9 22 2"/>
                        </svg>
                        Enviar Postulación
                      </>
                    )}
                  </button>

                  <p style={{ textAlign: 'center', fontSize: 13, color: '#8E9DA6' }}>
                    Al enviar aceptas que procesemos tus datos para fines de selección de personal
                  </p>
                </div>
              </form>
            )}
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <motion.footer
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-50px' }}
        variants={fadeInUp}
        transition={{ duration: 0.6 }}
        style={{
          background: '#1a1a2e',
          color: 'white',
          padding: '40px 24px',
          textAlign: 'center'
        }}
      >
        <Link href="/" style={{ display: 'inline-block', marginBottom: 16 }}>
          <img
            src={siteConfig.company.logo}
            alt={siteConfig.company.name}
            style={{
              height: 50,
              width: 'auto',
              objectFit: 'contain'
            }}
          />
        </Link>
        <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 14 }}>
          {siteConfig.address.full}
        </p>
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13, marginTop: 16 }}>
          © {currentYear} {siteConfig.company.name}. Todos los derechos reservados.
        </p>
      </motion.footer>
    </div>
  );
}
