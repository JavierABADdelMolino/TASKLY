import { useEffect, useState, useCallback } from 'react';
import Column from './Column';
import { getColumnsByBoard, updateColumn, deleteColumn } from '../../services/columnService';

const ColumnList = ({ boardId, refresh, onColumnCountChange }) => {
  const [columns, setColumns] = useState([]);
  const [error, setError] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0); // Nuevo estado global de refresco

  // función para obtener y ordenar columnas
  const fetchColumns = useCallback(async () => {
    try {
      const data = await getColumnsByBoard(boardId);
      const sorted = data.sort((a, b) => a.order - b.order);
      setColumns(sorted);
      onColumnCountChange?.(sorted.length);
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
      await updateColumn(column._id, { order: target.order });
      await updateColumn(target._id, { order: column.order });
      fetchColumns();
    } catch (err) {
      console.error('Error al mover columna', err);
    }
  };

  // eliminar columna y recargar
  const handleColumnDeleted = useCallback(async (id) => {
    try {
      await deleteColumn(id);
      fetchColumns();
    } catch (err) {
      console.error(err);
      setError(err.message);
    }
  }, [fetchColumns]);
  // actualizar columna localmente recargando lista
  const handleColumnUpdated = useCallback(() => {
    fetchColumns();
  }, [fetchColumns]);

  // Handler global para refrescar todas las columnas/tareas
  const handleGlobalRefresh = () => setRefreshKey((k) => k + 1);

  // cargar columnas al montar o al cambiar boardId/refresh
  useEffect(() => {
    if (boardId) fetchColumns();
  }, [boardId, refresh, fetchColumns]);

  if (error) {
    return <div className="text-danger">{error}</div>;
  }

  return (
    <div className="d-flex gap-4 flex-nowrap overflow-auto">
      {columns.length === 0 ? (
        <p className="text-muted">No hay columnas aún en esta pizarra.</p>
      ) : (
        columns.map((col, idx) => (
          <div key={col._id} className="flex-shrink-0">
            <Column
              column={col}
              index={idx}
              total={columns.length}
              allColumns={columns}
              onMove={moveColumn}
              onColumnDeleted={handleColumnDeleted}
              onColumnUpdated={handleColumnUpdated}
              refreshKey={refreshKey}
              onAnyTaskChange={handleGlobalRefresh}
            />
          </div>
        ))
      )}
    </div>
  );
};

export default ColumnList;
