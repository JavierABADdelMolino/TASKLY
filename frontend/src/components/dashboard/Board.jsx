import { useState, useEffect } from 'react';
import BoardSelector from './BoardSelector';
import CreateColumnModal from './modals/CreateColumnModal';
import ColumnList from './ColumnList';

const Board = ({ boards }) => {
  const [activeBoard, setActiveBoard] = useState(null);
  const [showColumnModal, setShowColumnModal] = useState(false);
  const [columnRefreshFlag, setColumnRefreshFlag] = useState(false); // para recargar ColumnList

  useEffect(() => {
    if (boards.length > 0) {
      setActiveBoard(boards[0]);
    }
  }, [boards]);

  return (
    <div className="container pb-5">
      {activeBoard ? (
        <div className="border rounded shadow-sm p-4 bg-white">
          {/* Encabezado de la pizarra */}
          <div className="d-flex justify-content-between align-items-start mb-4 flex-wrap gap-3">
            <div className="d-flex flex-column">
              <BoardSelector
                boards={boards}
                selectedBoard={activeBoard}
                onChange={setActiveBoard}
              />
              {activeBoard.description && (
                <p className="text-muted small mt-2 mb-0">{activeBoard.description}</p>
              )}
            </div>

            <button
              className="btn btn-sm btn-outline-primary"
              onClick={() => setShowColumnModal(true)}
            >
              + Añadir columna
            </button>
          </div>

          {/* Lista de columnas */}
          <ColumnList
            boardId={activeBoard._id}
            refresh={columnRefreshFlag}
          />
        </div>
      ) : (
        <div className="text-center text-muted py-5">
          <p>Selecciona una pizarra para comenzar.</p>
        </div>
      )}

      {/* Modal para crear columna */}
      {activeBoard && showColumnModal && (
        <CreateColumnModal
          show={showColumnModal}
          boardId={activeBoard._id}
          onClose={() => setShowColumnModal(false)}
          onColumnCreated={(newColumn) => {
            setShowColumnModal(false);
            setColumnRefreshFlag((prev) => !prev); // fuerza refresco de columnas
          }}
        />
      )}
    </div>
  );
};

export default Board;
