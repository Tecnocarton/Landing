'use client'

import React, { useState, useEffect, useCallback, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  siteConfig,
  products,
  cardboardTypes,
  caseStudies,
  clients
} from '../config/site';

// Animation variants - hoisted outside component (rendering-hoist-jsx)
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 }
  }
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1 }
};

// Custom hook for intersection observer - optimized with passive listener
const useInView = (threshold = 0.1) => {
  const [ref, setRef] = useState(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    if (!ref) return;
    const observer = new IntersectionObserver(
      ([entry]) => setIsInView(entry.isIntersecting),
      { threshold, rootMargin: '50px' }
    );
    observer.observe(ref);
    return () => observer.disconnect();
  }, [ref, threshold]);

  return [setRef, isInView];
};

// Memoized Counter component (rerender-memo)
const Counter = memo(({ end, suffix = '', duration = 2000 }) => {
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
});

Counter.displayName = 'Counter';

// Memoized StatCard component for rerender optimization
const StatCard = memo(({ stat }) => (
  <motion.div
    variants={fadeInUp}
    whileHover={{ y: -8, boxShadow: '0 20px 40px rgba(46,106,128,0.2)' }}
    transition={{ duration: 0.3 }}
    className="card stat-card"
    style={{
      padding: 24,
      background: 'rgba(255,255,255,0.95)',
      textAlign: 'center'
    }}
  >
    <div className="stat-number" style={{ fontSize: 36, fontWeight: 900, color: '#2E6A80', marginBottom: 8 }}>
      {stat.isText ? stat.value : <Counter end={stat.value} suffix={stat.suffix} />}
    </div>
    <div style={{ fontSize: 14, color: '#6B7280', fontWeight: 500 }}>
      {stat.label}
    </div>
  </motion.div>
));

StatCard.displayName = 'StatCard';

// Memoized ProductCard component
const ProductCard = memo(({ product }) => (
  <motion.div
    variants={fadeInUp}
    whileHover={{ y: -8, boxShadow: '0 20px 40px rgba(46,106,128,0.15)' }}
    transition={{ duration: 0.3 }}
    className="card"
    style={{
      padding: 20,
      textAlign: 'center',
      position: 'relative',
      background: 'white'
    }}
  >
    {!product.available && (
      <div className="coming-soon-badge">Coming Soon</div>
    )}
    <div style={{
      width: 64,
      height: 64,
      background: 'linear-gradient(135deg, #EE7E31, #f5a66d)',
      borderRadius: 12,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      margin: '0 auto 16px',
      fontSize: 32
    }}>
      📦
    </div>
    <h4 style={{ fontSize: 16, fontWeight: 700, color: '#2E6A80', marginBottom: 8 }}>
      {product.name}
    </h4>
    <p style={{ fontSize: 12, color: '#6B7280', marginBottom: 12 }}>
      {product.desc}
    </p>
    <div style={{ fontSize: 11, color: '#EE7E31', fontWeight: 600 }}>
      {product.minOrder}
    </div>
  </motion.div>
));

ProductCard.displayName = 'ProductCard';

// Smooth scroll function - hoisted outside component
const scrollToSection = (e, sectionId) => {
  e.preventDefault();
  const element = document.getElementById(sectionId);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
};

