import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { googleLogin } from '../../services/authService';

// Hook personalizado para detectar el modo oscuro
const useDarkMode = () => {
  const [isDarkMode, setIsDarkMode] = useState(
    document.documentElement.getAttribute('data-bs-theme') === 'dark'
  );
  
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const htmlElement = document.documentElement;
    
    // Función para actualizar el estado
    const updateThemeState = () => {
      const theme = htmlElement.getAttribute('data-bs-theme');
      setIsDarkMode(theme === 'dark' || 
        (theme === 'auto' && mediaQuery.matches));
    };
    
    // Observer para detectar cambios en el DOM
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'data-bs-theme') {
          updateThemeState();
        }
      });
    });
    
    // Iniciar observación
    observer.observe(htmlElement, {
      attributes: true,
      attributeFilter: ['data-bs-theme']
    });
    
    // Detectar cambios en las preferencias del sistema
    const handleMediaChange = () => updateThemeState();
    mediaQuery.addEventListener('change', handleMediaChange);
    
    // Estado inicial
    updateThemeState();
    
    // Cleanup
    return () => {
      observer.disconnect();
      mediaQuery.removeEventListener('change', handleMediaChange);
    };
  }, []);
  
  return isDarkMode;
};

const GoogleLoginButton = ({ onGoogleSignIn }) => {
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const { setUser } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const isDarkMode = useDarkMode();

  // Cargar el SDK de Google
  useEffect(() => {
    const loadGoogleScript = () => {
      // Verificar si ya está cargado
      if (document.querySelector('script#google-platform')) {
        setScriptLoaded(true);
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.id = 'google-platform';
      script.async = true;
      script.defer = true;
      
      script.onload = () => {
        setScriptLoaded(true);
      };
      
      document.body.appendChild(script);
    };
    
    loadGoogleScript();
    
    return () => {
      // Limpiar al desmontar
      const script = document.querySelector('script#google-platform');
      if (script) {
        document.body.removeChild(script);
      }
    };
  }, []);

  const handleGoogleResponse = useCallback(async (response) => {
    try {
      const result = await googleLogin(response.credential);
      
      // Si requiere completar el registro (datos adicionales)
      if (result.needsCompletion) {
        // Llamar a la función que renderizará el modal para completar datos
        if (onGoogleSignIn) {
          onGoogleSignIn({
            email: result.email,
            firstName: result.firstName,
            lastName: result.lastName,
            avatarUrl: result.avatarUrl,
            googleId: result.googleId,
            tokenId: response.credential
          });
        }
      } else {
        // Usuario ya existente, login normal
        sessionStorage.setItem('token', result.token);
        setUser(result.user);
        navigate('/dashboard');
      }
    } catch (err) {
      console.error('Error en autenticación con Google:', err);
      setError(err.message || 'Error al autenticar con Google');
    }
  }, [navigate, setUser, onGoogleSignIn]);

  // Efecto para inicializar y renderizar el botón de Google
  useEffect(() => {
    if (!scriptLoaded || !window.google) return;

    try {
      // Inicializar Google Sign-In
      window.google.accounts.id.initialize({
        client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID,
        callback: handleGoogleResponse
      });
      
      // Renderizar botón
      window.google.accounts.id.renderButton(
        document.getElementById('google-signin-button'),
        { 
          type: 'standard',
          theme: isDarkMode ? 'filled_black' : 'outline',
          size: 'large',
          text: 'continue_with', // Cambiado de 'signup_with' a 'continue_with'
          shape: 'pill',
          width: '100%',
          logo_alignment: 'center',
          // Propiedades adicionales para el estilo personalizado
          ...(isDarkMode && {
            text_align: 'center',
            locale: 'es_ES'
          })
        }
      );
      
      console.log('Google button rendered with theme:', isDarkMode ? 'dark' : 'light');
    } catch (err) {
      console.error('Error al inicializar Google Sign-In:', err);
      setError('No se pudo cargar el inicio de sesión con Google');
    }
  }, [scriptLoaded, handleGoogleResponse, isDarkMode]);

  return (
    <div className="mt-3 mb-3">
      {error && <div className="alert alert-danger small">{error}</div>}
      <div 
        id="google-signin-button" 
        className={`d-flex justify-content-center ${isDarkMode ? 'google-btn-dark' : 'google-btn-light'}`}
        data-theme={isDarkMode ? 'dark' : 'light'}
      ></div>
    </div>
  );
};

export default GoogleLoginButton;
