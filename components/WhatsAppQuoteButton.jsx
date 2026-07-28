'use client'

import { siteConfig, products } from '../config/site';
import { buildQuoteWhatsAppUrl } from '../lib/whatsapp.mjs';
import { trackWhatsAppPrefilled } from '../lib/analytics';
import WhatsAppIcon from './ui/whatsapp-icon';

const WHATSAPP_GREEN = '#128C4A'; // verde WhatsApp oscurecido para contraste AA sobre blanco

/**
 * CTA "Continuar por WhatsApp" con la cotización pre-llenada (F3.1).
 *
 * Toma el estado del cotizador y arma un mensaje legible con producto,
 * cantidad, specs, caja de stock y datos de contacto ya escritos.
 *
 * Igual que components/WhatsAppButton.jsx, no se renderiza mientras
 * siteConfig.contact.whatsapp esté vacío: se activa solo al configurar
 * el número comercial en config/site.js.
 *
 * @param {Object}  props.data        Estado del formulario (shape de QuoteWizard).
 * @param {string}  props.origen      Para analítica: 'wizard_specs' | 'wizard_exito' | 'boxfinder'.
 * @param {string} [props.quoteNumber] N° de cotización ya emitido.
 * @param {string} [props.label]      Texto del botón.
 * @param {boolean}[props.block]      Ocupa todo el ancho disponible.
 * @param {Object} [props.style]      Estilos adicionales.
 */
export default function WhatsAppQuoteButton({
  data = {},
  origen = '',
  quoteNumber,
  label = 'Continuar por WhatsApp',
  block = false,
  style = {},
}) {
  const productoNombre = products.find((p) => p.id === data.producto)?.name;
  const href = buildQuoteWhatsAppUrl(siteConfig.contact.whatsapp, data, {
    productoNombre,
    quoteNumber,
  });

  if (!href) return null;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => trackWhatsAppPrefilled({ origen, producto: data.producto || '' })}
      style={{
        display: block ? 'flex' : 'inline-flex',
        width: block ? '100%' : undefined,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        padding: '13px 22px',
        borderRadius: 10,
        background: WHATSAPP_GREEN,
        color: 'white',
        fontWeight: 700,
        fontSize: 15,
        textDecoration: 'none',
        border: 'none',
        cursor: 'pointer',
        ...style,
      }}
    >
      {/* currentColor: el glifo sigue al color del botón, sea sólido o delineado */}
      <WhatsAppIcon size={20} color="currentColor" />
      {label}
    </a>
  );
}
