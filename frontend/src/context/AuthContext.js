import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  // Set up axios defaults
  useEffect(() => {
    // Use remote backend in production, localhost in development
    axios.defaults.baseURL = process.env.NODE_ENV === 'production'
      ? 'https://portfolio-pro-xv3x.onrender.com'
      : 'http://localhost:3000';

    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  }, [token]);

  // Check if user is logged in on app load
  useEffect(() => {
    const checkAuth = async () => {
      if (token) {
        try {
          const response = await axios.get('/api/auth/me');
          setUser(response.data.data.user);
        } catch (error) {
          // Token invalid or expired
          localStorage.removeItem('token');
          setToken(null);
          setUser(null);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    };
    checkAuth();
  }, [token]);

  const login = async (email, password) => {
    try {
      const response = await axios.post('/api/auth/login', {
        email,
        password
      });
      const { user, token } = response.data.data;
      if (token) {
        localStorage.setItem('token', token);
        setToken(token);
        setUser(user);
        return { success: true };
      } else {
        return { success: false, message: 'No token received from server' };
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed';
      localStorage.removeItem('token');
      setToken(null);
      setUser(null);
      return { success: false, message };
    }
  };

  const register = async (name, email, password) => {
    try {
      const response = await axios.post('/api/auth/register', {
        name,
        email,
        password
      });
      const { user, token } = response.data.data;
      if (token) {
        localStorage.setItem('token', token);
        setToken(token);
        setUser(user);
        return { success: true };
      } else {
        return { success: false, message: 'No token received from server' };
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed';
      localStorage.removeItem('token');
      setToken(null);
      setUser(null);
      return { success: false, message };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    delete axios.defaults.headers.common['Authorization'];
  };

  const value = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!token && !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
