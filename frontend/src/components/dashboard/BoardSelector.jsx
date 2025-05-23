const BoardSelector = ({ boards, selectedBoard, onChange }) => {
  const handleChange = (e) => {
    const selectedId = e.target.value;
    const board = boards.find((b) => b._id === selectedId);
    onChange(board);
  };

  return (
    <div className="d-flex align-items-center">
      <label htmlFor="boardSelect" className="me-2 mb-0 fw-semibold text-muted">
        Pizarra:
      </label>
      <select
        id="boardSelect"
        className="form-select form-select-sm"
        style={{ minWidth: '200px' }}
        value={selectedBoard?._id || ''}
        onChange={handleChange}
      >
        {boards.map((board) => (
          <option key={board._id} value={board._id}>
            {board.title}
          </option>
        ))}
      </select>
    </div>
  );
};

export default BoardSelector;
