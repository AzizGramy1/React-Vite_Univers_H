import React, { createContext, useState, useEffect, useContext } from 'react';
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { app } from '../firebase/config';
import { verifyToken } from '../api/endpoints';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const auth = getAuth(app);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const token = await firebaseUser.getIdToken();
          localStorage.setItem('firebaseToken', token);
          
          const response = await verifyToken(token);
          setUser(response.data);
        } catch (error) {
          console.error('Erreur de vérification:', error);
          setUser(null);
          localStorage.removeItem('firebaseToken');
        }
      } else {
        setUser(null);
        localStorage.removeItem('firebaseToken');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const token = await userCredential.user.getIdToken();
      localStorage.setItem('firebaseToken', token);
      
      const response = await verifyToken(token);
      setUser(response.data);
      toast.success('Connecté avec succès !');
      return { success: true };
    } catch (error) {
      console.error('Erreur de connexion:', error);
      toast.error(error.message || 'Erreur de connexion');
      return { success: false, error: error.message };
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      localStorage.removeItem('firebaseToken');
      setUser(null);
      toast.success('Déconnecté');
    } catch (error) {
      console.error('Erreur de déconnexion:', error);
      toast.error('Erreur lors de la déconnexion');
    }
  };

  const value = {
    user,
    loading,
    login,
    logout,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};