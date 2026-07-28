/**
 * Dirección editorial del catálogo (/catalogo).
 *
 * Títulos, bajadas y textos de cierre viven acá para que se puedan reescribir
 * sin tocar el JSX de la página. El orden de las secciones y el layout están en
 * app/catalogo/page.js; el estilo, en el bloque "Catálogo" de landing.css.
 *
 * `edicion` sirve para saber qué versión del catálogo circula: un PDF impreso
 * sobrevive meses y sin marca de revisión conviven tres versiones distintas.
 */
export const catalogoCopy = {
  edicion: 'Edición 2026',

  portada: {
    eyebrow: 'Catálogo de productos',
    bajada:
      'Planchas, rollos y cajas a medida para empresas. Acá están los gramajes, ondas, medidas, tolerancias, pedidos mínimos y plazos con los que trabajamos, para que puedas comparar y decidir antes de cotizar.',
    notaLegal:
      'Los datos técnicos de este catálogo son de referencia. Precios, disponibilidad por combinación de gramaje y onda, y plazos se confirman en la cotización.',
  },

  indice: {
    titulo: 'Contenido',
    bajada: 'Este catálogo está pensado para imprimirse o reenviarse completo.',
  },

  ejes: {
    titulo: 'Cómo se define el cartón',
    bajada:
      'Dos ejes independientes: el gramaje (el número) y la onda (la letra). Se eligen por separado.',
  },

  guia: {
    titulo: 'Guía rápida de elección',
    bajada:
      'Parte por el peso que tiene que aguantar tu carga y de ahí sale el gramaje. La onda se decide después, según el uso y si la caja se imprime.',
    notaOnda:
      'Sobre la onda: C amortigua y aguanta apilamiento, B da rigidez y mejor superficie de impresión, y E es microcorrugado para estuches y retail.',
  },

  lineas: {
    titulo: 'Líneas de producto',
    bajada:
      'Tres líneas que cubren desde el embalaje continuo hasta la caja impresa con tu marca. Todo se fabrica en nuestra planta.',
  },

  specs: {
    titulo: 'Especificaciones técnicas',
    gramajes: 'Gramajes y resistencia',
    ondas: 'Tipos de onda',
    tolerancias: 'Tolerancias de fabricación',
    toleranciasBajada:
      'Rangos de referencia con los que trabaja el cartón corrugado. El valor exacto de tu pedido se confirma en la cotización.',
    controles: 'Controles antes de salir de planta',
    notaTolerancias: 'La tolerancia de medida interna aplica a cajas armadas.',
  },

  stock: {
    titulo: 'Cajas de stock',
    bajada:
      'Formatos disponibles para despacho inmediato. Medidas internas útiles en centímetros.',
  },

  aplicaciones: {
    titulo: 'Aplicaciones por industria',
    bajada:
      'Lo que resolvemos en cada rubro. Si el tuyo no está en la lista, escríbenos: el proceso es el mismo.',
  },

  cotizar: {
    titulo: 'Cómo cotizar',
  },
};
