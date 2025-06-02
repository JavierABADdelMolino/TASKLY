import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoginForm from '../components/auth/LoginForm';
import RegisterForm from '../components/auth/RegisterForm';
import Layout from '../components/layout/Layout';

const Home = () => {
  const [authMode, setAuthMode] = useState(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

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

  return (
    <Layout>
      <header className="text-center">
        <h1 className="display-4 fw-bold">Taskly</h1>
        <p className="lead">Organiza tus tareas de forma sencilla y eficiente.</p>
      </header>

      {authMode && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)', zIndex: 1050 }}
        >
          <div className="bg-white rounded-3 shadow p-4 position-relative" style={{ width: '100%', maxWidth: '460px' }}>
            {/* Close button in top-right */}
            <button
              type="button"
              className="btn-close position-absolute top-0 end-0 m-3"
              aria-label="Cerrar"
              onClick={handleCloseAuth}
            />
            {/* Login or Register form */}
            {authMode === 'login' ? <LoginForm /> : <RegisterForm />}
            {/* Switch between modes */}
            <div className="mt-3 text-center">
              {authMode === 'login' && (
                <span>
                  ¿No tienes cuenta?{' '}
                  <button type="button" className="btn btn-link p-0" onClick={() => setAuthMode('register')}>
                    Registrarse
                  </button>
                </span>
              )}
              {authMode === 'register' && (
                <span>
                  ¿Ya tienes cuenta?{' '}
                  <button type="button" className="btn btn-link p-0" onClick={() => setAuthMode('login')}>
                    Iniciar sesión
                  </button>
                </span>
              )}
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default Home;
