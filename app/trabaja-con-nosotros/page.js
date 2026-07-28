import TrabajaConNosotros from '../../components/trabajaConNosotros';
import { buildMetadata } from '../../lib/seo';

export const metadata = buildMetadata({
  title: 'Trabaja con nosotros',
  description:
    'Súmate al equipo de Tecnocarton, fábrica de cartón corrugado en Padre Hurtado con más de 20 años de trayectoria. Revisa las vacantes disponibles y postula online.',
  path: '/trabaja-con-nosotros',
});

export default function Page() {
  return <TrabajaConNosotros />;
}
