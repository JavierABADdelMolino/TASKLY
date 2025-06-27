import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { googleLogin } from '../../services/authService';
import useDarkMode from '../../hooks/useDarkMode';

// Componente de botón de respaldo personalizado
const FallbackGoogleButton = ({ onClick, isDarkMode }) => {
  return (
    <button 
      className="btn w-100 rounded-pill mt-2 d-flex align-items-center justify-content-center gap-2"
      style={{ 
        minHeight: '42px',
        transition: 'all 0.2s ease',
        border: isDarkMode 
          ? '1px solid rgba(255,255,255,0.15)' 
          : '1px solid #dadce0',
        maxWidth: '280px',
        backgroundColor: isDarkMode ? 'rgba(255,255,255,0.05)' : '',
        color: isDarkMode ? '#fff' : '#757575',
        boxShadow: isDarkMode 
          ? '0 2px 5px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.1)'
          : '0 1px 3px rgba(0,0,0,0.15)'
      }}
      onClick={onClick}
      onMouseOver={(e) => {
        e.currentTarget.style.backgroundColor = isDarkMode 
          ? 'rgba(255,255,255,0.1)' 
          : 'rgba(66, 133, 244, 0.04)';
        e.currentTarget.style.boxShadow = isDarkMode
          ? '0 4px 8px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.2)'
          : '0 2px 4px rgba(0,0,0,0.25)';
        if (isDarkMode) {
          e.currentTarget.style.border = '1px solid rgba(255,255,255,0.25)';
        }
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.backgroundColor = isDarkMode ? 'rgba(255,255,255,0.05)' : '';
        e.currentTarget.style.boxShadow = isDarkMode 
          ? '0 2px 5px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.1)'
          : '0 1px 3px rgba(0,0,0,0.15)';
        e.currentTarget.style.border = isDarkMode 
          ? '1px solid rgba(255,255,255,0.15)' 
          : '1px solid #dadce0';
      }}
    >
      <svg width="18" height="18" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
        <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"/>
        <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"/>
        <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"/>
        <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"/>
      </svg>
      <span>Continuar con Google</span>
    </button>
  );
};

