// src/components/profile/AvatarUploader.jsx

import { useState, useEffect, useCallback } from 'react';
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

  // Función para determinar si es un avatar predeterminado
  const checkIfDefaultAvatar = useCallback((avatarUrl) => {
    // Verificar todas las posibles variantes de rutas de avatares predeterminados
    if (!avatarUrl) return false;
    
    return (
      avatarUrl.includes('/avatars/default-avatar-') || 
      avatarUrl.includes('/public/avatars/default-avatar-')
    );
  }, []);

  // Función para obtener la URL del avatar predeterminado según el género
  const getDefaultAvatarUrl = useCallback(() => {
    const defaultPath = gender === 'female'
      ? '/public/avatars/default-avatar-female.png'
      : '/public/avatars/default-avatar-male.png';
    
    // Usar URL completa con el dominio de la API si está disponible
    if (process.env.REACT_APP_URL) {
      return `${process.env.REACT_APP_URL}${defaultPath}`;
    }
    
    // En desarrollo podemos usar la URL relativa con el PUBLIC_URL
    return `${process.env.PUBLIC_URL || ''}${defaultPath}`;
  }, [gender]);
  
  useEffect(() => {
    // Determina la URL de la imagen (Cloudinary o local)
    const defaultUrl = getDefaultAvatarUrl();
    let src;
    
    if (deleted) {
      // Si el avatar fue eliminado, mostrar el predeterminado
      src = defaultUrl;
      setIsDefaultAvatar(true);
    } else if (url) {
      // Si hay una URL proporcionada
      const isDefault = checkIfDefaultAvatar(url);
      
      if (isDefault) {
        // Si es un avatar predeterminado, asegurarse de usar la URL completa
        src = defaultUrl;
      } else {
        // Si es un avatar personalizado (Cloudinary o ruta relativa)
        // Asegurarse de que la URL es absoluta
        src = url.startsWith('http')
          ? url
          : `${process.env.REACT_APP_URL}${url}`;
      }
      
      setIsDefaultAvatar(isDefault);
    } else {
      // Si no hay URL, usar el predeterminado
      src = defaultUrl;
      setIsDefaultAvatar(true);
    }
    
    console.log("URL de avatar configurada:", src); // Para debug
    setPreview(src);
  }, [url, deleted, gender, getDefaultAvatarUrl, checkIfDefaultAvatar]);

  // Actualiza cuando se selecciona un nuevo archivo
  const handleChange = e => {
    const file = e.target.files[0];
    if (file) {
      onFile(file);
      setPreview(URL.createObjectURL(file));
      setIsDefaultAvatar(false);
    }
  };
  
  // Implementa una función para manejar la eliminación directamente
  const handleDeleteAvatar = () => {
    // Establecer el avatar predeterminado inmediatamente usando la URL completa
    const defaultUrl = getDefaultAvatarUrl();
    console.log("Avatar predeterminado al eliminar:", defaultUrl); // Para debug
    
    setPreview(defaultUrl);
    setIsDefaultAvatar(true);
    
    // Llamar a la función onDelete del padre
    onDelete();
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
        onError={(e) => {
          // Si hay un error al cargar la imagen, mostrar el avatar predeterminado
          e.target.onerror = null; // Evita bucles infinitos
          const defaultUrl = getDefaultAvatarUrl();
          e.target.src = defaultUrl;
          setPreview(defaultUrl); // También actualizar el estado
          setIsDefaultAvatar(true);
        }}
      />

      {!disabled && (
        <>
          {/* Botón "X" para eliminar - solo visible si no es un avatar por defecto */}
          {!isDefaultAvatar && (
            <button
              type="button"
              onClick={handleDeleteAvatar}
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
