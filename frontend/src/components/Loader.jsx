// src/components/GlobalLoader.jsx
import { useLoader } from '../context/LoaderContext';

const Loader = () => {
  const { showLoader } = useLoader();

  if (!showLoader) return null;

  return (
    <div className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center bg-dark bg-opacity-50" style={{ zIndex: 2000 }}>
      <div className="text-center">
        <div className="spinner-border text-light" role="status" style={{ width: '3rem', height: '3rem' }}>
          <span className="visually-hidden">Cargando...</span>
        </div>
        <p className="mt-3 text-white">Cargando...</p>
      </div>
    </div>
  );
};

export default Loader;
