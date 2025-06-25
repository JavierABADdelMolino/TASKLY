import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { linkGoogleAccount } from '../../../services/authService';

const LinkGoogleAccountModal = ({ data, onCancel }) => {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { setUser } = useAuth();
  const navigate = useNavigate();

  const handleConfirm = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Enlazar la cuenta de Google con la cuenta existente
      const result = await linkGoogleAccount(data.email, data.googleId, data.tokenId);
      
      // Guardar el token y establecer el usuario actual
      sessionStorage.setItem('token', result.token);
      setUser(result.user);
      
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
      <div className="modal show d-block position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center" tabIndex="-1" aria-modal="true">
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content">
            <div className="modal-header border-0 pb-0">
              <h5 className="modal-title fw-bold">Enlazar cuenta con Google</h5>
              <button type="button" className="btn-close shadow-none" onClick={onCancel} disabled={loading}></button>
            </div>
            
            <div className="modal-body px-4 pt-2">
              <p>
                Hemos detectado que ya existe una cuenta con el email <strong>{data.email}</strong> que 
                usa nombre y contraseña para iniciar sesión.
              </p>
              
              <p>
                ¿Quieres enlazar tu cuenta de Google con esta cuenta existente?
              </p>
              
              <div className="alert alert-warning py-3">
                <i className="bi bi-exclamation-triangle me-2"></i>
                <strong>Importante:</strong> Si enlazas las cuentas, ya no podrás iniciar sesión con 
                contraseña y deberás usar siempre Google para acceder.
              </div>
              
              {error && (
                <div className="alert alert-danger my-3 fade-in">
                  <i className="bi bi-exclamation-circle me-2"></i>
                  {error}
                </div>
              )}
            </div>
            
            <div className="modal-footer border-0 pt-0">
              <button 
                type="button" 
                className="btn btn-link text-decoration-none" 
                onClick={onCancel}
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
