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
      script.crossOrigin = "anonymous";
      
      script.onload = () => {
        setScriptLoaded(true);
      };
      
      script.onerror = (error) => {
        setError('Error al cargar componentes de Google');
      };
      
      document.body.appendChild(script);
    };
    
    loadGoogleScript();
    
    return () => {
      // Limpiar al desmontar
      if (window.google && window.google.accounts) {
        try {
          // Cancelar cualquier prompt o UI de Google
          window.google.accounts.id.cancel();
        } catch (err) {
          console.error('Error al limpiar Google Sign-In:', err);
        }
      }
    };
  }, []);

  const handleGoogleResponse = useCallback(async (response) => {
    try {
      if (!response || !response.credential) {
        console.error('Error: respuesta de Google incompleta');
        setError('Error al recibir datos de Google. Intente de nuevo.');
        return;
      }
      
      const result = await googleLogin(response.credential);
      
      if (!result) {
        console.error('Error: respuesta vacía del servidor');
        setError('Error de comunicación con el servidor. Intente de nuevo.');
        return;
      }
      
      // Si requiere enlazar cuenta (código LINK_GOOGLE) 
      if (result.code === 'LINK_GOOGLE' || result.needsLinking) {
        console.log('Se requiere enlazar cuenta de Google');
        // Llamar a la función que gestionará el enlace de cuenta
        if (onGoogleSignIn) {
          onGoogleSignIn({
            email: result.email || '',
            firstName: result.firstName || '',
            lastName: result.lastName || '',
            avatarUrl: result.avatarUrl || '',
            googleId: result.googleId || '',
            tokenId: response.credential,
            needsLinking: true,
            code: result.code || 'LINK_GOOGLE'
          });
        }
      }
      // Si requiere completar registro (código NEEDS_COMPLETION)
      else if (result.code === 'NEEDS_COMPLETION' || result.needsCompletion) {
        console.log('Se requiere completar registro con Google');
        // Llamar a la función que gestionará el completado de registro
        if (onGoogleSignIn) {
          onGoogleSignIn({
            email: result.email || '',
            firstName: result.firstName || '',
            lastName: result.lastName || '',
            avatarUrl: result.avatarUrl || '',
            googleId: result.googleId || '',
            tokenId: response.credential,
            needsCompletion: true,
            code: result.code || 'NEEDS_COMPLETION'
          });
        }
      } else {
        // Usuario ya existente, login normal
        if (result.token) {
          sessionStorage.setItem('token', result.token);
          if (result.user) {
            setUser(result.user);
            navigate('/dashboard');
          } else {
            console.error('Error: datos de usuario incompletos');
            setError('Error en los datos del usuario. Intente de nuevo.');
          }
        } else {
          console.error('Error: token no recibido');
          setError('Error de autenticación. Intente de nuevo.');
        }
      }
    } catch (err) {
      console.error('Error en autenticación con Google:', err);
      setError(err.message || 'Error al autenticar con Google. Intente de nuevo.');
    }
  }, [navigate, setUser, onGoogleSignIn]);

  // Efecto para inicializar y renderizar el botón de Google
  useEffect(() => {
    if (!scriptLoaded) return;
    
    // Verificar que el script de Google se haya cargado correctamente
    if (!window.google || !window.google.accounts || !window.google.accounts.id) {
      console.error('El SDK de Google no se cargó correctamente');
      setError('No se pudo cargar el inicio de sesión con Google');
      return;
    }
    
    try {
      // Inicializar Google Sign-In con manejo de errores
      const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;
      if (!clientId) {
        console.error('REACT_APP_GOOGLE_CLIENT_ID no está definido');
        setError('Error de configuración. Contacte al administrador.');
        return;
      }
      
      // Limpiar cualquier botón previo
      const container = document.getElementById('google-signin-button');
      if (container) {
        container.innerHTML = '';
      } else {
        console.error('Contenedor del botón no encontrado');
        return;
      }
      
      // Inicializar con el cliente ID
      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: handleGoogleResponse,
        ux_mode: 'popup',  // Usar popup en lugar de redirect para evitar problemas CORS
        context: 'signin'  // Especificar el contexto para mejorar UX
      });
      
      // Renderizar botón con tema adaptado al modo oscuro/claro
      window.google.accounts.id.renderButton(
        container,
        { 
          type: 'standard',
          theme: isDarkMode ? 'filled_black' : 'outline',
          size: 'large',
          text: 'continue_with',
          shape: 'rectangular', // Cambiar a rectangular puede ayudar con problemas de renderizado
          width: container.offsetWidth, // Ajustar al ancho del contenedor
          locale: 'es_ES'
        }
      );
      
      // También puede ser útil mostrar el One Tap en algunos casos
      // window.google.accounts.id.prompt();
      
      console.log('Google button rendered with theme:', isDarkMode ? 'dark' : 'light');
    } catch (err) {
      console.error('Error al inicializar Google Sign-In:', err);
      setError('No se pudo cargar el inicio de sesión con Google');
    }
  }, [scriptLoaded, handleGoogleResponse, isDarkMode]);

  return (
    <div className="mt-3 mb-3">
      {error && (
        <div className="alert alert-danger small p-2 mb-2" role="alert">
          {error}
          <button 
            type="button" 
            className="btn-close btn-sm float-end" 
            aria-label="Close"
            onClick={() => setError('')}
          />
        </div>
      )}
      
      <div 
        id="google-signin-button" 
        className="d-flex justify-content-center"
        style={{ minHeight: '40px' }}
        aria-label="Iniciar sesión con Google"
      ></div>
      
      {!scriptLoaded && (
        <div className="text-center mt-2">
          <div className="spinner-border spinner-border-sm text-primary" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
          <small className="text-muted ms-2">Cargando inicio de sesión con Google...</small>
        </div>
      )}
    </div>
  );
};

export default GoogleLoginButton;
