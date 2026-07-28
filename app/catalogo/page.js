import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { productos, gramajes, ondas, tolerancias, notaResistencia, ejes, notaDisponibilidad } from '../../config/productos';
import { formatGramajes, formatOndas } from '../../lib/specs.mjs';
import { formatHours } from '../../lib/hours.mjs';
import { siteConfig, qualityCertifications } from '../../config/site';
import { stockBoxes } from '../../config/stockBoxes';
import { industrias } from '../../config/industrias';
import { catalogoCopy } from '../../config/catalogo';
import { buildMetadata } from '../../lib/seo';
import SpecTable from '../../components/ui/SpecTable';
import SharedFooter from '../../components/shared-footer';
import CatalogoDownload from '../../components/CatalogoDownload';
import BetaBadge from '../../components/ui/BetaBadge';

// Las cajas de stock solo se listan donde el flujo de stock está activo (BETA),
// igual que /cajas-stock y el enlace del header (ver components/sections/SiteHeader.jsx).
const BOXFINDER_BETA = process.env.NEXT_PUBLIC_ENABLE_BOXFINDER_BETA === 'true';

// El catálogo va junto a las fichas técnicas: mismos datos (gramajes, ondas,
// tolerancias) todavía en revisión, así que comparte el gate BETA.
const FICHAS_BETA = process.env.NEXT_PUBLIC_ENABLE_FICHAS_BETA === 'true';

export const metadata = buildMetadata({
  title: 'Catálogo de productos',
  description:
    'Catálogo de cartón corrugado Tecnocarton: planchas, rollos y cajas a medida. Gramajes, ondas, medidas, tolerancias, mínimos de pedido y plazos. Descárgalo en PDF.',
  path: '/catalogo',
  noindex: true, // contenido en BETA, aún en revisión
});

// Índice del documento. El orden refleja el de las secciones de abajo; sin
// números de página porque el CSS de impresión no puede resolver referencias
// cruzadas en el navegador.
const indice = [
  catalogoCopy.ejes.titulo,
  catalogoCopy.guia.titulo,
  catalogoCopy.lineas.titulo,
  catalogoCopy.specs.titulo,
  ...(BOXFINDER_BETA ? [catalogoCopy.stock.titulo] : []),
  catalogoCopy.aplicaciones.titulo,
  catalogoCopy.cotizar.titulo,
];

function BloqueContacto({ variant = 'cover' }) {
  const claseValor = variant === 'cover' ? 'cat-contact__value' : 'cat-contact__value cat-contact__value--ink';
  return (
    <div className="cat-contact">
      <div>
        <strong>{siteConfig.company.legalName}</strong>
        <span className={claseValor}>{siteConfig.address.full}</span>
      </div>
      <div>
        <strong>Contacto</strong>
        <span className={claseValor}>
          {siteConfig.contact.email}
          <br />
          tecnocarton.cl
          <br />
          WhatsApp {siteConfig.contact.whatsapp}
        </span>
      </div>
      <div>
        <strong>Atención</strong>
        <span className={claseValor}>
          {formatHours(siteConfig.hours).map((tramo) => (
            <span key={tramo} style={{ display: 'block' }}>
              {tramo}
            </span>
          ))}
        </span>
      </div>
    </div>
  );
}

