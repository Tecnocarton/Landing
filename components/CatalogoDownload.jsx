'use client'

import { siteConfig } from '../config/site';
import { trackDescargaCatalogo } from '../lib/analytics';

/**
 * Botón de descarga del catálogo (F3.2).
 *
 * Si el propietario deja un PDF diseñado en /public y lo configura en
 * siteConfig.catalog.pdfUrl, el botón lo descarga directo. Mientras tanto usa
 * el diálogo de impresión del navegador ("Guardar como PDF") sobre esta misma
 * página, que ya trae estilos @media print.
 *
 * En ambos casos emite el evento `descarga_catalogo` a GTM/GA4.
 */
export default function CatalogoDownload({ origen = 'catalogo' }) {
  const pdfUrl = siteConfig.catalog?.pdfUrl;

  if (pdfUrl) {
    return (
      <a
        href={pdfUrl}
        download
        className="btn-primary no-print"
        style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 10 }}
        onClick={() => trackDescargaCatalogo(origen)}
      >
        <DownloadIcon />
        Descargar catálogo en PDF
      </a>
    );
  }

  // Sin PDF diseñado: se usa el diálogo del navegador. El hint sube bastante la
  // calidad del archivo resultante sin escribir una línea de código extra.
  return (
    <div className="no-print">
      <button
        type="button"
        className="btn-primary"
        style={{ display: 'inline-flex', alignItems: 'center', gap: 10 }}
        onClick={() => {
          trackDescargaCatalogo(origen);
          window.print();
        }}
      >
        <DownloadIcon />
        Descargar catálogo en PDF
      </button>
      <p style={{ fontSize: 12, lineHeight: 1.5, margin: '8px 0 0', opacity: 0.75, maxWidth: 280 }}>
        Se abre el diálogo de impresión: elige «Guardar como PDF», tamaño A4 y activa «Gráficos de
        fondo».
      </p>
    </div>
  );
}

function DownloadIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  );
}
