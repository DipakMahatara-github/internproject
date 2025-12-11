import React, { createContext, useContext, useEffect, useState } from 'react';
import { getCurrentUser, login as loginApi, register as registerApi } from '../services/authService.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchUser() {
      if (!token) return;
      try {
        const me = await getCurrentUser(token);
        setUser(me);
      } catch (err) {
        console.error(err);
        setUser(null);
        setToken(null);
        localStorage.removeItem('token');
      }
    }
    fetchUser();
  }, [token]);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const { token: t, user: u } = await loginApi(email, password);
      setToken(t);
      localStorage.setItem('token', t);
      setUser(u);
      return u;
    } finally {
      setLoading(false);
    }
  };

  const register = async (username, email, password) => {
    setLoading(true);
    try {
      await registerApi(username, email, password);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
