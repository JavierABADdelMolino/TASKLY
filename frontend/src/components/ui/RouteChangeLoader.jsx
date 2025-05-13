// src/components/RouteChangeLoader.jsx
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useLoader } from '../../context/LoaderContext';

const RouteChangeLoader = () => {
  const location = useLocation();
  const { setShowLoader } = useLoader();

  useEffect(() => {
    // Mostrar loader al cambiar de ruta
    setShowLoader(true);

    // Simula carga (puedes ajustarlo o quitarlo)
    const timeout = setTimeout(() => {
      setShowLoader(false);
    }, 500); // Duración del loader (puede depender de cada vista)

    return () => clearTimeout(timeout);
  }, [location.pathname, setShowLoader]); // Solo reacciona al cambiar de ruta

  return null; // No renderiza nada
};

export default RouteChangeLoader;
