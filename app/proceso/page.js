import Proceso from '../../components/proceso';
import { buildMetadata } from '../../lib/seo';

export const metadata = buildMetadata({
  title: 'Proceso productivo',
  description:
    'Conoce el proceso de fabricación de cartón corrugado de Tecnocarton: desde la materia prima certificada hasta el despacho con flota propia en la Región Metropolitana.',
  path: '/proceso',
});

export default function Page() {
  return <Proceso />;
}
