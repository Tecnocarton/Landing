'use client'

import { memo } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useCarousel } from '../../lib/hooks';
import { siteConfig, stats, theme } from '../../config/site';
import { fadeInUp, staggerContainer, scrollToSection } from '../../lib/motion';
import { NumberTicker } from '../ui/number-ticker';
import { TextGenerateEffect } from '../ui/text-generate-effect';
import { FlipWords } from '../ui/flip-words';

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
    <div className="stat-number" style={{ fontSize: 36, fontWeight: 900, color: theme.colors.primaryLight, marginBottom: 8 }}>
      {stat.isText ? stat.value : (
        <>
          <NumberTicker value={stat.value} />
          {stat.suffix}
        </>
      )}
    </div>
    <div style={{ fontSize: 14, color: theme.colors.textMuted, fontWeight: 500 }}>
      {stat.label}
    </div>
  </motion.div>
));

StatCard.displayName = 'StatCard';

const carouselImages = ['/stock_cajas.webp', '/img1.webp', '/img2.webp'];

export default function Hero() {
  const [currentSlide, setCurrentSlide] = useCarousel(carouselImages.length, 5000);

  return (
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
              opacity: currentSlide === index ? 1 : 0,
              transition: 'opacity 1.8s cubic-bezier(0.22, 1, 0.36, 1)',
              transform: currentSlide === index ? 'scale(1)' : 'scale(1.05)'
            }}
          >
            <Image
              src={img}
              alt=""
              fill
              sizes="100vw"
              priority={index === 0}
              style={{ objectFit: 'cover' }}
            />
          </div>
        ))}
        {/* Sophisticated dark overlay with gradient */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'linear-gradient(135deg, rgba(27,77,92,0.72) 0%, rgba(15,53,64,0.65) 50%, rgba(27,77,92,0.70) 100%)'
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
      <div className="carousel-indicators" style={{
        position: 'absolute',
        bottom: 28,
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        gap: 10,
        zIndex: 2,
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

      <div className="hero-grid" style={{ maxWidth: 1200, margin: '0 auto', padding: '48px 24px 80px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 60, alignItems: 'center', position: 'relative', zIndex: 1 }}>
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
              background: 'rgba(230,118,53,0.2)',
              color: theme.colors.accent,
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
            <TextGenerateEffect
              words="Soluciones de embalaje en"
              className="text-white"
              duration={0.4}
              staggerDelay={0.06}
            />{' '}
            <FlipWords
              words={['cartón corrugado', 'embalaje industrial', 'packaging sustentable']}
              duration={3000}
            />
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
            Fabricante directo para empresas. Producimos por volumen —pedidos desde
            500 hasta 15.000+ unidades— con capacidad industrial y despacho propio en RM.
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
              Solicitar cotización
            </motion.a>
            <motion.a
              href="/proceso"
              className="btn-secondary btn-secondary--on-dark"
              style={{ textDecoration: 'none' }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Ver proceso
            </motion.a>
          </motion.div>

          {/* Trust badges */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            style={{ marginTop: 40, display: 'flex', gap: 10, flexWrap: 'wrap' }}
          >
            {[
              `Fábrica en Padre Hurtado desde ${siteConfig.company.foundedYear}`,
              `Respuesta en ${siteConfig.form.responseTime}`,
              'Despacho con flota propia en RM',
            ].map((badge, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 + i * 0.1 }}
                style={{
                  color: 'rgba(255,255,255,0.9)',
                  fontSize: 13,
                  fontWeight: 500,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  background: 'rgba(255,255,255,0.1)',
                  padding: '6px 12px',
                  borderRadius: 20,
                  border: '1px solid rgba(255,255,255,0.15)'
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={theme.colors.accent} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 6L9 17l-5-5"/>
                </svg>
                {badge}
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
  );
}
