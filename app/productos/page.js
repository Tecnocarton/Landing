import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { productos } from '../../config/productos';
import { theme } from '../../config/site';
import { buildMetadata } from '../../lib/seo';
import SharedFooter from '../../components/shared-footer';
import BetaBadge from '../../components/ui/BetaBadge';

export const metadata = buildMetadata({
  title: 'Fichas técnicas de productos',
  description:
    'Fichas técnicas de cartón corrugado Tecnocarton: planchas, rollos y cajas a medida. Gramajes, ondas, medidas, mínimos y plazos de entrega en la RM.',
  path: '/productos',
  noindex: true, // contenido en BETA, aún en revisión
});

export default function Page() {
  // Gate BETA: sin la variable de entorno (producción) la ruta no existe.
  if (process.env.NEXT_PUBLIC_ENABLE_FICHAS_BETA !== 'true') {
    notFound();
  }

  return (
    <>
      {/* Hero */}
        <section
          className="section-padding"
          style={{ background: theme.gradients.primary, color: 'white', textAlign: 'center' }}
        >
          <div style={{ maxWidth: 820, margin: '0 auto' }}>
            <BetaBadge variant="dark" style={{ marginBottom: 16 }} />
            <p
              style={{
                textTransform: 'uppercase',
                letterSpacing: '0.12em',
                fontSize: 13,
                fontWeight: 700,
                color: theme.colors.accentLight,
                marginBottom: 16,
              }}
            >
              Fichas técnicas
            </p>
            <h1 style={{ fontSize: 'clamp(30px, 5vw, 46px)', fontWeight: 800, marginBottom: 20, lineHeight: 1.1 }}>
              Transparencia técnica en cada producto
            </h1>
            <p style={{ fontSize: 18, lineHeight: 1.7, color: 'rgba(255,255,255,0.85)' }}>
              Gramajes, ondas, medidas, mínimos y plazos reales para que elijas el cartón correcto antes de
              cotizar. Sin letra chica.
            </p>
          </div>
        </section>

        {/* Grid de fichas */}
        <section className="section-padding" style={{ background: '#F5F1EA' }}>
          <div style={{ maxWidth: 1100, margin: '0 auto' }}>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: 28,
              }}
            >
              {productos.map((producto) => (
                <Link
                  key={producto.slug}
                  href={`/productos/${producto.slug}`}
                  className="card"
                  style={{
                    textDecoration: 'none',
                    color: 'inherit',
                    display: 'flex',
                    flexDirection: 'column',
                    overflow: 'hidden',
                  }}
                >
                  <div style={{ position: 'relative', width: '100%', aspectRatio: '4 / 3', background: '#E8DFD3' }}>
                    <Image
                      src={producto.imagen}
                      alt={producto.nombre}
                      fill
                      sizes="(max-width: 700px) 100vw, 33vw"
                      style={{ objectFit: 'cover' }}
                    />
                  </div>
                  <div style={{ padding: 24, display: 'flex', flexDirection: 'column', flex: 1 }}>
                    <h2 style={{ fontSize: 21, fontWeight: 700, color: theme.colors.primary, marginBottom: 10 }}>
                      {producto.nombre}
                    </h2>
                    <p style={{ fontSize: 15, lineHeight: 1.6, color: theme.colors.textMuted, marginBottom: 20 }}>
                      {producto.descripcion}
                    </p>
                    <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
                      <span
                        style={{
                          fontSize: 13,
                          fontWeight: 600,
                          color: theme.colors.text,
                          background: '#E8DFD3',
                          padding: '4px 10px',
                          borderRadius: 6,
                        }}
                      >
                        {producto.minOrder.label}
                      </span>
                      <span style={{ fontSize: 15, fontWeight: 700, color: theme.colors.accentDark }}>
                        Ver ficha técnica →
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

      <SharedFooter />
    </>
  );
}
