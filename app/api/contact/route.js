import { Resend } from 'resend';
import Redis from 'ioredis';
import { siteConfig, products } from '../../../config/site';
import fs from 'fs';
import path from 'path';

const resend = new Resend(process.env.RESEND_API_KEY);

// Security: Email regex validation (hoisted for performance)
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Security: Sanitize input to prevent XSS
function sanitizeInput(str) {
  if (typeof str !== 'string') return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .trim()
    .slice(0, 1000); // Limit length
}

// Security: Validate and sanitize phone number
function sanitizePhone(phone) {
  if (typeof phone !== 'string') return '';
  return phone.replace(/[^\d\s\-+()]/g, '').slice(0, 20);
}

// Conexion a Redis (produccion)
let redis = null;
function getRedisClient() {
  if (!redis && process.env.REDIS_URL) {
    redis = new Redis(process.env.REDIS_URL, {
      maxRetriesPerRequest: 1,
      retryStrategy: () => null // No reintentar si falla
    });
  }
  return redis;
}

// Archivo para persistir el contador cuando Redis no está disponible (desarrollo)
const COUNTER_FILE = path.join(process.cwd(), '.quote-counter');

// Obtener siguiente numero de cotizacion
async function getNextQuoteNumber() {
  // Intentar con Redis primero (produccion)
  try {
    const client = getRedisClient();
    if (client) {
      const quoteNumber = await client.incr('tecnocarton:quote_counter');
      return quoteNumber;
    }
  } catch (error) {
    console.log('Redis no disponible, usando fallback local');
  }

  // Fallback: usar archivo local (desarrollo)
  try {
    let currentNumber = 0;

    if (fs.existsSync(COUNTER_FILE)) {
      const content = fs.readFileSync(COUNTER_FILE, 'utf8').trim();
      currentNumber = parseInt(content, 10) || 0;
    }

    const nextNumber = currentNumber + 1;
    fs.writeFileSync(COUNTER_FILE, nextNumber.toString(), 'utf8');

    return nextNumber;
  } catch (error) {
    console.error('Error al obtener numero de cotizacion:', error);
    // Ultimo fallback: número aleatorio pequeño
    return Math.floor(Math.random() * 9000) + 1000;
  }
}

