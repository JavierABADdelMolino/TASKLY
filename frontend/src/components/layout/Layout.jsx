// src/components/layout/Layout.jsx
import Navbar from './Navbar';
import Footer from './Footer';
import { useLocation } from 'react-router-dom';

const Layout = ({ children }) => {
  const location = useLocation();

  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar currentPath={location.pathname} />
      <main className="flex-grow-1 container py-4">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