export default function Page() {
  // Gate BETA: sin la variable de entorno (producción) la ruta no existe.
  if (!FICHAS_BETA) notFound();

  return (
    <>
      <div className="cat-sheet">
        {/* ── Hoja 1 · PORTADA ─────────────────────────────────────────────── */}
        <section className="cat-cover">
          <div className="cat-wrap">
            <BetaBadge variant="dark" style={{ marginBottom: 14 }} />
            <p className="cat-cover__eyebrow">{catalogoCopy.portada.eyebrow}</p>
            <h1 className="cat-cover__title">
              Cartón corrugado fabricado en Chile desde {siteConfig.company.foundedYear}
            </h1>
            <p className="cat-cover__lead">{catalogoCopy.portada.bajada}</p>

            <div className="no-print cat-cover__actions">
              <CatalogoDownload origen="catalogo" />
              <Link href="/#cotizar" className="btn-secondary btn-secondary--on-dark" style={{ textDecoration: 'none' }}>
                Solicitar cotización
              </Link>
            </div>

            {/* En papel este bloque reemplaza a los botones */}
            <BloqueContacto />
            <p className="cat-cover__edicion">{catalogoCopy.edicion}</p>
          </div>
        </section>

        {/* ── Índice · solo en papel ───────────────────────────────────────── */}
        <section className="cat-section print-only">
          <div className="cat-wrap">
            <h2 className="cat-h2">{catalogoCopy.indice.titulo}</h2>
            <p className="cat-lead">{catalogoCopy.indice.bajada}</p>
            <ol className="cat-indice">
              {indice.map((titulo) => (
                <li key={titulo}>{titulo}</li>
              ))}
            </ol>
            <p className="cat-nota">{catalogoCopy.portada.notaLegal}</p>
          </div>
        </section>

        {/* ── Los dos ejes ─────────────────────────────────────────────────── */}
        <section className="cat-section">
          <div className="cat-wrap">
            <h2 className="cat-h2">{catalogoCopy.ejes.titulo}</h2>
            <p className="cat-lead">{catalogoCopy.ejes.bajada}</p>
            <div className="cat-ejes print-block">
              {ejes.map((eje) => (
                <div key={eje.titulo} className="cat-eje">
                  <h3>{eje.titulo}</h3>
                  <p>{eje.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Guía de elección: parte por el peso, no por el gramaje ───────── */}
        <section className="cat-section cat-section--alt">
          <div className="cat-wrap">
            <div className="spec-group">
              <h2 className="cat-h2">{catalogoCopy.guia.titulo}</h2>
              <p className="cat-lead">{catalogoCopy.guia.bajada}</p>
              <SpecTable
                dense
                rowKey="gramaje"
                minWidth={480}
                columns={[
                  { key: 'resistencia', label: 'Si tu carga pesa…', variant: 'strong' },
                  { key: 'gramaje', label: 'Gramaje sugerido', variant: 'accent' },
                  { key: 'weight', label: 'Peso del papel' },
                  { key: 'use', label: 'Uso típico', variant: 'muted' },
                ]}
                rows={gramajes}
              />
              <p className="spec-note">{catalogoCopy.guia.notaOnda}</p>
            </div>
          </div>
        </section>

        {/* ── Líneas de producto ───────────────────────────────────────────── */}
        <section className="cat-section print-page-break">
          <div className="cat-wrap">
            <h2 className="cat-h2">{catalogoCopy.lineas.titulo}</h2>
            <p className="cat-lead">
              {catalogoCopy.lineas.bajada} Planta en {siteConfig.address.city}.
            </p>

            <div className="cat-productos">
              {productos.map((producto, i) => (
                <article key={producto.slug} className="cat-producto print-block">
                  <div className="cat-producto__img">
                    <Image
                      src={producto.imagen}
                      alt={producto.nombre}
                      fill
                      sizes="(max-width: 700px) 100vw, 240px"
                      style={{ objectFit: 'cover' }}
                      loading={i === 0 ? 'eager' : 'lazy'}
                    />
                  </div>

                  <div className="cat-producto__body">
                    <h3>{producto.nombre}</h3>
                    <p className="cat-producto__copy">{producto.heroCopy}</p>

                    <dl className="cat-dl">
                      {[
                        { label: 'Pedido mínimo', value: producto.minOrder.label },
                        { label: 'Plazo de entrega', value: producto.plazos.normal },
                        { label: 'Gramajes', value: formatGramajes(producto.specs.gramajes) },
                        { label: 'Ondas', value: formatOndas(producto.specs.ondas) },
                      ].map((item) => (
                        <div key={item.label}>
                          <dt>{item.label}</dt>
                          <dd>{item.value}</dd>
                        </div>
                      ))}
                    </dl>

                    <p className="cat-producto__medidas">
                      <strong>Medidas: </strong>
                      {producto.medidasInfo}
                    </p>

                    <div className="cat-chips">
                      {producto.usos.map((uso) => (
                        <span key={uso} className="cat-chip">
                          {uso}
                        </span>
                      ))}
                    </div>

                    <Link href={`/productos/${producto.slug}`} className="no-print cat-link">
                      Ver ficha técnica completa →
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ── Especificaciones técnicas ────────────────────────────────────── */}
        <section className="cat-section cat-section--alt print-page-break">
          <div className="cat-wrap">
            <h2 className="cat-h2">{catalogoCopy.specs.titulo}</h2>

            <div className="spec-group">
              <h3 className="cat-h3">{catalogoCopy.specs.gramajes}</h3>
              <SpecTable
                dense
                rowKey="gramaje"
                columns={[
                  { key: 'gramaje', label: 'Gramaje', variant: 'strong' },
                  { key: 'weight', label: 'Peso aproximado' },
                  { key: 'resistencia', label: 'Resistencia' },
                  { key: 'use', label: 'Uso recomendado', variant: 'muted' },
                ]}
                rows={gramajes}
              />
              <p className="spec-note">{notaResistencia}</p>
            </div>

            {/* Las ondas van con la misma tabla y el mismo peso visual que los
                gramajes: son un eje, no una nota al pie. */}
            <div className="spec-group">
              <h3 className="cat-h3">{catalogoCopy.specs.ondas}</h3>
              <SpecTable
                dense
                rowKey="onda"
                minWidth={420}
                columns={[
                  { key: 'nombre', label: 'Onda', variant: 'strong' },
                  { key: 'altura', label: 'Espesor aproximado', variant: 'accent' },
                  { key: 'uso', label: 'Cuándo conviene', variant: 'muted' },
                ]}
                rows={ondas.map((o) => ({ ...o, nombre: `Onda ${o.onda}` }))}
              />
              <div className="spec-callout print-block">
                <p className="spec-callout__title">Disponibilidad por combinación</p>
                <p>
                  {notaDisponibilidad} Respondemos en {siteConfig.form.responseTime}.
                </p>
              </div>
            </div>

            <div className="spec-group">
              <h3 className="cat-h3">{catalogoCopy.specs.tolerancias}</h3>
              <p className="cat-lead">{catalogoCopy.specs.toleranciasBajada}</p>
              <SpecTable
                dense
                rowKey="parametro"
                columns={[
                  { key: 'parametro', label: 'Parámetro', variant: 'semi' },
                  { key: 'valor', label: 'Tolerancia', variant: 'accent' },
                  { key: 'nota', label: 'Detalle', variant: 'muted' },
                ]}
                rows={tolerancias}
              />
              <p className="spec-note">{catalogoCopy.specs.notaTolerancias}</p>
            </div>

            <div className="cat-panel print-block">
              <h3 className="cat-h3">{catalogoCopy.specs.controles}</h3>
              <ul className="cat-lista">
                {qualityCertifications.map((item) => (
                  <li key={item.text}>{item.text}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* ── Cajas de stock (solo con el flujo de stock activo) ───────────── */}
        {BOXFINDER_BETA && (
          <section className="cat-section print-page-break">
            <div className="cat-wrap">
              <div className="spec-group">
                <h2 className="cat-h2">{catalogoCopy.stock.titulo}</h2>
                <p className="cat-lead">
                  {catalogoCopy.stock.bajada} El código es un SKU: el <strong>12</strong> es el gramaje, la{' '}
                  <strong>C</strong> es la onda y el resto son las medidas. No es la forma de nombrar el gramaje, que se
                  escribe solo con el número.
                </p>
                <SpecTable
                  dense
                  rowKey="code"
                  minWidth={420}
                  columns={[
                    { key: 'code', label: 'Código', variant: 'strong' },
                    { key: 'largoCm', label: 'Largo' },
                    { key: 'anchoCm', label: 'Ancho' },
                    { key: 'altoCm', label: 'Alto' },
                  ]}
                  rows={stockBoxes.map((box) => ({
                    ...box,
                    largoCm: `${box.largo} cm`,
                    anchoCm: `${box.ancho} cm`,
                    altoCm: `${box.alto} cm`,
                  }))}
                />
              </div>
            </div>
          </section>
        )}

        {/* ── Aplicaciones por industria ───────────────────────────────────── */}
        <section className="cat-section cat-section--alt print-page-break">
          <div className="cat-wrap">
            <h2 className="cat-h2">{catalogoCopy.aplicaciones.titulo}</h2>
            <p className="cat-lead">{catalogoCopy.aplicaciones.bajada}</p>
            <div className="cat-industrias">
              {industrias.map((industria) => (
                <div key={industria.slug} className="cat-industria print-block">
                  <h3>{industria.nombre}</h3>
                  <ul className="cat-lista">
                    {industria.soluciones.slice(0, 2).map((sol) => (
                      <li key={sol}>{sol}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Cómo cotizar + cierre ────────────────────────────────────────── */}
        <section className="cat-section print-page-break">
          <div className="cat-wrap">
            <h2 className="cat-h2">{catalogoCopy.cotizar.titulo}</h2>
            <ol className="cat-pasos">
              <li>Define el producto y la cantidad estimada (respetando el pedido mínimo de cada línea).</li>
              <li>Ten a mano las medidas internas útiles, el gramaje y la onda, o el peso de lo que vas a embalar.</li>
              <li>
                Envía tu solicitud en tecnocarton.cl o escribe a {siteConfig.contact.email}. Respondemos en{' '}
                {siteConfig.form.responseTime}.
              </li>
            </ol>

            <div className="no-print cat-cover__actions" style={{ marginTop: 28 }}>
              <Link href="/#cotizar" className="btn-primary" style={{ textDecoration: 'none' }}>
                Solicitar cotización
              </Link>
              <CatalogoDownload origen="catalogo_pie" />
            </div>

            {/* Cierre solo en papel: una hoja suelta fotocopiada tiene que poder
                volver a nosotros. */}
            <div className="print-only cat-cierre">
              <BloqueContacto variant="ink" />
              <p className="cat-nota">
                {catalogoCopy.portada.notaLegal} {catalogoCopy.edicion}.
              </p>
            </div>
          </div>
        </section>
      </div>

      <SharedFooter />
    </>
  );
}
