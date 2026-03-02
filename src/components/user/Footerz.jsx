"use client"

import { Link, useNavigate } from "react-router-dom"
import { AcademicCapIcon, BookOpenIcon, UserGroupIcon, PhoneIcon } from "@heroicons/react/24/outline"
import { FaFacebook, FaTwitter, FaLinkedin, FaInstagram, FaYoutube, FaGithub } from "react-icons/fa"
import "./footer.css"

const Footerz = () => {
  const navigate = useNavigate()
  const currentYear = new Date().getFullYear()

  const handleSubscribeClick = () => {
    if (window.location.pathname === "/homes") {
      const newsletterSection = document.getElementById("newsletter")
      if (newsletterSection) {
        newsletterSection.scrollIntoView({ behavior: "smooth" })
      }
    } else {
      navigate("/homes#newsletter")
    }
  }

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <footer className="footer-main-container">
      {/* Vague décorative */}
      <div className="footer-wave">
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path
            d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z"
            opacity=".25"
            className="footer-wave-shape"
          ></path>
          <path
            d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z"
            opacity=".5"
            className="footer-wave-shape"
          ></path>
          <path
            d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z"
            className="footer-wave-shape"
          ></path>
        </svg>
      </div>

      {/* Contenu principal */}
      <div className="footer-content-wrapper">
        <div className="footer-main-content">
          {/* Section Brand */}
          <div className="footer-brand-section">
            <Link to="/homes" className="footer-brand-link">
              <div className="footer-brand-icon">
                <AcademicCapIcon className="footer-icon" />
                <div className="footer-brand-glow"></div>
              </div>
              <span className="footer-brand-text">Learnista</span>
            </Link>
            <p className="footer-brand-description">
              Transformez votre avenir avec nos formations innovantes. Apprenez aujourd'hui, excellez demain grâce à
              notre plateforme d'apprentissage gamifiée et interactive.
            </p>

            <div className="footer-social-section">
              <h4 className="footer-social-title">Suivez-nous</h4>
              <div className="footer-social-links">
                <a href="#" className="footer-social-link facebook">
                  <FaFacebook className="footer-social-icon" />
                  <span className="footer-social-tooltip">Facebook</span>
                </a>
                <a href="#" className="footer-social-link twitter">
                  <FaTwitter className="footer-social-icon" />
                  <span className="footer-social-tooltip">Twitter</span>
                </a>
                <a href="#" className="footer-social-link linkedin">
                  <FaLinkedin className="footer-social-icon" />
                  <span className="footer-social-tooltip">LinkedIn</span>
                </a>
                <a href="#" className="footer-social-link instagram">
                  <FaInstagram className="footer-social-icon" />
                  <span className="footer-social-tooltip">Instagram</span>
                </a>
                <a href="#" className="footer-social-link youtube">
                  <FaYoutube className="footer-social-icon" />
                  <span className="footer-social-tooltip">YouTube</span>
                </a>
                <a href="#" className="footer-social-link github">
                  <FaGithub className="footer-social-icon" />
                  <span className="footer-social-tooltip">GitHub</span>
                </a>
              </div>
            </div>
          </div>

          {/* Liens Rapides */}
          <div className="footer-links-section">
            <h3 className="footer-section-title">
              <BookOpenIcon className="footer-title-icon" />
              Explorer
            </h3>
            <ul className="footer-links-list">
              <li>
                <Link to="/courses" className="footer-link">
                  <span>Tous les cours</span>
                  <div className="footer-link-arrow">→</div>
                </Link>
              </li>
              <li>
                <Link to="/filieres" className="footer-link">
                  <span>Filières</span>
                  <div className="footer-link-arrow">→</div>
                </Link>
              </li>
              <li>
                <Link to="/blog" className="footer-link">
                  <span>Blog</span>
                  <div className="footer-link-arrow">→</div>
                </Link>
              </li>
              <li>
                <Link to="/certifications" className="footer-link">
                  <span>Certifications</span>
                  <div className="footer-link-arrow">→</div>
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div className="footer-links-section">
            <h3 className="footer-section-title">
              <UserGroupIcon className="footer-title-icon" />
              Support
            </h3>
            <ul className="footer-links-list">
              <li>
                <Link to="/faq" className="footer-link">
                  <span>FAQ</span>
                  <div className="footer-link-arrow">→</div>
                </Link>
              </li>
              <li>
                <Link to="/contact" className="footer-link">
                  
                  <span>Contact</span>
                  <div className="footer-link-arrow">→</div>
                </Link>
              </li>
              <li>
                <Link to="/careers" className="footer-link">
                  <span>Carrières</span>
                  <div className="footer-link-arrow">→</div>
                </Link>
              </li>
              <li>
                <Link to="/about" className="footer-link">
                  <span>À propos</span>
                  <div className="footer-link-arrow">→</div>
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="footer-newsletter-section">
            <h3 className="footer-section-title">
              <span className="footer-newsletter-emoji">📧</span>
              Newsletter
            </h3>
            <button onClick={handleSubscribeClick} className="footer-newsletter-button">
              S'abonner
            </button>
          </div>
        </div>

        {/* Bas de Footer */}
        <div className="footer-bottom-section">
          <div className="footer-legal-links">
            <Link to="/privacy" className="footer-legal-link">
              Confidentialité
            </Link>
            <Link to="/terms" className="footer-legal-link">
              Conditions d'utilisation
            </Link>
            <Link to="/cookies" className="footer-legal-link">
              Cookies
            </Link>
          </div>
          <div className="footer-copyright">
            <span>© {currentYear} Learnista. Tous droits réservés.</span>
          </div>
        </div>
      </div>

      {/* Bouton Back to Top */}
      <button className="footer-back-to-top" onClick={scrollToTop} aria-label="Retour en haut">
        <svg viewBox="0 0 24 24" fill="none" className="footer-top-icon">
          <path d="M7 14l5-5 5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <span className="footer-top-text">Haut</span>
      </button>
    </footer>
  )
}

export default Footerz