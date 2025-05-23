import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import CreateBoardModal from '../../components/dashboard/modals/CreateBoardModal';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

  const [showCreateModal, setShowCreateModal] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const pageTitles = {
    '/dashboard': 'Panel de tareas',
    '/profile': 'Mi perfil',
    '/': 'Inicio',
  };

  const matching = Object.entries(pageTitles)
    .sort((a, b) => b[0].length - a[0].length)
    .find(([route]) => currentPath.startsWith(route));

  const currentPagePath = matching?.[0] || '/';
  const currentPageName = matching?.[1] || '';

  return (
    <>
      <nav className="navbar navbar-expand-lg bg-body-tertiary text-body border-bottom">
        <div className="container d-flex justify-content-between align-items-center">
          {/* Izquierda: título + ruta */}
          <div className="d-flex align-items-center gap-3">
            <button
              className="btn btn-sm btn-link fw-bold p-0"
              onClick={() => navigate('/dashboard')}
              style={{ textDecoration: 'none' }}
            >
              Taskly
            </button>
            <button
              className="btn btn-sm btn-link text-muted p-0"
              onClick={() => navigate(currentPagePath)}
              style={{ textDecoration: 'none' }}
            >
              {currentPageName}
            </button>
          </div>

          {/* Derecha: crear board + usuario/login */}
          <div className="d-flex align-items-center">
            {/* ✅ Solo en dashboard y logueado */}
            {user && currentPath === '/dashboard' && (
              <button
                className="btn btn-sm btn-outline-primary d-flex align-items-center gap-2 me-3"
                onClick={() => setShowCreateModal(true)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/>
                </svg>
                Nueva pizarra
              </button>
            )}

            {/* Login/registro si no está logueado */}
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

            {/* Menú de usuario */}
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

      {/* Modal de creación de board */}
      {showCreateModal && (
        <CreateBoardModal
          show={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onBoardCreated={(board) => {
            setShowCreateModal(false);
            console.log('Board creada:', board);
            // Aquí puedes actualizar el selector o recargar lista
          }}
        />
      )}
    </>
  );
};

export default Navbar;
