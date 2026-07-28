import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { productos, getProducto } from '../../../config/productos';
import { siteConfig, theme } from '../../../config/site';
import { buildMetadata, SITE_URL } from '../../../lib/seo';
import { formatGramajes, formatOndas } from '../../../lib/specs.mjs';
import JsonLd from '../../../components/seo/JsonLd';
import SpecTable from '../../../components/ui/SpecTable';
import SharedFooter from '../../../components/shared-footer';
import BetaBadge from '../../../components/ui/BetaBadge';

// Fichas técnicas en BETA: el contenido técnico (gramajes, ondas, tolerancias)
// sigue en revisión, así que sin el flag la ruta no existe.
const FICHAS_BETA = process.env.NEXT_PUBLIC_ENABLE_FICHAS_BETA === 'true';

export function generateStaticParams() {
  return productos.map((p) => ({ slug: p.slug }));
}

export function generateMetadata({ params }) {
  const producto = getProducto(params.slug);
  if (!producto) return {};
  return buildMetadata({
    title: producto.titulo,
    description: producto.descripcion,
    path: `/productos/${producto.slug}`,
    noindex: true, // contenido en BETA, aún en revisión
  });
}

export default function Page({ params }) {
  // Gate BETA: sin la variable de entorno (producción) la ruta no existe.
  if (!FICHAS_BETA) notFound();

  const producto = getProducto(params.slug);
  if (!producto) notFound();

  const { specs } = producto;

  const productJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: producto.nombre,
    description: producto.descripcion,
    category: 'Cajas de cartón corrugado',
    image: `${SITE_URL}${producto.imagen}`,
    brand: { '@type': 'Brand', name: siteConfig.company.name },
    manufacturer: {
      '@type': 'Organization',
      name: siteConfig.company.name,
      url: SITE_URL,
    },
  };

  // Sin guarda, un producto sin `faq` reventaría el build (esta ruta es SSG).
  // Además, emitir un FAQPage con mainEntity vacío es señal negativa para Google.
  const faqItems = Array.isArray(producto.faq) ? producto.faq : [];
  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqItems.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };

  const sectionH2 = {
    fontSize: 'clamp(24px, 4vw, 32px)',
    fontWeight: 800,
    color: theme.colors.primary,
    marginBottom: 12,
  };
  const sectionLead = {
    fontSize: 16,
    lineHeight: 1.7,
    color: theme.colors.textMuted,
    marginBottom: 28,
    maxWidth: 680,
  };

  return (
    <>
      <JsonLd data={productJsonLd} />
      {faqItems.length > 0 && <JsonLd data={faqJsonLd} />}

      {/* Hero */}
        <section style={{ background: theme.gradients.primary, color: 'white' }}>
          <div
            className="producto-hero"
            style={{
              maxWidth: 1100,
              margin: '0 auto',
              padding: '48px 24px',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: 40,
              alignItems: 'center',
            }}
          >
            <div>
              <nav aria-label="Ruta de navegación" style={{ fontSize: 13, marginBottom: 18 }}>
                <Link href="/productos" style={{ color: theme.colors.accentLight, textDecoration: 'none', fontWeight: 600 }}>
                  Fichas técnicas
                </Link>
                <span style={{ color: 'rgba(255,255,255,0.5)' }}> / {producto.nombre}</span>
              </nav>
              <BetaBadge variant="dark" style={{ marginBottom: 14 }} />
              <h1 style={{ fontSize: 'clamp(28px, 5vw, 42px)', fontWeight: 800, marginBottom: 18, lineHeight: 1.12 }}>
                {producto.nombre}
              </h1>
              <p style={{ fontSize: 18, lineHeight: 1.7, color: 'rgba(255,255,255,0.88)', marginBottom: 28 }}>
                {producto.heroCopy}
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14 }}>
                <Link href={`/?producto=${producto.id}#cotizar`} className="btn-primary" style={{ textDecoration: 'none' }}>
                  Cotizar este producto
                </Link>
                <a
                  href={`mailto:${siteConfig.contact.email}`}
                  className="btn-secondary btn-secondary--on-dark"
                  style={{ textDecoration: 'none' }}
                >
                  Escríbenos a {siteConfig.contact.email}
                </a>
              </div>
            </div>
            <div
              style={{
                position: 'relative',
                width: '100%',
                aspectRatio: '4 / 3',
                borderRadius: 16,
                overflow: 'hidden',
                boxShadow: '0 20px 45px rgba(0,0,0,0.25)',
              }}
            >
              <Image
                src={producto.imagen}
                alt={producto.nombre}
                fill
                sizes="(max-width: 700px) 100vw, 50vw"
                style={{ objectFit: 'cover' }}
                priority
              />
            </div>
          </div>
        </section>

        {/* Datos clave */}
        <section className="section-padding" style={{ background: 'white', paddingTop: 48, paddingBottom: 48 }}>
          <div
            style={{
              maxWidth: 1100,
              margin: '0 auto',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: 20,
            }}
          >
            {[
              { label: 'Pedido mínimo', value: producto.minOrder.label },
              { label: 'Plazo de entrega', value: producto.plazos.normal },
              { label: 'Gramajes disponibles', value: formatGramajes(specs.gramajes) },
              { label: 'Ondas disponibles', value: formatOndas(specs.ondas) },
            ].map((item) => (
              <div
                key={item.label}
                style={{
                  background: '#F5F1EA',
                  borderRadius: 12,
                  padding: '20px 22px',
                  border: `1px solid ${theme.colors.borderLight}`,
                }}
              >
                <div
                  style={{
                    fontSize: 12,
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.06em',
                    color: theme.colors.textMuted,
                    marginBottom: 8,
                  }}
                >
                  {item.label}
                </div>
                <div style={{ fontSize: 18, fontWeight: 700, color: theme.colors.primary }}>{item.value}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Los dos ejes. Va primero a propósito: es el ancla conceptual que evita
            que se lea "12C" como si gramaje y onda fueran una sola cosa. */}
        <section className="section-padding" style={{ background: 'white', paddingTop: 56, paddingBottom: 56 }}>
          <div style={{ maxWidth: 1000, margin: '0 auto' }}>
            <h2 style={sectionH2}>Cómo se define el cartón: dos ejes</h2>
            <p style={sectionLead}>
              El gramaje y la onda son cosas distintas y se eligen por separado. El número indica cuánto peso aguanta;
              la letra, cómo es el corrugado por dentro.
            </p>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: 20,
              }}
            >
              {specs.ejes.map((eje) => (
                <div
                  key={eje.titulo}
                  style={{
                    background: '#F5F1EA',
                    borderRadius: 12,
                    padding: 26,
                    border: `1px solid ${theme.colors.borderLight}`,
                  }}
                >
                  <h3 style={{ fontSize: 20, fontWeight: 800, color: theme.colors.primary, margin: '0 0 10px' }}>
                    {eje.titulo}
                  </h3>
                  <p style={{ fontSize: 15.5, lineHeight: 1.65, color: theme.colors.textSecondary, margin: 0 }}>
                    {eje.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Eje 1 · Gramajes */}
        <section className="section-padding" style={{ background: '#F5F1EA', paddingTop: 56, paddingBottom: 56 }}>
          <div style={{ maxWidth: 1000, margin: '0 auto' }}>
            <h2 style={sectionH2}>Gramajes y resistencia</h2>
            <p style={sectionLead}>
              El gramaje define cuánto peso soporta el cartón. Elige según el peso de tu producto y cómo se apila.
            </p>
            <SpecTable
              rowKey="gramaje"
              columns={[
                { key: 'gramaje', label: 'Gramaje', variant: 'strong' },
                { key: 'weight', label: 'Peso aproximado' },
                { key: 'resistencia', label: 'Resistencia' },
                { key: 'use', label: 'Uso recomendado', variant: 'muted' },
              ]}
              rows={specs.gramajes}
            />
            <p className="spec-note">{specs.notaResistencia}</p>
          </div>
        </section>

        {/* Eje 2 · Ondas. Misma tabla y mismo peso visual que los gramajes:
            antes eran tarjetas y se leían como una nota al pie. */}
        <section className="section-padding" style={{ background: 'white', paddingTop: 56, paddingBottom: 56 }}>
          <div style={{ maxWidth: 1000, margin: '0 auto' }}>
            <h2 style={sectionH2}>Tipos de onda</h2>
            <p style={sectionLead}>
              La onda define el espesor, la rigidez y la calidad de impresión del cartón. Trabajamos las tres: C, B y E.
            </p>
            <SpecTable
              rowKey="onda"
              columns={[
                { key: 'nombre', label: 'Onda', variant: 'strong' },
                { key: 'altura', label: 'Espesor aproximado', variant: 'accent' },
                { key: 'uso', label: 'Cuándo conviene', variant: 'muted' },
              ]}
              rows={specs.ondas.map((o) => ({ ...o, nombre: `Onda ${o.onda}` }))}
            />
            <div className="spec-callout">
              <p className="spec-callout__title">Disponibilidad por combinación</p>
              <p>
                {specs.notaDisponibilidad} Respondemos en {siteConfig.form.responseTime}.
              </p>
            </div>
          </div>
        </section>

        {/* Medidas y tolerancias */}
        <section className="section-padding" style={{ background: '#F5F1EA', paddingTop: 56, paddingBottom: 56 }}>
          <div style={{ maxWidth: 1000, margin: '0 auto' }}>
            <div
              style={{
                background: 'white',
                borderRadius: 12,
                padding: 24,
                border: `1px solid ${theme.colors.borderLight}`,
                marginBottom: 48,
              }}
            >
              <h3 style={{ fontSize: 18, fontWeight: 700, color: theme.colors.primary, marginBottom: 8 }}>
                Medidas y formatos
              </h3>
              <p style={{ fontSize: 15, lineHeight: 1.7, color: theme.colors.textMuted, margin: 0 }}>
                {producto.medidasInfo}
              </p>
            </div>

            {/* Tolerancias de fabricación (F3.3 · transparencia técnica) */}
            <h2 style={sectionH2}>Tolerancias de fabricación</h2>
            <p style={sectionLead}>
              Estos son los rangos de referencia con los que trabajamos. Publicarlos evita sorpresas: el valor exacto de
              tu pedido queda confirmado en la cotización.
            </p>
            <SpecTable
              rowKey="parametro"
              columns={[
                { key: 'parametro', label: 'Parámetro', variant: 'semi' },
                { key: 'valor', label: 'Tolerancia', variant: 'accent' },
                { key: 'nota', label: 'Detalle', variant: 'muted' },
              ]}
              rows={specs.tolerancias}
            />
          </div>
        </section>

        {/* Usos */}
        <section className="section-padding" style={{ background: 'white', paddingTop: 56, paddingBottom: 56 }}>
          <div style={{ maxWidth: 1000, margin: '0 auto' }}>
            <h2 style={{ fontSize: 'clamp(24px, 4vw, 32px)', fontWeight: 800, color: theme.colors.primary, marginBottom: 28 }}>
              Aplicaciones y usos
            </h2>
            <ul
              style={{
                listStyle: 'none',
                margin: 0,
                padding: 0,
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                gap: 14,
              }}
            >
              {producto.usos.map((uso) => (
                <li
                  key={uso}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 12,
                    fontSize: 16,
                    lineHeight: 1.5,
                    color: theme.colors.text,
                    background: '#F5F1EA',
                    padding: '14px 18px',
                    borderRadius: 10,
                  }}
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke={theme.colors.accentDark}
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                    style={{ flexShrink: 0, marginTop: 2 }}
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  {uso}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Plazos */}
        <section className="section-padding" style={{ background: '#E8DFD3', paddingTop: 48, paddingBottom: 48 }}>
          <div style={{ maxWidth: 1000, margin: '0 auto' }}>
            <h2 style={{ fontSize: 'clamp(22px, 4vw, 28px)', fontWeight: 800, color: theme.colors.primary, marginBottom: 12 }}>
              Plazos de entrega
            </h2>
            <p style={{ fontSize: 17, lineHeight: 1.7, color: theme.colors.text, margin: 0 }}>
              Plazo habitual de <strong>{producto.plazos.normal}</strong> una vez confirmado el pedido, con despacho
              mediante flota propia en la Región Metropolitana. {producto.plazos.urgencia}
            </p>
          </div>
        </section>

        {/* FAQ */}
        <section className="section-padding" style={{ background: 'white', paddingTop: 56, paddingBottom: 56 }}>
          <div style={{ maxWidth: 820, margin: '0 auto' }}>
            <h2 style={{ fontSize: 'clamp(24px, 4vw, 32px)', fontWeight: 800, color: theme.colors.primary, marginBottom: 28 }}>
              Preguntas frecuentes
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {faqItems.map((f, i) => (
                <details
                  key={i}
                  style={{
                    background: '#F5F1EA',
                    borderRadius: 12,
                    padding: '18px 22px',
                    border: `1px solid ${theme.colors.borderLight}`,
                  }}
                >
                  <summary
                    style={{
                      fontSize: 17,
                      fontWeight: 700,
                      color: theme.colors.primary,
                      cursor: 'pointer',
                      listStyle: 'none',
                    }}
                  >
                    {f.q}
                  </summary>
                  <p style={{ fontSize: 15, lineHeight: 1.7, color: theme.colors.textMuted, marginTop: 12, marginBottom: 0 }}>
                    {f.a}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* CTA final */}
        <section className="section-padding" style={{ background: theme.gradients.primary, color: 'white', textAlign: 'center' }}>
          <div style={{ maxWidth: 720, margin: '0 auto' }}>
            <h2 style={{ fontSize: 'clamp(26px, 4vw, 36px)', fontWeight: 800, marginBottom: 16 }}>
              ¿Listo para cotizar?
            </h2>
            <p style={{ fontSize: 18, lineHeight: 1.7, color: 'rgba(255,255,255,0.85)', marginBottom: 28 }}>
              Cuéntanos medidas, gramaje y cantidad. Te respondemos en {siteConfig.form.responseTime}.
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14, justifyContent: 'center' }}>
              <Link href={`/?producto=${producto.id}#cotizar`} className="btn-primary" style={{ textDecoration: 'none' }}>
                Solicitar cotización
              </Link>
              <Link href="/catalogo" className="btn-secondary btn-secondary--on-dark" style={{ textDecoration: 'none' }}>
                Descargar catálogo
              </Link>
              <a
                href={`mailto:${siteConfig.contact.email}`}
                className="btn-secondary btn-secondary--on-dark"
                style={{ textDecoration: 'none' }}
              >
                Contactar a ventas
              </a>
            </div>
          </div>
        </section>

      <SharedFooter />
    </>
  );
}
