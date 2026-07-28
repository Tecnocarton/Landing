import { theme } from '../../config/site';

/**
 * Distintivo "BETA" para el contenido que todavía está en revisión
 * (fichas técnicas, catálogo y el asistente de cajas de stock).
 *
 * Mismo estilo que el badge que ya usaba app/cajas-stock/page.js, extraído acá
 * para que las páginas en beta se vean iguales entre sí.
 *
 * @param {'light'|'dark'} [variant] `dark` para fondos oscuros (hero primario).
 * @param {Object} [style] Estilos adicionales.
 */
export default function BetaBadge({ variant = 'light', style = {} }) {
  const isDark = variant === 'dark';

  return (
    <span
      style={{
        display: 'inline-block',
        fontSize: 12,
        fontWeight: 800,
        letterSpacing: '0.05em',
        color: isDark ? theme.colors.accentLight : theme.colors.accentDark,
        background: isDark ? 'rgba(255,255,255,0.14)' : 'rgba(230,118,53,0.12)',
        padding: '4px 12px',
        borderRadius: 999,
        ...style,
      }}
    >
      BETA
    </span>
  );
}
