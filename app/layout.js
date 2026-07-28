import { siteConfig } from '../config/site';
import Script from 'next/script';
import WhatsAppButton from '../components/WhatsAppButton';
import SiteHeader from '../components/sections/SiteHeader';
import JsonLd from '../components/seo/JsonLd';
import { SITE_URL, organizationJsonLd, localBusinessJsonLd } from '../lib/seo';
import { dmSans, plusJakarta } from './fonts';
import './globals.css';
import '../components/landing.css';

const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID;
// Fallback al nombre antiguo de la env var (era el measurement ID de Firebase) para no romper Vercel
const GA_MEASUREMENT_ID =
  process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID;
const GOOGLE_ADS_ID = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID;

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: siteConfig.seo.title,
    template: `%s | ${siteConfig.company.name}`,
  },
  description: siteConfig.seo.description,
  keywords: siteConfig.seo.keywords,
  authors: [{ name: siteConfig.company.name }],
  creator: siteConfig.company.name,
  openGraph: {
    title: siteConfig.seo.title,
    description: siteConfig.seo.description,
    url: SITE_URL,
    siteName: siteConfig.company.name,
    locale: 'es_CL',
    type: 'website',
    images: [siteConfig.seo.ogImage],
  },
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.seo.title,
    description: siteConfig.seo.description,
    images: [siteConfig.seo.ogImage],
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: '/favicon-SF.svg',
    apple: '/favicon-SF.svg',
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#2E6A80',
};

export default function RootLayout({ children }) {
  return (
    <html lang="es" className={`${dmSans.variable} ${plusJakarta.variable}`}>
      <head>
        {/* Google Tag Manager */}
        {GTM_ID && (
          <Script
            id="gtm-script"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
                (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
                new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
                j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
                'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
                })(window,document,'script','dataLayer','${GTM_ID}');
              `,
            }}
          />
        )}

        {/* Google Analytics 4 - gtag.js. Si el contenedor GTM también dispara GA4, eliminar este bloque para no duplicar page_views */}
        {GA_MEASUREMENT_ID && (
          <>
            <Script
              id="ga-script"
              strategy="afterInteractive"
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
            />
            <Script
              id="ga-config"
              strategy="afterInteractive"
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${GA_MEASUREMENT_ID}');
                  ${GOOGLE_ADS_ID ? `gtag('config', '${GOOGLE_ADS_ID}');` : ''}
                `,
              }}
            />
          </>
        )}
      </head>
      <body style={{ margin: 0, padding: 0 }}>
        {/* Google Tag Manager (noscript) */}
        {GTM_ID && (
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
              height="0"
              width="0"
              style={{ display: 'none', visibility: 'hidden' }}
            />
          </noscript>
        )}
        <a href="#main-content" className="skip-link">Saltar al contenido principal</a>
        <SiteHeader />
        <main id="main-content">{children}</main>
        <WhatsAppButton />
        <JsonLd data={organizationJsonLd()} />
        <JsonLd data={localBusinessJsonLd()} />
      </body>
    </html>
  );
}
