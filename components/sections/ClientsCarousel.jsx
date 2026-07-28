import Image from 'next/image';
import { clients } from '../../config/site';
import { SectionHeader } from '../ui/section-header';

export default function ClientsCarousel() {
  return (
    <section className="clients-section" style={{ padding: '100px 24px', background: '#F8FAFB', overflow: 'hidden' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <SectionHeader label="Clientes" title="Empresas que confían en nosotros" />

        {/* Carousel container */}
        <div style={{
          position: 'relative',
          width: '100%',
          overflow: 'hidden',
          maskImage: 'linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)'
        }}>
          <div className="clients-carousel" style={{
            display: 'flex',
            gap: 80,
            width: 'max-content'
          }}>
            {/* Duplicate clients for infinite scroll effect */}
            {[...clients, ...clients, ...clients].map((client, i) => (
              <div
                key={i}
                className="client-card"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minWidth: 200,
                  height: 120,
                  padding: '16px 28px',
                  borderRadius: 16,
                  boxShadow: '0 4px 20px rgba(255, 255, 255, 0.08)',
                }}
              >
                <Image
                  src={client.logo}
                  alt={client.name}
                  title={client.name}
                  width={180}
                  height={90}
                  unoptimized={client.logo === '/clientes/tubexa.gif' ? true : undefined}
                  style={{
                    maxWidth: 180,
                    maxHeight: 90,
                    width: 'auto',
                    height: 'auto',
                    objectFit: 'contain'
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
