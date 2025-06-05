import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoginForm from '../components/auth/LoginForm';
import RegisterForm from '../components/auth/RegisterForm';
import Layout from '../components/layout/Layout';
<<<<<<< HEAD
import { useTheme } from '../context/ThemeContext';
import { FiCheckSquare, FiClock, FiBell } from 'react-icons/fi';
import { Carousel } from 'react-bootstrap';
=======
>>>>>>> docs

const Home = () => {
  const [authMode, setAuthMode] = useState(null);
  const { user } = useAuth();
<<<<<<< HEAD
  const { theme } = useTheme();
=======
>>>>>>> docs
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  useEffect(() => {
    const handleAuthModal = (e) => {
      setAuthMode(e.detail);
    };
    window.addEventListener('openAuthModal', handleAuthModal);
    return () => window.removeEventListener('openAuthModal', handleAuthModal);
  }, []);

  const handleCloseAuth = () => {
    setAuthMode(null);
  };

  return (
    <Layout>
<<<<<<< HEAD
      {/* Modal de autenticación */}
=======
      <header className="text-center">
        <h1 className="display-4 fw-bold">Taskly</h1>
        <p className="lead">Organiza tus tareas de forma sencilla y eficiente.</p>
      </header>

>>>>>>> docs
      {authMode && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)', zIndex: 1050 }}
        >
<<<<<<< HEAD
          <div
            className={`card shadow p-4 position-relative ${theme === 'dark' ? 'text-white' : 'text-dark'}`}
            style={{ width: '100%', maxWidth: '460px' }}
          >
            {/* Close button in top-right */}
            <button
              type="button"
              className={`btn-close position-absolute top-0 end-0 m-3 ${theme === 'dark' ? 'btn-close-white' : ''}`}
=======
          <div className="bg-white rounded-3 shadow p-4 position-relative" style={{ width: '100%', maxWidth: '460px' }}>
            {/* Close button in top-right */}
            <button
              type="button"
              className="btn-close position-absolute top-0 end-0 m-3"
>>>>>>> docs
              aria-label="Cerrar"
              onClick={handleCloseAuth}
            />
            {/* Login or Register form */}
            {authMode === 'login' ? <LoginForm /> : <RegisterForm />}
            {/* Switch between modes */}
            <div className="mt-3 text-center">
              {authMode === 'login' && (
                <span>
                  ¿No tienes cuenta?{' '}
                  <button type="button" className="btn btn-link p-0" onClick={() => setAuthMode('register')}>
                    Registrarse
                  </button>
                </span>
              )}
              {authMode === 'register' && (
                <span>
                  ¿Ya tienes cuenta?{' '}
                  <button type="button" className="btn btn-link p-0" onClick={() => setAuthMode('login')}>
                    Iniciar sesión
                  </button>
                </span>
              )}
            </div>
          </div>
        </div>
      )}
<<<<<<< HEAD

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
              <FiBell size={48} className="text-primary" />
            </div>
            <p className="mt-3 text-center">Características intuitivas, seguimiento de tiempo y recordatorios automáticos.</p>
            <div className="mt-4 d-flex gap-3 justify-content-center">
              <button
                className="btn btn-outline-primary"
                onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Ver características
              </button>
              <button
                className="btn btn-primary text-white"
                onClick={() => window.dispatchEvent(new CustomEvent('openAuthModal', { detail: 'register' }))}
              >
                Empieza ahora
              </button>
            </div>
          </Carousel.Caption>
        </Carousel.Item>
      </Carousel>

      {/* Features Section */}
      <section id="features" className={`features py-5 ${theme === 'dark' ? 'bg-dark text-light' : 'bg-light text-dark'}`}>
        <div className="container">
          <h2 className="text-center mb-5">Características destacadas</h2>
          <div className="row gy-4">
            <div className="col-md-4 text-center">
              <FiCheckSquare size={48} className="text-primary mb-3" />
              <h5>Gestión intuitiva</h5>
              <p>Arrastra y organiza tus tareas y columnas con sencillos clicks.</p>
            </div>
            <div className="col-md-4 text-center">
              <FiClock size={48} className="text-primary mb-3" />
              <h5>Seguimiento de tiempos</h5>
              <p>Controla plazos y recibe notificaciones antes de las fechas de entrega.</p>
            </div>
            <div className="col-md-4 text-center">
              <FiBell size={48} className="text-primary mb-3" />
              <h5>Recordatorios</h5>
              <p>No olvides nada gracias a los recordatorios automáticos.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="cta bg-primary text-white text-center py-5">
        <h3 className="mb-4">Listo para empezar?</h3>
        {/* Botón de registro eliminado: usar Navbar */}
      </section>

=======
>>>>>>> docs
    </Layout>
  );
};

export default Home;
