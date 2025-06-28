import { useEffect, useState, useCallback } from 'react';
import Column from './Column';
import Task from './Task';
import { getColumnsByBoard, updateColumn, deleteColumn } from '../../services/columnService';
import { DndContext, DragOverlay, closestCenter, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, horizontalListSortingStrategy, arrayMove } from '@dnd-kit/sortable';
import { updateTask } from '../../services/taskService';

const ColumnList = ({ boardId, refresh, onColumnCountChange, taskFilter = 'all' }) => {
  const [columns, setColumns] = useState([]);
  const [error, setError] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0); // Nuevo estado global de refresco
  const [activeDragItem, setActiveDragItem] = useState(null);

  // sensores para arrastrar tareas y columnas
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

  // manejar drop de tarea o de columna
  const handleDragEnd = async (event) => {
    const { active, over } = event;
    setActiveDragItem(null);
    if (!over || active.id === over.id) return;
    const data = active.data.current;
    try {
      // tarea
      if (data && data.task) {
        await updateTask(active.id, { column: over.id });
        setRefreshKey((k) => k + 1);
      }
      // columna
      else if (data && data.type === 'column') {
        const srcIndex = columns.findIndex(c => c._id === active.id);
        const dstIndex = columns.findIndex(c => c._id === over.id);
        if (srcIndex < 0 || dstIndex < 0) return;
        // reorder locally for smooth UI
        setColumns(cols => arrayMove(cols, srcIndex, dstIndex));
        // swap their order values for persistence
        const newColumns = [...columns];
        const tempOrder = newColumns[srcIndex].order;
        newColumns[srcIndex].order = newColumns[dstIndex].order;
        newColumns[dstIndex].order = tempOrder;
        try {
          // persist to backend (swap orders)
          await updateColumn(active.id, { order: newColumns[dstIndex].order });
          await updateColumn(over.id, { order: newColumns[srcIndex].order });
        } catch (err) {
          console.error('Error actualizando orden de columnas', err);
        }
      }
    } catch (err) {
      console.error('Error en DnD:', err);
    }
  };

  const handleDragStart = ({ active }) => {
    const data = active.data.current;
    if (data) {
      setActiveDragItem(data);
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
        <SortableContext items={columns.map(c => c._id)} strategy={horizontalListSortingStrategy}>
          <div className="d-flex gap-4" style={{ width: 'max-content', margin: '0 auto' }}>
            {columns.length === 0 ? (
              <p className="text-muted">No hay columnas aún en esta pizarra.</p>
            ) : (
              columns.map((col) => (
                <div key={col._id} className="flex-shrink-0">
                  <Column
                    column={col}
                    allColumns={columns}
                    onColumnDeleted={handleColumnDeleted}
                    onColumnUpdated={handleColumnUpdated}
                    refreshKey={refreshKey}
                    onAnyTaskChange={handleGlobalRefresh}
                    taskFilter={taskFilter}
                  />
                </div>
              ))
            )}
          </div>
        </SortableContext>
      </div>
      {/* Overlay para la tarea arrastrada o columna */}
      <DragOverlay>
        {activeDragItem?.task ? (
          <Task
            task={activeDragItem.task}
            column={activeDragItem.column}
            columns={columns}
          />
        ) : activeDragItem?.column ? (
          // Placeholder overlay for column drag
          <div className="card shadow-sm column-card" style={{ width: '280px', opacity: 0.8 }}>
            <div className="card-body p-2 d-flex justify-content-center">
              <h5 className="mb-0 text-truncate" style={{ fontSize: '0.9rem' }}>
                {activeDragItem.column.title}
              </h5>
            </div>
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};

export default ColumnList;
