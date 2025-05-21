import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLoader } from '../context/LoaderContext';
import Layout from '../components/layout/Layout';

const Dashboard = () => {
  const { user, setUser } = useAuth();
  const { setShowLoader } = useLoader();
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const token = sessionStorage.getItem('token');
      if (!token) return;

      setShowLoader(true);
      try {
        const res = await fetch(`${process.env.REACT_APP_API_URL}/users/me`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Error al obtener usuario');
        setUser(data);
      } catch (err) {
        console.error(err);
        setError('Error al cargar el usuario');
      } finally {
        setShowLoader(false);
      }
    };

    fetchUser();
  }, [setUser, setShowLoader]);

  return (
    <Layout>
      <div className="text-center py-5">
        {error ? (
          <p className="text-danger">{error}</p>
        ) : (
          <>
            <h2 className="mb-2">¡Hola, {user?.firstName || 'usuario'}!</h2>
            <p className="text-muted">Te damos la bienvenida a tu panel de tareas.</p>
          </>
        )}
      </div>
    </Layout>
  );
};

export default Dashboard;
