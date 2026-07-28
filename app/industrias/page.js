import Link from 'next/link';
import { industrias } from '../../config/industrias';
import { theme } from '../../config/site';
import { buildMetadata } from '../../lib/seo';
import SharedFooter from '../../components/shared-footer';

export const metadata = buildMetadata({
  title: 'Soluciones de embalaje por industria',
  description:
    'Cartón corrugado a medida por industria en Chile: e-commerce, alimentos y agro, muebles, construcción y logística. Fabricante directo, cotización sin costo.',
  path: '/industrias',
});

export default function Page() {
  return (
    <div style={{ background: '#F8FAFB', minHeight: '100vh' }}>
      {/* Hero */}
      <section
        className="section-padding"
        style={{ background: theme.gradients.primary, color: 'white', padding: '72px 24px' }}
      >
        <div style={{ maxWidth: 1000, margin: '0 auto', textAlign: 'center' }}>
          <p
            style={{
              textTransform: 'uppercase',
              letterSpacing: 1.5,
              fontSize: 13,
              fontWeight: 700,
              color: theme.colors.accentLight,
              marginBottom: 16,
            }}
          >
            Soluciones por industria
          </p>
          <h1 style={{ fontSize: 'clamp(28px, 5vw, 44px)', fontWeight: 800, lineHeight: 1.2, marginBottom: 20 }}>
            Embalaje de cartón corrugado para cada rubro
          </h1>
          <p style={{ fontSize: 18, lineHeight: 1.7, color: 'rgba(255,255,255,0.85)', maxWidth: 720, margin: '0 auto' }}>
            Somos fabricantes directos de cartón corrugado en Padre Hurtado, Región Metropolitana.
            Conoce cómo resolvemos los desafíos de embalaje de tu industria y solicita una cotización sin costo.
          </p>
        </div>
      </section>

      {/* Grid de industrias */}
      <section className="section-padding" style={{ padding: '72px 24px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: 28,
            }}
          >
            {industrias.map((industria) => (
              <Link
                key={industria.slug}
                href={`/industrias/${industria.slug}`}
                className="card"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  padding: 28,
                  textDecoration: 'none',
                  color: 'inherit',
                  height: '100%',
                }}
              >
                <span
                  style={{
                    textTransform: 'uppercase',
                    letterSpacing: 1,
                    fontSize: 12,
                    fontWeight: 700,
                    color: '#A8480F',
                    marginBottom: 10,
                  }}
                >
                  {industria.nombre}
                </span>
                <h2 style={{ fontSize: 20, fontWeight: 700, color: theme.colors.primary, lineHeight: 1.3, marginBottom: 12 }}>
                  {industria.tituloSEO}
                </h2>
                <p style={{ fontSize: 15, lineHeight: 1.65, color: theme.colors.textMuted, marginBottom: 20 }}>
                  {industria.heroCopy}
                </p>
                <span
                  style={{
                    marginTop: 'auto',
                    fontSize: 15,
                    fontWeight: 700,
                    color: theme.colors.primaryLight,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                  }}
                >
                  Ver soluciones
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                    <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: '#F5F1EA', padding: '56px 24px' }}>
        <div style={{ maxWidth: 800, margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: 'clamp(22px, 4vw, 30px)', fontWeight: 800, color: theme.colors.primary, marginBottom: 14 }}>
            ¿No ves tu industria en la lista?
          </h2>
          <p style={{ fontSize: 17, lineHeight: 1.7, color: theme.colors.text, marginBottom: 28 }}>
            Fabricamos cartón corrugado a medida para cualquier rubro. Cuéntanos qué necesitas embalar y te ayudamos.
          </p>
          <Link href="/#cotizar" className="btn-primary" style={{ textDecoration: 'none', display: 'inline-block' }}>
            Solicitar cotización
          </Link>
        </div>
      </section>

      <SharedFooter />
    </div>
  );
}
