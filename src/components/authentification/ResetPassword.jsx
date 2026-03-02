"use client"

import { useState, useEffect } from "react"
import { useParams, Link, useNavigate } from "react-router-dom"
import { Lock, Check, Eye, EyeOff } from "lucide-react"
import { resetPassword } from "../../services/authservice"
import "./auth-pages.css"

const ResetPassword = () => {
  const { token } = useParams()
  const navigate = useNavigate()
  const [password, setPassword] = useState("")
  const [confirm, setConfirm] = useState("")
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [passwordStrength, setPasswordStrength] = useState(0)

  // Calculer la force du mot de passe
  useEffect(() => {
    const calculateStrength = (pwd) => {
      let strength = 0
      if (pwd.length >= 8) strength += 25
      if (/[a-z]/.test(pwd)) strength += 25
      if (/[A-Z]/.test(pwd)) strength += 25
      if (/[0-9]/.test(pwd)) strength += 25
      return strength
    }

    setPasswordStrength(calculateStrength(password))
  }, [password])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (password !== confirm) {
      setError("Les mots de passe ne correspondent pas")
      return
    }
    if (password.length < 8) {
      setError("Le mot de passe doit contenir au moins 8 caractères")
      return
    }

    setLoading(true)
    setError("")
    try {
      await resetPassword(token, { newPassword: password })
      setMessage("Mot de passe réinitialisé avec succès ! Redirection...")
      setTimeout(() => navigate("/login"), 3000)
    } catch (err) {
      setError(err.response?.data?.message || "Erreur lors de la réinitialisation")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="reset-password-page">
      <div className="reset-password-container">
        <h2 className="reset-password-title">Nouveau mot de passe</h2>

        {message && <div className="reset-password-success">{message}</div>}
        {error && <div className="reset-password-error">{error}</div>}

        <form onSubmit={handleSubmit} className="reset-password-form">
          <div className="reset-password-group">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Nouveau mot de passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="reset-password-input"
            />
            <div className="reset-password-icon">
              <Lock size={20} />
            </div>
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: "absolute",
                right: "1rem",
                top: "50%",
                transform: "translateY(-50%)",
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "var(--text-secondary)",
              }}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
            {password && <div className="reset-password-strength" style={{ "--strength": `${passwordStrength}%` }} />}
          </div>

          <div className="reset-password-group">
            <input
              type={showConfirm ? "text" : "password"}
              name="confirm"
              placeholder="Confirmer le mot de passe"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              required
              className="reset-password-input"
            />
            <div className="reset-password-icon">
              <Lock size={20} />
            </div>
            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              style={{
                position: "absolute",
                right: "1rem",
                top: "50%",
                transform: "translateY(-50%)",
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "var(--text-secondary)",
              }}
            >
              {showConfirm ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <button type="submit" className="reset-password-button" disabled={loading}>
            {loading ? (
              <div className="loading-spinner" />
            ) : (
              <>
                <Check size={20} />
                Réinitialiser le mot de passe
              </>
            )}
          </button>
        </form>

        <Link to="/login" className="reset-password-link">
          ← Retour à la connexion
        </Link>
      </div>
    </div>
  )
}

export default ResetPassword
