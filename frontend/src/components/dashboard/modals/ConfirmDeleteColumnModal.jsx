import React from 'react';
import ReactDOM from 'react-dom';

const ConfirmDeleteColumnModal = ({ show, onClose, onConfirm }) => {
  if (!show) return null;
  return ReactDOM.createPortal(
    <>
      <div className="modal-backdrop fade show"></div>
      <div className="modal fade show" tabIndex="-1" role="dialog" style={{ display: 'block' }}>
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title text-danger text-center w-100">Eliminar columna</h5>
              <button type="button" className="btn-close" onClick={onClose}></button>
            </div>
            <div className="modal-body">
              <p>¿Estás seguro de que deseas eliminar esta columna? Esta acción es irreversible.</p>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={onClose}>Cancelar</button>
              <button type="button" className="btn btn-danger" onClick={() => { onConfirm(); onClose(); }}>
                Eliminar
              </button>
            </div>
          </div>
        </div>
      </div>
    </>, document.body
  );
};

export default ConfirmDeleteColumnModal;
