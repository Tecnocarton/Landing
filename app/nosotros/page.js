import Image from 'next/image';
import Link from 'next/link';
import {
  Award,
  ThumbsUp,
  Recycle,
  Leaf,
  Droplet,
  ShieldCheck,
  Scale,
  Gauge,
  Ruler,
  Layers,
  Truck,
  Sprout,
} from 'lucide-react';
import { siteConfig, sustainability, qualityCertifications, theme } from '../../config/site';
import { buildMetadata, SITE_URL } from '../../lib/seo';
import JsonLd from '../../components/seo/JsonLd';
import SharedFooter from '../../components/shared-footer';

export const metadata = buildMetadata({
  title: 'Nosotros',
  description:
    'Conoce Tecnocarton: fábrica chilena de cartón corrugado con más de 20 años de trayectoria en Padre Hurtado. Integración vertical, controles de calidad propios, flota propia y compromiso con la Ley REP.',
  path: '/nosotros',
});

const c = theme.colors;

// Estadísticas de confianza (fuente: siteConfig.stats).
// Sin cifras de capacidad de producción: se responden por correo, no se publican.
const trustStats = [
  { icon: Award, value: '20+', label: 'Años de trayectoria' },
  { icon: Truck, value: siteConfig.stats.deliveryDays, label: 'Días hábiles de plazo habitual de entrega' },
  { icon: ThumbsUp, value: `${siteConfig.stats.customerSatisfaction}%`, label: 'Satisfacción de clientes' },
];

// Pilares de la integración vertical (capacidad industrial + flexibilidad artesanal)
const verticalPillars = [
  {
    icon: Layers,
    title: 'Producimos, no revendemos',
    desc: 'Controlamos toda la cadena, desde la bobina de papel hasta la caja terminada. Sin intermediarios entre tu pedido y la máquina.',
  },
  {
    icon: Truck,
    title: 'Flota propia',
    desc: 'Despachamos con nuestros propios camiones en la Región Metropolitana, con plazos que coordinamos directamente contigo.',
  },
  {
    icon: Gauge,
    title: 'Volumen y pedidos a medida',
    desc: 'Escalamos a corridas industriales o resolvemos requerimientos puntuales con la misma cercanía de un taller.',
  },
];

// Iconos por control de calidad interno (orden = qualityCertifications de site.js)
const qualityIcons = [Scale, Gauge, Ruler, Recycle];

// Iconos por feature de sustentabilidad (orden = sustainability.features de site.js)
const sustainabilityIcons = {
  recycle: Recycle,
  leaf: Sprout,
  droplet: Droplet,
  'shield-check': ShieldCheck,
};

const aboutPageJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'AboutPage',
  name: `Nosotros | ${siteConfig.company.name}`,
  url: `${SITE_URL}/nosotros`,
  description:
    'Fábrica chilena de cartón corrugado con más de 20 años de trayectoria en Padre Hurtado, Región Metropolitana.',
  mainEntity: {
    '@type': 'Organization',
    name: siteConfig.company.name,
    legalName: siteConfig.company.legalName,
    url: SITE_URL,
    logo: `${SITE_URL}${siteConfig.company.logo}`,
    foundingDate: String(siteConfig.company.foundedYear),
    description: siteConfig.company.description,
    email: siteConfig.contact.email,
    address: {
      '@type': 'PostalAddress',
      streetAddress: siteConfig.address.street,
      addressLocality: siteConfig.address.city,
      addressRegion: siteConfig.address.region,
      addressCountry: 'CL',
    },
  },
};

