'use client'

import { motion } from 'framer-motion';
import { siteConfig, valueProps, theme } from '../../config/site';
import { fadeInUp, staggerContainer } from '../../lib/motion';
import { SectionHeader } from '../ui/section-header';

export default function ValueProps() {
  return (
    <section className="section-padding" style={{ padding: '80px 24px', background: 'white' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <SectionHeader
          label={`¿Por qué ${siteConfig.company.name}?`}
          title="La mejor opción en embalaje"
        />

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          variants={staggerContainer}
          className="value-grid"
          style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 24 }}
        >
          {valueProps.map((item, i) => (
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
                  background: `linear-gradient(135deg, ${theme.colors.primaryLight}, ${theme.colors.primary})`,
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
  );
}
