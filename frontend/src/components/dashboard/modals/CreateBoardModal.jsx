import { useState } from 'react';
import { createBoard } from '../../../services/boardService';

const CreateBoardModal = ({ show, onClose, onBoardCreated }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!show) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!title.trim()) {
      setError('El título es obligatorio');
      return;
    }

    setLoading(true);

    try {
      const data = await createBoard({ title, description });
      if (!data._id) {
        setError(data.message || 'Error al crear la pizarra');
      } else {
        onBoardCreated(data);
        onClose();
      }
    } catch (err) {
      setError('Error al conectar con el servidor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="modal show d-block"
      tabIndex="-1"
      role="dialog"
      style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
    >
      <div className="modal-dialog modal-dialog-centered" role="document">
        <div className="modal-content shadow-sm">

          <div className="modal-header border-bottom-0">
            <h5 className="modal-title text-center w-100 fw-bold">Crear nueva pizarra</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="modal-body pt-0">
              <div className="mb-3 form-floating">
                <input
                  type="text"
                  id="title"
                  className="form-control"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
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
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Descripción"
                ></textarea>
                <label htmlFor="description">Descripción</label>
              </div>

              {error && <div className="alert alert-danger text-center small mb-3 fade-in">{error}</div>}
            </div>

            <div className="modal-footer border-top-0 pt-0">
              <button type="button" className="btn btn-secondary px-3 py-2 fw-medium" onClick={onClose}>Cancelar</button>
              <button type="submit" className="btn btn-primary px-4 py-2 fw-medium" disabled={loading}>
                {loading ? 'Creando...' : 'Crear'}
              </button>
            </div>
          </form>

        </div>
      </div>
    </div>
  );
};

export default CreateBoardModal;
