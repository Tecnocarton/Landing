import { Resend } from 'resend';
import { siteConfig } from '../../../config/site';

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
    .slice(0, 2000); // Limit length
}

// Security: Validate and sanitize phone number
function sanitizePhone(phone) {
  if (typeof phone !== 'string') return '';
  return phone.replace(/[^\d\s\-+()]/g, '').slice(0, 20);
}

export async function POST(request) {
  try {
    const formData = await request.formData();

    // Security: Sanitize all inputs
    const nombre = sanitizeInput(formData.get('nombre') || '');
    const email = sanitizeInput(formData.get('email') || '').toLowerCase();
    const telefono = sanitizePhone(formData.get('telefono') || '');
    const motivacion = sanitizeInput(formData.get('motivacion') || '');
    const cvFile = formData.get('cv');

    // Server-side validation
    const errors = {};

    if (!nombre || nombre.length < 2) {
      errors.nombre = 'El nombre es requerido';
    }

    if (!email || !EMAIL_REGEX.test(email)) {
      errors.email = 'Email inválido';
    }

    if (!telefono || telefono.replace(/\D/g, '').length < 8) {
      errors.telefono = 'Teléfono debe tener al menos 8 dígitos';
    }

    if (!motivacion || motivacion.length < 20) {
      errors.motivacion = 'La motivación debe tener al menos 20 caracteres';
    }

    if (!cvFile || cvFile.size === 0) {
      errors.cv = 'Debes adjuntar tu CV';
    }

    if (Object.keys(errors).length > 0) {
      return Response.json({ success: false, errors }, { status: 400 });
    }

    // Validar tipo de archivo (solo PDF)
    if (cvFile.type !== 'application/pdf') {
      return Response.json(
        { success: false, message: 'Solo se permiten archivos PDF' },
        { status: 400 }
      );
    }

    // Validar tamaño (máximo 2MB)
    if (cvFile.size > 2 * 1024 * 1024) {
      return Response.json(
        { success: false, message: 'El archivo no puede superar los 2MB' },
        { status: 400 }
      );
    }

    // Convertir archivo a buffer para adjuntar
    const cvBuffer = await cvFile.arrayBuffer();
    const cvBase64 = Buffer.from(cvBuffer);

    // Preparar el email
    const emailSubject = `${siteConfig.recruitment.emailSubjectPrefix} - ${nombre}`;

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
    .motivacion-box { background: white; padding: 16px; border-radius: 8px; border-left: 4px solid #EE7E31; margin-top: 8px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1 style="margin: 0; font-size: 24px;">Nueva Postulación</h1>
      <p style="margin: 8px 0 0; opacity: 0.9;">Recibida desde tecnocarton.cl</p>
    </div>

    <div class="content">
      <div class="section">
        <div class="section-title">Datos del Postulante</div>
        <div class="field">
          <span class="field-label">Nombre:</span>
          <span class="field-value">${nombre}</span>
        </div>
        <div class="field">
          <span class="field-label">Email:</span>
          <span class="field-value"><a href="mailto:${email}">${email}</a></span>
        </div>
        <div class="field">
          <span class="field-label">Teléfono:</span>
          <span class="field-value"><a href="tel:${telefono}">${telefono}</a></span>
        </div>
      </div>

      <div class="section">
        <div class="section-title">Motivación</div>
        <div class="motivacion-box">
          ${motivacion.replace(/\n/g, '<br>')}
        </div>
      </div>

      <div class="section">
        <div class="section-title">CV Adjunto</div>
        <div class="field">
          <span class="field-value">${cvFile.name} (${(cvFile.size / 1024 / 1024).toFixed(2)} MB)</span>
        </div>
      </div>
    </div>

    <div class="footer">
      <p style="margin: 0;">Para responder, simplemente responde a este email o usa el teléfono del postulante.</p>
      <p style="margin: 8px 0 0; opacity: 0.7;">Enviado desde el formulario de postulación de tecnocarton.cl</p>
    </div>
  </div>
</body>
</html>
    `.trim();

    // Enviar email con Resend
    const { data, error } = await resend.emails.send({
      from: 'Tecnocarton Web <postulaciones@tecnocarton.cl>',
      to: [siteConfig.recruitment.recipientEmail],
      replyTo: email,
      subject: emailSubject,
      html: emailHtml,
      attachments: [
        {
          filename: cvFile.name,
          content: cvBase64
        }
      ]
    });

    if (error) {
      console.error('Error al enviar email:', error);
      return Response.json(
        { success: false, message: 'Error al enviar el email' },
        { status: 500 }
      );
    }

    console.log('Postulación enviada exitosamente:', data.id);

    return Response.json({
      success: true,
      message: 'Postulación enviada correctamente',
      emailId: data.id
    });

  } catch (error) {
    console.error('Error al procesar postulación:', error);
    return Response.json(
      { success: false, message: 'Error al procesar la solicitud' },
      { status: 500 }
    );
  }
}
