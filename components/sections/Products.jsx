'use client'

import Image from 'next/image';
import { motion } from 'framer-motion';
import { products, theme } from '../../config/site';
import { scaleIn, staggerContainer, scrollToSection } from '../../lib/motion';
import { SectionHeader } from '../ui/section-header';

export default function Products() {
  const handleProductSelect = (productId) => {
    window.dispatchEvent(new CustomEvent('tc:select-product', { detail: { productId } }));
  };

  return (
    <section id="productos" className="section-padding" style={{ padding: '80px 24px', background: '#F8FAFB' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <SectionHeader label="Catálogo" title="Nuestros productos" />

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
                background: product.image ? '#f5f5f5' : `linear-gradient(135deg, ${theme.colors.accent}, ${theme.colors.accentLight})`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative'
              }}>
                {product.image ? (
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    style={{ objectFit: 'cover' }}
                  />
                ) : (
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                    <rect x="3" y="3" width="18" height="18" rx="2"/>
                    <path d="M3 9h18M9 21V9"/>
                  </svg>
                )}
              </div>
              <h4 style={{ fontSize: 16, fontWeight: 700, color: '#2E6A80', marginBottom: 8 }}>{product.name}</h4>
              <p style={{ fontSize: 13, color: '#374151', fontWeight: 500, marginBottom: 8 }}>{product.desc}</p>
            </motion.a>
          ))}
        </motion.div>

      </div>
    </section>
  );
}
