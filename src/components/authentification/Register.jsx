import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FilePond, registerPlugin } from 'react-filepond';
import 'filepond/dist/filepond.min.css';
import FilePondPluginImageExifOrientation from 'filepond-plugin-image-exif-orientation';
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css';
import { signUp } from '../../services/authservice';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './auth.css';
registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview);

const Register = () => {
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [sexe, setSexe] = useState('');
  const [role, setRole] = useState('');
  const [tel, setTel] = useState('');
  const [files, setFiles] = useState([]);
  const [avatarUrl, setAvatarUrl] = useState('');
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const errorRef = useRef(null);

  useEffect(() => {
    if (error && errorRef.current) {
      errorRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [error]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== password2) {
      setError('Les mots de passe ne correspondent pas.');
      return;
    }

    if (!avatarUrl && files.length > 0) {
      setError("L'upload de l'image n'est pas encore terminé.");
      return;
    }

    if (!acceptedTerms) {
      setError('Vous devez accepter les termes et conditions pour continuer.');
      return;
    }

    if (!sexe) {
      setError('Veuillez sélectionner votre sexe.');
      return;
    }
    if (!role) {
      setError('Veuillez sélectionner votre rôle.');
      return;
    }

    try {
      setLoading(true);
      const userData = {
        firstname,
        lastname,
        email,
        password,
        sexe,
        role,
        tel,
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
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">Créer un compte</h2>

        {error && <div ref={errorRef} className="auth-error">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form-2col">
          <div className="auth-form-row">
            <div className="auth-input-group">
              <input
                type="text"
                className="auth-input"
                placeholder="Prénom"
                value={firstname}
                onChange={(e) => setFirstname(e.target.value)}
                required
              />
            </div>
            <div className="auth-input-group">
              <input
                type="text"
                className="auth-input"
                placeholder="Nom"
                value={lastname}
                onChange={(e) => setLastname(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="auth-form-row">
            <div className="auth-input-group">
              <input
                type="email"
                className="auth-input"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="auth-input-group">
              <input
                type="password"
                className="auth-input"
                placeholder="Mot de passe"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="auth-form-row">
            <div className="auth-input-group">
              <input
                type="password"
                className="auth-input"
                placeholder="Confirmer mot de passe"
                value={password2}
                onChange={(e) => setPassword2(e.target.value)}
                required
              />
            </div>
            <div className="auth-input-group">
              <select
                className="auth-input"
                value={sexe}
                onChange={(e) => setSexe(e.target.value)}
                required
              >
                <option value="" disabled hidden>Sexe</option>
                <option value="homme">Homme</option>
                <option value="femme">Femme</option>
              </select>
            </div>
          </div>

          <div className="auth-form-row">
            <div className="auth-input-group">
              <input
                type="tel"
                className="auth-input"
                placeholder="Téléphone"
                value={tel}
                onChange={(e) => setTel(e.target.value)}
                required
              />
            </div>
            <div className="auth-input-group">
              <select
                className="auth-input"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                required
              >
                <option value="" disabled hidden>Rôle</option>
                <option value="enseignant">Enseignant</option>
                <option value="etudiant">Étudiant</option>
              </select>
            </div>
          </div>

          <div className="auth-form-row">
            <div className="auth-input-group">
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
          </div>

          <div className="auth-form-row">
            <div className="auth-input-group">
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
          </div>

          <button type="submit" className="auth-button" disabled={loading}>
            {loading ? <span className="auth-loading"></span> : "S'inscrire"}
          </button>
        </form>

        <div className="auth-link">
          Déjà un compte ? <a href="/login">Se connecter</a>
        </div>
      </div>
    </div>
  );
};

export default Register;