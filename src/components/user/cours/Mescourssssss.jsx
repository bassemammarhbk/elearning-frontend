"use client"

import { useEffect, useState, useMemo, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { getCoursByEnseignant, deletecours, editcours } from "../../../services/courservice"
import { getCurrentUser } from "../../../services/authservice"
import {
  PencilIcon,
  TrashIcon,
  PlusCircleIcon,
  CogIcon,
  ChatBubbleLeftRightIcon,
  AcademicCapIcon,
  BookOpenIcon,
  UsersIcon,
  ChartBarIcon,
} from "@heroicons/react/24/solid"
import EditCoursEnseignant from "./EditCoursEnseignant"
import DeleteIcon from "@mui/icons-material/Delete"
import CancelIcon from "@mui/icons-material/Cancel"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import "./mes-cours-dashboard.css"

const MesCours = () => {
  const [cours, setCours] = useState([])
  const [filieresDisponibles, setFilieresDisponibles] = useState([])
  const [sousFilieresDisponibles, setSousFilieresDisponibles] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [debouncedSearch, setDebouncedSearch] = useState("")
  const [selectedFiliere, setSelectedFiliere] = useState("")
  const [selectedSousFiliere, setSelectedSousFiliere] = useState("")
  const [selectedLevel, setSelectedLevel] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [courseToDelete, setCourseToDelete] = useState(null)
  const [courseToEdit, setCourseToEdit] = useState(null)
  const [imageLoaded, setImageLoaded] = useState({})
  const user = getCurrentUser()
  const navigate = useNavigate()
  const hasFetched = useRef(false)

  // State for dropdown widths
  const [filiereWidth, setFiliereWidth] = useState("auto")
  const [sousFiliereWidth, setSousFiliereWidth] = useState("auto")
  const [levelWidth, setLevelWidth] = useState("auto")

  // Ref for hidden span to measure text width
  const textMeasureRef = useRef(null)

  // Function to measure text width
  const measureTextWidth = (text) => {
    if (textMeasureRef.current) {
      textMeasureRef.current.textContent = text
      const width = textMeasureRef.current.offsetWidth + 30
      return `${Math.min(Math.max(width, 100), 250)}px`
    }
    return "150px"
  }

  // Update widths when selections change
  useEffect(() => {
    const filiereText = selectedFiliere || "Toutes les filières"
    const sousFiliereText = selectedSousFiliere || "Toutes les sous-filières"
    const levelText = selectedLevel
      ? selectedLevel.charAt(0).toUpperCase() + selectedLevel.slice(1)
      : "Tous les niveaux"

    setFiliereWidth(measureTextWidth(filiereText))
    setSousFiliereWidth(measureTextWidth(sousFiliereText))
    setLevelWidth(measureTextWidth(levelText))
  }, [selectedFiliere, selectedSousFiliere, selectedLevel])

  /* 1) Récupération initiale */
  useEffect(() => {
    if (hasFetched.current) return
    hasFetched.current = true

    const fetchCours = async () => {
      if (!user || user.role !== "enseignant") {
        setError("Accès non autorisé. Veuillez vous connecter en tant qu'enseignant.")
        setLoading(false)
        return
      }
      try {
        const res = await getCoursByEnseignant(user._id)
        const données = res.data || []
        console.log("Cours enseignant :", données)
        setCours(données)

        const uniquesFilieres = Array.from(
          new Set(données.map((c) => c.sousFiliereId?.filiereId?.nomfiliere || "").filter((nom) => nom)),
        )
        setFilieresDisponibles(uniquesFilieres)
        console.log("Filières extraites :", uniquesFilieres)

        const uniquesSousFilieres = Array.from(
          new Set(données.map((c) => c.sousFiliereId?.nomSousFiliere || "").filter((nom) => nom)),
        )
        setSousFilieresDisponibles(uniquesSousFilieres)
        console.log("Sous-filières extraites :", uniquesSousFilieres)
      } catch (err) {
        console.error("Erreur récupération cours :", err)
        setError("Impossible de charger les cours. Veuillez réessayer plus tard.")
      } finally {
        setLoading(false)
      }
    }
    fetchCours()
  }, [])

  /* 2) Mise à jour des sous-filières disponibles */
  useEffect(() => {
    let sousList
    if (!selectedFiliere) {
      sousList = Array.from(new Set(cours.map((c) => c.sousFiliereId?.nomSousFiliere || "").filter((nom) => nom)))
    } else {
      const filteredByFiliere = cours.filter((c) => (c.sousFiliereId?.filiereId?.nomfiliere || "") === selectedFiliere)
      sousList = Array.from(
        new Set(filteredByFiliere.map((c) => c.sousFiliereId?.nomSousFiliere || "").filter((nom) => nom)),
      )
    }
    setSousFilieresDisponibles(sousList)
    setSelectedSousFiliere("")
  }, [selectedFiliere, cours])

  useEffect(() => {
    if (!showModal) return

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        closeModal()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => {
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [showModal])

  /* 3) Debounce sur la recherche */
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedSearch(searchTerm), 250)
    return () => clearTimeout(handler)
  }, [searchTerm])

  /* 4) Filtrage mémoïsé */
  const filteredCours = useMemo(() => {
    let résultat = cours
    if (debouncedSearch) {
      résultat = résultat.filter((c) => c.nomcours.toLowerCase().includes(debouncedSearch.toLowerCase()))
    }
    if (selectedFiliere) {
      résultat = résultat.filter((c) => c.sousFiliereId?.filiereId?.nomfiliere === selectedFiliere)
    }
    if (selectedSousFiliere) {
      résultat = résultat.filter((c) => c.sousFiliereId?.nomSousFiliere === selectedSousFiliere)
    }
    if (selectedLevel) {
      résultat = résultat.filter((c) => c.niveau === selectedLevel)
    }
    return résultat
  }, [cours, debouncedSearch, selectedFiliere, selectedSousFiliere, selectedLevel])

  // Calcul des statistiques
  const dashboardStats = useMemo(() => {
    const totalModules = cours.reduce((acc, c) => acc + (c.contenu?.length || 0), 0)
    const niveauxCount = {
      debutant: cours.filter((c) => c.niveau === "debutant").length,
      intermediaire: cours.filter((c) => c.niveau === "intermediaire").length,
      avancé: cours.filter((c) => c.niveau === "avancé").length,
    }
    const filieresCount = filieresDisponibles.length

    return {
      totalCours: cours.length,
      totalModules,
      filieresCount,
      niveauxCount,
    }
  }, [cours, filieresDisponibles])

  /* Gestion édition, suppression, navigation */
  const handleEditCourse = (courseId) => {
    const course = cours.find((c) => c._id === courseId)
    setCourseToEdit(course)
  }

  const handleUpdateCours = async (updatedCourse) => {
    try {
      await editcours(updatedCourse)
      setCours((prev) => prev.map((c) => (c._id === updatedCourse._id ? updatedCourse : c)))
      setCourseToEdit(null)
      toast.success("Cours mis à jour avec succès !")
    } catch (err) {
      console.error("Erreur mise à jour :", err)
      toast.error("Erreur lors de la mise à jour du cours.")
    }
  }

  const handleDeleteCourse = async () => {
    try {
      await deletecours(courseToDelete)
      setCours((prev) => prev.filter((c) => c._id !== courseToDelete))
      setShowModal(false)
      toast.success("Cours supprimé avec succès !")
    } catch (err) {
      console.error("Erreur suppression :", err)
      toast.error("Erreur lors de la suppression du cours.")
    }
  }

  const handleManageCourse = (courseId) => {
    navigate(`/cours/${courseId}`)
  }
  const handleForumNavigation = (courseId) => {
    navigate(`/cours/${courseId}/forum`)
  }
  const openModal = (courseId) => {
    setCourseToDelete(courseId)
    setShowModal(true)
  }
  const closeModal = () => {
    setShowModal(false)
    setCourseToDelete(null)
  }

  if (loading) {
    return (
      <div className="mcd-loading-container">
        <div className="mcd-spinner"></div>
        <p className="mcd-loading-text">Chargement des cours...</p>
      </div>
    )
  }
  if (error) {
    return (
      <div className="mcd-error-container">
        <h3 className="mcd-error-title">Erreur</h3>
        <p className="mcd-error-message">{error}</p>
        <button className="mcd-error-retry" onClick={() => window.location.reload()}>
          Réessayer
        </button>
      </div>
    )
  }

  return (
    <div className="mcd-dashboard-container">
      <span ref={textMeasureRef} className="mcd-text-measure" />

      {/* Header Dashboard */}
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

      {/* Dashboard Stats */}
      <div className="mcd-stats-grid">
        <div className="mcd-stat-card mcd-stat-primary">
          <div className="mcd-stat-icon-container">
            <BookOpenIcon className="mcd-stat-icon" />
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
            <CogIcon className="mcd-stat-icon" />
          </div>
          <div className="mcd-stat-content">
            <div className="mcd-stat-number">{dashboardStats.totalModules}</div>
            <div className="mcd-stat-label">Modules Totaux</div>
          </div>
          <div className="mcd-stat-trend">
            <ChartBarIcon className="mcd-trend-icon" />
          </div>
        </div>

        <div className="mcd-stat-card mcd-stat-success">
          <div className="mcd-stat-icon-container">
            <UsersIcon className="mcd-stat-icon" />
          </div>
          <div className="mcd-stat-content">
            <div className="mcd-stat-number">{dashboardStats.filieresCount}</div>
            <div className="mcd-stat-label">Filières</div>
          </div>
          <div className="mcd-stat-trend">
            <ChartBarIcon className="mcd-trend-icon" />
          </div>
        </div>

        <div className="mcd-stat-card mcd-stat-warning">
          <div className="mcd-stat-icon-container">
            <AcademicCapIcon className="mcd-stat-icon" />
          </div>
          <div className="mcd-stat-content">
            <div className="mcd-stat-number">{Math.max(...Object.values(dashboardStats.niveauxCount))}</div>
            <div className="mcd-stat-label">Niveau Populaire</div>
          </div>
          <div className="mcd-stat-trend">
            <ChartBarIcon className="mcd-trend-icon" />
          </div>
        </div>
      </div>

      {/* Filtres et Contrôles */}
      <div className="mcd-controls-section">
        <div className="mcd-controls-header">
          <h2 className="mcd-controls-title">Filtrer et Rechercher</h2>
          <div className="mcd-results-count">
            {filteredCours.length} cours trouvé{filteredCours.length > 1 ? "s" : ""}
          </div>
        </div>

        <div className="mcd-controls-grid">
          <div className="mcd-search-container">
            <input
              type="text"
              placeholder="🔍 Rechercher un cours..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="mcd-search-input"
              aria-label="Rechercher un cours"
            />
          </div>

          <select
            value={selectedFiliere}
            onChange={(e) => setSelectedFiliere(e.target.value)}
            className="mcd-filter-select"
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
            className="mcd-filter-select"
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
            className="mcd-filter-select"
            style={{ width: levelWidth }}
            aria-label="Filtrer par niveau"
          >
            <option value="">Tous les niveaux</option>
            <option value="debutant">Débutant</option>
            <option value="intermediaire">Intermédiaire</option>
            <option value="avancé">Avancé</option>
          </select>
        </div>
      </div>

      {/* Contenu Principal */}
      {filteredCours.length === 0 ? (
        <div className="mcd-empty-state">
          <div className="mcd-empty-icon">
            <BookOpenIcon />
          </div>
          <h3 className="mcd-empty-title">
            {debouncedSearch || selectedLevel || selectedFiliere || selectedSousFiliere
              ? "Aucun cours ne correspond à vos critères."
              : "Vous n'avez encore créé aucun cours."}
          </h3>
          <p className="mcd-empty-description">
            Commencez par créer votre premier cours pour enrichir votre plateforme d'apprentissage.
          </p>
          <button className="mcd-empty-action" onClick={() => navigate("/filieres")}>
            <PlusCircleIcon className="mcd-btn-icon" />
            Créer un nouveau cours
          </button>
        </div>
      ) : (
        <div className="mcd-courses-section">
          <div className="mcd-courses-header">
            <h2 className="mcd-courses-title">Vos Cours</h2>
            <div className="mcd-view-options">{/* Ici on pourrait ajouter des options de vue (grille/liste) */}</div>
          </div>

          <div className="mcd-courses-grid">
            {filteredCours.map((coursItem) => (
              <div className="mcd-course-card" key={coursItem._id}>
                <div className="mcd-course-header">
                  <div className="mcd-course-image-container">
                    <img
                      src={coursItem.imagecours || "/default-course-image.jpg"}
                      alt={coursItem.nomcours}
                      className={`mcd-course-image ${imageLoaded[coursItem._id] ? "mcd-image-loaded" : ""}`}
                      loading="lazy"
                      onLoad={() =>
                        setImageLoaded((prev) => ({
                          ...prev,
                          [coursItem._id]: true,
                        }))
                      }
                    />
                    <div className="mcd-course-level-badge">{coursItem.niveau || "Non spécifié"}</div>
                  </div>
                  <h3 className="mcd-course-title">{coursItem.nomcours}</h3>
                </div>

                <div className="mcd-course-content">
                  <p className="mcd-course-description">
                    {coursItem.description?.substring(0, 120) || "Aucune description disponible"}
                    {coursItem.description?.length > 120 && "..."}
                  </p>

                  <div className="mcd-course-meta">
                    <div className="mcd-meta-item">
                      <BookOpenIcon className="mcd-meta-icon" />
                      <span>{coursItem.contenu?.length || 0} modules</span>
                    </div>
                    <div className="mcd-meta-item">
                      <AcademicCapIcon className="mcd-meta-icon" />
                      <span>{coursItem.sousFiliereId?.filiereId?.nomfiliere || "Non rattachée"}</span>
                    </div>
                  </div>
                </div>

                <div className="mcd-course-actions">
                  <div className="mcd-primary-actions">
                    <button
                      className="mcd-action-btn mcd-edit-btn"
                      onClick={() => handleEditCourse(coursItem._id)}
                      aria-label={`Modifier le cours ${coursItem.nomcours}`}
                    >
                      <PencilIcon className="mcd-action-icon" />
                      Modifier
                    </button>
                    <button
                      className="mcd-action-btn mcd-manage-btn"
                      onClick={() => handleManageCourse(coursItem._id)}
                      aria-label={`Gérer le contenu du cours ${coursItem.nomcours}`}
                    >
                      <CogIcon className="mcd-action-icon" />
                      Gérer
                    </button>
                  </div>

                  <div className="mcd-secondary-actions">
                    <button
                      className="mcd-action-btn mcd-forum-btn"
                      onClick={() => handleForumNavigation(coursItem._id)}
                      aria-label={`Accéder au forum du cours ${coursItem.nomcours}`}
                    >
                      <ChatBubbleLeftRightIcon className="mcd-action-icon" />
                      Forum
                    </button>
                    <button
                      className="mcd-action-btn mcd-delete-btn"
                      onClick={() => openModal(coursItem._id)}
                      aria-label={`Supprimer le cours ${coursItem.nomcours}`}
                    >
                      <TrashIcon className="mcd-action-icon" />
                      Supprimer
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal de Suppression */}
      {showModal && (
        <div className="mcd-modal-overlay" onClick={closeModal} role="dialog" aria-labelledby="mcd-modal-title">
          <div className="mcd-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="mcd-modal-header">
              <h2 id="mcd-modal-title" className="mcd-modal-title">
                Confirmer la suppression
              </h2>
            </div>
            <div className="mcd-modal-body">
              <p className="mcd-modal-message">
                Êtes-vous sûr de vouloir supprimer ce cours ? Cette action est irréversible.
              </p>
            </div>
            <div className="mcd-modal-actions">
              <button className="mcd-modal-btn mcd-confirm-btn" onClick={handleDeleteCourse}>
                <DeleteIcon className="mcd-modal-icon" />
                Supprimer
              </button>
              <button className="mcd-modal-btn mcd-cancel-btn" onClick={closeModal}>
                <CancelIcon className="mcd-modal-icon" />
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal d'Édition */}
      {courseToEdit && (
        <EditCoursEnseignant
          show={true}
          handleClose={() => setCourseToEdit(null)}
          course={courseToEdit}
          handleUpdateCours={handleUpdateCours}
        />
      )}

      <ToastContainer position="top-right" autoClose={3000} className="mcd-toast-container" />
    </div>
  )
}

export default MesCours
