const nodemailer = require('nodemailer');

// Variables de configuración
const supportEmail = process.env.SUPPORT_EMAIL || 'support@taskly.es';
const brandColors = {
  primary: '#1abc9c',      // Verde turquesa principal
  primaryDark: '#16a085',  // Variante oscura del primario
  secondary: '#e74c3c',    // Rojo secundario
  dark: '#333333',         // Texto oscuro
  gray: '#95a5a6',         // Gris neutro
  light: '#f5f7fa',        // Fondo claro
  border: '#dee2e6'        // Color de bordes
};

/**
 * Crea un transporte de nodemailer para enviar correos
 * @returns {object} Transporte de nodemailer configurado
 */
function createTransporter() {
  // En modo desarrollo, si no hay credenciales, usar modo simulado silencioso
  if (process.env.NODE_ENV === 'development' && (!process.env.EMAIL_HOST || !process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD)) {
    return {
      sendMail: (mailOptions) => {
        // Modo silencioso: no mostramos ningún mensaje
        return Promise.resolve({ messageId: 'test-' + Date.now() });
      }
    };
  }

  // Configuración normal para producción o cuando se proporcionan credenciales
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT, 10),
    secure: process.env.EMAIL_PORT === '465', // true para 465, false para otros puertos
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    }
  });
}

/**
 * Envía un email
 * @param {string} to Destinatario
 * @param {string} subject Asunto
 * @param {string} html Contenido en HTML
 * @param {string} replyTo Correo para respuestas (opcional)
 */
async function sendMail(to, subject, html, replyTo = supportEmail) {
  try {
    const transporter = createTransporter();
    
    const emailConfig = {
      from: process.env.EMAIL_FROM || 'Taskly <no-reply@taskly.es>',
      to,
      subject,
      html,
      replyTo: replyTo || supportEmail 
    };

    const result = await transporter.sendMail(emailConfig);
    return result;
  } catch (error) {
    // En desarrollo, no fallamos la aplicación por errores de email
    if (process.env.NODE_ENV === 'development') {
      return { success: false, error: error.message };
    }
    throw error; // Re-lanzamos el error en producción
  }
}

/**
 * Función auxiliar para generar la URL base del frontend con dominio custom
 * @returns {string} URL base del frontend
 */
function getBaseUrl() {
  const fallback = (process.env.FRONTEND_URL || process.env.CLIENT_URL || '').replace(/\/$/, '');
  if (process.env.APP_DOMAIN) {
    try {
      const proto = new URL(process.env.FRONTEND_URL || process.env.CLIENT_URL).protocol;
      return `${proto}//${process.env.APP_DOMAIN}`;
    } catch {
      return fallback;
    }
  }
  return fallback;
}

/**
 * Plantilla base para todos los correos
 * @param {string} content Contenido HTML del cuerpo del correo
 * @param {string} preheader Texto de previsualización (opcional)
 */
