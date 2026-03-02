

import { useState, useEffect, useContext } from "react"
import { Link } from "react-router-dom"
import axios from "axios"
import './w0.css'

const Cours = () => {
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)


  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/students/courses`, {

        })
        setCourses(res.data)
      } catch (err) {
        setError(err.response?.data?.message || "Une erreur est survenue lors du chargement des cours")
      } finally {
        setLoading(false)
      }
    }

    fetchCourses()
  }, )



  return (
    <div className="container mx-auto px-4 py-8">
      {/* Section d'introduction inspirante */}
      <div className="intro-section">
        <h1>Votre parcours d'apprentissage</h1>
        <p>
          Bienvenue dans votre espace d'apprentissage personnel. Chaque cours que vous suivez est une étape vers la
          réalisation de vos objectifs professionnels et personnels.
        </p>
        <div className="flex-row">
          <div className="mb-mobile">
            <p className="stats">
              <span className="number">{courses.length}</span> cours en cours
            </p>
            <p className="stats">
              <span className="number">{courses.filter((course) => course.completed).length}</span> cours terminés
            </p>
          </div>
          <Link to="/student/certifications" className="cta-button">
            Voir mes certifications
          </Link>
        </div>
      </div>

      {/* Citations motivantes */}
      <div className="quotes-section">
        <h2>Inspiration pour votre apprentissage</h2>
        <div className="grid-3-cols">
          <div className="quote-card blue-border">
            <p>"L'éducation est l'arme la plus puissante que vous puissiez utiliser pour changer le monde."</p>
            <p className="author">— Nelson Mandela</p>
          </div>
          <div className="quote-card green-border">
            <p>"Le but de l'éducation n'est pas de remplir un seau, mais d'allumer un feu."</p>
            <p className="author">— William Butler Yeats</p>
          </div>
          <div className="quote-card purple-border">
            <p>"Investir dans la connaissance rapporte toujours les meilleurs intérêts."</p>
            <p className="author">— Benjamin Franklin</p>
          </div>
        </div>
      </div>

      {/* Conseils d'apprentissage */}
      <div className="tips-section">
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
              <h3>Rejoignez des groupes d'étude</h3>
              <p>Collaborez avec d'autres étudiants pour partager des idées et résoudre des problèmes ensemble.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Liste des cours */}
      <div className="courses-section">
        <h2>Mes cours</h2>

        {error && (
          <div className="error-alert">
            <p>{error}</p>
          </div>
        )}

        {courses.length === 0 ? (
          <div className="empty-courses">
            <i className="fas fa-info-circle"></i>
            <h3>Vous n'êtes inscrit à aucun cours</h3>
            <p>Explorez notre catalogue et inscrivez-vous à des cours pour commencer votre apprentissage.</p>
            <Link to="/courses" className="course-button">
              Explorer les cours
            </Link>
          </div>
        ) : (
          <div className="grid-3-cols">
            {courses.map((enrollment) => (
              <div key={enrollment.course._id} className="course-card">
                <div className="progress-bar" style={{ width: `${enrollment.progress}%` }}></div>
                <div className="course-card-content">
                  <h3>{enrollment.course.title}</h3>
                  <p>{enrollment.course.description}</p>
                  <div className="course-card-footer">
                    <span className="progress-text">Progression: {enrollment.progress}%</span>
                    <span className={`status-badge ${enrollment.completed ? "completed" : "in-progress"}`}>
                      {enrollment.completed ? "Terminé" : "En cours"}
                    </span>
                  </div>
                  <Link to={`/student/courses/${enrollment.course._id}`} className="course-button">
                    {enrollment.completed ? "Revoir le cours" : "Continuer"}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Statistiques éducatives */}
      <div className="stats-section">
        <h2>L'impact de l'éducation</h2>
        <div className="grid-4-cols">
          <div className="stat-card">
            <div className="stat-number">58%</div>
            <p className="stat-description">
              Des employeurs privilégient les candidats ayant des certifications spécifiques
            </p>
          </div>
          <div className="stat-card">
            <div className="stat-number">87%</div>
            <p className="stat-description">
              Des apprenants en ligne déclarent que cela a un impact positif sur leur carrière
            </p>
          </div>
          <div className="stat-card">
            <div className="stat-number">23%</div>
            <p className="stat-description">D'augmentation de salaire moyenne après l'obtention d'une certification</p>
          </div>
          <div className="stat-card">
            <div className="stat-number">75%</div>
            <p className="stat-description">
              Des apprenants terminent leurs cours lorsqu'ils suivent un programme structuré
            </p>
          </div>
        </div>
      </div>

      {/* Témoignages d'étudiants */}
      <div className="testimonials-section">
        <h2>Ce que disent nos étudiants</h2>
        <div className="grid-2-cols">
          <div className="testimonial-card">
            <div className="testimonial-header">
              <div className="testimonial-avatar">
                <i className="fas fa-user"></i>
              </div>
              <div>
                <h4 className="testimonial-name">Amina Benali</h4>
                <p className="testimonial-role">Étudiante en informatique</p>
              </div>
            </div>
            <p className="testimonial-text">
              "Grâce à cette plateforme, j'ai pu acquérir des compétences en développement web qui m'ont permis de
              décrocher un stage dans une entreprise de technologie. Les cours sont bien structurés et les enseignants
              sont très réactifs."
            </p>
          </div>
          <div className="testimonial-card">
            <div className="testimonial-header">
              <div className="testimonial-avatar">
                <i className="fas fa-user"></i>
              </div>
              <div>
                <h4 className="testimonial-name">Karim Tazi</h4>
                <p className="testimonial-role">Professionnel en reconversion</p>
              </div>
            </div>
            <p className="testimonial-text">
              "J'ai pu me reconvertir dans le domaine du marketing digital grâce aux cours proposés ici. La flexibilité
              de l'apprentissage en ligne m'a permis de continuer à travailler tout en étudiant. Les certifications ont
              vraiment fait la différence sur mon CV."
            </p>
          </div>
        </div>
      </div>

      {/* Appel à l'action */}
      <div className="cta-section">
        <h2>Prêt à élargir vos horizons ?</h2>
        <p>Découvrez de nouveaux cours et continuez à développer vos compétences pour atteindre vos objectifs.</p>
        <Link to="/courses" className="cta-button">
          Explorer plus de cours
        </Link>
      </div>
    </div>
  )
}

export default Cours
