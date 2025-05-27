import { useState } from 'react';
import { FiChevronLeft, FiChevronRight, FiEdit, FiTrash2 } from 'react-icons/fi';
import EditTaskModal from './modals/EditTaskModal';

const API_BASE_URL = process.env.REACT_APP_API_URL;

const Task = ({ task, column, columns, onTaskMoved, onTaskUpdated, onTaskDeleted }) => {
  const [showEdit, setShowEdit] = useState(false);
  const [loadingMove, setLoadingMove] = useState(false);
  const [errorMove, setErrorMove] = useState('');

  // Find current column index in columns array
  const colIdx = columns.findIndex(c => c._id === column._id);

  const handleMove = async (direction) => {
    const newIdx = colIdx + direction;
    if (newIdx < 0 || newIdx >= columns.length) return;
    const targetColumn = columns[newIdx];
    setLoadingMove(true);
    setErrorMove('');
    try {
      const token = sessionStorage.getItem('token');
      const res = await fetch(`${API_BASE_URL}/tasks/${task._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token },
        body: JSON.stringify({ column: targetColumn._id })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Error al mover tarea');
      onTaskMoved && onTaskMoved(data);
    } catch (err) {
      setErrorMove(err.message);
    } finally {
      setLoadingMove(false);
    }
  };

  return (
    <div className="card" style={{ background: '#f8f9fa' }}>
      <div className="card-body p-2">
        <div className="d-flex justify-content-between align-items-start">
          <div>
            <h6 className="mb-1" title={task.title} style={{ fontSize: '0.9rem' }}>{task.title}</h6>
            {task.description && <p className="mb-1 small text-muted" title={task.description}>{task.description}</p>}
            <span className="badge bg-primary text-uppercase" style={{ fontSize: '0.6rem' }}>{task.importance}</span>
          </div>
          <div className="d-flex flex-column align-items-end gap-1">
            <button className="btn btn-link btn-sm p-0 text-secondary" onClick={() => setShowEdit(true)} title="Editar tarea">
              <FiEdit size={14} />
            </button>
            <button className="btn btn-link btn-sm p-0 text-danger" onClick={async () => {
              if (window.confirm('¿Eliminar esta tarea?')) {
                const token = sessionStorage.getItem('token');
                await fetch(`${API_BASE_URL}/tasks/${task._id}`, { method: 'DELETE', headers: { Authorization: 'Bearer ' + token }});
                onTaskDeleted && onTaskDeleted(task._id);
              }
            }} title="Eliminar tarea">
              <FiTrash2 size={14} />
            </button>
          </div>
        </div>
        <div className="d-flex justify-content-between align-items-center mt-2">
          {/* Flecha izquierda */}
          <div>
            {colIdx > 0 && (
              <button className="btn btn-link btn-sm p-0" onClick={() => handleMove(-1)} disabled={loadingMove} title="Mover a la columna anterior">
                <FiChevronLeft size={16} />
              </button>
            )}
          </div>
          {/* Espacio central */}
          <div />
          {/* Flecha derecha */}
          <div>
            {colIdx < columns.length - 1 && (
              <button className="btn btn-link btn-sm p-0" onClick={() => handleMove(1)} disabled={loadingMove} title="Mover a la columna siguiente">
                <FiChevronRight size={16} />
              </button>
            )}
          </div>
        </div>
        {/* Mensaje de error de movimiento */}
        {errorMove && <div className="text-danger small mt-1 text-center">{errorMove}</div>}
      </div>
      {showEdit && (
        <EditTaskModal
          show={showEdit}
          onClose={() => setShowEdit(false)}
          task={task}
          onTaskUpdated={(updated) => {
            onTaskUpdated && onTaskUpdated(updated);
            setShowEdit(false);
          }}
        />
      )}
    </div>
  );
};

export default Task;