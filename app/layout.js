export const metadata = {
  title: 'Tecnocarton - Soluciones de Embalaje en Cartón Corrugado',
  description: 'Fabricantes de cartón corrugado desde 2003. Planchas, rollos, cajas a medida, cajas autoarmables, esquineros y consumibles. Entrega en todo Chile.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body style={{ margin: 0, padding: 0 }}>{children}</body>
    </html>
  )
}
