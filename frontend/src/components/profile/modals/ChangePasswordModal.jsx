// src/components/profile/ChangePasswordModal.jsx
import { useState } from 'react';
import { useLoader } from '../../../context/LoaderContext';
import { changePassword } from '../../../services/userService';

export default function ChangePasswordModal({ onClose }) {
  const { setShowLoader } = useLoader();
  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setPasswords((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setErrors((prev) => ({ ...prev, [e.target.name]: '' }));
    setSubmitError('');
  };

  const handleSubmit = async () => {
    const errs = {};

    if (!passwords.currentPassword) {
      errs.currentPassword = 'Introduce tu contraseña actual';
    }

    if (!passwords.newPassword) {
      errs.newPassword = 'Introduce una nueva contraseña';
    } else if (passwords.newPassword.length < 6) {
      errs.newPassword = 'Debe tener al menos 6 caracteres';
    }

    if (!passwords.confirmPassword) {
      errs.confirmPassword = 'Confirma la nueva contraseña';
    } else if (passwords.newPassword !== passwords.confirmPassword) {
      errs.confirmPassword = 'Las contraseñas no coinciden';
    }

    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    try {
      setShowLoader(true);
      // use userService to change password
      await changePassword(passwords.currentPassword, passwords.newPassword);
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 1000);
    } catch (err) {
      const msg = err.message || '';
      if (err.isGoogleAccount) {
        setSubmitError('Los usuarios que inician sesión con Google no pueden cambiar su contraseña');
      } else if (msg.includes('actual no es correcta') || msg.includes('Contraseña actual incorrecta')) {
        setErrors({ currentPassword: 'Contraseña actual incorrecta' });
      } else {
        setSubmitError(msg || 'Error al cambiar la contraseña');
      }
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
            <h5 className="modal-title text-center w-100">Cambiar contraseña</h5>
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
            {success && <div className="text-success">Contraseña actualizada correctamente</div>}
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
