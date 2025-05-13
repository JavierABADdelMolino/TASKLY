import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoginForm from '../components/LoginForm';
import RegisterForm from '../components/RegisterForm';

const Home = () => {
  const [authMode, setAuthMode] = useState(null); // 'login' | 'register' | null
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleOpenAuth = (mode) => setAuthMode(mode);
  const handleCloseAuth = () => setAuthMode(null);

  return (
    <div className="container text-center py-5">
      <header>
        <h1 className="display-4 fw-bold">Taskly</h1>
        <p className="lead">Organiza tus tareas de forma sencilla y eficiente.</p>

        <div className="d-flex justify-content-center gap-3 mt-4">
          <button className="btn btn-primary px-4 py-2" onClick={() => handleOpenAuth('login')}>
            Iniciar sesión
          </button>
          <button className="btn btn-outline-primary px-4 py-2" onClick={() => handleOpenAuth('register')}>
            Registrarse
          </button>
        </div>
      </header>

      {/* Modal Bootstrap-like */}
      {authMode && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)', zIndex: 1050 }}
        >
          <div className="bg-white rounded-3 shadow p-4" style={{ width: '90%', maxWidth: '400px' }}>
            {authMode === 'login' ? <LoginForm /> : <RegisterForm />}
            <div className="d-grid mt-3">
              <button className="btn btn-secondary" onClick={handleCloseAuth}>
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
