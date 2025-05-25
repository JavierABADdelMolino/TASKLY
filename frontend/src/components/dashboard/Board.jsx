import { useState } from 'react';
import CreateColumnModal from './modals/CreateColumnModal';
import ColumnList from './ColumnList';
import { FaStar } from 'react-icons/fa';

const Board = ({ board, onToggleFavorite }) => {
  const [showColumnModal, setShowColumnModal] = useState(false);
  const [refreshFlag, setRefreshFlag] = useState(false);
  const [columnCount, setColumnCount] = useState(0);

  const handleColumnCreated = () => {
    setShowColumnModal(false);
    setRefreshFlag((p) => !p);
  };

  return (
    <div className="border rounded shadow-sm p-4 bg-white">
      {/* Botón favorito */}
      <div className="d-flex justify-content-end mb-2">
        <button
          type="button"
          className="btn btn-link p-0"
          onClick={() => onToggleFavorite && onToggleFavorite(board._id)}
          title={board.favorite ? 'Eliminar favorito' : 'Marcar como favorito'}
        >
          <FaStar color={board.favorite ? 'gold' : 'gray'} size={20} />
        </button>
      </div>

      {/* Botón añadir columna */}
      <div className="d-flex justify-content-end mb-3">
        <button className="btn btn-sm btn-outline-primary" onClick={() => setShowColumnModal(true)}>
          + Añadir columna
        </button>
      </div>

      {/* Columnas */}
      <ColumnList
        boardId={board._id}
        refresh={refreshFlag}
        onColumnCountChange={setColumnCount}
      />

      {/* Modal crear columna */}
      {showColumnModal && (
        <CreateColumnModal
          show={showColumnModal}
          boardId={board._id}
          currentColumnCount={columnCount}
          onClose={() => setShowColumnModal(false)}
          onColumnCreated={handleColumnCreated}
        />
      )}
    </div>
  );
};

export default Board;
