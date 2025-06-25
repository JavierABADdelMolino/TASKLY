import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { FiSun, FiMoon } from 'react-icons/fi';
import CreateBoardModal from '../../components/dashboard/modals/CreateBoardModal';

const Navbar = ({ currentPath, onBoardCreated = () => {} }) => {
  const { user, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  /* Si Layout ya pasa currentPath lo usamos; si no, tomamos location */
  const path = currentPath || location.pathname;

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  /* Rutas para mostrar título dinámico */
  const pageTitles = {
    '/dashboard': 'Panel de tareas',
    '/profile': 'Mi perfil',
    '/': 'Inicio',
  };

  const matching = Object.entries(pageTitles)
    .sort((a, b) => b[0].length - a[0].length)
    .find(([route]) => path.startsWith(route));

  const currentPagePath = matching?.[0] || '/';
  const currentPageName = matching?.[1] || '';

  return (
    <>
      <nav className="navbar navbar-expand-lg bg-body-tertiary text-body border-bottom">
        <div className="container d-flex justify-content-between align-items-center">
          {/* Izquierda: logo + título dinámico */}
          <div className="d-flex align-items-center gap-3">
            <button
              className="btn btn-sm btn-link p-0"
              onClick={() => navigate('/')}
              style={{ textDecoration: 'none' }}
            >
              <img
                src={`${process.env.PUBLIC_URL}/logo-color.svg`}
                alt="Taskly Logo"
                style={{ height: '40px' }}
              />
            </button>
            <button
              className="btn btn-sm btn-link text-muted p-0"
              onClick={() => navigate(currentPagePath)}
              style={{ textDecoration: 'none' }}
            >
              {currentPageName}
            </button>
          </div>

          {/* Derecha: botones según autenticación */}
          <div className="d-flex align-items-center">
            {/* Botón + pizarra: solo en dashboard y logueado */}
            {user && path === '/dashboard' && (
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

            {/* Login / Registro: solo cuando NO hay usuario y estás en la home */}
            {!user && path === '/' && (
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

            {/* Menú usuario (avatar) */}
            {user && (
              <div
                className={`dropdown ms-3 ${showUserMenu ? 'show' : ''}`}
                onMouseEnter={() => setShowUserMenu(true)}
                onMouseLeave={() => setShowUserMenu(false)}
              >
                <button
                  type="button"
                  className="btn d-flex align-items-center dropdown-toggle"
                  id="userMenu"
                  aria-expanded={showUserMenu}
                  onMouseDown={(e) => e.preventDefault()}
                  style={{ color: theme === 'dark' ? '#fff' : '#000' }}
                >
                  <img
                    src={
                      user.avatarUrl?.startsWith('http')
                        ? user.avatarUrl
                        : `${process.env.REACT_APP_URL}${user.avatarUrl}`
                    }
                    alt="avatar"
                    className="rounded-circle me-2 border"
                    style={{ width: '36px', height: '36px', objectFit: 'cover' }}
                  />
                  <span className="d-none d-md-inline">{user.firstName}</span>
                </button>

                <ul className={`dropdown-menu dropdown-menu-end ${showUserMenu ? 'show' : ''}`} aria-labelledby="userMenu" data-bs-auto-close="outside">
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

            {/* Theme switch (global) */}
            <div
              className="theme-toggle m-0 ms-3"
              onClick={(e) => e.stopPropagation()}
              onMouseDown={(e) => e.stopPropagation()}
            >
              <input
                className="theme-toggle-input"
                type="checkbox"
                id="themeSwitchGlobal"
                checked={theme === 'dark'}
                onChange={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              />
              <label htmlFor="themeSwitchGlobal" className="theme-toggle-label">
                <span className="theme-toggle-slider">
                  {theme === 'dark' ? <FiMoon /> : <FiSun />}
                </span>
              </label>
            </div>
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
            onBoardCreated(board);   // notifica al Dashboard/Layout
          }}
        />
      )}
    </>
  );
};

export default Navbar;
