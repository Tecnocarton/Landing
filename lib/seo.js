import { siteConfig } from '../config/site';
import { openingHoursSpecification } from './hours.mjs';

export const SITE_URL = 'https://tecnocarton.cl';

/**
 * Metadata por página. Todo fluye desde config/site.js;
 * title se compone con el template definido en app/layout.js.
 *
 * `noindex` es para el contenido en BETA (fichas técnicas y catálogo): aunque el
 * gate de entorno ya devuelve notFound() en producción, el flag evita que una
 * preview con la variable activa termine indexada mientras está en revisión.
 */
export function buildMetadata({ title, description, path = '/', noindex = false } = {}) {
  const resolvedTitle = title || siteConfig.seo.title;
  const resolvedDescription = description || siteConfig.seo.description;
  const url = path === '/' ? SITE_URL : `${SITE_URL}${path}`;

  return {
    title: resolvedTitle,
    description: resolvedDescription,
    alternates: { canonical: url },
    ...(noindex ? { robots: { index: false, follow: false } } : {}),
    openGraph: {
      title: resolvedTitle,
      description: resolvedDescription,
      url,
      siteName: siteConfig.company.name,
      locale: 'es_CL',
      type: 'website',
      images: [siteConfig.seo.ogImage],
    },
    twitter: {
      card: 'summary_large_image',
      title: resolvedTitle,
      description: resolvedDescription,
      images: [siteConfig.seo.ogImage],
    },
  };
}

export function organizationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: siteConfig.company.name,
    legalName: siteConfig.company.legalName,
    url: SITE_URL,
    logo: `${SITE_URL}${siteConfig.company.logo}`,
    foundingDate: String(siteConfig.company.foundedYear),
    email: siteConfig.contact.email,
    sameAs: [siteConfig.social.linkedin].filter(Boolean),
    // Sin `telephone`: el canal telefónico es solo WhatsApp y no se publica
    // como número de contacto (ver config/site.js `contact`).
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'sales',
      email: siteConfig.contact.email,
      availableLanguage: 'es',
    },
  };
}

export function localBusinessJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: siteConfig.company.name,
    description: siteConfig.company.description,
    url: SITE_URL,
    image: `${SITE_URL}${siteConfig.seo.ogImage}`,
    email: siteConfig.contact.email,
    foundingDate: String(siteConfig.company.foundedYear),
    address: {
      '@type': 'PostalAddress',
      streetAddress: siteConfig.address.street,
      addressLocality: siteConfig.address.city,
      addressRegion: siteConfig.address.region,
      addressCountry: 'CL',
    },
    openingHoursSpecification: openingHoursSpecification(siteConfig.hours),
    sameAs: [siteConfig.social.linkedin].filter(Boolean),
  };
}
