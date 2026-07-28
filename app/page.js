import { Suspense } from 'react';
import Hero from '../components/sections/Hero';
import ValueProps from '../components/sections/ValueProps';
import Products from '../components/sections/Products';
import CaseStudies from '../components/sections/CaseStudies';
import QuoteWizard from '../components/sections/QuoteWizard';
import ClientsCarousel from '../components/sections/ClientsCarousel';
import SharedFooter from '../components/shared-footer';

export default function Home() {
  return (
    <div style={{ background: '#FAFBFC', minHeight: '100vh' }}>
      <Hero />
      <ValueProps />
      <Products />
      <CaseStudies />
      <Suspense fallback={null}>
        <QuoteWizard />
      </Suspense>
      <ClientsCarousel />
      <SharedFooter />
    </div>
  );
}
