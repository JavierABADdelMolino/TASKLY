import React, { useEffect, useState, useCallback, memo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { googleLogin } from '../../services/authService';
import useDarkMode from '../../hooks/useDarkMode';

// Componente de botón de respaldo personalizado memorizado para evitar re-renderizados
const FallbackGoogleButton = memo(({ onClick, isDarkMode }) => {
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
});

// Componente interno para renderizar el botón de Google
// Este componente solo se renderiza una vez y no se vuelve a renderizar con cambios en el form
const GoogleButtonRenderer = memo(({ handleGoogleResponse, isDarkMode }) => {
  const containerRef = useRef(null);
  const [isRendered, setIsRendered] = useState(false);
  
  // Este efecto solo se ejecuta una vez al montar el componente
  useEffect(() => {
    if (!containerRef.current) return;
    
    const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;
    if (!clientId) {
      console.error('REACT_APP_GOOGLE_CLIENT_ID no está definido');
      return;
    }
    
    try {
      // Solo inicializamos una vez
      if (!isRendered && window.google && window.google.accounts && window.google.accounts.id) {
        window.google.accounts.id.initialize({
          client_id: clientId,
          callback: handleGoogleResponse,
          ux_mode: 'standard',
          context: 'signin',
          auto_select: false,
          cancel_on_tap_outside: true,
          itp_support: true,
        });
        
        window.google.accounts.id.renderButton(
          containerRef.current,
          { 
            type: 'standard',
            theme: isDarkMode ? 'filled_black' : 'outline',
            size: 'large',
            text: 'continue_with',
            shape: 'pill',
            width: Math.min(containerRef.current.offsetWidth, 280),
            locale: 'es_ES'
          }
        );
        
        setIsRendered(true);
        
        // Aplicar estilos al botón
        setTimeout(() => {
          if (containerRef.current) {
            const googleButton = containerRef.current.querySelector('div[role="button"]');
            if (googleButton) {
              // Estilos base
              googleButton.style.boxShadow = isDarkMode 
                ? '0 2px 5px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.1)' 
                : '0 1px 3px rgba(0,0,0,0.15)';
              googleButton.style.transition = 'all 0.2s ease';
              googleButton.style.margin = '0 auto';
              
              // Borde en modo oscuro
              if (isDarkMode) {
                googleButton.style.border = '1px solid rgba(255,255,255,0.1)';
              }
            }
          }
        }, 50);
      }
    } catch (err) {
      console.error('Error al renderizar botón de Google:', err);
    }
  }, [handleGoogleResponse, isDarkMode, isRendered]);
  
  return (
    <div 
      ref={containerRef}
      className="d-flex justify-content-center"
      style={{ 
        minHeight: '42px',
        paddingTop: '3px',
        paddingBottom: '3px',
        marginTop: '2px',
        marginBottom: '2px'
      }}
      aria-label="Iniciar sesión con Google"
    />
  );
});

const GoogleLoginButton = memo(({ onGoogleSignIn }) => {
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [showFallback, setShowFallback] = useState(false);
  const { setUser } = useAuth();
  const navigate = useNavigate();
  const isDarkMode = useDarkMode();
  
  // Solo comprueba la disponibilidad del SDK una vez al montar el componente
  useEffect(() => {
    // Verificar inmediatamente si el SDK de Google está disponible
    if (window.google && window.google.accounts && window.google.accounts.id) {
      setScriptLoaded(true);
    } else {
      // Configurar un observador para detectar cuando esté disponible
      const checkInterval = setInterval(() => {
        if (window.google && window.google.accounts && window.google.accounts.id) {
          setScriptLoaded(true);
          clearInterval(checkInterval);
        }
      }, 200); // Verificar cada 200ms
      
      // Mostrar fallback después de un tiempo razonable (1.5 segundos)
      const fallbackTimer = setTimeout(() => {
        if (!window.google || !window.google.accounts) {
          setShowFallback(true);
          clearInterval(checkInterval);
        }
      }, 1500);
      
      return () => {
        clearInterval(checkInterval);
        clearTimeout(fallbackTimer);
      }
    }
    
    return () => {
      // Limpiar al desmontar
      if (window.google && window.google.accounts) {
        try {
          window.google.accounts.id.cancel();
        } catch (err) {
          // Silenciar error al limpiar
        }
      }
    };
  }, []);

  const handleGoogleResponse = useCallback(async (response) => {
    try {
      // Mejor manejo de errores y respuestas incompletas
      if (!response) {
        return;
      }
      
      // Manejar diferentes tipos de respuestas de Google
      let credential;
      
      if (response.credential) {
        credential = response.credential;
      } else if (response.select_by && response.credential_id) {
        // Formato alternativo que Google puede devolver
        credential = response.credential_id;
      } else {
        setShowFallback(true);
        return;
      }
      
      const result = await googleLogin(credential);
      
      if (!result) {
        return;
      }
      
      // Si requiere enlazar cuenta (código LINK_GOOGLE) 
      if (result.code === 'LINK_GOOGLE' || result.needsLinking) {
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
  
  // Manejador optimizado para el botón de respaldo con mejor compatibilidad
  const handleFallbackButtonClick = useCallback(() => {
    console.log('Intentando proceso alternativo de autenticación con Google...');
    
    if (window.google && window.google.accounts && window.google.accounts.id) {
      // Si el SDK ya está disponible, usamos el método prompt() para mostrar directamente
      // la interfaz de selección de cuenta sin depender del botón renderizado
      window.google.accounts.id.prompt((notification) => {
        if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
          // Si no se pudo mostrar el prompt, usar el enfoque de redirección
          console.log('No se pudo mostrar el selector de cuentas de Google, usando redirección...');
          
          // Reintentar con redirección
          const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;
          if (clientId) {
            const redirectUri = encodeURIComponent(`${window.location.origin}/auth/callback`);
            const scope = encodeURIComponent('profile email');
            const state = encodeURIComponent(Math.random().toString(36).substring(2));
            sessionStorage.setItem('googleAuthState', state);
            const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=token&scope=${scope}&state=${state}&prompt=select_account`;
            window.location.href = authUrl;
          }
        }
      });
    } else {
      // Enfoque de redirección directa (OAuth2) como último recurso
      const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;
      
      if (clientId) {
        // Usamos el endpoint de autorización OAuth2 estándar
        const redirectUri = encodeURIComponent(`${window.location.origin}/auth/callback`);
        const scope = encodeURIComponent('profile email');
        const state = encodeURIComponent(Math.random().toString(36).substring(2));
        
        // Guardar state para verificación de CSRF
        sessionStorage.setItem('googleAuthState', state);
        
        const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=token&scope=${scope}&state=${state}&prompt=select_account`;
        
        // Abrir en la misma ventana para evitar problemas de bloqueo de popups
        window.location.href = authUrl;
      } else {
        console.error('No se puede iniciar autenticación: falta el Client ID');
        alert('No se pudo conectar con Google. Por favor, intenta iniciar sesión con correo y contraseña.');
      }
    }
  }, []);

  return (
    <div className="mt-4 mb-4 d-flex justify-content-center">
      <div className="w-100" style={{ maxWidth: '280px', paddingTop: '3px', paddingBottom: '3px' }}>
        {scriptLoaded && !showFallback && (
          <GoogleButtonRenderer 
            handleGoogleResponse={handleGoogleResponse}
            isDarkMode={isDarkMode}
          />
        )}
        
        {showFallback && (
          <FallbackGoogleButton 
            onClick={handleFallbackButtonClick} 
            isDarkMode={isDarkMode} 
          />
        )}
      </div>
    </div>
  );
});

export default GoogleLoginButton;
