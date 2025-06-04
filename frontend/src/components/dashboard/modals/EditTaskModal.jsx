import { useState } from 'react';
import ReactDOM from 'react-dom';
import { suggestImportanceForExistingTask, updateTask, deleteTask } from '../../../services/taskService';

const importanceOptions = [
  { value: 'high', label: 'Alta' },
  { value: 'medium', label: 'Media' },
  { value: 'low', label: 'Baja' }
];

const EditTaskModal = ({ show, onClose, task, onTaskUpdated }) => {
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description);
  const [importance, setImportance] = useState(task.importance);
  const [dueDate, setDueDate] = useState(task.dueDateTime ? task.dueDateTime.split('T')[0] : '');
  const [dueTime, setDueTime] = useState(task.dueDateTime && task.dueDateTime.includes('T') ? task.dueDateTime.split('T')[1] : '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [suggestedImportance, setSuggestedImportance] = useState(task.importance);
  const [loadingSuggestion, setLoadingSuggestion] = useState(false);

  if (!show) return null;

  const fetchSuggestion = async () => {
    setLoadingSuggestion(true);
    // Construir dueDateTime opcional
    let dueDateTime = '';
    if (dueDate) dueDateTime = dueTime ? `${dueDate}T${dueTime}` : dueDate;
    const suggestion = await suggestImportanceForExistingTask(task._id, title, description, dueDateTime);
    setSuggestedImportance(suggestion);
    if (suggestion) setImportance(suggestion);
    setLoadingSuggestion(false);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setError('');
    if (!title.trim()) {
      setError('El título es obligatorio');
      return;
    }
    // Validar fecha y hora no anterior al momento actual
    if (dueDate) {
      const dt = dueTime ? new Date(`${dueDate}T${dueTime}`) : new Date(dueDate);
      if (dt < new Date()) {
        setError('La fecha de vencimiento no puede ser anterior a la actual');
        return;
      }
    }
    setLoading(true);
    try {
      // Preparar payload con dueDateTime opcional
      const payload = { title, description, importance };
      if (dueDate) {
        payload.dueDateTime = dueTime ? `${dueDate}T${dueTime}` : dueDate;
      }
      const data = await updateTask(task._id, payload);
      onTaskUpdated && onTaskUpdated(data);
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('¿Eliminar esta tarea?')) return;
    try {
      const data = await deleteTask(task._id);
      if (data.message && !data.suggestedImportance) { /* assuming deletions return only message */ }
      onTaskUpdated && onTaskUpdated(null, true);
      onClose();
    } catch (err) {
      setError('Error al eliminar tarea: ' + err.message);
    }
  };

  return ReactDOM.createPortal(
    <>
      <div className="modal-backdrop fade show"></div>
      <div className="modal show d-block" tabIndex="-1" role="dialog">
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title text-center w-100">Editar tarea</h5>
              <button type="button" className="btn-close" onClick={onClose}></button>
            </div>
            <form onSubmit={handleUpdate}>
              <div className="modal-body">
                <div className="mb-3">
                  <label htmlFor="title" className="form-label">Título</label>
                  <input
                    type="text"
                    id="title"
                    className="form-control"
                    value={title}
                    onChange={(e) => { setTitle(e.target.value); setSuggestedImportance(null); }}
                    onBlur={fetchSuggestion}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="description" className="form-label">Descripción</label>
                  <textarea
                    id="description"
                    className="form-control"
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    onBlur={fetchSuggestion}
                  />
                </div>
                {/* Fecha de vencimiento (opcional) */}
                <div className="mb-3">
                  <label htmlFor="dueDate" className="form-label">Fecha de vencimiento</label>
                  <input
                    type="date"
                    id="dueDate"
                    className="form-control"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                  />
                </div>
                {/* Hora de vencimiento (opcional, requiere fecha) */}
                <div className="mb-3">
                  <label htmlFor="dueTime" className="form-label">Hora de vencimiento</label>
                  <input
                    type="time"
                    id="dueTime"
                    className="form-control"
                    value={dueTime}
                    onChange={(e) => setDueTime(e.target.value)}
                    disabled={!dueDate}
                  />
                </div>
                {/* Importancia debe ir al final */}
                <div className="mb-3">
                  <label htmlFor="importance" className="form-label">Importancia</label>
                  <select
                    id="importance"
                    className="form-select"
                    value={importance}
                    onChange={(e) => setImportance(e.target.value)}
                    disabled={loadingSuggestion}
                  >
                    {loadingSuggestion && <option>Calculando recomendación…</option>}
                    {importanceOptions.map(opt => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                        {opt.value === suggestedImportance && ' (Recomendado IA)'}
                      </option>
                    ))}
                  </select>
                </div>
                {error && <div className="alert alert-danger small">{error}</div>}
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={onClose}>Cancelar</button>
                <button type="button" className="btn btn-danger me-auto" onClick={handleDelete}>Eliminar</button>
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? 'Guardando...' : 'Guardar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>,
    document.body
  );
};

export default EditTaskModal;
