'use client'

import React, { useState, useEffect } from 'react';

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
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    const handleResize = () => setIsMobile(window.innerWidth < 768);

    // Initial check
    handleResize();

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const products = [
    { id: 'planchas', name: 'Planchas Corrugadas', icon: '📦', desc: '12C, 17C, 20C' },
    { id: 'rollos', name: 'Rollos de Corrugado', icon: '🔄', desc: 'Múltiples gramajes' },
    { id: 'cajas', name: 'Cajas a Medida', icon: '📐', desc: 'Troqueladas y RSC' },
    { id: 'autoarmables', name: 'Cajas Autoarmables', icon: '⚡', desc: 'Rápido armado' },
    { id: 'esquineros', name: 'Esquineros', icon: '🛡️', desc: 'Protección extra' },
    { id: 'consumibles', name: 'Consumibles', icon: '🎞️', desc: 'Film, cintas, burbuja' }
  ];

  const processSteps = [
    { num: '01', title: 'Recepción de Materia Prima', desc: 'Bobinas de papel kraft y liner de proveedores certificados', icon: '📋' },
    { num: '02', title: 'Corrugado', desc: 'Formación de la onda mediante calor y presión controlados', icon: '🔥' },
    { num: '03', title: 'Encolado y Laminado', desc: 'Unión de liners con adhesivo base almidón', icon: '🧪' },
    { num: '04', title: 'Corte y Troquelado', desc: 'Precisión milimétrica según especificaciones', icon: '✂️' },
    { num: '05', title: 'Control de Calidad', desc: 'Verificación de gramaje, resistencia y dimensiones', icon: '✅' },
    { num: '06', title: 'Despacho', desc: 'Entrega con flota propia en todo Chile', icon: '🚚' }
  ];

  const caseStudies = [
    {
      industry: 'E-commerce',
      company: 'Tienda Online Líder',
      challenge: 'Necesitaban cajas autoarmables que redujeran tiempo de empaque',
      solution: 'Diseñamos cajas con cierre automático sin cinta',
      result: '40% menos tiempo de empaque',
      icon: '🛒'
    },
    {
      industry: 'Agroindustria',
      company: 'Exportadora Frutícola',
      challenge: 'Requerían cajas resistentes a humedad para exportación',
      solution: 'Corrugado 20C con tratamiento especial',
      result: 'Cero reclamos por daño en tránsito',
      icon: '🍇'
    },
    {
      industry: 'Manufactura',
      company: 'Fábrica de Muebles',
      challenge: 'Embalaje para piezas de diferentes tamaños',
      solution: 'Sistema modular de planchas y esquineros',
      result: '25% reducción en costos de embalaje',
      icon: '🪑'
    }
  ];

  const stats = [
    { value: 200, suffix: 'M+', label: 'CLP Mensuales' },
    { value: 10, suffix: 't', label: 'Planchas/Día' },
    { value: 20, suffix: '+', label: 'Años Experiencia' },
    { value: 98, suffix: '%', label: 'Clientes Satisfechos' }
  ];

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
        }
        input:focus, select:focus, textarea:focus {
          outline: none;
          border-color: #2E6A80;
          box-shadow: 0 0 0 3px rgba(46,106,128,0.1);
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
        .hide-mobile {
          display: none;
        }
        @media (min-width: 768px) {
          .hide-mobile {
            display: block;
          }
        }
        .hide-desktop {
          display: block;
        }
        @media (min-width: 500px) {
          .hide-desktop {
            display: block;
          }
        }
      `}</style>

      {/* Navigation */}
      <nav style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        background: scrolled ? 'rgba(255,255,255,0.95)' : 'transparent',
        backdropFilter: scrolled ? 'blur(10px)' : 'none',
        boxShadow: scrolled ? '0 2px 20px rgba(0,0,0,0.1)' : 'none',
        transition: 'all 0.3s'
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 45,
              height: 45,
              background: 'linear-gradient(135deg, #2E6A80, #3d8299)',
              borderRadius: 10,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontWeight: 900,
              fontSize: 20
            }}>T</div>
            <span style={{ fontSize: 22, fontWeight: 800, color: '#2E6A80' }}>Tecnocarton</span>
          </div>

          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <a href="#productos" className="nav-link hide-mobile">Productos</a>
            <a href="#proceso" className="nav-link hide-mobile">Proceso</a>
            <a href="#casos" className="nav-link hide-mobile">Casos de Éxito</a>
            <a href="#cotizar" className="btn-primary" style={{ marginLeft: 16 }}>Cotizar Ahora</a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #2E6A80 0%, #1a4a5c 50%, #2E6A80 100%)',
        backgroundSize: '200% 200%',
        animation: 'gradient 15s ease infinite',
        display: 'flex',
        alignItems: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Decorative elements */}
        <div style={{
          position: 'absolute',
          top: '10%',
          right: '5%',
          width: 300,
          height: 300,
          background: 'rgba(238,126,49,0.1)',
          borderRadius: '50%',
          filter: 'blur(60px)'
        }} />
        <div style={{
          position: 'absolute',
          bottom: '20%',
          left: '10%',
          width: 200,
          height: 200,
          background: 'rgba(255,255,255,0.05)',
          borderRadius: '50%',
          filter: 'blur(40px)'
        }} />

        {/* Floating boxes decoration */}
        <div style={{ position: 'absolute', top: '20%', right: '15%', opacity: 0.15 }} className="animate-float">
          <svg width="120" height="120" viewBox="0 0 100 100">
            <rect x="10" y="10" width="80" height="80" fill="none" stroke="white" strokeWidth="2" rx="8"/>
            <rect x="25" y="25" width="50" height="50" fill="none" stroke="white" strokeWidth="2" rx="4"/>
          </svg>
        </div>

        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '120px 24px 80px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 60, alignItems: 'center' }}>
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
              🏭 Fabricantes desde 2003
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
              <a href="#cotizar" className="btn-primary" style={{ fontSize: 17, textDecoration: 'none' }}>
                Solicitar Cotización →
              </a>
              <a href="#proceso" className="btn-secondary" style={{
                borderColor: 'rgba(255,255,255,0.5)',
                color: 'white',
                textDecoration: 'none'
              }}>
                Ver Proceso
              </a>
            </div>

            {/* Trust badges */}
            <div style={{ marginTop: 40, display: 'flex', gap: 24, flexWrap: 'wrap' }}>
              {['✓ Producción Propia', '✓ Entrega Nacional', '✓ Sin Mínimos'].map((badge, i) => (
                <span key={i} style={{
                  color: 'rgba(255,255,255,0.8)',
                  fontSize: 14,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6
                }}>{badge}</span>
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
              ¿Por qué Tecnocartón?
            </h2>
            <h3 className="gradient-text" style={{ fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 900, marginBottom: 16 }}>
              La mejor opción en embalaje
            </h3>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 24 }}>
            {[
              { icon: '🏭', title: 'Integración Vertical', desc: 'Control total desde la materia prima hasta el producto final. Sin intermediarios.' },
              { icon: '🚚', title: 'Cobertura Nacional', desc: 'Flota propia para entregas en todo Chile. Rapidez y confiabilidad garantizada.' },
              { icon: '⚙️', title: 'Flexibilidad Híbrida', desc: 'Grandes volúmenes industriales o pedidos personalizados. Nos adaptamos a ti.' },
              { icon: '💰', title: 'Precios de Fábrica', desc: 'Directo del productor. Elimina costos de intermediación y ahorra.' }
            ].map((item, i) => (
              <div key={i} className="card hover-lift" style={{ padding: 32, textAlign: 'center' }}>
                <div style={{ fontSize: 48, marginBottom: 16 }}>{item.icon}</div>
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
              <div key={i} className="card hover-lift" style={{
                padding: 28,
                textAlign: 'center',
                cursor: 'pointer',
                border: '2px solid transparent',
                transition: 'all 0.3s'
              }}
              onMouseEnter={e => e.currentTarget.style.borderColor = '#EE7E31'}
              onMouseLeave={e => e.currentTarget.style.borderColor = 'transparent'}
              >
                <div style={{ fontSize: 42, marginBottom: 16 }}>{product.icon}</div>
                <h4 style={{ fontSize: 16, fontWeight: 700, color: '#2E6A80', marginBottom: 8 }}>{product.name}</h4>
                <p style={{ fontSize: 13, color: '#8E9DA6' }}>{product.desc}</p>
              </div>
            ))}
          </div>

          {/* Cardboard types info */}
          <div className="card" style={{ marginTop: 40, padding: 32 }}>
            <h4 style={{ fontSize: 18, fontWeight: 700, color: '#2E6A80', marginBottom: 20, textAlign: 'center' }}>
              Tipos de Cartón Disponibles
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 24 }}>
              {[
                { type: '12C (Sencillo)', weight: '~435 gr/m²', use: 'Productos ligeros' },
                { type: '17C (Doble)', weight: '~473 gr/m²', use: 'Uso general' },
                { type: '20C (Triple)', weight: '~619 gr/m²', use: 'Cargas pesadas' }
              ].map((item, i) => (
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
                  <div style={{ fontSize: 24, marginBottom: 8 }}>{step.icon}</div>
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
            {[
              { icon: '🔬', text: 'Control de Gramaje' },
              { icon: '💪', text: 'Prueba de Resistencia' },
              { icon: '📏', text: 'Precisión Dimensional' },
              { icon: '♻️', text: 'Material Reciclable' }
            ].map((item, i) => (
              <div key={i} style={{ textAlign: 'center', color: 'white' }}>
                <div style={{ fontSize: 32, marginBottom: 8 }}>{item.icon}</div>
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
                  width: 80,
                  height: 80,
                  background: 'linear-gradient(135deg, #EE7E31, #f5a66d)',
                  borderRadius: '0 16px 0 80px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  paddingLeft: 20,
                  paddingBottom: 15
                }}>
                  <span style={{ fontSize: 28 }}>{study.icon}</span>
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
              Sin compromiso. Te respondemos en menos de 24 horas hábiles.
            </p>
          </div>

          {/* Step indicators */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginBottom: 40 }}>
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
                }}>{i + 1}</div>
                <span style={{
                  color: activeStep >= i ? 'white' : 'rgba(255,255,255,0.5)',
                  fontWeight: 500,
                  fontSize: 14
                }} className="hide-mobile">{step}</span>
                {i < 2 && <div style={{ width: 40, height: 2, background: activeStep > i ? '#EE7E31' : 'rgba(255,255,255,0.2)' }} />}
              </div>
            ))}
          </div>

          {/* Form card */}
          <div className="card" style={{ padding: 40 }}>
            {activeStep === 0 && (
              <div style={{ animation: 'fadeInUp 0.5s ease' }}>
                <h4 style={{ fontSize: 20, fontWeight: 700, color: '#2E6A80', marginBottom: 24, textAlign: 'center' }}>
                  ¿Qué producto necesitas?
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 12 }}>
                  {products.map((product) => (
                    <div
                      key={product.id}
                      onClick={() => setFormData({...formData, producto: product.id})}
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
                  Continuar →
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
                    <label style={{ display: 'block', marginBottom: 8, fontWeight: 600, color: '#374151' }}>
                      Cantidad aproximada
                    </label>
                    <input
                      type="text"
                      placeholder="Ej: 500 unidades, 2 toneladas..."
                      value={formData.cantidad}
                      onChange={e => setFormData({...formData, cantidad: e.target.value})}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: 8, fontWeight: 600, color: '#374151' }}>
                      Medidas o especificaciones
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Ej: 40x30x20 cm, corrugado 17C, con impresión..."
                      value={formData.medidas}
                      onChange={e => setFormData({...formData, medidas: e.target.value})}
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
                    Continuar →
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
                    <label style={{ display: 'block', marginBottom: 8, fontWeight: 600, color: '#374151' }}>
                      Empresa / Nombre
                    </label>
                    <input
                      type="text"
                      placeholder="Tu empresa o nombre"
                      value={formData.empresa}
                      onChange={e => setFormData({...formData, empresa: e.target.value})}
                    />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                    <div>
                      <label style={{ display: 'block', marginBottom: 8, fontWeight: 600, color: '#374151' }}>
                        Email
                      </label>
                      <input
                        type="email"
                        placeholder="tu@email.com"
                        value={formData.email}
                        onChange={e => setFormData({...formData, email: e.target.value})}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: 8, fontWeight: 600, color: '#374151' }}>
                        Teléfono
                      </label>
                      <input
                        type="tel"
                        placeholder="+56 9 1234 5678"
                        value={formData.telefono}
                        onChange={e => setFormData({...formData, telefono: e.target.value})}
                      />
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 16, marginTop: 32 }}>
                  <button className="btn-secondary" onClick={() => setActiveStep(1)}>
                    ← Volver
                  </button>
                  <button className="btn-primary" style={{ flex: 1 }}>
                    Enviar Cotización 📨
                  </button>
                </div>
                <p style={{ textAlign: 'center', marginTop: 16, fontSize: 13, color: '#8E9DA6' }}>
                  Te contactaremos en menos de 24 horas hábiles
                </p>
              </div>
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
            <a href="tel:+56912345678" style={{
              color: 'white',
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: 8
            }}>
              📞 +56 9 1234 5678
            </a>
            <a href="mailto:ventas@tecnocarton.cl" style={{
              color: 'white',
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: 8
            }}>
              ✉️ ventas@tecnocarton.cl
            </a>
            <a href="#" style={{
              color: 'white',
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: 8
            }}>
              💬 WhatsApp
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
            {[
              { icon: '🛒', name: 'E-commerce' },
              { icon: '🍰', name: 'Repostería' },
              { icon: '🍷', name: 'Vinos' },
              { icon: '🏭', name: 'Manufactura' },
              { icon: '📦', name: 'Logística' },
              { icon: '🏗️', name: 'Construcción' },
              { icon: '🚚', name: 'Mudanzas' },
              { icon: '🥗', name: 'Alimentos' }
            ].map((sector, i) => (
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
                <span style={{ fontSize: 24 }}>{sector.icon}</span>
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
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
                <div style={{
                  width: 45,
                  height: 45,
                  background: 'linear-gradient(135deg, #EE7E31, #f5a66d)',
                  borderRadius: 10,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontWeight: 900,
                  fontSize: 20
                }}>T</div>
                <span style={{ fontSize: 20, fontWeight: 800 }}>Tecnocarton</span>
              </div>
              <p style={{ color: 'rgba(255,255,255,0.6)', lineHeight: 1.7, fontSize: 14 }}>
                Ingeniería en Embalaje. Soluciones de cartón corrugado con capacidad industrial y flexibilidad artesanal.
              </p>
            </div>

            {/* Products */}
            <div>
              <h5 style={{ fontWeight: 700, marginBottom: 20, color: '#EE7E31' }}>Productos</h5>
              {['Planchas Corrugadas', 'Rollos de Corrugado', 'Cajas a Medida', 'Cajas Autoarmables', 'Esquineros', 'Consumibles'].map((item, i) => (
                <a key={i} href="#" style={{
                  display: 'block',
                  color: 'rgba(255,255,255,0.6)',
                  textDecoration: 'none',
                  marginBottom: 10,
                  fontSize: 14,
                  transition: 'color 0.3s'
                }}
                onMouseEnter={e => e.currentTarget.style.color = 'white'}
                onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.6)'}
                >{item}</a>
              ))}
            </div>

            {/* Company */}
            <div>
              <h5 style={{ fontWeight: 700, marginBottom: 20, color: '#EE7E31' }}>Empresa</h5>
              {['Sobre Nosotros', 'Proceso', 'Casos de Éxito', 'Trabaja con Nosotros'].map((item, i) => (
                <a key={i} href="#" style={{
                  display: 'block',
                  color: 'rgba(255,255,255,0.6)',
                  textDecoration: 'none',
                  marginBottom: 10,
                  fontSize: 14,
                  transition: 'color 0.3s'
                }}
                onMouseEnter={e => e.currentTarget.style.color = 'white'}
                onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.6)'}
                >{item}</a>
              ))}
            </div>

            {/* Contact */}
            <div>
              <h5 style={{ fontWeight: 700, marginBottom: 20, color: '#EE7E31' }}>Contacto</h5>
              <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: 14, lineHeight: 2 }}>
                <div>📍 Las Violetas, Padre Hurtado</div>
                <div>📞 +56 9 1234 5678</div>
                <div>✉️ ventas@tecnocarton.cl</div>
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
              © 2025 Tecnocartón. Todos los derechos reservados.
            </p>
            <div style={{ display: 'flex', gap: 16 }}>
              {['LinkedIn', 'Instagram', 'Facebook'].map((social, i) => (
                <a key={i} href="#" style={{
                  color: 'rgba(255,255,255,0.4)',
                  textDecoration: 'none',
                  fontSize: 13,
                  transition: 'color 0.3s'
                }}
                onMouseEnter={e => e.currentTarget.style.color = '#EE7E31'}
                onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.4)'}
                >{social}</a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
