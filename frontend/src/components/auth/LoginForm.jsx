import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const API_BASE_URL = process.env.REACT_APP_API_URL;

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
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
      const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setServerError(data.message || 'Error al iniciar sesión');
        return;
      }

      sessionStorage.setItem('token', data.token);

      const userRes = await fetch(`${API_BASE_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${data.token}` },
      });

      const userData = await userRes.json();

      if (!userRes.ok) {
        setServerError(userData.message || 'No se pudo obtener el usuario');
        return;
      }

      setUser(userData);
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      setServerError('Error de conexión con el servidor');
    }
  };

  return (
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
    </form>
  );
};

export default LoginForm;
