import { useEffect, useState } from 'react';
import Column from './Column';

const API_BASE_URL = process.env.REACT_APP_API_URL;

const ColumnList = ({ boardId, refresh, onColumnCountChange }) => {
  const [columns, setColumns] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchColumns = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/columns/board/${boardId}`, {
          headers: {
            Authorization: 'Bearer ' + sessionStorage.getItem('token')
          }
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Error al obtener columnas');

        const sorted = data.sort((a, b) => a.order - b.order);
        setColumns(sorted);

        // 🆕 Notificar al padre cuántas columnas hay
        if (onColumnCountChange) {
          onColumnCountChange(sorted.length);
        }
      } catch (err) {
        console.error(err);
        setError(err.message);
      }
    };

    if (boardId) {
      fetchColumns();
    }
  }, [boardId, refresh, onColumnCountChange]);

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
