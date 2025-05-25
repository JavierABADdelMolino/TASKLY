import { useState } from 'react';

const EditColumnModal = ({ show, column, onClose, onColumnUpdated, onColumnDeleted }) => {
  const [title, setTitle] = useState(column.title);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const API_BASE_URL = process.env.REACT_APP_API_URL;

  if (!show) return null;

  const handleUpdate = async (e) => {
    e.preventDefault();
    setError('');
    if (!title.trim()) return setError('El título es obligatorio');
    setLoading(true);
    try {
      const token = sessionStorage.getItem('token');
      const res = await fetch(`${API_BASE_URL}/columns/${column._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token },
        body: JSON.stringify({ title })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      onColumnUpdated(data);
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('¿Eliminar esta columna?')) return;
    try {
      const token = sessionStorage.getItem('token');
      const res = await fetch(`${API_BASE_URL}/columns/${column._id}`, {
        method: 'DELETE',
        headers: { Authorization: 'Bearer ' + token }
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message);
      }
      onColumnDeleted(column._id);
      onClose();
    } catch (err) {
      alert('Error al eliminar columna: ' + err.message);
    }
  };

  return (
    <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Editar columna</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <form onSubmit={handleUpdate}>
            <div className="modal-body">
              <div className="mb-3">
                <label className="form-label">Título</label>
                <input
                  type="text"
                  className="form-control"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
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

export default EditColumnModal;
