import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h2>Bienvenido, {user?.username}</h2>
      <p>Has iniciado sesión correctamente.</p>

      <button onClick={handleLogout} style={{ marginTop: '1rem' }}>
        Cerrar sesión
      </button>
    </div>
  );
};

export default Dashboard;
