"use client"

import { useEffect, useState, useRef } from "react"
import { Link, useLocation } from "react-router-dom"
import { AcademicCapIcon, HomeIcon, TrophyIcon, UserGroupIcon } from "@heroicons/react/24/outline"
import { ChevronDownIcon } from "lucide-react"
import PlayCircleFilledWhiteIcon from "@mui/icons-material/PlayCircleFilledWhite"
import "./homes.css"

const Homes = () => {
  const [activeFaq, setActiveFaq] = useState(null)
  const [newsletterEmail, setNewsletterEmail] = useState("")
  const [newsletterMessage, setNewsletterMessage] = useState("")
  const [isNewsletterLoading, setIsNewsletterLoading] = useState(false)
  const faqRef = useRef(null)
  const heroRef = useRef(null)
  const featuresRef = useRef(null)
  const newsletterRef = useRef(null)
  const location = useLocation()

  const features = [
    {
      icon: <AcademicCapIcon className="homes-feature-icon" />,
      title: "Apprentissage Gamifié",
      description: "Apprenez en vous amusant grâce à nos cours interactifs et nos défis stimulants.",
      color: "#4f46e5",
    },
    {
      icon: <HomeIcon className="homes-feature-icon" />,
      title: "Cours Structurés",
      description: "Des parcours d'apprentissage adaptés à votre niveau et à vos objectifs.",
      color: "#06b6d4",
    },
    {
      icon: <TrophyIcon className="homes-feature-icon" />,
      title: "Certifications",
      description: "Obtenez des certifications reconnues pour valoriser vos compétences.",
      color: "#f59e0b",
    },
    {
      icon: <UserGroupIcon className="homes-feature-icon" />,
      title: "Communauté Active",
      description: "Rejoignez une communauté dynamique d'apprenants et d'experts.",
      color: "#10b981",
    },
  ]

  const faqs = [
    {
      id: 1,
      question: "Comment fonctionnent les certifications ?",
      answer:
        "Nos certifications sont délivrées après avoir complété tous les modules et réussi l'examen final, reconnues par de nombreuses entreprises.",
    },
    {
      id: 2,
      question: "Puis-je accéder aux cours sur mobile ?",
      answer: "Oui, notre plateforme est responsive et optimisée pour smartphone et tablette.",
    },
    {
      id: 3,
      question: "Comment contacter un instructeur ?",
      answer: "Chaque cours dispose d'un forum, ou utilisez la messagerie privée pour des questions spécifiques.",
    },
    {
      id: 4,
      question: "Y a-t-il une limite de temps pour compléter un cours ?",
      answer: "Non, l'accès est à vie. Apprenez à votre rythme.",
    },
  ]

  // Intersection Observer pour les animations au scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("homes-animate-in")
          }
        })
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" },
    )

    const elements = [heroRef.current, featuresRef.current, newsletterRef.current, faqRef.current]
    elements.forEach((el) => el && observer.observe(el))

    return () => {
      elements.forEach((el) => el && observer.unobserve(el))
    }
  }, [])

  // Effet de parallax pour le hero
  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.pageYOffset
      const parallax = document.querySelector(".homes-hero-background")
      if (parallax) {
        parallax.style.transform = `translateY(${scrolled * 0.5}px)`
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Défilement vers la section newsletter si hash est #newsletter
  useEffect(() => {
    if (location.hash === "#newsletter" && newsletterRef.current) {
      newsletterRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [location])

  const handleNewsletterSubscribe = async () => {
    if (!newsletterEmail) {
      setNewsletterMessage("Veuillez entrer un e-mail.")
      return
    }

    setIsNewsletterLoading(true)
    try {
      const response = await fetch("http://localhost:4000/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: newsletterEmail }),
      })

      const data = await response.json()
      if (data.success) {
        setNewsletterMessage("🎉 Merci pour votre inscription !")
        setNewsletterEmail("")
      } else {
        setNewsletterMessage(data.message || "Une erreur est survenue.")
      }
    } catch (error) {
      console.error(error)
      setNewsletterMessage("Erreur lors de l'inscription.")
    } finally {
      setIsNewsletterLoading(false)
    }
  }

  return (
    <div className="homes-container">
      {/* Hero Section */}
      <section className="homes-hero" ref={heroRef}>
        <div className="homes-hero-background"></div>
        <div className="homes-hero-content">
          <div className="homes-hero-badge">
            <span>🚀 Nouvelle plateforme d'apprentissage</span>
          </div>
          <h1 className="homes-hero-title">
            Apprenez, <span className="homes-gradient-text">Jouez</span>, Progressez
          </h1>
          <p className="homes-hero-subtitle">
            La plateforme d'apprentissage qui rend l'éducation amusante et efficace grâce à la gamification et
            l'intelligence artificielle
          </p>
          <div className="homes-hero-buttons">
            <Link to="/filieres" className="homes-cta-primary">
              <PlayCircleFilledWhiteIcon className="homes-button-icon" />
              Commencer Maintenant
            </Link>
            <Link to="/about" className="homes-cta-secondary">
              En savoir plus
            </Link>
          </div>
          <div className="homes-hero-stats">
            <div className="homes-stat-item">
              <span className="homes-stat-number">10K+</span>
              <span className="homes-stat-label">Étudiants</span>
            </div>
            <div className="homes-stat-item">
              <span className="homes-stat-number">500+</span>
              <span className="homes-stat-label">Cours</span>
            </div>
            <div className="homes-stat-item">
              <span className="homes-stat-number">95%</span>
              <span className="homes-stat-label">Satisfaction</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="homes-features-section" ref={featuresRef}>
        <div className="homes-container-inner">
          <div className="homes-section-header">
            <h2 className="homes-section-title">Pourquoi choisir notre plateforme ?</h2>
            <p className="homes-section-subtitle">
              Des fonctionnalités uniques pour une expérience d'apprentissage optimale
            </p>
          </div>
          <div className="homes-features-grid">
            {features.map((feature, index) => (
              <div
                key={feature.title}
                className="homes-feature-card"
                style={{ "--delay": `${index * 0.1}s`, "--color": feature.color }}
              >
                <div className="homes-feature-icon-container">{feature.icon}</div>
                <h3 className="homes-feature-title">{feature.title}</h3>
                <p className="homes-feature-description">{feature.description}</p>
                <div className="homes-feature-glow"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section id="newsletter" className="homes-newsletter-section" ref={newsletterRef}>
        <div className="homes-newsletter-background">
          <div className="homes-newsletter-pattern"></div>
        </div>
        <div className="homes-container-inner">
          <div className="homes-newsletter-content">
            <div className="homes-newsletter-icon">
              <span>📧</span>
            </div>
            <h2 className="homes-newsletter-title">Restez informé·e des nouveautés</h2>
            <p className="homes-newsletter-subtitle">
              Abonnez-vous pour recevoir nos dernières actualités, conseils pédagogiques et offres exclusives
            </p>
            <div className="homes-newsletter-form">
              <div className="homes-input-group">
                <input
                  type="email"
                  placeholder="Entrez votre adresse e-mail"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  className="homes-newsletter-input"
                  onKeyPress={(e) => e.key === "Enter" && handleNewsletterSubscribe()}
                />
                <button
                  onClick={handleNewsletterSubscribe}
                  className={`homes-newsletter-button ${isNewsletterLoading ? "homes-loading" : ""}`}
                  disabled={isNewsletterLoading}
                >
                  {isNewsletterLoading ? (
                    <div className="homes-spinner"></div>
                  ) : (
                    <>
                      <span>S'abonner</span>
                      <svg className="homes-arrow-icon" viewBox="0 0 24 24" fill="none">
                        <path
                          d="M5 12h14m-7-7l7 7-7 7"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </>
                  )}
                </button>
              </div>
              {newsletterMessage && (
                <div
                  className={`homes-newsletter-message ${
                    newsletterMessage.includes("🎉") ? "homes-success" : "homes-error"
                  }`}
                >
                  {newsletterMessage}
                </div>
              )}
            </div>
            <div className="homes-newsletter-features">
              <div className="homes-newsletter-feature">
                <span className="homes-check-icon">✓</span>
                <span>Conseils d'apprentissage exclusifs</span>
              </div>
              <div className="homes-newsletter-feature">
                <span className="homes-check-icon">✓</span>
                <span>Accès anticipé aux nouveaux cours</span>
              </div>
              <div className="homes-newsletter-feature">
                <span className="homes-check-icon">✓</span>
                <span>Offres spéciales réservées aux abonnés</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="homes-faq-section" ref={faqRef}>
        <div className="homes-container-inner">
          <div className="homes-section-header">
            <h2 className="homes-section-title">Questions Fréquentes</h2>
            <p className="homes-section-subtitle">Tout ce que vous devez savoir pour commencer</p>
          </div>
          <div className="homes-faq-container">
            {faqs.map((faq, index) => (
              <div key={faq.id} className="homes-faq-item" style={{ "--delay": `${index * 0.1}s` }}>
                <button
                  className={`homes-faq-question ${activeFaq === faq.id ? "homes-active" : ""}`}
                  onClick={() => setActiveFaq(activeFaq === faq.id ? null : faq.id)}
                >
                  <span>{faq.question}</span>
                  <ChevronDownIcon className="homes-faq-icon" />
                </button>
                <div className={`homes-faq-answer ${activeFaq === faq.id ? "homes-active" : ""}`}>
                  <div className="homes-faq-answer-content">
                    <p>{faq.answer}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="homes-cta-section">
        <div className="homes-cta-background">
          <div className="homes-cta-pattern"></div>
        </div>
        <div className="homes-container-inner">
          <div className="homes-cta-content">
            <h2 className="homes-cta-title">Prêt à commencer votre parcours d'apprentissage ?</h2>
            <p className="homes-cta-subtitle">
              Rejoignez notre communauté et développez vos compétences dès aujourd'hui
            </p>
            <div className="homes-cta-buttons">
              <Link to="/register" className="homes-cta-primary">
                S'inscrire gratuitement
              </Link>
              <Link to="/filieres" className="homes-cta-secondary">
                Explorer les cours
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Homes