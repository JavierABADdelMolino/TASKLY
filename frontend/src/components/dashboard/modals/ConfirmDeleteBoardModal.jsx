import React from 'react';

const ConfirmDeleteBoardModal = ({ show, onClose, onConfirm }) => {
  if (!show) return null;
  return (
    <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-dialog-centered" role="document">
        <div className="modal-content shadow-sm">
          <div className="modal-header border-bottom-0">
            <h5 className="modal-title text-danger text-center w-100 fw-bold">Eliminar pizarra</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body pt-0">
            <p className="text-center">¿Estás seguro de que deseas eliminar esta pizarra?<br/>Esta acción es irreversible.</p>
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
  );
};

export default ConfirmDeleteBoardModal;
