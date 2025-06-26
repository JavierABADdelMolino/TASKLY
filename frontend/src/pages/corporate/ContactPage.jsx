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
  
  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Error al enviar el mensaje');
      }
      
      setSubmitted(true);
      setFormData({name: '', email: '', subject: '', message: ''});
    } catch (err) {
      setError(err.message || 'Ha ocurrido un error al enviar el mensaje');
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
                      <div className="text-center py-4">
                        <div className="display-3 text-success mb-3">
                          <i className="bi bi-check-circle"></i>
                        </div>
                        <h3 className="mb-2">¡Mensaje enviado!</h3>
                        <p className="mb-3">Gracias por contactarnos. Te responderemos pronto.</p>
                        <button 
                          className="btn btn-primary" 
                          onClick={() => setSubmitted(false)}
                        >
                          Enviar otro mensaje
                        </button>
                      </div>
                    ) : (
                      <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                          <label htmlFor="name" className="form-label">Nombre</label>
                          <input
                            type="text"
                            className="form-control"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                          />
                        </div>
                        
                        <div className="mb-3">
                          <label htmlFor="email" className="form-label">Email</label>
                          <input
                            type="email"
                            className="form-control"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                          />
                        </div>
                        
                        <div className="mb-3">
                          <label htmlFor="subject" className="form-label">Asunto</label>
                          <input
                            type="text"
                            className="form-control"
                            id="subject"
                            name="subject"
                            value={formData.subject}
                            onChange={handleChange}
                            required
                          />
                        </div>
                        
                        <div className="mb-3">
                          <label htmlFor="message" className="form-label">Mensaje</label>
                          <textarea
                            className="form-control"
                            id="message"
                            name="message"
                            rows="4"
                            value={formData.message}
                            onChange={handleChange}
                            required
                          ></textarea>
                        </div>
                        
                        {error && (
                          <div className="alert alert-danger" role="alert">
                            <i className="bi bi-exclamation-triangle me-2"></i>
                            {error}
                          </div>
                        )}
                        
                        <button 
                          type="submit" 
                          className="btn btn-primary w-100"
                          disabled={submitting}
                        >
                          {submitting ? (
                            <>
                              <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                              Enviando...
                            </>
                          ) : "Enviar mensaje"}
                        </button>
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
