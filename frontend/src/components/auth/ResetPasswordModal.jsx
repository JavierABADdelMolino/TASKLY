import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { resetPassword, getCurrentUser } from '../../services/authService';

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
      <h5 className="mb-3 text-center">Restablecer contraseña</h5>
      {error && <div className="alert alert-danger text-center small mb-2">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">Nueva contraseña</label>
          <input
            id="password"
            type="password"
            className={`form-control ${error ? 'is-invalid' : ''}`}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="confirm" className="form-label">Confirmar contraseña</label>
          <input
            id="confirm"
            type="password"
            className={`form-control ${error ? 'is-invalid' : ''}`}
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
          />
        </div>
        <button type="submit" className="btn btn-primary w-100">Cambiar contraseña</button>
      </form>
    </>
  );
}
