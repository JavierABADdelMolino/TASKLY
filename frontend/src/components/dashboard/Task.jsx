import { useState } from 'react';
import { FiEdit, FiTrash2, FiCalendar, FiClock, FiCheck, FiCircle } from 'react-icons/fi';
import EditTaskModal from './modals/EditTaskModal';
import ConfirmDeleteTaskModal from './modals/ConfirmDeleteTaskModal';
import { deleteTask, toggleTaskCompletion } from '../../services/taskService';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';

const Task = ({ task, column, columns, onTaskMoved, onTaskUpdated, onTaskDeleted }) => {
  // Estados para editar y eliminar (moverlos antes de useDraggable)
  const [showEdit, setShowEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  
  // Hacer la tarea draggable para DnD, deshabilitar cuando se abra modal
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useDraggable({
    id: task._id,
    activationConstraint: { distance: 10 },
    data: { task, column },
    disabled: showEdit || showDelete || isUpdating,
  });

  // Estado de vencimiento para resaltar según proximidad o retraso
  const dueDateTimeObj = task.dueDateTime ? new Date(task.dueDateTime) : null;
  const now = new Date();
  let statusClass = task.completed ? 'completed' : '';
  if (dueDateTimeObj && !task.completed) {
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

  // Función para manejar el cambio de estado de completado
  const handleToggleCompletion = async (e) => {
    e.stopPropagation();
    e.preventDefault();
    
    if (isUpdating) return;
    
    setIsUpdating(true);
    
    try {
      // Nuevo estado a aplicar (inverso al actual)
      const newCompletedState = !task.completed;
      
      // Optimistic UI update - actualizar inmediatamente en la UI
      const optimisticTask = {
        ...task,
        completed: newCompletedState,
        completedAt: newCompletedState ? new Date().toISOString() : null
      };
      
      // Notificar al componente padre para actualizar la UI inmediatamente
      onTaskUpdated && onTaskUpdated(optimisticTask);
      
      // Llamada al servicio
      const result = await toggleTaskCompletion(task._id, newCompletedState);
      
      // Verificar si hubo error en la respuesta
      if (result && result.error) {
        // Revertir el cambio en caso de error
        const revertedTask = {
          ...task,
          completed: task.completed, // Estado original
          completedAt: task.completedAt
        };
        
        // Notificar al componente padre para revertir la UI
        onTaskUpdated && onTaskUpdated(revertedTask);
      } else if (!result || !result._id) {
        // También revertir en este caso
        const revertedTask = {
          ...task,
          completed: task.completed, // Estado original
          completedAt: task.completedAt
        };
        
        // Notificar al componente padre para revertir la UI
        onTaskUpdated && onTaskUpdated(revertedTask);
      }
      // Si todo fue bien, la UI ya se actualizó con el cambio optimista
      
    } catch (error) {
      // Revertir la UI en caso de excepción
      const revertedTask = {
        ...task,
        completed: task.completed,
        completedAt: task.completedAt
      };
      
      // Notificar al componente padre para revertir la UI
      onTaskUpdated && onTaskUpdated(revertedTask);
    } finally {
      setIsUpdating(false);
    }
  };

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
        ...(task.completed && { opacity: 0.7 }), // Tareas completadas más transparentes
      }}
      className={`card task-card ${statusClass}`}
    >
      <div className="card-body p-2">
        {/* Cabecera de tarea: editar a la izquierda, título en el centro, borrar a la derecha */}
        <div className="d-flex align-items-center mb-2">
          <button
            className="btn btn-link btn-sm p-0 text-body"
            onPointerDown={e => e.stopPropagation()}
            onClick={e => { e.stopPropagation(); setShowEdit(true); }}
            title="Editar tarea"
          >
            <FiEdit size={14} />
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
          <button 
            className="btn btn-link btn-sm p-0 text-danger" 
            onPointerDown={e => e.stopPropagation()} 
            onClick={e => { e.stopPropagation(); setShowDelete(true); }}
            title="Eliminar tarea"
          >
            <FiTrash2 size={14} />
          </button>
        </div>
        
        {/* Descripción e importancia alineadas a la izquierda */}
        {task.description && (
          <p 
            className={`mb-1 small ${task.completed ? 'text-muted text-decoration-line-through' : 'text-muted'}`} 
            title={task.description}
          >
            {task.description}
          </p>
        )}
        
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
        
        {/* Mostrar botón de completar y badge de importancia */}
        <div className="d-flex align-items-center justify-content-between">
          <button
            type="button"
            className={`btn ${task.completed ? 'btn-success' : 'btn-outline-success'} btn-sm`}
            onPointerDown={e => e.stopPropagation()}
            onClick={e => {
              e.stopPropagation();
              e.preventDefault();
              if (!isUpdating) handleToggleCompletion(e);
            }}
            disabled={isUpdating}
            title={task.completed ? "Marcar como pendiente" : "Marcar como completada"}
            style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '0.25rem 0.5rem' }}
          >
            {isUpdating ? (
              <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
            ) : task.completed ? (
              <FiCheck size={16} />
            ) : (
              <FiCircle size={16} />
            )}
            <span style={{ fontSize: '0.85rem' }}>
              {task.completed ? "Completada" : "Completar"}
            </span>
          </button>
          <span className="badge bg-primary text-uppercase" style={{ fontSize: '0.6rem' }}>{task.importance}</span>
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