import { useState } from 'react';
import CreateColumnModal from './modals/CreateColumnModal';
import EditBoardModal from './modals/EditBoardModal';
import ColumnList from './ColumnList';
import { FaStar } from 'react-icons/fa';
import { FiFilter, FiCheckCircle, FiCircle } from 'react-icons/fi';

const Board = ({ board, onToggleFavorite, onBoardUpdated, onBoardDeleted }) => {
  const [showColumnModal, setShowColumnModal] = useState(false);
  const [refreshFlag, setRefreshFlag] = useState(false);
  const [showEditBoard, setShowEditBoard] = useState(false);
  const [columnCount, setColumnCount] = useState(0);
  const [taskFilter, setTaskFilter] = useState('all'); // 'all', 'pending', 'completed'
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);

  const handleColumnCreated = () => {
    setShowColumnModal(false);
    setRefreshFlag((p) => !p);
  };

  return (
    <div className="card shadow-sm p-4 board-card">
      {/* Favorito & Añadir columna */}
      <div className="d-flex flex-wrap align-items-center mb-3">
        {/* Botón favorito */}
        <button
          className="btn btn-link p-1"
          onClick={() => onToggleFavorite && onToggleFavorite(board._id)}
          title={board.favorite ? 'Eliminar favorito' : 'Marcar como favorito'}
        >
          <FaStar color={board.favorite ? 'gold' : 'gray'} size={20} />
        </button>
        
        {/* Filtro de tareas moderno */}
        <div className="ms-3 position-relative task-filter-container">
          <div className="filter-toggle-wrapper">
            <button 
              className="btn filter-toggle-btn"
              onClick={() => setShowFilterDropdown(!showFilterDropdown)}
              aria-expanded={showFilterDropdown}
            >
              <FiFilter size={16} className="me-2" />
              <span>{taskFilter === 'all' ? 'Todas las tareas' : 
                     taskFilter === 'pending' ? 'Tareas pendientes' : 
                     'Tareas completadas'}</span>
            </button>
          </div>
          
          {showFilterDropdown && (
            <div className="filter-dropdown show" onClick={(e) => e.stopPropagation()}>
              <div className="filter-header">
                <h6>Mostrar tareas</h6>
              </div>
              <div className="filter-options">
                <button 
                  type="button" 
                  className={`filter-option ${taskFilter === 'all' ? 'active' : ''}`}
                  onClick={() => {
                    setTaskFilter('all');
                    setShowFilterDropdown(false);
                  }}
                >
                  <div className="option-icon all">
                    <FiCheckCircle size={18} />
                  </div>
                  <span>Todas</span>
                </button>
                <button 
                  type="button" 
                  className={`filter-option ${taskFilter === 'pending' ? 'active' : ''}`}
                  onClick={() => {
                    setTaskFilter('pending');
                    setShowFilterDropdown(false);
                  }}
                >
                  <div className="option-icon pending">
                    <FiCircle size={18} />
                  </div>
                  <span>Pendientes</span>
                </button>
                <button 
                  type="button" 
                  className={`filter-option ${taskFilter === 'completed' ? 'active' : ''}`}
                  onClick={() => {
                    setTaskFilter('completed');
                    setShowFilterDropdown(false);
                  }}
                >
                  <div className="option-icon completed">
                    <FiCheckCircle size={18} />
                  </div>
                  <span>Completadas</span>
                </button>
              </div>
            </div>
          )}
        </div>
        
        {/* Botones añadir columna y eliminar pizarra alineados a la derecha */}
        <div className="ms-auto d-flex gap-2">
          <button className="btn btn-sm btn-outline-primary" onClick={() => setShowColumnModal(true)}>
            + Añadir columna
          </button>
          <button className="btn btn-sm btn-outline-warning" onClick={() => setShowEditBoard(true)}>
            Editar pizarra
          </button>
        </div>
      </div>

      {/* Columnas */}
      <ColumnList
        boardId={board._id}
        refresh={refreshFlag}
        onColumnCountChange={setColumnCount}
        taskFilter={taskFilter} // Pasar el filtro de tareas a ColumnList
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

      {/* Edit board modal includes delete and save */}
      {showEditBoard && (
        <EditBoardModal
          show={showEditBoard}
          board={board}
          onClose={() => setShowEditBoard(false)}
          onBoardUpdated={onBoardUpdated}
          onBoardDeleted={onBoardDeleted}
        />
      )}
    </div>
  );
};

export default Board;
