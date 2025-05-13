import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [checkingSession, setCheckingSession] = useState(true);

  useEffect(() => {
    const token = sessionStorage.getItem('token');
    if (token) {
      fetch(`${process.env.REACT_APP_API_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (data) {
            setUser(data);
          } else {
            console.warn('Token inválido. Eliminando...');
            sessionStorage.removeItem('token');
          }
        })
        .catch(() => {
          sessionStorage.removeItem('token');
        })
        .finally(() => {
          setCheckingSession(false); // Finaliza validación
        });
    } else {
      setCheckingSession(false); // No había token
    }
  }, []);

  const logout = () => {
    sessionStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, logout, checkingSession }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
