const { Resend } = require('resend');
// Configurar Resend usando la API key desde env
const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * Envía un email
 * @param {string} to Destinatario
 * @param {string} subject Asunto
 * @param {string} html Contenido en HTML
 */
async function sendMail(to, subject, html) {
  await resend.emails.send({
    from: process.env.EMAIL_FROM,
    to,
    subject,
    html
  });
}

// Variables de estilo (CSS variables para email)
const supportEmail = process.env.SUPPORT_EMAIL || 'support@taskly.es';

/**
 * Envía email de bienvenida con datos de acceso
 */
async function sendWelcomeEmail(to, firstName, userEmail, originalPassword) {
  // Usa FRONTEND_URL o CLIENT_URL como base para enlaces
  const rawBase = process.env.FRONTEND_URL || process.env.CLIENT_URL || '';
  const baseUrl = rawBase.replace(/\/$/, '');
  const logoUrl = `${baseUrl}/logo-color.svg`;
  const html = `
  <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;padding:20px;background:var(--bs-light);border:1px solid var(--bs-secondary);border-radius:8px;">
    <div style="text-align:center;margin-bottom:20px;">
      <img src="${logoUrl}" alt="Taskly" width="120" />
    </div>
    <h2 style="color:var(--bs-dark);">¡Hola ${firstName}!</h2>
    <p style="color:var(--bs-dark);">Gracias por unirte a <strong>Taskly</strong>. Aquí tienes tus credenciales de acceso:</p>
    <table style="width:100%;border-collapse:collapse;margin:20px 0;">
      <tr><td style="padding:8px;border:1px solid #ddd;"><strong>Email:</strong></td><td style="padding:8px;border:1px solid #ddd;">${userEmail}</td></tr>
      <tr><td style="padding:8px;border:1px solid #ddd;"><strong>Contraseña:</strong></td><td style="padding:8px;border:1px solid #ddd;">${originalPassword}</td></tr>
    </table>
    <p style="text-align:center;margin:30px 0;"><a href="${baseUrl}/" style="display:inline-block;padding:12px 24px;background:var(--bs-primary);color:var(--bs-light);text-decoration:none;border-radius:4px;">Acceder a Taskly</a></p>
    <hr style="border:none;border-top:1px solid #e0e0e0;" />
    <p style="font-size:14px;color:var(--bs-dark);">¿Tienes dudas o necesitas ayuda? Escríbenos a <a href="mailto:${supportEmail}" style="color:var(--bs-primary);">${supportEmail}</a>.</p>
    <p style="font-size:12px;color:var(--bs-secondary);">Si no creaste esta cuenta, ignora este mensaje.</p>
  </div>
  `;
  await sendMail(to, 'Bienvenido a Taskly', html);
}

/**
 * Envía email de recuperación de contraseña con enlace
 */
async function sendPasswordResetEmail(to, resetUrl) {
  // Usa FRONTEND_URL o CLIENT_URL como base para enlaces
  const rawBase = process.env.FRONTEND_URL || process.env.CLIENT_URL || '';
  const baseUrl = rawBase.replace(/\/$/, '');
  const logoUrl = `${baseUrl}/logo-color.svg`;
  const html = `
  <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;padding:20px;background:var(--bs-light);border:1px solid var(--bs-secondary);border-radius:8px;">
    <div style="text-align:center;margin-bottom:20px;">
      <img src="${logoUrl}" alt="Taskly" width="120" />
    </div>
    <h2 style="color:var(--bs-dark);">Restablece tu contraseña</h2>
    <p style="color:var(--bs-dark);">Recibimos una solicitud para cambiar tu contraseña de Taskly.</p>
    <p style="text-align:center;margin:30px 0;"><a href="${resetUrl}" style="display:inline-block;padding:12px 24px;background:var(--bs-danger);color:var(--bs-light);text-decoration:none;border-radius:4px;">Cambiar contraseña</a></p>
    <hr style="border:none;border-top:1px solid #e0e0e0;" />
    <p style="font-size:14px;color:var(--bs-dark);">Si no solicitaste este cambio, ignora este correo o contáctanos en <a href="mailto:${supportEmail}" style="color:var(--bs-primary);">${supportEmail}</a>.</p>
    <p style="font-size:12px;color:var(--bs-secondary);">Este enlace caducará en 1 hora.</p>
  </div>
  `;
  await sendMail(to, 'Recupera tu contraseña en Taskly', html);
}

module.exports = { sendMail, sendWelcomeEmail, sendPasswordResetEmail };
