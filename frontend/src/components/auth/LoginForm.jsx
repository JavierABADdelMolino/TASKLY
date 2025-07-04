import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { login, getCurrentUser, forgotPassword } from '../../services/authService';
import GoogleLoginButton from './GoogleLoginButton';
import Separator from '../common/Separator';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotMsg, setForgotMsg] = useState('');
  const [forgotError, setForgotError] = useState('');
  const [loading, setLoading] = useState(false);
  const { setUser } = useAuth();
  const navigate = useNavigate();

  const validate = () => {
    const newErrors = {};

    if (!/.+@.+\..+/.test(email)) {
      newErrors.email = 'Correo no válido';
    }

    if (!password) {
      newErrors.password = 'La contraseña es obligatoria';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');
    setLoading(true);

    if (!validate()) {
      setLoading(false);
      return;
    }

    try {
      const data = await login(email, password);
      sessionStorage.setItem('token', data.token);

      const userData = await getCurrentUser();

      setUser(userData);
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      // Errores específicos
      if (err.message === 'Email no registrado') {
        setErrors((prev) => ({ ...prev, email: 'Este correo no está registrado.' }));
      } else if (err.message === 'Contraseña incorrecta') {
        setErrors((prev) => ({ ...prev, password: 'Contraseña incorrecta.' }));
      } else {
        setServerError(err.message || 'Error de conexión con el servidor');
      }
      setLoading(false);
    }
  };

  const handleForgotSubmit = async (e) => {
    e.preventDefault();
    setForgotMsg('');
    setForgotError('');
    try {
      const data = await forgotPassword(forgotEmail);
      setForgotMsg(data.message || 'Email de recuperación enviado.');
    } catch (err) {
      if (err.isGoogleAccount) {
        setForgotError('Esta cuenta usa Google para iniciar sesión');
      } else {
        setForgotError(err.message);
      }
    }
  };

  // Manejar el inicio de sesión con Google - memorizado con useCallback para evitar re-renderizados
  const handleGoogleLogin = useCallback(async (googleData) => {
    try {
      // Si necesita enlazar cuenta (email existe pero no está vinculado a Google)
      if (googleData.needsLinking || googleData.code === 'LINK_GOOGLE') {
        console.log('Usuario necesita enlazar cuenta de Google', googleData);
        // Guardamos los datos en sessionStorage para que persistan entre redirecciones
        sessionStorage.setItem('googleAuthData', JSON.stringify(googleData));
        // Enviamos evento para abrir el modal de enlace desde cualquier página
        window.dispatchEvent(new CustomEvent('openLinkGoogleModal', { detail: googleData }));
        return;
      }
      
      // Si necesita completar registro (nuevo usuario con Google)
      if (googleData.needsCompletion || googleData.code === 'NEEDS_COMPLETION') {
        console.log('Usuario de Google necesita completar registro', googleData);
        sessionStorage.setItem('googleAuthData', JSON.stringify(googleData));
        setServerError(''); // Limpiar cualquier error previo
        // Abrir modal de registro directamente con los datos de Google
        window.dispatchEvent(new CustomEvent('openAuthModal', { detail: 'register' }));
        return;
      }
      
      // Si Google ya completó todos los datos necesarios (login normal)
      const userData = await getCurrentUser();
      setUser(userData);
      navigate('/dashboard');
    } catch (err) {
      console.error('Error en inicio de sesión con Google:', err);
      setServerError(err.message || 'Error al iniciar sesión con Google');
    }
  }, [setUser, navigate, setServerError]);

  return (
    <> 
      <form onSubmit={handleSubmit} className="login-form">
        <h3 className="mb-4 text-center fw-bold">Iniciar sesión</h3>

        {serverError && (
          <div className="alert alert-danger text-center small mb-3 fade-in shadow-sm border">
            <i className="bi bi-exclamation-circle me-1"></i>
            {serverError}
          </div>
        )}

        <div className="mb-3 form-floating">
          <input
            id="email"
            type="email"
            className={`form-control ${errors.email ? 'is-invalid' : ''}`}
            placeholder="nombre@ejemplo.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
          />
          <label htmlFor="email">Correo electrónico</label>
          {errors.email && <small className="text-danger d-block mt-1">{errors.email}</small>}
        </div>

        <div className="mb-4 form-floating">
          <input
            id="password"
            type="password"
            className={`form-control ${errors.password ? 'is-invalid' : ''}`}
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
          />
          <label htmlFor="password">Contraseña</label>
          {errors.password && <small className="text-danger d-block mt-1">{errors.password}</small>}
        </div>

        <button 
          type="submit" 
          className="btn btn-primary w-100 py-2"
          disabled={loading}
        >
          {loading ? (
            <>
              <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
              Accediendo...
            </>
          ) : 'Entrar'}
        </button>
        
        <div className="text-center mt-2">
          <span>
            <button 
              type="button" 
              className="btn btn-link p-0" 
              onClick={() => setShowForgotModal(true)}
              disabled={loading}
            >
              ¿Has olvidado tu contraseña?
            </button>
          </span>
        </div>

        {/* Separador y botón de Google */}
        <div className="mt-4 mb-2">
          <Separator text="O" />
          <GoogleLoginButton onGoogleSignIn={handleGoogleLogin} />
        </div>
      </form>

      {showForgotModal && (
        <>
          <div className="modal-backdrop show"></div>
          <div className="modal show d-block position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center" tabIndex="-1" aria-modal="true">
            <div className="modal-dialog modal-dialog-centered" role="document">
              <div className="modal-content">
                <form onSubmit={handleForgotSubmit}>
                  <div className="modal-header border-0 pb-0">
                    <h5 className="modal-title fw-bold text-center w-100">Recuperar contraseña</h5>
                    <button type="button" className="btn-close shadow-none" onClick={() => setShowForgotModal(false)}></button>
                  </div>
                  
                  <div className="modal-body px-4 pt-2">
                    {!forgotMsg && (
                      <p className="text-muted mb-4">
                        Introduce tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña.
                      </p>
                    )}
                    
                    {forgotMsg && (
                      <div className="alert alert-success text-center small py-3 fade-in shadow-sm border">
                        <i className="bi bi-check-circle me-2"></i>
                        {forgotMsg}
                      </div>
                    )}
                    
                    {forgotError && (
                      <div className="alert alert-danger text-center small py-3 fade-in shadow-sm border">
                        <i className="bi bi-exclamation-circle me-2"></i>
                        {
                          forgotError === 'Email no registrado' 
                            ? 'Este correo no está registrado.' 
                            : forgotError.includes('usa Google') 
                              ? 'Esta cuenta usa Google para iniciar sesión. Utiliza el botón "Continuar con Google" para acceder.'
                              : forgotError
                        }
                      </div>
                    )}
                    
                    <div className="mb-4 form-floating">
                      <input
                        id="forgotEmail"
                        type="email"
                        className="form-control"
                        placeholder="nombre@ejemplo.com"
                        value={forgotEmail}
                        onChange={e => setForgotEmail(e.target.value)}
                        required
                      />
                      <label htmlFor="forgotEmail">Correo electrónico</label>
                    </div>
                  </div>
                  
                  <div className="modal-footer border-0 pt-0">
                    <button type="button" className="btn btn-link text-decoration-none" onClick={() => setShowForgotModal(false)}>
                      Cancelar
                    </button>
                    <button type="submit" className="btn btn-primary px-4">
                      Enviar email
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default LoginForm;
