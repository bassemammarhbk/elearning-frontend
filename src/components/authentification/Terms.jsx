import React from 'react';
import { Link } from 'react-router-dom';

const Terms = () => {
  return (
    <>
      <style>
        {`
        /* Variables CSS (ajuster selon vos couleurs globales si elles existent) */
        :root {
          --primary-color: #4f46e5; /* Bleu indigo pour l'éducation */
          --secondary-color: #10b981; /* Vert pour la validation / succès */
          --accent-color: #f97316; /* Orange pour l'accentuation */
          --background-light: #f0f4f8; /* Arrière-plan doux */
          --card-background: #ffffff; /* Fond de carte blanc */
          --text-dark: #1a202c; /* Texte sombre */
          --text-medium: #4a5568; /* Texte moyen */
          --border-color: #e2e8f0; /* Couleur de bordure */
          --shadow-light: 0 4px 6px rgba(0, 0, 0, 0.05); /* Ombre légère */
          --shadow-medium: 0 10px 15px rgba(0, 0, 0, 0.1); /* Ombre moyenne */
          --gradient-blue: linear-gradient(135deg, #667eea 0%, #764ba2 100%); /* Dégradé pour le titre/accents */
          --gradient-orange: linear-gradient(135deg, #f7ba2c 0%, #ea5408 100%);
          --danger-color: #ef4444; /* Rouge pour les interdictions */
          --font-body: 'Poppins', sans-serif; /* Assurez-vous d'importer Poppins ou une autre police moderne */
          --border-radius-sm: 8px;
          --border-radius-md: 12px;
          --border-radius-lg: 15px;
          --transition-speed: 0.3s ease;
        }

        /* Base de la page */
        .terms-page-container-unique {
          display: flex;
          justify-content: center;
          align-items: flex-start; /* Aligne le contenu en haut si la page est plus grande */
          min-height: 100vh;
          padding: 40px 20px;
          background-color: var(--background-light);
          font-family: var(--font-body);
          color: var(--text-dark);
          box-sizing: border-box; /* Inclut le padding dans la largeur/hauteur */
        }

        /* Carte de contenu */
        .terms-content-card-unique {
          background-color: var(--card-background);
          border-radius: var(--border-radius-lg);
          box-shadow: var(--shadow-medium);
          max-width: 900px;
          width: 100%;
          padding: 40px;
          animation: fadeInScale 0.6s var(--transition-speed);
        }

        @keyframes fadeInScale {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        /* Titre principal */
        .terms-title-unique {
          font-size: 2.8rem;
          font-weight: 800;
          margin-bottom: 30px;
          text-align: center;
          background: var(--gradient-blue);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          color: transparent; /* Fallback */
          line-height: 1.2;
        }

        .terms-title-unique i { /* Pour les icônes Font Awesome dans le titre */
          margin-right: 15px;
          vertical-align: middle;
        }


        /* Sections de termes */
        .terms-section-unique {
          margin-bottom: 25px;
          padding: 20px;
          background-color: #f8fafc; /* Légèrement plus clair que l'arrière-plan */
          border-left: 5px solid var(--primary-color); /* Bordure éducative */
          border-radius: var(--border-radius-sm);
          transition: all var(--transition-speed);
          position: relative; /* Pour l'effet de survol */
        }

        .terms-section-unique:hover {
          transform: translateY(-5px);
          box-shadow: var(--shadow-light);
          border-left-color: var(--secondary-color); /* Change de couleur au survol */
        }

        .terms-section-unique h3 {
          font-size: 1.8rem;
          color: var(--primary-color);
          margin-bottom: 15px;
          display: flex;
          align-items: center;
        }

        .terms-section-unique h3 i { /* Pour les icônes Font Awesome dans les titres H3 */
          margin-right: 10px;
          color: var(--accent-color); /* Couleur vive pour les icônes de titre */
        }

        .terms-section-unique p {
          font-size: 1.1rem;
          line-height: 1.7;
          color: var(--text-medium);
          margin-bottom: 10px;
        }

        .terms-section-unique ul {
          list-style: none; /* Supprime les puces par défaut */
          padding-left: 0;
          margin-top: 15px;
        }

        .terms-section-unique ul li {
          font-size: 1.05rem;
          line-height: 1.8;
          color: var(--text-medium);
          margin-bottom: 8px;
          display: flex;
          align-items: flex-start;
          padding-left: 10px;
          position: relative;
        }

        .terms-section-unique ul li i.terms-icon-danger-unique { /* Icônes Font Awesome pour les interdictions */
          margin-right: 10px;
          font-size: 1.2rem;
          color: var(--danger-color); /* Rouge pour les interdictions */
          flex-shrink: 0; /* Empêche l'icône de rétrécir */
          padding-top: 2px; /* Ajuste l'alignement vertical avec le texte */
        }

        /* Styles spécifiques pour l'introduction et la conclusion */
        .terms-section-unique.introduction-unique {
          background-color: #e6f0ff; /* Bleu plus doux */
          border-left-color: var(--primary-color);
          padding: 25px;
        }

        .terms-section-unique.conclusion-unique {
          background-color: #e0f9ed; /* Vert doux */
          border-left-color: var(--secondary-color);
          padding: 25px;
          text-align: center;
        }

        /* Lien de navigation */
        .terms-navigation-unique {
          text-align: center;
          margin-top: 40px;
        }

        .terms-back-link-unique {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          background: var(--gradient-orange);
          color: white;
          padding: 14px 25px;
          border-radius: 50px;
          text-decoration: none;
          font-weight: 700;
          font-size: 1.1rem;
          transition: all var(--transition-speed);
          box-shadow: var(--shadow-medium);
        }

        .terms-back-link-unique:hover {
          transform: translateY(-5px);
          box-shadow: 0 15px 25px rgba(249, 115, 22, 0.2); /* Ombre plus prononcée avec couleur accent */
        }

        .terms-back-link-unique i.terms-icon-left-unique {
          font-size: 1.2rem;
        }

        /* Style pour les liens dans le contenu des termes */
        .terms-link-unique {
          color: var(--primary-color);
          font-weight: 600;
          text-decoration: none;
          border-bottom: 2px solid var(--primary-color);
          transition: all var(--transition-speed);
        }

        .terms-link-unique:hover {
          color: var(--primary-color);
          border-bottom-color: var(--primary-color);
          opacity: 0.8;
        }

        /* Responsiveness */
        @media (max-width: 768px) {
          .terms-content-card-unique {
            padding: 25px;
          }

          .terms-title-unique {
            font-size: 2.2rem;
          }

          .terms-section-unique h3 {
            font-size: 1.5rem;
          }

          .terms-section-unique p,
          .terms-section-unique ul li {
            font-size: 0.95rem;
          }

          .terms-back-link-unique {
            font-size: 1rem;
            padding: 12px 20px;
          }
        }

        @media (max-width: 480px) {
          .terms-page-container-unique {
            padding: 20px 10px;
          }

          .terms-content-card-unique {
            padding: 20px;
          }

          .terms-title-unique {
            font-size: 1.8rem;
          }
        }
        `}
      </style>
      <div className="terms-page-container-unique">
        <div className="terms-content-card-unique">
          <h2 className="terms-title-unique">📖 Termes et Conditions d'Utilisation</h2>
          <div className="terms-section-unique introduction-unique">
            <p>
              Bienvenue sur notre plateforme d'apprentissage ! En vous inscrivant et en utilisant nos services, vous vous engagez à respecter les règles qui garantissent un environnement éducatif et sûr pour tous. Veuillez lire attentivement les points suivants pour une compréhension claire de nos engagements mutuels.
            </p>
          </div>

          <div className="terms-section-unique">
            <h3>1. ✅ Acceptation des Termes</h3>
            <p>
              En créant votre compte, vous confirmez avoir pris connaissance, compris et accepté l'intégralité de ces termes et conditions, ainsi que notre <Link to="/privacy-policy" className="terms-link-unique">politique de confidentialité</Link>. Cette acceptation est essentielle pour débuter votre parcours avec nous.
            </p>
          </div>

          <div className="terms-section-unique">
            <h3>2. 🧑‍🎓 Création de Compte</h3>
            <p>
              Pour une expérience optimale, il est crucial de fournir des informations précises et complètes lors de votre inscription (prénom, nom, adresse e-mail, etc.). La sécurité de votre compte est votre responsabilité : veillez à la confidentialité de votre mot de passe et de toutes les activités qui y sont liées.
            </p>
          </div>

          <div className="terms-section-unique">
            <h3>3. 💡 Utilisation Éthique des Services</h3>
            <p>
              Notre plateforme est un espace d'apprentissage et de partage. Vous vous engagez à l'utiliser en toute conformité avec les lois en vigueur et dans le respect de la communauté. Il est strictement interdit de :
            </p>
            <ul>
              <li><i className="fas fa-ban terms-icon-danger-unique"></i> Publier du contenu illégal, offensant, discriminatoire ou nuisible.</li>
              <li><i className="fas fa-user-secret terms-icon-danger-unique"></i> Tenter d'accéder sans autorisation à nos systèmes ou à d'autres comptes.</li>
              <li><i className="fas fa-hand-holding-usd terms-icon-danger-unique"></i> Utiliser nos services à des fins frauduleuses ou commerciales non autorisées.</li>
              <li><i className="fas fa-robot terms-icon-danger-unique"></i> Utiliser des robots ou tout autre moyen automatisé pour accéder à la plateforme ou en extraire des données.</li>
            </ul>
          </div>

          <div className="terms-section-unique">
            <h3>4. 🖼️ Téléchargement d'Images</h3>
            <p>
              Les images que vous téléchargez (par exemple, pour votre profil) doivent respecter les droits d'auteur et ne contenir aucun contenu inapproprié. Nous utilisons **Cloudinary** pour un stockage sécurisé de vos images ; en les téléchargeant, vous acceptez leurs propres conditions d'utilisation.
            </p>
          </div>

          <div className="terms-section-unique">
            <h3>5. ✉️ Activation du Compte</h3>
            <p>
              Pour valider votre inscription et accéder à toutes les fonctionnalités, un e-mail d'activation vous sera envoyé. Il est impératif de cliquer sur le lien qu'il contient. Les comptes non activés dans un certain délai pourront être suspendus ou supprimés.
            </p>
          </div>

          <div className="terms-section-unique conclusion-unique">
            <p>
              Ces termes sont conçus pour assurer une expérience positive et sécurisée pour tous nos utilisateurs. Nous vous remercions de votre collaboration et vous souhaitons un excellent apprentissage !
            </p>
          </div>

          <div className="terms-navigation-unique">
            <Link to="/register" className="terms-back-link-unique">
              <i className="fas fa-arrow-left terms-icon-left-unique"></i> Retour à l'inscription
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Terms;
