/**
 * Tabla de especificación técnica compartida por las fichas de producto
 * (app/productos/[slug]) y el catálogo (app/catalogo).
 *
 * Server Component: no necesita interactividad.
 *
 * El estilo vive en `.spec-table` (components/landing.css), no en objetos JS,
 * para que el bloque @media print pueda reestilizarla sin `!important`.
 *
 * @param {Array<{key: string, label: string, variant?: 'strong'|'semi'|'muted'|'accent'}>} columns
 * @param {Array<Object>} rows Filas ya listas para imprimir (valores string).
 * @param {string} [rowKey] Campo que identifica cada fila (por defecto, la 1ª columna).
 * @param {number} [minWidth] Ancho mínimo antes de que aparezca el scroll horizontal.
 * @param {boolean} [dense] Variante compacta (catálogo).
 */
export default function SpecTable({ columns, rows, rowKey, minWidth = 560, dense = false }) {
  const idField = rowKey || columns[0]?.key;

  return (
    <div className="spec-table-scroll">
      <table className={`spec-table${dense ? ' spec-table--dense' : ''}`} style={{ minWidth }}>
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col.key} scope="col">
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={row[idField] ?? i}>
              {columns.map((col) => (
                <td key={col.key} className={col.variant ? `is-${col.variant}` : undefined}>
                  {row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
