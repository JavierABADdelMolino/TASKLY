// src/pages/Home.jsx
import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/layout/Layout';
import { useTheme } from '../context/ThemeContext';
import { FiCheckSquare, FiClock } from 'react-icons/fi';
import { RiBrainLine } from 'react-icons/ri';
import { Carousel } from 'react-bootstrap';

const Home = () => {
  // Capturar token de URL para reset
  const { token } = useParams();
  const { user } = useAuth();
  const { theme } = useTheme();
  const navigate = useNavigate();

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
      {/* Hero Carousel */}
      <Carousel
        interval={4000}
        controls
        className={`home-hero carousel-controls ${theme === 'dark' ? 'carousel-dark-controls' : 'carousel-light-controls'}`}
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
        <div className="row">
          <div className="col-md-4 mb-4">
            <div className="card h-100 border-0 shadow-sm">
              <div className="card-body text-center p-4">
                <div className="mb-3">
                  <FiCheckSquare size={36} className="text-primary" />
                </div>
                <h3>Gestión de tareas</h3>
                <p className="text-muted">
                  Organiza tus tareas en columnas personalizables y muévelas según avanzas en tu trabajo.
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
                <h3>Control de tiempo</h3>
                <p className="text-muted">
                  Establece fechas límite y recibe recordatorios para mantenerte al día con tus compromisos.
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
                <h3>Simple y poderoso</h3>
                <p className="text-muted">
                  Una interfaz intuitiva que no requiere formación especial. Empieza a usarlo en segundos.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sección de características */}
      <div id="features" className="bg-light py-5">
        <div className="container">
          <h2 className="text-center mb-5 fw-bold">Por qué elegir Taskly</h2>
          <div className="row g-4">
            <div className="col-md-6">
              <div className="d-flex">
                <div className="flex-shrink-0">
                  <span className="badge rounded-circle p-3 bg-primary">
                    <i className="bi bi-check-lg fs-5"></i>
                  </span>
                </div>
                <div className="flex-grow-1 ms-3">
                  <h4 className="mb-2">Interfaz intuitiva</h4>
                  <p className="text-muted">
                    Diseño limpio y sencillo que te permite centrarte en tus tareas sin distracciones.
                  </p>
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="d-flex">
                <div className="flex-shrink-0">
                  <span className="badge rounded-circle p-3 bg-primary">
                    <i className="bi bi-check-lg fs-5"></i>
                  </span>
                </div>
                <div className="flex-grow-1 ms-3">
                  <h4 className="mb-2">Personalización completa</h4>
                  <p className="text-muted">
                    Adapta tus tableros y columnas según tus necesidades específicas.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="text-center mt-5">
            <button
              className="btn btn-lg btn-primary"
              onClick={() => window.dispatchEvent(new CustomEvent('openAuthModal', { detail: 'register' }))}
            >
              Empieza gratis ahora
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Home;
