'use client'

import React, { useState, useEffect, useCallback } from 'react';
import {
  siteConfig,
  products,
  cardboardTypes,
  processSteps,
  caseStudies,
  sectors,
  qualityCertifications
} from '../config/site';

// Custom hook for intersection observer animations
const useInView = (threshold = 0.1) => {
  const [ref, setRef] = useState(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    if (!ref) return;
    const observer = new IntersectionObserver(
      ([entry]) => setIsInView(entry.isIntersecting),
      { threshold }
    );
    observer.observe(ref);
    return () => observer.disconnect();
  }, [ref, threshold]);

  return [setRef, isInView];
};

// Animated counter component
const Counter = ({ end, suffix = '', duration = 2000 }) => {
  const [count, setCount] = useState(0);
  const [ref, isInView] = useInView();

  useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const increment = end / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [isInView, end, duration]);

  return <span ref={ref}>{count}{suffix}</span>;
};

// Smooth scroll function
const scrollToSection = (e, sectionId) => {
  e.preventDefault();
  const element = document.getElementById(sectionId);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
};

export default function TecnocartonLanding() {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    producto: '',
    cantidad: '',
    medidas: '',
    empresa: '',
    email: '',
    telefono: ''
  });
  const [formErrors, setFormErrors] = useState({});
  const [formStatus, setFormStatus] = useState({ loading: false, success: false, error: null, quoteNumber: null });
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  const carouselImages = ['/img1.jpeg', '/img2.jpeg'];

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Carousel auto-rotation
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [carouselImages.length]);

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

  // Form validation
  const validateField = useCallback((name, value) => {
    switch (name) {
      case 'empresa':
        if (!value || value.trim().length < 2) {
          return 'El nombre es requerido (mínimo 2 caracteres)';
        }
        break;
      case 'email':
        if (!value || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          return 'Ingresa un email válido';
        }
        break;
      case 'telefono':
        const digits = value.replace(/\D/g, '');
        if (digits.length < 8) {
          return 'Teléfono debe tener al menos 8 dígitos';
        }
        break;
      default:
        break;
    }
    return null;
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Real-time validation
    const error = validateField(name, value);
    setFormErrors(prev => ({
      ...prev,
      [name]: error
    }));
  };

  const handleProductSelect = (productId) => {
    setFormData(prev => ({ ...prev, producto: productId }));
  };

  // Submit form - sends email via API
  const handleSubmit = async () => {
    // Validate all required fields
    const errors = {};
    if (!formData.empresa) errors.empresa = 'Requerido';
    if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Email invalido';
    }
    if (!formData.telefono || formData.telefono.replace(/\D/g, '').length < 8) {
      errors.telefono = 'Telefono invalido';
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setFormStatus({ loading: true, success: false, error: null });

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (data.success) {
        setFormStatus({ loading: false, success: true, error: null, quoteNumber: data.quoteNumber });
        // Reset form after showing success
        setTimeout(() => {
          setFormData({
            producto: '',
            cantidad: '',
            medidas: '',
            empresa: '',
            email: '',
            telefono: ''
          });
          setActiveStep(0);
          setFormStatus({ loading: false, success: false, error: null });
        }, 4000);
      } else {
        setFormStatus({ loading: false, success: false, error: data.message || 'Error al enviar' });
      }
    } catch (error) {
      console.error('Error:', error);
      setFormStatus({ loading: false, success: false, error: 'Error de conexion. Intenta nuevamente.' });
    }
  };

  // WhatsApp link
  const whatsappUrl = `https://wa.me/${siteConfig.contact.whatsapp}?text=${encodeURIComponent(siteConfig.contact.whatsappMessage)}`;

  const stats = [
    { value: 200, suffix: 'M+', label: 'CLP Mensuales' },
    { value: 10, suffix: 't', label: 'Planchas/Día' },
    { value: siteConfig.stats.yearsExperience, suffix: '+', label: 'Años Experiencia' },
    { value: siteConfig.stats.customerSatisfaction, suffix: '%', label: 'Clientes Satisfechos' }
  ];

  const currentYear = new Date().getFullYear();

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', background: '#FAFAFA', minHeight: '100vh' }}>
      {/* CSS Animations */}
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(-20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-fadeIn { animation: fadeInUp 0.8s ease forwards; }
        .animate-float { animation: float 3s ease-in-out infinite; }
        .animate-pulse { animation: pulse 2s ease-in-out infinite; }
        .hover-lift { transition: transform 0.3s, box-shadow 0.3s; }
        .hover-lift:hover { transform: translateY(-8px); box-shadow: 0 20px 40px rgba(46,106,128,0.15); }
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
          transition: all 0.3s;
          box-shadow: 0 4px 15px rgba(238,126,49,0.3);
        }
        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(238,126,49,0.4);
        }
        .btn-primary:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }
        .btn-secondary {
          background: transparent;
          color: #2E6A80;
          border: 2px solid #2E6A80;
          padding: 14px 30px;
          border-radius: 8px;
          font-weight: 600;
          font-size: 16px;
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
          box-shadow: 0 4px 20px rgba(0,0,0,0.05);
          transition: all 0.3s;
        }
        .card:hover {
          box-shadow: 0 12px 40px rgba(0,0,0,0.1);
        }
        .process-line {
          position: absolute;
          top: 40px;
          left: 0;
          right: 0;
          height: 2px;
          background: linear-gradient(90deg, #2E6A80, #EE7E31);
        }
        input, select, textarea {
          width: 100%;
          padding: 14px 18px;
          border: 2px solid #E0E0E0;
          border-radius: 8px;
          font-size: 15px;
          transition: all 0.3s;
          background: white;
          box-sizing: border-box;
          font-family: inherit;
        }
        input:focus, select:focus, textarea:focus {
          outline: none;
          border-color: #2E6A80;
          box-shadow: 0 0 0 3px rgba(46,106,128,0.1);
        }
        input.error, textarea.error {
          border-color: #EF4444;
        }
        .nav-link {
          color: #2E6A80;
          text-decoration: none;
          font-weight: 500;
          padding: 8px 16px;
          border-radius: 6px;
          transition: all 0.3s;
        }
        .nav-link:hover {
          background: rgba(46,106,128,0.1);
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
        .hamburger.open span:nth-child(1) {
          transform: rotate(45deg) translate(5px, 5px);
        }
        .hamburger.open span:nth-child(2) {
          opacity: 0;
        }
        .hamburger.open span:nth-child(3) {
          transform: rotate(-45deg) translate(5px, -5px);
        }
        .coming-soon-badge {
          position: absolute;
          top: 8px;
          right: 8px;
          background: linear-gradient(135deg, #8B5CF6, #6366F1);
          color: white;
          font-size: 10px;
          font-weight: 700;
          padding: 4px 8px;
          border-radius: 4px;
          text-transform: uppercase;
        }
        @media (max-width: 768px) {
          .desktop-nav {
            display: none;
          }
          .hamburger {
            display: flex;
          }
          .mobile-menu {
            display: none;
          }
          .mobile-menu.open {
            display: flex;
          }
        }
        @media (max-width: 500px) {
          .step-label {
            display: none;
          }
        }
        html {
          scroll-behavior: smooth;
        }
      `}</style>

      {/* Navigation */}
      <nav style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        background: '#FEFEFE',
        boxShadow: scrolled ? '0 2px 20px rgba(0,0,0,0.1)' : '0 1px 3px rgba(0,0,0,0.05)',
        transition: 'box-shadow 0.3s'
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <img
              src={siteConfig.company.logo}
              alt={siteConfig.company.name}
              style={{
                height: 67.5,
                width: 'auto',
                objectFit: 'contain'
              }}
            />
          </div>

          {/* Desktop Navigation */}
          <div className="desktop-nav" style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <a href="#productos" onClick={(e) => scrollToSection(e, 'productos')} className="nav-link">Productos</a>
            <a href="#proceso" onClick={(e) => scrollToSection(e, 'proceso')} className="nav-link">Proceso</a>
            <a href="#casos" onClick={(e) => scrollToSection(e, 'casos')} className="nav-link">Casos de Éxito</a>
            <a href="#cotizar" onClick={(e) => scrollToSection(e, 'cotizar')} className="btn-primary" style={{ marginLeft: 16, textDecoration: 'none' }}>Cotizar Ahora</a>
          </div>

          {/* Hamburger Menu */}
          <div
            className={`hamburger ${isMenuOpen ? 'open' : ''}`}
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
            <a href="#productos" onClick={(e) => { scrollToSection(e, 'productos'); setIsMenuOpen(false); }} className="nav-link">Productos</a>
            <a href="#proceso" onClick={(e) => { scrollToSection(e, 'proceso'); setIsMenuOpen(false); }} className="nav-link">Proceso</a>
            <a href="#casos" onClick={(e) => { scrollToSection(e, 'casos'); setIsMenuOpen(false); }} className="nav-link">Casos de Éxito</a>
            <a href="#cotizar" onClick={(e) => { scrollToSection(e, 'cotizar'); setIsMenuOpen(false); }} className="btn-primary" style={{ textAlign: 'center', textDecoration: 'none', marginTop: 8 }}>Cotizar Ahora</a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Background Carousel */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 0
        }}>
          {carouselImages.map((img, index) => (
            <div
              key={index}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                backgroundImage: `url(${img})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                opacity: currentSlide === index ? 1 : 0,
                transition: 'opacity 1.5s ease-in-out'
              }}
            />
          ))}
          {/* Dark overlay for better text readability */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'linear-gradient(135deg, rgba(46,106,128,0.85) 0%, rgba(26,74,92,0.85) 50%, rgba(46,106,128,0.85) 100%)'
          }} />
        </div>

        {/* Carousel indicators */}
        <div style={{
          position: 'absolute',
          bottom: 40,
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          gap: 12,
          zIndex: 2
        }}>
          {carouselImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              style={{
                width: currentSlide === index ? 32 : 12,
                height: 12,
                borderRadius: 6,
                border: 'none',
                background: currentSlide === index ? '#EE7E31' : 'rgba(255,255,255,0.5)',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
            />
          ))}
        </div>

        {/* Floating boxes decoration */}
        <div style={{ position: 'absolute', top: '20%', right: '15%', opacity: 0.15, zIndex: 1 }} className="animate-float">
          <svg width="120" height="120" viewBox="0 0 100 100">
            <rect x="10" y="10" width="80" height="80" fill="none" stroke="white" strokeWidth="2" rx="8"/>
            <rect x="25" y="25" width="50" height="50" fill="none" stroke="white" strokeWidth="2" rx="4"/>
          </svg>
        </div>

        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '120px 24px 80px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 60, alignItems: 'center', position: 'relative', zIndex: 1 }}>
          <div className="animate-fadeIn">
            <div style={{
              display: 'inline-block',
              background: 'rgba(238,126,49,0.2)',
              color: '#EE7E31',
              padding: '8px 16px',
              borderRadius: 20,
              fontSize: 14,
              fontWeight: 600,
              marginBottom: 24,
              border: '1px solid rgba(238,126,49,0.3)'
            }}>
              Fabricantes desde {siteConfig.company.foundedYear}
            </div>

            <h1 style={{
              fontSize: 'clamp(36px, 5vw, 56px)',
              fontWeight: 900,
              color: 'white',
              lineHeight: 1.1,
              marginBottom: 24
            }}>
              Soluciones de Embalaje en{' '}
              <span style={{ color: '#EE7E31' }}>Cartón Corrugado</span>
            </h1>

            <p style={{
              fontSize: 18,
              color: 'rgba(255,255,255,0.85)',
              lineHeight: 1.7,
              marginBottom: 32,
              maxWidth: 500
            }}>
              Desde materia prima hasta producto terminado. Combinamos capacidad industrial
              con flexibilidad artesanal para entregar exactamente lo que tu negocio necesita.
            </p>

            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
              <a href="#cotizar" onClick={(e) => scrollToSection(e, 'cotizar')} className="btn-primary" style={{ fontSize: 17, textDecoration: 'none' }}>
                Solicitar Cotización
              </a>
              <a href="#proceso" onClick={(e) => scrollToSection(e, 'proceso')} className="btn-secondary" style={{
                borderColor: 'rgba(255,255,255,0.5)',
                color: 'white',
                textDecoration: 'none'
              }}>
                Ver Proceso
              </a>
            </div>

            {/* Trust badges */}
            <div style={{ marginTop: 40, display: 'flex', gap: 24, flexWrap: 'wrap' }}>
              {['Producción Propia', 'Entrega Nacional', 'Pedidos Flexibles'].map((badge, i) => (
                <span key={i} style={{
                  color: 'rgba(255,255,255,0.8)',
                  fontSize: 14,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6
                }}>
                  <span style={{ color: '#EE7E31' }}>✓</span> {badge}
                </span>
              ))}
            </div>
          </div>

          {/* Stats cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
            {stats.map((stat, i) => (
              <div key={i} className="card hover-lift" style={{
                padding: 24,
                background: 'rgba(255,255,255,0.95)',
                animationDelay: `${i * 0.1}s`
              }}>
                <div style={{ fontSize: 36, fontWeight: 900, color: '#2E6A80' }}>
                  <Counter end={stat.value} suffix={stat.suffix} />
                </div>
                <div style={{ fontSize: 14, color: '#8E9DA6', fontWeight: 500 }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Value Proposition */}
      <section style={{ padding: '80px 24px', background: 'white' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 60 }}>
            <h2 style={{ fontSize: 14, fontWeight: 700, color: '#EE7E31', textTransform: 'uppercase', letterSpacing: 2, marginBottom: 12 }}>
              ¿Por qué {siteConfig.company.name}?
            </h2>
            <h3 className="gradient-text" style={{ fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 900, marginBottom: 16 }}>
              La mejor opción en embalaje
            </h3>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 24 }}>
            {[
              { title: 'Integración Vertical', desc: 'Control total desde la materia prima hasta el producto final. Sin intermediarios.' },
              { title: 'Cobertura Nacional', desc: 'Flota propia para entregas en todo Chile. Rapidez y confiabilidad garantizada.' },
              { title: 'Flexibilidad Híbrida', desc: 'Grandes volúmenes industriales o pedidos personalizados. Nos adaptamos a ti.' },
              { title: 'Precios de Fábrica', desc: 'Directo del productor. Elimina costos de intermediación y ahorra.' }
            ].map((item, i) => (
              <div key={i} className="card hover-lift" style={{ padding: 32, textAlign: 'center' }}>
                <div style={{
                  width: 64,
                  height: 64,
                  background: 'linear-gradient(135deg, #2E6A80, #3d8299)',
                  borderRadius: 16,
                  margin: '0 auto 16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontWeight: 900,
                  fontSize: 24
                }}>{i + 1}</div>
                <h4 style={{ fontSize: 20, fontWeight: 700, color: '#2E6A80', marginBottom: 12 }}>{item.title}</h4>
                <p style={{ color: '#6B7280', lineHeight: 1.6 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section id="productos" style={{ padding: '80px 24px', background: '#F8FAFB' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 60 }}>
            <h2 style={{ fontSize: 14, fontWeight: 700, color: '#EE7E31', textTransform: 'uppercase', letterSpacing: 2, marginBottom: 12 }}>
              Catálogo
            </h2>
            <h3 className="gradient-text" style={{ fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 900 }}>
              Nuestros Productos
            </h3>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 20 }}>
            {products.map((product, i) => (
              <a
                key={i}
                href="#cotizar"
                onClick={(e) => {
                  if (!product.comingSoon) {
                    scrollToSection(e, 'cotizar');
                    handleProductSelect(product.id);
                  } else {
                    e.preventDefault();
                  }
                }}
                className="card hover-lift"
                style={{
                  padding: 28,
                  textAlign: 'center',
                  cursor: product.comingSoon ? 'default' : 'pointer',
                  border: '2px solid transparent',
                  transition: 'all 0.3s',
                  textDecoration: 'none',
                  position: 'relative',
                  opacity: product.comingSoon ? 0.7 : 1
                }}
              >
                {product.comingSoon && (
                  <div className="coming-soon-badge">Próximamente</div>
                )}
                <div style={{
                  width: 48,
                  height: 48,
                  background: 'linear-gradient(135deg, #EE7E31, #f5a66d)',
                  borderRadius: 12,
                  margin: '0 auto 16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                    <rect x="3" y="3" width="18" height="18" rx="2"/>
                    <path d="M3 9h18M9 21V9"/>
                  </svg>
                </div>
                <h4 style={{ fontSize: 16, fontWeight: 700, color: '#2E6A80', marginBottom: 8 }}>{product.name}</h4>
                <p style={{ fontSize: 13, color: '#8E9DA6' }}>{product.desc}</p>
              </a>
            ))}
          </div>

          {/* Cardboard types info */}
          <div className="card" style={{ marginTop: 40, padding: 32 }}>
            <h4 style={{ fontSize: 18, fontWeight: 700, color: '#2E6A80', marginBottom: 20, textAlign: 'center' }}>
              Tipos de Cartón Disponibles
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 24 }}>
              {cardboardTypes.map((item, i) => (
                <div key={i} style={{
                  padding: 20,
                  background: '#F8FAFB',
                  borderRadius: 12,
                  borderLeft: '4px solid #EE7E31'
                }}>
                  <div style={{ fontWeight: 700, color: '#2E6A80', marginBottom: 8 }}>{item.type}</div>
                  <div style={{ fontSize: 14, color: '#8E9DA6', marginBottom: 4 }}>Gramaje: {item.weight}</div>
                  <div style={{ fontSize: 14, color: '#8E9DA6' }}>Ideal para: {item.use}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section id="proceso" style={{ padding: '80px 24px', background: 'white' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 60 }}>
            <h2 style={{ fontSize: 14, fontWeight: 700, color: '#EE7E31', textTransform: 'uppercase', letterSpacing: 2, marginBottom: 12 }}>
              Compromiso de Calidad
            </h2>
            <h3 className="gradient-text" style={{ fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 900, marginBottom: 16 }}>
              Nuestro Proceso de Producción
            </h3>
            <p style={{ color: '#6B7280', maxWidth: 600, margin: '0 auto', lineHeight: 1.7 }}>
              Cada producto pasa por un riguroso proceso que garantiza la máxima calidad
              y resistencia para proteger lo que más importa: tu mercancía.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24 }}>
            {processSteps.map((step, i) => (
              <div key={i} className="card hover-lift" style={{
                padding: 28,
                display: 'flex',
                gap: 20,
                alignItems: 'flex-start'
              }}>
                <div style={{
                  minWidth: 56,
                  height: 56,
                  background: 'linear-gradient(135deg, #2E6A80, #3d8299)',
                  borderRadius: 12,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontWeight: 900,
                  fontSize: 18
                }}>{step.num}</div>
                <div>
                  <h4 style={{ fontSize: 17, fontWeight: 700, color: '#2E6A80', marginBottom: 8 }}>{step.title}</h4>
                  <p style={{ fontSize: 14, color: '#6B7280', lineHeight: 1.6 }}>{step.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Quality certifications */}
          <div style={{
            marginTop: 48,
            padding: 32,
            background: 'linear-gradient(135deg, #2E6A80 0%, #3d8299 100%)',
            borderRadius: 16,
            display: 'flex',
            justifyContent: 'space-around',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 24
          }}>
            {qualityCertifications.map((item, i) => (
              <div key={i} style={{ textAlign: 'center', color: 'white' }}>
                <div style={{
                  width: 40,
                  height: 40,
                  background: 'rgba(255,255,255,0.2)',
                  borderRadius: '50%',
                  margin: '0 auto 8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                    <path d="M20 6L9 17l-5-5"/>
                  </svg>
                </div>
                <div style={{ fontSize: 14, fontWeight: 600 }}>{item.text}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Case Studies Section */}
      <section id="casos" style={{ padding: '80px 24px', background: '#F8FAFB' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 60 }}>
            <h2 style={{ fontSize: 14, fontWeight: 700, color: '#EE7E31', textTransform: 'uppercase', letterSpacing: 2, marginBottom: 12 }}>
              Casos de Éxito
            </h2>
            <h3 className="gradient-text" style={{ fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 900, marginBottom: 16 }}>
              Soluciones que Generan Resultados
            </h3>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 24 }}>
            {caseStudies.map((study, i) => (
              <div key={i} className="card hover-lift" style={{ padding: 32, position: 'relative', overflow: 'hidden' }}>
                <div style={{
                  position: 'absolute',
                  top: 0,
                  right: 0,
                  width: 60,
                  height: 60,
                  background: 'linear-gradient(135deg, #EE7E31, #f5a66d)',
                  borderRadius: '0 16px 0 60px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  paddingLeft: 15,
                  paddingBottom: 10
                }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                    <path d="M22 4L12 14.01l-3-3"/>
                  </svg>
                </div>

                <div style={{
                  display: 'inline-block',
                  background: '#E8F4F8',
                  color: '#2E6A80',
                  padding: '6px 12px',
                  borderRadius: 20,
                  fontSize: 12,
                  fontWeight: 600,
                  marginBottom: 16
                }}>{study.industry}</div>

                <h4 style={{ fontSize: 20, fontWeight: 700, color: '#2E6A80', marginBottom: 16 }}>{study.company}</h4>

                <div style={{ marginBottom: 12 }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: '#8E9DA6', marginBottom: 4 }}>DESAFÍO</div>
                  <p style={{ fontSize: 14, color: '#374151', lineHeight: 1.5 }}>{study.challenge}</p>
                </div>

                <div style={{ marginBottom: 12 }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: '#8E9DA6', marginBottom: 4 }}>SOLUCIÓN</div>
                  <p style={{ fontSize: 14, color: '#374151', lineHeight: 1.5 }}>{study.solution}</p>
                </div>

                <div style={{
                  background: 'linear-gradient(135deg, #E8F9F0, #d4f5e4)',
                  padding: 16,
                  borderRadius: 12,
                  marginTop: 16
                }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: '#059669', marginBottom: 4 }}>RESULTADO</div>
                  <div style={{ fontSize: 18, fontWeight: 700, color: '#047857' }}>{study.result}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quote Form Section */}
      <section id="cotizar" style={{
        padding: '80px 24px',
        background: 'linear-gradient(135deg, #2E6A80 0%, #1a4a5c 100%)',
        position: 'relative'
      }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <h2 style={{ fontSize: 14, fontWeight: 700, color: '#EE7E31', textTransform: 'uppercase', letterSpacing: 2, marginBottom: 12 }}>
              Cotización Rápida
            </h2>
            <h3 style={{ fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 900, color: 'white', marginBottom: 16 }}>
              Solicita tu Cotización en 3 Pasos
            </h3>
            <p style={{ color: 'rgba(255,255,255,0.8)', maxWidth: 500, margin: '0 auto' }}>
              Sin compromiso. Te respondemos en menos de {siteConfig.form.responseTime}.
            </p>
          </div>

          {/* Step indicators */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginBottom: 40, flexWrap: 'wrap' }}>
            {['Producto', 'Especificaciones', 'Contacto'].map((step, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{
                  width: 36,
                  height: 36,
                  borderRadius: '50%',
                  background: activeStep >= i ? '#EE7E31' : 'rgba(255,255,255,0.2)',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                  fontSize: 14,
                  transition: 'all 0.3s'
                }}>{activeStep > i ? '✓' : i + 1}</div>
                <span className="step-label" style={{
                  color: activeStep >= i ? 'white' : 'rgba(255,255,255,0.5)',
                  fontWeight: 500,
                  fontSize: 14
                }}>{step}</span>
                {i < 2 && <div style={{ width: 40, height: 2, background: activeStep > i ? '#EE7E31' : 'rgba(255,255,255,0.2)' }} />}
              </div>
            ))}
          </div>

          {/* Form card */}
          <div className="card" style={{ padding: 40 }}>
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
                <h4 style={{ fontSize: 24, fontWeight: 700, color: '#059669', marginBottom: 12 }}>
                  Cotizacion #{formStatus.quoteNumber} Enviada
                </h4>
                <p style={{ color: '#6B7280' }}>
                  Tu numero de seguimiento es <strong>#{formStatus.quoteNumber}</strong>.<br />
                  Te contactaremos en menos de {siteConfig.form.responseTime}.
                </p>
              </div>
            ) : (
              <>
                {activeStep === 0 && (
                  <div style={{ animation: 'fadeInUp 0.5s ease' }}>
                    <h4 style={{ fontSize: 20, fontWeight: 700, color: '#2E6A80', marginBottom: 24, textAlign: 'center' }}>
                      ¿Qué producto necesitas?
                    </h4>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 12 }}>
                      {products.filter(p => !p.comingSoon).map((product) => (
                        <div
                          key={product.id}
                          onClick={() => handleProductSelect(product.id)}
                          style={{
                            padding: 20,
                            borderRadius: 12,
                            border: `2px solid ${formData.producto === product.id ? '#EE7E31' : '#E5E7EB'}`,
                            background: formData.producto === product.id ? '#FFF7ED' : 'white',
                            cursor: 'pointer',
                            textAlign: 'center',
                            transition: 'all 0.3s'
                          }}
                        >
                          <div style={{ fontSize: 32, marginBottom: 8 }}>{product.icon}</div>
                          <div style={{ fontSize: 13, fontWeight: 600, color: '#2E6A80' }}>{product.name}</div>
                        </div>
                      ))}
                    </div>
                    <button
                      className="btn-primary"
                      style={{ width: '100%', marginTop: 32 }}
                      onClick={() => formData.producto && setActiveStep(1)}
                      disabled={!formData.producto}
                    >
                      Continuar
                    </button>
                  </div>
                )}

                {activeStep === 1 && (
                  <div style={{ animation: 'fadeInUp 0.5s ease' }}>
                    <h4 style={{ fontSize: 20, fontWeight: 700, color: '#2E6A80', marginBottom: 24, textAlign: 'center' }}>
                      Especificaciones del pedido
                    </h4>
                    <div style={{ display: 'grid', gap: 20 }}>
                      <div>
                        <label htmlFor="cantidad" style={{ display: 'block', marginBottom: 8, fontWeight: 600, color: '#374151' }}>
                          Cantidad aproximada
                        </label>
                        <input
                          type="text"
                          id="cantidad"
                          name="cantidad"
                          autoComplete="off"
                          placeholder="Ej: 500 unidades, 2 toneladas..."
                          value={formData.cantidad}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div>
                        <label htmlFor="medidas" style={{ display: 'block', marginBottom: 8, fontWeight: 600, color: '#374151' }}>
                          Medidas o especificaciones
                        </label>
                        <textarea
                          id="medidas"
                          rows={3}
                          name="medidas"
                          autoComplete="off"
                          placeholder="Ej: 40x30x20 cm, corrugado 17C, con impresion..."
                          value={formData.medidas}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: 16, marginTop: 32 }}>
                      <button className="btn-secondary" onClick={() => setActiveStep(0)}>
                        ← Volver
                      </button>
                      <button
                        className="btn-primary"
                        style={{ flex: 1 }}
                        onClick={() => setActiveStep(2)}
                      >
                        Continuar
                      </button>
                    </div>
                  </div>
                )}

                {activeStep === 2 && (
                  <div style={{ animation: 'fadeInUp 0.5s ease' }}>
                    <h4 style={{ fontSize: 20, fontWeight: 700, color: '#2E6A80', marginBottom: 24, textAlign: 'center' }}>
                      Datos de contacto
                    </h4>
                    <div style={{ display: 'grid', gap: 20 }}>
                      <div>
                        <label htmlFor="empresa" style={{ display: 'block', marginBottom: 8, fontWeight: 600, color: '#374151' }}>
                          Empresa / Nombre *
                        </label>
                        <input
                          type="text"
                          id="empresa"
                          name="empresa"
                          autoComplete="organization"
                          placeholder="Tu empresa o nombre"
                          value={formData.empresa}
                          onChange={handleInputChange}
                          className={formErrors.empresa ? 'error' : ''}
                        />
                        {formErrors.empresa && (
                          <span style={{ color: '#EF4444', fontSize: 12, marginTop: 4, display: 'block' }}>
                            {formErrors.empresa}
                          </span>
                        )}
                      </div>
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
                            Telefono *
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
                    </div>
                    <div style={{ display: 'flex', gap: 16, marginTop: 32 }}>
                      <button className="btn-secondary" onClick={() => setActiveStep(1)}>
                        ← Volver
                      </button>
                      <button
                        className="btn-primary"
                        style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
                        onClick={handleSubmit}
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
                          'Enviar Cotización'
                        )}
                      </button>
                    </div>
                    <p style={{ textAlign: 'center', marginTop: 16, fontSize: 13, color: '#8E9DA6' }}>
                      Te contactaremos en menos de {siteConfig.form.responseTime}
                    </p>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Quick contact */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: 32,
            marginTop: 32,
            flexWrap: 'wrap'
          }}>
            <a href={`tel:${siteConfig.contact.phoneClean}`} style={{
              color: 'white',
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              transition: 'opacity 0.3s'
            }}>
              Tel: {siteConfig.contact.phone}
            </a>
            <a href={`mailto:${siteConfig.contact.email}`} style={{
              color: 'white',
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              transition: 'opacity 0.3s'
            }}>
              Email: {siteConfig.contact.email}
            </a>
            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" style={{
              color: 'white',
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              transition: 'opacity 0.3s'
            }}>
              WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* Sectors Section */}
      <section style={{ padding: '80px 24px', background: 'white' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <h2 style={{ fontSize: 14, fontWeight: 700, color: '#EE7E31', textTransform: 'uppercase', letterSpacing: 2, marginBottom: 12 }}>
              Sectores
            </h2>
            <h3 className="gradient-text" style={{ fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 900 }}>
              Industrias que Confían en Nosotros
            </h3>
          </div>

          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: 16
          }}>
            {sectors.map((sector, i) => (
              <div key={i} style={{
                padding: '16px 24px',
                background: '#F8FAFB',
                borderRadius: 30,
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                transition: 'all 0.3s',
                cursor: 'default'
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = '#2E6A80';
                e.currentTarget.style.color = 'white';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = '#F8FAFB';
                e.currentTarget.style.color = 'inherit';
              }}
              >
                <span style={{ fontWeight: 600 }}>{sector.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        background: '#1a1a2e',
        color: 'white',
        padding: '60px 24px 30px'
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: 40,
            marginBottom: 40
          }}>
            {/* Brand */}
            <div>
              <div style={{ marginBottom: 20 }}>
                <img
                  src={siteConfig.company.logo}
                  alt={siteConfig.company.name}
                  style={{
                    height: 75,
                    width: 'auto',
                    objectFit: 'contain',
                    filter: 'brightness(0) invert(1)'
                  }}
                />
              </div>
              <p style={{ color: 'rgba(255,255,255,0.6)', lineHeight: 1.7, fontSize: 14 }}>
                {siteConfig.company.description}
              </p>
              {/* Social links */}
              <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
                {siteConfig.social.linkedin && (
                  <a href={siteConfig.social.linkedin} target="_blank" rel="noopener noreferrer" style={{ color: 'rgba(255,255,255,0.6)', transition: 'color 0.3s' }}>
                    LinkedIn
                  </a>
                )}
                {siteConfig.social.instagram && (
                  <a href={siteConfig.social.instagram} target="_blank" rel="noopener noreferrer" style={{ color: 'rgba(255,255,255,0.6)', transition: 'color 0.3s' }}>
                    Instagram
                  </a>
                )}
                {siteConfig.social.facebook && (
                  <a href={siteConfig.social.facebook} target="_blank" rel="noopener noreferrer" style={{ color: 'rgba(255,255,255,0.6)', transition: 'color 0.3s' }}>
                    Facebook
                  </a>
                )}
              </div>
            </div>

            {/* Products */}
            <div>
              <h5 style={{ fontWeight: 700, marginBottom: 20, color: '#EE7E31' }}>Productos</h5>
              {products.map((product, i) => (
                <a key={i} href="#productos" onClick={(e) => scrollToSection(e, 'productos')} style={{
                  display: 'block',
                  color: 'rgba(255,255,255,0.6)',
                  textDecoration: 'none',
                  marginBottom: 10,
                  fontSize: 14,
                  transition: 'color 0.3s'
                }}
                onMouseEnter={e => e.currentTarget.style.color = 'white'}
                onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.6)'}
                >{product.name}</a>
              ))}
            </div>

            {/* Company */}
            <div>
              <h5 style={{ fontWeight: 700, marginBottom: 20, color: '#EE7E31' }}>Empresa</h5>
              {[
                { name: 'Sobre Nosotros', section: null },
                { name: 'Proceso', section: 'proceso' },
                { name: 'Casos de Éxito', section: 'casos' },
                { name: 'Trabaja con Nosotros', section: null }
              ].map((item, i) => (
                <a key={i} href={item.section ? `#${item.section}` : '#'} onClick={(e) => item.section && scrollToSection(e, item.section)} style={{
                  display: 'block',
                  color: 'rgba(255,255,255,0.6)',
                  textDecoration: 'none',
                  marginBottom: 10,
                  fontSize: 14,
                  transition: 'color 0.3s'
                }}
                onMouseEnter={e => e.currentTarget.style.color = 'white'}
                onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.6)'}
                >{item.name}</a>
              ))}
            </div>

            {/* Contact */}
            <div>
              <h5 style={{ fontWeight: 700, marginBottom: 20, color: '#EE7E31' }}>Contacto</h5>
              <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: 14, lineHeight: 2 }}>
                <div>{siteConfig.address.full}</div>
                <div>
                  <a href={`tel:${siteConfig.contact.phoneClean}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                    Tel: {siteConfig.contact.phone}
                  </a>
                </div>
                <div>
                  <a href={`mailto:${siteConfig.contact.email}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                    Email: {siteConfig.contact.email}
                  </a>
                </div>
                <div>
                  <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'none' }}>
                    WhatsApp
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div style={{
            borderTop: '1px solid rgba(255,255,255,0.1)',
            paddingTop: 24,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 16
          }}>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13 }}>
              © {currentYear} {siteConfig.company.name}. Todos los derechos reservados.
            </p>
            <div style={{ display: 'flex', gap: 16 }}>
              {['LinkedIn', 'Instagram', 'Facebook'].map((social, i) => {
                const url = siteConfig.social[social.toLowerCase()];
                if (!url) return null;
                return (
                  <a key={i} href={url} target="_blank" rel="noopener noreferrer" style={{
                    color: 'rgba(255,255,255,0.4)',
                    textDecoration: 'none',
                    fontSize: 13,
                    transition: 'color 0.3s'
                  }}
                  onMouseEnter={e => e.currentTarget.style.color = '#EE7E31'}
                  onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.4)'}
                  >{social}</a>
                );
              })}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
