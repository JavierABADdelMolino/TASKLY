import React, { useState } from 'react';
import Layout from '../../components/layout/Layout';
import { CONTACT_EMAILS } from '../../config/constants';

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
          <div className="col-lg-8 col-md-10">
            <div className="text-center mb-5">
              <h1 className="display-5 fw-bold mb-3">Contacta con nosotros</h1>
              <p className="lead mx-auto" style={{ maxWidth: "700px" }}>
                ¿Tienes preguntas o comentarios? Estamos aquí para ayudarte.
              </p>
            </div>
            
            <div className="card border-0 shadow-sm">
              <div className="card-body p-4 p-md-5">
                {submitted ? (
                  <div className="text-center py-5 my-3">
                    <div className="mb-4" style={{color: "var(--bs-primary)"}}>
                      <i className="bi bi-check-circle-fill display-1"></i>
                    </div>
                    <h3 className="mb-3 fw-bold">¡Mensaje enviado con éxito!</h3>
                    <p className="mb-4 text-muted">
                      Hemos recibido tu mensaje y te responderemos lo antes posible en el correo que nos has proporcionado.
                    </p>
                    <button 
                      className="btn btn-primary px-4 py-2"
                      onClick={() => setSubmitted(false)}
                    >
                      <i className="bi bi-envelope-plus me-2"></i>
                      Enviar otro mensaje
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="row mb-4 align-items-center">
                      <div className="col-lg-8">
                        <h3 className="fw-bold mb-2">Envíanos un mensaje</h3>
                        <p className="text-muted mb-0">Completa el formulario y nos pondremos en contacto contigo pronto.</p>
                      </div>
                      <div className="col-lg-4 text-lg-end mt-3 mt-lg-0">
                        <div className="d-flex align-items-center justify-content-lg-end">
                          <div className="me-3" style={{color: "var(--bs-primary)"}}>
                            <i className="bi bi-envelope-fill fs-4"></i>
                          </div>
                          <div>
                            <a href={`mailto:${CONTACT_EMAILS.SUPPORT}`} className="text-decoration-none">
                              {CONTACT_EMAILS.SUPPORT}
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <hr className="mb-4" />
                    
                    <form onSubmit={handleSubmit} noValidate>
                      <div className="row g-3">
                        <div className="col-md-6 mb-3">
                          <div className="form-floating">
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
                            <label htmlFor="name">Nombre</label>
                            {fieldErrors.name && (
                              <div className="invalid-feedback">
                                {fieldErrors.name}
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <div className="col-md-6 mb-3">
                          <div className="form-floating">
                            <input
                              type="email"
                              className={`form-control ${fieldErrors.email ? 'is-invalid' : ''}`}
                              id="email"
                              name="email"
                              value={formData.email}
                              onChange={handleChange}
                              placeholder="nombre@ejemplo.com"
                              autoComplete="email"
                              required
                            />
                            <label htmlFor="email">Email</label>
                            {fieldErrors.email && (
                              <div className="invalid-feedback">
                                {fieldErrors.email}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="mb-3">
                        <div className="form-floating">
                          <input
                            type="text"
                            className={`form-control ${fieldErrors.subject ? 'is-invalid' : ''}`}
                            id="subject"
                            name="subject"
                            value={formData.subject}
                            onChange={handleChange}
                            placeholder="Asunto"
                            required
                          />
                          <label htmlFor="subject">Asunto</label>
                          {fieldErrors.subject && (
                            <div className="invalid-feedback">
                              {fieldErrors.subject}
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="mb-4">
                        <div className="form-floating">
                          <textarea
                            className={`form-control ${fieldErrors.message ? 'is-invalid' : ''}`}
                            id="message"
                            name="message"
                            style={{ height: "160px" }}
                            value={formData.message}
                            onChange={handleChange}
                            placeholder="Tu mensaje"
                            required
                          ></textarea>
                          <label htmlFor="message">Mensaje</label>
                          {fieldErrors.message && (
                            <div className="invalid-feedback">
                              {fieldErrors.message}
                            </div>
                          )}
                        </div>
                        <div className="d-flex justify-content-end mt-1">
                          <small className="text-muted">
                            {formData.message.length}/5000 caracteres
                          </small>
                        </div>
                      </div>
                      
                      {error && (
                        <div className="alert alert-danger d-flex align-items-center mb-4" role="alert">
                          <i className="bi bi-exclamation-triangle-fill fs-5 me-2"></i>
                          <div>{error}</div>
                        </div>
                      )}
                      
                      <div className="d-grid mb-2">
                        <button 
                          type="submit" 
                          className="btn btn-primary"
                          disabled={submitting}
                        >
                          {submitting ? (
                            <>
                              <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                              Enviando mensaje...
                            </>
                          ) : (
                            <>
                              <i className="bi bi-send me-2"></i>
                              Enviar mensaje
                            </>
                          )}
                        </button>
                      </div>
                      <div className="text-center">
                        <small className="text-muted">
                          Al enviar este formulario, aceptas nuestra <a href="/privacy">Política de Privacidad</a>
                        </small>
                      </div>
                    </form>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ContactPage;
