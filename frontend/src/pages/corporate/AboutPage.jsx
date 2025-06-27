import React from 'react';
import Layout from '../../components/layout/Layout';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGithub, faLinkedinIn } from '@fortawesome/free-brands-svg-icons';
import { AUTHOR_LINKS, AUTHOR_INFO } from '../../config/constants';
import { FiArrowRightCircle, FiMessageCircle } from 'react-icons/fi';

const AboutPage = () => {
  return (
    <Layout>
      <div className="container py-5">
        {/* Sección de héroe */}
        <div className="text-center mb-5">
          <h1 className="display-5 fw-bold mb-3">Nosotros</h1>
          <p className="lead mx-auto" style={{ maxWidth: "700px" }}>
            Transformamos la forma en que las personas organizan su trabajo con soluciones 
            inteligentes que aumentan la productividad y reducen el estrés.
          </p>
        </div>
        
        {/* Historia */}
        <div className="row align-items-center mb-5">
          <div className="col-lg-6">
            <h2 className="fw-bold mb-3">La historia de Taskly</h2>
            <p>Taskly nació en 2025 como Trabajo Final de Grado (TFG) en el ciclo de Desarrollo de Aplicaciones Multiplataforma. La idea inicial era crear una herramienta de gestión de tareas intuitiva y moderna que mostrara las capacidades del desarrollador.</p>
            <p>Aunque el plan original era dejarlo como un proyecto de código abierto autoalojable en GitHub, el afán por seguir aprendiendo llevó a afrontar el reto del despliegue completo. Lo que comenzó como un proyecto académico evolucionó hasta convertirse en una plataforma web totalmente funcional, combinando el aprendizaje técnico con una visión práctica para simplificar la organización personal y profesional.</p>
          </div>
          <div className="col-lg-6 text-center">
            <img 
              src="/logo-360x120-color.png" 
              alt="Logo Taskly" 
              className="img-fluid rounded" 
              style={{maxWidth: "80%"}}
            />
          </div>
        </div>
        
        {/* Valores */}
        <div className="row mb-5">
          <div className="col-12 text-center mb-4">
            <h2 className="fw-bold">Nuestros valores</h2>
          </div>
          <div className="col-md-4 mb-4">
            <div className="card h-100 border-0 shadow-sm">
              <div className="card-body text-center p-4">
                <div 
                  style={{
                    backgroundColor: "rgba(var(--bs-primary-rgb), 0.1)", 
                    color: "var(--bs-primary)", 
                    width: "80px", 
                    height: "80px",
                    transition: "all 0.3s ease"
                  }} 
                  className="fs-1 mb-3 p-3 rounded-circle mx-auto d-flex align-items-center justify-content-center"
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "rgba(var(--bs-primary-rgb), 0.2)";
                    e.currentTarget.style.transform = "scale(1.1)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "rgba(var(--bs-primary-rgb), 0.1)";
                    e.currentTarget.style.transform = "scale(1)";
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M11.251.068a.5.5 0 0 1 .227.58L9.677 6.5H13a.5.5 0 0 1 .364.843l-8 8.5a.5.5 0 0 1-.842-.49L6.323 9.5H3a.5.5 0 0 1-.364-.843l8-8.5a.5.5 0 0 1 .615-.09z"/>
                  </svg>
                </div>
                <h5 className="card-title mb-2">Simplicidad</h5>
                <p className="card-text">Creemos que las mejores herramientas son aquellas que desaparecen del camino y te permiten centrarte en lo importante.</p>
              </div>
            </div>
          </div>
          <div className="col-md-4 mb-4">
            <div className="card h-100 border-0 shadow-sm">
              <div className="card-body text-center p-4">
                <div 
                  style={{
                    backgroundColor: "rgba(var(--bs-primary-rgb), 0.1)", 
                    color: "var(--bs-primary)", 
                    width: "80px", 
                    height: "80px",
                    transition: "all 0.3s ease"
                  }} 
                  className="fs-1 mb-3 p-3 rounded-circle mx-auto d-flex align-items-center justify-content-center"
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "rgba(var(--bs-primary-rgb), 0.2)";
                    e.currentTarget.style.transform = "scale(1.1)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "rgba(var(--bs-primary-rgb), 0.1)";
                    e.currentTarget.style.transform = "scale(1)";
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M2 6a6 6 0 1 1 10.174 4.31c-.203.196-.359.4-.453.619l-.762 1.769A.5.5 0 0 1 10.5 13h-5a.5.5 0 0 1-.46-.302l-.761-1.77a1.964 1.964 0 0 0-.453-.618A5.984 5.984 0 0 1 2 6zm3 8.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1l-.224.447a1 1 0 0 1-.894.553H6.618a1 1 0 0 1-.894-.553L5.5 15a.5.5 0 0 1-.5-.5z"/>
                  </svg>
                </div>
                <h5 className="card-title mb-2">Innovación</h5>
                <p className="card-text">Constantemente buscamos nuevas formas de mejorar la experiencia y añadir funcionalidades útiles que realmente marquen la diferencia.</p>
              </div>
            </div>
          </div>
          <div className="col-md-4 mb-4">
            <div className="card h-100 border-0 shadow-sm">
              <div className="card-body text-center p-4">
                <div 
                  style={{
                    backgroundColor: "rgba(var(--bs-primary-rgb), 0.1)", 
                    color: "var(--bs-primary)", 
                    width: "80px", 
                    height: "80px",
                    transition: "all 0.3s ease"
                  }} 
                  className="fs-1 mb-3 p-3 rounded-circle mx-auto d-flex align-items-center justify-content-center"
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "rgba(var(--bs-primary-rgb), 0.2)";
                    e.currentTarget.style.transform = "scale(1.1)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "rgba(var(--bs-primary-rgb), 0.1)";
                    e.currentTarget.style.transform = "scale(1)";
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M2.5.5A.5.5 0 0 1 3 0h10a.5.5 0 0 1 .5.5c0 .538-.012 1.05-.034 1.536a3 3 0 1 1-1.133 5.89c-.79 1.865-1.878 2.777-2.833 3.011v2.173l1.425.356c.194.048.377.135.537.255L13.3 15.1a.5.5 0 0 1-.3.9H3a.5.5 0 0 1-.3-.9l1.838-1.379c.16-.12.343-.207.537-.255L6.5 13.11v-2.173c-.955-.234-2.043-1.146-2.833-3.012a3 3 0 1 1-1.132-5.89A33.076 33.076 0 0 1 2.5.5zm.099 2.54a2 2 0 0 0 .72 3.935c-.333-1.05-.588-2.346-.72-3.935zm10.083 3.935a2 2 0 0 0 .72-3.935c-.133 1.59-.388 2.885-.72 3.935z"/>
                  </svg>
                </div>
                <h5 className="card-title mb-2">Calidad</h5>
                <p className="card-text">Cada detalle importa. Nos esforzamos por ofrecer un producto pulido, fiable y que supere las expectativas de nuestros usuarios.</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Desarrollador */}
        <div className="py-4 border-top border-bottom mb-5">
          <div className="col-12 text-center mb-4">
            <h2 className="fw-bold">Sobre el autor</h2>
          </div>
          <div className="row justify-content-center">
            <div className="col-md-8 col-lg-6">
              <div className="d-flex flex-column align-items-center text-center">
                <img 
                  src={AUTHOR_INFO.PROFILE_IMAGE}
                  alt={AUTHOR_INFO.NAME} 
                  className="rounded-circle mb-3 border border-2 border-primary" 
                  style={{width: "120px", height: "120px", objectFit: "cover"}}
                />
                <h3 className="h4 mb-1">{AUTHOR_INFO.NAME}</h3>
                <p className="text-muted mb-3">{AUTHOR_INFO.ROLE}</p>
                <p className="mb-3">{AUTHOR_INFO.BIO}</p>
                <div className="d-flex justify-content-center gap-4 mt-2">
                  <a href={AUTHOR_LINKS.GITHUB} target="_blank" rel="noopener noreferrer" className="fs-4" style={{color: 'var(--bs-body-color)'}}>
                    <FontAwesomeIcon icon={faGithub} />
                  </a>
                  <a href={AUTHOR_LINKS.LINKEDIN} target="_blank" rel="noopener noreferrer" style={{color: "#0A66C2"}} className="fs-4">
                    <FontAwesomeIcon icon={faLinkedinIn} />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Call to Action */}
        <div className="text-center p-5 bg-primary bg-opacity-10 rounded-4 mt-5 shadow-sm">
          <h2 className="fw-bold">¿Listo para organizarte mejor?</h2>
          <p className="lead mb-4">Prueba Taskly gratis y descubre cómo puede ayudarte a mantener tu vida en orden.</p>
          <div className="d-flex justify-content-center gap-3">
            <a href="/" className="btn btn-primary px-4 py-2" onClick={() => window.scrollTo(0, 0)}>
              <FiArrowRightCircle className="me-2" />
              Comenzar ahora
            </a>
            <a href="/contact" className="btn btn-outline-primary px-4 py-2" onClick={() => window.scrollTo(0, 0)}>
              <FiMessageCircle className="me-2" />
              Contactar
            </a>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AboutPage;
