import { useState, useEffect } from 'react';
import { FiTrash2, FiMove } from 'react-icons/fi';
import ConfirmDeleteColumnModal from './modals/ConfirmDeleteColumnModal';
import Task from './Task';
import CreateTaskModal from './modals/CreateTaskModal';
import { getTasksByColumn } from '../../services/taskService';
import { updateColumn, deleteColumn } from '../../services/columnService';
import { useTheme } from '../../context/ThemeContext';
import { useDroppable } from '@dnd-kit/core';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const Column = ({ column, index, total, onMove, onColumnDeleted, onColumnUpdated, allColumns, refreshKey, onAnyTaskChange }) => {
  const [showDelete, setShowDelete] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(column.title);
  const [tasks, setTasks] = useState([]);
  const [loadingTasks, setLoadingTasks] = useState(false);
  const [showCreateTask, setShowCreateTask] = useState(false);
  const [taskError, setTaskError] = useState('');
  const [refreshTasks, setRefreshTasks] = useState(false);
  const { theme } = useTheme();

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

  // marcar área de tareas como droppable para recibir tareas
  const { setNodeRef: setTasksDroppableRef } = useDroppable({ id: column._id });

  // sortable para columnas
  const { attributes: colAttributes, listeners: colListeners, setNodeRef: setColNodeRef, setActivatorNodeRef, transform: colTransform, transition: colTransition, isDragging: colIsDragging } = useSortable({ id: column._id, data: { type: 'column', column } });
  const colStyle = {
    position: 'relative',        // allow z-index
    willChange: 'transform',     // optimize performance
    transform: CSS.Translate.toString(colTransform),
    transition: colIsDragging ? 'none' : colTransition,
    zIndex: colIsDragging ? 1000 : 'auto',
    opacity: colIsDragging ? 0 : 1,      // hide original during drag
  };

  return (
    <div ref={setColNodeRef} className="card shadow-sm column-card" style={{ width: '280px', position: 'relative', ...colStyle }}>
      {/* Botón eliminar columna */}
      <button
        className="btn btn-link p-1 text-danger position-absolute"
        style={{ top: '4px', right: '4px' }}
        onClick={() => setShowDelete(true)}
        title="Eliminar columna"
      >
        <FiTrash2 size={16} />
      </button>
      {/* Drag handle para reordenar columnas */}
      <div
        ref={setActivatorNodeRef}
        {...colListeners}
        {...colAttributes}
        style={{ position: 'absolute', top: '4px', left: '50%', transform: 'translateX(-50%)', cursor: 'grab', zIndex: 'auto' }}
        title="Mover columna"
      >
        <FiMove size={16} />
      </div>
      <div className="card-body">
        <div className="d-flex align-items-center mb-2 justify-content-center">
          {/* Título editable */}
          <div className="flex-grow-1 text-center overflow-hidden">
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
        </div>
        {/* Botón crear tarea */}
        <div className="d-grid mb-2">
          <button className="btn btn-sm btn-outline-success" onClick={() => setShowCreateTask(true)}>
            + Añadir tarea
          </button>
        </div>
        {/* Lista de tareas */}
        {/* Droppable area for tasks and empty placeholder */}
        <div ref={setTasksDroppableRef} className="d-flex flex-column gap-2">
          {loadingTasks ? (
            <div className="text-center text-muted small">Cargando tareas...</div>
          ) : taskError ? (
            <div className="text-danger small">{taskError}</div>
          ) : tasks.length === 0 ? (
            <div className="text-muted small text-center">No hay tareas en esta columna.</div>
          ) : (
            tasks.slice()
              .sort((a, b) => {
                const orderMap = { high: 2, medium: 1, low: 0 };
                return orderMap[b.importance] - orderMap[a.importance];
              })
              .map(task => (
                <Task key={task._id} task={task} column={column} columns={allColumns} onTaskMoved={onAnyTaskChange} onTaskUpdated={onAnyTaskChange} onTaskDeleted={onAnyTaskChange} />
              ))
          )}
        </div>
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
        onConfirm={async () => {
          try {
            await deleteColumn(column._id);
            onColumnDeleted(column._id);
          } catch (err) {
            console.error('Error al eliminar columna:', err);
          }
        }}
      />
    </div>
  );
};

export default Column;
