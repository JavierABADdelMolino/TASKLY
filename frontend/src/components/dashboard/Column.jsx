import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

const Column = ({ column, index, total, onMove }) => {
  return (
    <div className="card shadow-sm" style={{ width: '280px' }}>
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-center mb-2">
          {index > 0 && (
            <button className="btn btn-link p-1 text-secondary" onClick={() => onMove(column, -1)}>
              <FiChevronLeft size={16} />
            </button>
          )}
          <h5 className="card-title mb-0 text-center flex-grow-1">{column.title}</h5>
          {index < total - 1 && (
            <button className="btn btn-link p-1 text-secondary" onClick={() => onMove(column, 1)}>
              <FiChevronRight size={16} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Column;
