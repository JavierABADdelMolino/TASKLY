import { useState } from 'react';
import { FiChevronLeft, FiChevronRight, FiEdit, FiTrash2, FiCalendar, FiClock } from 'react-icons/fi';
import EditTaskModal from './modals/EditTaskModal';
import ConfirmDeleteTaskModal from './modals/ConfirmDeleteTaskModal';
import { updateTask, deleteTask } from '../../services/taskService';
import { useTheme } from '../../context/ThemeContext';

const Task = ({ task, column, columns, onTaskMoved, onTaskUpdated, onTaskDeleted }) => {
  const { theme } = useTheme();
  // Estado de vencimiento para resaltar según proximidad o retraso
  const dueDateTimeObj = task.dueDateTime ? new Date(task.dueDateTime) : null;
  const now = new Date();
  let statusClass = '';
  if (dueDateTimeObj) {
    if (dueDateTimeObj < now) {
      statusClass = 'overdue';
    } else if (dueDateTimeObj - now <= 24 * 60 * 60 * 1000) {
      // Highlight tasks due within 24h
      statusClass = 'urgent';
    }
  }
  // Estados para mover, editar y eliminar
  const [loadingMove, setLoadingMove] = useState(false);
  const [errorMove, setErrorMove] = useState('');
  const [showEdit, setShowEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  // Fecha y hora de vencimiento parseadas y formateadas
  const dueDate = task.dueDateTime ? task.dueDateTime.split('T')[0] : null;
  const rawTime = task.dueDateTime && task.dueDateTime.includes('T') ? task.dueDateTime.split('T')[1] : null;
  // Mostrar hora sólo si no es default midnight
  let dueTime = null;
  if (rawTime) {
    const hhmm = rawTime.split('.')[0].substring(0,5);
    dueTime = hhmm !== '00:00' ? hhmm : null;
  }

  // Find current column index in columns array
  const colIdx = columns.findIndex(c => c._id === column._id);

  const handleMove = async (direction) => {
    const newIdx = colIdx + direction;
    if (newIdx < 0 || newIdx >= columns.length) return;
    const targetColumn = columns[newIdx];
    setLoadingMove(true);
    setErrorMove('');
    try {
      const data = await updateTask(task._id, { column: targetColumn._id });
      onTaskMoved && onTaskMoved(data);
    } catch (err) {
      setErrorMove(err.message);
    } finally {
      setLoadingMove(false);
    }
  };

  return (
    <div className={`card task-card ${statusClass}`}>  
      <div className="card-body p-2">
        {/* Cabecera de tarea: editar a la izquierda, título en el centro, borrar a la derecha */}
        <div className="d-flex align-items-center mb-2">
          <button className="btn btn-link btn-sm p-0 text-warning" onClick={() => setShowEdit(true)} title="Editar tarea">
            <FiEdit size={14} />
          </button>
          <div className="flex-grow-1 text-center mx-2">
            <h6 className="mb-1" title={task.title} style={{ fontSize: '0.9rem' }}>{task.title}</h6>
          </div>
          <button className="btn btn-link btn-sm p-0 text-danger" onClick={() => setShowDelete(true)} title="Eliminar tarea">
            <FiTrash2 size={14} />
          </button>
        </div>
        {/* Descripción e importancia alineadas a la izquierda */}
        {task.description && <p className="mb-1 small text-muted" title={task.description}>{task.description}</p>}
        {/* Mostrar fecha y hora de vencimiento si existe */}
        {dueDate && (
          <p className="mb-1 small text-muted d-flex align-items-center">
            <FiCalendar className="me-1" />
            {dueDate}
            {dueTime && (
              <span className="d-flex align-items-center ms-3">
                <FiClock className="me-1" />
                {dueTime}
              </span>
            )}
          </p>
        )}
        <span className="badge bg-primary text-uppercase" style={{ fontSize: '0.6rem' }}>{task.importance}</span>
        <div className="d-flex justify-content-between align-items-center mt-2">
          {/* Flecha izquierda */}
          <div>
            {colIdx > 0 && (
              <button className={`btn btn-link btn-sm p-0 ${theme === 'dark' ? 'text-white' : 'text-dark'}`} onClick={() => handleMove(-1)} disabled={loadingMove} title="Mover a la columna anterior">
                <FiChevronLeft size={16} />
              </button>
            )}
          </div>
          {/* Espacio central */}
          <div />
          {/* Flecha derecha */}
          <div>
            {colIdx < columns.length - 1 && (
              <button className={`btn btn-link btn-sm p-0 ${theme === 'dark' ? 'text-white' : 'text-dark'}`} onClick={() => handleMove(1)} disabled={loadingMove} title="Mover a la columna siguiente">
                <FiChevronRight size={16} />
              </button>
            )}
          </div>
        </div>
        {/* Mensaje de error de movimiento */}
        {errorMove && <div className="text-danger small mt-1 text-center">{errorMove}</div>}
        {/* Modal confirmar borrar tarea */}
        <ConfirmDeleteTaskModal
          show={showDelete}
          onClose={() => setShowDelete(false)}
          onConfirm={async () => {
            try {
              await deleteTask(task._id);
              onTaskDeleted && onTaskDeleted(task._id);
            } catch (err) {
              console.error(err);
            }
          }}
        />
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