import Image from 'next/image';
import { notFound } from 'next/navigation';

import { stockBoxes } from '../../config/stockBoxes';
import { siteConfig, theme } from '../../config/site';
import { buildMetadata, SITE_URL } from '../../lib/seo';
import JsonLd from '../../components/seo/JsonLd';
import SharedFooter from '../../components/shared-footer';
import CajasStockFinder from '../../components/sections/CajasStockFinder';

export const metadata = buildMetadata({
  title: 'Cajas de stock',
  description:
    'Encuentra la caja de cartón corrugado 12C de stock que mejor calza tu producto. Ingresa las medidas y te sugerimos la caja y la cantidad estimada.',
  path: '/cajas-stock',
});

export default function Page() {
  // Gate BETA: sin la variable de entorno (producción) la ruta no existe.
  if (process.env.NEXT_PUBLIC_ENABLE_BOXFINDER_BETA !== 'true') {
    notFound();
  }

  // Datos estructurados: cada caja de stock como Product disponible (InStock).
  const productsJsonLd = stockBoxes.map((b) => ({
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: `Caja de cartón corrugado ${b.code}`,
    sku: b.code,
    category: 'Cajas de cartón corrugado 12C',
    description: `Caja de stock 12C, cartón corrugado onda C. Medidas internas ${b.largo}×${b.ancho}×${b.alto} cm.`,
    brand: { '@type': 'Brand', name: siteConfig.company.name },
    offers: {
      '@type': 'Offer',
      availability: 'https://schema.org/InStock',
      priceCurrency: 'CLP',
      url: `${SITE_URL}/cajas-stock`,
      seller: { '@type': 'Organization', name: siteConfig.company.name },
    },
  }));

  const badgeStyle = {
    display: 'inline-block',
    fontSize: 12,
    fontWeight: 800,
    letterSpacing: '0.05em',
    color: theme.colors.accentDark,
    background: 'rgba(230,118,53,0.12)',
    padding: '4px 12px',
    borderRadius: 999,
  };

  return (
    <>
      <JsonLd data={productsJsonLd} />

      {/* Hero */}
        <section
          className="section-padding"
          style={{ background: '#F5F1EA', textAlign: 'center' }}
        >
          <div style={{ maxWidth: 760, margin: '0 auto', padding: '0 24px' }}>
            <span style={badgeStyle}>BETA</span>
            <h1
              style={{
                fontSize: 'clamp(28px, 5vw, 44px)',
                fontWeight: 800,
                color: theme.colors.primary,
                margin: '16px 0 12px',
                lineHeight: 1.15,
              }}
            >
              Cajas de stock 12C listas para despacho
            </h1>
            <p style={{ fontSize: 18, color: theme.colors.textSecondary, lineHeight: 1.7, margin: 0 }}>
              Ingresa las medidas de tu producto y te sugerimos la caja de cartón
              corrugado 12C que mejor le acomoda, con la cantidad estimada. Es una
              herramienta en beta: nuestro equipo confirma el detalle al cotizar.
            </p>
          </div>
        </section>

        {/* Herramienta BoxFinder (wrapper client) */}
        <section className="section-padding" style={{ background: theme.colors.surface }}>
          <div style={{ maxWidth: 640, margin: '0 auto', padding: '0 24px' }}>
            <div className="card" style={{ padding: 28 }}>
              <CajasStockFinder />
            </div>
          </div>
        </section>

        {/* Grilla de cajas de stock */}
        <section className="section-padding" style={{ background: '#E8DFD3' }}>
          <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px' }}>
            <div style={{ textAlign: 'center', marginBottom: 40 }}>
              <h2
                style={{
                  fontSize: 'clamp(24px, 4vw, 34px)',
                  fontWeight: 800,
                  color: theme.colors.primary,
                  margin: '0 0 10px',
                }}
              >
                Nuestro stock de cajas 12C
              </h2>
              <p style={{ fontSize: 16, color: theme.colors.textSecondary, margin: 0 }}>
                Medidas internas útiles en centímetros (largo × ancho × alto).
              </p>
            </div>

            {/* Referencia de medidas */}
            <div
              className="card"
              style={{
                padding: 20,
                marginBottom: 32,
                display: 'flex',
                gap: 24,
                alignItems: 'center',
                flexWrap: 'wrap',
                justifyContent: 'center',
              }}
            >
              <div
                style={{
                  position: 'relative',
                  width: '100%',
                  maxWidth: 360,
                  aspectRatio: '4 / 3',
                  flex: '1 1 260px',
                }}
              >
                <Image
                  src="/MEDIDAS.png"
                  alt="Diagrama de cómo se miden el largo, ancho y alto interno de una caja"
                  fill
                  sizes="(max-width: 640px) 100vw, 360px"
                  style={{ objectFit: 'contain' }}
                />
              </div>
              <p
                style={{
                  flex: '1 1 240px',
                  minWidth: 240,
                  fontSize: 15,
                  color: theme.colors.textSecondary,
                  lineHeight: 1.7,
                  margin: 0,
                }}
              >
                Cada caja se identifica por un <strong>código de producto</strong>: el{' '}
                <strong>12</strong> es el gramaje del cartón, la <strong>C</strong> es el tipo de
                onda y el resto son las medidas internas <strong>largo × ancho × alto</strong> en
                centímetros. Así, <strong>12C30x20x20</strong> es una caja de gramaje 12, onda C,
                de 30 × 20 × 20 cm útiles. Es un código de SKU, no la forma de nombrar el gramaje:
                los gramajes se escriben solo con el número (12, 14, 17 y 20). Revisa el diagrama
                para medir tu producto de la misma forma.
              </p>
            </div>

            {/* Cajas */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
                gap: 16,
              }}
            >
              {stockBoxes.map((b) => (
                <div key={b.code} className="card" style={{ padding: 20 }}>
                  <div
                    style={{
                      fontSize: 18,
                      fontWeight: 800,
                      color: theme.colors.primaryLight,
                    }}
                  >
                    {b.code}
                  </div>
                  <div style={{ fontSize: 14, color: theme.colors.textMuted, marginTop: 6 }}>
                    Interior {b.largo} × {b.ancho} × {b.alto} cm
                  </div>
                  <div
                    style={{
                      display: 'inline-block',
                      marginTop: 12,
                      fontSize: 12,
                      fontWeight: 700,
                      color: '#047857',
                    }}
                  >
                    En stock
                  </div>
                </div>
              ))}
            </div>

            <div style={{ textAlign: 'center', marginTop: 36 }}>
              <a href="/#cotizar" className="btn-primary">
                Cotizar cajas de stock
              </a>
            </div>
          </div>
        </section>

      <SharedFooter />
    </>
  );
}
