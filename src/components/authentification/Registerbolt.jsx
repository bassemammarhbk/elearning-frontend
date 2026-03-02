import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, BookOpen, LogIn } from 'lucide-react';
import { FilePond, registerPlugin } from 'react-filepond';
import 'filepond/dist/filepond.min.css';
import FilePondPluginImageExifOrientation from 'filepond-plugin-image-exif-orientation';
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css';
import { signUp } from '../../services/authservice';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import PhoneAndroidIcon from '@mui/icons-material/PhoneAndroid';
import WcIcon from '@mui/icons-material/Wc';

registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview);

const Registerbolt = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    email: '',
    password: '',
    confirmPassword: '',
    sexe: '',
    role: 'etudiant',
    tel: '',
  });
  const [files, setFiles] = useState([]);
  const [avatarUrl, setAvatarUrl] = useState('');
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const validateTelephone = (tel) => {
    const telPattern = /^\d{8}$/;
    return telPattern.test(tel);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }

    if (!avatarUrl && files.length > 0) {
      setError("L'upload de l'image n'est pas encore terminé.");
      return;
    }

    if (!acceptedTerms) {
      setError('Veuillez accepter les termes et conditions.');
      return;
    }

    if (!formData.sexe) {
      setError('Veuillez sélectionner votre sexe.');
      return;
    }

    if (!validateTelephone(formData.tel)) {
      setError('Le numéro de téléphone doit contenir exactement 8 chiffres.');
      return;
    }

    try {
      setLoading(true);
      const userData = {
        firstname: formData.firstname,
        lastname: formData.lastname,
        email: formData.email,
        password: formData.password,
        sexe: formData.sexe,
        role: formData.role,
        tel: formData.tel,
        avatar: avatarUrl,
      };

      await signUp(userData);
      setLoading(false);
      toast.success('Inscription réussie ! Vérifiez votre email pour activer votre compte.');
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de l’inscription');
      setLoading(false);
    }
  };

  const serverOptions = () => ({
    process: (fieldName, file, metadata, load, error, progress, abort) => {
      const data = new FormData();
      data.append('file', file);
      data.append('upload_preset', 'bsmammr');

      fetch('https://api.cloudinary.com/v1_1/dchbcbmr2/image/upload', {
        method: 'POST',
        body: data,
      })
        .then((res) => res.json())
        .then((data) => {
          setAvatarUrl(data.secure_url);
          load(data);
        })
        .catch((err) => {
          console.error('Erreur upload :', err);
          error('Upload échoué');
          abort();
        });
    },
  });

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
            <h1 className="auth-title">Rejoignez Learnista</h1>
            <p className="auth-subtitle">Créez votre compte et commencez votre voyage d'apprentissage</p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            {error && (
              <div className="auth-error">
                {error}
              </div>
            )}

            {/* Nom et Prénom sur la même ligne */}
            <div className="form-row">
              <div className="form-group">
                <div className="form-icon">
                  <User />
                </div>
                <input
                  type="text"
                  name="firstname"
                  placeholder="Prénom"
                  value={formData.firstname}
                  onChange={handleChange}
                  required
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <div className="form-icon">
                  <User />
                </div>
                <input
                  type="text"
                  name="lastname"
                  placeholder="Nom"
                  value={formData.lastname}
                  onChange={handleChange}
                  required
                  className="form-input"
                />
              </div>
            </div>

            {/* Email sur une nouvelle ligne */}
            <div className="form-group">
              <div className="form-icon">
                <Mail />
              </div>
              <input
                type="email"
                name="email"
                placeholder="Adresse email"
                value={formData.email}
                onChange={handleChange}
                required
                className="form-input"
              />
            </div>
            <div>
              <p style={{ color: 'red', fontSize: '0.85em', marginTop: '4px' }}>
                * Un e‑mail d’activation sera envoyé à cette adresse. Vous devrez activer votre compte pour pouvoir vous connecter.
              </p>
            </div>

            {/* Mot de passe et Confirmation sur la même ligne */}
            <div className="form-row">
              <div className="form-group">
                <div className="form-icon">
                  <Lock />
                </div>
                <input
                  type="password"
                  name="password"
                  placeholder="Mot de passe"
                  value={formData.password}
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
                  name="confirmPassword"
                  placeholder="Confirmez mot de passe"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  className="form-input"
                />
              </div>
            </div>

            {/* Sexe et Téléphone sur la même ligne */}
            <div className="form-row">
              <div className="form-group">
                <div className="form-icon">
                  <WcIcon />
                </div>
                <select
                  name="sexe"
                  value={formData.sexe}
                  onChange={handleChange}
                  required
                  className="form-input with-icon"
                >
                  <option value="" disabled hidden>Sexe</option>
                  <option value="homme">Homme</option>
                  <option value="femme">Femme</option>
                </select>
              </div>

              <div className="form-group">
                <div className="form-icon">
                  <PhoneAndroidIcon />
                </div>
                <input
                  type="tel"
                  name="tel"
                  placeholder="Téléphone"
                  value={formData.tel}
                  onChange={handleChange}
                  required
                  className="form-input"
                />
              </div>
            </div>

            {/* Rôle (Étudiant ou Enseignant) sur une nouvelle ligne */}
            <div className="form-group">
              <div className="form-icon">
                <User />
              </div>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="form-input with-icon"
              >
                <option value="etudiant">Je suis un étudiant</option>
                <option value="enseignant">Je suis un enseignant</option>
              </select>
            </div>

            {/* Avatar sur une nouvelle ligne */}
            <div className="form-group">
              <label>Avatar</label>
              <FilePond
                files={files}
                acceptedFileTypes={['image/*']}
                onupdatefiles={setFiles}
                allowMultiple={false}
                server={serverOptions()}
                name="avatar"
                labelIdle='Glissez-déposez votre image ou <span class="filepond--label-action">Parcourir</span>'
              />
            </div>

            {/* Acceptation des termes sur une nouvelle ligne */}
            <div className="form-group">
              <label className="terms-label">
                <input
                  type="checkbox"
                  checked={acceptedTerms}
                  onChange={(e) => setAcceptedTerms(e.target.checked)}
                />
                J'accepte les{' '}     
                <a href="/terms" target="_blank" rel="noopener noreferrer">
                  termes et conditions
                </a>
              </label>
            </div>

            <button type="submit" className="auth-button" disabled={loading}>
              <LogIn className="button-icon" />
              {loading ? <span className="auth-loading"></span> : "Créer mon compte"}
            </button>
          </form>

          <div className="auth-footer">
            <p>Déjà inscrit ?</p>
            <Link to="/login" className="auth-link">
              Se connecter
            </Link>
          </div>
        </div>

        <div className="auth-illustration">
          <img
            src="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800"
            alt="Education Illustration"
            className="illustration-image"
          />
          <div className="illustration-content">
            <h2>Développez vos compétences</h2>
            <p>Une nouvelle façon d'apprendre, interactive et engageante</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Registerbolt;