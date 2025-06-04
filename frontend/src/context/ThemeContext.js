import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const { user } = useAuth();
  const [theme, setTheme] = useState('light');

  // On mount, load manual override if exists
  useEffect(() => {
    const session = sessionStorage.getItem('theme');
    if (session) {
      setTheme(session);
    }
  }, []);

  // After user loads, apply user preference only if no manual override exists
  useEffect(() => {
    const session = sessionStorage.getItem('theme');
    if (!session && user?.theme) {
      setTheme(user.theme);
      sessionStorage.setItem('theme', user.theme);
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