import { useState } from 'react';
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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  // IA suggestion states
  const [suggestedImportance, setSuggestedImportance] = useState(task.importance);
  const [loadingSuggestion, setLoadingSuggestion] = useState(false);

  if (!show) return null;

  // Fetch IA suggestion for importance
  const fetchSuggestion = async () => {
    setLoadingSuggestion(true);
    const suggestion = await suggestImportanceForExistingTask(task._id, title, description);
    setSuggestedImportance(suggestion);
    // Preseleccionar la recomendación IA
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
    setLoading(true);
    try {
      const data = await updateTask(task._id, { title, description, importance });
      if (data.message) throw new Error(data.message);
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

  return (
    <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
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
  );
};

export default EditTaskModal;
