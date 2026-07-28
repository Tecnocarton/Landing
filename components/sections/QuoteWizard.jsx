'use client'

import { useState, useEffect, useCallback, useRef, memo } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { siteConfig, products, theme, quantityRanges } from '../../config/site';
import { trackCotizacionEnviada } from '../../lib/analytics';
import { fadeInUp, scaleIn } from '../../lib/motion';
import { formatHours } from '../../lib/hours.mjs';
import { validateSpecs } from '../../lib/quoteSpecs.mjs';
import { SectionBeams } from '../ui/section-beams';
import BoxFinder from '../BoxFinder';
import WhatsAppQuoteButton from '../WhatsAppQuoteButton';

// Sugerencia de cajas (BoxFinder): función en BETA. Solo se muestra donde
// NEXT_PUBLIC_ENABLE_BOXFINDER_BETA === 'true' (localhost). En producción NO se
// define esa variable, por lo que el flujo de cajas va directo a "a medida".
const BOXFINDER_BETA = process.env.NEXT_PUBLIC_ENABLE_BOXFINDER_BETA === 'true';

// Email validation regex - hoisted outside component (js-hoist-regexp)
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Selection options for cardboard type and flute (onda), used by planchas and cajas
const TIPO_OPTIONS = ['12', '14', '17', '20'];
const ONDA_OPTIONS = ['C', 'E', 'B'];

// Reusable multi-select dropdown (looks like a select, allows multiple checked options)
const MultiSelectDropdown = memo(({ label, options, selected, onChange, placeholder, suffix = '', error = null }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  const toggleOption = (option) => {
    onChange(
      selected.includes(option)
        ? selected.filter(o => o !== option)
        : [...selected, option]
    );
  };

  const summary = selected.length > 0
    ? selected.map(o => `${o}${suffix}`).join(', ')
    : placeholder;

  return (
    <div>
      {label && (
        <label style={{ display: 'block', marginBottom: 8, fontWeight: 600, color: '#374151' }}>
          {label}
        </label>
      )}
      <div ref={ref} style={{ position: 'relative' }}>
        <button
          type="button"
          onClick={() => setOpen(o => !o)}
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-invalid={error ? true : undefined}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 8,
            padding: '12px 14px',
            borderRadius: 8,
            border: `2px solid ${error ? '#EF4444' : '#E5E7EB'}`,
            background: 'white',
            color: selected.length > 0 ? '#374151' : '#9CA3AF',
            fontWeight: selected.length > 0 ? 600 : 400,
            fontSize: 15,
            cursor: 'pointer',
            textAlign: 'left'
          }}
        >
          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{summary}</span>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>
            <path d="M6 9l6 6 6-6"/>
          </svg>
        </button>
        {open && (
          <div
            role="listbox"
            aria-multiselectable="true"
            style={{
              position: 'absolute',
              top: 'calc(100% + 4px)',
              left: 0,
              right: 0,
              zIndex: 10,
              background: 'white',
              border: '2px solid #E5E7EB',
              borderRadius: 8,
              boxShadow: '0 10px 30px rgba(0,0,0,0.12)',
              overflow: 'hidden'
            }}
          >
            {options.map((option) => {
              const isSelected = selected.includes(option);
              return (
                <div
                  key={option}
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => toggleOption(option)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    padding: '10px 14px',
                    cursor: 'pointer',
                    background: isSelected ? '#FFF7ED' : 'white',
                    color: isSelected ? theme.colors.accent : '#374151',
                    fontWeight: isSelected ? 600 : 400
                  }}
                >
                  <span style={{
                    width: 18,
                    height: 18,
                    flexShrink: 0,
                    borderRadius: 4,
                    border: `2px solid ${isSelected ? theme.colors.accent : '#D1D5DB'}`,
                    background: isSelected ? theme.colors.accent : 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {isSelected && (
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20 6L9 17l-5-5"/>
                      </svg>
                    )}
                  </span>
                  {option}{suffix}
                </div>
              );
            })}
          </div>
        )}
      </div>
      {error && (
        <span style={{ color: '#EF4444', fontSize: 12, marginTop: 4, display: 'block' }}>
          {error}
        </span>
      )}
    </div>
  );
});

MultiSelectDropdown.displayName = 'MultiSelectDropdown';

// Producto válidos que se pueden preseleccionar vía ?producto= (findings 22/23)
const VALID_PRODUCTS = new Set(['planchas', 'rollos', 'cajas']);

