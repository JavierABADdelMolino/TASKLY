import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const { user } = useAuth();
  
  // Inicializar el tema desde localStorage al cargar el componente
  const initialTheme = localStorage.getItem('theme') || 
                      sessionStorage.getItem('theme') || 
                      'light';
                      
  const [theme, setTheme] = useState(initialTheme);
  
  // Aplicar el tema inmediatamente durante la inicialización
  // Esto garantiza que el tema se aplique antes del primer render
  if (typeof document !== 'undefined') {
    document.documentElement.setAttribute('data-bs-theme', initialTheme);
    document.documentElement.setAttribute('data-theme', initialTheme);
  }
  
  // 1. Al montar, asegurarse de que el tema está correctamente aplicado
  useEffect(() => {
    // Verificar que el tema del DOM coincida con el estado
    const currentTheme = document.documentElement.getAttribute('data-bs-theme');
    if (currentTheme !== theme) {
      document.documentElement.setAttribute('data-bs-theme', theme);
      document.documentElement.setAttribute('data-theme', theme);
    }
    
    // Sincronizar localStorage con el tema actual
    localStorage.setItem('theme', theme);
    console.log('Theme loaded and set:', theme);
  }, [theme]);

  // 2. Cuando el usuario se carga, aplicar su preferencia si no hay una elección manual previa
  useEffect(() => {
    // Aplicar la preferencia del usuario solo si existe y no hay selección manual previa
    const manualSelection = localStorage.getItem('userSelectedTheme') === 'true';
    if (user?.theme && !manualSelection) {
      console.log('Applying user preferred theme:', user.theme);
      setTheme(user.theme);
    }
  }, [user]);

  // 3. Aplicar el tema al documento y persistirlo tanto en localStorage como sessionStorage
  useEffect(() => {
    console.log('Updating theme to:', theme);
    
    // Actualizar el atributo data-bs-theme en el HTML para que Bootstrap lo use
    document.documentElement.setAttribute('data-bs-theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
    
    // Guardar en localStorage para persistencia entre sesiones
    localStorage.setItem('theme', theme);
    
    // Mantener sessionStorage actualizado para compatibilidad
    sessionStorage.setItem('theme', theme);
    
    // Si hay usuario logueado, opcionalmente podría guardarse en el perfil
    // mediante una llamada API (esto requeriría implementación adicional)
  }, [theme]);

  // Función para cambiar el tema y marcar como selección explícita del usuario
  const changeTheme = (newTheme) => {
    setTheme(newTheme);
    // Marcar que el usuario ha seleccionado explícitamente un tema
    localStorage.setItem('userSelectedTheme', 'true');
  };

  return (
    <ThemeContext.Provider value={{ 
      theme, 
      setTheme: changeTheme, // Reemplazar la función simple con nuestra versión mejorada
    }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);