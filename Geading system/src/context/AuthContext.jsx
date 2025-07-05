import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const role = localStorage.getItem('role');
    if (role && users.length > 0) {
      const found = users.find(u => u.role === role);
      if (found) setUser(found);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
} 