export async function POST(request) {
  try {
    const body = await request.json();

    // Security: Sanitize all inputs
    const producto = sanitizeInput(body.producto || '');
    const cantidad = sanitizeInput(body.cantidad || '');
    const tiposCarton = Array.isArray(body.tiposCarton)
      ? body.tiposCarton.map(t => sanitizeInput(t)).slice(0, 10)
      : [];
    const formatosRollo = Array.isArray(body.formatosRollo)
      ? body.formatosRollo.map(f => sanitizeInput(f)).slice(0, 10)
      : [];
    const detalle = sanitizeInput(body.detalle || '');
    const empresa = sanitizeInput(body.empresa || '');
    const email = sanitizeInput(body.email || '').toLowerCase();
    const telefono = sanitizePhone(body.telefono || '');

    // Server-side validation
    const errors = {};

    if (!producto) {
      errors.producto = 'Debes seleccionar un producto';
    }

    if (!empresa || empresa.length < 2) {
      errors.empresa = 'El nombre de empresa es requerido';
    }

    if (!email || !EMAIL_REGEX.test(email)) {
      errors.email = 'Email invalido';
    }

    if (!telefono || telefono.replace(/\D/g, '').length < 8) {
      errors.telefono = 'Telefono debe tener al menos 8 digitos';
    }

    if (Object.keys(errors).length > 0) {
      return Response.json({ success: false, errors }, { status: 400 });
    }

    // Buscar nombre del producto
    const productInfo = products.find(p => p.id === producto);
    const productName = productInfo ? productInfo.name : producto;

    // Obtener numero correlativo
    const quoteNumber = await getNextQuoteNumber();

    // Formatear especificaciones segun producto
    let especificaciones = '';
    if (producto === 'planchas' && tiposCarton && tiposCarton.length > 0) {
      especificaciones = `<div class="field">
          <span class="field-label">Tipos de carton:</span>
          <span class="field-value">${tiposCarton.join(', ')}</span>
        </div>`;
    } else if (producto === 'rollos' && formatosRollo && formatosRollo.length > 0) {
      especificaciones = `<div class="field">
          <span class="field-label">Formatos de rollo:</span>
          <span class="field-value">${formatosRollo.map(f => f + ' kg').join(', ')}</span>
        </div>`;
    }

    // Preparar el email
    const emailSubject = `Cotizacion #${quoteNumber} - ${productName} - ${empresa}`;

    const emailHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #2E6A80, #3d8299); color: white; padding: 20px; border-radius: 8px 8px 0 0; }
    .content { background: #f8f9fa; padding: 20px; border: 1px solid #e9ecef; }
    .section { margin-bottom: 20px; }
    .section-title { font-size: 12px; color: #6c757d; text-transform: uppercase; margin-bottom: 8px; font-weight: 600; }
    .field { margin-bottom: 12px; }
    .field-label { font-weight: 600; color: #2E6A80; }
    .field-value { color: #333; }
    .footer { background: #2E6A80; color: white; padding: 15px 20px; border-radius: 0 0 8px 8px; font-size: 12px; }
    .highlight { background: #EE7E31; color: white; padding: 4px 12px; border-radius: 4px; display: inline-block; }
    .detalle-box { background: white; padding: 12px; border-radius: 6px; border-left: 3px solid #EE7E31; margin-top: 8px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1 style="margin: 0; font-size: 24px;">Solicitud de Cotizacion #${quoteNumber}</h1>
      <p style="margin: 8px 0 0; opacity: 0.9;">Recibida desde tecnocarton.cl</p>
    </div>

    <div class="content">
      <div class="section">
        <div class="section-title">Producto Solicitado</div>
        <div class="field">
          <span class="highlight">${productName}</span>
        </div>
        <div class="field">
          <span class="field-label">Cantidad:</span>
          <span class="field-value">${cantidad || 'No especificada'}</span>
        </div>
        ${especificaciones}
        ${detalle ? `<div class="field">
          <span class="field-label">Detalles adicionales:</span>
          <div class="detalle-box">${detalle.replace(/\n/g, '<br>')}</div>
        </div>` : ''}
      </div>

      <div class="section">
        <div class="section-title">Datos del Cliente</div>
        <div class="field">
          <span class="field-label">Empresa/Nombre:</span>
          <span class="field-value">${empresa}</span>
        </div>
        <div class="field">
          <span class="field-label">Email:</span>
          <span class="field-value"><a href="mailto:${email}">${email}</a></span>
        </div>
        <div class="field">
          <span class="field-label">Telefono:</span>
          <span class="field-value"><a href="tel:${telefono}">${telefono}</a></span>
        </div>
      </div>
    </div>

    <div class="footer">
      <p style="margin: 0;">Para responder, simplemente responde a este email o usa el telefono del cliente.</p>
      <p style="margin: 8px 0 0; opacity: 0.7;">Enviado desde el formulario de cotizacion de tecnocarton.cl</p>
    </div>
  </div>
</body>
</html>
    `.trim();

    // Enviar email con Resend
    const { data, error } = await resend.emails.send({
      from: 'Tecnocarton Web <cotizaciones@tecnocarton.cl>',
      to: [siteConfig.form.recipientEmail],
      replyTo: email,
      subject: emailSubject,
      html: emailHtml,
    });

    if (error) {
      console.error('Error al enviar email:', error);
      return Response.json(
        { success: false, message: 'Error al enviar el email' },
        { status: 500 }
      );
    }

    console.log('Email enviado exitosamente:', data.id);

    return Response.json({
      success: true,
      message: 'Cotizacion enviada correctamente',
      emailId: data.id,
      quoteNumber: quoteNumber
    });

  } catch (error) {
    console.error('Error al procesar cotizacion:', error);
    return Response.json(
      { success: false, message: 'Error al procesar la solicitud' },
      { status: 500 }
    );
  }
}
