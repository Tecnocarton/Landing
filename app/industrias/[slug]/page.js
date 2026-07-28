import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { industrias, getIndustria } from '../../../config/industrias';
import { siteConfig, theme, getClientLogo } from '../../../config/site';
import { buildMetadata } from '../../../lib/seo';
import JsonLd from '../../../components/seo/JsonLd';
import SharedFooter from '../../../components/shared-footer';

// Fichas técnicas (/productos/[slug]) en BETA: sin el flag esas rutas hacen
// notFound(), así que los productos recomendados llevan al cotizador.
const FICHAS_BETA = process.env.NEXT_PUBLIC_ENABLE_FICHAS_BETA === 'true';

export function generateStaticParams() {
  return industrias.map((industria) => ({ slug: industria.slug }));
}

export function generateMetadata({ params }) {
  const industria = getIndustria(params.slug);
  if (!industria) return {};
  return buildMetadata({
    title: industria.tituloSEO,
    description: industria.descripcionSEO,
    path: `/industrias/${industria.slug}`,
  });
}

export default function Page({ params }) {
  const industria = getIndustria(params.slug);
  if (!industria) notFound();

  // Sin guarda, una industria sin `faq` reventaría el build (ruta SSG).
  const faqItems = Array.isArray(industria.faq) ? industria.faq : [];
  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqItems.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: { '@type': 'Answer', text: item.a },
    })),
  };

  return (
    <div style={{ background: '#F8FAFB', minHeight: '100vh' }}>
      {faqItems.length > 0 && <JsonLd data={faqJsonLd} />}

      {/* Hero */}
      <section
        className="section-padding"
        style={{ background: theme.gradients.primary, color: 'white', padding: '72px 24px' }}
      >
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <nav aria-label="Migas de pan" style={{ fontSize: 14, marginBottom: 20 }}>
            <Link href="/industrias" style={{ color: 'rgba(255,255,255,0.75)', textDecoration: 'none' }}>
              Industrias
            </Link>
            <span style={{ color: 'rgba(255,255,255,0.5)', margin: '0 8px' }}>/</span>
            <span style={{ color: theme.colors.accentLight, fontWeight: 700 }}>{industria.nombre}</span>
          </nav>
          <h1 style={{ fontSize: 'clamp(28px, 5vw, 44px)', fontWeight: 800, lineHeight: 1.2, marginBottom: 20 }}>
            {industria.tituloSEO}
          </h1>
          <p style={{ fontSize: 18, lineHeight: 1.7, color: 'rgba(255,255,255,0.88)', maxWidth: 720, marginBottom: 32 }}>
            {industria.heroCopy}
          </p>
          <Link href="/#cotizar" className="btn-primary" style={{ textDecoration: 'none', display: 'inline-block' }}>
            Cotizar para {industria.nombre.toLowerCase()}
          </Link>
        </div>
      </section>

      {/* Desafíos del rubro */}
      <section className="section-padding" style={{ padding: '64px 24px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <h2 style={{ fontSize: 'clamp(22px, 4vw, 30px)', fontWeight: 800, color: theme.colors.primary, marginBottom: 12 }}>
            Desafíos de embalaje en {industria.nombre.toLowerCase()}
          </h2>
          <p style={{ fontSize: 16, color: theme.colors.textMuted, marginBottom: 36, maxWidth: 640 }}>
            Estos son los problemas más frecuentes que escuchamos de jefes de bodega y compras del rubro.
          </p>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: 20,
            }}
          >
            {industria.pains.map((pain, i) => (
              <div key={i} className="card" style={{ padding: 26, display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                <span
                  aria-hidden="true"
                  style={{
                    flexShrink: 0,
                    width: 34,
                    height: 34,
                    borderRadius: 8,
                    background: 'rgba(230,118,53,0.12)',
                    color: theme.colors.accentDark,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M12 9v4M12 17h.01M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                <p style={{ fontSize: 15.5, lineHeight: 1.6, color: theme.colors.text, margin: 0 }}>{pain}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Cómo ayuda Tecnocarton */}
      <section className="section-padding" style={{ background: '#F5F1EA', padding: '64px 24px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <h2 style={{ fontSize: 'clamp(22px, 4vw, 30px)', fontWeight: 800, color: theme.colors.primary, marginBottom: 12 }}>
            Cómo te ayuda Tecnocarton
          </h2>
          <p style={{ fontSize: 16, color: theme.colors.textMuted, marginBottom: 36, maxWidth: 640 }}>
            Fabricamos directo, con integración vertical desde la materia prima hasta el despacho.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 20 }}>
            {industria.soluciones.map((sol, i) => (
              <div
                key={i}
                style={{
                  background: '#FFFFFF',
                  border: `1px solid ${theme.colors.border}`,
                  borderRadius: 12,
                  padding: 26,
                  display: 'flex',
                  gap: 14,
                  alignItems: 'flex-start',
                }}
              >
                <span
                  aria-hidden="true"
                  style={{
                    flexShrink: 0,
                    width: 34,
                    height: 34,
                    borderRadius: 8,
                    background: 'rgba(27,77,92,0.1)',
                    color: theme.colors.primary,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M20 6 9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                <p style={{ fontSize: 15.5, lineHeight: 1.6, color: theme.colors.text, margin: 0 }}>{sol}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Productos recomendados */}
      <section className="section-padding" style={{ padding: '64px 24px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <h2 style={{ fontSize: 'clamp(22px, 4vw, 30px)', fontWeight: 800, color: theme.colors.primary, marginBottom: 36 }}>
            Productos recomendados para {industria.nombre.toLowerCase()}
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 20 }}>
            {industria.productosRecomendados.map((producto) => (
              <Link
                key={producto.slug}
                href={FICHAS_BETA ? `/productos/${producto.slug}` : `/?producto=${producto.id}#cotizar`}
                className="card"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  padding: 26,
                  textDecoration: 'none',
                  color: 'inherit',
                }}
              >
                <h3 style={{ fontSize: 18, fontWeight: 700, color: theme.colors.primary, marginBottom: 12 }}>
                  {producto.nombre}
                </h3>
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
                  {FICHAS_BETA ? 'Ver producto' : 'Cotizar este producto'}
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                    <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Caso de éxito */}
      {industria.casoExito && (
        <section className="section-padding" style={{ background: '#E8DFD3', padding: '64px 24px' }}>
          <div style={{ maxWidth: 900, margin: '0 auto' }}>
            <p
              style={{
                textTransform: 'uppercase',
                letterSpacing: 1.5,
                fontSize: 13,
                fontWeight: 700,
                color: theme.colors.accentDark,
                marginBottom: 14,
              }}
            >
              Caso de éxito · {industria.casoExito.industry}
            </p>
            <h2 style={{ fontSize: 'clamp(22px, 4vw, 30px)', fontWeight: 800, color: theme.colors.primary, marginBottom: 28 }}>
              {industria.casoExito.result}
            </h2>
            {/* Logo del cliente solo si el caso tiene autorización (campo `cliente`) */}
            {getClientLogo(industria.casoExito.cliente) && (
              <div style={{ display: 'flex', alignItems: 'center', height: 48, marginBottom: 20 }}>
                <Image
                  src={getClientLogo(industria.casoExito.cliente)}
                  alt={industria.casoExito.cliente}
                  width={144}
                  height={48}
                  style={{ width: 'auto', height: '100%', maxWidth: 180, objectFit: 'contain' }}
                />
              </div>
            )}
            <div
              style={{
                background: '#FFFFFF',
                borderRadius: 14,
                padding: 32,
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                gap: 28,
              }}
            >
              <div>
                <h3 style={{ fontSize: 14, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.8, color: theme.colors.textMuted, marginBottom: 8 }}>
                  Desafío
                </h3>
                <p style={{ fontSize: 15.5, lineHeight: 1.6, color: theme.colors.text, margin: 0 }}>
                  {industria.casoExito.challenge}
                </p>
              </div>
              <div>
                <h3 style={{ fontSize: 14, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.8, color: theme.colors.textMuted, marginBottom: 8 }}>
                  Solución
                </h3>
                <p style={{ fontSize: 15.5, lineHeight: 1.6, color: theme.colors.text, margin: 0 }}>
                  {industria.casoExito.solution}
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* FAQ */}
      <section className="section-padding" style={{ padding: '64px 24px' }}>
        <div style={{ maxWidth: 820, margin: '0 auto' }}>
          <h2 style={{ fontSize: 'clamp(22px, 4vw, 30px)', fontWeight: 800, color: theme.colors.primary, marginBottom: 32 }}>
            Preguntas frecuentes
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {faqItems.map((item, i) => (
              <div
                key={i}
                style={{
                  background: '#FFFFFF',
                  border: `1px solid ${theme.colors.border}`,
                  borderRadius: 12,
                  padding: 24,
                }}
              >
                <h3 style={{ fontSize: 17, fontWeight: 700, color: theme.colors.text, marginBottom: 10 }}>{item.q}</h3>
                <p style={{ fontSize: 15.5, lineHeight: 1.7, color: theme.colors.textMuted, margin: 0 }}>{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA final */}
      <section style={{ background: theme.gradients.primary, padding: '64px 24px', color: 'white' }}>
        <div style={{ maxWidth: 760, margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: 'clamp(24px, 4vw, 32px)', fontWeight: 800, marginBottom: 16 }}>
            Cotiza embalaje para {industria.nombre.toLowerCase()}
          </h2>
          <p style={{ fontSize: 17, lineHeight: 1.7, color: 'rgba(255,255,255,0.85)', marginBottom: 30 }}>
            Cuéntanos qué necesitas embalar y te respondemos con una propuesta en {siteConfig.form.responseTime}.
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
