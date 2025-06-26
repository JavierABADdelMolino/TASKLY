import { useState } from 'react';
import { updateColumn, deleteColumn } from '../../../services/columnService';
import ConfirmDeleteColumnModal from './ConfirmDeleteColumnModal';

const EditColumnModal = ({ show, column, onClose, onColumnUpdated, onColumnDeleted }) => {
  const [title, setTitle] = useState(column.title);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  if (!show) return null;

  const handleUpdate = async (e) => {
    e.preventDefault();
    setError('');
    if (!title.trim()) return setError('El título es obligatorio');
    setLoading(true);
    try {
      const data = await updateColumn(column._id, { title });
      if (data.message) throw new Error(data.message);
      onColumnUpdated(data);
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = () => {
    setShowConfirmDelete(true);
  };

  const confirmDelete = async () => {
    try {
      await deleteColumn(column._id);
      onColumnDeleted(column._id);
      onClose();
    } catch (err) {
      setError('Error al eliminar columna: ' + err.message);
      setShowConfirmDelete(false);
    }
  };

  if (showConfirmDelete) {
    return <ConfirmDeleteColumnModal
      show={true}
      onClose={() => setShowConfirmDelete(false)}
      onConfirm={confirmDelete}
    />;
  }

  return (
    <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0 }}>
      <div className="modal-dialog modal-dialog-centered" role="document">
        <div className="modal-content shadow-sm">
          <div className="modal-header border-bottom-0">
            <h5 className="modal-title text-center w-100 fw-bold">Editar columna</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <form onSubmit={handleUpdate}>
            <div className="modal-body pt-0">
              <div className="mb-3 form-floating">
                <input
                  type="text"
                  id="title"
                  className={`form-control ${error ? 'is-invalid' : ''}`}
                  value={title}
                  onChange={(e) => {
                    setTitle(e.target.value);
                    setError('');
                  }}
                  placeholder="Título"
                />
                <label htmlFor="title">Título</label>
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
  );
};

export default EditColumnModal;
