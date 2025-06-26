import { useState } from 'react';
import ReactDOM from 'react-dom';
import { suggestImportanceForExistingTask, updateTask, deleteTask } from '../../../services/taskService';
import ConfirmDeleteTaskModal from './ConfirmDeleteTaskModal';

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
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

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
    setShowConfirmDelete(true);
  };

  const confirmDelete = async () => {
    try {
      const data = await deleteTask(task._id);
      if (data.message && !data.suggestedImportance) { /* assuming deletions return only message */ }
      onTaskUpdated && onTaskUpdated(null, true);
      onClose();
    } catch (err) {
      setError('Error al eliminar tarea: ' + err.message);
      setShowConfirmDelete(false);
    }
  };

  if (showConfirmDelete) {
    return <ConfirmDeleteTaskModal
      show={true}
      onClose={() => setShowConfirmDelete(false)}
      onConfirm={confirmDelete}
    />;
  }

  return ReactDOM.createPortal(
    <>
      <div className="modal-backdrop fade show"></div>
      <div className="modal show d-block" tabIndex="-1" role="dialog">
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content shadow-sm">
            <div className="modal-header border-bottom-0">
              <h5 className="modal-title text-center w-100 fw-bold">Editar tarea</h5>
              <button type="button" className="btn-close" onClick={onClose}></button>
            </div>
            <form onSubmit={handleUpdate}>
              <div className="modal-body pt-0">
                <div className="mb-3 form-floating">
                  <input
                    type="text"
                    id="title"
                    className={`form-control ${error && !title.trim() ? 'is-invalid' : ''}`}
                    value={title}
                    onChange={(e) => { 
                      setTitle(e.target.value);
                      setSuggestedImportance(null);
                      setError('');
                    }}
                    onBlur={fetchSuggestion}
                    placeholder="Título"
                  />
                  <label htmlFor="title">Título</label>
                </div>
                <div className="mb-3 form-floating">
                  <textarea
                    id="description"
                    className="form-control"
                    style={{ height: '100px' }}
                    value={description}
                    onChange={(e) => {
                      setDescription(e.target.value);
                      setError('');
                    }}
                    onBlur={fetchSuggestion}
                    placeholder="Descripción"
                  />
                  <label htmlFor="description">Descripción</label>
                </div>
                {/* Fecha de vencimiento (opcional) */}
                <div className="mb-3 form-floating">
                  <input
                    type="date"
                    id="dueDate"
                    className="form-control"
                    value={dueDate}
                    onChange={(e) => {
                      setDueDate(e.target.value);
                      setError('');
                    }}
                    onBlur={fetchSuggestion}
                    placeholder="Fecha de vencimiento"
                  />
                  <label htmlFor="dueDate">Fecha de vencimiento</label>
                </div>
                {/* Hora de vencimiento (opcional, requiere fecha) */}
                <div className="mb-3 form-floating">
                  <input
                    type="time"
                    id="dueTime"
                    className="form-control"
                    value={dueTime}
                    onChange={(e) => {
                      setDueTime(e.target.value);
                      setError('');
                    }}
                    disabled={!dueDate}
                    onBlur={fetchSuggestion}
                    placeholder="Hora de vencimiento"
                  />
                  <label htmlFor="dueTime">Hora de vencimiento</label>
                </div>
                {/* Importancia debe ir al final */}
                <div className="mb-3 form-floating">
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
                  <label htmlFor="importance">Importancia</label>
                </div>
                {error && <div className="alert alert-danger text-center small mb-3 fade-in">{error}</div>}
              </div>
              <div className="modal-footer border-top-0 pt-0">
                <button type="button" className="btn btn-secondary px-3 py-2" onClick={onClose}>Cancelar</button>
                <button type="button" className="btn btn-danger px-3 py-2 me-auto" onClick={handleDelete}>Eliminar</button>
                <button type="submit" className="btn btn-primary px-4 py-2" disabled={loading}>
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
