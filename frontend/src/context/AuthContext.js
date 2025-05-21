// src/context/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // 🔄 Al iniciar, intenta cargar usuario desde token
  useEffect(() => {
    const token = sessionStorage.getItem('token');
    if (token) {
      fetchUserFromAPI(token, setUser);
    }
  }, []);

  // 🚪 Logout: elimina token y limpia usuario
  const logout = () => {
    sessionStorage.removeItem('token');
    setUser(null);
  };

  // 🔁 Función para recargar el usuario desde el backend
  const fetchUser = () => {
    const token = sessionStorage.getItem('token');
    if (token) return fetchUserFromAPI(token, setUser);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, logout, fetchUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

// ✅ Función reutilizable para cargar el usuario desde /users/me
export const fetchUserFromAPI = async (token, setUser) => {
  try {
    const res = await fetch(`${process.env.REACT_APP_API_URL}/users/me`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();
    if (res.ok) setUser(data);
    else console.warn('Error al refrescar usuario:', data.message);
  } catch (err) {
    console.error('Error al refrescar usuario:', err);
  }
};
