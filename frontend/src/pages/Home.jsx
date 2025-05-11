import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoginForm from '../components/LoginForm';
import RegisterForm from '../components/RegisterForm';
import '../styles/Home.css';

const Home = () => {
  const [authMode, setAuthMode] = useState(null); // 'login' | 'register' | null
  const { user } = useAuth();
  const navigate = useNavigate();

  // Redirige automáticamente al dashboard si ya hay un usuario autenticado
  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleOpenAuth = (mode) => setAuthMode(mode);
  const handleCloseAuth = () => setAuthMode(null);

  return (
    <div className="home-container">
      <header className="home-header">
        <h1>Taskly</h1>
        <p>Organiza tus tareas de forma sencilla y eficiente.</p>

        <div className="auth-buttons">
          <button onClick={() => handleOpenAuth('login')}>Iniciar sesión</button>
          <button onClick={() => handleOpenAuth('register')}>Registrarse</button>
        </div>
      </header>

      {authMode && (
        <div className="modal-overlay">
          <div className="modal-box">
            {authMode === 'login' ? <LoginForm /> : <RegisterForm />}
            <button onClick={handleCloseAuth} className="close-button">Cancelar</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
