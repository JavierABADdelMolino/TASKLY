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
    gender: ''
  });

  const [validationErrors, setValidationErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Para campos de formulario
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
      
      // Si es un enlace de cuenta, enviar el tokenId
      if (googleData.needsLinking && googleData.tokenId) {
        formDataToSend.append('tokenId', googleData.tokenId);
      }
      
      // Establecer avatar: prioridad al de Google, o predeterminado
      if (googleData?.avatarUrl) {
        // Si hay avatar de Google
        formDataToSend.append('avatarUrl', googleData.avatarUrl);
      } else {
        // Si no hay avatar de Google, se usará el predeterminado según género
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
    <form onSubmit={handleSubmit} className="login-form d-flex flex-column justify-content-between h-100">
      <h3 className="mb-4 text-center fw-bold">Completar tu perfil</h3>
      
      {error && (
        <div className="alert alert-danger text-center small mb-3 fade-in">{error}</div>
      )}
      
      <div className="mb-3 text-center">
        <img 
          src={
            googleData?.avatarUrl
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
        {/* Fecha de nacimiento y género en la misma línea */}
        <div className="row mb-4">
          <div className="col-6">
            <div className="form-floating">
              <input
                type="date"
                id="birthDate"
                name="birthDate"
                placeholder="Fecha de nacimiento"
                className={`form-control ${validationErrors.birthDate ? 'is-invalid' : ''}`}
                value={formData.birthDate}
                onChange={handleChange}
                max={new Date().toISOString().split('T')[0]} // No permitir fechas futuras
              />
              <label htmlFor="birthDate">Fecha de nacimiento</label>
              {validationErrors.birthDate && (
                <small className="text-danger d-block mt-1">{validationErrors.birthDate}</small>
              )}
            </div>
          </div>
          
          <div className="col-6">
            <div className="form-floating">
              <select
                id="gender"
                name="gender"
                className={`form-select ${validationErrors.gender ? 'is-invalid' : ''}`}
                value={formData.gender}
                onChange={handleChange}
              >
                <option value="">Selecciona</option>
                <option value="male">Masculino</option>
                <option value="female">Femenino</option>
              </select>
              <label htmlFor="gender">Género</label>
              {validationErrors.gender && (
                <small className="text-danger d-block mt-1">{validationErrors.gender}</small>
              )}
            </div>
          </div>
        </div>
        
        <div className="d-flex justify-content-between mt-4">
          <button 
            type="button" 
            className="btn btn-outline-secondary px-4"
            onClick={onCancel}
            disabled={loading}
          >
            Cancelar
          </button>
          <button 
            type="submit" 
            className="btn btn-primary px-4 py-2 fw-medium"
            disabled={loading}
          >
            {loading ? 'Procesando...' : 'Completar registro'}
          </button>
        </div>
    </form>
  );
};

export default GoogleRegisterComplete;