// Email validation regex - hoisted outside component (js-hoist-regexp)
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function TecnocartonLanding() {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    producto: '',
    cantidad: '',
    tiposCarton: [], // Para planchas: 12C, 14C, 17C, 20C
    formatosRollo: [], // Para rollos: 10, 20, 23, 25, 30, 35, 40, 45, 50 kg
    detalle: '', // Detalles adicionales
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

  // Passive scroll listener for better performance (client-passive-event-listeners)
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll, { passive: true });
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

  // Form validation - using hoisted EMAIL_REGEX (js-hoist-regexp)
  const validateField = useCallback((name, value) => {
    switch (name) {
      case 'empresa':
        if (!value || value.trim().length < 2) {
          return 'El nombre es requerido (mínimo 2 caracteres)';
        }
        break;
      case 'email':
        if (!value || !EMAIL_REGEX.test(value)) {
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
    if (!formData.email || !EMAIL_REGEX.test(formData.email)) {
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
            tiposCarton: [],
            formatosRollo: [],
            detalle: '',
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


  const stats = [
    { value: 90, suffix: '%+', label: 'Tasa de Recompra' },
    { value: 200, suffix: '+', label: 'Clientes Activos' },
    { value: 200, suffix: '+', label: 'Ton/Mes' },
    { value: 'RM', suffix: '', label: 'Cobertura de Entregas', isText: true }
  ];

  const currentYear = new Date().getFullYear();

  return (
    <div style={{ fontFamily: "'DM Sans', 'Segoe UI', system-ui, sans-serif", background: '#FAFBFC', minHeight: '100vh' }}>
      {/* Professional Typography & Design System */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,100..1000;1,9..40,100..1000&family=Plus+Jakarta+Sans:ital,wght@0,200..800;1,200..800&display=swap');

        :root {
          --color-primary: #1B4D5C;
          --color-primary-light: #2E6A80;
          --color-primary-dark: #0F3540;
          --color-accent: #E67635;
          --color-accent-light: #F29559;
          --color-accent-dark: #C45A1A;
          --color-surface: #FFFFFF;
          --color-surface-elevated: #FAFBFC;
          --color-text: #1A2B32;
          --color-text-muted: #5A6B73;
          --color-text-subtle: #8A9BA3;
          --color-border: #E2E8EC;
          --color-border-light: #F0F3F5;
          --shadow-sm: 0 1px 2px rgba(27, 77, 92, 0.04);
          --shadow-md: 0 4px 12px rgba(27, 77, 92, 0.08);
          --shadow-lg: 0 8px 30px rgba(27, 77, 92, 0.12);
          --shadow-xl: 0 20px 50px rgba(27, 77, 92, 0.15);
          --radius-sm: 6px;
          --radius-md: 12px;
          --radius-lg: 20px;
          --radius-xl: 28px;
        }

        * {
          font-family: 'DM Sans', 'Segoe UI', system-ui, sans-serif;
        }

        h1, h2, h3, h4, h5, h6 {
          font-family: 'Plus Jakarta Sans', 'DM Sans', system-ui, sans-serif;
          letter-spacing: -0.02em;
        }

        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-8px) rotate(1deg); }
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.02); opacity: 0.9; }
        }
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
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
        @keyframes glow {
          0%, 100% { box-shadow: 0 0 20px rgba(230, 118, 53, 0.3); }
          50% { box-shadow: 0 0 40px rgba(230, 118, 53, 0.5); }
        }

        .animate-fadeIn { animation: fadeInUp 0.6s cubic-bezier(0.22, 1, 0.36, 1) forwards; }
        .animate-float { animation: float 4s ease-in-out infinite; }
        .animate-pulse { animation: pulse 3s ease-in-out infinite; }

        .gradient-text {
          background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-accent) 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .gradient-text-subtle {
          background: linear-gradient(135deg, var(--color-primary-dark) 0%, var(--color-primary-light) 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .btn-primary {
          background: linear-gradient(135deg, var(--color-accent) 0%, var(--color-accent-dark) 100%);
          color: white;
          border: none;
          padding: 16px 32px;
          border-radius: var(--radius-md);
          font-weight: 600;
          font-size: 15px;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.22, 1, 0.36, 1);
          box-shadow: 0 4px 14px rgba(230, 118, 53, 0.35), inset 0 1px 0 rgba(255,255,255,0.2);
          position: relative;
          overflow: hidden;
        }
        .btn-primary::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
          transition: left 0.5s;
        }
        .btn-primary:hover::before {
          left: 100%;
        }
        .btn-primary:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 25px rgba(230, 118, 53, 0.45), inset 0 1px 0 rgba(255,255,255,0.2);
        }
        .btn-primary:active {
          transform: translateY(-1px);
        }
        .btn-primary:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
          box-shadow: none;
        }

        .btn-secondary {
          background: transparent;
          color: var(--color-primary);
          border: 2px solid var(--color-primary);
          padding: 14px 28px;
          border-radius: var(--radius-md);
          font-weight: 600;
          font-size: 15px;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.22, 1, 0.36, 1);
          position: relative;
          overflow: hidden;
        }
        .btn-secondary::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: var(--color-primary);
          transform: scaleX(0);
          transform-origin: right;
          transition: transform 0.3s cubic-bezier(0.22, 1, 0.36, 1);
          z-index: -1;
        }
        .btn-secondary:hover::before {
          transform: scaleX(1);
          transform-origin: left;
        }
        .btn-secondary:hover {
          color: white;
          border-color: var(--color-primary);
        }

        .card {
          background: var(--color-surface);
          border-radius: var(--radius-lg);
          box-shadow: var(--shadow-md);
          transition: all 0.4s cubic-bezier(0.22, 1, 0.36, 1);
          border: 1px solid var(--color-border-light);
        }
        .card:hover {
          box-shadow: var(--shadow-xl);
          transform: translateY(-4px);
        }

        .card-glass {
          background: rgba(255, 255, 255, 0.85);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.5);
        }

        input, select, textarea {
          width: 100%;
          padding: 16px 20px;
          border: 2px solid var(--color-border);
          border-radius: var(--radius-md);
          font-size: 15px;
          transition: all 0.3s cubic-bezier(0.22, 1, 0.36, 1);
          background: var(--color-surface);
          box-sizing: border-box;
          font-family: inherit;
          color: var(--color-text);
        }
        input::placeholder, textarea::placeholder {
          color: var(--color-text-subtle);
        }
        input:focus, select:focus, textarea:focus {
          outline: none;
          border-color: var(--color-primary);
          box-shadow: 0 0 0 4px rgba(27, 77, 92, 0.1);
        }
        input.error, textarea.error {
          border-color: #DC2626;
          box-shadow: 0 0 0 4px rgba(220, 38, 38, 0.1);
        }

        .nav-link {
          color: var(--color-primary);
          text-decoration: none;
          font-weight: 500;
          padding: 10px 18px;
          border-radius: var(--radius-sm);
          transition: all 0.3s cubic-bezier(0.22, 1, 0.36, 1);
          position: relative;
        }
        .nav-link::after {
          content: '';
          position: absolute;
          bottom: 6px;
          left: 18px;
          right: 18px;
          height: 2px;
          background: var(--color-accent);
          transform: scaleX(0);
          transition: transform 0.3s cubic-bezier(0.22, 1, 0.36, 1);
        }
        .nav-link:hover::after {
          transform: scaleX(1);
        }
        .nav-link:hover {
          color: var(--color-primary-dark);
        }

        .mobile-menu {
          display: none;
          position: absolute;
          top: 100%;
          left: 0;
          right: 0;
          background: rgba(255, 255, 255, 0.98);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          padding: 20px;
          box-shadow: var(--shadow-lg);
          flex-direction: column;
          gap: 8px;
          border-top: 1px solid var(--color-border-light);
        }
        .mobile-menu.open {
          display: flex;
        }

        .hamburger {
          display: none;
          flex-direction: column;
          gap: 5px;
          cursor: pointer;
          padding: 10px;
          border-radius: var(--radius-sm);
          transition: background 0.3s;
        }
        .hamburger:hover {
          background: rgba(27, 77, 92, 0.05);
        }
        .hamburger span {
          display: block;
          width: 22px;
          height: 2px;
          background: var(--color-primary);
          transition: all 0.3s cubic-bezier(0.22, 1, 0.36, 1);
          border-radius: 2px;
        }
        .hamburger.open span:nth-child(1) {
          transform: rotate(45deg) translate(5px, 5px);
        }
        .hamburger.open span:nth-child(2) {
          opacity: 0;
          transform: scaleX(0);
        }
        .hamburger.open span:nth-child(3) {
          transform: rotate(-45deg) translate(5px, -5px);
        }

        .coming-soon-badge {
          position: absolute;
          top: 12px;
          right: 12px;
          background: linear-gradient(135deg, #7C3AED, #5B21B6);
          color: white;
          font-size: 10px;
          font-weight: 700;
          padding: 5px 10px;
          border-radius: var(--radius-sm);
          text-transform: uppercase;
          letter-spacing: 0.5px;
          box-shadow: 0 2px 8px rgba(124, 58, 237, 0.3);
        }

        .section-label {
          font-size: 13px;
          font-weight: 700;
          color: var(--color-accent);
          text-transform: uppercase;
          letter-spacing: 2px;
          margin-bottom: 12px;
          display: inline-block;
        }

        .noise-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          opacity: 0.03;
          pointer-events: none;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
        }
        /* Responsive Design */
        @media (max-width: 1024px) {
          .hero-grid {
            grid-template-columns: 1fr !important;
            gap: 40px !important;
          }
          .stats-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
          .footer-grid {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 32px !important;
          }
          .quote-section-grid {
            grid-template-columns: 1fr !important;
          }
          .case-studies-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
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
          .hero-grid {
            padding: 100px 16px 60px !important;
            gap: 32px !important;
          }
          .stats-grid {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 12px !important;
          }
          .value-grid, .products-grid {
            grid-template-columns: 1fr !important;
          }
          .footer-grid {
            grid-template-columns: 1fr !important;
            text-align: center;
          }
          .footer-grid > div {
            display: flex;
            flex-direction: column;
            align-items: center;
          }
          .section-padding {
            padding: 60px 16px !important;
          }
          .quote-form-card {
            padding: 24px !important;
          }
          .case-studies-grid {
            grid-template-columns: 1fr !important;
          }
          .clients-section {
            padding: 40px 16px !important;
          }
        }
        @media (max-width: 500px) {
          .step-label {
            display: none;
          }
          .hero-grid {
            padding: 90px 12px 40px !important;
          }
          .stats-grid {
            grid-template-columns: 1fr !important;
            gap: 12px !important;
          }
          .stat-card {
            padding: 16px !important;
          }
          .stat-number {
            font-size: 28px !important;
          }
          .btn-primary, .btn-secondary {
            padding: 12px 24px;
            font-size: 14px;
          }
          .section-title {
            font-size: 24px !important;
          }
          .quote-form-card {
            padding: 16px !important;
            margin: 0 -8px;
            border-radius: 12px !important;
          }
          .form-buttons {
            flex-direction: column !important;
          }
          .form-buttons button {
            width: 100% !important;
          }
          .cardboard-info-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
        html {
          scroll-behavior: smooth;
        }
        /* Clients carousel infinite scroll animation */
        @keyframes scroll-left {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(calc(-100% / 3));
          }
        }
        .clients-carousel {
          animation: scroll-left 30s linear infinite;
        }
        .clients-carousel:hover {
          animation-play-state: paused;
        }
      `}</style>

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
            <a href="/proceso" className="nav-link">Proceso</a>
            <a href="/trabaja-con-nosotros" className="nav-link">Trabaja con nosotros</a>
            <motion.a
              href="#cotizar"
              onClick={(e) => scrollToSection(e, 'cotizar')}
              className="btn-primary"
              style={{ marginLeft: 16, textDecoration: 'none' }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Cotizar Ahora
            </motion.a>
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
            <a href="/proceso" onClick={() => setIsMenuOpen(false)} className="nav-link">Proceso</a>
            <a href="/trabaja-con-nosotros" onClick={() => setIsMenuOpen(false)} className="nav-link">Trabaja con Nosotros</a>
            <a href="#cotizar" onClick={(e) => { scrollToSection(e, 'cotizar'); setIsMenuOpen(false); }} className="btn-primary" style={{ textAlign: 'center', textDecoration: 'none', marginTop: 8 }}>Cotizar Ahora</a>
          </div>
        </div>
      </motion.nav>

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
                transition: 'opacity 1.8s cubic-bezier(0.22, 1, 0.36, 1)',
                transform: currentSlide === index ? 'scale(1)' : 'scale(1.05)'
              }}
            />
          ))}
          {/* Sophisticated dark overlay with gradient */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'linear-gradient(135deg, rgba(27,77,92,0.92) 0%, rgba(15,53,64,0.88) 50%, rgba(27,77,92,0.9) 100%)'
          }} />
          {/* Subtle noise texture overlay */}
          <div className="noise-overlay" />
          {/* Decorative gradient orbs */}
          <div style={{
            position: 'absolute',
            top: '10%',
            right: '10%',
            width: 400,
            height: 400,
            background: 'radial-gradient(circle, rgba(230,118,53,0.15) 0%, transparent 70%)',
            borderRadius: '50%',
            filter: 'blur(60px)',
            pointerEvents: 'none'
          }} />
          <div style={{
            position: 'absolute',
            bottom: '20%',
            left: '5%',
            width: 300,
            height: 300,
            background: 'radial-gradient(circle, rgba(46,106,128,0.2) 0%, transparent 70%)',
            borderRadius: '50%',
            filter: 'blur(50px)',
            pointerEvents: 'none'
          }} />
        </div>

        {/* Carousel indicators - refined design */}
        <div style={{
          position: 'absolute',
          bottom: 48,
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          gap: 10,
          zIndex: 2,
          padding: '8px 16px',
          background: 'rgba(255,255,255,0.1)',
          borderRadius: 24,
          backdropFilter: 'blur(10px)'
        }}>
          {carouselImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              aria-label={`Slide ${index + 1}`}
              style={{
                width: currentSlide === index ? 28 : 10,
                height: 10,
                borderRadius: 5,
                border: 'none',
                background: currentSlide === index
                  ? 'linear-gradient(135deg, #E67635 0%, #F29559 100%)'
                  : 'rgba(255,255,255,0.4)',
                cursor: 'pointer',
                transition: 'all 0.4s cubic-bezier(0.22, 1, 0.36, 1)',
                boxShadow: currentSlide === index ? '0 2px 8px rgba(230,118,53,0.4)' : 'none'
              }}
            />
          ))}
        </div>

        <div className="hero-grid" style={{ maxWidth: 1200, margin: '0 auto', padding: '120px 24px 80px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 60, alignItems: 'center', position: 'relative', zIndex: 1 }}>
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              style={{
                display: 'inline-block',
                background: 'rgba(238,126,49,0.2)',
                color: '#EE7E31',
                padding: '8px 16px',
                borderRadius: 20,
                fontSize: 14,
                fontWeight: 600,
                marginBottom: 24,
                border: '1px solid rgba(238,126,49,0.3)'
              }}
            >
              Experiencia desde {siteConfig.company.foundedYear}
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              style={{
                fontSize: 'clamp(36px, 5vw, 56px)',
                fontWeight: 900,
                color: 'white',
                lineHeight: 1.1,
                marginBottom: 24
              }}
            >
              Soluciones de embalaje en{' '}
              <span style={{ color: '#EE7E31' }}>cartón corrugado</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              style={{
                fontSize: 18,
                color: 'rgba(255,255,255,0.85)',
                lineHeight: 1.7,
                marginBottom: 32,
                maxWidth: 500
              }}
            >
              Desde materia prima hasta producto terminado. Combinamos capacidad industrial
              con flexibilidad artesanal para entregar exactamente lo que tu negocio necesita.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}
            >
              <motion.a
                href="#cotizar"
                onClick={(e) => scrollToSection(e, 'cotizar')}
                className="btn-primary"
                style={{ fontSize: 17, textDecoration: 'none' }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Solicitar Cotización
              </motion.a>
              <motion.a
                href="/proceso"
                className="btn-secondary"
                style={{
                  borderColor: 'rgba(255,255,255,0.5)',
                  color: 'white',
                  textDecoration: 'none'
                }}
                whileHover={{ scale: 1.05, backgroundColor: 'rgba(255,255,255,0.1)' }}
                whileTap={{ scale: 0.95 }}
              >
                Ver Proceso
              </motion.a>
            </motion.div>

            {/* Trust badges */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              style={{ marginTop: 40, display: 'flex', gap: 24, flexWrap: 'wrap' }}
            >
              {['Producción Propia', 'Entrega Nacional', 'Pedidos Flexibles'].map((badge, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 + i * 0.1 }}
                  style={{
                    color: 'rgba(255,255,255,0.8)',
                    fontSize: 14,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6
                  }}
                >
                  <span style={{ color: '#EE7E31' }}>✓</span> {badge}
                </motion.span>
              ))}
            </motion.div>
          </motion.div>

          {/* Stats cards */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="stats-grid"
            style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}
          >
            {stats.map((stat, i) => (
              <StatCard key={i} stat={stat} />
            ))}
          </motion.div>
        </div>
      </section>

      {/* Value Proposition */}
      <section className="section-padding" style={{ padding: '80px 24px', background: 'white' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={fadeInUp}
            transition={{ duration: 0.6 }}
            style={{ textAlign: 'center', marginBottom: 60 }}
          >
            <h2 style={{ fontSize: 14, fontWeight: 700, color: '#EE7E31', textTransform: 'uppercase', letterSpacing: 2, marginBottom: 12 }}>
              ¿Por qué {siteConfig.company.name}?
            </h2>
            <h3 className="gradient-text" style={{ fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 900, marginBottom: 16 }}>
              La mejor opción en embalaje
            </h3>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            variants={staggerContainer}
            className="value-grid"
            style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 24 }}
          >
            {[
              { title: 'Integración Vertical', desc: 'Control total desde la materia prima hasta el producto final. Sin intermediarios.' },
              { title: 'Cobertura Nacional', desc: 'Flota propia para entregas en todo Chile. Rapidez y confiabilidad garantizada.' },
              { title: 'Flexibilidad Híbrida', desc: 'Grandes volúmenes industriales o pedidos personalizados. Nos adaptamos a ti.' },
              { title: 'Precios de Fábrica', desc: 'Directo del productor. Elimina costos de intermediación y ahorra.' }
            ].map((item, i) => (
              <motion.div
                key={i}
                variants={fadeInUp}
                whileHover={{ y: -8, boxShadow: '0 20px 40px rgba(46,106,128,0.15)' }}
                transition={{ duration: 0.3 }}
                className="card"
                style={{ padding: 32, textAlign: 'center' }}
              >
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                  style={{
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
                  }}
                >{i + 1}</motion.div>
                <h4 style={{ fontSize: 20, fontWeight: 700, color: '#2E6A80', marginBottom: 12 }}>{item.title}</h4>
                <p style={{ color: '#6B7280', lineHeight: 1.6 }}>{item.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Products Section */}
      <section id="productos" className="section-padding" style={{ padding: '80px 24px', background: '#F8FAFB' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={fadeInUp}
            transition={{ duration: 0.6 }}
            style={{ textAlign: 'center', marginBottom: 60 }}
          >
            <h2 style={{ fontSize: 14, fontWeight: 700, color: '#EE7E31', textTransform: 'uppercase', letterSpacing: 2, marginBottom: 12 }}>
              Catálogo
            </h2>
            <h3 className="gradient-text" style={{ fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 900 }}>
              Nuestros productos
            </h3>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            variants={staggerContainer}
            className="products-grid"
            style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 20 }}
          >
            {products.map((product, i) => (
              <motion.a
                key={i}
                variants={scaleIn}
                whileHover={!product.comingSoon ? { y: -8, boxShadow: '0 20px 40px rgba(46,106,128,0.15)' } : {}}
                whileTap={!product.comingSoon ? { scale: 0.98 } : {}}
                transition={{ duration: 0.3 }}
                href="#cotizar"
                onClick={(e) => {
                  if (!product.comingSoon) {
                    scrollToSection(e, 'cotizar');
                    handleProductSelect(product.id);
                  } else {
                    e.preventDefault();
                  }
                }}
                className="card"
                style={{
                  padding: 28,
                  textAlign: 'center',
                  cursor: product.comingSoon ? 'default' : 'pointer',
                  border: '2px solid transparent',
                  textDecoration: 'none',
                  position: 'relative',
                  opacity: product.comingSoon ? 0.7 : 1,
                  display: 'block'
                }}
              >
                {product.comingSoon && (
                  <div className="coming-soon-badge">Próximamente</div>
                )}
                <div style={{
                  width: 80,
                  height: 80,
                  borderRadius: 12,
                  margin: '0 auto 16px',
                  overflow: 'hidden',
                  background: product.image ? '#f5f5f5' : 'linear-gradient(135deg, #EE7E31, #f5a66d)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {product.image ? (
                    <img
                      src={product.image}
                      alt={product.name}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover'
                      }}
                    />
                  ) : (
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                      <rect x="3" y="3" width="18" height="18" rx="2"/>
                      <path d="M3 9h18M9 21V9"/>
                    </svg>
                  )}
                </div>
                <h4 style={{ fontSize: 16, fontWeight: 700, color: '#2E6A80', marginBottom: 8 }}>{product.name}</h4>
                <p style={{ fontSize: 13, color: '#8E9DA6', marginBottom: 8 }}>{product.desc}</p>
                {product.minOrder && (
                  <p style={{
                    fontSize: 11,
                    color: '#EE7E31',
                    fontWeight: 600,
                    background: 'rgba(238,126,49,0.1)',
                    padding: '4px 8px',
                    borderRadius: 4,
                    display: 'inline-block'
                  }}>{product.minOrder}</p>
                )}
              </motion.a>
            ))}
          </motion.div>

          {/* Cardboard types info */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            variants={fadeInUp}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="card"
            style={{ marginTop: 40, padding: 32 }}
          >
            <h4 style={{ fontSize: 18, fontWeight: 700, color: '#2E6A80', marginBottom: 20, textAlign: 'center' }}>
              Tipos de cartón disponibles
            </h4>
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
              className="cardboard-info-grid"
              style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 24 }}
            >
              {cardboardTypes.map((item, i) => (
                <motion.div
                  key={i}
                  variants={fadeInUp}
                  whileHover={{ x: 5, borderLeftColor: '#2E6A80' }}
                  transition={{ duration: 0.2 }}
                  style={{
                    padding: 20,
                    background: '#F8FAFB',
                    borderRadius: 12,
                    borderLeft: '4px solid #EE7E31'
                  }}
                >
                  <div style={{ fontWeight: 700, color: '#2E6A80', marginBottom: 8 }}>{item.type}</div>
                  <div style={{ fontSize: 14, color: '#8E9DA6', marginBottom: 4 }}>Gramaje: {item.weight}</div>
                  <div style={{ fontSize: 14, color: '#8E9DA6' }}>Ideal para: {item.use}</div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Case Studies Section */}
      <section id="casos" className="section-padding" style={{ padding: '80px 24px', background: '#F8FAFB' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={fadeInUp}
            transition={{ duration: 0.6 }}
            style={{ textAlign: 'center', marginBottom: 60 }}
          >
            <h2 style={{ fontSize: 14, fontWeight: 700, color: '#EE7E31', textTransform: 'uppercase', letterSpacing: 2, marginBottom: 12 }}>
              Casos de éxito
            </h2>
            <h3 className="gradient-text" style={{ fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 900, marginBottom: 16 }}>
              Soluciones que generan resultados
            </h3>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            variants={staggerContainer}
            className="case-studies-grid"
            style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 24 }}
          >
            {caseStudies.map((study, i) => (
              <motion.div
                key={i}
                variants={fadeInUp}
                whileHover={{ y: -8, boxShadow: '0 20px 40px rgba(46,106,128,0.15)' }}
                transition={{ duration: 0.3 }}
                className="card"
                style={{ padding: 32, position: 'relative', overflow: 'hidden' }}
              >
                <motion.div
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ type: 'spring', stiffness: 200, delay: 0.2 + i * 0.1 }}
                  style={{
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
                  }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                    <path d="M22 4L12 14.01l-3-3"/>
                  </svg>
                </motion.div>

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

                <motion.div
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                  style={{
                    background: 'linear-gradient(135deg, #E8F9F0, #d4f5e4)',
                    padding: 16,
                    borderRadius: 12,
                    marginTop: 16
                  }}
                >
                  <div style={{ fontSize: 12, fontWeight: 600, color: '#059669', marginBottom: 4 }}>RESULTADO</div>
                  <div style={{ fontSize: 18, fontWeight: 700, color: '#047857' }}>{study.result}</div>
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Quote Form Section */}
      <section id="cotizar" className="section-padding" style={{
        padding: '80px 24px',
        background: 'linear-gradient(135deg, #2E6A80 0%, #1a4a5c 100%)',
        position: 'relative'
      }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={fadeInUp}
            transition={{ duration: 0.6 }}
            style={{ textAlign: 'center', marginBottom: 48 }}
          >
            <h2 style={{ fontSize: 14, fontWeight: 700, color: '#EE7E31', textTransform: 'uppercase', letterSpacing: 2, marginBottom: 12 }}>
              Cotización rápida
            </h2>
            <h3 style={{ fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 900, color: 'white', marginBottom: 16 }}>
              Solicita tu cotización en 3 Pasos
            </h3>
            <p style={{ color: 'rgba(255,255,255,0.8)', maxWidth: 500, margin: '0 auto' }}>
              Sin compromiso. Te respondemos en menos de {siteConfig.form.responseTime}.
            </p>
          </motion.div>

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
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            variants={scaleIn}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="card quote-form-card"
            style={{ padding: 40 }}
          >
            <AnimatePresence mode="wait">
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
                    color: '#DC2626',
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
                transition={{ type: 'spring', stiffness: 200 }}
                style={{ textAlign: 'center', padding: 40 }}
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
                  style={{
                    width: 80,
                    height: 80,
                    background: 'linear-gradient(135deg, #059669, #10B981)',
                    borderRadius: '50%',
                    margin: '0 auto 16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                    <path d="M20 6L9 17l-5-5"/>
                  </svg>
                </motion.div>
                <motion.h4
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  style={{ fontSize: 24, fontWeight: 700, color: '#059669', marginBottom: 12 }}
                >
                  ¡Solicitud Enviada!
                </motion.h4>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  style={{ color: '#6B7280' }}
                >
                  Hemos recibido tu solicitud de cotización.<br />
                  Te contactaremos en menos de {siteConfig.form.responseTime}.
                </motion.p>
              </motion.div>
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
                      {/* Cantidad - adaptada según producto */}
                      <div>
                        <label htmlFor="cantidad" style={{ display: 'block', marginBottom: 8, fontWeight: 600, color: '#374151' }}>
                          Cantidad aproximada
                        </label>
                        <input
                          type="text"
                          id="cantidad"
                          name="cantidad"
                          autoComplete="off"
                          placeholder={
                            formData.producto === 'planchas' ? 'Ej: 1500 unidades' :
                            formData.producto === 'rollos' ? 'Ej: 300 kg' :
                            formData.producto === 'troquelado' ? 'Ej: 2000 unidades' :
                            'Ej: 500 unidades'
                          }
                          value={formData.cantidad}
                          onChange={handleInputChange}
                        />
                      </div>

                      {/* Tipos de cartón para Planchas */}
                      {formData.producto === 'planchas' && (
                        <div>
                          <label style={{ display: 'block', marginBottom: 8, fontWeight: 600, color: '#374151' }}>
                            Tipo de cartón (puedes seleccionar varios)
                          </label>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                            {['12C', '14C', '17C', '20C'].map((tipo) => (
                              <button
                                key={tipo}
                                type="button"
                                onClick={() => {
                                  setFormData(prev => ({
                                    ...prev,
                                    tiposCarton: prev.tiposCarton.includes(tipo)
                                      ? prev.tiposCarton.filter(t => t !== tipo)
                                      : [...prev.tiposCarton, tipo]
                                  }));
                                }}
                                style={{
                                  padding: '10px 20px',
                                  borderRadius: 8,
                                  border: `2px solid ${formData.tiposCarton.includes(tipo) ? '#EE7E31' : '#E5E7EB'}`,
                                  background: formData.tiposCarton.includes(tipo) ? '#FFF7ED' : 'white',
                                  color: formData.tiposCarton.includes(tipo) ? '#EE7E31' : '#374151',
                                  fontWeight: 600,
                                  cursor: 'pointer',
                                  transition: 'all 0.2s'
                                }}
                              >
                                {tipo}
                              </button>
                            ))}
                          </div>
                          <p style={{ fontSize: 12, color: '#6B7280', marginTop: 8 }}>
                            12C: Ligero | 14C: Medio | 17C: General | 20C: Pesado
                          </p>
                        </div>
                      )}

                      {/* Formatos de rollo para Rollos */}
                      {formData.producto === 'rollos' && (
                        <div>
                          <label style={{ display: 'block', marginBottom: 8, fontWeight: 600, color: '#374151' }}>
                            Formato de rollo en kg (puedes seleccionar varios)
                          </label>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                            {['10', '20', '23', '25', '30', '35', '40', '45', '50'].map((formato) => (
                              <button
                                key={formato}
                                type="button"
                                onClick={() => {
                                  setFormData(prev => ({
                                    ...prev,
                                    formatosRollo: prev.formatosRollo.includes(formato)
                                      ? prev.formatosRollo.filter(f => f !== formato)
                                      : [...prev.formatosRollo, formato]
                                  }));
                                }}
                                style={{
                                  padding: '10px 16px',
                                  borderRadius: 8,
                                  border: `2px solid ${formData.formatosRollo.includes(formato) ? '#EE7E31' : '#E5E7EB'}`,
                                  background: formData.formatosRollo.includes(formato) ? '#FFF7ED' : 'white',
                                  color: formData.formatosRollo.includes(formato) ? '#EE7E31' : '#374151',
                                  fontWeight: 600,
                                  cursor: 'pointer',
                                  transition: 'all 0.2s'
                                }}
                              >
                                {formato} kg
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Detalle adicional */}
                      <div>
                        <label htmlFor="detalle" style={{ display: 'block', marginBottom: 8, fontWeight: 600, color: '#374151' }}>
                          {formData.producto === 'troquelado' ? 'Describe tu diseño o requerimiento' : 'Detalles adicionales (opcional)'}
                        </label>
                        <textarea
                          id="detalle"
                          rows={3}
                          name="detalle"
                          autoComplete="off"
                          placeholder={
                            formData.producto === 'planchas' ? 'Ej: Medidas, ancho 1200 x largo 2000 mm, ...' :
                            formData.producto === 'rollos' ? 'Ej: alto 1.2 m, para embalaje de muebles...' :
                            formData.producto === 'troquelado' ? 'Describe las medidas, forma y uso del troquelado...' :
                            'Especificaciones adicionales...'
                          }
                          value={formData.detalle}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                    <div className="form-buttons" style={{ display: 'flex', gap: 16, marginTop: 32 }}>
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
                    <div className="form-buttons" style={{ display: 'flex', gap: 16, marginTop: 32 }}>
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
          </motion.div>

          {/* Quick contact */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: 32,
            marginTop: 32,
            flexWrap: 'wrap'
          }}>
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
          </div>

          {/* Location Map */}
          <div className="card" style={{
            marginTop: 40,
            padding: 0,
            overflow: 'hidden',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))'
          }}>
            {/* Map */}
            <div style={{ minHeight: 280 }}>
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3329.8!2d-70.8653298!3d-33.5556683!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9662e700524c71c7%3A0x26c3e48b6bfc89e5!2sTecnocarton!5e0!3m2!1ses!2scl!4v1705000000000!5m2!1ses!2scl"
                width="100%"
                height="100%"
                style={{ border: 0, display: 'block', minHeight: 280 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Ubicación Tecnocarton"
              />
            </div>
            {/* Address info */}
            <div style={{
              padding: 32,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              background: 'white'
            }}>
              <h4 style={{ fontSize: 20, fontWeight: 700, color: '#2E6A80', marginBottom: 16 }}>
                Visítanos
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                  <div style={{
                    width: 40,
                    height: 40,
                    background: 'linear-gradient(135deg, #EE7E31, #f5a66d)',
                    borderRadius: 10,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                      <circle cx="12" cy="10" r="3"/>
                    </svg>
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, color: '#374151', marginBottom: 4 }}>Dirección</div>
                    <div style={{ color: '#6B7280', lineHeight: 1.5 }}>
                      {siteConfig.address.street}<br />
                      {siteConfig.address.city}, {siteConfig.address.region}
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                  <div style={{
                    width: 40,
                    height: 40,
                    background: 'linear-gradient(135deg, #2E6A80, #3d8299)',
                    borderRadius: 10,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                      <circle cx="12" cy="12" r="10"/>
                      <path d="M12 6v6l4 2"/>
                    </svg>
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, color: '#374151', marginBottom: 4 }}>Horario</div>
                    <div style={{ color: '#6B7280', lineHeight: 1.5 }}>
                      Lunes a Viernes<br />
                      08:00 - 17:30 hrs
                    </div>
                  </div>
                </div>
                <a
                  href="https://maps.app.goo.gl/5pEaHK4Gev7cDueP8"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary"
                  style={{
                    textDecoration: 'none',
                    textAlign: 'center',
                    marginTop: 8,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 8
                  }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                    <polyline points="15 3 21 3 21 9"/>
                    <line x1="10" y1="14" x2="21" y2="3"/>
                  </svg>
                  Abrir en Google Maps
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Clients Section */}
      <section className="clients-section" style={{ padding: '100px 24px', background: '#F8FAFB', overflow: 'hidden' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={fadeInUp}
            transition={{ duration: 0.6 }}
            style={{ textAlign: 'center', marginBottom: 60 }}
          >
            <h2 style={{ fontSize: 14, fontWeight: 700, color: '#EE7E31', textTransform: 'uppercase', letterSpacing: 2, marginBottom: 12 }}>
              Clientes
            </h2>
            <h3 className="gradient-text" style={{ fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 900 }}>
              Empresas que confían en nosotros
            </h3>
          </motion.div>

          {/* Carousel container */}
          <div style={{
            position: 'relative',
            width: '100%',
            overflow: 'hidden',
            maskImage: 'linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)',
            WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)'
          }}>
            <div className="clients-carousel" style={{
              display: 'flex',
              gap: 80,
              width: 'max-content'
            }}>
              {/* Duplicate clients for infinite scroll effect */}
              {[...clients, ...clients, ...clients].map((client, i) => (
                <div
                  key={i}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minWidth: 200,
                    height: 120,
                    padding: '16px 28px',
                    background: '#E5E7EB',
                    borderRadius: 16,
                    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                    filter: 'grayscale(100%)',
                    opacity: 0.7,
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.filter = 'grayscale(0%)';
                    e.currentTarget.style.opacity = '1';
                    e.currentTarget.style.transform = 'scale(1.05)';
                    e.currentTarget.style.boxShadow = '0 8px 30px rgba(0,0,0,0.12)';
                    e.currentTarget.style.background = 'white';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.filter = 'grayscale(100%)';
                    e.currentTarget.style.opacity = '0.7';
                    e.currentTarget.style.transform = 'scale(1)';
                    e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.08)';
                    e.currentTarget.style.background = '#E5E7EB';
                  }}
                >
                  <img
                    src={client.logo}
                    alt={client.name}
                    title={client.name}
                    style={{
                      maxWidth: 180,
                      maxHeight: 90,
                      width: 'auto',
                      height: 'auto',
                      objectFit: 'contain'
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
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
          padding: '60px 24px 30px'
        }}
      >
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="footer-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: 40,
              marginBottom: 40
            }}
          >
            {/* Brand */}
            <div>
              <div style={{ marginBottom: 20 }}>
                <img
                  src={siteConfig.company.logo}
                  alt={siteConfig.company.name}
                  style={{
                    height: 75,
                    width: 'auto',
                    objectFit: 'contain'
                  }}
                />
              </div>
              <p style={{ color: 'rgba(255,255,255,0.6)', lineHeight: 1.7, fontSize: 14 }}>
                {siteConfig.company.description}
              </p>
              {/* Social links */}
              <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
                {siteConfig.social.linkedin && (
                  <a
                    href={siteConfig.social.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      width: 40,
                      height: 40,
                      background: 'rgba(255,255,255,0.1)',
                      borderRadius: 8,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'all 0.3s'
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.background = '#0077B5';
                      e.currentTarget.style.transform = 'translateY(-2px)';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
                      e.currentTarget.style.transform = 'translateY(0)';
                    }}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
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
                { name: 'Sobre Nosotros', section: null, href: null },
                { name: 'Proceso', section: null, href: '/proceso' },
                { name: 'Casos de Exito', section: 'casos', href: null },
                { name: 'Trabaja con Nosotros', section: null, href: '/trabaja-con-nosotros' }
              ].map((item, i) => (
                <a
                  key={i}
                  href={item.href || (item.section ? `#${item.section}` : '#')}
                  onClick={(e) => item.section && scrollToSection(e, item.section)}
                  style={{
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
                  <a href={`mailto:${siteConfig.contact.email}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                    Email: {siteConfig.contact.email}
                  </a>
                </div>
              </div>
            </div>
          </motion.div>

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
            {siteConfig.social.linkedin && (
              <a
                href={siteConfig.social.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: 'rgba(255,255,255,0.4)',
                  textDecoration: 'none',
                  fontSize: 13,
                  transition: 'color 0.3s',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6
                }}
                onMouseEnter={e => e.currentTarget.style.color = '#0077B5'}
                onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.4)'}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
                LinkedIn
              </a>
            )}
          </div>
        </div>
      </motion.footer>
    </div>
  );
}
