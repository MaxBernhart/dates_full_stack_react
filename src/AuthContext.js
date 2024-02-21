import { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(null);
  const [username, setUsername] = useState();
  const [id, setId] = useState();
  const [connectionId, setConnectionId] = useState();

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  const login = (newToken, id, username) => {
    setToken(newToken);
    setId(id);
    setUsername(username);
    localStorage.setItem('token', newToken);
  };

  const setConnection = (connectId) =>{
    setConnectionId(connectId);
  }

  const logout = () => {
    setToken(null);
    setUsername(null);
    setId(null);
    setConnectionId(null);
    localStorage.removeItem('token');
  };

  const isAuthenticated = () => {
    return !!token;
  };

  return (
    <AuthContext.Provider value={{ token, id, connectionId, username, login, logout, setConnection, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
}
