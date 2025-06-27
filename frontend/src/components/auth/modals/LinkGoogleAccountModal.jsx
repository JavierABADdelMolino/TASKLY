import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { linkGoogleAccount } from '../../../services/authService';

const LinkGoogleAccountModal = ({ googleData, onClose }) => {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { setUser } = useAuth();
  const navigate = useNavigate();

  const handleConfirm = async () => {
    try {
      setLoading(true);
      setError('');
      
      if (!googleData || !googleData.email || !googleData.googleId || !googleData.tokenId) {
        throw new Error('Datos de Google incompletos');
      }
      
      // Enlazar la cuenta de Google con la cuenta existente
      const result = await linkGoogleAccount(googleData.email, googleData.googleId, googleData.tokenId);
      
      // Guardar el token y establecer el usuario actual
      sessionStorage.setItem('token', result.token);
      setUser(result.user);
      
      // Limpiar datos de Google del sessionStorage si existen
      sessionStorage.removeItem('googleAuthData');
      
      // Redirigir a dashboard
      navigate('/dashboard');
    } catch (err) {
      console.error('Error al enlazar cuenta:', err);
      setError(err.message || 'Error al enlazar la cuenta. Por favor, inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="modal-backdrop show"></div>
      <div className="modal show d-block position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center" tabIndex="-1" aria-modal="true" style={{ zIndex: 1050 }}>
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content shadow-sm border">
            <div className="modal-header border-0 pb-0">
              <h5 className="modal-title fw-bold text-center w-100">Enlazar cuenta con Google</h5>
              <button type="button" className="btn-close shadow-none" onClick={onClose} disabled={loading}></button>
            </div>
            
            <div className="modal-body px-4 pt-2">
              <p>
                Ya existe una cuenta asociada a <strong>{googleData?.email}</strong> que utiliza correo electrónico y contraseña para iniciar sesión.
              </p>
              
              <p className="fw-semibold">
                ¿Quieres vincular tu perfil de Google a esta cuenta?
              </p>
              
              <div className="alert alert-warning py-3 d-flex align-items-start shadow-sm border">
                <i className="bi bi-exclamation-triangle me-2 fs-4"></i>
                <div>
                  <strong>Atención:</strong> a partir de ahora deberás iniciar sesión siempre con Google.
                </div>
              </div>
              
              {error && (
                <div className="alert alert-danger my-3 d-flex align-items-start shadow-sm border">
                  <i className="bi bi-exclamation-circle me-2 fs-4"></i>
                  <div>{error}</div>
                </div>
              )}
            </div>
            
            <div className="modal-footer border-0 pt-0">
              <button 
                type="button" 
                className="btn btn-link text-decoration-none" 
                onClick={onClose}
                disabled={loading}
              >
                Cancelar
              </button>
              <button 
                type="button" 
                className="btn btn-primary px-4" 
                onClick={handleConfirm}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Enlazando...
                  </>
                ) : (
                  'Enlazar con Google'
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LinkGoogleAccountModal;
