import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLoader } from '../context/LoaderContext';
import Layout from '../components/layout/Layout';
import BoardHeader from '../components/dashboard/BoardHeader';
import Board from '../components/dashboard/Board';
import CreateBoardModal from '../components/dashboard/modals/CreateBoardModal';
import { getBoards, toggleFavoriteBoard } from '../services/boardService';

const Dashboard = () => {
  const { user, setUser } = useAuth();
  const { setShowLoader } = useLoader();

  const [boards, setBoards] = useState([]);
  const [activeBoard, setActiveBoard] = useState(null);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);

  /* Agrega nueva board */
  const handleBoardCreated = (b) => {
    setBoards((prev) => [...prev, b]);
    setActiveBoard(b);
  };

  /* Marca una board como favorita exclusiva */
  const handleToggleFavorite = async (boardId) => {
    try {
      const updated = await toggleFavoriteBoard(boardId);
      if (updated.message) throw new Error(updated.message);
      // actualizar lista: conservar orden original, solo marcar/desmarcar favorito
      setBoards((prev) =>
        prev.map((b) => {
          if (b._id === updated._id) return updated;
          // si la nueva board quedó favorita, desmarcar las demás
          if (updated.favorite) return { ...b, favorite: false };
          return b;
        })
      );
      setActiveBoard(updated);
    } catch (err) {
      console.error(err);
      setError(err.message);
    }
  };

  /* Actualiza una board tras editar */
  const handleBoardUpdated = (updated) => {
    setBoards((prev) => prev.map((b) => (b._id === updated._id ? updated : b)));
    setActiveBoard(updated);
  };

  /* Borra una board tras eliminar */
  const handleBoardDeleted = (id) => {
    setBoards((prev) => prev.filter((b) => b._id !== id));
    // actualizar activeBoard
    setActiveBoard((prev) => {
      const remaining = boards.filter((b) => b._id !== id);
      return remaining[0] || null;
    });
  };

  /* Cargar usuario y boards */
  useEffect(() => {
    const fetchAll = async () => {
      const token = sessionStorage.getItem('token');
      if (!token) return;
      setShowLoader(true);
      try {
        const resUser = await fetch(`${process.env.REACT_APP_API_URL}/users/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const userData = await resUser.json();
        if (!resUser.ok) throw new Error(userData.message);
        setUser(userData);

        const boardsData = await getBoards();
        if (boardsData.message) throw new Error(boardsData.message);

        setBoards(boardsData);
        // cargar por defecto la board favorita si existe
        const fav = boardsData.find((b) => b.favorite);
        setActiveBoard(fav || boardsData[0] || null);
      } catch (err) {
        setError(err.message);
      } finally {
        setShowLoader(false);
      }
    };
    fetchAll();
  }, [setUser, setShowLoader]);

  return (
    <Layout onBoardCreated={handleBoardCreated}>
      <div className="container py-5">

        {error && <div className="alert alert-danger text-center">{error}</div>}

        {boards.length === 0 ? (
          <div className="text-center">
            <h2 className="mb-3">¡Hola, {user?.firstName || 'usuario'}!</h2>
            <p className="text-muted fs-5 mb-4">
              Aún no tienes ninguna pizarra. ¡Crea tu primera para comenzar!
            </p>
            <button className="btn btn-lg btn-primary" onClick={() => setShowModal(true)}>
              + Crear tu primera pizarra
            </button>
          </div>
        ) : (
          <>
            {/* CABECERA CON FLECHAS, TÍTULO, ℹ️ */}
            {activeBoard && (
              <BoardHeader
                boards={boards}
                activeBoard={activeBoard}
                setActiveBoard={setActiveBoard}
              />
            )}

            {/* CONTENIDO DE LA PIZARRA */}
            {activeBoard && (
              <Board
                board={activeBoard}
                onToggleFavorite={handleToggleFavorite}
                onBoardUpdated={handleBoardUpdated}
                onBoardDeleted={handleBoardDeleted}
              />
            )}
          </>
        )}
      </div>

      {/* Modal para crear board */}
      {showModal && (
        <CreateBoardModal
          show={showModal}
          onClose={() => setShowModal(false)}
          onBoardCreated={handleBoardCreated}
        />
      )}
    </Layout>
  );
};

export default Dashboard;
