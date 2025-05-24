// src/components/layout/Layout.jsx
import Navbar from './Navbar';
import Footer from './Footer';
import { useLocation } from 'react-router-dom';

const Layout = ({ children, onBoardCreated = () => {} }) => {
  const { pathname } = useLocation();

  return (
    <div className="d-flex flex-column min-vh-100">
      {/* Pasamos la prop a Navbar */}
      <Navbar currentPath={pathname} onBoardCreated={onBoardCreated} />
      <main className="flex-grow-1 container py-4">{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;
