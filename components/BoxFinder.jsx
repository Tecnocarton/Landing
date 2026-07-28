'use client'

import React, { useState } from 'react';
import { theme, products } from '../config/site';
import { stockBoxes } from '../config/stockBoxes';
import { recommendBoxes } from '../lib/boxFinder.mjs';

// Pedido mínimo de cajas, desde la fuente única minOrderQty del catálogo de productos.
const MIN_CAJAS = products.find((p) => p.id === 'cajas')?.minOrderQty ?? 0;

const inputStyle = (hasError) => ({
  width: '100%',
  padding: '12px 14px',
  borderRadius: 8,
  border: `2px solid ${hasError ? '#EF4444' : '#E5E7EB'}`,
  background: 'white',
  color: '#374151',
  fontSize: 15,
  fontWeight: 600,
});

const labelStyle = { display: 'block', marginBottom: 6, fontWeight: 600, color: '#374151', fontSize: 14 };

const fmt = (n) => Number(n).toLocaleString('es-CL');

/**
 * Asistente de sugerencia de cajas de stock 12C.
 *
 * Props:
 * - onSelect({ code, dimsProducto, cantidadProductos, unitsPerBox, boxesNeeded, mode })
 *     se llama cuando el usuario elige una caja sugerida.
 * - onSwitchToCustom() cambia al flujo de cotización a medida.
 */