// Estado inicial del formulario: fuente única para el montaje y para el reset.
const EMPTY_FORM = {
  producto: '',
  cantidad: '',
  tiposCarton: [], // Para planchas/cajas: 12, 14, 17, 20
  ondas: [], // Para planchas/cajas: C, E, B
  formatosRollo: [], // Para rollos: 10, 20, 23, 25, 30, 35, 40, 45, 50 kg
  detalle: '', // Detalles adicionales
  // Sub-flujo de cajas de stock 12C
  cajaFlujo: '', // '' | 'sugerencia' | 'medida'
  cajaStock: '', // codigo de la caja de stock elegida (ej: 12C30x20x20)
  cajaDimsProducto: '', // dimensiones del producto, ej: "30×20×15 cm"
  cajaCantidadProductos: '',
  cajaUnidadesPorCaja: '',
  cajaCantidadCajas: '',
  empaqueModo: '', // 'multi' | 'single'
  empresa: '',
  email: '',
  telefono: ''
};

export default function QuoteWizard() {
  const searchParams = useSearchParams();
  const preselectedRef = useRef(false);
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [formErrors, setFormErrors] = useState({});
  // `submitted` guarda una copia de lo enviado: la pantalla de éxito la usa para
  // el CTA de WhatsApp pre-llenado aunque el formulario ya se haya limpiado.
  const [formStatus, setFormStatus] = useState({ loading: false, success: false, error: null, quoteNumber: null, submitted: null });

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

  const handleProductSelect = useCallback((productId) => {
    setFormData(prev => ({
      ...prev,
      producto: productId,
      // Reiniciar el sub-flujo de cajas al cambiar de producto
      cajaFlujo: '',
      cajaStock: '',
      cajaDimsProducto: '',
      cajaCantidadProductos: '',
      cajaUnidadesPorCaja: '',
      cajaCantidadCajas: '',
      empaqueModo: '',
    }));
  }, []);

  // Preselección de producto desde la sección de productos (evento global)
  useEffect(() => {
    const handler = (e) => {
      if (e.detail && e.detail.productId) {
        handleProductSelect(e.detail.productId);
      }
    };
    window.addEventListener('tc:select-product', handler);
    return () => window.removeEventListener('tc:select-product', handler);
  }, [handleProductSelect]);

  // Preselección de producto desde query param ?producto=<id> (findings 22/23).
  // Reutiliza la MISMA lógica que el CustomEvent 'tc:select-product'
  // (handleProductSelect), avanza al paso de especificaciones y hace scroll a #cotizar.
  useEffect(() => {
    if (preselectedRef.current) return;
    const producto = searchParams?.get('producto');
    if (producto && VALID_PRODUCTS.has(producto)) {
      preselectedRef.current = true;
      handleProductSelect(producto);
      setActiveStep(1);
      // Scroll a la sección de cotización tras el montaje.
      if (typeof document !== 'undefined') {
        document.getElementById('cotizar')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  }, [searchParams, handleProductSelect]);

  // Submit form - sends email via API
  const handleSubmit = async () => {
    // Red de seguridad: si las especificaciones quedaron incompletas (por
    // ejemplo, tras volver atrás y borrar un campo), se devuelve al paso 1 en
    // vez de enviar una cotización a medias.
    const specErrors = validateSpecs(formData);
    if (Object.keys(specErrors).length > 0) {
      setFormErrors(prev => ({ ...prev, ...specErrors }));
      setActiveStep(1);
      return;
    }

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
        // La pantalla de éxito queda visible (sin auto-reset) porque ahora
        // ofrece el N° de cotización y el CTA de WhatsApp pre-llenado; se
        // limpia con el botón "Enviar otra cotización".
        setFormStatus({
          loading: false,
          success: true,
          error: null,
          quoteNumber: data.quoteNumber,
          submitted: formData,
        });
        setFormData(EMPTY_FORM);

        // Registrar conversión en Google Ads y GTM
        trackCotizacionEnviada({
          producto: formData.producto,
          empresa: formData.empresa,
          quoteNumber: data.quoteNumber,
        });
      } else {
        setFormStatus({ loading: false, success: false, error: data.message || 'Error al enviar' });
      }
    } catch (error) {
      console.error('Error:', error);
      setFormStatus({ loading: false, success: false, error: 'Error de conexion. Intenta nuevamente.' });
    }
  };

  // Limpia la pantalla de éxito y vuelve al paso 1 para cotizar de nuevo.
  const handleNuevaCotizacion = () => {
    setFormData(EMPTY_FORM);
    setFormErrors({});
    setActiveStep(0);
    setFormStatus({ loading: false, success: false, error: null, quoteNumber: null, submitted: null });
  };

  const setCajaFlujo = (flujo) => {
    setFormData(prev => ({ ...prev, cajaFlujo: flujo }));
  };

  // Cuando el usuario elige una caja de stock sugerida por el asistente
  const handleBoxSelect = ({ code, dimsProducto, cantidadProductos, unitsPerBox, boxesNeeded, mode }) => {
    setFormData(prev => ({
      ...prev,
      cajaStock: code,
      cajaDimsProducto: dimsProducto,
      cajaCantidadProductos: String(cantidadProductos),
      cajaUnidadesPorCaja: String(unitsPerBox),
      cajaCantidadCajas: String(boxesNeeded),
      empaqueModo: mode,
      tiposCarton: ['12'], // el stock es carton 12, onda C
      ondas: ['C'],
      cantidad: `${boxesNeeded} cajas`,
    }));
    setActiveStep(2);
  };

  // Volver desde el Paso 1: en cajas vuelve a la eleccion de ruta; si no, a productos
  const handleStep1Back = () => {
    if (formData.producto === 'cajas' && formData.cajaFlujo) {
      setCajaFlujo('');
    } else {
      setActiveStep(0);
    }
  };

  return (
    <section id="cotizar" className="section-padding" style={{
      padding: '80px 24px',
      background: `linear-gradient(135deg, ${theme.colors.primaryLight} 0%, ${theme.colors.primaryDark} 100%)`,
      position: 'relative',
      overflow: 'hidden'
    }}>
      <SectionBeams />
      <div style={{ maxWidth: 900, margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={fadeInUp}
          transition={{ duration: 0.6 }}
          style={{ textAlign: 'center', marginBottom: 48 }}
        >
          <h2 style={{ fontSize: 14, fontWeight: 700, color: theme.colors.accent, textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 12 }}>
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
        <div role="list" style={{ display: 'flex', justifyContent: 'center', gap: 8, marginBottom: 40, flexWrap: 'wrap' }}>
          {['Producto', 'Especificaciones', 'Contacto'].map((step, i) => (
            <div
              key={i}
              role="listitem"
              aria-label={`Paso ${i + 1} de 3: ${step}${activeStep > i ? ' — completado' : activeStep === i ? ' — actual' : ' — pendiente'}`}
              aria-current={activeStep === i ? 'step' : undefined}
              style={{ display: 'flex', alignItems: 'center', gap: 8 }}
            >
              <div style={{
                width: 36,
                height: 36,
                borderRadius: '50%',
                background: activeStep >= i ? theme.colors.accent : 'rgba(255,255,255,0.2)',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700,
                fontSize: 14,
                transition: 'all 0.3s'
              }}>
                {activeStep > i ? (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 6L9 17l-5-5"/>
                  </svg>
                ) : i + 1}
              </div>
              <span className="step-label" style={{
                color: activeStep >= i ? 'white' : 'rgba(255,255,255,0.5)',
                fontWeight: 500,
                fontSize: 14
              }}>{step}</span>
              {i < 2 && <div style={{ width: 40, height: 2, background: activeStep > i ? theme.colors.accent : 'rgba(255,255,255,0.2)' }} />}
            </div>
          ))}
        </div>

        {/* Form card */}
        <motion.div
          role="group"
          aria-labelledby="form-step-title"
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
          <div aria-live="polite" aria-atomic="true">
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

                {formStatus.quoteNumber && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.45 }}
                    style={{
                      display: 'inline-block',
                      marginTop: 20,
                      padding: '10px 18px',
                      borderRadius: 10,
                      background: '#F0FDF4',
                      border: '1px solid #BBF7D0',
                    }}
                  >
                    <div style={{ fontSize: 12, fontWeight: 700, color: '#047857', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                      N° de cotización
                    </div>
                    <div style={{ fontSize: 20, fontWeight: 800, color: '#065F46', letterSpacing: '0.02em' }}>
                      {formStatus.quoteNumber}
                    </div>
                  </motion.div>
                )}

                {/* Atajo a WhatsApp con todo lo cotizado ya escrito (F3.1) */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, marginTop: 28 }}>
                  <WhatsAppQuoteButton
                    data={formStatus.submitted || {}}
                    quoteNumber={formStatus.quoteNumber}
                    origen="wizard_exito"
                    label="¿Es urgente? Escríbenos por WhatsApp"
                  />
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={handleNuevaCotizacion}
                  >
                    Enviar otra cotización
                  </button>
                </div>
              </motion.div>
            ) : (
              <>
                {activeStep === 0 && (
                <div style={{ animation: 'fadeInUp 0.5s ease' }}>
                  <h4 id="form-step-title" style={{ fontSize: 20, fontWeight: 700, color: '#2E6A80', marginBottom: 24, textAlign: 'center' }}>
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
                          border: `2px solid ${formData.producto === product.id ? theme.colors.accent : '#E5E7EB'}`,
                          background: formData.producto === product.id ? '#FFF7ED' : 'white',
                          cursor: 'pointer',
                          textAlign: 'center',
                          transition: 'all 0.3s'
                        }}
                      >
                        <div style={{ width: 52, height: 52, borderRadius: 10, overflow: 'hidden', margin: '0 auto 10px', background: '#F8FAFB' }}>
                          {product.image ? (
                            <img src={product.image} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          ) : (
                            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: `linear-gradient(135deg, ${theme.colors.accent}, ${theme.colors.accentLight})` }}>
                              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/></svg>
                            </div>
                          )}
                        </div>
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
                formData.producto === 'cajas' && BOXFINDER_BETA && !formData.cajaFlujo ? (
                  <div style={{ animation: 'fadeInUp 0.5s ease' }}>
                    <h4 id="form-step-title" style={{ fontSize: 20, fontWeight: 700, color: '#2E6A80', marginBottom: 24, textAlign: 'center' }}>
                      ¿Cómo prefieres cotizar tus cajas?
                    </h4>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12 }}>
                      <div
                        onClick={() => setCajaFlujo('sugerencia')}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setCajaFlujo('sugerencia'); } }}
                        style={{ padding: 20, borderRadius: 12, border: '2px solid #E5E7EB', background: 'white', cursor: 'pointer', transition: 'all 0.3s' }}
                      >
                        <div style={{ width: 44, height: 44, borderRadius: 10, margin: '0 auto 12px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: `linear-gradient(135deg, ${theme.colors.accent}, ${theme.colors.accentLight})` }}>
                          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 7V5a2 2 0 0 1 2-2h2"/><path d="M17 3h2a2 2 0 0 1 2 2v2"/><path d="M21 17v2a2 2 0 0 1-2 2h-2"/><path d="M7 21H5a2 2 0 0 1-2-2v-2"/><rect x="7" y="7" width="10" height="10" rx="1"/></svg>
                        </div>
                        <div style={{ fontSize: 15, fontWeight: 700, color: '#2E6A80', textAlign: 'center', marginBottom: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                          Ayúdame a elegir
                          <span style={{ fontSize: 10, fontWeight: 800, letterSpacing: '0.05em', color: '#C45A1A', background: 'rgba(230,118,53,0.12)', padding: '2px 7px', borderRadius: 999 }}>BETA</span>
                        </div>
                        <div style={{ fontSize: 13, color: '#6B7280', textAlign: 'center', lineHeight: 1.5 }}>Ingresa las medidas de tu producto y te sugerimos la caja de stock 12C ideal.</div>
                      </div>
                      <div
                        onClick={() => setCajaFlujo('medida')}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setCajaFlujo('medida'); } }}
                        style={{ padding: 20, borderRadius: 12, border: '2px solid #E5E7EB', background: 'white', cursor: 'pointer', transition: 'all 0.3s' }}
                      >
                        <div style={{ width: 44, height: 44, borderRadius: 10, margin: '0 auto 12px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #2E6A80, #1B4D5C)' }}>
                          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>
                        </div>
                        <div style={{ fontSize: 15, fontWeight: 700, color: '#2E6A80', textAlign: 'center', marginBottom: 6 }}>Tengo mi medida / a medida</div>
                        <div style={{ fontSize: 13, color: '#6B7280', textAlign: 'center', lineHeight: 1.5 }}>Detalla tú mismo el tipo, la onda y las dimensiones de la caja, como hasta ahora.</div>
                      </div>
                    </div>
                    <div className="form-buttons" style={{ display: 'flex', gap: 16, marginTop: 32 }}>
                      <button className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: 8 }} onClick={() => setActiveStep(0)}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5"/><path d="M12 19l-7-7 7-7"/></svg>
                        Volver
                      </button>
                    </div>
                  </div>
                ) : formData.producto === 'cajas' && BOXFINDER_BETA && formData.cajaFlujo === 'sugerencia' ? (
                  <div style={{ animation: 'fadeInUp 0.5s ease' }}>
                    <BoxFinder onSelect={handleBoxSelect} onSwitchToCustom={() => setCajaFlujo('medida')} />
                    <div className="form-buttons" style={{ display: 'flex', gap: 16, marginTop: 24 }}>
                      <button className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: 8 }} onClick={() => setCajaFlujo('')}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5"/><path d="M12 19l-7-7 7-7"/></svg>
                        Volver
                      </button>
                    </div>
                  </div>
                ) : (
                <div style={{ animation: 'fadeInUp 0.5s ease' }}>
                  <h4 id="form-step-title" style={{ fontSize: 20, fontWeight: 700, color: '#2E6A80', marginBottom: 24, textAlign: 'center' }}>
                    Especificaciones del pedido
                  </h4>
                  <div style={{ display: 'grid', gap: 20 }}>
                    {/* Cantidad - desplegable de rangos según producto */}
                    <div>
                      <label htmlFor="cantidad" style={{ display: 'block', marginBottom: 8, fontWeight: 600, color: '#374151' }}>
                        Cantidad aproximada *
                      </label>
                      <select
                        id="cantidad"
                        name="cantidad"
                        value={formData.cantidad}
                        onChange={handleInputChange}
                        className={formErrors.cantidad ? 'error' : ''}
                        style={{
                          width: '100%',
                          padding: '12px 14px',
                          borderRadius: 8,
                          border: `2px solid ${formErrors.cantidad ? '#EF4444' : '#E5E7EB'}`,
                          background: 'white',
                          color: formData.cantidad ? '#374151' : '#9CA3AF',
                          fontSize: 15,
                          fontWeight: formData.cantidad ? 600 : 400,
                          cursor: 'pointer'
                        }}
                      >
                        <option value="">Selecciona un rango</option>
                        {(quantityRanges[formData.producto] || []).map((rango) => {
                          const unidad = formData.producto === 'rollos' ? 'kg' : 'unidades';
                          return (
                            <option key={rango} value={`${rango} ${unidad}`}>{rango} {unidad}</option>
                          );
                        })}
                      </select>
                      {formErrors.cantidad && (
                        <span style={{ color: '#EF4444', fontSize: 12, marginTop: 4, display: 'block' }}>
                          {formErrors.cantidad}
                        </span>
                      )}
                    </div>

                    {/* Tipo de cartón y onda para Planchas y Cajas */}
                    {(formData.producto === 'planchas' || formData.producto === 'cajas') && (
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
                        <MultiSelectDropdown
                          label="Tipo de cartón *"
                          placeholder="Selecciona uno o varios"
                          options={TIPO_OPTIONS}
                          selected={formData.tiposCarton}
                          error={formErrors.tiposCarton}
                          onChange={(next) => {
                            setFormData(prev => ({ ...prev, tiposCarton: next }));
                            setFormErrors(prev => ({ ...prev, tiposCarton: null }));
                          }}
                        />
                        <MultiSelectDropdown
                          label="Onda *"
                          placeholder="Selecciona una o varias"
                          options={ONDA_OPTIONS}
                          selected={formData.ondas}
                          error={formErrors.ondas}
                          onChange={(next) => {
                            setFormData(prev => ({ ...prev, ondas: next }));
                            setFormErrors(prev => ({ ...prev, ondas: null }));
                          }}
                        />
                      </div>
                    )}

                    {/* Formatos de rollo para Rollos */}
                    {formData.producto === 'rollos' && (
                      <div>
                        <label style={{ display: 'block', marginBottom: 8, fontWeight: 600, color: '#374151' }}>
                          Formato de rollo en kg * (puedes seleccionar varios)
                        </label>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                          {['10', '20', '25', '30', '35'].map((formato) => (
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
                                setFormErrors(prev => ({ ...prev, formatosRollo: null }));
                              }}
                              style={{
                                padding: '10px 16px',
                                borderRadius: 8,
                                border: `2px solid ${formData.formatosRollo.includes(formato) ? theme.colors.accent : '#E5E7EB'}`,
                                background: formData.formatosRollo.includes(formato) ? '#FFF7ED' : 'white',
                                color: formData.formatosRollo.includes(formato) ? theme.colors.accent : theme.colors.textSecondary,
                                fontWeight: 600,
                                cursor: 'pointer',
                                transition: 'all 0.2s'
                              }}
                            >
                              {formato} kg
                            </button>
                          ))}
                        </div>
                        {formErrors.formatosRollo && (
                          <span style={{ color: '#EF4444', fontSize: 12, marginTop: 6, display: 'block' }}>
                            {formErrors.formatosRollo}
                          </span>
                        )}
                      </div>
                    )}

                    {/* Detalle adicional */}
                    <div>
                      <label htmlFor="detalle" style={{ display: 'block', marginBottom: 8, fontWeight: 600, color: '#374151' }}>
                        {'Detalles y/o especificaciones *'}
                      </label>
                      <textarea
                        id="detalle"
                        rows={3}
                        name="detalle"
                        autoComplete="off"
                        className={formErrors.detalle ? 'error' : ''}
                        aria-invalid={formErrors.detalle ? true : undefined}
                        placeholder={
                          formData.producto === 'planchas' ? 'Ej: Medidas, ancho 1200 x largo 2000 mm, ...' :
                          formData.producto === 'rollos' ? 'Ej: alto 1.2 m, para embalaje de muebles...' :
                          'Dimensiones internas largo x ancho x alto de la caja, tipo de impresión, cantidad de caras impresas (2 o 4),etc.'
                        }
                        value={formData.detalle}
                        onChange={handleInputChange}
                      />
                      {formErrors.detalle && (
                        <span style={{ color: '#EF4444', fontSize: 12, marginTop: 4, display: 'block' }}>
                          {formErrors.detalle}
                        </span>
                      )}
                      {/* Imagen de ejemplo de medidas: solo para cajas a medida */}
                      {formData.producto === 'cajas' && (
                        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 12, marginBottom: 8 }}>
                          <Image
                            src="/MEDIDAS.png"
                            alt="Ejemplo medidas"
                            width={592}
                            height={538}
                            sizes="260px"
                            style={{
                              maxWidth: 260,
                              width: '40%',
                              minWidth: 140,
                              height: 'auto',
                              borderRadius: 8,
                              boxShadow: '0 6px 18px rgba(0,0,0,0.08)'
                            }}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="form-buttons" style={{ display: 'flex', gap: 16, marginTop: 32 }}>
                    <button className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: 8 }} onClick={handleStep1Back}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5"/><path d="M12 19l-7-7 7-7"/></svg>
                      Volver
                    </button>
                    <button
                      className="btn-primary"
                      style={{ flex: 1 }}
                      onClick={() => {
                        // Todas las especificaciones son obligatorias antes de
                        // pedir los datos de contacto.
                        const errors = validateSpecs(formData);
                        setFormErrors(prev => ({
                          ...prev,
                          cantidad: errors.cantidad || null,
                          tiposCarton: errors.tiposCarton || null,
                          ondas: errors.ondas || null,
                          formatosRollo: errors.formatosRollo || null,
                          detalle: errors.detalle || null,
                        }));
                        if (Object.keys(errors).length > 0) return;
                        setActiveStep(2);
                      }}
                    >
                      Continuar
                    </button>
                  </div>
                  {/* Sin atajo a WhatsApp acá: el canal se ofrece recién en la
                      pantalla de éxito, una vez enviada la cotización, para que
                      no se pierda el registro del pedido. */}
                </div>
                )
              )}

              {activeStep === 2 && (
                <div style={{ animation: 'fadeInUp 0.5s ease' }}>
                  <h4 id="form-step-title" style={{ fontSize: 20, fontWeight: 700, color: '#2E6A80', marginBottom: 24, textAlign: 'center' }}>
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
                    <button className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: 8 }} onClick={() => setActiveStep(1)}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5"/><path d="M12 19l-7-7 7-7"/></svg>
                      Volver
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
                  background: `linear-gradient(135deg, ${theme.colors.accent}, ${theme.colors.accentLight})`,
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
                  background: `linear-gradient(135deg, ${theme.colors.primaryLight}, ${theme.colors.primary})`,
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
                    {formatHours(siteConfig.hours, ' - ').map((tramo) => (
                      <span key={tramo} style={{ display: 'block' }}>
                        {tramo} hrs
                      </span>
                    ))}
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
  );
}
