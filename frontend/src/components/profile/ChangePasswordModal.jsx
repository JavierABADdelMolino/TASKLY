// src/components/profile/ChangePasswordModal.jsx

import { useState } from 'react';
import { useLoader } from '../../context/LoaderContext';

export default function ChangePasswordModal({ onClose }) {
  const { setShowLoader } = useLoader();
  const [passwords, setPasswords] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState('');

  const handleChange = e => {
    setPasswords(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async () => {
    const errs = {};
    if (!passwords.currentPassword) errs.currentPassword = 'Obligatorio';
    if (!passwords.newPassword) errs.newPassword = 'Obligatorio';
    if (passwords.newPassword !== passwords.confirmPassword) {
      errs.confirmPassword = 'No coincide';
    }
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }

    try {
      setShowLoader(true);
      const token = localStorage.getItem('token');
      const res = await fetch(
        `${process.env.REACT_APP_API_URL}/api/users/change-password`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            currentPassword: passwords.currentPassword,
            newPassword: passwords.newPassword
          })
        }
      );
      const data = await res.json();
      if (!res.ok) {
        setSubmitError(data.message || 'Error al cambiar contraseña');
      } else {
        onClose();
      }
    } catch {
      setSubmitError('Error de conexión');
    } finally {
      setShowLoader(false);
    }
  };

  return (
    <div
      className="modal d-block"
      tabIndex="-1"
      style={{
        backgroundColor: 'rgba(0,0,0,0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 0
      }}
    >
      <div className="modal-dialog modal-dialog-centered" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Cambiar contraseña</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            <div className="mb-3">
              <label className="form-label">Contraseña actual</label>
              <input
                type="password"
                name="currentPassword"
                className="form-control"
                value={passwords.currentPassword}
                onChange={handleChange}
              />
              {errors.currentPassword && <small className="text-danger">{errors.currentPassword}</small>}
            </div>
            <div className="mb-3">
              <label className="form-label">Nueva contraseña</label>
              <input
                type="password"
                name="newPassword"
                className="form-control"
                value={passwords.newPassword}
                onChange={handleChange}
              />
              {errors.newPassword && <small className="text-danger">{errors.newPassword}</small>}
            </div>
            <div className="mb-3">
              <label className="form-label">Confirmar contraseña</label>
              <input
                type="password"
                name="confirmPassword"
                className="form-control"
                value={passwords.confirmPassword}
                onChange={handleChange}
              />
              {errors.confirmPassword && <small className="text-danger">{errors.confirmPassword}</small>}
            </div>
            {submitError && <div className="text-danger">{submitError}</div>}
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancelar
            </button>
            <button type="button" className="btn btn-primary" onClick={handleSubmit}>
              Cambiar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
