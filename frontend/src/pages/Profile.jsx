import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLoader } from '../context/LoaderContext';
import Layout from '../components/layout/Layout';

const Profile = () => {
  const { user } = useAuth();
  const { setShowLoader } = useLoader();

  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    birthDate: '',
    gender: '',
    theme: '',
    avatarUrl: '',
    role: '',
    createdAt: '',
  });
  const [newAvatarFile, setNewAvatarFile] = useState(null);
  const [avatarDeleted, setAvatarDeleted] = useState(false);

  useEffect(() => {
    setShowLoader(true);
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        username: user.username || '',
        email: user.email || '',
        birthDate: user.birthDate?.slice(0, 10) || '',
        gender: user.gender || '',
        theme: user.theme || '',
        avatarUrl: user.avatarUrl || '',
        role: user.role || '',
        createdAt: user.createdAt?.slice(0, 10) || '',
      });
    }
    setTimeout(() => setShowLoader(false), 800);
  }, [user, setShowLoader]);

  const handleEdit = () => setEditMode(true);

  const handleCancel = () => {
    setEditMode(false);
    setNewAvatarFile(null);
    setAvatarDeleted(false);
    if (user) {
      setFormData({
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username,
        email: user.email,
        birthDate: user.birthDate?.slice(0, 10),
        gender: user.gender,
        theme: user.theme,
        avatarUrl: user.avatarUrl,
        role: user.role,
        createdAt: user.createdAt?.slice(0, 10),
      });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAvatarChange = (e) => {
    setNewAvatarFile(e.target.files[0]);
    setAvatarDeleted(false);
  };

  const handleAvatarDelete = () => {
    setFormData(prev => ({ ...prev, avatarUrl: '' }));
    setNewAvatarFile(null);
    setAvatarDeleted(true);
  };

  return (
    <Layout>
      <div className="container py-4" style={{ maxWidth: '640px' }}>
        <h2 className="mb-4">Mi perfil</h2>

        <form className="card p-4 shadow-sm">
          {/* Avatar */}
          <div className="text-center mb-4">
            {formData.avatarUrl && !avatarDeleted ? (
              <img
                src={`${process.env.REACT_APP_URL}${formData.avatarUrl}`}
                alt="Avatar"
                className="rounded-circle border"
                style={{ width: '100px', height: '100px', objectFit: 'cover' }}
              />
            ) : (
              <div className="rounded-circle bg-secondary text-white d-flex justify-content-center align-items-center"
                   style={{ width: '100px', height: '100px' }}>
                <span className="fw-bold">Sin foto</span>
              </div>
            )}

            {editMode && (
              <div className="mt-3 d-flex flex-column align-items-center">
                <label className="form-label">Cambiar avatar</label>
                <input
                  type="file"
                  className="form-control mb-2"
                  onChange={handleAvatarChange}
                />
                {formData.avatarUrl && !avatarDeleted && (
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-danger"
                    onClick={handleAvatarDelete}
                  >
                    Eliminar avatar
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Datos editables */}
          <div className="mb-3">
            <label className="form-label">Nombre</label>
            <input
              type="text"
              className="form-control"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              disabled={!editMode}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Apellidos</label>
            <input
              type="text"
              className="form-control"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              disabled={!editMode}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Nombre de usuario</label>
            <input
              type="text"
              className="form-control"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              disabled={!editMode}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Fecha de nacimiento</label>
            <input
              type="date"
              className="form-control"
              name="birthDate"
              value={formData.birthDate}
              onChange={handleInputChange}
              disabled={!editMode}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Género</label>
            <select
              className="form-select"
              name="gender"
              value={formData.gender}
              onChange={handleInputChange}
              disabled={!editMode}
            >
              <option value="">Selecciona...</option>
              <option value="male">Masculino</option>
              <option value="female">Femenino</option>
              <option value="other">Otro</option>
            </select>
          </div>

          <div className="mb-3">
            <label className="form-label">Tema</label>
            <select
              className="form-select"
              name="theme"
              value={formData.theme}
              onChange={handleInputChange}
              disabled={!editMode}
            >
              <option value="">Sistema</option>
              <option value="light">Claro</option>
              <option value="dark">Oscuro</option>
            </select>
          </div>

          {/* Campos no editables */}
          <div className="mb-3">
            <label className="form-label">Correo electrónico</label>
            <input
              type="email"
              className="form-control"
              value={formData.email}
              disabled
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Rol</label>
            <input
              type="text"
              className="form-control"
              value={formData.role || 'usuario'}
              disabled
            />
          </div>

          <div className="mb-4">
            <label className="form-label">Fecha de registro</label>
            <input
              type="text"
              className="form-control"
              value={formData.createdAt}
              disabled
            />
          </div>

          {/* Botones */}
          <div className="d-flex justify-content-between">
            {!editMode ? (
              <>
                <button
                  type="button"
                  className="btn btn-outline-primary"
                  onClick={handleEdit}
                >
                  Editar perfil
                </button>
                <button
                  type="button"
                  className="btn btn-outline-danger"
                  onClick={() => alert('Aquí irá lógica para eliminar cuenta')}
                >
                  Eliminar cuenta
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => alert('Aquí irá la lógica para guardar cambios')}
                >
                  Guardar cambios
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleCancel}
                >
                  Cancelar
                </button>
              </>
            )}
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default Profile;
