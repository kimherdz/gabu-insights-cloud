import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [role, setRole] = useState(null);
  const [userId, setUserId] = useState(null);
  const [avatar, setAvatar] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = JSON.parse(atob(token.split('.')[1]));
      setRole(decodedToken.role);
      setUserId(decodedToken.id);
      setAvatar(decodedToken.avatar);
    }
  }, []);

  const updateAuthData = (newRole, newUserId, newAvatar) => {
    setRole(newRole);
    setUserId(newUserId);
    setAvatar(newAvatar);
    localStorage.setItem('avatar', newAvatar);
  };

  const clearAuthData = () => {
    setRole(null);
    setUserId(null);
    setAvatar(null);
  };

  return (
    <AuthContext.Provider value={{ role, userId, avatar, updateAuthData, clearAuthData }}>
      {children}
    </AuthContext.Provider>
  );
};
