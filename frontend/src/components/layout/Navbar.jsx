import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const currentPath = location.pathname;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Rutas y títulos fijos
  const pageTitles = {
    '/dashboard': 'Panel de tareas',
    '/profile': 'Mi perfil',
    '/': 'Inicio',
  };

  // Detectar ruta base de la página actual
  const matching = Object.entries(pageTitles)
    .sort((a, b) => b[0].length - a[0].length)
    .find(([route]) => currentPath.startsWith(route));

  const currentPagePath = matching?.[0] || '/';
  const currentPageName = matching?.[1] || '';

  return (
    <nav className="navbar navbar-expand-lg bg-body-tertiary text-body border-bottom">
      <div className="container d-flex justify-content-between align-items-center">
        {/* Zona izquierda con dos botones fijos */}
        <div className="d-flex align-items-center gap-3">
          {/* Botón 1: Taskly → siempre a /dashboard */}
          <button
            className="btn btn-sm btn-link fw-bold p-0"
            onClick={() => navigate('/dashboard')}
            style={{ textDecoration: 'none' }}
          >
            Taskly
          </button>

          {/* Botón 2: nombre dinámico según página actual */}
          <button
            className="btn btn-sm btn-link text-muted p-0"
            onClick={() => navigate(currentPagePath)}
            style={{ textDecoration: 'none' }}
          >
            {currentPageName}
          </button>
        </div>

        {/* Zona derecha con login o menú de usuario */}
        <div className="d-flex align-items-center">
          {!user && currentPath === '/' && (
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

          {user && (
            <div className="dropdown ms-3">
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
                  <button className="dropdown-item" onClick={() => navigate('/profile')}>
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
