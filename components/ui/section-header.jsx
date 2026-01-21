'use client';

import { memo } from 'react';
import { motion } from 'framer-motion';

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 }
};

const SectionHeader = memo(({ label, title, marginBottom = 60 }) => (
  <motion.div
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, margin: '-100px' }}
    variants={fadeInUp}
    transition={{ duration: 0.6 }}
    style={{ textAlign: 'center', marginBottom }}
  >
    <h2 style={{
      fontSize: 14,
      fontWeight: 700,
      color: '#EE7E31',
      textTransform: 'uppercase',
      letterSpacing: 2,
      marginBottom: 12
    }}>
      {label}
    </h2>
    <h3
      className="gradient-text"
      style={{ fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 900 }}
    >
      {title}
    </h3>
  </motion.div>
));

SectionHeader.displayName = 'SectionHeader';

export { SectionHeader };
