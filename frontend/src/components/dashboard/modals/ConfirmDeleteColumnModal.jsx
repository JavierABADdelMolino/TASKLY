import React from 'react';
import ReactDOM from 'react-dom';

const ConfirmDeleteColumnModal = ({ show, onClose, onConfirm }) => {
  if (!show) return null;
  return ReactDOM.createPortal(
    <>
      <div className="modal-backdrop fade show"></div>
      <div className="modal fade show" tabIndex="-1" role="dialog" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0 }}>
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content shadow-sm">
            <div className="modal-header border-bottom-0">
              <h5 className="modal-title text-danger text-center w-100 fw-bold">Eliminar columna</h5>
              <button type="button" className="btn-close" onClick={onClose}></button>
            </div>
            <div className="modal-body pt-0 text-center">
              <p>¿Estás seguro de que deseas eliminar esta columna? Esta acción es irreversible.</p>
            </div>
            <div className="modal-footer border-top-0 pt-0">
              <button type="button" className="btn btn-secondary px-3 py-2" onClick={onClose}>Cancelar</button>
              <button type="button" className="btn btn-danger px-4 py-2" onClick={() => { onConfirm(); onClose(); }}>
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
