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
      from: `"Formulario Web Taskly" <${process.env.EMAIL_USER}>`,
      to: process.env.SUPPORT_EMAIL,
      subject: `[Contacto Web] ${subject}`,
      replyTo: email,
      text: `
Nuevo mensaje de contacto en Taskly
--------------------------------------
Fecha: ${dateTime}
Nombre: ${name}
Email: ${email}
Asunto: ${subject}

MENSAJE:
${message}

--------------------------------------
Este mensaje fue enviado desde el formulario de contacto en taskly.es
`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
          <div style="text-align: center; margin-bottom: 20px;">
            <img src="${process.env.FRONTEND_URL || process.env.CLIENT_URL}/logo-color.svg" alt="Taskly" width="120" />
          </div>
          <h2 style="color: #333; border-bottom: 1px solid #e0e0e0; padding-bottom: 10px;">Nuevo mensaje de contacto</h2>
          <p style="color: #666; font-size: 14px;">Recibido el: ${dateTime}</p>
          <div style="background-color: #f9f9f9; border-radius: 5px; padding: 15px; margin: 15px 0;">
            <p><strong>Nombre:</strong> ${name}</p>
            <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
            <p><strong>Asunto:</strong> ${subject}</p>
          </div>
          <div style="margin-top: 20px;">
            <h3 style="color: #333;">Mensaje:</h3>
            <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin-top: 5px; white-space: pre-line;">
              ${sanitizedMessage.replace(/\n/g, '<br>')}
            </div>
          </div>
          <div style="margin-top: 30px; padding-top: 15px; border-top: 1px solid #e0e0e0; font-size: 12px; color: #777; text-align: center;">
            Este mensaje fue enviado desde el formulario de contacto en 
            <a href="${process.env.FRONTEND_URL || process.env.CLIENT_URL}" style="color: #4a6cf7;">taskly.es</a>
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
