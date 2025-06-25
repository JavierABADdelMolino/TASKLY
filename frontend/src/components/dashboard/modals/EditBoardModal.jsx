import { useState } from 'react';
import ConfirmDeleteBoardModal from './ConfirmDeleteBoardModal';
import { updateBoard, deleteBoard } from '../../../services/boardService';

const EditBoardModal = ({ show, board, onClose, onBoardUpdated, onBoardDeleted }) => {
  const [title, setTitle] = useState(board.title);
  const [description, setDescription] = useState(board.description || '');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  if (!show) return null;

  const handleUpdate = async (e) => {
    e.preventDefault();
    setError('');
    if (!title.trim()) return setError('El título es obligatorio');
    setLoading(true);
    try {
      const data = await updateBoard(board._id, { title, description });
      if (data.message) throw new Error(data.message);
      onBoardUpdated(data);
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setError('');
    setLoading(true);
    try {
      await deleteBoard(board._id);
      onBoardDeleted(board._id);
      setShowConfirm(false);
      onClose();
    } catch (err) {
      setError('Error al eliminar pizarra: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content shadow-sm">
          <div className="modal-header border-bottom-0 justify-content-center">
            <h5 className="modal-title text-center w-100 fw-bold">Editar pizarra</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <form onSubmit={handleUpdate}>
            <div className="modal-body pt-0">
              <div className="mb-3 form-floating">
                <input
                  type="text"
                  id="edit-title"
                  className="form-control"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Título"
                />
                <label htmlFor="edit-title">Título</label>
              </div>
              <div className="mb-3 form-floating">
                <textarea
                  id="edit-description"
                  className="form-control"
                  style={{ height: '100px' }}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Descripción"
                ></textarea>
                <label htmlFor="edit-description">Descripción</label>
              </div>
              {error && <div className="alert alert-danger text-center small mb-3 fade-in">{error}</div>}
            </div>
            <div className="modal-footer border-top-0 pt-0">
              <button type="button" className="btn btn-danger me-auto px-3 py-2 fw-medium" onClick={() => setShowConfirm(true)}>Eliminar</button>
              <button type="button" className="btn btn-secondary px-3 py-2 fw-medium" onClick={onClose}>Cancelar</button>
              <button type="submit" className="btn btn-primary px-4 py-2 fw-medium" disabled={loading}>
                {loading ? 'Guardando...' : 'Guardar cambios'}
              </button>
            </div>
          </form>
        {/* Confirm delete board modal */}
        {showConfirm && (
          <ConfirmDeleteBoardModal
            show={showConfirm}
            onClose={() => setShowConfirm(false)}
            onConfirm={handleDelete}
          />
        )}
         </div>
       </div>
     </div>
  );
};

export default EditBoardModal;
