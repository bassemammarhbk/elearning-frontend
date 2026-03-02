import React, { useEffect, useState } from 'react';
import { getFilieresAvecCours } from '../../../services/filiereservice';
import { Link } from 'react-router-dom';
import './filiere.css'; // assure-toi que ce chemin est correct

const Filierez = () => {
  const [filieres, setFilieres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erreur, setErreur] = useState(null);

  useEffect(() => {
    const fetchFilieres = async () => {
      try {
        const res = await getFilieresAvecCours();
        setFilieres(res.data);
        setLoading(false);
      } catch (error) {
        console.error("Erreur lors du chargement des filières :", error);
        setErreur("Impossible de charger les filières.");
        setLoading(false);
      }
    };
    fetchFilieres();
  }, []);

  return (
    <div className="filiere-wrapper-unique">
      <div className="filiere-container-unique">
        <div className="filiere-header-unique">
          <h1 className="filiere-main-title-unique">🎓 Nos Filières de Formation</h1>
          <p className="filiere-subtitle-unique">Choisissez votre parcours et développez les compétences les plus demandées.</p>
        </div>

        {loading ? (
          <div className="loading-message">Chargement en cours...</div>
        ) : erreur ? (
          <div className="error-message">{erreur}</div>
        ) : filieres.length === 0 ? (
          <div className="no-filieres">Aucune filière trouvée.</div>
        ) : (
          <div className="filieres-grid">
            {filieres.map((filiere, index) => (
              <div key={index} className="filiere-card animate-fadein">
                <div
                  className="filiere-top"
                  style={{
                    background: `linear-gradient(135deg, ${filiere.color || '#4f46e5'} 0%, #667eea 100%)`,
                  }}
                >
                  <div className="filiere-title">{filiere.nomfiliere}</div>
                  <img src={filiere.imagefiliere} alt={filiere.nomfiliere} className="filiere-img" />
                  <span className="cours-count">{filiere.cours?.length || 0} cours</span>
                </div>

                <div className="filiere-body">
                  <p>{filiere.descriptionfiliere}</p>
                  <h4>Cours inclus :</h4>
                  <ul>
                    {(filiere.cours || []).map((course, i) => (
                      <li key={i}>
                        <span className="cours-dot" style={{ backgroundColor: filiere.color || '#4f46e5' }}></span>
                        {course}
                      </li>
                    ))}
                  </ul>

                  <Link to={`/filiere/${filiere._id}`} className="filiere-link">
                    <button
                      className="filiere-button"
                      style={{ backgroundColor: filiere.color || '#4f46e5' }}
                    >
                      🚀 Découvrir la filière
                    </button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Filierez;
