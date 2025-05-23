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

  useEffect(() => {
    const fetchUserAndBoards = async () => {
      const token = sessionStorage.getItem('token');
      if (!token) return;

      setShowLoader(true);
      try {
        // Obtener usuario
        const resUser = await fetch(`${process.env.REACT_APP_API_URL}/users/me`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const userData = await resUser.json();
        if (!resUser.ok) throw new Error(userData.message || 'Error al obtener usuario');
        setUser(userData);

        // Obtener boards
        const resBoards = await fetch(`${process.env.REACT_APP_API_URL}/boards`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const boardsData = await resBoards.json();
        if (!resBoards.ok) throw new Error(boardsData.message || 'Error al obtener pizarras');
        setBoards(boardsData);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setShowLoader(false);
      }
    };

    fetchUserAndBoards();
  }, [setUser, setShowLoader]);

  return (
    <Layout>
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
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                fill="currentColor"
                className="bi bi-plus-circle me-2"
                viewBox="0 0 16 16"
              >
                <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z" />
                <path d="M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14zm0 1A8 8 0 1 1 8 0a8 8 0 0 1 0 16z" />
              </svg>
              Crear tu primera pizarra
            </button>
          </>
        ) : (
          <>
            <h2 className="mb-4">Tus pizarras</h2>
            <Board boards={boards} />
          </>
        )}
      </div>

      {showModal && (
        <CreateBoardModal
          show={showModal}
          onClose={() => setShowModal(false)}
          onBoardCreated={(newBoard) => {
            setBoards((prev) => [...prev, newBoard]);
            setShowModal(false);
          }}
        />
      )}
    </Layout>
  );
};

export default Dashboard;
