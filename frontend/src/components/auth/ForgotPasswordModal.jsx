import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { forgotPassword } from '../../services/authService';

export default function ForgotPasswordModal({ onClose }) {
  const [email, setEmail] = useState('');
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg('');
    setError('');
    try {
      const data = await forgotPassword(email);
      setMsg(data.message);
    } catch (err) {
      setError(err.message === 'Email no registrado' ? 'Este correo no está registrado.' : err.message);
    }
  };

  return (
    <>
      <h5 className="mb-3 text-center">Recuperar contraseña</h5>
      {msg && <div className="alert alert-success text-center small mb-2">{msg}</div>}
      {error && <div className="alert alert-danger text-center small mb-2">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">Correo electrónico</label>
          <input
            id="email"
            type="email"
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="d-flex justify-content-end gap-2">
          <button type="button" className="btn btn-secondary" onClick={onClose}>Cerrar</button>
          <button type="submit" className="btn btn-primary">Enviar email</button>
        </div>
      </form>
    </>
  );
}
