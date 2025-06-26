// src/components/layout/Layout.jsx
import Navbar from './Navbar';
import Footer from './Footer';
import { useLocation } from 'react-router-dom';
import AuthModals from '../auth/modals/AuthModals';
import { useAuth } from '../../context/AuthContext';

const Layout = ({ children, onBoardCreated = () => {} }) => {
  const { pathname } = useLocation();
  const { user } = useAuth();

  return (
    <div className="d-flex flex-column min-vh-100">
      {/* Pasamos la prop a Navbar */}
      <Navbar currentPath={pathname} onBoardCreated={onBoardCreated} />
      <main className="flex-grow-1 container py-4">{children}</main>
      <Footer />
      
      {/* Incluir modales de autenticación globalmente cuando el usuario no está autenticado */}
      {!user && <AuthModals />}
    </div>
  );
};

export default Layout;
