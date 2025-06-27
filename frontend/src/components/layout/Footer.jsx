// src/components/layout/Footer.jsx
import { Link, useNavigate } from 'react-router-dom';
import { APP_INFO } from '../../config/constants';

const Footer = () => {
  const navigate = useNavigate();
  
  // Función para navegar a la página de inicio (igual que el navbar)
  const navigateToHome = () => {
    navigate('/');
    window.scrollTo(0, 0);
  };
  
  // Función para hacer scroll hacia arriba al navegar
  const handleNavigation = () => {
    window.scrollTo(0, 0);
  };
  
  return (
    <footer className="footer mt-auto py-4 bg-body-tertiary border-top">
      <div className="container">
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mb-2">
          <div className="d-flex align-items-center mb-3 mb-md-0">
            <img 
              src="/logo-color.svg" 
              alt="Taskly Logo" 
              height="32" 
              className="me-2" 
              style={{ cursor: 'pointer' }} 
              onClick={navigateToHome}
            />
            <span className="fw-bold fs-5">{APP_INFO.NAME}</span>
          </div>
          <nav>
            <ul className="nav justify-content-center gap-2">
              <li className="nav-item"><Link to="/about" className="nav-link p-0 text-muted" onClick={handleNavigation}>Acerca de</Link></li>
              <li className="nav-item"><Link to="/contact" className="nav-link p-0 text-muted" onClick={handleNavigation}>Contacto</Link></li>
              <li className="nav-item"><Link to="/faq" className="nav-link p-0 text-muted" onClick={handleNavigation}>FAQ</Link></li>
              <li className="nav-item"><Link to="/privacy" className="nav-link p-0 text-muted" onClick={handleNavigation}>Privacidad</Link></li>
              <li className="nav-item"><Link to="/terms" className="nav-link p-0 text-muted" onClick={handleNavigation}>Términos</Link></li>
            </ul>
          </nav>
        </div>
        <div className="border-top pt-3 mt-2">
          <p className="mb-0 text-center text-muted small">&copy; {APP_INFO.COPYRIGHT_YEAR} {APP_INFO.NAME}. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
