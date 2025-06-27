const nodemailer = require('nodemailer');

// Variables de configuración
const supportEmail = process.env.SUPPORT_EMAIL || 'support@taskly.es';
const brandColors = {
  primary: '#1abc9c',      // Verde turquesa principal (color principal)
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
  const year = new Date().getFullYear();
  
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
    /* Estilos que coinciden con la plataforma Taskly */
    body {
      font-family: 'Nunito', 'Segoe UI', sans-serif;
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
      border-radius: 0.25rem;
      overflow: hidden;
      box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
    }
    .email-header {
      background-color: #f8f9fa;
      padding: 1.5rem;
      text-align: center;
      border-bottom: 1px solid #dee2e6;
    }
    .email-body {
      padding: 1.5rem;
    }
    .email-footer {
      background-color: #f8f9fa;
      padding: 1rem 1.5rem;
      text-align: center;
      font-size: 0.875rem;
      color: #6c757d;
      border-top: 1px solid #dee2e6;
    }
    /* Botones consistentes con Bootstrap */
    .btn-primary {
      display: inline-block;
      padding: 0.375rem 0.75rem;
      background-color: ${brandColors.primary};
      color: #ffffff !important;
      text-decoration: none;
      font-weight: 600;
      border-radius: 0.25rem;
      margin: 1rem 0;
      border: none;
      text-align: center;
      transition: all 0.15s ease-in-out;
    }
    .btn-primary:hover {
      background-color: #16a085;
    }
    .btn-danger {
      background-color: #e74c3c;
    }
    .btn-danger:hover {
      background-color: #c0392b;
    }
    /* Tipografía */
    h1, h2, h3 {
      color: #333333;
      font-weight: 700;
      margin-top: 0;
    }
    h1 {
      font-size: 1.75rem;
      margin-bottom: 1rem;
    }
    h2 {
      font-size: 1.5rem;
      margin-bottom: 1rem;
    }
    h3 {
      font-size: 1.25rem;
      margin-bottom: 1rem;
    }
    p {
      margin: 1rem 0;
    }
    .text-center {
      text-align: center;
    }
    .text-small {
      font-size: 0.875rem;
    }
    .text-smaller {
      font-size: 0.75rem;
    }
    /* Enlaces */
    a {
      color: ${brandColors.primary};
      text-decoration: none;
      font-weight: 500;
    }
    a:hover {
      text-decoration: underline;
    }
    /* Componentes */
    .divider {
      border-top: 1px solid #dee2e6;
      margin: 1.5rem 0;
    }
    .info-card {
      background-color: #f8f9fa;
      border: 1px solid #dee2e6;
      border-radius: 0.25rem;
      padding: 1rem;
      margin: 1rem 0;
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
      font-size: 1.5rem;
      font-weight: bold;
      margin-bottom: 1rem;
      box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
    }
    ul {
      padding-left: 1.5rem;
      margin: 1rem 0;
    }
    li {
      margin-bottom: 0.5rem;
    }
    .highlight {
      font-weight: 600;
    }
    /* Responsive */
    @media only screen and (max-width: 480px) {
      .email-container {
        width: 100% !important;
        margin: 0 !important;
        border-radius: 0 !important;
      }
      .email-body {
        padding: 1rem !important;
      }
      h1 {
        font-size: 1.5rem;
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
      <p class="text-smaller">© ${year} Taskly. Todos los derechos reservados.</p>
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
    <h1>¡Bienvenido a Taskly, ${firstName}! 🎉</h1>
    <p>Gracias por unirte a nuestra plataforma. Estamos encantados de tenerte con nosotros y ayudarte a ser más productivo.</p>
    
    <div class="info-card">
      <p><span class="highlight">Datos de acceso:</span></p>
      <p>Email: <span class="highlight">${userEmail}</span></p>
      <p class="text-small">Para iniciar sesión, utiliza la contraseña que creaste durante el proceso de registro.</p>
    </div>
    
    <div class="text-center">
      <a href="${getBaseUrl()}/login" class="btn-primary">Comenzar a usar Taskly</a>
    </div>
    
    <div class="divider"></div>
    
    <h2>Primeros pasos en Taskly</h2>
    <ul>
      <li><span class="highlight">Crea tu primer tablero</span> para organizar tus proyectos</li>
      <li><span class="highlight">Personaliza tus columnas</span> según tu flujo de trabajo</li>
      <li><span class="highlight">Añade tareas y priorízalas</span> para una mejor gestión</li>
    </ul>
    
    <p>Nuestro objetivo es ayudarte a organizar tu trabajo de forma efectiva. Si tienes alguna pregunta o necesitas ayuda para comenzar, simplemente responde a este correo.</p>
    
    <p>¡Te deseamos una excelente experiencia con Taskly!</p>
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
    <h1>🔒 Restablecimiento de contraseña</h1>
    <p>Hemos recibido una solicitud para restablecer la contraseña de tu cuenta en Taskly.</p>
    
    <div class="info-card">
      <p><span class="highlight">⏱️ Importante:</span> Este enlace caducará en <span class="highlight">1 hora</span> por motivos de seguridad.</p>
      <p class="text-small">Si no has solicitado este cambio, puedes ignorar este correo y tu cuenta seguirá segura.</p>
    </div>
    
    <div class="text-center">
      <a href="${link}" class="btn-primary btn-danger">Crear nueva contraseña</a>
    </div>
    
    <div class="divider"></div>
    
    <p>Por tu seguridad:</p>
    <ul>
      <li>Nunca compartimos tu contraseña</li>
      <li>Nunca te pediremos información personal por correo</li>
      <li>Si tienes dudas sobre este mensaje, contáctanos directamente</li>
    </ul>
    
    <p>¿No has solicitado este cambio? Por favor, <a href="mailto:${supportEmail}">contacta con nuestro equipo de seguridad</a> inmediatamente.</p>
  `;
  
  const html = getEmailTemplate(content, '🔒 Solicitud para restablecer tu contraseña en Taskly');
  return await sendMail(to, 'Restablece tu contraseña en Taskly', html);
}

/**
 * Envía email de notificación cuando una cuenta se vincula con Google
 */
async function sendGoogleLinkEmail(to, firstName, userEmail) {
  const content = `
    <h1>✅ Cuenta vinculada con Google</h1>
    <p>Hola ${firstName},</p>
    
    <p>Tu cuenta de Taskly ha sido vinculada correctamente con Google. Esto aumenta la seguridad y simplifica tu experiencia de inicio de sesión.</p>
    
    <div class="info-card">
      <p><span class="highlight">Cuenta Google vinculada:</span> ${userEmail}</p>
      <p class="text-small">A partir de ahora, podrás iniciar sesión en Taskly con un solo clic usando tu cuenta de Google.</p>
    </div>
    
    <div class="text-center">
      <a href="${getBaseUrl()}/login" class="btn-primary">Acceder a Taskly</a>
    </div>
    
    <div class="divider"></div>
    
    <h3>Ventajas de usar Google para iniciar sesión</h3>
    <ul>
      <li><span class="highlight">Mayor seguridad</span> con la autenticación de dos factores de Google</li>
      <li><span class="highlight">Inicio de sesión más rápido</span> sin necesidad de recordar contraseñas</li>
      <li><span class="highlight">Acceso sin fricciones</span> entre dispositivos</li>
    </ul>
    
    <p><strong>¿No has sido tú?</strong> Si no has autorizado esta vinculación, por favor <a href="mailto:${supportEmail}">contacta con nuestro equipo de seguridad</a> inmediatamente para proteger tu cuenta.</p>
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
