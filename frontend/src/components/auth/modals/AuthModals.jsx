// src/components/auth/modals/AuthModals.jsx
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTheme } from '../../../context/ThemeContext';
import LoginForm from '../LoginForm';
import RegisterForm from '../RegisterForm';
import ResetPasswordModal from './ResetPasswordModal';
import LinkGoogleAccountModal from './LinkGoogleAccountModal';

const AuthModals = () => {
  const [authMode, setAuthMode] = useState(null);
  const [googleRegisterData, setGoogleRegisterData] = useState(null);
  const [showLinkGoogleModal, setShowLinkGoogleModal] = useState(false);
  
  const { theme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  // Capturar eventos para abrir modales
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

  // Verificar si hay datos del estado de Google auth
  useEffect(() => {
    if (location.state?.openGoogleRegister && location.state?.googleData) {
      const googleData = location.state.googleData;
      
      // Si necesita enlazar cuenta (email existe como cuenta normal)
      if (googleData.needsLinking || googleData.code === 'LINK_GOOGLE' || location.state?.showLinkGoogleModal) {
        setGoogleRegisterData(googleData);
        setShowLinkGoogleModal(true);
      } 
      // Si necesita completar registro (email nuevo con Google)
      else if (googleData.needsCompletion || googleData.code === 'NEEDS_COMPLETION') {
        setAuthMode('register');
        setGoogleRegisterData(googleData);
      }
    }
  }, [location.state]);

  return (
    <>
      {/* Modal de autenticación */}
      {authMode && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)', zIndex: 1050 }}
        >
          <div
            className={`card shadow p-4 position-relative ${theme === 'dark' ? 'text-white' : 'text-dark'}`}
            style={{ width: '100%', maxWidth: '460px' }}
          >
            <button
              type="button"
              className={`btn-close position-absolute top-0 end-0 m-3 ${theme === 'dark' ? 'btn-close-white' : ''}`}
              aria-label="Cerrar"
              onClick={handleCloseAuth}
            />
            {authMode === 'login' && <LoginForm />}
            {authMode === 'register' && <RegisterForm googleData={googleRegisterData} />}
            {authMode === 'reset' && <ResetPasswordModal />}
            
            {/* Switch between modes */}
            {(authMode === 'login' || authMode === 'register') && (
              <div className="mt-3 text-center">
                {authMode === 'login' && (
                  <span>
                    ¿No tienes cuenta?{' '}
                    <button 
                      className="btn btn-link p-0" 
                      onClick={() => setAuthMode('register')}
                    >
                      Regístrate
                    </button>
                  </span>
                )}
                {authMode === 'register' && (
                  <span>
                    ¿Ya tienes cuenta?{' '}
                    <button 
                      className="btn btn-link p-0" 
                      onClick={() => setAuthMode('login')}
                    >
                      Inicia sesión
                    </button>
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modal para enlazar cuenta de Google */}
      {showLinkGoogleModal && (
        <LinkGoogleAccountModal
          googleData={googleRegisterData}
          onClose={() => {
            setShowLinkGoogleModal(false);
            setGoogleRegisterData(null);
            // Limpiar el estado de la URL
            if (location.state?.openGoogleRegister) {
              navigate(location.pathname, { replace: true });
            }
          }}
        />
      )}
    </>
  );
};

export default AuthModals;
