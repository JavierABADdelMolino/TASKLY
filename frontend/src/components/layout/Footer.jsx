// src/components/layout/Footer.jsx
const Footer = () => {
  return (
    <footer className="bg-body-tertiary text-center py-3 border-top">
      <small>&copy; {new Date().getFullYear()} Task Manager · Todos los derechos reservados</small>
    </footer>
  );
};

export default Footer;
