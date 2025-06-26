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
    createdAt: '',
    isGoogleUser: false
  });

  const [editMode, setEditMode] = useState(false);
  const [newAvatarFile, setNewAvatarFile] = useState(null);
  const [avatarDeleted, setAvatarDeleted] = useState(false);
  const [errors, setErrors] = useState({});
  const [showPwdModal, setShowPwdModal] = useState(false);
  const [showDelModal, setShowDelModal] = useState(false);
  const [originalTheme] = useState(theme);

  const isDefaultAvatar = (url) => {
    // Verificar todas las posibles variantes de rutas de avatares predeterminados
    if (!url) return false;
    
    return (
      url.includes('/avatars/default-avatar-') || 
      url.includes('/public/avatars/default-avatar-')
    );
  };

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
          createdAt: data.createdAt,
          isGoogleUser: data.isGoogleUser
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
      // Usar la URL completa para el avatar predeterminado
      const defaultPath = formData.gender === 'female'
        ? '/public/avatars/default-avatar-female.png'
        : '/public/avatars/default-avatar-male.png';
      
      // Construir la URL completa con el dominio de la API
      const newDefault = `${process.env.REACT_APP_URL}${defaultPath}`;
      
      console.log("Avatar predeterminado actualizado por cambio de género:", newDefault);
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
    
    // Usar la URL completa para el avatar predeterminado
    const defaultPath = formData.gender === 'female'
      ? '/public/avatars/default-avatar-female.png'
      : '/public/avatars/default-avatar-male.png';
    
    // Construir la URL completa con el dominio de la API
    const newDefault = `${process.env.REACT_APP_URL}${defaultPath}`;
    
    console.log("Asignando avatar predeterminado:", newDefault);
    setFormData((prev) => ({ ...prev, avatarUrl: newDefault }));
  };

  const handleSaveChanges = async () => {
    const err = {};
    ['firstName', 'lastName', 'birthDate', 'gender'].forEach((f) => {
      if (!formData[f]) err[f] = 'Campo obligatorio';
    });
    if (Object.keys(err).length) return setErrors(err);      // Guardamos el valor de isGoogleUser para preservarlo y asegurarnos
    // de que se mantiene después de actualizar
    const currentIsGoogleUser = formData.isGoogleUser;
    console.log("Estado actual de isGoogleUser antes de guardar:", currentIsGoogleUser);

    const fd = new FormData();
    Object.entries({
      firstName: formData.firstName,
      lastName: formData.lastName,
      birthDate: formData.birthDate,
      gender: formData.gender
      // No enviamos isGoogleUser porque el backend lo determina basado en googleId
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
        // Aseguramos que isGoogleUser siempre se mantiene correcto, incluso si el backend no lo devuelve
        // Usamos el valor del backend si existe, de lo contrario usamos el valor actual
        const isGoogleAccount = data.isGoogleUser !== undefined ? data.isGoogleUser : currentIsGoogleUser;
        console.log("Estado de isGoogleUser después de la respuesta:", data.isGoogleUser, "Valor actual:", currentIsGoogleUser, "Valor final:", isGoogleAccount);
        
        setFormData({
          firstName: data.firstName,
          lastName: data.lastName,
          username: data.username,
          email: data.email,
          birthDate: data.birthDate?.slice(0, 10),
          gender: data.gender,
          avatarUrl: data.avatarUrl,
          createdAt: data.createdAt,
          isGoogleUser: data.isGoogleUser !== undefined ? data.isGoogleUser : isGoogleAccount // Usamos el valor exacto del backend o preservamos el anterior
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
        <h2 className="mb-2 text-center fw-bold w-100">Mi perfil</h2>
        {formData.createdAt && (
          <p className="text-muted text-center mb-3">
            <small>{formatJoinDate(formData.createdAt)}</small>
          </p>
        )}

        <form className="card p-4 shadow-sm login-form">
          <div className="text-center mb-4">
            <div style={{marginBottom: '1rem'}}>
              <AvatarUploader
                url={formData.avatarUrl}
                onFile={handleAvatarChange}
                onDelete={handleAvatarDelete}
                disabled={!editMode}
                deleted={avatarDeleted}
                gender={formData.gender}
              />
            </div>
          </div>

          <div className="mb-3 form-floating">
            <input
              id="email"
              type="email"
              placeholder="Correo electrónico"
              className="form-control"
              name="email"
              value={formData.email}
              disabled
            />
            <label htmlFor="email">Correo electrónico</label>
          </div>

          <div className="mb-3 form-floating">
            <input
              id="firstName"
              name="firstName"
              type="text"
              placeholder="Nombre"
              value={formData.firstName}
              onChange={handleInputChange}
              className={`form-control ${errors.firstName ? 'is-invalid' : ''}`}
              disabled={!editMode}
            />
            <label htmlFor="firstName">Nombre</label>
            {errors.firstName && <small className="text-danger d-block mt-1">{errors.firstName}</small>}
          </div>

          <div className="mb-3 form-floating">
            <input
              id="lastName"
              name="lastName"
              type="text"
              placeholder="Apellidos"
              value={formData.lastName}
              onChange={handleInputChange}
              className={`form-control ${errors.lastName ? 'is-invalid' : ''}`}
              disabled={!editMode}
            />
            <label htmlFor="lastName">Apellidos</label>
            {errors.lastName && <small className="text-danger d-block mt-1">{errors.lastName}</small>}
          </div>

          {/* Fecha de nacimiento y género en la misma línea */}
          <div className="row mb-4">
            <div className="col-6">
              <div className="form-floating">
                <input
                  id="birthDate"
                  type="date"
                  placeholder="Fecha de nacimiento"
                  className={`form-control ${errors.birthDate ? 'is-invalid' : ''}`}
                  value={formData.birthDate}
                  onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                  disabled={!editMode}
                  style={{ colorScheme: 'auto' }}
                />
                <label htmlFor="birthDate">Fecha de nacimiento</label>
                {errors.birthDate && <small className="text-danger d-block mt-1">{errors.birthDate}</small>}
              </div>
            </div>
            <div className="col-6">
              <div className="form-floating">
                <select
                  id="gender"
                  className={`form-select ${errors.gender ? 'is-invalid' : ''} ${!editMode ? 'appearance-none' : ''}`}
                  value={formData.gender}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                  disabled={!editMode}
                  style={!editMode ? { 
                    backgroundColor: 'var(--bs-body-bg)', 
                    color: 'var(--bs-body-color)',
                    backgroundImage: 'none', 
                    appearance: 'none' 
                  } : { 
                    backgroundColor: 'var(--bs-body-bg)', 
                    color: 'var(--bs-body-color)' 
                  }}
                >
                  <option value="male">Masculino</option>
                  <option value="female">Femenino</option>
                </select>
                <label htmlFor="gender">Género</label>
                {errors.gender && <small className="text-danger d-block mt-1">{errors.gender}</small>}
              </div>
            </div>
          </div>

          {errors.submit && 
            <div className="alert alert-danger text-center small mb-3 fade-in">{errors.submit}</div>
          }

          <div className="d-flex justify-content-between mt-4">
            {!editMode ? (
              <>
                <button type="button" className="btn btn-outline-primary px-4" onClick={handleEdit}>Editar</button>
                {/* Solo mostrar el botón de cambiar contraseña para usuarios NO Google */}
                {!formData.isGoogleUser && (
                  <button type="button" className="btn btn-outline-warning px-4" onClick={() => setShowPwdModal(true)}>
                    Cambiar contraseña
                  </button>
                )}
                <button type="button" className="btn btn-outline-danger px-4" onClick={() => setShowDelModal(true)}>
                  Eliminar cuenta
                </button>
              </>
            ) : (
              <>
                <button type="button" className="btn btn-secondary px-4" onClick={handleCancel}>Cancelar</button>
                <button type="button" className="btn btn-primary px-4 py-2" onClick={handleSaveChanges}>
                  Guardar cambios
                </button>
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
