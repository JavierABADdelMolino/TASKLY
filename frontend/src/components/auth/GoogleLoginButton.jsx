// Componente interno para renderizar el botón de Google
// Se renderiza una única vez al montar, y no vuelve a hacerlo tras re-renders
import React, { useEffect, useRef, memo } from 'react';
const GoogleButtonRenderer = memo(({ handleGoogleResponse, isDarkMode }) => {
  const containerRef = useRef(null);
  const initializedRef = useRef(false);  // guardián de inicialización

  useEffect(() => {
    // Si ya inicializamos, salimos de cabeza
    if (initializedRef.current) return;
    if (!containerRef.current) return;

    const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;
    if (!clientId || !window.google?.accounts?.id) {
      console.error('Falta client_id o SDK de Google no está disponible.');
      return;
    }

    // Inicializamos UNA sola vez
    window.google.accounts.id.initialize({
      client_id: clientId,
      callback: handleGoogleResponse,
      ux_mode: 'popup',
      auto_select: false,
    });

    window.google.accounts.id.renderButton(
      containerRef.current,
      {
        theme: isDarkMode ? 'filled_black' : 'outline',
        size: 'large',
        text: 'continue_with',
        shape: 'pill',
        width: '100%',
        locale: 'es_ES',
      }
    );

    // Marcamos como inicializado para que no vuelva a entrar aquí
    initializedRef.current = true;
    
    // No hay dependencias que vuelvan a disparar esto, 
    // pues initializedRef nunca cambia de identidad.
  }, [handleGoogleResponse, isDarkMode]);

  return (
    <div
      ref={containerRef}
      style={{ maxWidth: 280, width: '100%', minHeight: 42 }}
      aria-label="Iniciar sesión con Google"
    />
  );
});

export const GoogleLoginButton = ({ onGoogleSignIn }) => {
  const handleGoogleResponse = (response) => {
    if (response.credential) {
      // Si hay credencial, llamamos al manejador externo
      onGoogleSignIn(response);
    } else {
      console.error('No se recibió credencial de Google');
    }
  };

  // Determinar si estamos en modo oscuro
  const isDarkMode = document.documentElement.classList.contains('dark');

  return (
    <GoogleButtonRenderer
      handleGoogleResponse={handleGoogleResponse}
      isDarkMode={isDarkMode}
    />
  );
}

export default GoogleLoginButton;