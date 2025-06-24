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

/**
 * Envía email de bienvenida con datos de acceso
 */
async function sendWelcomeEmail(to, firstName, userEmail, originalPassword) {
  const baseUrl = process.env.FRONTEND_URL.replace(/\/$/, '');
  const logoUrl = `${baseUrl}/logo-color.svg`;
  const html = `
  <div style="font-family:sans-serif;max-width:600px;margin:auto;padding:20px;background:#f9f9f9;border-radius:8px;">
    <div style="text-align:center;margin-bottom:20px;">
      <img src="${logoUrl}" alt="Taskly" width="120" />
    </div>
    <h2 style="color:#333;">¡Hola ${firstName}, bienvenido a Taskly!</h2>
    <p>Tu cuenta ha sido creada con éxito. Estos son tus datos de acceso:</p>
    <ul style="list-style:none;padding:0;">
      <li><strong>Email:</strong> ${userEmail}</li>
      <li><strong>Contraseña:</strong> ${originalPassword}</li>
    </ul>
    <p style="text-align:center;margin-top:30px;">
      <a href="${baseUrl}/" style="display:inline-block;padding:10px 20px;background:#4A90E2;color:#fff;text-decoration:none;border-radius:4px;">Ir a Taskly</a>
    </p>
    <p style="font-size:12px;color:#777;margin-top:30px;">Si no solicitaste este correo, ignóralo.</p>
  </div>
  `;
  await sendMail(to, 'Bienvenido a Taskly', html);
}

/**
 * Envía email de recuperación de contraseña con enlace
 */
async function sendPasswordResetEmail(to, resetUrl) {
  const baseUrl = process.env.FRONTEND_URL.replace(/\/$/, '');
  const logoUrl = `${baseUrl}/logo-color.svg`;
  const html = `
  <div style="font-family:sans-serif;max-width:600px;margin:auto;padding:20px;background:#f9f9f9;border-radius:8px;">
    <div style="text-align:center;margin-bottom:20px;">
      <img src="${logoUrl}" alt="Taskly" width="120" />
    </div>
    <h2 style="color:#333;">Recupera tu contraseña</h2>
    <p>Hemos recibido una solicitud para restablecer tu contraseña.</p>
    <p style="text-align:center;margin:30px 0;">
      <a href="${resetUrl}" style="display:inline-block;padding:10px 20px;background:#E74C3C;color:#fff;text-decoration:none;border-radius:4px;">Restablecer contraseña</a>
    </p>
    <p>Si no solicitaste este cambio, puedes ignorar este correo.</p>
    <p style="font-size:12px;color:#777;margin-top:30px;">El enlace expirará en 1 hora.</p>
  </div>
  `;
  await sendMail(to, 'Recupera tu contraseña en Taskly', html);
}

module.exports = { sendMail, sendWelcomeEmail, sendPasswordResetEmail };
