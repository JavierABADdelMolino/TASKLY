import { useEffect, useState } from 'react';
import Column from './Column';

// Constante fuera del componente para evitar warning de ESLint
const API_BASE_URL = process.env.REACT_APP_API_URL;

const ColumnList = ({ boardId, refresh }) => {
  const [columns, setColumns] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchColumns = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/columns/${boardId}`, {
          headers: {
            Authorization: 'Bearer ' + sessionStorage.getItem('token')
          }
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Error al obtener columnas');
        setColumns(data);
      } catch (err) {
        console.error(err);
        setError(err.message);
      }
    };

    if (boardId) {
      fetchColumns();
    }
  }, [boardId, refresh]); // ← reactualiza si cambia el board o si se crea una nueva columna

  if (error) {
    return <div className="text-danger">{error}</div>;
  }

  return (
    <div className="d-flex gap-4 flex-wrap">
      {columns.length === 0 ? (
        <p className="text-muted">No hay columnas aún en esta pizarra.</p>
      ) : (
        columns.map((col) => <Column key={col._id} column={col} />)
      )}
    </div>
  );
};

export default ColumnList;
