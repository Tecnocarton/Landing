'use client'

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { caseStudies, theme, getClientLogo } from '../../config/site';
import { fadeInUp, staggerContainer } from '../../lib/motion';
import { SectionHeader } from '../ui/section-header';

export default function CaseStudies() {
  return (
    <section id="casos" className="section-padding" style={{ padding: '80px 24px', background: 'white' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <SectionHeader label="Casos de éxito" title="Soluciones que generan resultados" />

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          variants={staggerContainer}
          className="case-studies-grid"
          style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 24 }}
        >
          {caseStudies.map((study, i) => {
            // Logo del cliente solo si el caso ya tiene autorización de uso
            // (campo `cliente` en config/site.js); si no, el caso va anónimo.
            const clientLogo = getClientLogo(study.cliente);
            return (
            <motion.div
              key={i}
              variants={fadeInUp}
              whileHover={{ y: -8, boxShadow: '0 20px 40px rgba(46,106,128,0.15)' }}
              transition={{ duration: 0.3 }}
              className="card"
              style={{ padding: 32, position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}
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
                  background: `linear-gradient(135deg, ${theme.colors.accent}, ${theme.colors.accentLight})`,
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
                // La tarjeta ahora es flex column (para anclar el enlace abajo):
                // sin alignSelf el badge se estiraría a todo el ancho.
                alignSelf: 'flex-start',
                background: '#E8F4F8',
                color: '#2E6A80',
                padding: '6px 12px',
                borderRadius: 20,
                fontSize: 12,
                fontWeight: 600,
                marginBottom: 16
              }}>{study.industry}</div>

              {clientLogo && (
                <div style={{ display: 'flex', alignItems: 'center', height: 44, marginBottom: 12 }}>
                  <Image
                    src={clientLogo}
                    alt={study.cliente}
                    width={132}
                    height={44}
                    style={{ width: 'auto', height: '100%', maxWidth: 160, objectFit: 'contain' }}
                  />
                </div>
              )}

              <h4 style={{ fontSize: 20, fontWeight: 700, color: '#2E6A80', marginBottom: 16 }}>
                {study.cliente || study.company}
              </h4>

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

              {/* Puente hacia la página de la industria (F3.4) */}
              {study.industriaSlug && (
                <Link
                  href={`/industrias/${study.industriaSlug}`}
                  style={{
                    marginTop: 'auto',
                    paddingTop: 18,
                    display: 'inline-flex',
                    alignSelf: 'flex-start',
                    alignItems: 'center',
                    gap: 6,
                    fontSize: 14.5,
                    fontWeight: 700,
                    color: theme.colors.primaryLight,
                    textDecoration: 'none',
                  }}
                >
                  Ver soluciones para {study.industry.toLowerCase()}
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                    <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </Link>
              )}
            </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
