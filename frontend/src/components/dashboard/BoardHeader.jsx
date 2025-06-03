import { useState, useEffect } from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { FaInfoCircle } from 'react-icons/fa';
import InfoModal from './modals/InfoModal';

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
        {prev && (
          <button
            className="btn btn-link p-1 text-secondary"
            onClick={() => go(-1)}
          >
            <FiChevronLeft size={16} />
          </button>
        )}

        {/* Nombre anterior */}
        <span className="text-muted small">{prev?.title}</span>

        {/* Nombre actual + botón info */}
        <span className="fw-bold fs-3 d-flex align-items-center gap-2 position-relative">
          {activeBoard?.title}
          {activeBoard?.description && (
            <div
              className="position-relative d-inline-block"
              onMouseEnter={() => setShowInfo(true)}
              onMouseLeave={() => setShowInfo(false)}
            >
              <button
                className="btn btn-link p-1 text-info"
                title="Ver descripción"
              >
                <FaInfoCircle size={20} />
              </button>
              {showInfo && (
                <InfoModal
                  description={activeBoard.description}
                  isFavorite={activeBoard.favorite}
                />
              )}
            </div>
          )}
        </span>

        {/* Nombre siguiente */}
        <span className="text-muted small">{next?.title}</span>

        {/* Flecha derecha → */}
        {next && (
          <button
            className="btn btn-link p-1 text-secondary"
            onClick={() => go(1)}
          >
            <FiChevronRight size={16} />
          </button>
        )}
      </div>
    </>
  );
};

export default BoardHeader;
