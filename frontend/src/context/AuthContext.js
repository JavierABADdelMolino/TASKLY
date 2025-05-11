import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Restaurar sesión desde el token
  useEffect(() => {
    const token = sessionStorage.getItem('token');
    if (token) {
      fetch('http://localhost:5000/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => {
          return res.ok ? res.json() : null;
        })
        .then((data) => {
          if (data) {
            setUser(data);
          } else {
            console.warn('Token inválido. Eliminando...');
            sessionStorage.removeItem('token');
          }
        })
        .catch((err) => {
          sessionStorage.removeItem('token');
        });
    }
  }, []);

  const logout = () => {
    sessionStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
