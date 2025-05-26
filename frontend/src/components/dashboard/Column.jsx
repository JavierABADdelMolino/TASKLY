import { useState } from 'react';
import { FiChevronLeft, FiChevronRight, FiX } from 'react-icons/fi';
import ConfirmDeleteColumnModal from './modals/ConfirmDeleteColumnModal';

const Column = ({ column, index, total, onMove, onColumnDeleted, onColumnUpdated }) => {
  const [showDelete, setShowDelete] = useState(false);

  return (
    <div className="card shadow-sm" style={{ width: '280px', position: 'relative' }}>
      {/* Botón eliminar columna */}
      <button
        className="btn btn-link p-1 text-danger position-absolute"
        style={{ top: '4px', right: '4px' }}
        onClick={() => setShowDelete(true)}
        title="Eliminar columna"
      >
        <FiX size={16} />
      </button>
      <div className="card-body">
        <div className="d-flex align-items-center mb-2">
          {/* Left arrow container */}
          <div style={{ width: '32px', textAlign: 'left' }}>
            {index > 0 && (
              <button className="btn btn-link p-1 text-secondary" onClick={() => onMove(column, -1)}>
                <FiChevronLeft size={16} />
              </button>
            )}
          </div>
          {/* Title centered */}
          <h5 className="card-title flex-grow-1 text-center mb-0 text-truncate" title={column.title}>
            {column.title}
          </h5>
          {/* Right arrow container */}
          <div style={{ width: '32px', textAlign: 'right' }}>
            {index < total - 1 && (
              <button className="btn btn-link p-1 text-secondary" onClick={() => onMove(column, 1)}>
                <FiChevronRight size={16} />
              </button>
            )}
          </div>
        </div>
      </div>
      {/* Confirm delete column */}
      <ConfirmDeleteColumnModal
        show={showDelete}
        onClose={() => setShowDelete(false)}
        onConfirm={() => onColumnDeleted(column._id)}
      />
    </div>
  );
};

export default Column;
