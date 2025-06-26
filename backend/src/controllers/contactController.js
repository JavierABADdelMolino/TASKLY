const nodemailer = require('nodemailer');

/**
 * @desc    Enviar mensaje de contacto desde el formulario web
 * @route   POST /api/contact
 * @access  Público
 */
exports.sendContactEmail = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    
    // Validación básica de los campos
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ message: 'Por favor, completa todos los campos' });
    }
    
    // Validación de formato de correo electrónico
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Por favor, introduce una dirección de correo válida' });
    }
    
    // Validación de longitud de los campos
    if (name.length < 2 || name.length > 100) {
      return res.status(400).json({ message: 'El nombre debe tener entre 2 y 100 caracteres' });
    }
    
    if (subject.length < 3 || subject.length > 200) {
      return res.status(400).json({ message: 'El asunto debe tener entre 3 y 200 caracteres' });
    }
    
    if (message.length < 10 || message.length > 5000) {
      return res.status(400).json({ message: 'El mensaje debe tener entre 10 y 5000 caracteres' });
    }
    
    // Sanitización básica del mensaje
    const sanitizedMessage = message
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    // Fecha y hora del mensaje
    const now = new Date();
    const dateTime = now.toLocaleString('es-ES', { 
      year: 'numeric', month: 'long', day: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
    
    // Configurar el transporte de correo con Nodemailer
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: parseInt(process.env.EMAIL_PORT, 10),
      secure: process.env.EMAIL_PORT === '465', // true solo para puerto 465, false para otros puertos como 587
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
      }
    });
    
    // Configurar opciones del correo
    const mailOptions = {
      from: `"Taskly - Formulario de Contacto" <${process.env.EMAIL_USER}>`,
      to: process.env.SUPPORT_EMAIL,
      subject: `${name} te ha enviado un mensaje: "${subject}"`,
      replyTo: email,
      text: `
Mensaje de ${name} desde el formulario web
--------------------------------------
Fecha: ${dateTime}
Nombre: ${name}
Email: ${email}
Asunto: ${subject}

MENSAJE:
${message}

--------------------------------------
Para responder directamente, simplemente contesta a este correo.
Este mensaje fue enviado desde el formulario de contacto en taskly.es
`,
      html: `
        <!-- Definimos variables CSS para usar el sistema de diseño del proyecto -->
        <div style="
          /* Estilos generales */
          font-family: 'Segoe UI', Arial, sans-serif; 
          max-width: 650px; 
          margin: 0 auto; 
          padding: 25px; 
          border: 1px solid var(--bs-border-color, #e0e0e0); 
          border-radius: 10px; 
          box-shadow: 0 3px 10px rgba(0,0,0,0.05);
          color: var(--bs-body-color, #212529);
          background-color: var(--bs-body-bg, #ffffff);
        ">
          <div style="text-align: center; margin-bottom: 25px;">
            <img src="${process.env.FRONTEND_URL || process.env.CLIENT_URL}/logo-color.svg" alt="Taskly" width="140" style="margin-bottom: 10px;" />
            <h1 style="color: var(--bs-body-color, #212529); margin: 0; font-size: 24px; font-weight: 600;">Nuevo mensaje de contacto</h1>
          </div>
          
          <div style="
            background-color: var(--bs-tertiary-bg, #f9f9f9); 
            border-left: 4px solid var(--bs-primary, #1abc9c); 
            padding: 15px 20px; 
            margin: 20px 0; 
            border-radius: 5px;
          ">
            <table style="width: 100%; border-collapse: collapse; font-size: 15px;">
              <tr>
                <td style="padding: 8px 0; vertical-align: top; width: 100px;"><strong>De:</strong></td>
                <td style="padding: 8px 0;"><strong>${name}</strong></td>
              </tr>
              <tr>
                <td style="padding: 8px 0; vertical-align: top;"><strong>Email:</strong></td>
                <td style="padding: 8px 0;"><a href="mailto:${email}" style="color: var(--bs-primary, #1abc9c); text-decoration: none;">${email}</a></td>
              </tr>
              <tr>
                <td style="padding: 8px 0; vertical-align: top;"><strong>Fecha:</strong></td>
                <td style="padding: 8px 0;">${dateTime}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; vertical-align: top;"><strong>Asunto:</strong></td>
                <td style="padding: 8px 0;">${subject}</td>
              </tr>
            </table>
          </div>
          
          <div style="margin-top: 25px;">
            <div style="
              background-color: var(--bs-tertiary-bg, #f5f5f5); 
              padding: 20px; 
              border-radius: 6px; 
              margin-top: 10px; 
              white-space: pre-line; 
              line-height: 1.6; 
              font-size: 15px;
            ">
              ${sanitizedMessage.replace(/\n/g, '<br>')}
            </div>
          </div>
          
          <!-- Se eliminó la sección de "Para responder a..." como se solicitó -->
          
          <div style="
            margin-top: 30px; 
            padding-top: 20px; 
            border-top: 1px solid var(--bs-border-color, #e0e0e0); 
            font-size: 13px; 
            color: var(--bs-secondary-color, #777); 
            text-align: center;
          ">
            Este mensaje fue enviado desde el formulario de contacto en 
            <a href="${process.env.FRONTEND_URL || process.env.CLIENT_URL}" style="color: var(--bs-primary, #1abc9c); text-decoration: none; font-weight: 500;">taskly.es</a>
          </div>
        </div>
      `
    };
    
    // Enviar el correo
    await transporter.sendMail(mailOptions);
    
    // Log para depuración
    console.log(`Formulario de contacto: Correo enviado a ${process.env.SUPPORT_EMAIL} desde ${email}`);
    
    // Respuesta exitosa
    res.status(200).json({ 
      success: true,
      message: 'Mensaje enviado con éxito. Gracias por contactarnos.' 
    });
  } catch (error) {
    // Log detallado del error
    console.error('Error al enviar email de contacto:', error);
    
    // Determinar tipo de error para mensaje apropiado
    let errorMessage = 'Ha ocurrido un error al enviar tu mensaje. Por favor, inténtalo más tarde.';
    
    if (error.code === 'ECONNREFUSED' || error.code === 'ETIMEDOUT') {
      errorMessage = 'No se pudo conectar con el servidor de correo. Por favor, inténtalo más tarde.';
    }
    
    if (error.code === 'EAUTH') {
      errorMessage = 'Error de autenticación en el servidor de correo. Contacta al administrador del sitio.';
      // Además, avisa al administrador sobre este problema crítico
      console.error('ERROR CRÍTICO: Falló la autenticación SMTP. Revisa las credenciales.');
    }
    
    res.status(500).json({ 
      success: false,
      message: errorMessage 
    });
  }
};
