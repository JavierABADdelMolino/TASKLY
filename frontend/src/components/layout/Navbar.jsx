import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const currentPath = location.pathname;
  const isHome = currentPath === '/';
  const isDashboard = currentPath.startsWith('/dashboard');
  const isProfile = currentPath.startsWith('/profile');

  const handleLogout = () => {
    logout();
    navigate('/');
  };

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

          {user && (isDashboard || isProfile) && (
            <div className="dropdown">
              <button
                className="btn d-flex align-items-center dropdown-toggle"
                id="userMenu"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <img
                  src={`${process.env.REACT_APP_URL}${user.avatarUrl}`}
                  alt="avatar"
                  className="rounded-circle me-2 border"
                  style={{ width: '36px', height: '36px', objectFit: 'cover' }}
                />
                <span className="d-none d-md-inline">{user.firstName}</span>
              </button>

              <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="userMenu">
                <li>
                  <button
                    className="dropdown-item"
                    onClick={() => navigate('/profile')}
                  >
                    Mi perfil
                  </button>
                </li>
                <li>
                  <button className="dropdown-item text-danger" onClick={handleLogout}>
                    Cerrar sesión
                  </button>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
