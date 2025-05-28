import { useState } from 'react';

const importanceOptions = [
  { value: 'high', label: 'Alta' },
  { value: 'medium', label: 'Media' },
  { value: 'low', label: 'Baja' }
];

const CreateTaskModal = ({ show, onClose, columnId, onTaskCreated }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [importance, setImportance] = useState('medium');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [suggestedImportance, setSuggestedImportance] = useState(null);
  const [loadingSuggestion, setLoadingSuggestion] = useState(false);

  const API_BASE_URL = process.env.REACT_APP_API_URL;

  if (!show) return null;

  // Función para obtener sugerencia IA tras terminar de escribir título
  const fetchSuggestion = async () => {
    if (!title.trim()) return;
    setLoadingSuggestion(true);
    try {
      const token = sessionStorage.getItem('token');
      const res = await fetch(
        `${API_BASE_URL}/tasks/columns/${columnId}/suggest-importance`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + token
          },
          body: JSON.stringify({ title, description })
        }
      );
      const data = await res.json();
      if (res.ok && data.suggestedImportance) {
        setSuggestedImportance(data.suggestedImportance);
      } else {
        setSuggestedImportance(null);
      }
    } catch {
      setSuggestedImportance(null);
    } finally {
      setLoadingSuggestion(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!title.trim()) {
      setError('El título es obligatorio');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/tasks/columns/${columnId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + sessionStorage.getItem('token')
        },
        body: JSON.stringify({ title, description, importance })
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message || 'Error al crear la tarea');
      } else {
        onTaskCreated && onTaskCreated(data);
        onClose();
      }
    } catch (err) {
      setError('Error al conectar con el servidor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal show d-block" tabIndex="-1" role="dialog" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-dialog-centered" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title text-center w-100">Crear nueva tarea</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <form onSubmit={handleSubmit}>
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
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Creando...' : 'Crear'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateTaskModal;
