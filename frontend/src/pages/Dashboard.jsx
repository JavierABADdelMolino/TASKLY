import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLoader } from '../context/LoaderContext';
import Layout from '../components/layout/Layout';
import BoardHeader from '../components/dashboard/BoardHeader';
import Board from '../components/dashboard/Board';
import CreateBoardModal from '../components/dashboard/modals/CreateBoardModal';

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

        const resBoards = await fetch(`${process.env.REACT_APP_API_URL}/boards`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const boardsData = await resBoards.json();
        if (!resBoards.ok) throw new Error(boardsData.message);

        setBoards(boardsData);
        setActiveBoard(boardsData[0] || null);
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
            {activeBoard && <Board board={activeBoard} />}
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
