"use client"

import { useState, useEffect } from "react"
import "./contact.css"
import { sendContactMessage } from "../../services/contactservice"

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })
  const [status, setStatus] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [focusedField, setFocusedField] = useState(null)
  const [showNotification, setShowNotification] = useState(false)

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }, [])

  useEffect(() => {
    if (status && status.type === "success") {
      setShowNotification(true)
      const timer = setTimeout(() => {
        setShowNotification(false)
        setStatus(null)
      }, 4000)

      return () => clearTimeout(timer)
    }
  }, [status])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Clear status when user starts typing
    if (status) {
      setStatus(null)
    }
  }

  const handleFocus = (fieldName) => {
    setFocusedField(fieldName)
  }

  const handleBlur = () => {
    setFocusedField(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus(null)
    setIsSubmitting(true)

    try {
      const data = await sendContactMessage(formData)
      setStatus({
        type: "success",
        message:
          data.message || "Votre message a été envoyé avec succès ! Nous vous répondrons dans les plus brefs délais.",
      })
      setFormData({ name: "", email: "", subject: "", message: "" })
    } catch (err) {
      setStatus({
        type: "error",
        message: err.message || "Une erreur est survenue lors de l'envoi. Veuillez réessayer.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const isFormValid = formData.name && formData.email && formData.subject && formData.message

  return (
    <div className="contact-page-container">
      {/* Hero Section */}
      <section className="contact-hero-section">
        <div className="contact-hero-content">
          <h1 className="contact-hero-title">
            Contactez-nous
            <span className="contact-hero-accent"></span>
          </h1>
          <p className="contact-hero-subtitle">
            Nous sommes là pour vous aider. N'hésitez pas à nous faire part de vos questions ou commentaires.
          </p>
        </div>
        <div className="contact-hero-decoration">
          <div className="contact-floating-element contact-element-1"></div>
          <div className="contact-floating-element contact-element-2"></div>
          <div className="contact-floating-element contact-element-3"></div>
        </div>
      </section>

      <div className="contact-main-content">
        {/* Contact Info Cards */}
        <section className="contact-info-section">
          <div className="contact-info-grid">
            <div className="contact-info-card">
              <div className="contact-info-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                </svg>
              </div>
              <h3>Téléphone</h3>
              <p>+216 53 888 234</p>
            </div>

            <div className="contact-info-card">
              <div className="contact-info-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                  <polyline points="22,6 12,13 2,6"></polyline>
                </svg>
              </div>
              <h3>Email</h3>
              <p>contact@learnista.com</p>
            </div>
          </div>
        </section>

        {/* Form Section */}
        <section className="contact-form-section">
          <div className="contact-form-container">
            <div className="contact-form-header">
              <h2>Envoyez-nous un message</h2>
              <p>Remplissez le formulaire ci-dessous et nous vous répondrons rapidement.</p>
            </div>

            <form onSubmit={handleSubmit} className="contact-form">
              <div className="contact-form-row">
                <div className="contact-form-group">
                  <label htmlFor="name" className="contact-form-label">
                    Nom complet
                  </label>
                  <div className={`contact-input-wrapper ${focusedField === "name" ? "contact-focused" : ""}`}>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      placeholder="Votre nom complet"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      onFocus={() => handleFocus("name")}
                      onBlur={handleBlur}
                      className="contact-form-input"
                      disabled={isSubmitting}
                    />
                  </div>
                </div>

                <div className="contact-form-group">
                  <label htmlFor="email" className="contact-form-label">
                    Adresse email
                  </label>
                  <div className={`contact-input-wrapper ${focusedField === "email" ? "contact-focused" : ""}`}>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      placeholder="votre@email.com"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      onFocus={() => handleFocus("email")}
                      onBlur={handleBlur}
                      className="contact-form-input"
                      disabled={isSubmitting}
                    />
                  </div>
                </div>
              </div>

              <div className="contact-form-group">
                <label htmlFor="subject" className="contact-form-label">
                  Sujet
                </label>
                <div className={`contact-input-wrapper ${focusedField === "subject" ? "contact-focused" : ""}`}>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    placeholder="Sujet de votre message"
                    required
                    value={formData.subject}
                    onChange={handleChange}
                    onFocus={() => handleFocus("subject")}
                    onBlur={handleBlur}
                    className="contact-form-input"
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              <div className="contact-form-group">
                <label htmlFor="message" className="contact-form-label">
                  Message
                </label>
                <div className={`contact-input-wrapper ${focusedField === "message" ? "contact-focused" : ""}`}>
                  <textarea
                    id="message"
                    name="message"
                    placeholder="Décrivez votre demande en détail..."
                    required
                    value={formData.message}
                    onChange={handleChange}
                    onFocus={() => handleFocus("message")}
                    onBlur={handleBlur}
                    className="contact-form-textarea"
                    rows="6"
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              <button
                type="submit"
                className={`contact-submit-btn ${!isFormValid ? "contact-btn-disabled" : ""} ${isSubmitting ? "contact-btn-loading" : ""}`}
                disabled={!isFormValid || isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <span className="contact-loading-spinner"></span>
                    Envoi en cours...
                  </>
                ) : (
                  <>
                    Envoyer le message
                    <svg
                      className="contact-btn-icon"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <line x1="22" y1="2" x2="11" y2="13"></line>
                      <polygon points="22,2 15,22 11,13 2,9 22,2"></polygon>
                    </svg>
                  </>
                )}
              </button>
            </form>

            {/* Notification centrée */}
            {showNotification && status && status.type === "success" && (
              <div className="contact-center-notification">
                <div className="contact-notification-content">
                  <div className="contact-notification-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="20,6 9,17 4,12"></polyline>
                    </svg>
                  </div>
                  <div className="contact-notification-text">
                    <h4>Message envoyé avec succès !</h4>
                    <p>{status.message}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Message d'erreur (reste en bas du formulaire) */}
            {status && status.type === "error" && (
              <div className="contact-status-message contact-status-error">
                <div className="contact-status-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="15" y1="9" x2="9" y2="15"></line>
                    <line x1="9" y1="9" x2="15" y2="15"></line>
                  </svg>
                </div>
                <div className="contact-status-content">
                  <h4>Erreur</h4>
                  <p>{status.message}</p>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Map Section */}
       
      </div>

      {/* Footer */}
      <footer className="contact-footer">
        <div className="contact-footer-content">
          <p>&copy; 2025 Votre Entreprise. Tous droits réservés.</p>
          <div className="contact-footer-links">
            <a href="/privacy">Politique de confidentialité</a>
            <a href="/terms">Conditions d'utilisation</a>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default ContactPage
