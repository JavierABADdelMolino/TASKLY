import React, { useState } from 'react';
import Layout from '../../components/layout/Layout';
import { CONTACT_EMAILS, APP_INFO } from '../../config/constants';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});
  
  // Resetear errores al cambiar un campo
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({...formData, [name]: value});
    
    // Limpiar el error específico del campo cuando el usuario empieza a corregirlo
    if (fieldErrors[name]) {
      setFieldErrors(prev => ({...prev, [name]: ''}));
    }
  };
  
  // Validar el formulario antes de enviarlo
  const validateForm = () => {
    const errors = {};
    
    // Validar nombre
    if (!formData.name.trim()) {
      errors.name = 'El nombre es obligatorio';
    } else if (formData.name.length < 2) {
      errors.name = 'El nombre debe tener al menos 2 caracteres';
    } else if (formData.name.length > 100) {
      errors.name = 'El nombre no puede superar los 100 caracteres';
    }
    
    // Validar email con regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      errors.email = 'El email es obligatorio';
    } else if (!emailRegex.test(formData.email)) {
      errors.email = 'Por favor, introduce un email válido';
    }
    
    // Validar asunto
    if (!formData.subject.trim()) {
      errors.subject = 'El asunto es obligatorio';
    } else if (formData.subject.length < 3) {
      errors.subject = 'El asunto debe tener al menos 3 caracteres';
    } else if (formData.subject.length > 200) {
      errors.subject = 'El asunto no puede superar los 200 caracteres';
    }
    
    // Validar mensaje
    if (!formData.message.trim()) {
      errors.message = 'El mensaje es obligatorio';
    } else if (formData.message.length < 10) {
      errors.message = 'El mensaje debe tener al menos 10 caracteres';
    } else if (formData.message.length > 5000) {
      errors.message = 'El mensaje no puede superar los 5000 caracteres';
    }
    
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validar formulario primero
    if (!validateForm()) {
      return;
    }
    
    setSubmitting(true);
    setError(null);
    
    try {
      // Usamos la URL completa de la API desde las variables de entorno
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
      const contactUrl = `${apiUrl}/contact`;
      
      console.log('Enviando formulario a:', contactUrl);
      
      const response = await fetch(contactUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Error al enviar el mensaje');
      }
      
      // Si todo está bien, indicar éxito y resetear el formulario
      setSubmitted(true);
      setFormData({name: '', email: '', subject: '', message: ''});
      
      // Scroll a la parte superior para mostrar el mensaje de éxito
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      setError(err.message || 'Ha ocurrido un error al enviar el mensaje');
      
      // Scroll al mensaje de error
      setTimeout(() => {
        const errorElement = document.querySelector('.alert-danger');
        if (errorElement) {
          errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 100);
    } finally {
      setSubmitting(false);
    }
  };
  
  return (
    <Layout>
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-lg-10">
            <div className="text-center mb-4">
              <h1 className="fw-bold mb-2">Contacta con nosotros</h1>
              <p>¿Tienes preguntas o comentarios? Estamos aquí para ayudarte.</p>
            </div>
            
            <div className="row g-4">
              <div className="col-md-5">
                <div className="card h-100">
                  <div className="card-body p-4">
                    <h3 className="fw-bold mb-3">Información</h3>
                    
                    <div className="d-flex mb-3">
                      <div className="me-3 bg-primary text-white p-2 rounded-circle">
                        <i className="bi bi-envelope"></i>
                      </div>
                      <div>
                        <h5 className="mb-1">Email</h5>
                        <p className="mb-0">
                          <a href={`mailto:${CONTACT_EMAILS.SUPPORT}`} className="text-decoration-none">
                            {CONTACT_EMAILS.SUPPORT}
                          </a>
                        </p>
                      </div>
                    </div>
                    
                    <div className="d-flex mb-3">
                      <div className="me-3 bg-primary text-white p-2 rounded-circle">
                        <i className="bi bi-clock"></i>
                      </div>
                      <div>
                        <h5 className="mb-1">Horario</h5>
                        <p className="mb-0">Lun - Vie, 9:00 - 18:00</p>
                      </div>
                    </div>
                    
                    <hr className="my-3" />
                    
                    <h5 className="mb-2">Síguenos</h5>
                    <div className="d-flex gap-2">
                      <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-muted fs-5">
                        <i className="bi bi-twitter"></i>
                      </a>
                      <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-muted fs-5">
                        <i className="bi bi-linkedin"></i>
                      </a>
                      <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-muted fs-5">
                        <i className="bi bi-github"></i>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="col-md-7">
                <div className="card">
                  <div className="card-body p-4">
                    {submitted ? (
                      <div className="text-center py-5">
                        <div className="display-1 text-success mb-4">
                          <i className="bi bi-check-circle-fill"></i>
                        </div>
                        <h3 className="mb-3 fw-bold">¡Mensaje enviado con éxito!</h3>
                        <p className="mb-4 text-secondary">
                          Gracias por contactar con {APP_INFO.NAME}. Hemos recibido tu mensaje y
                          te responderemos lo antes posible en el correo que nos has proporcionado.
                        </p>
                        <button 
                          className="btn btn-primary btn-lg px-5 py-2"
                          onClick={() => setSubmitted(false)}
                        >
                          <i className="bi bi-envelope-plus me-2"></i>
                          Enviar otro mensaje
                        </button>
                      </div>
                    ) : (
                      <form onSubmit={handleSubmit} noValidate>
                        <h4 className="mb-3 fw-bold">Envíanos un mensaje</h4>
                        
                        <div className="mb-3">
                          <label htmlFor="name" className="form-label">
                            Nombre <span className="text-danger">*</span>
                          </label>
                          <div className="input-group">
                            <span className="input-group-text">
                              <i className="bi bi-person"></i>
                            </span>
                            <input
                              type="text"
                              className={`form-control ${fieldErrors.name ? 'is-invalid' : ''}`}
                              id="name"
                              name="name"
                              value={formData.name}
                              onChange={handleChange}
                              placeholder="Tu nombre"
                              autoComplete="name"
                              required
                            />
                            {fieldErrors.name && (
                              <div className="invalid-feedback">
                                {fieldErrors.name}
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <div className="mb-3">
                          <label htmlFor="email" className="form-label">
                            Email <span className="text-danger">*</span>
                          </label>
                          <div className="input-group">
                            <span className="input-group-text">
                              <i className="bi bi-envelope"></i>
                            </span>
                            <input
                              type="email"
                              className={`form-control ${fieldErrors.email ? 'is-invalid' : ''}`}
                              id="email"
                              name="email"
                              value={formData.email}
                              onChange={handleChange}
                              placeholder="tu.email@ejemplo.com"
                              autoComplete="email"
                              required
                            />
                            {fieldErrors.email && (
                              <div className="invalid-feedback">
                                {fieldErrors.email}
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <div className="mb-3">
                          <label htmlFor="subject" className="form-label">
                            Asunto <span className="text-danger">*</span>
                          </label>
                          <div className="input-group">
                            <span className="input-group-text">
                              <i className="bi bi-chat-left-text"></i>
                            </span>
                            <input
                              type="text"
                              className={`form-control ${fieldErrors.subject ? 'is-invalid' : ''}`}
                              id="subject"
                              name="subject"
                              value={formData.subject}
                              onChange={handleChange}
                              placeholder="¿Sobre qué quieres hablar?"
                              required
                            />
                            {fieldErrors.subject && (
                              <div className="invalid-feedback">
                                {fieldErrors.subject}
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <div className="mb-3">
                          <label htmlFor="message" className="form-label">
                            Mensaje <span className="text-danger">*</span>
                          </label>
                          <div className="input-group">
                            <span className="input-group-text">
                              <i className="bi bi-chat-quote"></i>
                            </span>
                            <textarea
                              className={`form-control ${fieldErrors.message ? 'is-invalid' : ''}`}
                              id="message"
                              name="message"
                              rows="5"
                              value={formData.message}
                              onChange={handleChange}
                              placeholder="Escribe aquí tu mensaje..."
                              required
                            ></textarea>
                            {fieldErrors.message && (
                              <div className="invalid-feedback">
                                {fieldErrors.message}
                              </div>
                            )}
                          </div>
                          <small className="text-muted d-block text-end mt-1">
                            {formData.message.length}/5000 caracteres
                          </small>
                        </div>
                        
                        {error && (
                          <div className="alert alert-danger d-flex align-items-center mt-4" role="alert">
                            <i className="bi bi-exclamation-triangle-fill fs-4 me-2"></i>
                            <div>{error}</div>
                          </div>
                        )}
                        
                        <div className="d-grid mt-4">
                          <button 
                            type="submit" 
                            className="btn btn-primary py-3"
                            disabled={submitting}
                          >
                            {submitting ? (
                              <>
                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                Enviando mensaje...
                              </>
                            ) : (
                              <>
                                <i className="bi bi-send-fill me-2"></i>
                                Enviar mensaje
                              </>
                            )}
                          </button>
                        </div>
                        
                        <div className="text-center mt-3">
                          <small className="text-muted">
                            Al enviar este formulario, aceptas nuestra <a href="/privacy">Política de Privacidad</a>
                          </small>
                        </div>
                      </form>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ContactPage;
