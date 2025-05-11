import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PrivateRoute = ({ children }) => {
  const { user, checkingSession } = useAuth();

  if (checkingSession) return null; // o un loader
  return user ? children : <Navigate to="/" />;
};

export default PrivateRoute;