export default function BoxFinder({ onSelect, onSwitchToCustom, headingLevel = 'h4' }) {
  // Nivel de encabezado configurable: 'h4' por defecto (mantiene la jerarquía
  // del wizard, donde cada paso es un h4 y comparte aria-labelledby). En
  // /cajas-stock se monta como 'h2' para no saltar de h1 a h4 (a11y jerarquía).
  const HeadingTag = headingLevel;
  const [dims, setDims] = useState({ largo: '', ancho: '', alto: '', cantidad: '' });
  const [mode, setMode] = useState('multi'); // 'multi' | 'single'
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const update = (key) => (e) => {
    setDims((prev) => ({ ...prev, [key]: e.target.value }));
    setResult(null); // evitar mostrar resultados desactualizados
    setError('');
  };

  const changeMode = (next) => {
    setMode(next);
    setResult(null);
  };

  const handleBuscar = () => {
    const largo = parseFloat(dims.largo);
    const ancho = parseFloat(dims.ancho);
    const alto = parseFloat(dims.alto);
    const cantidad = parseInt(dims.cantidad, 10);

    if (![largo, ancho, alto].every((n) => Number.isFinite(n) && n > 0)) {
      setError('Ingresa largo, ancho y alto válidos (mayores a 0).');
      setResult(null);
      return;
    }
    if (!Number.isFinite(cantidad) || cantidad < 1) {
      setError('Ingresa una cantidad de productos válida.');
      setResult(null);
      return;
    }

    setError('');
    setResult(recommendBoxes({ largo, ancho, alto }, cantidad, stockBoxes, { mode }));
  };

  const handleUsar = (option) => {
    onSelect({
      code: option.box.code,
      dimsProducto: `${dims.largo}×${dims.ancho}×${dims.alto} cm`,
      cantidadProductos: parseInt(dims.cantidad, 10),
      unitsPerBox: option.unitsPerBox,
      boxesNeeded: option.boxesNeeded,
      mode,
    });
  };

  return (
    <div style={{ animation: 'fadeInUp 0.5s ease' }}>
      <HeadingTag id="form-step-title" style={{ fontSize: 20, fontWeight: 700, color: '#2E6A80', marginBottom: 6, textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
        Encuentra tu caja de stock
        <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: '0.05em', color: '#C45A1A', background: 'rgba(230,118,53,0.12)', padding: '2px 8px', borderRadius: 999 }}>BETA</span>
      </HeadingTag>
      <p style={{ textAlign: 'center', color: '#6B7280', fontSize: 14, marginBottom: 24 }}>
        Ingresa las medidas de tu producto y te sugerimos la caja 12C que mejor le acomoda.
      </p>

      {/* Medidas del producto */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))', gap: 12 }}>
        {[
          { key: 'largo', label: 'Largo (cm)' },
          { key: 'ancho', label: 'Ancho (cm)' },
          { key: 'alto', label: 'Alto (cm)' },
          { key: 'cantidad', label: 'Cantidad' },
        ].map((f) => (
          <div key={f.key}>
            <label htmlFor={`bf-${f.key}`} style={labelStyle}>{f.label}</label>
            <input
              id={`bf-${f.key}`}
              type="number"
              min={f.key === 'cantidad' ? 1 : 0}
              step={f.key === 'cantidad' ? 1 : 'any'}
              inputMode={f.key === 'cantidad' ? 'numeric' : 'decimal'}
              placeholder={f.key === 'cantidad' ? 'Ej: 500' : '0'}
              value={dims[f.key]}
              onChange={update(f.key)}
              style={inputStyle(false)}
            />
          </div>
        ))}
      </div>

      {/* Toggle de empaque */}
      <div style={{ marginTop: 18 }}>
        <label style={labelStyle}>¿Cómo se empacan?</label>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {[
            { val: 'multi', label: 'Varios productos por caja' },
            { val: 'single', label: '1 producto por caja' },
          ].map((opt) => {
            const active = mode === opt.val;
            return (
              <button
                key={opt.val}
                type="button"
                onClick={() => changeMode(opt.val)}
                aria-pressed={active}
                style={{
                  flex: '1 1 160px',
                  padding: '10px 14px',
                  borderRadius: 8,
                  border: `2px solid ${active ? theme.colors.accent : '#E5E7EB'}`,
                  background: active ? '#FFF7ED' : 'white',
                  color: active ? theme.colors.accent : theme.colors.textSecondary,
                  fontWeight: 600,
                  fontSize: 14,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      </div>

      {error && (
        <p role="alert" aria-live="assertive" style={{ color: '#EF4444', fontSize: 13, marginTop: 12 }}>{error}</p>
      )}

      <button className="btn-primary" style={{ width: '100%', marginTop: 20 }} onClick={handleBuscar}>
        Ver cajas sugeridas
      </button>

      {/* Resultados */}
      {result && result.fits && (
        <div style={{ marginTop: 24, display: 'grid', gap: 12 }}>
          <div style={{ fontSize: 12, color: '#6B7280', textTransform: 'uppercase', fontWeight: 600, letterSpacing: 0.4 }}>
            Cajas sugeridas
          </div>
          {result.options.map((opt, i) => {
            const b = opt.box;
            const efficiencyPct = Math.round(opt.efficiency * 100);
            const isTop = i === 0;
            return (
              <div
                key={b.code}
                style={{
                  border: `2px solid ${isTop ? theme.colors.accent : '#E5E7EB'}`,
                  background: isTop ? '#FFF7ED' : 'white',
                  borderRadius: 12,
                  padding: 16,
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                      <span style={{ fontSize: 17, fontWeight: 800, color: '#2E6A80' }}>{b.code}</span>
                      {isTop && (
                        <span style={{ fontSize: 11, fontWeight: 700, color: 'white', background: theme.colors.accent, padding: '2px 8px', borderRadius: 999 }}>
                          Recomendada
                        </span>
                      )}
                    </div>
                    <div style={{ fontSize: 13, color: '#6B7280', marginTop: 4 }}>
                      Interior {b.largo}×{b.ancho}×{b.alto} cm · {efficiencyPct}% de aprovechamiento
                    </div>
                  </div>
                  <button
                    type="button"
                    className="btn-primary"
                    style={{ padding: '8px 16px', fontSize: 14 }}
                    onClick={() => handleUsar(opt)}
                  >
                    Usar esta caja
                  </button>
                </div>
                <div style={{ marginTop: 12, display: 'flex', gap: 20, flexWrap: 'wrap', alignItems: 'center' }}>
                  {mode === 'multi' && (
                    <div>
                      <div style={{ fontSize: 22, fontWeight: 800, color: theme.colors.accent }}>≈ {fmt(opt.unitsPerBox)}</div>
                      <div style={{ fontSize: 12, color: '#6B7280' }}>productos por caja</div>
                    </div>
                  )}
                  <div>
                    <div style={{ fontSize: 22, fontWeight: 800, color: '#2E6A80' }}>{fmt(opt.boxesNeeded)}</div>
                    <div style={{ fontSize: 12, color: '#6B7280' }}>{opt.boxesNeeded === 1 ? 'caja necesaria' : 'cajas necesarias'}</div>
                  </div>
                  {/* Sin atajo a WhatsApp acá: el canal se ofrece recién al
                      enviar la cotización, para no saltarse el registro. */}
                </div>
              </div>
            );
          })}

          {/* Nota de pedido mínimo */}
          {MIN_CAJAS > 0 && result.options[0].boxesNeeded < MIN_CAJAS && (
            <p style={{ fontSize: 12, color: '#8E9DA6', margin: 0 }}>
              Nota: el pedido mínimo de cajas es de {fmt(MIN_CAJAS)} unidades.
            </p>
          )}
          <p style={{ fontSize: 12, color: '#8E9DA6', margin: 0 }}>
            Las cantidades son una estimación; nuestro equipo confirma el detalle al cotizar.
          </p>
        </div>
      )}

      {/* Sin calce */}
      {result && !result.fits && (
        <div style={{ marginTop: 24, padding: 16, borderRadius: 12, background: '#F8FAFB', border: '1px solid #E2E8EC' }}>
          <p style={{ margin: 0, color: '#374151', fontWeight: 600 }}>
            Ninguna caja de stock calza tu producto.
          </p>
          <p style={{ margin: '6px 0 14px', color: '#6B7280', fontSize: 14 }}>
            Tu producto supera nuestras medidas de stock 12C. Podemos fabricar una caja a tu medida.
          </p>
          <button type="button" className="btn-primary" style={{ width: '100%' }} onClick={onSwitchToCustom}>
            Cotizar caja a medida
          </button>
        </div>
      )}

      {/* Escape siempre disponible al flujo a medida */}
      <div style={{ textAlign: 'center', marginTop: 20 }}>
        <button
          type="button"
          onClick={onSwitchToCustom}
          style={{ background: 'none', border: 'none', color: theme.colors.primaryLight, fontWeight: 600, fontSize: 14, cursor: 'pointer', textDecoration: 'underline' }}
        >
          ¿Necesitas una medida exacta o especial? Detalla a medida
        </button>
      </div>
    </div>
  );
}
