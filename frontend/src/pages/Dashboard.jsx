import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLoader } from '../context/LoaderContext';
import Layout from '../components/layout/Layout';
import CreateBoardModal from '../components/dashboard/modals/CreateBoardModal';
import Board from '../components/dashboard/Board';

const Dashboard = () => {
  const { user, setUser } = useAuth();
  const { setShowLoader } = useLoader();
  const [error, setError] = useState(null);
  const [boards, setBoards] = useState([]);
  const [showModal, setShowModal] = useState(false);

  /* Callback central: agrega la nueva board al estado */
  const handleBoardCreated = (newBoard) => {
    setBoards((prev) => [...prev, newBoard]);
  };

  /* Cargar usuario + boards al montar */
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
      <div className="container py-5 text-center">
        {error ? (
          <div className="alert alert-danger">{error}</div>
        ) : boards.length === 0 ? (
          <>
            <h2 className="mb-3">¡Hola, {user?.firstName || 'usuario'}!</h2>
            <p className="text-muted fs-5 mb-4">
              Aún no tienes ninguna pizarra. ¡Crea tu primera para comenzar!
            </p>
            <button className="btn btn-lg btn-primary" onClick={() => setShowModal(true)}>
              + Crear tu primera pizarra
            </button>
          </>
        ) : (
          <>
            <h2 className="mb-4">Tus pizarras</h2>
            <Board boards={boards} />
          </>
        )}
      </div>

      {/* Modal inicial cuando aún no hay boards */}
      {showModal && (
        <CreateBoardModal
          show={showModal}
          onClose={() => setShowModal(false)}
          onBoardCreated={(b) => {
            handleBoardCreated(b);
            setShowModal(false);
          }}
        />
      )}
    </Layout>
  );
};

export default Dashboard;
