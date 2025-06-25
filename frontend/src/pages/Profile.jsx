import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLoader } from '../context/LoaderContext';
import { useTheme } from '../context/ThemeContext';
import Layout from '../components/layout/Layout';
import ChangePasswordModal from '../components/profile/modals/ChangePasswordModal';
import ConfirmDeleteModal from '../components/profile/modals/ConfirmDeleteModal';
import AvatarUploader from '../components/profile/AvatarUploader';

const Profile = () => {
  const { setShowLoader } = useLoader();
  const { setUser } = useAuth();
  const { theme, setTheme } = useTheme();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    birthDate: '',
    gender: '',
    avatarUrl: '',
    createdAt: ''
  });

  const [editMode, setEditMode] = useState(false);
  const [newAvatarFile, setNewAvatarFile] = useState(null);
  const [avatarDeleted, setAvatarDeleted] = useState(false);
  const [errors, setErrors] = useState({});
  const [showPwdModal, setShowPwdModal] = useState(false);
  const [showDelModal, setShowDelModal] = useState(false);
  const [originalTheme] = useState(theme);

  const isDefaultAvatar = (url) =>
    url?.includes('/public/avatars/default-avatar-');

  const fetchUser = useCallback(async () => {
    try {
      setShowLoader(true);
      const token = sessionStorage.getItem('token');
      const res = await fetch(`${process.env.REACT_APP_API_URL}/users/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) {
        setFormData({
          firstName: data.firstName,
          lastName: data.lastName,
          username: data.username,
          email: data.email,
          birthDate: data.birthDate?.slice(0, 10),
          gender: data.gender,
          avatarUrl: data.avatarUrl,
          createdAt: data.createdAt
        });
        setUser(data);
      } else {
        console.error('Error al cargar el usuario:', data.message);
      }
    } catch (err) {
      console.error('Error al cargar perfil:', err);
    } finally {
      setShowLoader(false);
    }
  }, [setShowLoader, setUser]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  // Actualiza avatar por defecto si cambia el género y tiene un avatar por defecto
  useEffect(() => {
    if (!newAvatarFile && isDefaultAvatar(formData.avatarUrl)) {
      const newDefault =
        formData.gender === 'female'
          ? '/public/avatars/default-avatar-female.png'
          : '/public/avatars/default-avatar-male.png';
      setFormData((prev) => ({ ...prev, avatarUrl: newDefault }));
    }
  }, [formData.gender, formData.avatarUrl, newAvatarFile]);

  const formatJoinDate = (iso) =>
    iso
      ? `Miembro desde ${new Date(iso).toLocaleDateString('es-ES', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })}`
      : '';

  const handleEdit = () => setEditMode(true);

  const handleCancel = () => {
    setEditMode(false);
    setNewAvatarFile(null);
    setAvatarDeleted(false);
    setErrors({});
    fetchUser();
    // Revert to original theme
    setTheme(originalTheme);
  };

  const handleInputChange = (e) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleAvatarChange = (file) => {
    setNewAvatarFile(file);
    setAvatarDeleted(false);
  };

  const handleAvatarDelete = () => {
    setAvatarDeleted(true);
    setNewAvatarFile(null);
    const newDefault =
      formData.gender === 'female'
        ? '/public/avatars/default-avatar-female.png'
        : '/public/avatars/default-avatar-male.png';
    setFormData((prev) => ({ ...prev, avatarUrl: newDefault }));
  };

  const handleSaveChanges = async () => {
    const err = {};
    ['firstName', 'lastName', 'birthDate', 'gender'].forEach((f) => {
      if (!formData[f]) err[f] = 'Campo obligatorio';
    });
    if (Object.keys(err).length) return setErrors(err);

    const fd = new FormData();
    Object.entries({
      firstName: formData.firstName,
      lastName: formData.lastName,
      birthDate: formData.birthDate,
      gender: formData.gender
    }).forEach(([k, v]) => fd.append(k, v));

    if (newAvatarFile) fd.append('avatar', newAvatarFile);
    else if (avatarDeleted) fd.append('avatar', '');

    try {
      setShowLoader(true);
      const token = sessionStorage.getItem('token');
      const res = await fetch(`${process.env.REACT_APP_API_URL}/users/me`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
        body: fd
      });

      const data = await res.json();
      if (!res.ok) {
        setErrors({ submit: data.message || 'Error en el servidor' });
      } else {
        setFormData({
          firstName: data.firstName,
          lastName: data.lastName,
          username: data.username,
          email: data.email,
          birthDate: data.birthDate?.slice(0, 10),
          gender: data.gender,
          avatarUrl: data.avatarUrl,
          createdAt: data.createdAt
        });
        setUser(data);
        setEditMode(false);
        setNewAvatarFile(null);
        setAvatarDeleted(false);
      }
    } catch (err) {
      console.error('Error de conexión:', err);
      setErrors({ submit: 'Error de conexión con el servidor' });
    } finally {
      setShowLoader(false);
    }
  };

  return (
    <Layout>
      <div className="container py-4" style={{ maxWidth: 640 }}>
        <h2 className="mb-2 text-center">Mi perfil</h2>
        {formData.createdAt && (
          <p className="text-muted text-center mb-3">
            <small>{formatJoinDate(formData.createdAt)}</small>
          </p>
        )}

        <form className="card p-4 shadow-sm">
          <AvatarUploader
            url={formData.avatarUrl}
            onFile={handleAvatarChange}
            onDelete={handleAvatarDelete}
            disabled={!editMode}
            deleted={avatarDeleted}
            gender={formData.gender}
          />

          <div className="mb-3">
            <label className="form-label">Correo electrónico</label>
            <input
              type="email"
              className="form-control"
              name="email"
              value={formData.email}
              disabled
            />
          </div>

          {['firstName', 'lastName'].map((f) => (
            <div className="mb-3" key={f}>
              <label className="form-label">
                {f === 'firstName' ? 'Nombre' : 'Apellidos'}
              </label>
              <input
                name={f}
                value={formData[f]}
                onChange={handleInputChange}
                className="form-control"
                disabled={!editMode}
              />
              {errors[f] && <small className="text-danger">{errors[f]}</small>}
            </div>
          ))}

          {/* Fecha de nacimiento y género en la misma línea */}
          <div className="row mb-3">
            <div className="col-6">
              <label className="form-label">Fecha de nacimiento</label>
              <input
                type="date"
                className={`form-control ${errors.birthDate ? 'is-invalid' : ''}`}
                value={formData.birthDate}
                onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                disabled={!editMode}
              />
              {errors.birthDate && <div className="text-danger">{errors.birthDate}</div>}
            </div>
            <div className="col-6">
              <label className="form-label">Género</label>
              <select
                className={`form-select ${errors.gender ? 'is-invalid' : ''}`}
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                disabled={!editMode}
              >
                <option value="male">Masculino</option>
                <option value="female">Femenino</option>
              </select>
              {errors.gender && <div className="text-danger">{errors.gender}</div>}
            </div>
          </div>

          {errors.submit && <div className="text-danger mb-3">{errors.submit}</div>}

          <div className="d-flex justify-content-between">
            {!editMode ? (
              <>
                <button type="button" className="btn btn-outline-primary" onClick={handleEdit}>Editar</button>
                <button type="button" className="btn btn-outline-warning" onClick={() => setShowPwdModal(true)}>Cambiar contraseña</button>
                <button type="button" className="btn btn-outline-danger" onClick={() => setShowDelModal(true)}>Eliminar cuenta</button>
              </>
            ) : (
              <>
                <button type="button" className="btn btn-primary" onClick={handleSaveChanges}>Guardar</button>
                <button type="button" className="btn btn-secondary" onClick={handleCancel}>Cancelar</button>
              </>
            )}
          </div>
        </form>

        {showPwdModal && <ChangePasswordModal onClose={() => setShowPwdModal(false)} />}
        {showDelModal && <ConfirmDeleteModal onClose={() => setShowDelModal(false)} />}
      </div>
    </Layout>
  );
};

export default Profile;
