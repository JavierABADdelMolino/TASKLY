import { useAuth } from '../context/AuthContext';
import Layout from '../components/layout/Layout';

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <Layout>
      <div className="text-center py-5">
        <h2 className="mb-2">¡Hola, {user?.firstName}!</h2>
        <p className="text-muted">Te damos la bienvenida a tu panel de tareas.</p>
      </div>
    </Layout>
  );
};

export default Dashboard;
