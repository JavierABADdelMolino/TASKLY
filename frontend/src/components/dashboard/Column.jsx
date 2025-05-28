import { useState, useEffect } from 'react';
import { FiChevronLeft, FiChevronRight, FiTrash2 } from 'react-icons/fi';
import ConfirmDeleteColumnModal from './modals/ConfirmDeleteColumnModal';
import Task from './Task';
import CreateTaskModal from './modals/CreateTaskModal';
import { getTasksByColumn } from '../../services/taskService';
import { updateColumn } from '../../services/columnService';

const Column = ({ column, index, total, onMove, onColumnDeleted, onColumnUpdated, allColumns, refreshKey, onAnyTaskChange }) => {
  const [showDelete, setShowDelete] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(column.title);
  const [tasks, setTasks] = useState([]);
  const [loadingTasks, setLoadingTasks] = useState(false);
  const [showCreateTask, setShowCreateTask] = useState(false);
  const [taskError, setTaskError] = useState('');
  const [refreshTasks, setRefreshTasks] = useState(false);

  // keep title in sync
  useEffect(() => { setNewTitle(column.title); }, [column.title]);

  // Fetch tasks for this column
  useEffect(() => {
    const loadTasks = async () => {
      setLoadingTasks(true);
      setTaskError('');
      try {
        const data = await getTasksByColumn(column._id);
        setTasks(data);
      } catch (err) {
        setTaskError(err.message);
      } finally {
        setLoadingTasks(false);
      }
    };
    loadTasks();
  }, [column._id, refreshTasks, refreshKey]);

  return (
    <div className="card shadow-sm" style={{ width: '280px', position: 'relative' }}>
      {/* Botón eliminar columna */}
      <button
        className="btn btn-link p-1 text-danger position-absolute"
        style={{ top: '4px', right: '4px' }}
        onClick={() => setShowDelete(true)}
        title="Eliminar columna"
      >
        <FiTrash2 size={16} />
      </button>
      <div className="card-body">
        <div className="d-flex align-items-center mb-2">
          {/* Left arrow container */}
          <div style={{ width: '40px', textAlign: 'left' }}>
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
                    await updateColumn(column._id, { title: newTitle });
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
          <div style={{ width: '40px', textAlign: 'right' }}>
            {index < total - 1 && (
              <button className="btn btn-link p-1 text-secondary" onClick={() => onMove(column, 1)}>
                <FiChevronRight size={16} />
              </button>
            )}
          </div>
        </div>
        {/* Botón crear tarea */}
        <div className="d-grid mb-2">
          <button className="btn btn-sm btn-outline-success" onClick={() => setShowCreateTask(true)}>
            + Añadir tarea
          </button>
        </div>
        {/* Lista de tareas */}
        {loadingTasks ? (
          <div className="text-center text-muted small">Cargando tareas...</div>
        ) : taskError ? (
          <div className="text-danger small">{taskError}</div>
        ) : tasks.length === 0 ? (
          <div className="text-muted small text-center">No hay tareas en esta columna.</div>
        ) : (
          <div className="d-flex flex-column gap-2">
            {tasks.map((task) => (
              <Task
                key={task._id}
                task={task}
                column={column}
                columns={allColumns}
                onTaskMoved={onAnyTaskChange}
                onTaskUpdated={onAnyTaskChange}
                onTaskDeleted={onAnyTaskChange}
              />
            ))}
          </div>
        )}
      </div>
      {/* Modal crear tarea */}
      {showCreateTask && (
        <CreateTaskModal
          show={showCreateTask}
          onClose={() => setShowCreateTask(false)}
          columnId={column._id}
          onTaskCreated={() => setRefreshTasks((p) => !p)}
        />
      )}
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
