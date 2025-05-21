import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLoader } from '../context/LoaderContext';
import Layout from '../components/layout/Layout';
import ChangePasswordModal from '../components/profile/ChangePasswordModal';
import ConfirmDeleteModal from '../components/profile/ConfirmDeleteModal';
import AvatarUploader from '../components/profile/AvatarUploader';

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
    createdAt: ''
  });
  const [newAvatarFile, setNewAvatarFile] = useState(null);
  const [avatarDeleted, setAvatarDeleted] = useState(false);
  const [errors, setErrors] = useState({});
  const [showPwdModal, setShowPwdModal] = useState(false);
  const [showDelModal, setShowDelModal] = useState(false);

  useEffect(() => {
    setShowLoader(true);
    if (user) {
      setFormData({
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username,
        email: user.email,
        birthDate: user.birthDate?.slice(0,10),
        gender: user.gender,
        theme: user.theme,
        avatarUrl: user.avatarUrl,
        createdAt: user.createdAt
      });
    }
    setTimeout(() => setShowLoader(false), 500);
  }, [user, setShowLoader]);

  const formatJoinDate = iso => iso
    ? `Miembro desde ${new Date(iso).toLocaleDateString('es-ES', { year:'numeric', month:'long', day:'numeric'})}`
    : '';

  const handleEdit = () => setEditMode(true);
  const handleCancel = () => {
    setEditMode(false);
    setNewAvatarFile(null);
    setAvatarDeleted(false);
    setErrors({});
    if (user) setFormData({
      firstName: user.firstName,
      lastName: user.lastName,
      username: user.username,
      email: user.email,
      birthDate: user.birthDate?.slice(0,10),
      gender: user.gender,
      theme: user.theme,
      avatarUrl: user.avatarUrl,
      createdAt: user.createdAt
    });
  };

  const handleInputChange = e =>
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleAvatarChange = file => { setNewAvatarFile(file); setAvatarDeleted(false); };
  const handleAvatarDelete = () => { setAvatarDeleted(true); setNewAvatarFile(null); };

  const handleSaveChanges = async () => {
    const err = {};
    ['firstName','lastName','username','birthDate','gender','theme'].forEach(f => {
      if (!formData[f]) err[f] = 'Campo obligatorio';
    });
    if (Object.keys(err).length) return setErrors(err);

    const fd = new FormData();
    Object.entries({
      firstName: formData.firstName,
      lastName:  formData.lastName,
      username:  formData.username,
      birthDate: formData.birthDate,
      gender:    formData.gender,
      theme:     formData.theme
    }).forEach(([k,v]) => fd.append(k,v));
    if (newAvatarFile) fd.append('avatar', newAvatarFile);
    else if (avatarDeleted) fd.append('avatar','');

    try {
      setShowLoader(true);
      const token = localStorage.getItem('token');
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/users/me`, {
        method:'PUT', headers:{ Authorization:`Bearer ${token}` }, body:fd
      });
      const data = await res.json();
      if (!res.ok) setErrors({ submit:data.message }); else window.location.reload();
    } catch {
      setErrors({ submit:'Error de conexión con el servidor' });
    } finally { setShowLoader(false); }
  };

  return (
    <Layout>
      <div className="container py-4" style={{ maxWidth:640 }}>
        <h2 className="mb-3">Mi perfil</h2>
        <form className="card p-4 shadow-sm">

          {/* Avatar Uploader */}
          <AvatarUploader
            url={formData.avatarUrl}
            onFile={handleAvatarChange}
            onDelete={handleAvatarDelete}
            disabled={!editMode}
            deleted={avatarDeleted}
          />

          {/* Editable Fields */}
          {['firstName','lastName','username'].map(f => (
            <div className="mb-3" key={f}>
              <label className="form-label">{f==='firstName'? 'Nombre': f==='lastName'? 'Apellidos':'Usuario'}</label>
              <input
                name={f} value={formData[f]} onChange={handleInputChange}
                className="form-control" disabled={!editMode}
              />
              {errors[f] && <small className="text-danger">{errors[f]}</small>}
            </div>
          ))}

          {/* Email Field (readonly) */}
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

          {/* Birth Date */}
          <div className="mb-3">
            <label className="form-label">Fecha de nacimiento</label>
            <input
              type="date" name="birthDate" value={formData.birthDate}
              onChange={handleInputChange} className="form-control"
              disabled={!editMode}
            />
            {errors.birthDate && <small className="text-danger">{errors.birthDate}</small>}
          </div>

          {/* Gender & Theme */}
          {[
            { name:'gender', label:'Género', options:[{val:'male',lbl:'Masculino'},{val:'female',lbl:'Femenino'}] },
            { name:'theme',  label:'Tema',   options:[{val:'light',lbl:'Claro'},{val:'dark', lbl:'Oscuro'}] }
          ].map(({name,label,options}) => (
            <div className="mb-3" key={name}>
              <label className="form-label">{label}</label>
              <select
                name={name} value={formData[name]} onChange={handleInputChange}
                className="form-select" disabled={!editMode}
              >
                {options.map(o => <option key={o.val} value={o.val}>{o.lbl}</option>)}
              </select>
              {errors[name] && <small className="text-danger">{errors[name]}</small>}
            </div>
          ))}

          {/* Miembro desde */}
          {formData.createdAt && <p className="text-muted text-end"><small>{formatJoinDate(formData.createdAt)}</small></p>}

          {errors.submit && <div className="text-danger mb-3">{errors.submit}</div>}

          {/* Action Buttons */}
          <div className="d-flex justify-content-between">
            {!editMode ? (
              <>
                <button type="button" className="btn btn-outline-primary" onClick={handleEdit}>Editar</button>
                <button type="button" className="btn btn-outline-secondary" onClick={()=>setShowPwdModal(true)}>Cambiar contraseña</button>
                <button type="button" className="btn btn-outline-danger" onClick={()=>setShowDelModal(true)}>Eliminar cuenta</button>
              </>
            ) : (
              <>
                <button type="button" className="btn btn-primary" onClick={handleSaveChanges}>Guardar</button>
                <button type="button" className="btn btn-secondary" onClick={handleCancel}>Cancelar</button>
              </>
            )}
          </div>
        </form>

        {/* Modals */}
        {showPwdModal && <ChangePasswordModal onClose={()=>setShowPwdModal(false)} />}
        {showDelModal && <ConfirmDeleteModal onClose={()=>setShowDelModal(false)} />}
      </div>
    </Layout>
  );
};

export default Profile;
