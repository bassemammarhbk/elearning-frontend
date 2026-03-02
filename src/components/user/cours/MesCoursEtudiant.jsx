"use client"

import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { getStudentDetails } from "../../../services/courservice"
import { getCurrentUser } from "../../../services/authservice"
import { EyeIcon, ChatBubbleLeftRightIcon } from "@heroicons/react/24/solid"
import { toast, ToastContainer } from "react-toastify"
import NotificationImportantIcon from "@mui/icons-material/NotificationImportant"
import MenuBookIcon from "@mui/icons-material/MenuBook"
import PreviewIcon from "@mui/icons-material/Preview"
import "react-toastify/dist/ReactToastify.css"
import "./etudiant.css"
import "./dashboard-stats.css"

// Liste des niveaux disponibles pour le filtrage
const niveauxDisponibles = [
  { clé: "all", label: "Tous les niveaux" },
  { clé: "debutant", label: "Débutant" },
  { clé: "intermediaire", label: "Intermédiaire" },
  { clé: "avancé", label: "Avancé" },
]

const MesCoursEtudiant = () => {
  const [cours, setCours] = useState([])
  const [chapitresCompletes, setChapitresCompletes] = useState([])
  const [filteredCours, setFilteredCours] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [points, setPoints] = useState(0)
  const [successfulTests, setSuccessfulTests] = useState(0)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedLevel, setSelectedLevel] = useState("all")
  const [selectedFiliere, setSelectedFiliere] = useState("all")
  const [selectedSousFiliere, setSelectedSousFiliere] = useState("all")
  const [filieresDisponibles, setFilieresDisponibles] = useState([])
  const [availableSousFilieres, setAvailableSousFilieres] = useState([])

  const user = getCurrentUser()
  const navigate = useNavigate()

  // Récupération des cours inscrits et initialisation des filtres
  useEffect(() => {
    const fetchCours = async () => {
      if (!user || user.role !== "etudiant") {
        const errorMsg = "Accès non autorisé. Veuillez vous connecter en tant qu'étudiant."
        setError(errorMsg)
        toast.error(errorMsg)
        setLoading(false)
        return
      }

      try {
        const res = await getStudentDetails(user._id)
        if (!res || !res.coursInscri) {
          const errorMsg = "Aucun cours inscrit trouvé. Essayez de vous réinscrire."
          setError(errorMsg)
          toast.error(errorMsg)
          setCours([])
          setFilteredCours([])
        } else {
          const inscrit = res.coursInscri
          console.log("Cours inscrits :", inscrit)
          setCours(inscrit)
          setChapitresCompletes(res.chapitresCompletes || [])
          setFilteredCours(inscrit)
          setPoints(res.points || 0)
          setSuccessfulTests(res.finalTestsReussis?.length || 0)

          // Extraction des filières uniques via sousFiliereId.filiereId
          const uniqueFilieres = Array.from(
            new Set(inscrit.map((c) => c.sousFiliereId?.filiereId?.nomfiliere || "Non rattachée").filter(Boolean)),
          )
          setFilieresDisponibles(["all", ...uniqueFilieres])
          console.log("Filières extraites :", uniqueFilieres)

          // Extraction des sous-filières uniques
          const uniqueSous = Array.from(
            new Set(inscrit.map((c) => c.sousFiliereId?.nomSousFiliere || "Non rattachée").filter(Boolean)),
          )
          setAvailableSousFilieres(["all", ...uniqueSous])
        }
      } catch (err) {
        console.error("Erreur lors de la récupération des cours:", err)
        const errorMsg = "Impossible de charger les cours. Veuillez réessayer plus tard."
        setError(errorMsg)
        toast.error(errorMsg)
      } finally {
        setLoading(false)
      }
    }

    fetchCours()
  }, [user._id])

  // Mise à jour des sous-filières disponibles lorsque la filière sélectionnée change
  useEffect(() => {
    let sousList

    if (selectedFiliere === "all") {
      sousList = Array.from(
        new Set(cours.map((c) => c.sousFiliereId?.nomSousFiliere || "Non rattachée").filter(Boolean)),
      )
    } else {
      const filteredByFiliere = cours.filter(
        (c) => (c.sousFiliereId?.filiereId?.nomfiliere || "Non rattachée") === selectedFiliere,
      )
      sousList = Array.from(
        new Set(filteredByFiliere.map((c) => c.sousFiliereId?.nomSousFiliere || "Non rattachée").filter(Boolean)),
      )
    }

    setAvailableSousFilieres(["all", ...sousList])
    setSelectedSousFiliere("all")
  }, [selectedFiliere, cours])

  // Filtrage combiné : recherche + filière + sous-filière + niveau
  useEffect(() => {
    let résultat = [...cours]

    // Filtre par filière via sousFiliereId.filiereId
    if (selectedFiliere !== "all") {
      résultat = résultat.filter((c) => (c.sousFiliereId?.filiereId?.nomfiliere || "Non rattachée") === selectedFiliere)
    }

    // Filtre par sous-filière
    if (selectedSousFiliere !== "all") {
      résultat = résultat.filter((c) => (c.sousFiliereId?.nomSousFiliere || "Non rattachée") === selectedSousFiliere)
    }

    // Filtre par niveau
    if (selectedLevel !== "all") {
      résultat = résultat.filter((c) => c.niveau.toLowerCase() === selectedLevel.toLowerCase())
    }

    // Filtre par terme de recherche
    if (searchTerm.trim() !== "") {
      résultat = résultat.filter((c) => c.nomcours.toLowerCase().includes(searchTerm.trim().toLowerCase()))
    }

    setFilteredCours(résultat)
  }, [selectedFiliere, selectedSousFiliere, selectedLevel, searchTerm, cours])

  // Calcul de la progression du cours
  const calculateProgress = (coursId) => {
    const totalChapitres = cours.find((c) => c._id === coursId)?.contenu?.length || 0
    const completedChapitres = chapitresCompletes.filter((chap) => chap.coursId === coursId).length
    return totalChapitres > 0 ? Math.round((completedChapitres / totalChapitres) * 100) : 0
  }

  // Navigation vers le forum
  const handleForumNavigation = (coursId) => {
    navigate(`/cours/${coursId}/forum`)
  }

  // Fonction de réinitialisation des filtres
  const resetFilters = () => {
    setSelectedFiliere("all")
    setSelectedSousFiliere("all")
    setSelectedLevel("all")
    setSearchTerm("")
  }

  if (loading) {
    return (
      <div className="mec-etudiant-loading-container">
        <div className="mec-etudiant-loading-spinner"></div>
        <p>Chargement des cours...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="mec-etudiant-no-courses">
        <h3>Erreur</h3>
        <p>{error}</p>
        <button className="mec-etudiant-button" onClick={() => window.location.reload()}>
          Réessayer
        </button>
      </div>
    )
  }

  const completedCourses = cours.filter((c) => calculateProgress(c._id) === 100).length
  const totalModules = cours.reduce((acc, c) => acc + (c.contenu?.length || 0), 0)

  return (
    <div className="mec-etudiant-page-container">
      <div className="mec-etudiant-page-header">
        <h2 className="mec-etudiant-page-title">🎓 Mes Cours Inscrits</h2>
      </div>

      {/* Section Dashboard des Statistiques */}
      <div className="dashboard-stats-wrapper">
        <div className="dashboard-stats-header">
          <h1 className="dashboard-stats-title">Votre Tableau de Bord</h1>
          <p className="dashboard-stats-subtitle">
            Suivez votre progression et vos accomplissements dans votre parcours d'apprentissage
          </p>
        </div>

        <div className="dashboard-stats-grid">
          {/* Cours en cours */}
          <div className="dashboard-stat-card dashboard-stat-card--courses" tabIndex="0">
            <div className="dashboard-stat-header">
              <div className="dashboard-stat-icon dashboard-stat-icon--courses">📚</div>
            </div>
            <div className="dashboard-stat-number dashboard-stat-number--courses">{cours.length}</div>
            <div className="dashboard-stat-label">Cours Inscrits</div>
            <div className="dashboard-stat-description">Cours actuellement suivis</div>
          </div>

          {/* Cours terminés */}
          <div className="dashboard-stat-card dashboard-stat-card--completed" tabIndex="0">
            <div className="dashboard-stat-header">
              <div className="dashboard-stat-icon dashboard-stat-icon--completed">✅</div>
            </div>
            <div className="dashboard-stat-number dashboard-stat-number--completed">{completedCourses}</div>
            <div className="dashboard-stat-label">Cours Terminés</div>
            <div className="dashboard-stat-description">Cours complétés à 100%</div>
          </div>

          {/* Points obtenus */}
          <div className="dashboard-stat-card dashboard-stat-card--points" tabIndex="0">
            <div className="dashboard-stat-header">
              <div className="dashboard-stat-icon dashboard-stat-icon--points">🏆</div>
            </div>
            <div className="dashboard-stat-number dashboard-stat-number--points">{points}</div>
            <div className="dashboard-stat-label">Points Obtenus</div>
            <div className="dashboard-stat-description">Points d'expérience accumulés</div>
          </div>

          {/* Tests réussis */}
          <div className="dashboard-stat-card dashboard-stat-card--tests" tabIndex="0">
            <div className="dashboard-stat-header">
              <div className="dashboard-stat-icon dashboard-stat-icon--tests">🎯</div>
            </div>
            <div className="dashboard-stat-number dashboard-stat-number--tests">{successfulTests}</div>
            <div className="dashboard-stat-label">Tests Réussis</div>
            <div className="dashboard-stat-description">Évaluations finales validées</div>
          </div>
        </div>
      </div>

      {/* Conseils d'apprentissage */}
      <div className="tips-section">
        <NotificationImportantIcon />
        <h2>Conseils pour un apprentissage efficace</h2>
        <div className="grid-2-cols">
          <div className="tip-item">
            <div className="tip-icon">
              <i className="fas fa-clock"></i>
            </div>
            <div className="tip-content">
              <h3>Établissez un horaire régulier</h3>
              <p>Consacrez du temps chaque jour à vos études. La constance est la clé d'un apprentissage durable.</p>
            </div>
          </div>
          <div className="tip-item">
            <div className="tip-icon">
              <i className="fas fa-tasks"></i>
            </div>
            <div className="tip-content">
              <h3>Fixez-vous des objectifs clairs</h3>
              <p>Définissez ce que vous souhaitez accomplir à court et à long terme pour rester motivé.</p>
            </div>
          </div>
          <div className="tip-item">
            <div className="tip-icon">
              <i className="fas fa-brain"></i>
            </div>
            <div className="tip-content">
              <h3>Pratiquez l'apprentissage actif</h3>
              <p>
                Participez activement à votre apprentissage en prenant des notes, en posant des questions et en
                appliquant vos connaissances.
              </p>
            </div>
          </div>
          <div className="tip-item">
            <div className="tip-icon">
              <i className="fas fa-users"></i>
            </div>
            <div className="tip-content">
              <h3>Rejoignez le forum</h3>
              <p>Collaborez avec d'autres étudiants pour partager des idées et résoudre des problèmes ensemble.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mec-etudiant-intro">
        <center>
          <h3>
            Voici vos cours inscrits <MenuBookIcon />
          </h3>
        </center>
      </div>

      {/* Filtres et Recherche */}
      <div className="filters-container">
        {/* Barre de recherche */}
        <div className="barre-recherche-wrapper">
          <input
            type="text"
            placeholder="🔍 Rechercher un cours..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            aria-label="Rechercher un cours"
            className="barre-recherche"
          />
        </div>

        {/* Filtre par filière */}
        <div className="filiere-filtres">
          {filieresDisponibles.map((nom) => (
            <button
              key={nom}
              type="button"
              className={nom === selectedFiliere ? "filiere-btn filiere-btn--actif" : "filiere-btn"}
              onClick={() => setSelectedFiliere(nom)}
            >
              {nom === "all" ? "Toutes les filières" : nom}
            </button>
          ))}
        </div>

        {/* Filtre par sous-filière */}
        <div className="sous-filiere-filtres">
          {availableSousFilieres.map((nom) => (
            <button
              key={nom}
              type="button"
              className={nom === selectedSousFiliere ? "sous-filiere-btn sous-filiere-btn--actif" : "sous-filiere-btn"}
              onClick={() => setSelectedSousFiliere(nom)}
            >
              {nom === "all" ? "Toutes les sous-filières" : nom}
            </button>
          ))}
        </div>

        {/* Filtre par niveau */}
        <div className="niveau-filtres">
          {niveauxDisponibles.map((niveau) => (
            <button
              key={niveau.clé}
              type="button"
              className={niveau.clé === selectedLevel ? "niveau-btn niveau-btn--actif" : "niveau-btn"}
              onClick={() => setSelectedLevel(niveau.clé)}
            >
              {niveau.label}
            </button>
          ))}
        </div>

        {/* Bouton de réinitialisation */}
        <button className="reset-button" onClick={resetFilters}>
          Réinitialiser les filtres
        </button>
      </div>

      {/* Liste des cours */}
      {filteredCours.length === 0 ? (
        <div className="mec-etudiant-no-courses">
          <p>Aucun cours ne correspond à vos critères.</p>
          <button className="mec-etudiant-button" onClick={() => navigate("/filieres")}>
            <EyeIcon className="icon-small" /> Explorer les filières
          </button>
        </div>
      ) : (
        <div className="mec-etudiant-page-grid">
          {filteredCours.map((coursItem) => (
            <div className="mec-etudiant-card" key={coursItem._id}>
              <div className="mec-etudiant-image-container">
                <img
                  src={coursItem.imagecours || "/default-course-image.jpg"}
                  alt={coursItem.nomcours || "Cours sans nom"}
                  className="mec-etudiant-image"
                />
                <span className={`mec-etudiant-level-badge ${coursItem.niveau?.toLowerCase() || "non-defini"}`}>
                  {coursItem.niveau || "Non défini"}
                </span>
              </div>
              <div className="mec-etudiant-content">
                <span className="mec-etudiant-category">
                  {coursItem.sousFiliereId?.filiereId?.nomfiliere || "Non rattachée"}
                </span>
                <h3 className="mec-etudiant-title">{coursItem.nomcours || "Cours sans nom"}</h3>
                <p className="mec-etudiant-description">
                  {coursItem.description?.substring(0, 100) || "Aucune description disponible"}
                  {coursItem.description?.length > 100 && "..."}
                </p>
                <div className="mec-etudiant-meta">
                  <span>📚 {coursItem.contenu?.length || 0} modules</span>
                  <span>🏷️ {coursItem.sousFiliereId?.nomSousFiliere || "Non rattachée"}</span>
                </div>
                <div className="progress-container">
                  <div
                    className={`progress-bar ${calculateProgress(coursItem._id) === 100 ? "complete" : "incomplete"}`}
                    style={{ width: `${calculateProgress(coursItem._id)}%` }}
                  ></div>
                </div>
                <div className="progress-text">{calculateProgress(coursItem._id)}% complété</div>
                <div className="mec-etudiant-footer-vertical">
                  <button
                    className="btn-consulter-mec"
                    onClick={() => navigate(`/cours/${coursItem._id}`)}
                    aria-label={`Consulter le cours ${coursItem.nomcours}`}
                  >
                    <PreviewIcon className="icon-small" /> Consulter le cours
                  </button>
                  <button
                    className="btn-forum-mec"
                    onClick={() => handleForumNavigation(coursItem._id)}
                    aria-label={`Accéder au forum du cours ${coursItem.nomcours}`}
                  >
                    <ChatBubbleLeftRightIcon className="icon-small" /> Forum
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        style={{ zIndex: 9999 }}
      />
    </div>
  )
}

export default MesCoursEtudiant