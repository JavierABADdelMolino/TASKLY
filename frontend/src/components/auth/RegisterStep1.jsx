import { useState } from 'react';

const RegisterStep1 = ({ data, onChange, onNext, errors = {} }) => {
  const [localErrors, setLocalErrors] = useState({});

  const validate = () => {
    const newErrors = {};

    if (!/.+@.+\..+/.test(data.email)) {
      newErrors.email = 'Correo electrónico no válido';
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
      if (errors.email || errors.password || errors.confirmPassword || errors.general) {
        return;
      }
      onNext();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="login-form">
      <h3 className="mb-4 text-center fw-bold w-100">Información de acceso</h3>

      {errors.general && (
        <div className="alert alert-danger text-center small mb-3 fade-in">
          {errors.general}
        </div>
      )}

      <div className="mb-3 form-floating">
        <input
          id="email"
          type="email"
          placeholder="nombre@ejemplo.com"
          className={`form-control ${localErrors.email || errors.email ? 'is-invalid' : ''}`}
          value={data.email}
          onChange={(e) => onChange('email', e.target.value)}
        />
        <label htmlFor="email">Correo electrónico</label>
        {(localErrors.email || errors.email) && (
          <small className="text-danger d-block mt-1">{localErrors.email || errors.email}</small>
        )}
      </div>

      <div className="mb-3 form-floating">
        <input
          id="password"
          type="password"
          placeholder="Contraseña"
          className={`form-control ${localErrors.password || errors.password ? 'is-invalid' : ''}`}
          value={data.password}
          onChange={(e) => onChange('password', e.target.value)}
        />
        <label htmlFor="password">Contraseña</label>
        {(localErrors.password || errors.password) && (
          <small className="text-danger d-block mt-1">{localErrors.password || errors.password}</small>
        )}
      </div>

      <div className="mb-4 form-floating">
        <input
          id="confirmPassword"
          type="password"
          placeholder="Confirmar contraseña"
          className={`form-control ${localErrors.confirmPassword || errors.confirmPassword ? 'is-invalid' : ''}`}
          value={data.confirmPassword}
          onChange={(e) => onChange('confirmPassword', e.target.value)}
        />
        <label htmlFor="confirmPassword">Confirmar contraseña</label>
        {(localErrors.confirmPassword || errors.confirmPassword) && (
          <small className="text-danger d-block mt-1">
            {localErrors.confirmPassword || errors.confirmPassword}
          </small>
        )}
      </div>

      <button type="submit" className="btn btn-primary w-100 py-2">
        Siguiente
      </button>
    </form>
  );
};

export default RegisterStep1;