function getEmailTemplate(content, preheader = '') {
  const baseUrl = getBaseUrl();
  const logoUrl = `${baseUrl}/logo-240x80-color.png`;
  
  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="color-scheme" content="light">
  <meta name="supported-color-schemes" content="light">
  ${preheader ? `<meta name="description" content="${preheader}">` : ''}
  <title>Taskly</title>
  <style>
    body {
      font-family: 'Nunito', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: #333333;
      margin: 0;
      padding: 0;
      background-color: #f5f7fa;
      -webkit-font-smoothing: antialiased;
    }
    .email-container {
      max-width: 600px;
      margin: 20px auto;
      background: #ffffff;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
    }
    .email-header {
      background-color: #f9f9f9;
      padding: 24px;
      text-align: center;
      border-bottom: 1px solid #eaeaea;
    }
    .email-body {
      padding: 30px;
    }
    .email-footer {
      background-color: #f9f9f9;
      padding: 20px;
      text-align: center;
      font-size: 14px;
      color: #95a5a6;
      border-top: 1px solid #eaeaea;
    }
    .btn-primary {
      display: inline-block;
      padding: 12px 24px;
      background-color: ${brandColors.primary};
      color: #ffffff !important;
      text-decoration: none;
      font-weight: 600;
      border-radius: 4px;
      margin: 16px 0;
      border: none;
      text-align: center;
      transition: all 0.2s ease;
      box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    }
    .btn-primary:hover {
      background-color: ${brandColors.primaryDark};
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
    }
    .btn-danger {
      background-color: ${brandColors.secondary};
    }
    .btn-danger:hover {
      opacity: 0.9;
    }
    h1, h2, h3 {
      color: #333333;
      font-weight: 700;
      margin-top: 0;
    }
    p {
      margin: 16px 0;
    }
    .text-center {
      text-align: center;
    }
    .text-small {
      font-size: 14px;
    }
    .text-smaller {
      font-size: 12px;
    }
    a {
      color: ${brandColors.primary};
      text-decoration: none;
    }
    a:hover {
      text-decoration: underline;
    }
    .divider {
      border-top: 1px solid #eaeaea;
      margin: 24px 0;
    }
    .info-card {
      background-color: #f9f9f9;
      border: 1px solid #eaeaea;
      border-radius: 6px;
      padding: 16px;
      margin: 20px 0;
    }
    .avatar-placeholder {
      width: 64px;
      height: 64px;
      border-radius: 50%;
      background-color: ${brandColors.primary};
      color: white;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      font-size: 24px;
      font-weight: bold;
      margin-bottom: 16px;
    }
    @media only screen and (max-width: 480px) {
      .email-container {
        width: 100% !important;
        margin: 0 !important;
      }
      .email-body {
        padding: 20px !important;
      }
    }
  </style>
</head>
<body>
  <div class="email-container">
    <div class="email-header">
      <img src="${logoUrl}" alt="Taskly" width="240" height="80" style="max-width: 100%;" />
    </div>
    <div class="email-body">
      ${content}
    </div>
    <div class="email-footer">
      <p>¿Necesitas ayuda? <a href="mailto:${supportEmail}">Contáctanos</a></p>
      <p class="text-smaller">© ${new Date().getFullYear()} Taskly. Todos los derechos reservados.</p>
    </div>
  </div>
</body>
</html>`;
}

/**
 * Envía email de bienvenida con datos de acceso
 */
async function sendWelcomeEmail(to, firstName, userEmail) {
  const content = `
    <h1>¡Bienvenido a Taskly, ${firstName}!</h1>
    <p>Gracias por unirte a nuestra plataforma. Estamos encantados de tenerte con nosotros.</p>
    
    <div class="info-card">
      <p><strong>Datos de acceso:</strong></p>
      <p>Email: <strong>${userEmail}</strong></p>
      <p class="text-small">Para iniciar sesión, utiliza la contraseña que creaste durante el proceso de registro.</p>
    </div>
    
    <div class="text-center">
      <a href="${getBaseUrl()}/login" class="btn-primary">Iniciar sesión</a>
    </div>
    
    <div class="divider"></div>
    
    <p>¿Qué puedes hacer ahora?</p>
    <ul>
      <li>Crear nuevos tableros para organizar tus proyectos</li>
      <li>Añadir columnas personalizadas a tus tableros</li>
      <li>Crear tareas y asignarles etiquetas, fechas y prioridades</li>
    </ul>
    
    <p>Si necesitas ayuda para comenzar, no dudes en responder a este correo.</p>
    
    <p>¡Esperamos que disfrutes usando Taskly!</p>
    <p>El equipo de Taskly</p>
  `;
  
  const html = getEmailTemplate(content, `¡Bienvenido a Taskly, ${firstName}! Tu cuenta ha sido creada correctamente.`);
  return await sendMail(to, `¡Bienvenido a Taskly, ${firstName}!`, html);
}

/**
 * Envía email de recuperación de contraseña con enlace
 */
async function sendPasswordResetEmail(to, resetUrl) {
  // Asegura que resetUrl sea absoluto
  const link = resetUrl.startsWith('http') ? resetUrl : `${getBaseUrl()}/reset-password/${resetUrl}`;
  
  const content = `
    <h1>Restablecimiento de contraseña</h1>
    <p>Hemos recibido una solicitud para restablecer la contraseña de tu cuenta en Taskly.</p>
    
    <div class="info-card">
      <p>Por seguridad, este enlace caducará en <strong>1 hora</strong>.</p>
      <p class="text-small">Si no has solicitado este cambio, puedes ignorar este correo.</p>
    </div>
    
    <div class="text-center">
      <a href="${link}" class="btn-primary btn-danger">Restablecer contraseña</a>
    </div>
    
    <div class="divider"></div>
    
    <p>Por motivos de seguridad, nunca compartimos tu contraseña ni te pedimos que la envíes por correo electrónico.</p>
    
    <p>¿No has sido tú? Por favor, <a href="mailto:${supportEmail}">contáctanos</a> inmediatamente.</p>
  `;
  
  const html = getEmailTemplate(content, '🔒 Solicitud para restablecer tu contraseña en Taskly');
  return await sendMail(to, 'Restablece tu contraseña en Taskly', html);
}

/**
 * Envía email de notificación cuando una cuenta se vincula con Google
 */
async function sendGoogleLinkEmail(to, firstName, userEmail) {
  const content = `
    <h1>Cuenta vinculada con Google</h1>
    <p>Hola ${firstName},</p>
    
    <p>Tu cuenta de Taskly ha sido vinculada correctamente con Google.</p>
    
    <div class="info-card">
      <p><strong>Cuenta vinculada:</strong> ${userEmail}</p>
      <p class="text-small">A partir de ahora, podrás iniciar sesión en Taskly usando tu cuenta de Google.</p>
    </div>
    
    <div class="text-center">
      <a href="${getBaseUrl()}/login" class="btn-primary">Iniciar sesión</a>
    </div>
    
    <div class="divider"></div>
    
    <p>Esta vinculación permite un acceso más rápido y seguro a tu cuenta de Taskly.</p>
    
    <p><strong>¿No has sido tú?</strong> Si no has autorizado esta acción, por favor <a href="mailto:${supportEmail}">contáctanos</a> inmediatamente para proteger tu cuenta.</p>
  `;
  
  const html = getEmailTemplate(content, `Tu cuenta de Taskly ha sido vinculada con Google`);
  return await sendMail(to, 'Cuenta vinculada con Google', html);
}

module.exports = { 
  sendMail, 
  sendWelcomeEmail, 
  sendPasswordResetEmail,
  sendGoogleLinkEmail
};
