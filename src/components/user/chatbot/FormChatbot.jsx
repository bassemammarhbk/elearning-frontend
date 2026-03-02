"use client"

import { useState } from "react"
import axios from "../../../api/axios"
import "./chatbot.css"

const FormChatbot = () => {
  const [question, setQuestion] = useState("")
  const [reponse, setReponse] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // États pour la pagination
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(12)

  const handleSubmit = async (event) => {
    event.preventDefault()
    setLoading(true)
    setError(null)
    setCurrentPage(1) // Reset à la première page lors d'une nouvelle recherche

    try {
      // Envoyer la requête à l'API pour les cours
      const result = await axios.post("/cours/query", { text: question })
      setReponse(result.data.result) // Mettre à jour l'état avec les cours
    } catch (error) {
      console.error("Erreur API:", error)
      setError("Une erreur s'est produite, veuillez réessayer.")
    }
    setLoading(false)
  }

  // Calculs pour la pagination
  const totalItems = reponse.length
  const totalPages = Math.ceil(totalItems / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentItems = reponse.slice(startIndex, endIndex)

  // Générer les numéros de pages à afficher
  const getPageNumbers = () => {
    const delta = 2 // Nombre de pages à afficher de chaque côté de la page courante
    const range = []
    const rangeWithDots = []

    for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
      range.push(i)
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, "...")
    } else {
      rangeWithDots.push(1)
    }

    rangeWithDots.push(...range)

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push("...", totalPages)
    } else {
      if (totalPages > 1) {
        rangeWithDots.push(totalPages)
      }
    }

    return rangeWithDots
  }

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
      // Scroll vers le haut pour voir les nouveaux résultats
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
  }

  const handleItemsPerPageChange = (event) => {
    setItemsPerPage(Number(event.target.value))
    setCurrentPage(1) // Reset à la première page
  }

  return (
    <div className="chatbot-container">
      {/* En-tête du chatbot */}
      <div className="chatbot-header">
        <h1 className="chatbot-title">🤖 Assistant Intelligent</h1>
        <p className="chatbot-subtitle">
          Découvrez les cours parfaits pour votre parcours d'apprentissage. Posez vos questions et laissez notre IA vous
          guider vers les meilleures formations.
        </p>
      </div>

      {/* Formulaire de recherche */}
      <form onSubmit={handleSubmit} className="chatbot-form-container">
        <div className="chatbot-form-group">
          <div className="chatbot-form-input-wrapper">
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              className="chatbot-form-input"
              placeholder="Exemple: Quels sont les cours de niveau avancé en informatique ? 🎓"
              required
            />
          </div>
        </div>
        <button type="submit" className="chatbot-submit-button" disabled={loading}>
          {loading ? (
            <>
              <span className="chatbot-loading-dots"></span>
              Recherche en cours...
            </>
          ) : (
            <>🚀 Lancer la recherche</>
          )}
        </button>
      </form>

      {/* Conteneur de réponses */}
      <div className="chatbot-response-container">
        {/* Message de chargement */}
        {loading && (
          <div className="chatbot-loading-message">
            <div className="chatbot-sparkle">🧠 Intelligence artificielle en action... Analyse de votre demande</div>
          </div>
        )}

        {/* Message d'erreur */}
        {error && <div className="chatbot-error-message">❌ {error}</div>}

        {/* Résumé des résultats */}
        {!loading && !error && totalItems > 0 && (
          <div className="chatbot-results-summary">
            🎯 {totalItems} cours trouvé{totalItems > 1 ? "s" : ""} pour votre recherche
            {totalPages > 1 && (
              <span>
                {" "}
                - Page {currentPage} sur {totalPages}
              </span>
            )}
          </div>
        )}

        {/* Résultats des cours avec pagination */}
        {!loading && !error && currentItems.length > 0 && (
          <>
            <div className="chatbot-course-list">
              {currentItems.map((item, index) => (
                <div key={startIndex + index} className="chatbot-course-card">
                  {item.nomcours ? (
                    <>
                      <h3 className="chatbot-course-title">📚 {item.nomcours}</h3>

                      <div className="chatbot-course-info">
                        <strong>🎯 Niveau :</strong>
                        <span className="chatbot-course-badge niveau">{item.niveau}</span>
                      </div>

                      <div className="chatbot-course-info">
                        <strong></strong>
                        <span className="chatbot-course-badge duree">{item.duree}</span>
                      </div>

                      <div className="chatbot-course-info">
                        <strong>🏷️ Sous-filière :</strong>
                        <span className="chatbot-course-badge">
                          {item.sousFiliereId?.nomSousFiliere || "Non spécifiée"}
                        </span>
                      </div>

                      <div className="chatbot-course-info">
                        <strong>🎓 Filière :</strong>
                        <span className="chatbot-course-badge filiere">
                          {item.sousFiliereId?.filiereId?.nomfiliere || "Non spécifiée"}
                        </span>
                      </div>

                      {item.imagecours && (
                        <img
                          src={item.imagecours || "/placeholder.svg"}
                          alt={item.nomcours}
                          className="chatbot-course-image"
                        />
                      )}
                    </>
                  ) : (
                    <div className="chatbot-message-card">
                      <p>{item.message}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Système de pagination */}
            {totalPages > 1 && (
              <div className="chatbot-pagination-container">
                {/* Informations de pagination */}
                <div className="chatbot-pagination-info">
                  Affichage de {startIndex + 1} à {Math.min(endIndex, totalItems)} sur {totalItems} résultats
                </div>

                {/* Contrôles de pagination */}
                <div className="chatbot-pagination-controls">
                  {/* Bouton Précédent */}
                  <button
                    className="chatbot-pagination-nav prev"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    title="Page précédente"
                  >
                    ←
                  </button>

                  {/* Numéros de pages */}
                  {getPageNumbers().map((pageNum, index) => (
                    <button
                      key={index}
                      className={`chatbot-pagination-button ${pageNum === currentPage ? "active" : ""}`}
                      onClick={() => typeof pageNum === "number" && handlePageChange(pageNum)}
                      disabled={pageNum === "..."}
                    >
                      {pageNum}
                    </button>
                  ))}

                  {/* Bouton Suivant */}
                  <button
                    className="chatbot-pagination-nav next"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    title="Page suivante"
                  >
                    →
                  </button>
                </div>

                {/* Sélecteur d'éléments par page */}
                <div className="chatbot-items-per-page">
                  <label htmlFor="itemsPerPage">Afficher :</label>
                  <select id="itemsPerPage" value={itemsPerPage} onChange={handleItemsPerPageChange}>
                    <option value={6}>6 par page</option>
                    <option value={12}>12 par page</option>
                    <option value={24}>24 par page</option>
                    <option value={48}>48 par page</option>
                  </select>
                </div>
              </div>
            )}
          </>
        )}

        {/* Message aucun résultat */}
        {!loading && !error && reponse.length === 0 && question && (
          <div className="chatbot-no-results">
            🔍 Aucun cours trouvé pour votre recherche.
            <br />
            Essayez avec des mots-clés différents !
          </div>
        )}
      </div>
    </div>
  )
}

export default FormChatbot
