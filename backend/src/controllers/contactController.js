const nodemailer = require('nodemailer');

/**
 * @desc    Enviar mensaje de contacto desde el formulario web
 * @route   POST /api/contact
 * @access  Público
 */
exports.sendContactEmail = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ message: 'Por favor, completa todos los campos' });
    }
    
    // Configurar el transporte de correo
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
      }
    });
    
    // Enviar email
    await transporter.sendMail({
      from: `"Formulario Web Taskly" <${process.env.EMAIL_FROM}>`,
      to: process.env.SUPPORT_EMAIL,
      subject: `[Contacto Web] ${subject}`,
      replyTo: email,
      text: `Nombre: ${name}\nEmail: ${email}\n\n${message}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px;">
          <h2>Nuevo mensaje de contacto</h2>
          <p><strong>Nombre:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Asunto:</strong> ${subject}</p>
          <div style="margin-top: 20px;">
            <strong>Mensaje:</strong>
            <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin-top: 5px;">
              ${message.replace(/\n/g, '<br>')}
            </div>
          </div>
          <p style="color: #777; font-size: 12px; margin-top: 30px;">
            Este mensaje fue enviado desde el formulario de contacto en taskly.es
          </p>
        </div>
      `
    });
    
    res.status(200).json({ message: 'Mensaje enviado con éxito' });
  } catch (error) {
    console.error('Error al enviar email:', error);
    res.status(500).json({ message: 'Error al enviar el mensaje' });
  }
};
