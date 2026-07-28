# Reestructuración SEM/SEO + landing B2B — Tecnocartón

## Problema

El sitio (y las campañas) capturan principalmente **B2C** (compradores de 1 caja, mudanzas, manualidades, regalo), pero el negocio apuesta a **B2B por volumen: pedidos de 1.000 a 15.000+ cajas**. El tráfico B2C consume presupuesto de Ads, ensucia las cotizaciones y no convierte al ticket que interesa. Objetivo: **calificar por volumen** en la landing y en las campañas para que el B2C rebote temprano y el B2B avance.

El mínimo real de cajas a medida es **1.000 unidades** (planchas 1.500, rollos 500 kg). Esa cifra es el filtro natural.

## 1. Calificación por volumen en la landing (on-page)

La landing debe decir su piso de volumen **antes** de que el usuario cotice, para autoseleccionar:

- **Hero**: dejar explícito "fabricante para empresas · pedidos desde 1.000 hasta 15.000+ unidades por pedido". Quien busca 1 caja entiende de inmediato que no es su lugar.
- **Wizard de cotización**: los rangos de cantidad arrancan en el mínimo B2B (no en "menos de 500"). Un comprador que elige el tramo más bajo ve el mínimo; los tramos suben hasta 15.000+.
- **Fichas de producto**: mínimo de pedido visible arriba, plazos por volumen, "para producción continua / abastecimiento programado".
- **Páginas de industria**: hablan de casos por volumen (exportación, e-commerce con despacho recurrente, líneas de producción), no de compra unitaria.
- **Confianza B2B**: logos de clientes empresa, casos con resultados, flota propia, +20 años fabricando y plazo de entrega comprometido (3 a 5 días hábiles) — señales de proveedor de volumen, no tienda. **No publicar cifras de capacidad de producción** (unidades/mes, toneladas/día): son sensibles para público general y ese tipo de consulta se responde por correo.

> El copy que califica es el mejor "negative keyword": si la página grita "desde 1.000 unidades", el clic B2C rebota solo y baja el costo por lead calificado.

## 2. Estructura SEM (Google Ads)

Separar la cuenta por intención para no mezclar presupuestos:

| Campaña | Ejemplos de ad groups | Intención | Landing destino |
|---|---|---|---|
| **B2B fabricante (core)** | "fábrica de cajas de cartón", "fabricante cartón corrugado", "cajas de cartón por mayor" | Alta, volumen | `/` o `/productos/cajas-a-medida` |
| **B2B por producto** | "planchas de cartón corrugado", "rollos de cartón corrugado", "cajas a medida empresa" | Alta, técnica | ficha `/productos/[slug]` |
| **B2B por industria** | "cajas para e-commerce por volumen", "cajas para exportación fruta", "embalaje para bodega" | Alta, segmentada | `/industrias/[slug]` |
| **Branded** | "tecnocarton", "tecnocartón cajas" | Marca | `/` |

- **Concordancias**: partir con concordancia de frase y exacta; evitar amplia sin auditar términos de búsqueda semanalmente.
- **Copy de anuncios que califica**: incluir "desde 1.000 unidades", "para empresas", "fabricante directo", "cotización por volumen". El precio-piso en el anuncio filtra clics B2C.
- **Extensiones**: sitelinks a /productos, /industrias, /proceso; llamado (WhatsApp/tel de ventas); texto destacado "Pedido mínimo 1.000 u." · "Despacho flota propia RM".
- **Conversiones**: contar como conversión la cotización enviada (ya se registra en Google Sheets + email) y el clic a WhatsApp, no la visita. Idealmente ponderar por tramo de cantidad.

## 3. Lista de keywords negativas (filtrar B2C / no calificado)

Agregar a nivel de **cuenta** (lista compartida "B2C / no calificado"):

**Volumen / unidad chica**
`1 caja`, `una caja`, `pocas cajas`, `caja individual`, `al detalle`, `por unidad`, `unitaria`, `menudeo`, `retail`, `pack de 5`, `pack 10`

**Uso B2C / doméstico**
`mudanza`, `mudanzas`, `trasteo`, `caja de regalo`, `cajas de regalo`, `regalo`, `sorpresa`, `manualidades`, `manualidad`, `escolar`, `maqueta`, `decorar`, `decoración`, `disfraz`, `cumpleaños`, `souvenir`

**Intención de "hacer/gratis/segunda mano"**
`gratis`, `donde consigo cajas gratis`, `cajas gratis`, `usadas`, `segunda mano`, `reciclaje`, `punto limpio`, `como hacer una caja`, `molde`, `plantilla para armar`, `origami`, `DIY`

**Producto fuera de alcance**
`caja fuerte`, `caja de fósforos`, `caja de herramientas`, `caja de madera`, `plástica`, `metálica`, `pizza a domicilio`, `caja registradora`, `caja de ahorros`, `caja los andes`, `caja compensación`

**Consultas informativas de baja intención**
`que es cartón corrugado`, `tipos de cartón wikipedia`, `historia del cartón`, `precio 1 caja`, `comprar caja santiago barata`

> Auditar el informe de **términos de búsqueda** cada semana las primeras 4-6 semanas y mover a negativas todo lo que sea unitario/doméstico. La lista de arriba es el punto de partida, no el final.

## 4. SEO orgánico orientado a B2B

- **Títulos/metadata**: apuntar a intención de proveedor de volumen ("Fábrica de cajas de cartón corrugado para empresas — Chile", "Planchas de cartón corrugado por volumen"). Evitar términos B2C en title/description.
- **Páginas de industria** (ya creadas): son el mejor activo SEO de largo plazo para long-tail B2B ("cajas para exportación de fruta", "embalaje para e-commerce por volumen"). Reforzar cada una con el ángulo de volumen/recurrencia.
- **Fichas técnicas** (ya creadas): capturan búsquedas técnicas (gramajes 12 a 20, ondas C/B/E, resistencia, tolerancias) que hace un jefe de compras, no un consumidor. Ojo con la nomenclatura: el gramaje es solo el número y la onda es la letra; no se escriben pegados.
- **Contenido futuro** (blog): guías tipo "cómo calcular el volumen de cajas para tu línea de producción", "gramaje según peso de carga", "cajas para exportación: requisitos" — todas de intención profesional.
- **Schema**: Organization + LocalBusiness ya emiten señales de empresa/fábrica; Product sin precio (cotización) refuerza el modelo B2B.

## 5. Medición de calificación

- Segmentar los leads por **tramo de cantidad** (el wizard ya lo captura y se registra en la planilla). KPI: % de cotizaciones ≥1.000 unidades.
- Costo por lead **calificado** (≥ mínimo), no por lead bruto.
- Revisar mensualmente términos de búsqueda + tramos de cantidad de las cotizaciones para retroalimentar negativas y copy.

## Resumen de cambios en el sitio que soportan esto

Ver también el plan maestro. Los cambios on-page que acompañan esta estrategia:
1. Hero y wizard califican por volumen (mínimo 1.000, tramos hasta 15.000+).
2. Fichas de producto con mínimo y plazos por volumen.
3. Páginas de industria con ángulo de volumen/recurrencia.
4. Metadata/SEO con lenguaje de proveedor B2B, sin términos B2C.
