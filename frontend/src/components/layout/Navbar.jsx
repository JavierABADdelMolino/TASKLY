import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import ThemeSwitcher from '../ui/ThemeSwitcher';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const currentPath = location.pathname;
  const isHome = currentPath === '/';
  const isDashboard = currentPath.startsWith('/dashboard');

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // 🧠 Si hay usuario, redirige a /dashboard. Si no, a /
  const brandLink = user ? '/dashboard' : '/';

  return (
    <nav className="navbar navbar-expand-lg bg-body-tertiary text-body border-bottom">
      <div className="container">
        <Link className="navbar-brand" to={brandLink}>
          Taskly
        </Link>

        <div className="d-flex ms-auto align-items-center">
          {!user && isHome && (
            <>
              <button
                className="btn btn-outline-primary me-2"
                onClick={() =>
                  window.dispatchEvent(new CustomEvent('openAuthModal', { detail: 'login' }))
                }
              >
                Iniciar sesión
              </button>
              <button
                className="btn btn-primary"
                onClick={() =>
                  window.dispatchEvent(new CustomEvent('openAuthModal', { detail: 'register' }))
                }
              >
                Registrarse
              </button>
            </>
          )}

          {user && isDashboard && (
            <button className="btn btn-outline-danger me-2" onClick={handleLogout}>
              Cerrar sesión
            </button>
          )}

          <ThemeSwitcher />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
