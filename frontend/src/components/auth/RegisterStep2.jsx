import { useState } from 'react';

const RegisterStep2 = ({ data, onChange, onBack, onSubmit }) => {
  const [errors, setErrors] = useState({});

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

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(data);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="d-flex flex-column justify-content-between h-100">
      <h3 className="mb-3 text-center">Información personal</h3>

      <div className="mb-3">
        <label htmlFor="firstName" className="form-label">Nombre</label>
        <input
          id="firstName"
          type="text"
          className={`form-control ${errors.firstName ? 'is-invalid' : ''}`}
          value={data.firstName}
          onChange={(e) => onChange('firstName', e.target.value)}
        />
        {errors.firstName && <small className="text-danger">{errors.firstName}</small>}
      </div>

      <div className="mb-3">
        <label htmlFor="lastName" className="form-label">Apellidos</label>
        <input
          id="lastName"
          type="text"
          className={`form-control ${errors.lastName ? 'is-invalid' : ''}`}
          value={data.lastName}
          onChange={(e) => onChange('lastName', e.target.value)}
        />
        {errors.lastName && <small className="text-danger">{errors.lastName}</small>}
      </div>

      <div className="mb-3">
        <label htmlFor="birthDate" className="form-label">Fecha de nacimiento</label>
        <input
          id="birthDate"
          type="date"
          className={`form-control ${errors.birthDate ? 'is-invalid' : ''}`}
          value={data.birthDate}
          onChange={(e) => onChange('birthDate', e.target.value)}
        />
        {errors.birthDate && <small className="text-danger">{errors.birthDate}</small>}
      </div>

      <div className="row mb-3">
        <div className="col-6">
          <label htmlFor="gender" className="form-label">Sexo</label>
          <select
            id="gender"
            className={`form-select ${errors.gender ? 'is-invalid' : ''}`}
            value={data.gender}
            onChange={(e) => onChange('gender', e.target.value)}
          >
            <option value="">Selecciona</option>
            <option value="male">Hombre</option>
            <option value="female">Mujer</option>
          </select>
          {errors.gender && <small className="text-danger">{errors.gender}</small>}
        </div>

        <div className="col-6">
          <label htmlFor="theme" className="form-label">Tema</label>
          <select
            id="theme"
            className="form-select"
            value={data.theme}
            onChange={(e) => onChange('theme', e.target.value)}
          >
            <option value="light">Claro</option>
            <option value="dark">Oscuro</option>
          </select>
        </div>
      </div>

      <div className="mb-4">
        <label htmlFor="avatar" className="form-label">Foto de perfil (opcional)</label>
        <input
          id="avatar"
          type="file"
          className="form-control"
          accept="image/*"
          onChange={(e) => onChange('avatarFile', e.target.files[0])}
        />
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
