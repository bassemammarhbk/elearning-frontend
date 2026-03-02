import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, LogIn } from 'lucide-react';
import { signIn, forgotPassword } from '../../services/authservice';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './auth.css';

const Loginbolt = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotError, setForgotError] = useState('');
  const [forgotSuccess, setForgotSuccess] = useState('');
  const errorRef = useRef(null);

  useEffect(() => {
    if (error && errorRef.current) {
      errorRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [error]);

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

    const objectUser = { email: formData.email, password: formData.password };

    try {
      const result = await signIn(objectUser);
      setLoading(false);

      if (result.data.success) {
        if (result.data.user.isActive) {
          localStorage.setItem('CC_Token', result.data.token);
          localStorage.setItem('user', JSON.stringify(result.data.user));
          localStorage.setItem('refresh_token', result.data.refreshToken);

          window.dispatchEvent(new Event('storage'));

          if (result.data.user.role === 'admin') {
            navigate('/admin/dashboard');
          } else {
            navigate('/homes');
          }
        } else {
          setError("Votre compte n'est pas encore activé");
        }
      } else {
        setError('Identifiants incorrects !');
      }
    } catch (err) {
      setLoading(false);
      setError(err.message || 'Une erreur est survenue !');
    }
  };

  const handleForgotPasswordSubmit = async (e) => {
    e.preventDefault();
    setForgotError('');
    setForgotSuccess('');

    if (!forgotEmail) {
      setForgotError('Veuillez entrer votre adresse email.');
      return;
    }

    try {
      setLoading(true);
      await forgotPassword({ email: forgotEmail });
      setLoading(false);
      setForgotSuccess('Un email de réinitialisation a été envoyé. Vérifiez votre boîte de réception.');
      setForgotEmail('');
      setTimeout(() => setShowForgotPassword(false), 3000);
    } catch (err) {
      setLoading(false);
      setForgotError(err.message || 'Erreur lors de l’envoi de l’email de réinitialisation.');
    }
  };

  const closeForgotPasswordModal = () => {
    setShowForgotPassword(false);
    setForgotEmail('');
    setForgotError('');
    setForgotSuccess('');
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
            {error && (
              <div ref={errorRef} className="auth-error">
                {error}
              </div>
            )}

            <div className="form-group">
              <div className="form-icon">
                <Mail />
              </div>
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
              <div className="form-icon">
                <Lock />
              </div>
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

            <div className="auth-forgot-password">
              <button
                type="button"
                className="auth-link-button"
                onClick={() => setShowForgotPassword(true)}
              >
                Mot de passe oublié ?
              </button>
            </div>

            <button type="submit" className="auth-button" disabled={loading}>
              <LogIn className="button-icon" />
              {loading ? <span className="auth-loading"></span> : "Se connecter"}
            </button>
          </form>

          <div className="auth-footer">
            <p>Pas encore de compte ?</p>
            <Link to="/register" className="auth-link">
              Créer un compte
            </Link>
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

      {showForgotPassword && (
        <div className="auth-modal-overlay">
          <div className="auth-modal">
            <h2 className="auth-modal-title">Réinitialiser votre mot de passe</h2>
            <p className="auth-modal-subtitle">
              Entrez votre adresse email pour recevoir un lien de réinitialisation.
            </p>

            <form onSubmit={handleForgotPasswordSubmit} className="auth-form">
              {forgotError && <div className="auth-error">{forgotError}</div>}
              {forgotSuccess && <div className="auth-success">{forgotSuccess}</div>}

              <div className="form-group">
                <div className="form-icon">
                  <Mail />
                </div>
                <input
                  type="email"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  placeholder="Votre email"
                  className="form-input"
                  required
                />
              </div>

              <div className="auth-modal-actions">
                <button
                  type="submit"
                  className="auth-button"
                  disabled={loading}
                >
                  {loading ? <span className="auth-loading"></span> : "Envoyer"}
                </button>
                <button
                  type="button"
                  className="auth-button auth-button-secondary"
                  onClick={closeForgotPasswordModal}
                >
                  Annuler
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default Loginbolt;