const GoogleLoginButton = ({ onGoogleSignIn }) => {
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [buttonRendered, setButtonRendered] = useState(false);
  const [showFallback, setShowFallback] = useState(false);
  const { setUser } = useAuth();
  const navigate = useNavigate();
  const isDarkMode = useDarkMode();

  // Comprobar si el SDK de Google está listo
  useEffect(() => {
    // Verificar si el SDK de Google está disponible (cargado desde index.html)
    const checkGoogleSDK = () => {
      if (window.google && window.google.accounts && window.google.accounts.id) {
        setScriptLoaded(true);
        console.log('Google SDK detectado correctamente');
      } else {
        // Si no está disponible después de 3 segundos, mostrar botón de respaldo
        setTimeout(() => {
          if (!window.google || !window.google.accounts || !window.google.accounts.id) {
            console.info('Google SDK no detectado - mostrando botón de respaldo');
            setShowFallback(true);
          } else {
            setScriptLoaded(true);
          }
        }, 3000);
      }
    };
    
    // Esperar un momento para que el script tenga tiempo de cargarse
    setTimeout(checkGoogleSDK, 1000);
    
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
  }, [buttonRendered]);

  const handleGoogleResponse = useCallback(async (response) => {
    try {
      if (!response || !response.credential) {
        console.error('Error: respuesta de Google incompleta', response);
        return;
      }
      
      console.log('Google response received, sending to server...');
      const result = await googleLogin(response.credential);
      
      if (!result) {
        console.error('Error: respuesta vacía del servidor');
        return;
      }
      
      console.log('Server response for Google auth:', result);
      
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
          }
        }
      }
    } catch (err) {
      console.error('Error en autenticación con Google:', err);
    }
  }, [navigate, setUser, onGoogleSignIn]);

  // Efecto para inicializar y renderizar el botón de Google
  useEffect(() => {
    if (!scriptLoaded) return;
    
    // Verificar que el script de Google se haya cargado correctamente
    if (!window.google || !window.google.accounts || !window.google.accounts.id) {
      // En lugar de mostrar un error, programamos un nuevo intento
      setTimeout(() => {
        if (!buttonRendered) {
          setShowFallback(true);
        }
      }, 2000);
      return;
    }
    
    try {
      // Inicializar Google Sign-In con manejo de errores
      const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;
      if (!clientId) {
        console.error('REACT_APP_GOOGLE_CLIENT_ID no está definido');
        setShowFallback(true);
        return;
      }
      
      // Limpiar cualquier botón previo
      const container = document.getElementById('google-signin-button');
      if (!container) {
        setShowFallback(true);
        return;
      }
      
      container.innerHTML = '';
      
      // Inicializar con el cliente ID
      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: handleGoogleResponse,
        ux_mode: 'popup',  // Usar popup en lugar de redirect para evitar problemas CORS
        context: 'signin',  // Especificar el contexto para mejorar UX
        auto_select: false, // Deshabilitar la selección automática
        cancel_on_tap_outside: true, // Permitir cerrar haciendo clic fuera
      });
      
      // Renderizar botón con tema adaptado al modo oscuro/claro
      window.google.accounts.id.renderButton(
        container,
        { 
          type: 'standard',
          theme: isDarkMode ? 'filled_black' : 'outline',
          size: 'large',
          text: 'continue_with',
          shape: 'pill', // Forma de píldora
          width: Math.min(container.offsetWidth, 280), // Limitar ancho máximo a 280px
          locale: 'es_ES'
        }
      );
      
      // Aplicar sombra y estilos adicionales al botón de Google
      setTimeout(() => {
        const googleButton = container.querySelector('div[role="button"]');
        if (googleButton) {
          // Estilos base
          googleButton.style.boxShadow = isDarkMode 
            ? '0 2px 5px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.1)' 
            : '0 1px 3px rgba(0,0,0,0.15)';
          googleButton.style.transition = 'all 0.2s ease';
          googleButton.style.margin = '0 auto';
          
          // Si es modo oscuro, añadir un borde sutil
          if (isDarkMode) {
            googleButton.style.border = '1px solid rgba(255,255,255,0.1)';
          }
          
          // Efecto hover
          googleButton.addEventListener('mouseover', () => {
            googleButton.style.boxShadow = isDarkMode
              ? '0 4px 8px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.2)'
              : '0 2px 4px rgba(0,0,0,0.25)';
            
            if (isDarkMode) {
              googleButton.style.border = '1px solid rgba(255,255,255,0.2)';
            }
          });
          
          googleButton.addEventListener('mouseout', () => {
            googleButton.style.boxShadow = isDarkMode 
              ? '0 2px 5px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.1)' 
              : '0 1px 3px rgba(0,0,0,0.15)';
              
            if (isDarkMode) {
              googleButton.style.border = '1px solid rgba(255,255,255,0.1)';
            }
          });
        }
      }, 100);
      
      setButtonRendered(true);
      setShowFallback(false);
      console.log('Google button rendered with theme:', isDarkMode ? 'dark' : 'light');
    } catch (err) {
      console.info('Hubo un problema al inicializar Google Sign-In, mostrando botón de respaldo');
      setShowFallback(true);
    }
  }, [scriptLoaded, handleGoogleResponse, isDarkMode, buttonRendered]);
  
  // Manejador para el botón de respaldo
  const handleFallbackButtonClick = () => {
    // Solo intentar reinicializar el botón de Google sin recargar el script
    setButtonRendered(false);
    setShowFallback(false);
    setScriptLoaded(false);
    
    // Revisamos de nuevo si el SDK de Google está disponible
    setTimeout(() => {
      if (window.google && window.google.accounts && window.google.accounts.id) {
        setScriptLoaded(true);
      } else {
        setShowFallback(true);
      }
    }, 1000);
  };

  return (
    <div className="mt-3 mb-3 d-flex justify-content-center">
      <div className="w-100" style={{ maxWidth: '280px' }}>
        {!showFallback && (
          <div 
            id="google-signin-button" 
            className="d-flex justify-content-center"
            style={{ 
              minHeight: '42px',
              display: showFallback ? 'none' : 'flex'
            }}
            aria-label="Iniciar sesión con Google"
          ></div>
        )}
        
        {/* Se eliminó el spinner de carga */}
        
        {/* Mostrar botón de respaldo cuando sea necesario */}
        {showFallback && <FallbackGoogleButton onClick={handleFallbackButtonClick} isDarkMode={isDarkMode} />}
      </div>
    </div>
  );
};

export default GoogleLoginButton;
