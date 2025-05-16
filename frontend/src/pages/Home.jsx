import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoginForm from '../components/auth/LoginForm';
import RegisterForm from '../components/auth/RegisterForm';
import Layout from '../components/layout/Layout';

const Home = () => {
  const [authMode, setAuthMode] = useState(null);
  const { user, setUser } = useAuth();
  const navigate = useNavigate();
  const [formError, setFormError] = useState('');

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
    setFormError('');
    setAuthMode(null);
  };

  const handleRegister = async (formData) => {
    try {
      let avatarUrl = '';

      if (formData.avatarFile) {
        const avatarData = new FormData();
        avatarData.append('avatar', formData.avatarFile);

        const res = await fetch(`${process.env.REACT_APP_API_URL}/upload/avatar`, {
          method: 'POST',
          body: avatarData
        });

        const avatarRes = await res.json();
        avatarUrl = avatarRes.url;
      }

      const userPayload = {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName,
        birthDate: formData.birthDate,
        gender: formData.gender,
        theme: formData.theme,
        avatarUrl
      };

      const registerRes = await fetch(`${process.env.REACT_APP_API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userPayload)
      });

      const registerData = await registerRes.json();

      if (!registerRes.ok) {
        setFormError(registerData.message || 'Error en el registro');
        return;
      }

      sessionStorage.setItem('token', registerData.token);

      const userInfoRes = await fetch(`${process.env.REACT_APP_API_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${registerData.token}` }
      });

      const userInfo = await userInfoRes.json();
      if (userInfoRes.ok) {
        setUser(userInfo);
        setAuthMode(null);
        setFormError('');
        navigate('/dashboard');
      } else {
        setFormError('No se pudo obtener el usuario');
      }

    } catch (error) {
      console.error(error);
      setFormError('Error de conexión con el servidor');
    }
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
          <div className="bg-white rounded-3 shadow p-4" style={{ width: '100%', maxWidth: '460px' }}>
            {formError && <div className="alert alert-danger text-center small mb-3">{formError}</div>}
            {authMode === 'login'
              ? <LoginForm />
              : <RegisterForm onRegister={handleRegister} />
            }
            <div className="d-grid mt-3">
              <button className="btn btn-secondary" onClick={handleCloseAuth}>
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default Home;
