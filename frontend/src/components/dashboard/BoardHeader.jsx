import { useState, useEffect } from 'react';
import { FaChevronLeft, FaChevronRight, FaInfoCircle } from 'react-icons/fa';

const BoardHeader = ({ boards, activeBoard, setActiveBoard }) => {
  const [idx, setIdx] = useState(0);
  const [showInfo, setShowInfo] = useState(false);

  /* Sincroniza índice cuando cambia activeBoard desde fuera */
  useEffect(() => {
    const i = boards.findIndex((b) => b._id === activeBoard?._id);
    if (i !== -1) setIdx(i);
  }, [activeBoard, boards]);

  const prev = boards[idx - 1];
  const next = boards[idx + 1];

  const go = (step) => {
    const newIdx = idx + step;
    if (newIdx < 0 || newIdx >= boards.length) return;
    setIdx(newIdx);
    setActiveBoard(boards[newIdx]);
  };

  return (
    <>
      {/* barra principal */}
      <div className="d-flex align-items-center justify-content-center gap-3 flex-wrap mb-3">
        {/* ← Flecha izquierda */}
        <button
          className="btn btn-outline-secondary btn-sm"
          onClick={() => go(-1)}
          disabled={!prev}
        >
          <FaChevronLeft />
        </button>

        {/* Nombre anterior */}
        <span className="text-muted small">{prev?.title}</span>

        {/* Nombre actual + botón info */}
        <span className="fw-bold fs-3 d-flex align-items-center gap-2">
          {activeBoard?.title}
          {activeBoard?.description && (
            <button
              className="btn btn-link p-0"
              onClick={() => setShowInfo(true)}
              title="Ver descripción"
            >
              <FaInfoCircle />
            </button>
          )}
        </span>

        {/* Nombre siguiente */}
        <span className="text-muted small">{next?.title}</span>

        {/* Flecha derecha → */}
        <button
          className="btn btn-outline-secondary btn-sm"
          onClick={() => go(1)}
          disabled={!next}
        >
          <FaChevronRight />
        </button>
      </div>

      {/* Modal descripción */}
      {showInfo && (
        <div
          className="modal show d-block"
          tabIndex="-1"
          role="dialog"
          style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{activeBoard.title}</h5>
                <button className="btn-close" onClick={() => setShowInfo(false)} />
              </div>
              <div className="modal-body">
                <p>{activeBoard.description}</p>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setShowInfo(false)}>
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default BoardHeader;
