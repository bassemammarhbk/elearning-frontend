import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getFiliereWithCourses } from '../../../services/filiereservice';
import { getSousFilieresByFiliere } from '../../../services/sousfiliereservice';
import {
  getCoursByEnseignant,
  enrollInCourse,
  getStudentDetails,
} from '../../../services/courservice';
import InsertCours from '../cours/InsertCours';
import BarreRecherche from '../cours/BarreRecherche';
import '../../../user.css';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import SettingsSuggestIcon from '@mui/icons-material/SettingsSuggest';
import SubscriptionsIcon from '@mui/icons-material/Subscriptions';
import { Modal, Button } from 'react-bootstrap';
import PreviewIcon from '@mui/icons-material/Preview';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './filieredetails.css';
import axios from '../../../api/axios';
import { CircularProgress } from '@mui/material';

const niveauxDisponibles = [
  { clé: 'all', label: 'Tous les niveaux ' },
  { clé: 'debutant', label: 'Débutant' },
  { clé: 'intermediaire', label: 'Intermédiaire' },
  { clé: 'avancé', label: 'Avancé' },
];

const FiliereDetail = () => {
  const { filiereId } = useParams();
  const navigate = useNavigate();

  const [filiere, setFiliere] = useState({
    nomfiliere: '',
    descriptionfiliere: '',
    imagefiliere: '',
    cours: [],
  });
  const [sousFilieres, setSousFilieres] = useState([]);
  const [selectedSousFiliere, setSelectedSousFiliere] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showInsertModal, setShowInsertModal] = useState(false);
  const [message, setMessage] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [userId, setUserId] = useState(null);
  const [teacherCourses, setTeacherCourses] = useState([]);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [selectedCourseId, setSelectedCourseId] = useState(null);
  const [selectedLevel, setSelectedLevel] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredCours, setFilteredCours] = useState([]);
  const [isConfirming, setIsConfirming] = useState(false); // Nouvel état pour le chargement de la confirmation

  const fetchFiliereData = async () => {
    try {
      const res = await getFiliereWithCourses(filiereId);
      const filiereData = {
        nomfiliere: res.data.nomfiliere || 'Nom non disponible',
        descriptionfiliere: res.data.descriptionfiliere || 'Description non disponible',
        imagefiliere: res.data.imagefiliere || '/default-filiere.jpg',
        cours: res.data.cours || [],
      };
      console.log('FiliereData:', filiereData);
      setFiliere(filiereData);
      return filiereData.cours;
    } catch (err) {
      console.error('Erreur dans fetchFiliereData:', err);
      throw new Error(err.response?.data?.message || 'Erreur de chargement des données de la filière');
    }
  };

  const fetchSousFilieresAndCourses = async () => {
    try {
      setLoading(true);
      setError(null);

      const sousFilieresRes = await getSousFilieresByFiliere(filiereId);
      console.log('SousFilieres:', sousFilieresRes.data);
      setSousFilieres(sousFilieresRes.data || []);

      const courses = await fetchFiliereData();
      setFilteredCours(courses.map((c) => ({
        ...c,
        niveau: c.niveau ? c.niveau.charAt(0).toUpperCase() + c.niveau.slice(1) : 'Inconnu',
      })));

      const user = JSON.parse(localStorage.getItem('user'));
      if (user) {
        setUserRole(user.role);
        setUserId(user._id);
        if (user.role === 'enseignant') {
          const teacherRes = await getCoursByEnseignant(user._id);
          setTeacherCourses(teacherRes.data.map((c) => c._id));
        } else if (user.role === 'etudiant') {
          const studentDetails = await getStudentDetails(user._id);
          setEnrolledCourses(studentDetails.coursInscri?.map((c) => c._id) || []);
        }
      } else {
        setUserRole('visitor');
      }
    } catch (err) {
      console.error('Erreur dans fetchSousFilieresAndCourses:', err);
      setError(err.message || 'Erreur de chargement des données');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSousFilieresAndCourses();
  }, [filiereId]);

  useEffect(() => {
    const fetchFilteredCourses = async () => {
      try {
        let resultat = [];

        if (selectedSousFiliere !== 'all') {
          console.log('Fetching courses for sousFiliere:', selectedSousFiliere);
          try {
            const coursesRes = await axios.get(`/cours/sous-filiere/${selectedSousFiliere}`);
            console.log('Courses from API:', coursesRes.data);
            resultat = coursesRes.data.map((c) => ({
              ...c,
              niveau: c.niveau ? c.niveau.charAt(0).toUpperCase() + c.niveau.slice(1) : 'Inconnu',
            }));
          } catch (apiErr) {
            console.error(`Erreur API pour sous-filiere ${selectedSousFiliere}:`, apiErr);
            resultat = [];
          }
        } else {
          resultat = filiere.cours.map((c) => ({
            ...c,
            niveau: c.niveau ? c.niveau.charAt(0).toUpperCase() + c.niveau.slice(1) : 'Inconnu',
          }));
        }

        if (selectedLevel !== 'all') {
          resultat = resultat.filter(
            (c) => c.niveau.toLowerCase() === selectedLevel.toLowerCase()
          );
        }

        if (searchTerm && searchTerm.trim() !== '') {
          resultat = resultat.filter((c) =>
            c.nomcours?.toLowerCase().includes(searchTerm.trim().toLowerCase())
          );
        }

        console.log('Filtered Courses:', resultat);
        setFilteredCours(resultat);
        setError(null);
      } catch (err) {
        console.error('Erreur dans fetchFilteredCourses:', err);
        setError(err.response?.data?.message || 'Erreur lors du filtrage des cours');
      }
    };

    if (filiere.cours.length > 0 || selectedSousFiliere !== 'all') {
      fetchFilteredCourses();
    }
  }, [selectedSousFiliere, selectedLevel, searchTerm, filiere.cours]);

  const handleAddCours = async (newCours) => {
    setMessage('Création réussie ! Le cours est maintenant disponible');
    setTimeout(() => setMessage(null), 2000);
    if (userRole === 'enseignant') {
      setTeacherCourses((prev) => [...prev, newCours._id]);
    }
    await fetchSousFilieresAndCourses();
    setShowInsertModal(false);
    toast.success('Cours ajouté avec succès');
  };

  const handleEnroll = (coursId) => {
    if (userRole === 'visitor') {
      toast.warn('Vous devez vous connecter pour vous inscrire à un cours.', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
      });
      setTimeout(() => navigate('/login'), 1000);
    } else if (enrolledCourses.includes(coursId)) {
      setShowErrorModal(true);
    } else {
      setSelectedCourseId(coursId);
      setShowConfirmModal(true);
    }
  };

  const confirmEnroll = async () => {
    setIsConfirming(true); // Activer l'état de chargement
    const toastId = toast.info('Inscription en cours...', {
      position: 'top-right',
      autoClose: false,
      hideProgressBar: false,
      closeOnClick: false,
      pauseOnHover: true,
    });

    try {
      if (!selectedCourseId || !userId) {
        throw new Error("ID du cours ou de l'utilisateur manquant");
      }
      await enrollInCourse(selectedCourseId, userId);
      const studentDetails = await getStudentDetails(userId);
      setEnrolledCourses(studentDetails.coursInscri?.map((c) => c._id) || []);
      toast.update(toastId, {
        render: 'Inscription réussie !',
        type: 'success',
        autoClose: 3000,
      });
      setMessage('Inscription réussie !');
    } catch (err) {
      console.error("Erreur lors de l'inscription :", err);
      toast.update(toastId, {
        render: err.message || 'Erreur lors de l’inscription',
        type: 'error',
        autoClose: 3000,
      });
      setMessage(err.message || 'Erreur lors de l’inscription');
    } finally {
      setTimeout(() => setMessage(null), 2000);
      setShowConfirmModal(false);
      setIsConfirming(false);
      setSelectedCourseId(null);
    }
  };

  const cancelEnroll = () => {
    setShowConfirmModal(false);
    setSelectedCourseId(null);
    setIsConfirming(false);
  };

  const closeErrorModal = () => setShowErrorModal(false);

  const handleRetry = () => {
    setError(null);
    setLoading(true);
    fetchSousFilieresAndCourses();
  };

  const resetFilters = () => {
    setSelectedSousFiliere('all');
    setSelectedLevel('all');
    setSearchTerm('');
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner" />
        <p>Chargement en cours...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <h3>Erreur de chargement</h3>
        <p>{error}</p>
        <button onClick={handleRetry}>Réessayer</button>
      </div>
    );
  }

  return (
    <div className="filiere-detail-container">
      {message && (
        <>
          <div className="success-message-backdrop" />
          <div className="success-message">
            <div>{message}</div>
          </div>
        </>
      )}

      <Modal show={showConfirmModal} onHide={cancelEnroll}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmer l’inscription</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {isConfirming ? (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CircularProgress size={24} style={{ marginRight: '10px' }} />
              <span>Inscription en cours...</span>
            </div>
          ) : (
            'Voulez-vous vraiment vous inscrire à ce cours ?'
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={cancelEnroll} disabled={isConfirming}>
            Non
          </Button>
          <Button variant="success" onClick={confirmEnroll} disabled={isConfirming}>
            Oui
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showErrorModal} onHide={closeErrorModal}>
        <Modal.Header closeButton>
          <Modal.Title>Inscription impossible</Modal.Title>
        </Modal.Header>
        <Modal.Body>Vous êtes déjà inscrit à ce cours.</Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={closeErrorModal}>
            Fermer
          </Button>
        </Modal.Footer>
      </Modal>

      <div className="filiere-header">
        <div className="header-content">
          <div className="header-text">
            <h1>{filiere.nomfiliere}</h1>
            <p className="description">{filiere.descriptionfiliere}</p>
            {userRole === 'enseignant' && (
              <Button
                className="btn-new-course"
                variant="success"
                onClick={() => setShowInsertModal(true)}
              >
                <AddCircleIcon style={{ marginRight: '8px', fontSize: '1.2rem' }} />
                Nouveau cours
              </Button>
            )}
          </div>
          <div className="header-image">
            <img
              src={filiere.imagefiliere}
              alt={filiere.nomfiliere}
              onError={(e) => (e.target.src = '/default-filiere.jpg')}
            />
          </div>
        </div>
      </div>

      <div className="filiere-content">
        <div className="niveau-filtres sous-filiere-filtres">
          <button
            type="button"
            className={
              selectedSousFiliere === 'all'
                ? 'niveau-btn niveau-btn--actif'
                : 'niveau-btn'
            }
            onClick={() => setSelectedSousFiliere('all')}
          >
            Tous
          </button>
          {sousFilieres.map((sousFiliere) => (
            <button
              key={sousFiliere._id}
              type="button"
              className={
                selectedSousFiliere === sousFiliere._id
                  ? 'niveau-btn niveau-btn--actif'
                  : 'niveau-btn'
              }
              onClick={() => setSelectedSousFiliere(sousFiliere._id)}
            >
              {sousFiliere.nomSousFiliere}
            </button>
          ))}
        </div>

        <div className="niveau-filtres">
          {niveauxDisponibles.map((niveau) => (
            <button
              key={niveau.clé}
              type="button"
              className={
                niveau.clé === selectedLevel
                  ? 'niveau-btn niveau-btn--actif'
                  : 'niveau-btn'
              }
              onClick={() => setSelectedLevel(niveau.clé)}
            >
              {niveau.label}
            </button>
          ))}
        </div>

        <div className="recherche-ligne">
          <BarreRecherche
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="🔍 Rechercher un cours..."
          />
          <button className="reset-button" onClick={resetFilters}>
            Réinitialiser
          </button>
        </div>

        <div className="cours-section">
          <h2 className="section-title">
            {filteredCours.length} Cours disponibles
            <span className="badge">{filteredCours.length}</span>
          </h2>
          <div className="cours-grid">
            {filteredCours.length > 0 ? (
              filteredCours.map((c) => {
                const normalizeNiveau = (niveau) => {
                  const niveauMap = {
                    débutant: 'debutant',
                    debutant: 'debutant',
                    Débutant: 'debutant',
                    intermédiaire: 'intermediaire',
                    intermediaire: 'intermediaire',
                    Intermédiaire: 'intermediaire',
                    avancé: 'avance',
                    avance: 'avance',
                    Avancé: 'avance',
                  };
                  return niveauMap[niveau?.toLowerCase()] || 'unknown';
                };

                return (
                  <div key={c._id} className="cours-card">
                    <div className="card-image">
                      <img
                        src={c.imagecours || '/default-image.jpg'}
                        alt={c.nomcours}
                      />
                      <span className="duree">{c.duree}</span>
                    </div>
                    <div className="card-content">
                      <h3>{c.nomcours}</h3>
                      <div className="meta">
                        <span className={`niveau ${normalizeNiveau(c.niveau)}`}>
                          {c.niveau}
                        </span>
                        <span className="contenu-count">
                          {c.contenu?.length || 0} Chapitres
                        </span>
                      </div>
                      <p className="description">
                        {c.description || 'Aucune description disponible'}
                      </p>

                      {userRole === 'etudiant' && (
                        enrolledCourses.includes(c._id) ? (
                          <button
                            className="add-button enroll-button"
                            onClick={() => navigate(`/cours/${c._id}`)}
                          >
                            <PreviewIcon /> Consulter le cours
                          </button>
                        ) : (
                          <button
                            className="add-button enroll-button"
                            onClick={() => handleEnroll(c._id)}
                          >
                            <SubscriptionsIcon /> S'inscrire
                          </button>
                        )
                      )}

                      {userRole === 'enseignant' &&
                        teacherCourses.includes(c._id) && (
                          <button
                            className="add-button enroll-button"
                            onClick={() => navigate(`/cours/${c._id}`)}
                          >
                            Gérer le cours <SettingsSuggestIcon />
                          </button>
                        )}

                      {userRole === 'visitor' && (
                        <button
                          className="add-button enroll-button"
                          onClick={() => handleEnroll(c._id)}
                        >
                          <SubscriptionsIcon /> S'inscrire
                        </button>
                      )}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="no-courses">
                <p> Aucun cours trouvé. Essayez avec d'autres critères </p>
                {userRole === 'enseignant' && (
                  <button onClick={() => setShowInsertModal(true)}>
                    Ajouter un cours
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {showInsertModal && (
        <InsertCours
          show={showInsertModal}
          handleClose={() => setShowInsertModal(false)}
          filiereId={filiereId}
          onCoursAdded={handleAddCours}
        />
      )}

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
      />
    </div>
  );
};

export default FiliereDetail;