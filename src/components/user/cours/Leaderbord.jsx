"use client"

import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { getLeaderboard } from "../../../services/userservice"
import "./standings.css"

const Standings = () => {
  const navigate = useNavigate()
  const [classement, setClassement] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getLeaderboard()
      .then((data) => {
        setClassement(data.filter(etu => etu.userId).slice(0, 10))
        setLoading(false)
      })
      .catch((error) => {
        console.error(error)
        setLoading(false)
      })
  }, [])

  const getRankIcon = (index) => {
    switch (index) {
      case 0: return "🥇"
      case 1: return "🥈"
      case 2: return "🥉"
      default: return `#${index + 1}`
    }
  }

  const getRankClass = (index) => {
    switch (index) {
      case 0: return "rank-gold"
      case 1: return "rank-silver"
      case 2: return "rank-bronze"
      default: return "rank-default"
    }
  }

  const getMotivationalMessage = () => {
    const messages = [
      "Chaque point compte dans votre parcours d'apprentissage !",
      "L'excellence n'est pas un acte, mais une habitude.",
      "Votre persévérance d'aujourd'hui forge votre succès de demain.",
      "Continuez à apprendre, continuez à grandir !",
      "Le savoir est la seule richesse que personne ne peut vous enlever.",
    ]
    return messages[Math.floor(Math.random() * messages.length)]
  }

  if (loading) {
    return (
      <div className="standings-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Chargement du classement...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="standings-container">
      <div className="standings-header">
        <div className="header-content">
          <h1 className="standings-title">
            <span className="title-icon">🏆</span>
            Tableau d'Excellence
          </h1>
          <p className="standings-subtitle">
            Découvrez les étudiants les plus performants de notre communauté d'apprentissage
          </p>
        </div>
      </div>

      <div className="motivation-section">
        <div className="motivation-card">
          <div className="motivation-icon">💡</div>
          <h3>Message du jour</h3>
          <p>{getMotivationalMessage()}</p>
        </div>
      </div>

      <div className="leaderboard-section">
        <div className="section-header">
          <h2>🎯 Top 10 des Apprenants</h2>
          <p>Classement basé sur les points d'activité et de performance</p>
        </div>

        <div className="leaderboard-grid">
          {classement.map((etu, idx) => (
            <div key={etu._id} className={`student-card ${getRankClass(idx)}`}>
              <div className="rank-badge">
                <span className="rank-number">{getRankIcon(idx)}</span>
              </div>

              <div className="student-info">
                <div className="student-avatar">
                  <span className="avatar-text">
                    {etu.userId?.firstname?.charAt(0)}
                    {etu.userId?.lastname?.charAt(0)}
                  </span>
                </div>

                <div className="student-details">
                  <h3 className="student-name">
                    {etu.userId?.firstname} {etu.userId?.lastname}
                  </h3>
                  <div className="student-stats">
                    <span className="points-badge">
                      <span className="points-icon">⭐</span>
                      {etu.points} points
                    </span>
                  </div>
                </div>
              </div>

              {idx < 3 && (
                <div className="achievement-badge">
                  <span className="achievement-text">
                    {idx === 0 ? "Champion" : idx === 1 ? "Expert" : "Talent"}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="footer-motivation">
        <div className="motivation-quote">
          <blockquote>
            "Le succès n'est pas final, l'échec n'est pas fatal : c'est le courage de continuer qui compte."
          </blockquote>
          <cite>— Winston Churchill</cite>
        </div>

        <div className="call-to-action">
          <h3>Prêt à gravir les échelons ?</h3>
          <p>Continuez à apprendre, participez aux quiz, et regardez votre classement s'améliorer !</p>
          <button className="cta-button" onClick={() => navigate('/filieres')}>
            <span>🎓</span>
            Découvrir les filières
          </button>
        </div>
      </div>
    </div>
  )
}

export default Standings