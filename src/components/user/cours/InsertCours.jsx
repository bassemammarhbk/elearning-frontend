import React, { useState, useEffect } from 'react';
import { Modal } from 'react-bootstrap';
import { addcours } from '../../../services/courservice';
import { getsousfilieresByFiliereId } from '../../../services/sousfiliereservice';
import InsertQuiz from './InsertQuiz';
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import '../../../user.css';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import DeleteIcon from '@mui/icons-material/Delete';
import CancelIcon from '@mui/icons-material/Cancel';
import SaveIcon from '@mui/icons-material/Save';

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

const InsertCours = ({ show, handleClose, filiereId, onCoursAdded }) => {
  const [cours, setCours] = useState({
    nomcours: '',
    duree: 0,
    niveau: '',
    description: '',
    imagecours: '',
    filiereId: filiereId || '',
    sousFiliereId: '',
    contenu: []
  });

  const [sousFilieres, setSousFilieres] = useState([]);
  const [error, setError] = useState('');
  const [newCoursId, setNewCoursId] = useState(null);
  const [showQuizModal, setShowQuizModal] = useState(false);

  useEffect(() => {
    setCours(prev => ({ ...prev, filiereId }));

    if (filiereId) {
      getsousfilieresByFiliereId(filiereId)
        .then((res) => {
          if (res.data) {
            setSousFilieres(res.data);
          }
        })
        .catch((err) => {
          console.error('Erreur chargement sous-filières:', err);
        });
    }
  }, [filiereId]);

  const handleSubmit = async (event) => {
  event.preventDefault();

  // Validation de la durée
  if (cours.duree < 0) {
    setError("La durée du cours ne peut pas être négative.");
    return;
  }
  if (cours.contenu.some(item => item.duree < 0)) {
    setError("La durée d'un chapitre ne peut pas être négative.");
    return;
  }

  // Clone des données pour éviter le reset prématuré
  const coursToCreate = { ...cours };

  // Fermeture du modal et affichage temporaire
  handleClose();
  onCoursAdded({ ...coursToCreate, _id: `temp-${Date.now()}` });

  try {
    // Envoi de la requête avec la copie
    const res = await addcours(coursToCreate);
    const realId = res.data?.cours?._id;
    if (!realId) throw new Error("Pas d'ID renvoyé");

    setNewCoursId(realId);
    setShowQuizModal(true);

    // Reset du formulaire après succès
    resetForm();
  } catch (err) {
    console.error(err);
    toast.error("Erreur création cours, réessayez.");
    // Ici, tu peux rouvrir le modal si besoin : handleShow();
  }
};


  const resetForm = () => {
    setCours({
      nomcours: '',
      duree: 0,
      niveau: '',
      description: '',
      imagecours: '',
      filiereId: filiereId,
      sousFiliereId: '',
      contenu: []
    });
    setError('');
  };

  const handleContenuChange = (index, field, value) => {
    const newContenu = [...cours.contenu];
    // Convertir la durée en nombre si c'est le champ concerné
    newContenu[index][field] = field === 'duree' ? Number(value) : value;
    setCours({ ...cours, contenu: newContenu });
  };

  const addContenu = () => {
    setCours({
      ...cours,
      contenu: [
        ...cours.contenu,
        { titreChapitre: '', titreType: '', type: '', url: '', texte: '', duree: 0 }
      ]
    });
  };

  const removeContenu = (index) => {
    const newContenu = cours.contenu.filter((_, i) => i !== index);
    setCours({ ...cours, contenu: newContenu });
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const data = new FormData();
    data.append('file', file);
    data.append('upload_preset', 'bsmammr');

    try {
      const response = await fetch('https://api.cloudinary.com/v1_1/dchbcbmr2/image/upload', {
        method: 'POST',
        body: data,
      });
      const result = await response.json();
      if (result.secure_url) {
        setCours(prev => ({ ...prev, imagecours: result.secure_url }));
      } else {
        setError("Échec de l'upload de l'image");
      }
    } catch (err) {
      console.error('Erreur upload :', err);
      setError("Erreur lors de l'upload de l'image");
    }
  };

  return (
    <>
      <Modal show={show} onHide={handleClose} size="lg" backdrop="static" style={{ zIndex: 1302 }}>
        <form onSubmit={handleSubmit}>
          <Modal.Header>
            <h2>Ajouter un Cours</h2>
          </Modal.Header>

          <Modal.Body>
            {error && <div className="error-message">{error}</div>}

            <div className="form-section">
              <label>Nom du Cours *</label>
              <input
                type="text"
                required
                value={cours.nomcours}
                onChange={(e) => setCours({ ...cours, nomcours: e.target.value })}
              />
            </div>

            <div className="form-section">
              <label>Description</label>
              <textarea
                value={cours.description}
                onChange={(e) => setCours({ ...cours, description: e.target.value })}
                rows="3"
              />
            </div>

            <div className="form-row">
              <div className="form-section">
                <label>Durée (heures) *</label>
                <input
                  type="number"
                  required
                  min="0"
                  step="0.5"
                  value={cours.duree}
                  onChange={(e) => setCours({ ...cours, duree: Number(e.target.value) })}
                  placeholder="Ex: 30"
                />
              </div>

              <div className="form-section">
                <label>Niveau *</label>
                <select
                  value={cours.niveau}
                  onChange={(e) => setCours({ ...cours, niveau: e.target.value })}
                  required
                >
                  <option value="">Sélectionner</option>
                  <option value="debutant">Débutant</option>
                  <option value="intermediaire">Intermédiaire</option>
                  <option value="avancé">Avancé</option>
                </select>
              </div>
            </div>

            <div className="form-section">
              <label>Sous-Filière *</label>
              <select
                value={cours.sousFiliereId}
                onChange={(e) => setCours({ ...cours, sousFiliereId: e.target.value })}
                required
              >
                <option value="">Sélectionnez une sous-filière</option>
                {sousFilieres.map((sf) => (
                  <option key={sf._id} value={sf._id}>
                    {sf.nomSousFiliere}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-section">
              <label>Image du cours</label>
              <Button
                component="label"
                role={undefined}
                variant="contained"
                tabIndex={-1}
                startIcon={<CloudUploadIcon />}
              >
                Télécharger l'image
                <VisuallyHiddenInput
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                />
              </Button>
              {cours.imagecours && (
                <div className="image-preview mt-2">
                  <img
                    src={cours.imagecours}
                    alt="Aperçu"
                    style={{ maxWidth: '200px', maxHeight: '200px' }}
                  />
                </div>
              )}
            </div>

            <div className="contenu-section">
              <h5>Chapitre du cours</h5>
              {cours.contenu.map((item, index) => (
                <div key={index} className="contenu-item">
                  <div className="form-section">
                    <label>Titre du Chapitre</label>
                    <input
                      type="text"
                      value={item.titreChapitre}
                      onChange={(e) => handleContenuChange(index, 'titreChapitre', e.target.value)}
                    />
                  </div>

                  <div className="form-row">
                    <div className="form-section" style={{ flex: 1 }}>
                      <label>Titre du Type</label>
                      <input
                        type="text"
                        value={item.titreType}
                        onChange={(e) => handleContenuChange(index, 'titreType', e.target.value)}
                      />
                    </div>

                    <div className="form-section" style={{ flex: 1 }}>
                      <label>Type</label>
                      <select
                        value={item.type}
                        onChange={(e) => handleContenuChange(index, 'type', e.target.value)}
                      >
                        <option value="">Sélectionner</option>
                        <option value="video">Vidéo</option>
                        <option value="pdf">PDF</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-section">
                    <label>URL</label>
                    <input
                      type="url"
                      value={item.url}
                      onChange={(e) => handleContenuChange(index, 'url', e.target.value)}
                    />
                  </div>

                  <div className="form-row">
                    <div className="form-section">
                      <label>Texte complémentaire</label>
                      <textarea
                        value={item.texte}
                        onChange={(e) => handleContenuChange(index, 'texte', e.target.value)}
                        rows="2"
                      />
                    </div>

                    <div className="form-section">
                      <label>Durée (minutes)</label>
                      <input
                        type="number"
                        min="0"
                        step="1"
                        value={item.duree}
                        onChange={(e) => handleContenuChange(index, 'duree', e.target.value)}
                        placeholder="Ex: 15"
                      />
                    </div>
                  </div>

                  <button
                    type="button"
                    className="remove-button"
                    onClick={() => removeContenu(index)}
                  >
                    <DeleteIcon />
                    Supprimer ce chapitre
                  </button>
                </div>
              ))}

              <button type="button" className="add-button" onClick={addContenu}>
                <AddCircleIcon />
                Ajouter un chapitre
              </button>
            </div>
          </Modal.Body>

          <Modal.Footer className="modal-footer">
            <button type="submit" className="submit-button">
              Créer le cours
            </button>
            <button type="button" className="cancel-button" onClick={handleClose}>
              <CancelIcon />
              Annuler
            </button>
          </Modal.Footer>
        </form>
      </Modal>

      <InsertQuiz
        show={showQuizModal}
        handleClose={() => setShowQuizModal(false)}
        courseId={newCoursId}
        style={{ zIndex: 1302 }}
      />
    </>
  );
};

export default InsertCours;