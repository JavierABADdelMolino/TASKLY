import React from 'react';
import Layout from '../../components/layout/Layout';

const AboutPage = () => {
  return (
    <Layout>
      <div className="container py-5">
        {/* Sección de héroe */}
        <div className="text-center mb-5">
          <h1 className="display-5 fw-bold mb-3">Nuestra misión</h1>
          <p className="lead mx-auto" style={{ maxWidth: "700px" }}>
            Transformamos la forma en que las personas organizan su trabajo con soluciones 
            inteligentes que aumentan la productividad y reducen el estrés.
          </p>
        </div>
        
        {/* Historia */}
        <div className="row align-items-center mb-5">
          <div className="col-lg-6">
            <h2 className="fw-bold mb-3">La historia de Taskly</h2>
            <p>Taskly nació en 2023 como proyecto final de un estudiante que buscaba crear una herramienta de gestión de tareas realmente intuitiva y adaptada a las necesidades modernas.</p>
            <p>Lo que comenzó como un proyecto académico evolucionó para convertirse en una plataforma completa para la organización personal y profesional, con el objetivo de simplificar la vida digital de sus usuarios.</p>
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
          {[
            {
              title: "Simplicidad",
              icon: "bi-lightning",
              description: "Creemos que las mejores herramientas son aquellas que desaparecen del camino y te permiten centrarte en lo importante."
            },
            {
              title: "Innovación",
              icon: "bi-lightbulb",
              description: "Constantemente buscamos nuevas formas de mejorar la experiencia y añadir funcionalidades útiles que realmente marquen la diferencia."
            },
            {
              title: "Calidad",
              icon: "bi-stars",
              description: "Cada detalle importa. Nos esforzamos por ofrecer un producto pulido, fiable y que supere las expectativas de nuestros usuarios."
            }
          ].map((value, index) => (
            <div key={index} className="col-md-4 mb-4">
              <div className="card h-100 border-0">
                <div className="card-body text-center p-4">
                  <div className="bg-primary bg-gradient text-white fs-2 mb-3 p-3 rounded-circle mx-auto d-flex align-items-center justify-content-center" style={{width: "60px", height: "60px"}}>
                    <i className={`bi ${value.icon}`}></i>
                  </div>
                  <h5 className="card-title mb-2">{value.title}</h5>
                  <p className="card-text">{value.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Call to Action */}
        <div className="text-center p-4 bg-light rounded-3 mt-5">
          <h2 className="fw-bold">¿Listo para organizarte mejor?</h2>
          <p className="lead mb-4">Prueba Taskly gratis y descubre cómo puede ayudarte a mantener tu vida en orden.</p>
          <a href="/" className="btn btn-primary px-4 py-2 me-2">Comenzar ahora</a>
          <a href="/contact" className="btn btn-outline-secondary px-4 py-2">Contactar</a>
        </div>
      </div>
    </Layout>
  );
};

export default AboutPage;
