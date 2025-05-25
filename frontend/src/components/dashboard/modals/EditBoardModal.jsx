import { useState } from 'react';

const EditBoardModal = ({ show, board, onClose, onBoardUpdated, onBoardDeleted }) => {
  const [title, setTitle] = useState(board.title);
  const [description, setDescription] = useState(board.description || '');
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
      const res = await fetch(`${API_BASE_URL}/boards/${board._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token },
        body: JSON.stringify({ title, description })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      onBoardUpdated(data);
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('¿Seguro que quieres eliminar esta pizarra?')) return;
    try {
      const token = sessionStorage.getItem('token');
      const res = await fetch(`${API_BASE_URL}/boards/${board._id}`, {
        method: 'DELETE',
        headers: { Authorization: 'Bearer ' + token }
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message);
      }
      onBoardDeleted(board._id);
      onClose();
    } catch (err) {
      alert('Error al eliminar pizarra: ' + err.message);
    }
  };

  return (
    <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Editar pizarra</h5>
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
              <div className="mb-3">
                <label className="form-label">Descripción</label>
                <textarea
                  className="form-control"
                  rows="3"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                ></textarea>
              </div>
              {error && <div className="alert alert-danger small">{error}</div>}
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={onClose}>Cancelar</button>
              <button type="button" className="btn btn-danger me-auto" onClick={handleDelete}>Eliminar</button>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Guardando...' : 'Guardar cambios'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditBoardModal;
