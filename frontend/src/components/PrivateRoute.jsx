import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Loader from './Loader'; // Ajusta la ruta si es necesario

const PrivateRoute = ({ children }) => {
  const { user, checkingSession } = useAuth();

  if (checkingSession) return <Loader />;
  return user ? children : <Navigate to="/" />;
};

export default PrivateRoute;
