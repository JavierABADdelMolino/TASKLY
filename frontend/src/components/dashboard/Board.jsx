import { useState } from 'react';
import CreateColumnModal from './modals/CreateColumnModal';
import ConfirmDeleteBoardModal from './modals/ConfirmDeleteBoardModal';
import ColumnList from './ColumnList';
import { FaStar } from 'react-icons/fa';

const Board = ({ board, onToggleFavorite, onBoardUpdated, onBoardDeleted }) => {
  const [showColumnModal, setShowColumnModal] = useState(false);
  const [refreshFlag, setRefreshFlag] = useState(false);
  const [showDeleteBoard, setShowDeleteBoard] = useState(false);
  const [columnCount, setColumnCount] = useState(0);

  const handleColumnCreated = () => {
    setShowColumnModal(false);
    setRefreshFlag((p) => !p);
  };

  return (
    <div className="border rounded shadow-sm p-4 bg-white">
      {/* Favorito & Añadir columna */}
      <div className="d-flex align-items-center mb-3">
        {/* Botón favorito */}
        <button
          className="btn btn-link p-1"
          onClick={() => onToggleFavorite && onToggleFavorite(board._id)}
          title={board.favorite ? 'Eliminar favorito' : 'Marcar como favorito'}
        >
          <FaStar color={board.favorite ? 'gold' : 'gray'} size={20} />
        </button>
        {/* Botones añadir columna y eliminar pizarra alineados a la derecha */}
        <div className="ms-auto d-flex gap-2">
          <button className="btn btn-sm btn-outline-primary" onClick={() => setShowColumnModal(true)}>
            + Añadir columna
          </button>
          <button className="btn btn-sm btn-outline-danger" onClick={() => setShowDeleteBoard(true)}>
            Eliminar pizarra
          </button>
        </div>
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

      {/* Confirm delete board */}
      <ConfirmDeleteBoardModal
        show={showDeleteBoard}
        onClose={() => setShowDeleteBoard(false)}
        onConfirm={() => onBoardDeleted(board._id)}
      />
    </div>
  );
};

export default Board;
