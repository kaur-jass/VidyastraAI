import { useState } from 'react';

export const useAuth = () => {
  const [user, setUser] = useState(null); // Will store { role: 'student' | 'faculty' | 'admin' }

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('vidyastra_user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('vidyastra_user');
  };

  return { user, login, logout };
};