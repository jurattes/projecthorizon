// AuthContext.js
import React, { createContext, useState, useEffect } from 'react';

// Create the AuthContext
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check if user data exists in localStorage/sessionStorage
  useEffect(() => {
    const storedUserData = localStorage.getItem('userData') || sessionStorage.getItem('userData');
    if (storedUserData) {
      const userData = JSON.parse(storedUserData);
      setUser(userData); // Set the user if logged in
      setIsLoading(false);
    } setIsLoading(false);
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {!isLoading && children}
    </AuthContext.Provider>
  );
};
