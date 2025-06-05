import { useEffect, useState, useCallback } from 'react';
import Column from './Column';
import Task from './Task';
import { getColumnsByBoard, updateColumn, deleteColumn } from '../../services/columnService';
import { DndContext, DragOverlay, closestCenter, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { updateTask } from '../../services/taskService';

const ColumnList = ({ boardId, refresh, onColumnCountChange }) => {
  const [columns, setColumns] = useState([]);
  const [error, setError] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0); // Nuevo estado global de refresco
  const [activeDragItem, setActiveDragItem] = useState(null);

  // sensores para arrastrar tareas
  const sensors = useSensors(useSensor(PointerSensor));

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

  // manejar drop de tarea en columna
  const handleDragEnd = async (event) => {
    const { active, over } = event;
    setActiveDragItem(null);
    if (!over || active.id === over.id) return;
    const targetColumnId = over.id;
    try {
      await updateTask(active.id, { column: targetColumnId });
      setRefreshKey((k) => k + 1);
    } catch (err) {
      console.error('Error al mover tarea por DnD', err);
    }
  };

  const handleDragStart = ({ active }) => {
    if (active.data && active.data.current) {
      setActiveDragItem(active.data.current);
    }
  };
  const handleDragCancel = () => setActiveDragItem(null);

  if (error) {
    return <div className="text-danger">{error}</div>;
  }

  return (
    <DndContext
      onDragStart={handleDragStart}
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      <div className="overflow-auto" style={{ padding: '1rem 0' }}>
        <div className="d-flex gap-4" style={{ width: 'max-content', margin: '0 auto' }}>
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
      </div>
      {/* Overlay para la tarea arrastrada */}
      <DragOverlay>
        {activeDragItem ? (
          <Task
            task={activeDragItem.task}
            column={activeDragItem.column}
            columns={columns}
          />
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};

export default ColumnList;
