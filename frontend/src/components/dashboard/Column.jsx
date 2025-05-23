const Column = ({ column }) => {
  return (
    <div className="card shadow-sm" style={{ width: '280px' }}>
      <div className="card-body">
        <h5 className="card-title mb-2">{column.title}</h5>
        <p className="text-muted small mb-0">Orden: {column.order}</p>
        {/* Aquí irán las tareas más adelante */}
      </div>
    </div>
  );
};

export default Column;
