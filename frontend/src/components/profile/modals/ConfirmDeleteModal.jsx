// src/components/profile/ConfirmDeleteModal.jsx

import { useState } from 'react';
import { useLoader } from '../../../context/LoaderContext';
import { useAuth } from '../../../context/AuthContext';
import { deleteUserAccount } from '../../../services/userService';

export default function ConfirmDeleteModal({ onClose }) {
  const { setShowLoader } = useLoader();
  const { logout } = useAuth();
  const [confirmText, setConfirmText] = useState('');
  const [error, setError] = useState('');

  const handleDelete = async () => {
    if (confirmText !== 'ELIMINAR') {
      setError('Escribe "ELIMINAR" para confirmar');
      return;
    }

    try {
      setShowLoader(true);
      // use userService to delete account
      await deleteUserAccount();
      logout();
      window.location.href = '/';
    } catch (err) {
      console.error('Error de red DELETE /users/me:', err);
      setError('Error de conexión con el servidor');
    } finally {
      setShowLoader(false);
    }
  };

  return (
    <div className="modal d-block" tabIndex="-1" style={{
      backgroundColor: 'rgba(0,0,0,0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 0
    }}>
      <div className="modal-dialog modal-dialog-centered" role="document">
        <div className="modal-content shadow-sm">
          <div className="modal-header border-bottom-0">
            <h5 className="modal-title text-center w-100 fw-bold">Eliminar cuenta</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body pt-0">
            <p className="text-center">
              Esta acción es <strong>irreversible</strong>. Escribe <strong>ELIMINAR</strong> para confirmar:
            </p>
            <div className="mb-3 form-floating">
              <input
                id="confirmText"
                type="text"
                className={`form-control ${error ? 'is-invalid' : ''}`}
                value={confirmText}
                onChange={e => {
                  setConfirmText(e.target.value);
                  setError('');
                }}
                placeholder="ELIMINAR"
              />
              <label htmlFor="confirmText">ELIMINAR</label>
              {error && <small className="text-danger d-block mt-1 fade-in">{error}</small>}
            </div>
          </div>
          <div className="modal-footer border-top-0 pt-0">
            <button type="button" className="btn btn-secondary px-3 py-2" onClick={onClose}>Cancelar</button>
            <button type="button" className="btn btn-danger px-4 py-2" onClick={handleDelete}>Eliminar cuenta</button>
          </div>
        </div>
      </div>
    </div>
  );
}
