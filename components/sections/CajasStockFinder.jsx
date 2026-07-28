'use client'

import { useRouter } from 'next/navigation';
import BoxFinder from '../BoxFinder';

/**
 * Wrapper client de la página /cajas-stock.
 *
 * BoxFinder es un componente cliente (usa estado). Aquí conectamos sus
 * callbacks al flujo de cotización: tanto al elegir una caja sugerida como
 * al pasar a "medida", enviamos al usuario al formulario del home con el
 * producto 'cajas' preseleccionado (/?producto=cajas#cotizar).
 *
 * headingLevel="h2": en /cajas-stock el título del BoxFinder debe ser h2 para
 * no saltar desde el h1 del hero (a11y jerarquía). En el wizard queda como h4.
 */
export default function CajasStockFinder() {
  const router = useRouter();
  const goToQuote = () => router.push('/?producto=cajas#cotizar');

  return <BoxFinder onSelect={goToQuote} onSwitchToCustom={goToQuote} headingLevel="h2" />;
}
