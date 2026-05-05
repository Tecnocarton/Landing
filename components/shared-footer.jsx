'use client'

import { motion } from 'framer-motion';
import Link from 'next/link';
import { siteConfig, products, footerLinks, theme } from '../config/site';
import './landing.css';

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

export default function SharedFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <motion.footer
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-50px' }}
      variants={fadeInUp}
      transition={{ duration: 0.6 }}
      style={{
        background: theme.colors.primaryDark,
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
              <Link href="/">
                <img
                  src={siteConfig.company.logo}
                  alt={siteConfig.company.name}
                  className="footer-logo"
                  style={{ height: 72, width: 'auto', objectFit: 'contain' }}
                />
              </Link>
            </div>
            <p style={{ color: 'rgba(255,255,255,0.6)', lineHeight: 1.7, fontSize: 14 }}>
              {siteConfig.company.description}
            </p>
            <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
              {siteConfig.social.linkedin && (
                <a
                  href={siteConfig.social.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn de Tecnocarton"
                  className="footer-linkedin-btn"
                  style={{
                    width: 40,
                    height: 40,
                    background: 'rgba(255,255,255,0.1)',
                    borderRadius: 8,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="white" aria-hidden="true">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>
              )}
            </div>
          </div>

          {/* Products */}
          <div>
            <h5 style={{ fontWeight: 700, marginBottom: 20, color: theme.colors.accent }}>Productos</h5>
            {products.map((product, i) => (
              <Link key={i} href="/#productos" className="footer-link">{product.name}</Link>
            ))}
          </div>

          {/* Company */}
          <div>
            <h5 style={{ fontWeight: 700, marginBottom: 20, color: theme.colors.accent }}>Empresa</h5>
            {footerLinks.map((item, i) => (
              <Link
                key={i}
                href={item.href || (item.section ? `/#${item.section}` : '/')}
                className="footer-link"
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Contact */}
          <div>
            <h5 style={{ fontWeight: 700, marginBottom: 20, color: theme.colors.accent }}>Contacto</h5>
            <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: 14, lineHeight: 2 }}>
              <div>{siteConfig.address.full}</div>
              <div>
                <a
                  href={`mailto:${siteConfig.contact.email}`}
                  style={{ color: 'inherit', textDecoration: 'none' }}
                >
                  {siteConfig.contact.email}
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
              className="footer-linkedin-link"
              style={{
                textDecoration: 'none',
                fontSize: 13,
                display: 'flex',
                alignItems: 'center',
                gap: 6
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
              LinkedIn
            </a>
          )}
        </div>
      </div>
    </motion.footer>
  );
}
