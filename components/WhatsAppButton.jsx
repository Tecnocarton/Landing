'use client'

import { siteConfig } from '../config/site';
import { trackContactClick } from '../lib/analytics';
import { buildWhatsAppUrl } from '../lib/whatsapp.mjs';
import WhatsAppIcon from './ui/whatsapp-icon';

/**
 * Botón flotante de WhatsApp, visible en todas las páginas.
 * La URL se arma con lib/whatsapp.mjs (mismo camino que los CTA pre-llenados):
 * si el número no tiene dígitos, buildWhatsAppUrl devuelve null y el botón
 * no se monta, así que un número mal escrito nunca deja un link roto.
 */
export default function WhatsAppButton() {
  const href = buildWhatsAppUrl(siteConfig.contact.whatsapp, siteConfig.contact.whatsappMessage);
  if (!href) return null;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Cotizar por WhatsApp"
      className="no-print"
      onClick={() => trackContactClick('whatsapp')}
      style={{
        position: 'fixed',
        right: 20,
        bottom: 'calc(20px + env(safe-area-inset-bottom))',
        zIndex: 1100,
        width: 56,
        height: 56,
        borderRadius: '50%',
        background: '#25D366',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 4px 16px rgba(0,0,0,0.25)',
        transition: 'transform 200ms ease, box-shadow 200ms ease',
        cursor: 'pointer',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = '0 6px 24px rgba(0,0,0,0.35)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.25)';
      }}
    >
      <WhatsAppIcon size={30} color="#FFFFFF" />
    </a>
  );
}
