// src/pages/Home.jsx
import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/layout/Layout';
import { useTheme } from '../context/ThemeContext';
import { FiCheckSquare, FiClock, FiZap, FiSliders, FiCloud, FiArrowRightCircle, FiInfo } from 'react-icons/fi';
import { RiBrainLine } from 'react-icons/ri';
import { Carousel } from 'react-bootstrap';

const Home = () => {
  // Capturar token de URL para reset
  const { token } = useParams();
  const { user } = useAuth();
  const { theme } = useTheme();
  const navigate = useNavigate();
  
  // Estilos personalizados para el carrusel
  const carouselStyles = {
    iconFilter: theme === 'dark' ? 'invert(1) brightness(100%)' : 'none'
  };

  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  useEffect(() => {
    // En caso de token de reset, abrir modal correspondiente
    if (token) {
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent('openAuthModal', { detail: 'reset' }));
      }, 100);
    }
  }, [token]);

  return (
    <Layout>
      {/* Añadir estilo para flechas del carrusel */}
      <style jsx="true">{`
        .carousel-control-prev-icon,
        .carousel-control-next-icon {
          filter: ${carouselStyles.iconFilter};
        }
      `}</style>

      {/* Hero Carousel */}
      <Carousel
        interval={4000}
        controls
        className={`home-hero carousel-controls ${theme === 'dark' ? 'carousel-light-controls' : 'carousel-light-controls'}`}
      >
        <Carousel.Item
          className="text-center"
          style={{ backgroundColor: 'var(--bs-body-bg)', padding: '8rem 0', minHeight: '60vh' }}
        >
          <Carousel.Caption
            className={`${theme === 'dark' ? 'text-light' : 'text-dark'}`}
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              textAlign: 'center',
              width: '100%',
            }}
          >
            <img
              src={`${process.env.PUBLIC_URL}/logo-color.svg`}
              alt="Taskly"
              style={{ height: '80px' }}
            />
            <h1 className="display-4 fw-bold mt-3 text-center">Organiza tus tareas de forma sencilla</h1>
            <p className="lead text-center">Gestiona proyectos, plazos y prioridades al instante.</p>
          </Carousel.Caption>
        </Carousel.Item>
        <Carousel.Item
          className="text-center"
          style={{ backgroundColor: 'var(--bs-body-bg)', padding: '6rem 0', minHeight: '60vh' }}
        >
          <Carousel.Caption
            className={`${theme === 'dark' ? 'text-light' : 'text-dark'}`}
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              textAlign: 'center',
              width: '100%',
            }}
          >
            <h2 className="fw-bold mb-4 text-center">Todo en un solo lugar</h2>              
            <div className="d-flex justify-content-center gap-5 mb-3">
              <FiCheckSquare size={48} className="text-primary" />
              <FiClock size={48} className="text-primary" />
              <RiBrainLine size={48} className="text-primary" />
            </div>
            <p className="mt-3 text-center">Características intuitivas, seguimiento de tiempo y recordatorios automáticos.</p>
            <div className="mt-4 d-flex gap-3 justify-content-center">
              <button
                className="btn btn-outline-primary"
                onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Ver características
              </button>
            </div>
          </Carousel.Caption>
        </Carousel.Item>
      </Carousel>

      {/* Resto del contenido de la página de inicio */}
      <div className="container my-5">
        <h2 className="text-center mb-4 fw-bold">Funcionalidades principales</h2>
        <div className="row">
          <div className="col-md-4 mb-4">
            <div className="card h-100 border-0 shadow-sm">
              <div className="card-body text-center p-4">
                <div className="mb-3">
                  <FiCheckSquare size={36} className="text-primary" />
                </div>
                <h3>Tableros Kanban</h3>
                <p className="text-muted">
                  Visualiza tu flujo de trabajo con tableros interactivos y arrastra tareas entre columnas.
                </p>
              </div>
            </div>
          </div>
          <div className="col-md-4 mb-4">
            <div className="card h-100 border-0 shadow-sm">
              <div className="card-body text-center p-4">
                <div className="mb-3">
                  <FiClock size={36} className="text-primary" />
                </div>
                <h3>Recordatorios</h3>
                <p className="text-muted">
                  Recibe alertas antes de que lleguen las fechas límite y mantén todo bajo control.
                </p>
              </div>
            </div>
          </div>
          <div className="col-md-4 mb-4">
            <div className="card h-100 border-0 shadow-sm">
              <div className="card-body text-center p-4">
                <div className="mb-3">
                  <RiBrainLine size={36} className="text-primary" />
                </div>
                <h3>Colaboración</h3>
                <p className="text-muted">
                  Comparte tableros y asigna tareas a compañeros para trabajar en equipo eficientemente.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sección de características */}
      <div id="features" className="py-5">
        <div className="container">
          <div className="text-center p-5 bg-primary bg-opacity-10 rounded-4 shadow-sm mb-5">
            <h2 className="fw-bold mb-4">Lo que nos hace diferentes</h2>
            
            <div className="row g-4 justify-content-center mb-4">
              <div className="col-md-5">
                <div className="d-flex">
                  <div className="flex-shrink-0">
                    <div 
                      style={{
                        backgroundColor: "rgba(var(--bs-primary-rgb), 0.2)", 
                        color: "var(--bs-primary)", 
                        width: "50px", 
                        height: "50px",
                        transition: "all 0.3s ease"
                      }} 
                      className="rounded-circle d-flex align-items-center justify-content-center"
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = "rgba(var(--bs-primary-rgb), 0.3)";
                        e.currentTarget.style.transform = "scale(1.1)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = "rgba(var(--bs-primary-rgb), 0.2)";
                        e.currentTarget.style.transform = "scale(1)";
                      }}
                    >
                      <FiZap size={24} />
                    </div>
                  </div>
                  <div className="flex-grow-1 ms-3 text-start">
                    <h4 className="mb-2">Uso sencillo</h4>
                    <p className="text-muted">
                      Comienza a utilizarlo en segundos sin necesidad de formación especial ni configuraciones complejas.
                    </p>
                  </div>
                </div>
              </div>
              <div className="col-md-5">
                <div className="d-flex">
                  <div className="flex-shrink-0">
                    <div 
                      style={{
                        backgroundColor: "rgba(var(--bs-primary-rgb), 0.2)", 
                        color: "var(--bs-primary)", 
                        width: "50px", 
                        height: "50px",
                        transition: "all 0.3s ease"
                      }} 
                      className="rounded-circle d-flex align-items-center justify-content-center"
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = "rgba(var(--bs-primary-rgb), 0.3)";
                        e.currentTarget.style.transform = "scale(1.1)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = "rgba(var(--bs-primary-rgb), 0.2)";
                        e.currentTarget.style.transform = "scale(1)";
                      }}
                    >
                      <FiSliders size={24} />
                    </div>
                  </div>
                  <div className="flex-grow-1 ms-3 text-start">
                    <h4 className="mb-2">Personalización completa</h4>
                    <p className="text-muted">
                      Adapta tus tableros y columnas según tus necesidades específicas.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="row g-4 justify-content-center">
              <div className="col-md-5">
                <div className="d-flex">
                  <div className="flex-shrink-0">
                    <div 
                      style={{
                        backgroundColor: "rgba(var(--bs-primary-rgb), 0.2)", 
                        color: "var(--bs-primary)", 
                        width: "50px", 
                        height: "50px",
                        transition: "all 0.3s ease"
                      }} 
                      className="rounded-circle d-flex align-items-center justify-content-center"
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = "rgba(var(--bs-primary-rgb), 0.3)";
                        e.currentTarget.style.transform = "scale(1.1)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = "rgba(var(--bs-primary-rgb), 0.2)";
                        e.currentTarget.style.transform = "scale(1)";
                      }}
                    >
                      <FiClock size={24} />
                    </div>
                  </div>
                  <div className="flex-grow-1 ms-3 text-start">
                    <h4 className="mb-2">Aumento de productividad</h4>
                    <p className="text-muted">
                      Reduce el tiempo que pasas organizando y aumenta el tiempo que dedicas a completar tareas.
                    </p>
                  </div>
                </div>
              </div>
              <div className="col-md-5">
                <div className="d-flex">
                  <div className="flex-shrink-0">
                    <div 
                      style={{
                        backgroundColor: "rgba(var(--bs-primary-rgb), 0.2)", 
                        color: "var(--bs-primary)", 
                        width: "50px", 
                        height: "50px",
                        transition: "all 0.3s ease"
                      }} 
                      className="rounded-circle d-flex align-items-center justify-content-center"
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = "rgba(var(--bs-primary-rgb), 0.3)";
                        e.currentTarget.style.transform = "scale(1.1)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = "rgba(var(--bs-primary-rgb), 0.2)";
                        e.currentTarget.style.transform = "scale(1)";
                      }}
                    >
                      <FiCloud size={24} />
                    </div>
                  </div>
                  <div className="flex-grow-1 ms-3 text-start">
                    <h4 className="mb-2">Siempre sincronizado</h4>
                    <p className="text-muted">
                      Accede a tus tareas desde cualquier dispositivo con sincronización automática.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-5 pt-3 border-top border-primary border-opacity-25">
              <p className="lead mb-4">¿Listo para aumentar tu productividad y organizar mejor tu vida?</p>
              <div className="d-flex justify-content-center gap-3">
                <button
                  className="btn btn-primary px-4 py-2"
                  onClick={() => window.dispatchEvent(new CustomEvent('openAuthModal', { detail: 'register' }))}
                >
                  <FiArrowRightCircle className="me-2" />
                  Empieza gratis ahora
                </button>
                <a href="/about" className="btn btn-outline-primary px-4 py-2">
                  <FiInfo className="me-2" />
                  Saber más
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Home;
