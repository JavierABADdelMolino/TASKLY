import { useState } from 'react';
import { FiEdit, FiTrash2, FiCalendar, FiClock, FiCircle, FiCheckCircle } from 'react-icons/fi';
import EditTaskModal from './modals/EditTaskModal';
import ConfirmDeleteTaskModal from './modals/ConfirmDeleteTaskModal';
import { deleteTask, markTaskAsCompleted, markTaskAsIncomplete } from '../../services/taskService';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';

const Task = ({ task, column, columns, onTaskMoved, onTaskUpdated, onTaskDeleted }) => {
  // Estados para editar y eliminar (moverlos antes de useDraggable)
  const [showEdit, setShowEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  // Hacer la tarea draggable para DnD, deshabilitar cuando se abra modal
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useDraggable({
    id: task._id,
    activationConstraint: { distance: 10 },
    data: { task, column },
    disabled: showEdit || showDelete,
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
      className={`card task-card ${statusClass} ${task.completed ? 'task-completed' : ''}`}
    >
      <div className="card-body p-2">
        {/* Cabecera de tarea: editar a la izquierda, título en el centro, borrar a la derecha */}
        <div className="d-flex align-items-center mb-2">
          <button
            className="btn btn-sm p-0"
            onPointerDown={e => e.stopPropagation()}
            onClick={e => { e.stopPropagation(); setShowEdit(true); }}
            title="Editar tarea"
            style={{ 
              color: '#ffc107 !important',
              backgroundColor: 'transparent !important',
              border: 'none !important',
              outline: 'none !important',
              boxShadow: 'none !important',
              padding: '0 !important'
            }}
          >
            <FiEdit size={14} style={{ color: '#ffc107 !important' }} />
          </button>
          
          <div className="flex-grow-1 text-center mx-2">
            <h6 
              className={`mb-1 ${task.completed ? 'text-decoration-line-through text-muted' : ''}`} 
              title={task.title} 
              style={{ fontSize: '0.9rem' }}
            >
              {task.title}
            </h6>
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
        <div className="d-flex align-items-center justify-content-between">
          <span className="badge bg-primary text-uppercase" style={{ fontSize: '0.6rem' }}>{task.importance}</span>
          
          {/* Botón circular para marcar como completada */}
          <button
            className="btn btn-sm p-0 ms-2"
            onPointerDown={e => e.stopPropagation()}
            onClick={async (e) => {
              e.stopPropagation();
              try {
                if (task.completed) {
                  const response = await markTaskAsIncomplete(task._id);
                  onTaskUpdated && onTaskUpdated(response.task);
                } else {
                  const response = await markTaskAsCompleted(task._id);
                  onTaskUpdated && onTaskUpdated(response.task);
                }
              } catch (err) {
                console.error('Error al cambiar estado de completado:', err);
              }
            }}
            title={task.completed ? "Marcar como incompleta" : "Marcar como completada"}
            style={{ 
              backgroundColor: 'transparent',
              border: 'none',
              outline: 'none',
              boxShadow: 'none',
              padding: '0',
              color: '#1abc9c', // Siempre verde Taskly
              opacity: task.completed ? 1 : 0.7, // Un poco más opaco cuando no está completado
              transition: 'all 0.2s ease',
              cursor: 'pointer'
            }}
          >
            {task.completed ? 
              <FiCheckCircle size={20} /> : 
              <FiCircle size={20} />
            }
          </button>
        </div>
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