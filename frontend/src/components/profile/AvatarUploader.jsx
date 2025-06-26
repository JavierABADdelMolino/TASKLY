// src/components/profile/AvatarUploader.jsx

import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

export default function AvatarUploader({
  url,
  gender = 'male',      // 'male' o 'female'
  onFile,
  onDelete,
  disabled,
  deleted
}) {
  const [preview, setPreview] = useState('');
  const [isDefaultAvatar, setIsDefaultAvatar] = useState(false);

  useEffect(() => {
    // Determina la URL de la imagen (Cloudinary o local)
    const defaultPath = gender === 'female'
      ? '/avatars/default-avatar-female.png'
      : '/avatars/default-avatar-male.png';
    const defaultUrl = `${process.env.PUBLIC_URL || ''}${defaultPath}`;
    let src;
    if (deleted) {
      src = defaultUrl;
      setIsDefaultAvatar(true);
    } else if (url) {
      src = url.startsWith('http')
        ? url
        : `${process.env.REACT_APP_URL}${url}`;
      setIsDefaultAvatar(url.includes('/avatars/default-avatar-'));
    } else {
      src = defaultUrl;
      setIsDefaultAvatar(true);
    }
    setPreview(src);
  }, [url, deleted, gender]);

  const handleChange = e => {
    const file = e.target.files[0];
    if (file) {
      onFile(file);
      setPreview(URL.createObjectURL(file));
      setIsDefaultAvatar(false);
    }
  };

  return (
    <div
      className="text-center mb-4"
      style={{ position: 'relative', width: 100, height: 100, margin: '0 auto' }}
    >
      <img
        src={preview}
        alt="Avatar"
        className="rounded-circle border"
        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
      />

      {!disabled && (
        <>
          {/* Botón "X" para eliminar - solo visible si no es un avatar por defecto */}
          {!isDefaultAvatar && (
            <button
              type="button"
              onClick={onDelete}
              style={{
                position: 'absolute',
                top: -6,
                right: -6,
                background: '#dc3545',
                border: 'none',
                color: 'white',
                borderRadius: '50%',
                width: 20,
                height: 20,
                lineHeight: '20px',
                padding: 0,
                cursor: 'pointer'
              }}
              title="Eliminar avatar"
            >
              ×
            </button>
          )}

          {/* Botón personalizado para seleccionar archivo */}
          <input
            id="avatarInput"
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={handleChange}
          />
          <label
            htmlFor="avatarInput"
            className="btn btn-sm btn-outline-dark mt-1"
            title="Seleccionar avatar"
          >
            Seleccionar
          </label>
        </>
      )}
    </div>
  );
}

AvatarUploader.propTypes = {
  url:      PropTypes.string,
  gender:   PropTypes.oneOf(['male', 'female']),
  onFile:   PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  deleted:  PropTypes.bool
};
