import { useEffect, useState, useCallback } from 'react';
import Column from './Column';

const API_BASE_URL = process.env.REACT_APP_API_URL;

const ColumnList = ({ boardId, refresh, onColumnCountChange }) => {
  const [columns, setColumns] = useState([]);
  const [error, setError] = useState(null);

  // función para obtener y ordenar columnas
  const fetchColumns = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/columns/board/${boardId}`, {
        headers: { Authorization: 'Bearer ' + sessionStorage.getItem('token') }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Error al obtener columnas');

      const sorted = data.sort((a, b) => a.order - b.order);
      setColumns(sorted);
      if (onColumnCountChange) onColumnCountChange(sorted.length);
    } catch (err) {
      console.error(err);
      setError(err.message);
    }
  }, [boardId, onColumnCountChange]);

  // mover columna en UI y backend
  const moveColumn = async (column, direction) => {
    const idx = columns.findIndex((c) => c._id === column._id);
    const targetIdx = idx + direction;
    if (targetIdx < 0 || targetIdx >= columns.length) return;
    const target = columns[targetIdx];
    try {
      const token = sessionStorage.getItem('token');
      // intercambiar order en backend
      await Promise.all([
        fetch(`${API_BASE_URL}/columns/${column._id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token },
          body: JSON.stringify({ order: target.order })
        }),
        fetch(`${API_BASE_URL}/columns/${target._id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token },
          body: JSON.stringify({ order: column.order })
        })
      ]);
      // recargar
      fetchColumns();
    } catch (err) {
      console.error('Error al mover columna', err);
    }
  };

  // cargar columnas al montar o al cambiar boardId/refresh
  useEffect(() => {
    if (boardId) fetchColumns();
  }, [boardId, refresh, fetchColumns]);

  if (error) {
    return <div className="text-danger">{error}</div>;
  }

  return (
    <div className="d-flex gap-4 flex-wrap">
      {columns.length === 0 ? (
        <p className="text-muted">No hay columnas aún en esta pizarra.</p>
      ) : (
        columns.map((col, idx) => (
          <Column
            key={col._id}
            column={col}
            index={idx}
            total={columns.length}
            onMove={moveColumn}
          />
        ))
      )}
    </div>
  );
};

export default ColumnList;
