import { useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { forgotPassword } from '../../../services/authService';

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
      <h3 className="mb-4 text-center fw-bold">Recuperar contraseña</h3>
      
      {msg && (
        <div className="alert alert-success text-center small mb-3 fade-in">
          <i className="bi bi-check-circle me-2"></i>
          {msg}
        </div>
      )}
      
      {error && (
        <div className="alert alert-danger text-center small mb-3 fade-in">
          <i className="bi bi-exclamation-circle me-2"></i>
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="login-form">
        <p className="text-muted mb-3">
          Introduce tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña.
        </p>
        
        <div className="mb-4 form-floating">
          <input
            id="email"
            type="email"
            placeholder="nombre@ejemplo.com"
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <label htmlFor="email">Correo electrónico</label>
        </div>
        
        <div className="d-flex justify-content-between">
          <button type="button" className="btn btn-link text-decoration-none" onClick={onClose}>
            Cancelar
          </button>
          <button type="submit" className="btn btn-primary px-4 py-2">
            Enviar email
          </button>
        </div>
      </form>
    </>
  );
}
