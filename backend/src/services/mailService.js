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

module.exports = { sendMail };
