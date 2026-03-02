import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, LogIn } from 'lucide-react';
import { signIn } from '../../services/authservice';
import "./auth.css";

const Loginbolt = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await signIn({ email: formData.email, password: formData.password });
      setLoading(false);

      if (result.data.success) {
        if (result.data.user.isActive) {
          localStorage.setItem('CC_Token', result.data.token);
          localStorage.setItem('user', JSON.stringify(result.data.user));
          localStorage.setItem('refresh_token', result.data.refreshToken);

          // Met à jour la navbar / layout
          window.dispatchEvent(new Event('storage'));

          // Redirection selon rôle
          if (result.data.user.role === 'admin') {
            navigate('/admin/dashboard');
          } else {
            navigate('/homes');
          }
        } else {
          setError("Votre compte n'est pas encore activé.");
        }
      } else {
        setError('Identifiants incorrects !');
      }
    } catch (err) {
      setLoading(false);
      setError(err.response?.data?.message || 'Une erreur est survenue !');
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-content">
          <div className="auth-header">
            <div className="auth-logo">
              <img
                src="https://res.cloudinary.com/dchbcbmr2/image/upload/v1744334548/image_2025-04-11_022216764_o37a70.png"
                alt="Learnista"
                className="auth-logo-image"
              />
            </div>
            <h1 className="auth-title">Bienvenue de retour sur Learnista</h1>
            <p className="auth-subtitle">Connectez-vous pour continuer votre apprentissage</p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            {error && <div className="auth-error">{error}</div>}

            <div className="form-group">
              <div className="form-icon"><Mail /></div>
              <input
                type="email"
                name="email"
                placeholder="Votre email"
                value={formData.email}
                onChange={handleChange}
                required
                className="form-input"
              />
            </div>

            <div className="form-group">
              <div className="form-icon"><Lock /></div>
              <input
                type="password"
                name="password"
                placeholder="Votre mot de passe"
                value={formData.password}
                onChange={handleChange}
                required
                className="form-input"
              />
            </div>

            {/* Lien "Mot de passe oublié ?" sous le champ mot de passe */}
            <div style={{ textAlign: 'left', marginBottom: '-0.1rem' }}>
  <Link to="/forgot-password" className="auth-link">Mot de passe oublié ?</Link>
</div>

            <button type="submit" className="auth-button" disabled={loading}>
              <LogIn className="button-icon" />
              {loading ? <span className="auth-loading"></span> : "Se connecter"}
            </button>
          </form>

          <div className="auth-footer">
            <p>
              Pas encore de compte ? <Link to="/register" className="auth-link">Créer un compte</Link>
            </p>
          </div>
        </div>

        <div className="auth-illustration">
          <img
            src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800"
            alt="Education Illustration"
            className="illustration-image"
          />
          <div className="illustration-content">
            <h2>Apprenez, Évoluez, Réussissez</h2>
            <p>Rejoignez notre communauté d'apprenants passionnés</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Loginbolt;
