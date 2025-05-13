import { useAuth } from '../context/AuthContext';
import Layout from '../components/layout/Layout';

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <Layout>
      <div className="text-center py-5">
        <h2 className="mb-3">Bienvenido, {user?.username}</h2>
        <p className="mb-4">Has iniciado sesión correctamente.</p>
      </div>
    </Layout>
  );
};

export default Dashboard;
