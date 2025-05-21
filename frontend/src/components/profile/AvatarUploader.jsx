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

  useEffect(() => {
    // Ruta del avatar por defecto en carpeta public/avatars
    const defaultAvatarPath = gender === 'female'
      ? '/public/avatars/default-avatar-female.png'
      : '/public/avatars/default-avatar-male.png';
    const defaultAvatarUrl = process.env.REACT_APP_URL + defaultAvatarPath;

    if (deleted) {
      setPreview(defaultAvatarUrl);
    } else if (url) {
      setPreview(process.env.REACT_APP_URL + url);
    } else {
      setPreview(defaultAvatarUrl);
    }
  }, [url, deleted, gender]);

  const handleChange = e => {
    const file = e.target.files[0];
    if (file) {
      onFile(file);
      setPreview(URL.createObjectURL(file));
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
          {/* Botón “X” para eliminar */}
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
            className="btn btn-sm btn-outline-secondary mt-2"
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
