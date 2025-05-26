import { useState, useEffect } from 'react';
import { FiChevronLeft, FiChevronRight, FiX } from 'react-icons/fi';
import ConfirmDeleteColumnModal from './modals/ConfirmDeleteColumnModal';
const API_BASE_URL = process.env.REACT_APP_API_URL;

const Column = ({ column, index, total, onMove, onColumnDeleted, onColumnUpdated }) => {
  const [showDelete, setShowDelete] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(column.title);

  // keep title in sync
  useEffect(() => { setNewTitle(column.title); }, [column.title]);

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
          {/* Title centered with edit */}
          <div className="flex-grow-1 text-center">
            {isEditing ? (
              <input
                type="text"
                className="form-control form-control-sm text-center"
                value={newTitle}
                autoFocus
                onChange={(e) => setNewTitle(e.target.value)}
                onBlur={async () => {
                  if (newTitle.trim() && newTitle !== column.title) {
                    const token = sessionStorage.getItem('token');
                    await fetch(`${API_BASE_URL}/columns/${column._id}`, {
                      method: 'PUT', headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token },
                      body: JSON.stringify({ title: newTitle })
                    });
                    onColumnUpdated();
                  }
                  setIsEditing(false);
                }}
                onKeyDown={async (e) => {
                  if (e.key === 'Enter') e.target.blur();
                  if (e.key === 'Escape') { setNewTitle(column.title); setIsEditing(false); }
                }}
              />
            ) : (
              <h5
                className="card-title mb-0 text-truncate"
                style={{ cursor: 'pointer' }}
                title="Haz clic para editar"
                onClick={() => setIsEditing(true)}
              >
                {column.title}
              </h5>
            )}
          </div>
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
