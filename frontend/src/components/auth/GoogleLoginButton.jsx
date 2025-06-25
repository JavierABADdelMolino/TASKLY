import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { googleLogin } from '../../services/authService';

const GoogleLoginButton = ({ onGoogleSignIn }) => {
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const { setUser } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');

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

  useEffect(() => {
    if (scriptLoaded && window.google) {
      try {
        window.google.accounts.id.initialize({
          client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID,
          callback: handleGoogleResponse
        });
        
        window.google.accounts.id.renderButton(
          document.getElementById('google-signin-button'),
          { 
            type: 'standard',
            theme: 'outline',
            size: 'large',
            text: 'signup_with',
            shape: 'rectangular',
            width: '100%'
          }
        );
      } catch (err) {
        console.error('Error al inicializar Google Sign-In:', err);
        setError('No se pudo cargar el inicio de sesión con Google');
      }
    }
  }, [scriptLoaded, handleGoogleResponse]);

  return (
    <div className="mt-3 mb-3">
      {error && <div className="alert alert-danger small">{error}</div>}
      <div id="google-signin-button" className="d-flex justify-content-center"></div>
    </div>
  );
};

export default GoogleLoginButton;
