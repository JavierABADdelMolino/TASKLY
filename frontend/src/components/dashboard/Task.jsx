import { useState } from 'react';
import { FiEdit, FiTrash2, FiCalendar, FiClock } from 'react-icons/fi';
import EditTaskModal from './modals/EditTaskModal';
import ConfirmDeleteTaskModal from './modals/ConfirmDeleteTaskModal';
import { deleteTask } from '../../services/taskService';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';

const Task = ({ task, column, columns, onTaskMoved, onTaskUpdated, onTaskDeleted }) => {
  // Hacer la tarea draggable para DnD
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useDraggable({
    id: task._id,
    activationConstraint: { distance: 10 },
    data: { task, column },
  });

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
  // Estados para editar y eliminar
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

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={{
        position: 'relative', // allow z-index to take effect
        willChange: 'transform',
        transform: CSS.Translate.toString(transform),
        transition: isDragging ? 'none' : transition,
        zIndex: isDragging ? 1000 : 'auto',
        opacity: isDragging ? 0 : 1,
      }}
      className={`card task-card ${statusClass}`}
    >
      <div className="card-body p-2">
        {/* Cabecera de tarea: editar a la izquierda, título en el centro, borrar a la derecha */}
        <div className="d-flex align-items-center mb-2">
          <button className="btn btn-link btn-sm p-0 text-warning" onPointerDown={e => e.stopPropagation()} onClick={() => setShowEdit(true)} title="Editar tarea">
            <FiEdit size={14} />
          </button>
          <div className="flex-grow-1 text-center mx-2">
            <h6 className="mb-1" title={task.title} style={{ fontSize: '0.9rem' }}>{task.title}</h6>
          </div>
          <button className="btn btn-link btn-sm p-0 text-danger" onPointerDown={e => e.stopPropagation()} onClick={() => setShowDelete(true)} title="Eliminar tarea">
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
        {/* Drag & Drop de tareas gestiona el movimiento entre columnas */}
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