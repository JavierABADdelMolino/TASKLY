// src/components/layout/Footer.jsx
const Footer = () => {
  return (
    <footer className="bg-body-tertiary text-body py-3 border-top text-center">
      <small>&copy; {new Date().getFullYear()} Task Manager · Todos los derechos reservados</small>
    </footer>
  );
};

export default Footer;
