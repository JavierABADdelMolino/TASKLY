// src/components/profile/ConfirmDeleteModal.jsx

import { useState } from 'react';
import { useLoader } from '../../context/LoaderContext';
import { useAuth } from '../../context/AuthContext';

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
      const token = sessionStorage.getItem('token');
      if (!token) {
        setError('Sesión expirada. Inicia sesión de nuevo.');
        return;
      }

      const res = await fetch(`${process.env.REACT_APP_API_URL}/users/me`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!res.ok) {
        let message = 'Error al eliminar cuenta';
        try {
          const data = await res.json();
          message = data.message || message;
        } catch (err) {
          // La respuesta no tenía cuerpo
        }
        setError(message);
      } else {
        logout();
        window.location.href = '/';
      }
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
      justifyContent: 'center'
    }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title text-danger">Eliminar cuenta</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            <p>
              Esta acción es <strong>irreversible</strong>. Escribe <strong>ELIMINAR</strong> para confirmar:
            </p>
            <input
              type="text"
              className="form-control mb-2"
              value={confirmText}
              onChange={e => setConfirmText(e.target.value)}
            />
            {error && <small className="text-danger">{error}</small>}
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancelar</button>
            <button type="button" className="btn btn-danger" onClick={handleDelete}>Eliminar cuenta</button>
          </div>
        </div>
      </div>
    </div>
  );
}
