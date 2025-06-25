import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { completeGoogleRegister } from '../../services/authService';

const GoogleRegisterComplete = ({ googleData, onCancel }) => {
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    birthDate: '',
    gender: '',
    customAvatar: null
  });

  const [validationErrors, setValidationErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    
    // Manejar archivos
    if (type === 'file' && files?.length > 0) {
      setFormData(prev => ({ 
        ...prev, 
        customAvatar: files[0]
      }));
      return;
    }
    
    // Para otros campos
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Limpiar errores al editar
    if (validationErrors[name]) {
      setValidationErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const errors = {};
    
    if (!formData.birthDate) {
      errors.birthDate = 'La fecha de nacimiento es obligatoria';
    } else {
      const today = new Date();
      const birthDate = new Date(formData.birthDate);
      const minAge = 13; // Edad mínima
      
      // Calcular edad
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      
      if (age < minAge) {
        errors.birthDate = `Debes tener al menos ${minAge} años para registrarte`;
      }
    }
    
    if (!formData.gender) {
      errors.gender = 'El género es obligatorio';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validate()) return;
    
    try {
      setLoading(true);
      setError('');
      
      // Preparar FormData para enviar (permite archivos)
      const formDataToSend = new FormData();
      
      // Añadir campos básicos
      formDataToSend.append('firstName', googleData.firstName);
      formDataToSend.append('lastName', googleData.lastName);
      formDataToSend.append('email', googleData.email);
      formDataToSend.append('googleId', googleData.googleId);
      formDataToSend.append('birthDate', formData.birthDate);
      formDataToSend.append('gender', formData.gender);
      
      // Manejar avatar: prioridad al subido, luego Google, luego por defecto
      if (formData.customAvatar) {
        // Si se subió un archivo de avatar personalizado
        formDataToSend.append('avatar', formData.customAvatar);
      } else if (googleData?.avatarUrl) {
        // Si hay avatar de Google y no se subió ninguno
        formDataToSend.append('avatarUrl', googleData.avatarUrl);
      } else {
        // Si no hay ni subido ni de Google, se usará el predeterminado según género
        formDataToSend.append('avatarUrl', '');
      }
      
      // Enviar datos al servidor
      const result = await completeGoogleRegister(formDataToSend);
      
      // Guardar token y redireccionar
      sessionStorage.setItem('token', result.token);
      setUser(result.user);
      navigate('/dashboard');
    } catch (err) {
      console.error('Error al completar el registro:', err);
      
      if (err.validation) {
        setValidationErrors(err.validation);
      } else {
        setError(err.message || 'Error al completar el registro');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="complete-google-register">
      <h3 className="mb-3 text-center">Completar tu perfil</h3>
      
      {error && (
        <div className="alert alert-danger text-center small mb-3">{error}</div>
      )}
      
      <div className="mb-3 text-center">
        <img 
          src={
            formData.customAvatar
              ? URL.createObjectURL(formData.customAvatar)
              : googleData?.avatarUrl
                ? googleData.avatarUrl
                : `${process.env.REACT_APP_URL}/public/avatars/default-avatar-${formData.gender || 'male'}.png`
          }
          alt="Avatar" 
          onError={(e) => {
            e.target.onerror = null; 
            e.target.src = `${process.env.REACT_APP_URL}/public/avatars/default-avatar-${formData.gender || 'male'}.png`;
          }}
          className="rounded-circle border"
          style={{ width: '100px', height: '100px', objectFit: 'cover' }} 
        />
        <div className="mt-2">
          <strong>{googleData?.firstName} {googleData?.lastName}</strong>
          <div className="text-muted small">{googleData?.email}</div>
        </div>
      </div>
      
      <p className="text-center small mb-4">
        Para finalizar tu registro necesitamos unos datos adicionales:
      </p>
      
      <form onSubmit={handleSubmit}>
        {/* Fecha de nacimiento y género en la misma línea */}
        <div className="row mb-4">
          <div className="col-6">
            <label htmlFor="birthDate" className="form-label">Fecha de nacimiento</label>
            <input
              type="date"
              id="birthDate"
              name="birthDate"
              className={`form-control ${validationErrors.birthDate ? 'is-invalid' : ''}`}
              value={formData.birthDate}
              onChange={handleChange}
              max={new Date().toISOString().split('T')[0]} // No permitir fechas futuras
            />
            {validationErrors.birthDate && (
              <div className="invalid-feedback">{validationErrors.birthDate}</div>
            )}
          </div>
          
          <div className="col-6">
            <label htmlFor="gender" className="form-label">Género</label>
            <select
              id="gender"
              name="gender"
              className={`form-select ${validationErrors.gender ? 'is-invalid' : ''}`}
              value={formData.gender}
              onChange={handleChange}
            >
              <option value="">Selecciona</option>
              <option value="male">Hombre</option>
              <option value="female">Mujer</option>
            </select>
            {validationErrors.gender && (
              <div className="invalid-feedback">{validationErrors.gender}</div>
            )}
          </div>
        </div>
        
        <div className="mb-4">
          <label className="form-label">Foto de perfil (opcional)</label>
          <div className="mt-1">
            <input
              type="file"
              className="form-control"
              id="customAvatar"
              name="customAvatar"
              accept="image/jpeg,image/png,image/jpg"
              onChange={handleChange}
            />
            <div className="text-muted small mt-2">
              {googleData?.avatarUrl ? (
                <>Si no subes una imagen, se usará tu perfil de Google. </>
              ) : (
                <>Si no subes una imagen, se usará un avatar predeterminado según tu género. </>
              )}
              <br />
              Formatos permitidos: JPG, JPEG, PNG. Tamaño máximo: 2MB.
            </div>
          </div>
        </div>
        
        <div className="d-flex gap-2">
          <button 
            type="button" 
            className="btn btn-outline-secondary flex-grow-1"
            onClick={onCancel}
            disabled={loading}
          >
            Cancelar
          </button>
          <button 
            type="submit" 
            className="btn btn-primary flex-grow-1"
            disabled={loading}
          >
            {loading ? 'Procesando...' : 'Completar registro'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default GoogleRegisterComplete;
