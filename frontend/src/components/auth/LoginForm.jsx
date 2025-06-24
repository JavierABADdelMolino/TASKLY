import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { login, getCurrentUser, forgotPassword } from '../../services/authService';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotMsg, setForgotMsg] = useState('');
  const [forgotError, setForgotError] = useState('');
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

    if (!validate()) return;

    try {
      const data = await login(email, password);
      sessionStorage.setItem('token', data.token);

      const userData = await getCurrentUser();

      setUser(userData);
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      setServerError('Error de conexión con el servidor');
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
      setForgotError(err.message);
    }
  };

  return (
    <> 
      <form onSubmit={handleSubmit}>
        <h3 className="mb-3 text-center">Iniciar sesión</h3>

        {serverError && (
          <div className="alert alert-danger text-center small mb-3">
            {serverError}
          </div>
        )}

        <div className="mb-3">
          <label htmlFor="email" className="form-label">Correo electrónico</label>
          <input
            id="email"
            type="email"
            className={`form-control ${errors.email ? 'is-invalid' : ''}`}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {errors.email && <small className="text-danger">{errors.email}</small>}
        </div>

        <div className="mb-4">
          <label htmlFor="password" className="form-label">Contraseña</label>
          <input
            id="password"
            type="password"
            className={`form-control ${errors.password ? 'is-invalid' : ''}`}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {errors.password && <small className="text-danger">{errors.password}</small>}
        </div>

        <button type="submit" className="btn btn-primary w-100">Entrar</button>
        <div className="text-center mt-2">
          <button type="button" className="btn btn-link small" onClick={() => setShowForgotModal(true)}>
            ¿Has olvidado tu contraseña?
          </button>
        </div>
      </form>

      {showForgotModal && (
        <>
          <div className="modal-backdrop show"></div>
          <div className="modal show d-block position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center" tabIndex="-1" aria-modal="true">
            <div className="modal-dialog modal-dialog-centered" role="document">
              <div className="modal-content">
                <form onSubmit={handleForgotSubmit}>
                  <div className="modal-header">
                    <h5 className="modal-title">Recuperar contraseña</h5>
                    <button type="button" className="btn-close" onClick={() => setShowForgotModal(false)}></button>
                  </div>
                  <div className="modal-body">
                    {forgotMsg && <div className="alert alert-success text-center small">{forgotMsg}</div>}
                    {forgotError && <div className="alert alert-danger text-center small">{forgotError === 'Email no registrado' ? 'Este correo no está registrado.' : forgotError}</div>}
                    <div className="mb-3">
                      <label htmlFor="forgotEmail" className="form-label">Correo electrónico</label>
                      <input
                        id="forgotEmail"
                        type="email"
                        className="form-control"
                        value={forgotEmail}
                        onChange={e => setForgotEmail(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" onClick={() => setShowForgotModal(false)}>Cerrar</button>
                    <button type="submit" className="btn btn-primary">Enviar email</button>
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
