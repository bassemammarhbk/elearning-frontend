import React, { useEffect, useState, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  getCoursByEnseignant,
  deletecours,
  editcours,
} from '../../../services/courservice';
import { getCurrentUser } from '../../../services/authservice';
import {
  PencilIcon,
  TrashIcon,
  PlusCircleIcon,
  ChatBubbleLeftRightIcon,
  AcademicCapIcon,
  DocumentTextIcon,
  CubeIcon,
  FolderIcon,
  ChartBarIcon,
} from '@heroicons/react/24/solid';
import EditCoursEnseignant from './EditCoursEnseignant';
import DeleteIcon from '@mui/icons-material/Delete';
import CancelIcon from '@mui/icons-material/Cancel';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './coursUsers.css';
import './mescours.css';

const MesCours = () => {
  const [cours, setCours] = useState([]);
  const [filieresDisponibles, setFilieresDisponibles] = useState([]);
  const [sousFilieresDisponibles, setSousFilieresDisponibles] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [selectedFiliere, setSelectedFiliere] = useState('');
  const [selectedSousFiliere, setSelectedSousFiliere] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState(null);
  const [courseToEdit, setCourseToEdit] = useState(null);
  const [imageLoaded, setImageLoaded] = useState({});
  const user = getCurrentUser();
  const navigate = useNavigate();
  const hasFetched = useRef(false);

  const [filiereWidth, setFiliereWidth] = useState('auto');
  const [sousFiliereWidth, setSousFiliereWidth] = useState('auto');
  const [levelWidth, setLevelWidth] = useState('auto');
  const textMeasureRef = useRef(null);

  const measureTextWidth = (text) => {
    if (textMeasureRef.current) {
      textMeasureRef.current.textContent = text;
      const width = textMeasureRef.current.offsetWidth + 30;
      return `${Math.min(Math.max(width, 100), 250)}px`;
    }
    return '150px';
  };

  useEffect(() => {
    const filiereText = selectedFiliere || 'Toutes les filières';
    const sousFiliereText = selectedSousFiliere || 'Toutes les sous-filières';
    const levelText = selectedLevel
      ? selectedLevel.charAt(0).toUpperCase() + selectedLevel.slice(1)
      : 'Tous les niveaux';

    setFiliereWidth(measureTextWidth(filiereText));
    setSousFiliereWidth(measureTextWidth(sousFiliereText));
    setLevelWidth(measureTextWidth(levelText));
  }, [selectedFiliere, selectedSousFiliere, selectedLevel]);

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;

    const fetchCours = async () => {
      if (!user || user.role !== 'enseignant') {
        setError("Accès non autorisé. Veuillez vous connecter en tant qu’enseignant.");
        setLoading(false);
        return;
      }
      try {
        const res = await getCoursByEnseignant(user._id);
        const données = res.data || [];
        setCours(données);

        const uniquesFilieres = Array.from(
          new Set(données.map((c) => c.sousFiliereId?.filiereId?.nomfiliere || '').filter((nom) => nom))
        );
        setFilieresDisponibles(uniquesFilieres);

        const uniquesSousFilieres = Array.from(
          new Set(données.map((c) => c.sousFiliereId?.nomSousFiliere || '').filter((nom) => nom))
        );
        setSousFilieresDisponibles(uniquesSousFilieres);
      } catch (err) {
        console.error('Erreur récupération cours :', err);
        setError('Impossible de charger les cours. Veuillez réessayer plus tard.');
      } finally {
        setLoading(false);
      }
    };
    fetchCours();
  }, []);

  useEffect(() => {
    let sousList;
    if (!selectedFiliere) {
      sousList = Array.from(
        new Set(cours.map((c) => c.sousFiliereId?.nomSousFiliere || '').filter((nom) => nom))
      );
    } else {
      const filteredByFiliere = cours.filter(
        (c) => (c.sousFiliereId?.filiereId?.nomfiliere || '') === selectedFiliere
      );
      sousList = Array.from(
        new Set(filteredByFiliere.map((c) => c.sousFiliereId?.nomSousFiliere || '').filter((nom) => nom))
      );
    }
    setSousFilieresDisponibles(sousList);
    setSelectedSousFiliere('');
  }, [selectedFiliere, cours]);

  useEffect(() => {
    if (!showModal) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') closeModal();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showModal]);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedSearch(searchTerm), 250);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  const filteredCours = useMemo(() => {
    let résultat = cours;
    if (debouncedSearch) {
      résultat = résultat.filter((c) =>
        c.nomcours.toLowerCase().includes(debouncedSearch.toLowerCase())
      );
    }
    if (selectedFiliere) {
      résultat = résultat.filter(
        (c) => c.sousFiliereId?.filiereId?.nomfiliere === selectedFiliere
      );
    }
    if (selectedSousFiliere) {
      résultat = résultat.filter(
        (c) => c.sousFiliereId?.nomSousFiliere === selectedSousFiliere
      );
    }
    if (selectedLevel) {
      résultat = résultat.filter((c) => c.niveau === selectedLevel);
    }
    return résultat;
  }, [cours, debouncedSearch, selectedFiliere, selectedSousFiliere, selectedLevel]);

  const dashboardStats = useMemo(() => {
    const totalModules = cours.reduce((acc, c) => acc + (c.contenu?.length || 0), 0);
    const niveauxCount = {
      debutant: cours.filter((c) => c.niveau === "debutant").length,
      intermediaire: cours.filter((c) => c.niveau === "intermediaire").length,
      avancé: cours.filter((c) => c.niveau === "avancé").length,
    };
    return {
      totalCours: cours.length,
      totalModules,
      filieresCount: filieresDisponibles.length,
      niveauxCount,
    };
  }, [cours, filieresDisponibles]);

  const handleEditCourse = (courseId) => {
    const course = cours.find((c) => c._id === courseId);
    setCourseToEdit(course);
  };

  const handleUpdateCours = async (updatedCourse) => {
    try {
      await editcours(updatedCourse);
      setCours((prev) =>
        prev.map((c) => (c._id === updatedCourse._id ? updatedCourse : c))
      );
      setCourseToEdit(null);
      toast.success('Cours mis à jour avec succès !');
    } catch (err) {
      console.error('Erreur mise à jour :', err);
      toast.error('Erreur lors de la mise à jour du cours.');
    }
  };

  const handleDeleteCourse = async () => {
    try {
      await deletecours(courseToDelete);
      setCours((prev) => prev.filter((c) => c._id !== courseToDelete));
      setShowModal(false);
      toast.success('Cours supprimé avec succès !');
    } catch (err) {
      console.error('Erreur suppression :', err);
      toast.error('Erreur lors de la suppression du cours.');
    }
  };

  const handleManageCourse = (courseId) => navigate(`/cours/${courseId}`);
  const handleForumNavigation = (courseId) => navigate(`/cours/${courseId}/forum`);
  const openModal = (courseId) => {
    setCourseToDelete(courseId);
    setShowModal(true);
  };
  const closeModal = () => {
    setShowModal(false);
    setCourseToDelete(null);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Chargement des cours...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <h3>Erreur</h3>
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>Réessayer</button>
      </div>
    );
  }

  return (
    <div className="mes-cours-container">
      <span
        ref={textMeasureRef}
        style={{
          position: 'absolute',
          visibility: 'hidden',
          whiteSpace: 'nowrap',
          fontSize: '14px',
          fontFamily: 'inherit',
          padding: '8px 12px',
        }}
      />
      <div className="mcd-dashboard-header">
        <div className="mcd-header-content">
          <h1 className="mcd-main-title">
            <AcademicCapIcon className="mcd-title-icon" />
            Tableau de Bord - Mes Cours
          </h1>
          <p className="mcd-subtitle">Gérez et suivez vos cours en temps réel</p>
        </div>
        <div className="mcd-header-actions">
          <button className="mcd-create-course-btn" onClick={() => navigate("/filieres")}>
            <PlusCircleIcon className="mcd-btn-icon" />
            Nouveau Cours
          </button>
        </div>
      </div>

      <div className="mcd-stats-grid">
        <div className="mcd-stat-card mcd-stat-primary">
          <div className="mcd-stat-icon-container">
            <DocumentTextIcon className="mcd-stat-icon mcd-stat-icon-document" />
          </div>
          <div className="mcd-stat-content">
            <div className="mcd-stat-number">{dashboardStats.totalCours}</div>
            <div className="mcd-stat-label">Cours Créés</div>
          </div>
          <div className="mcd-stat-trend">
            <ChartBarIcon className="mcd-trend-icon" />
          </div>
        </div>
        <div className="mcd-stat-card mcd-stat-secondary">
          <div className="mcd-stat-icon-container">
            <CubeIcon className="mcd-stat-icon mcd-stat-icon-cube" />
          </div>
          <div className="mcd-stat-content">
            <div className="mcd-stat-number">{dashboardStats.totalModules}</div>
            <div className="mcd-stat-label">Chapitres Totaux</div>
          </div>
          <div className="mcd-stat-trend">
            <ChartBarIcon className="mcd-trend-icon" />
          </div>
        </div>
        <div className="mcd-stat-card mcd-stat-success">
          <div className="mcd-stat-icon-container">
            <FolderIcon className="mcd-stat-icon mcd-stat-icon-folder" />
          </div>
          <div className="mcd-stat-content">
            <div className="mcd-stat-number">{dashboardStats.filieresCount}</div>
            <div className="mcd-stat-label">Filières</div>
          </div>
          <div className="mcd-stat-trend">
            <ChartBarIcon className="mcd-trend-icon" />
          </div>
        </div>
      </div>
      <h2 className="mes-cours-filters-title">
        Rechercher ou appliquer des filtres
      </h2>
      <div className="mes-cours-controls">
        <input
          type="text"
          placeholder="🔍 Rechercher un cours..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="mes-cours-search"
          aria-label="Rechercher un cours"
        />
        <select
          value={selectedFiliere}
          onChange={(e) => setSelectedFiliere(e.target.value)}
          className="mes-cours-filter"
          style={{ width: filiereWidth }}
          aria-label="Filtrer par filière"
        >
          <option value="">Toutes les filières</option>
          {filieresDisponibles.map((nom) => (
            <option key={nom} value={nom}>
              {nom}
            </option>
          ))}
        </select>
        <select
          value={selectedSousFiliere}
          onChange={(e) => setSelectedSousFiliere(e.target.value)}
          className="mes-cours-filter"
          style={{ width: sousFiliereWidth }}
          aria-label="Filtrer par sous-filière"
        >
          <option value="">Toutes les sous-filières</option>
          {sousFilieresDisponibles.map((nom) => (
            <option key={nom} value={nom}>
              {nom}
            </option>
          ))}
        </select>
        <select
          value={selectedLevel}
          onChange={(e) => setSelectedLevel(e.target.value)}
          className="mes-cours-filter"
          style={{ width: levelWidth }}
          aria-label="Filtrer par niveau"
        >
          <option value="">Tous les niveaux</option>
          <option value="debutant">Débutant</option>
          <option value="intermediaire">Intermédiaire</option>
          <option value="avancé">Avancé</option>
        </select>
      </div>
      <h2 className="mes-cours-found-title">
        Résultats de recherche/filtres
      </h2>
      <p className="mes-cours-count">
        {filteredCours.length} cours trouvé{filteredCours.length > 1 ? 's' : ''}
      </p>
      {filteredCours.length === 0 ? (
        <div className="no-cours">
          <p className="no-cours-message">
            {debouncedSearch || selectedLevel || selectedFiliere || selectedSousFiliere
              ? 'Aucun cours ne correspond à vos critères.'
              : 'Vous n’avez encore créé aucun cours.'}
          </p>
          <button className="no-cours-button" onClick={() => navigate('/filieres')}>
            <PlusCircleIcon className="icon-small" aria-hidden="true" />
            Créer un nouveau cours
          </button>
        </div>
      ) : (
        <div className="mes-cours-grid">
          {filteredCours.map((coursItem) => (
            <div className="mes-cours-card" key={coursItem._id}>
              <div className="mes-cours-card-header">
                <img
                  src={coursItem.imagecours || '/default-course-image.jpg'}
                  alt={coursItem.nomcours}
                  className={`mes-cours-card-image ${imageLoaded[coursItem._id] ? 'loaded' : ''}`}
                  loading="lazy"
                  onLoad={() => setImageLoaded((prev) => ({ ...prev, [coursItem._id]: true }))}
                />
                <h3 className="mes-cours-card-title">{coursItem.nomcours}</h3>
              </div>
              <p className="mes-cours-card-desc">
                {coursItem.description?.substring(0, 100) || 'Aucune description disponible'}
                {coursItem.description?.length > 100 && '...'}
              </p>
              <p className="mes-cours-card-level">
                🎯 <strong>Niveau :</strong> {coursItem.niveau || 'Non spécifié'}
              </p>
              <p className="mes-cours-card-modules">
                📚 <strong>{coursItem.contenu?.length || 0}</strong> chapitres
              </p>
              <p className="mes-cours-card-info">
                🏷️ <strong>Filière :</strong>{' '}
                {coursItem.sousFiliereId?.filiereId?.nomfiliere || 'Non rattachée'}
              </p>
              <div className="mes-cours-card-actions">
                <div className="mes-cours-action-row">
                  <button
                    className="mes-cours-edit-btn"
                    onClick={() => handleEditCourse(coursItem._id)}
                    aria-label={`Modifier le cours ${coursItem.nomcours}`}
                  >
                    <PencilIcon className="icon-small" />
                    Modifier
                  </button>
                  <button
                    className="mes-cours-delete-btn"
                    onClick={() => openModal(coursItem._id)}
                    aria-label={`Supprimer le cours ${coursItem.nomcours}`}
                  >
                    <TrashIcon className="icon-small" />
                    Supprimer
                  </button>
                </div>
                <div className="mes-cours-action-row">
                  <button
                    className="mes-cours-manage-btn"
                    onClick={() => handleManageCourse(coursItem._id)}
                    aria-label={`Gérer le contenu du cours ${coursItem.nomcours}`}
                  >
                    <AcademicCapIcon className="icon-small" />
                    Gérer le contenu
                  </button>
                  <button
                    className="mes-cours-forum-btn"
                    onClick={() => handleForumNavigation(coursItem._id)}
                    aria-label={`Accéder au forum du cours ${coursItem.nomcours}`}
                  >
                    <ChatBubbleLeftRightIcon className="icon-small" />
                    Forum
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      {showModal && (
        <div
          className="modal-suppr-overlay"
          onClick={closeModal}
          role="dialog"
          aria-labelledby="modal-title"
        >
          <div className="modal-suppr-content" onClick={(e) => e.stopPropagation()}>
            <h2 id="modal-title">Confirmer la suppression</h2>
            <p>Êtes-vous sûr de vouloir supprimer ce cours ?</p>
            <div className="modal-suppr-actions">
              <button className="btn-confirm" onClick={handleDeleteCourse}>
                <DeleteIcon /> Supprimer
              </button>
              <button className="btn-cancel" onClick={closeModal}>
                <CancelIcon /> Annuler
              </button>
            </div>
          </div>
        </div>
      )}
      {courseToEdit && (
        <EditCoursEnseignant
          show={true}
          handleClose={() => setCourseToEdit(null)}
          course={courseToEdit}
          handleUpdateCours={handleUpdateCours}
        />
      )}
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} closeOnClick pauseOnHover />
    </div>
  );
};

export default MesCours;