import { useState, useEffect } from 'react';

/**
 * Hook personalizado para detectar el modo oscuro en la aplicación
 * @returns {boolean} - true si el tema actual es oscuro, false si es claro
 */
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

export default useDarkMode;
