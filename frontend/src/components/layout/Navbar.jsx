// src/components/layout/Navbar.jsx
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Navbar = ({ currentPath }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isHome = currentPath === '/';
  const isDashboard = currentPath === '/dashboard';

  return (
    <nav className="navbar navbar-expand-lg bg-body-tertiary border-bottom">
      <div className="container">
        <Link className="navbar-brand" to="/">Taskly</Link>

        <div className="d-flex ms-auto align-items-center">
          {!user && isHome && (
            <>
              <button
                className="btn btn-outline-primary me-2"
                data-auth="login"
                onClick={() => {
                  const event = new CustomEvent('openAuthModal', { detail: 'login' });
                  window.dispatchEvent(event);
                }}
              >
                Iniciar sesión
              </button>
              <button
                className="btn btn-primary"
                data-auth="register"
                onClick={() => {
                  const event = new CustomEvent('openAuthModal', { detail: 'register' });
                  window.dispatchEvent(event);
                }}
              >
                Registrarse
              </button>
            </>
          )}

          {user && isDashboard && (
            <button className="btn btn-outline-danger" onClick={handleLogout}>
              Cerrar sesión
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
