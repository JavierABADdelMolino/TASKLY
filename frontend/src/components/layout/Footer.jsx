// src/components/layout/Footer.jsx
import { Link } from 'react-router-dom';
import { APP_INFO } from '../../config/constants';

const Footer = () => {
  return (
    <footer className="footer mt-auto py-4 bg-body-tertiary border-top">
      <div className="container">
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mb-2">
          <div className="d-flex align-items-center mb-3 mb-md-0">
            <img src="/logo-color.svg" alt="Taskly Logo" height="32" className="me-2" />
            <span className="fw-bold fs-5">{APP_INFO.NAME}</span>
          </div>
          <nav>
            <ul className="nav justify-content-center gap-2">
              <li className="nav-item"><Link to="/about" className="nav-link p-0 text-muted">Acerca de</Link></li>
              <li className="nav-item"><Link to="/contact" className="nav-link p-0 text-muted">Contacto</Link></li>
              <li className="nav-item"><Link to="/faq" className="nav-link p-0 text-muted">FAQ</Link></li>
              <li className="nav-item"><Link to="/privacy" className="nav-link p-0 text-muted">Privacidad</Link></li>
              <li className="nav-item"><Link to="/terms" className="nav-link p-0 text-muted">Términos</Link></li>
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
