// frontend/context/AuthContext.js
import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Initialize auth state
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          // Verify token with backend
          const { data } = await axios.get('/api/auth/verify');
          setUser(data.user);
        }
      } catch (error) {
        logout();
      } finally {
        setLoading(false);
      }
    };
    initializeAuth();
  }, []);

  // Login function
  const login = async (email, password) => {
    try {
      const { data } = await axios.post('/api/auth/login', { email, password });
      localStorage.setItem('token', data.token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
      setUser(data.user);
      router.push(data.user.role === 'patient' ? '/dashboard' : '/provider');
    } catch (error) {
      throw error.response?.data?.message || 'Login failed';
    }
  };

  // Register function
  const register = async (userData) => {
    try {
      const { data } = await axios.post('/api/auth/register', userData);
      localStorage.setItem('token', data.token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
      setUser(data.user);
      router.push(data.user.role === 'patient' ? '/dashboard' : '/provider');
    } catch (error) {
      throw error.response?.data?.message || 'Registration failed';
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);