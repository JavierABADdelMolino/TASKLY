import { useState } from 'react';

const RegisterStep2 = ({ data, onChange, onBack, onSubmit, errors = {} }) => {
  const [localErrors, setLocalErrors] = useState({});

  const validate = () => {
    const newErrors = {};

    if (!data.firstName || data.firstName.trim().length < 2) {
      newErrors.firstName = 'El nombre debe tener al menos 2 caracteres';
    }

    if (!data.lastName || data.lastName.trim().length < 2) {
      newErrors.lastName = 'El apellido debe tener al menos 2 caracteres';
    }

    if (!data.birthDate) {
      newErrors.birthDate = 'La fecha de nacimiento es obligatoria';
    }

    if (!['male', 'female'].includes(data.gender)) {
      newErrors.gender = 'Selecciona una opción válida';
    }

    setLocalErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSubmit();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="login-form d-flex flex-column justify-content-between h-100">
      <h3 className="mb-4 text-center fw-bold">Información personal</h3>

      {/* errores generales */}
      {errors.general && (
        <div className="alert alert-danger text-center small mb-3 fade-in">
          {errors.general}
        </div>
      )}

      <div className="mb-3 form-floating">
        <input
          id="firstName"
          type="text"
          placeholder="Nombre"
          className={`form-control ${localErrors.firstName || errors.firstName ? 'is-invalid' : ''}`}
          value={data.firstName}
          onChange={(e) => onChange('firstName', e.target.value)}
        />
        <label htmlFor="firstName">Nombre</label>
        {(localErrors.firstName || errors.firstName) && (
          <small className="text-danger d-block mt-1">
            {localErrors.firstName || errors.firstName}
          </small>
        )}
      </div>

      <div className="mb-3 form-floating">
        <input
          id="lastName"
          type="text"
          placeholder="Apellidos"
          className={`form-control ${localErrors.lastName || errors.lastName ? 'is-invalid' : ''}`}
          value={data.lastName}
          onChange={(e) => onChange('lastName', e.target.value)}
        />
        <label htmlFor="lastName">Apellidos</label>
        {(localErrors.lastName || errors.lastName) && (
          <small className="text-danger d-block mt-1">
            {localErrors.lastName || errors.lastName}
          </small>
        )}
      </div>

      {/* Fecha de nacimiento y sexo en la misma línea */}
      <div className="row mb-3">
        <div className="col-6">
          <div className="form-floating">
            <input
              id="birthDate"
              type="date"
              placeholder="Fecha de nacimiento"
              className={`form-control ${localErrors.birthDate || errors.birthDate ? 'is-invalid' : ''}`}
              value={data.birthDate}
              onChange={(e) => onChange('birthDate', e.target.value)}
            />
            <label htmlFor="birthDate">Fecha de nacimiento</label>
            {(localErrors.birthDate || errors.birthDate) && (
              <small className="text-danger d-block mt-1">
                {localErrors.birthDate || errors.birthDate}
              </small>
            )}
          </div>
        </div>
        <div className="col-6">
          <div className="form-floating">
            <select
              id="gender"
              className={`form-select ${localErrors.gender || errors.gender ? 'is-invalid' : ''}`}
              value={data.gender}
              onChange={(e) => onChange('gender', e.target.value)}
            >
              <option value="">Selecciona</option>
              <option value="male">Masculino</option>
              <option value="female">Femenino</option>
            </select>
            <label htmlFor="gender">Género</label>
            {(localErrors.gender || errors.gender) && (
              <small className="text-danger d-block mt-1">
                {localErrors.gender || errors.gender}
              </small>
            )}
          </div>
        </div>
      </div>

      <div className="mb-4">
        <label htmlFor="avatar" className="form-label fw-medium">Foto de perfil (opcional)</label>
        <input
          id="avatar"
          type="file"
          className="form-control"
          accept="image/jpeg,image/png,image/jpg"
          onChange={(e) => onChange('avatarFile', e.target.files[0])}
        />
        <div className="text-muted small mt-2">
          Si no subes una imagen, se usará un avatar predeterminado según tu género.
          <br />
          Formatos permitidos: JPG, JPEG, PNG. Tamaño máximo: 2MB.
        </div>
      </div>

      <div className="d-flex justify-content-between mt-2">
        <button type="button" className="btn btn-outline-secondary px-4" onClick={onBack}>
          Atrás
        </button>
        <button type="submit" className="btn btn-primary px-4 py-2 fw-medium">
          Registrarse
        </button>
      </div>
    </form>
  );
};

export default RegisterStep2;
