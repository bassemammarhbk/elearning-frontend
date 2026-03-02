import React from 'react';
import '../user.css';

const About = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
  return (
    <div className="about-container">
      <section className="about-hero">
        <div className="hero-content">
          <h1>À propos de notre plateforme</h1>
          <p>
            Bienvenue sur notre plateforme e-learning, conçue pour accompagner chaque
            apprenant vers la réussite professionnelle et personnelle.
          </p>
        </div>
      </section>

      <section className="about-mission">
        <h2>Notre mission</h2>
        <p>
          Fournir un environnement d'apprentissage innovant, interactif et
          accessible à tous, grâce à des cours de qualité, des tests adaptés et
          une expérience utilisateur soigneusement conçue.
        </p>
      </section>

      <section className="about-values">
        <h2>Nos valeurs</h2>
        <ul>
          <li><strong>Accessibilité :</strong> Apprendre partout, à tout moment.</li>
          <li><strong>Qualité :</strong> Des contenus validés par des experts.</li>
          <li><strong>Innovation :</strong> Intégration de la gamification et
            des technologies modernes.</li>
          <li><strong>Communauté :</strong> Échanges et entraide entre apprenants.
          </li>
        </ul>
      </section>

    

      <section className="about-contact">
        <h2>Contactez-nous</h2>
        <p>
          Des questions ? N'hésitez pas à nous envoyer un message à{' '}
          <a href="mailto:contact@e-learning.com">contact@e-learning.com</a>.
        </p>
      </section>
    </div>
  );
};

export default About;
