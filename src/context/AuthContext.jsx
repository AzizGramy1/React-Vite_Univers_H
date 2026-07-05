// src/context/AuthContext.jsx
import React, { createContext, useState, useEffect, useContext } from 'react';
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { app } from '../firebase/config';
import { verifyToken } from '../api/endpoints';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth doit être utilisé à l\'intérieur d\'un AuthProvider');
  }
  return context;
};

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
          console.error('Erreur de vérification du token:', error);
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
  }, [auth]);

  const login = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const token = await userCredential.user.getIdToken();
      localStorage.setItem('firebaseToken', token);
      
      const response = await verifyToken(token);
      setUser(response.data);
      toast.success('✅ Connecté avec succès !');
      return { success: true };
    } catch (error) {
      console.error('Erreur de connexion:', error);
      let message = '❌ Erreur de connexion';
      if (error.code === 'auth/user-not-found') {
        message = '❌ Utilisateur non trouvé';
      } else if (error.code === 'auth/wrong-password') {
        message = '❌ Mot de passe incorrect';
      } else if (error.code === 'auth/invalid-email') {
        message = '❌ Email invalide';
      }
      toast.error(message);
      return { success: false, error: message };
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      localStorage.removeItem('firebaseToken');
      setUser(null);
      toast.success('👋 Déconnecté avec succès');
    } catch (error) {
      console.error('Erreur de déconnexion:', error);
      toast.error('❌ Erreur lors de la déconnexion');
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