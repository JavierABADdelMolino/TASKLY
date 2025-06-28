import { FiFilter, FiCheckCircle } from 'react-icons/fi';
import { MdOutlinePendingActions } from 'react-icons/md';

const FILTERS = [
  { value: 'all', label: 'Todas', icon: <FiFilter size={16} /> },
  { value: 'pending', label: 'Pendientes', icon: <MdOutlinePendingActions size={16} /> },
  { value: 'completed', label: 'Completadas', icon: <FiCheckCircle size={16} /> },
];

const BoardTaskFilter = ({ value, onChange }) => {
  return (
    <div className="task-filter-dropdown ms-2">
      {FILTERS.map(f => (
        <button
          key={f.value}
          className={`task-filter-btn${value === f.value ? ' active' : ''}`}
          onClick={() => onChange(f.value)}
          title={f.label}
          type="button"
        >
          {f.icon}
          <span className="ms-1 d-none d-md-inline">{f.label}</span>
        </button>
      ))}
    </div>
  );
};

export default BoardTaskFilter;
