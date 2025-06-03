import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const { user } = useAuth();
  const [theme, setTheme] = useState('light');

  // Initialize theme: prefer session override, otherwise apply user preference on login
  useEffect(() => {
    const session = sessionStorage.getItem('theme');
    if (session) {
      // Manual override present, respect session choice on reload
      setTheme(session);
    } else if (user?.theme) {
      // No manual override: apply user's saved theme
      setTheme(user.theme);
      // sessionStorage will be updated in the theme effect
    }
  }, [user]);

  // Apply theme to document and persist in session
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    sessionStorage.setItem('theme', theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);