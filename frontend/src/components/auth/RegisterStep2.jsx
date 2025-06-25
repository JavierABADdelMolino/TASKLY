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
    <form onSubmit={handleSubmit} className="d-flex flex-column justify-content-between h-100">
      <h3 className="mb-3 text-center">Información personal</h3>

      {/* errores generales */}
      {errors.general && (
        <div className="alert alert-danger text-center small mb-3">
          {errors.general}
        </div>
      )}

      <div className="mb-3">
        <label htmlFor="firstName" className="form-label">Nombre</label>
        {(() => {
          const msg = localErrors.firstName || errors.firstName;
          return (
            <>
              <input
                id="firstName"
                type="text"
                className={`form-control ${msg ? 'is-invalid' : ''}`}
                value={data.firstName}
                onChange={(e) => onChange('firstName', e.target.value)}
              />
              {msg && <small className="text-danger">{msg}</small>}
            </>
          );
        })()}
      </div>

      <div className="mb-3">
        <label htmlFor="lastName" className="form-label">Apellidos</label>
        {(() => {
          const msg = localErrors.lastName || errors.lastName;
          return (
            <>
              <input
                id="lastName"
                type="text"
                className={`form-control ${msg ? 'is-invalid' : ''}`}
                value={data.lastName}
                onChange={(e) => onChange('lastName', e.target.value)}
              />
              {msg && <small className="text-danger">{msg}</small>}
            </>
          );
        })()}
      </div>

      {/* Fecha de nacimiento y sexo en la misma línea */}
      <div className="row mb-3">
        <div className="col-6">
          <label htmlFor="birthDate" className="form-label">Fecha de nacimiento</label>
          {(() => {
            const msg = localErrors.birthDate || errors.birthDate;
            return (
              <>
                <input
                  id="birthDate"
                  type="date"
                  className={`form-control ${msg ? 'is-invalid' : ''}`}
                  value={data.birthDate}
                  onChange={(e) => onChange('birthDate', e.target.value)}
                />
                {msg && <small className="text-danger">{msg}</small>}
              </>
            );
          })()}
        </div>
        <div className="col-6">
          <label htmlFor="gender" className="form-label">Género</label>
          {(() => {
            const msg = localErrors.gender || errors.gender;
            return (
              <>
                <select
                  id="gender"
                  className={`form-select ${msg ? 'is-invalid' : ''}`}
                  value={data.gender}
                  onChange={(e) => onChange('gender', e.target.value)}
                >
                  <option value="">Selecciona</option>
                  <option value="male">Hombre</option>
                  <option value="female">Mujer</option>
                </select>
                {msg && <small className="text-danger">{msg}</small>}
              </>
            );
          })()}
        </div>
      </div>

      <div className="mb-4">
        <label htmlFor="avatar" className="form-label">Foto de perfil (opcional)</label>
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

      <div className="d-flex justify-content-between">
        <button type="button" className="btn btn-secondary" onClick={onBack}>
          Atrás
        </button>
        <button type="submit" className="btn btn-success">
          Registrarse
        </button>
      </div>
    </form>
  );
};

export default RegisterStep2;
