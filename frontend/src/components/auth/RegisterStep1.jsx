import { useState } from 'react';

const RegisterStep1 = ({ data, onChange, onNext, errors = {} }) => {
  const [localErrors, setLocalErrors] = useState({});

  const validate = () => {
    const newErrors = {};

    if (!/.+@.+\..+/.test(data.email)) {
      newErrors.email = 'Correo electrónico no válido';
    }

    if (data.username.trim().length < 3) {
      newErrors.username = 'El nombre de usuario debe tener al menos 3 caracteres';
    }

    if (data.password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    }

    if (data.confirmPassword !== data.password) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }

    setLocalErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Validación local
    if (validate()) {
      // Si hay errores del servidor, no avanzar
      if (errors.email || errors.username || errors.password || errors.confirmPassword || errors.general) {
        return;
      }
      onNext();
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3 className="mb-3 text-center">Información de acceso</h3>

      {errors.general && (
        <div className="alert alert-danger text-center small mb-3">
          {errors.general}
        </div>
      )}

      <div className="mb-3">
        <label htmlFor="email" className="form-label">Correo electrónico</label>
        <input
          id="email"
          type="email"
          className={`form-control ${localErrors.email || errors.email ? 'is-invalid' : ''}`}
          value={data.email}
          onChange={(e) => onChange('email', e.target.value)}
        />
        {localErrors.email && <small className="text-danger">{localErrors.email}</small>}
        {errors.email && <small className="text-danger">{errors.email}</small>}
      </div>

      <div className="mb-3">
        <label htmlFor="username" className="form-label">Nombre de usuario</label>
        <input
          id="username"
          type="text"
          className={`form-control ${localErrors.username || errors.username ? 'is-invalid' : ''}`}
          value={data.username}
          onChange={(e) => onChange('username', e.target.value)}
        />
        {localErrors.username && <small className="text-danger">{localErrors.username}</small>}
        {errors.username && <small className="text-danger">{errors.username}</small>}
      </div>

      <div className="mb-3">
        <label htmlFor="password" className="form-label">Contraseña</label>
        <input
          id="password"
          type="password"
          className={`form-control ${localErrors.password || errors.password ? 'is-invalid' : ''}`}
          value={data.password}
          onChange={(e) => onChange('password', e.target.value)}
        />
        {localErrors.password && <small className="text-danger">{localErrors.password}</small>}
        {errors.password && <small className="text-danger">{errors.password}</small>}
      </div>

      <div className="mb-3">
        <label htmlFor="confirmPassword" className="form-label">Confirmar contraseña</label>
        <input
          id="confirmPassword"
          type="password"
          className={`form-control ${localErrors.confirmPassword || errors.confirmPassword ? 'is-invalid' : ''}`}
          value={data.confirmPassword}
          onChange={(e) => onChange('confirmPassword', e.target.value)}
        />
        {localErrors.confirmPassword && (
          <small className="text-danger">{localErrors.confirmPassword}</small>
        )}
        {errors.confirmPassword && (
          <small className="text-danger">{errors.confirmPassword}</small>
        )}
      </div>

      <button type="submit" className="btn btn-primary w-100">
        Siguiente
      </button>
    </form>
  );
};

export default RegisterStep1;
