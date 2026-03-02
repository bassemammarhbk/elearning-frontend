"use client"

import { useState } from "react"
import { Link } from "react-router-dom"
import { Mail, Send } from "lucide-react"
import { forgotPassword } from "../../services/authservice"
import "./auth-pages.css"

const ForgotPassword = () => {
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setMessage("")
    try {
      const res = await forgotPassword({ email })
      setMessage(res.data.message)
    } catch (err) {
      setError(err.response?.data?.message || "Erreur lors de l'envoi")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="forgot-password-page">
      <div className="forgot-password-container">
        <div className="forgot-password-content">
          <h2 className="forgot-password-title">Mot de passe oublié ?</h2>
          <p className="forgot-password-subtitle">
            Pas de souci ! Entrez votre adresse email et nous vous enverrons un lien pour réinitialiser votre mot de
            passe.
          </p>

          {message && <div className="forgot-password-success">{message}</div>}
          {error && <div className="forgot-password-error">{error}</div>}

          <form onSubmit={handleSubmit} className="forgot-password-form">
            <div className="forgot-password-group">
              <input
                type="email"
                name="email"
                placeholder="Votre adresse email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="forgot-password-input"
              />
              <div className="forgot-password-icon">
                <Mail size={20} />
              </div>
            </div>

            <button type="submit" className="forgot-password-button" disabled={loading}>
              {loading ? (
                <div className="loading-spinner" />
              ) : (
                <>
                  <Send size={20} />
                  Envoyer le lien de réinitialisation
                </>
              )}
            </button>
          </form>

          <Link to="/login" className="forgot-password-link">
            ← Retour à la connexion
          </Link>
        </div>
      </div>
    </div>
  )
}

export default ForgotPassword
