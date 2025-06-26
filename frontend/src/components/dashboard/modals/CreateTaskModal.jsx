import { useState } from 'react';
import { suggestImportanceForNewTask, createTask } from '../../../services/taskService';
import ReactDOM from 'react-dom';

const importanceOptions = [
  { value: 'high', label: 'Alta' },
  { value: 'medium', label: 'Media' },
  { value: 'low', label: 'Baja' }
];

const CreateTaskModal = ({ show, onClose, columnId, onTaskCreated }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [dueTime, setDueTime] = useState('');
  const [importance, setImportance] = useState('medium');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [suggestedImportance, setSuggestedImportance] = useState(null);
  const [loadingSuggestion, setLoadingSuggestion] = useState(false);

  if (!show) return null;

  // Función para obtener sugerencia IA tras terminar de escribir título
  const fetchSuggestion = async () => {
    setLoadingSuggestion(true);
    // Construir dueDateTime opcional para sugerencia
    let dueDateTime = '';
    if (dueDate) dueDateTime = dueTime ? `${dueDate}T${dueTime}` : dueDate;
    const suggestion = await suggestImportanceForNewTask(columnId, title, description, dueDateTime);
    setSuggestedImportance(suggestion);
    // Preseleccionar la recomendación IA
    if (suggestion) setImportance(suggestion);
    setLoadingSuggestion(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!title.trim()) {
      setError('El título es obligatorio');
      return;
    }
    // Validar fecha y hora no anteriores
    if (dueDate) {
      const dt = dueTime ? new Date(`${dueDate}T${dueTime}`) : new Date(dueDate);
      if (dt < new Date()) {
        setError('La fecha de vencimiento no puede ser anterior a la actual');
        return;
      }
    }
    setLoading(true);
    try {
      // Preparar payload
      const data = { title, description, importance };
      if (dueDate) {
        const dueDateTime = dueTime ? `${dueDate}T${dueTime}` : dueDate;
        data.dueDateTime = dueDateTime;
      }
      const response = await createTask(columnId, data);
      if (!response._id) {
        setError(response.message || 'Error al crear la tarea');
      } else {
        onTaskCreated && onTaskCreated(response);
        onClose();
      }
    } catch (err) {
      setError('Error al conectar con el servidor');
    } finally {
      setLoading(false);
    }
  };

  return ReactDOM.createPortal(
    <>
      <div className="modal-backdrop fade show"></div>
      <div className="modal fade show" tabIndex="-1" role="dialog" style={{ display: 'block' }}>
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content shadow-sm">
            <div className="modal-header border-bottom-0">
              <h5 className="modal-title text-center w-100 fw-bold">Crear nueva tarea</h5>
              <button type="button" className="btn-close" onClick={onClose}></button>
            </div>
            <form onSubmit={handleSubmit}>
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
                      fetchSuggestion();
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
                <div className="row mb-3">
                  <div className="col-md-6">
                    <div className="form-floating">
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
                  </div>
                  <div className="col-md-6">
                    <div className="form-floating">
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
                  </div>
                </div>
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
                <button type="submit" className="btn btn-primary px-4 py-2" disabled={loading}>
                  {loading ? 'Creando...' : 'Crear'}
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

export default CreateTaskModal;
