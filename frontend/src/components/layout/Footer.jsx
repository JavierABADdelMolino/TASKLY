// src/components/layout/Footer.jsx
import { Link, useNavigate } from 'react-router-dom';
import { APP_INFO } from '../../config/constants';
import { FiInfo, FiMessageCircle, FiHelpCircle, FiShield, FiFileText, FiArrowUp } from 'react-icons/fi';
import { BsCookie } from 'react-icons/bs';
import { useState, useEffect } from 'react';

const Footer = () => {
  const navigate = useNavigate();
  // Ya no necesitamos theme para las clases, se maneja automáticamente con bg-body-tertiary
  const [showScrollTop, setShowScrollTop] = useState(false);
  
  // Controlar cuándo mostrar el botón de volver arriba
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Función para navegar a la página de inicio
  const navigateToHome = () => {
    navigate('/');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  // Función para hacer scroll hacia arriba al navegar
  const handleNavigation = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  // Scroll to top
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  return (
    <>
      {showScrollTop && (
        <button 
          className="btn btn-primary btn-sm rounded-circle position-fixed"
          style={{
            bottom: '70px',
            right: '20px',
            width: '40px',
            height: '40px',
            zIndex: 1030,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 2px 10px rgba(var(--bs-primary-rgb), 0.3)',
            transition: 'all 0.3s ease'
          }}
          onClick={scrollToTop}
          aria-label="Scroll to top"
        >
          <FiArrowUp />
        </button>
      )}
      <footer className="footer mt-auto py-3 bg-body-tertiary border-top">
        <div className="container">
          <div className="row align-items-center justify-content-between">
            <div className="col-auto">
              <div className="d-flex align-items-center">
                <img 
                  src="/logo-color.svg"
                  alt="Taskly Logo" 
                  height="28" 
                  style={{ cursor: 'pointer', transition: 'transform 0.3s ease' }} 
                  onClick={navigateToHome}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                />
              </div>
            </div>
            
            <div className="col-auto">
              <div className="d-flex flex-wrap justify-content-center gap-4">
                <Link 
                  to="/about" 
                  className="text-decoration-none d-flex align-items-center"
                  onClick={handleNavigation}
                  style={{ transition: 'transform 0.3s ease' }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                >
                  <FiInfo className="me-1" />
                  <span>Acerca de</span>
                </Link>
                <Link 
                  to="/contact" 
                  className="text-decoration-none d-flex align-items-center"
                  onClick={handleNavigation}
                  style={{ transition: 'transform 0.3s ease' }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                >
                  <FiMessageCircle className="me-1" />
                  <span>Contacto</span>
                </Link>
                <Link 
                  to="/faq" 
                  className="text-decoration-none d-flex align-items-center"
                  onClick={handleNavigation}
                  style={{ transition: 'transform 0.3s ease' }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                >
                  <FiHelpCircle className="me-1" />
                  <span>FAQ</span>
                </Link>
                <Link 
                  to="/privacy" 
                  className="text-decoration-none d-flex align-items-center"
                  onClick={handleNavigation}
                  style={{ transition: 'transform 0.3s ease' }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                >
                  <FiShield className="me-1" />
                  <span>Privacidad</span>
                </Link>
                <Link 
                  to="/terms" 
                  className="text-decoration-none d-flex align-items-center"
                  onClick={handleNavigation}
                  style={{ transition: 'transform 0.3s ease', fontSize: '0.95rem' }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                >
                  <FiFileText className="me-1" />
                  <span>Términos</span>
                </Link>
                <Link 
                  to="/cookies" 
                  className="text-decoration-none d-flex align-items-center"
                  onClick={handleNavigation}
                  style={{ transition: 'transform 0.3s ease', fontSize: '0.95rem' }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                >
                  <BsCookie className="me-1" />
                  <span>Cookies</span>
                </Link>
              </div>
            </div>
            
            <div className="col-auto">
              <p className="small mb-0">
                &copy; {APP_INFO.COPYRIGHT_YEAR} {APP_INFO.NAME}. Todos los derechos reservados.
              </p>
            </div>
          </div>
        </div>
      </footer>
      
      <style jsx="true">{`
        footer {
          border-top: 1px solid var(--bs-navbar-border-color) !important;
          border-top-width: 1px !important;
          border-top-style: solid !important;
        }
        
        footer a {
          font-size: 0.95rem;
          color: var(--bs-body-color) !important; /* Forzar color de texto del tema (blanco en oscuro/negro en claro) */
        }
        
        footer a:hover {
          color: var(--bs-primary) !important;
        }
        
        [data-bs-theme="light"] footer {
          border-top-color: rgba(0, 0, 0, 0.175) !important; /* Color más oscuro para modo claro */
        }
        
        [data-bs-theme="dark"] footer {
          border-top-color: rgba(255, 255, 255, 0.175) !important; /* Color para modo oscuro */
        }
      `}</style>
    </>
  );
};

export default Footer;
