import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { resetPassword, getCurrentUser } from '../../../services/authService';

export default function ResetPasswordModal() {
  const { token } = useParams();
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!password || password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }
    if (password !== confirm) {
      setError('Las contraseñas no coinciden');
      return;
    }
    try {
      const data = await resetPassword(token, password);
      sessionStorage.setItem('token', data.token);
      const userData = await getCurrentUser();
      setUser(userData);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message === 'Token inválido o expirado' ? 'Enlace inválido o expirado.' : err.message);
    }
  };

  return (
    <>
      <h3 className="mb-4 text-center fw-bold w-100">Restablecer contraseña</h3>
      {error && <div className="alert alert-danger text-center small mb-3 fade-in">{error}</div>}
      <form onSubmit={handleSubmit} className="login-form">
        <div className="mb-3 form-floating">
          <input
            id="password"
            type="password"
            placeholder="Nueva contraseña"
            className={`form-control ${error ? 'is-invalid' : ''}`}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <label htmlFor="password">Nueva contraseña</label>
        </div>
        <div className="mb-4 form-floating">
          <input
            id="confirm"
            type="password"
            placeholder="Confirmar contraseña"
            className={`form-control ${error ? 'is-invalid' : ''}`}
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
          />
          <label htmlFor="confirm">Confirmar contraseña</label>
        </div>
        <button type="submit" className="btn btn-primary w-100 py-2">Cambiar contraseña</button>
      </form>
    </>
  );
}