export default function Page() {
  return (
    <>
      <JsonLd data={aboutPageJsonLd} />

      {/* HERO / HISTORIA */}
        <section
          style={{
            background: theme.gradients.primary,
            color: 'white',
            padding: '96px 24px 80px',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div style={{ maxWidth: 820, margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 1 }}>
            <span
              style={{
                display: 'inline-block',
                background: 'rgba(230,118,53,0.2)',
                color: c.accentLight,
                padding: '8px 16px',
                borderRadius: 20,
                fontSize: 13,
                fontWeight: 600,
                marginBottom: 20,
                border: '1px solid rgba(230,118,53,0.3)',
              }}
            >
              Fábrica chilena desde {siteConfig.company.foundedYear}
            </span>
            <h1 style={{ fontSize: 'clamp(32px, 5vw, 48px)', fontWeight: 900, lineHeight: 1.1, margin: '0 0 20px' }}>
              Más de 20 años fabricando cartón corrugado en Chile
            </h1>
            <p style={{ fontSize: 'clamp(16px, 2.2vw, 19px)', lineHeight: 1.7, color: 'rgba(255,255,255,0.85)', margin: 0 }}>
              Nacimos en {siteConfig.company.foundedYear} en Padre Hurtado, Región Metropolitana, como un taller familiar.
              Hoy operamos con capacidad industrial y seguimos respondiendo pedido a pedido, con el trato directo de
              siempre. Fabricamos el cartón que protege lo que tu operación despacha cada día.
            </p>
          </div>
        </section>

        {/* BARRA DE STATS */}
        <section style={{ background: c.primaryDark, padding: '0 24px' }}>
          <div
            style={{
              maxWidth: 1000,
              margin: '0 auto',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            }}
          >
            {trustStats.map((stat, i) => {
              const Icon = stat.icon;
              return (
                <div
                  key={i}
                  style={{
                    padding: '36px 20px',
                    textAlign: 'center',
                    borderLeft: i === 0 ? 'none' : '1px solid rgba(255,255,255,0.08)',
                  }}
                >
                  <Icon size={28} color={c.accentLight} strokeWidth={2} aria-hidden="true" style={{ marginBottom: 10 }} />
                  <div style={{ fontSize: 'clamp(30px, 4vw, 40px)', fontWeight: 900, color: 'white', lineHeight: 1 }}>
                    {stat.value}
                  </div>
                  <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.65)', marginTop: 8 }}>{stat.label}</div>
                </div>
              );
            })}
          </div>
        </section>

        {/* INTEGRACION VERTICAL / CAPACIDAD + FLEXIBILIDAD */}
        <section className="section-padding" style={{ padding: '80px 24px', background: 'white' }}>
          <div
            style={{
              maxWidth: 1200,
              margin: '0 auto',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: 56,
              alignItems: 'center',
            }}
          >
            <div>
              <span style={{ fontSize: 13, fontWeight: 700, color: '#A8480F', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Nuestra forma de trabajar
              </span>
              <h2 style={{ fontSize: 'clamp(28px, 4vw, 38px)', fontWeight: 800, color: c.text, margin: '12px 0 18px', lineHeight: 1.15 }}>
                Capacidad industrial, flexibilidad artesanal
              </h2>
              <p style={{ fontSize: 17, lineHeight: 1.7, color: c.textMuted, margin: '0 0 28px' }}>
                {siteConfig.company.description} Producimos internamente cada etapa del proceso, lo que nos permite
                sostener volúmenes exigentes sin perder la capacidad de adaptarnos a un requerimiento específico.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                {verticalPillars.map((pillar, i) => {
                  const Icon = pillar.icon;
                  return (
                    <div key={i} style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                      <div
                        style={{
                          flexShrink: 0,
                          width: 44,
                          height: 44,
                          borderRadius: 10,
                          background: 'rgba(27,77,92,0.08)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <Icon size={22} color={c.primary} strokeWidth={2} aria-hidden="true" />
                      </div>
                      <div>
                        <h3 style={{ fontSize: 17, fontWeight: 700, color: c.text, margin: '2px 0 4px' }}>{pillar.title}</h3>
                        <p style={{ fontSize: 15, lineHeight: 1.6, color: c.textMuted, margin: 0 }}>{pillar.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div
              style={{
                position: 'relative',
                width: '100%',
                aspectRatio: '4 / 3',
                borderRadius: 16,
                overflow: 'hidden',
                boxShadow: '0 20px 50px rgba(15,53,64,0.18)',
              }}
            >
              <Image
                src="/proceso.webp"
                alt="Planta de producción de cartón corrugado de Tecnocarton"
                fill
                sizes="(max-width: 900px) 100vw, 50vw"
                style={{ objectFit: 'cover' }}
              />
            </div>
          </div>
        </section>

        {/* SUSTENTABILIDAD (Ley REP) */}
        <section className="section-padding" style={{ padding: '80px 24px', background: '#F5F1EA' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            <div style={{ textAlign: 'center', maxWidth: 720, margin: '0 auto 48px' }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: '#047857', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                {sustainability.subtitle}
              </span>
              <h2 style={{ fontSize: 'clamp(28px, 4vw, 38px)', fontWeight: 800, color: c.text, margin: '12px 0 16px', lineHeight: 1.15 }}>
                {sustainability.title}
              </h2>
              <p style={{ fontSize: 17, lineHeight: 1.7, color: c.textMuted, margin: 0 }}>{sustainability.description}</p>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                gap: 24,
              }}
            >
              {sustainability.features.map((feature, i) => {
                const Icon = sustainabilityIcons[feature.icon] || Leaf;
                return (
                  <div key={i} className="card" style={{ padding: 28, background: 'white' }}>
                    <div
                      style={{
                        width: 52,
                        height: 52,
                        borderRadius: 12,
                        background: 'rgba(5,150,105,0.1)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: 18,
                      }}
                    >
                      <Icon size={26} color="#047857" strokeWidth={2} aria-hidden="true" />
                    </div>
                    <h3 style={{ fontSize: 17, fontWeight: 700, color: c.text, margin: '0 0 8px' }}>{feature.title}</h3>
                    <p style={{ fontSize: 15, lineHeight: 1.6, color: c.textMuted, margin: 0 }}>{feature.desc}</p>
                  </div>
                );
              })}
            </div>

            {/* LEY REP CON DATOS CONCRETOS (F3.3) */}
            <div style={{ maxWidth: 900, margin: '56px auto 0' }}>
              <h3 style={{ fontSize: 'clamp(22px, 3vw, 28px)', fontWeight: 800, color: c.text, margin: '0 0 12px', textAlign: 'center' }}>
                {sustainability.rep.title}
              </h3>
              <p style={{ fontSize: 16.5, lineHeight: 1.7, color: c.textMuted, margin: '0 auto 32px', textAlign: 'center', maxWidth: 700 }}>
                {sustainability.rep.intro}
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: 20 }}>
                {sustainability.rep.claves.map((clave) => (
                  <div
                    key={clave.dato}
                    style={{
                      background: 'white',
                      border: `1px solid ${c.borderLight}`,
                      borderRadius: 12,
                      padding: 24,
                    }}
                  >
                    <div
                      style={{
                        display: 'inline-block',
                        fontSize: 13,
                        fontWeight: 800,
                        color: '#047857',
                        background: 'rgba(5,150,105,0.1)',
                        borderRadius: 999,
                        padding: '5px 12px',
                        marginBottom: 14,
                      }}
                    >
                      {clave.dato}
                    </div>
                    <h4 style={{ fontSize: 16, fontWeight: 700, color: c.text, margin: '0 0 8px' }}>{clave.titulo}</h4>
                    <p style={{ fontSize: 14.5, lineHeight: 1.65, color: c.textMuted, margin: 0 }}>{clave.desc}</p>
                  </div>
                ))}
              </div>

              <div
                style={{
                  marginTop: 24,
                  background: 'white',
                  border: `1px solid ${c.borderLight}`,
                  borderRadius: 12,
                  padding: 28,
                }}
              >
                <h4 style={{ fontSize: 17, fontWeight: 700, color: c.text, margin: '0 0 16px' }}>
                  Por qué el cartón corrugado te facilita cumplir
                </h4>
                <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'grid', gap: 12 }}>
                  {sustainability.rep.ventajas.map((ventaja) => (
                    <li key={ventaja} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                      <Recycle size={20} color="#047857" strokeWidth={2.2} aria-hidden="true" style={{ flexShrink: 0, marginTop: 2 }} />
                      <span style={{ fontSize: 15, lineHeight: 1.6, color: c.textMuted }}>{ventaja}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* CONTROLES DE CALIDAD PROPIOS */}
        <section className="section-padding" style={{ padding: '80px 24px', background: 'white' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            <div style={{ textAlign: 'center', maxWidth: 720, margin: '0 auto 48px' }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: '#A8480F', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Calidad
              </span>
              <h2 style={{ fontSize: 'clamp(28px, 4vw, 38px)', fontWeight: 800, color: c.text, margin: '12px 0 16px', lineHeight: 1.15 }}>
                Controles de calidad propios
              </h2>
              <p style={{ fontSize: 17, lineHeight: 1.7, color: c.textMuted, margin: 0 }}>
                Cada corrida pasa por nuestros propios controles internos antes de salir de planta. Verificamos el
                cartón en cuatro dimensiones para que llegue a tu bodega tal como lo especificaste.
              </p>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                gap: 20,
              }}
            >
              {qualityCertifications.map((item, i) => {
                const Icon = qualityIcons[i] || ShieldCheck;
                return (
                  <div
                    key={i}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 14,
                      padding: '22px 24px',
                      borderRadius: 12,
                      background: '#F5F1EA',
                      border: `1px solid ${c.borderLight}`,
                    }}
                  >
                    <div
                      style={{
                        flexShrink: 0,
                        width: 46,
                        height: 46,
                        borderRadius: 10,
                        background: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Icon size={24} color={c.primary} strokeWidth={2} aria-hidden="true" />
                    </div>
                    <span style={{ fontSize: 16, fontWeight: 600, color: c.text }}>{item.text}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* CTA FINAL */}
        <section style={{ background: theme.gradients.primary, padding: '80px 24px', textAlign: 'center' }}>
          <div style={{ maxWidth: 720, margin: '0 auto' }}>
            <h2 style={{ fontSize: 'clamp(26px, 4vw, 36px)', fontWeight: 800, color: 'white', margin: '0 0 16px', lineHeight: 1.2 }}>
              ¿Necesitas cartón corrugado para tu operación?
            </h2>
            <p style={{ fontSize: 18, lineHeight: 1.6, color: 'rgba(255,255,255,0.85)', margin: '0 0 32px' }}>
              Cuéntanos qué produces o qué despachas y te respondemos con una cotización en {siteConfig.form.responseTime}.
            </p>
            <Link
              href="/#cotizar"
              className="btn-primary"
              style={{ fontSize: 17, padding: '18px 40px', textDecoration: 'none', display: 'inline-block' }}
            >
              Cotizar ahora
            </Link>
          </div>
        </section>

      <SharedFooter />
    </>
  );
}
