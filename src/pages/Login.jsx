// src/pages/Login.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const result = await login(email, password);
    setLoading(false);
    
    if (result.success) {
      navigate('/dashboard');
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-panel">
          <div className="auth-badge">Espace administration</div>
          <h1>Bienvenue dans votre console Univers Hygiène</h1>
          <p>
            Gérez vos produits, services, commandes, clients et offres depuis une seule interface moderne et centralisée.
          </p>
          <ul className="auth-features">
            <li>Gestion centralisée de l’activité</li>
            <li>Suivi des commandes et des devis</li>
            <li>Vue dédiée au commercial et au support</li>
          </ul>
        </div>

        <div className="auth-form-wrap">
          <div className="auth-form-header">
            <div className="auth-logo">UH</div>
            <div>
              <h2>Connexion</h2>
              <p>Accédez à votre espace de gestion</p>
            </div>
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="auth-field">
              <label htmlFor="email">Adresse email</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="auth-input"
                placeholder="admin@univershygiene.tn"
                required
              />
            </div>

            <div className="auth-field">
              <label htmlFor="password">Mot de passe</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="auth-input"
                placeholder="••••••••"
                required
              />
            </div>

            <button type="submit" disabled={loading} className="auth-button">
              {loading ? 'Connexion...' : 'Se connecter'}
            </button>
          </form>

          <p className="auth-hint">
            Identifiants de démonstration : <strong>admin@univershygiene.tn</strong> / <strong>admin123</strong>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;