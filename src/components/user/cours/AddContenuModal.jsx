import React, { useState, useEffect } from 'react';
import { Modal } from 'react-bootstrap';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import DeleteIcon from '@mui/icons-material/Delete';
import '../../../user.css';
import CancelIcon from '@mui/icons-material/Cancel';

const AddContenuModal = ({ show, handleClose, onContenuAdded, onContenuUpdated, isEdit = false, contenuToEdit = null }) => {
  const [contenu, setContenu] = useState([
    { titreChapitre: '', titreType: '', type: '', url: '', texte: '', duree: 0 },
  ]);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isEdit && contenuToEdit) {
      setContenu([{
        titreChapitre: contenuToEdit.titreChapitre || '',
        titreType: contenuToEdit.titreType || '',
        type: contenuToEdit.type || '',
        url: contenuToEdit.url || '',
        texte: contenuToEdit.texte || '',
        duree: Number(contenuToEdit.duree) || 0
      }]);
    } else {
      setContenu([{ titreChapitre: '', titreType: '', type: '', url: '', texte: '', duree: 0 }]);
    }
  }, [isEdit, contenuToEdit]);

  const handleContenuChange = (index, field, value) => {
    const newContenu = [...contenu];
    newContenu[index][field] = field === 'duree' ? Number(value) : value;
    setContenu(newContenu);
  };

  const addContenu = () => {
    if (isEdit) return;
    setContenu([
      ...contenu,
      { titreChapitre: '', titreType: '', type: '', url: '', texte: '', duree: 0 },
    ]);
  };

  const removeContenu = (index) => {
    if (isEdit) return;
    if (contenu.length === 1) {
      setError('Vous devez conserver au moins un chapitre.');
      return;
    }
    const newContenu = contenu.filter((_, i) => i !== index);
    setContenu(newContenu);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    const item = contenu[0];

    if (!item.titreChapitre || !item.titreType || !item.url) {
      setError('Veuillez remplir tous les champs requis (Titre du chapitre, Titre du type, URL).');
      return;
    }
    if (item.duree <= 0) {
      setError('La durée doit être supérieure à 0 minute.');
      return;
    }

    try {
      if (isEdit) {
        await onContenuUpdated(item);
      } else {
        for (const item of contenu) {
          if (item.duree <= 0) {
            setError('La durée de chaque chapitre doit être supérieure à 0 minute.');
            return;
          }
          await onContenuAdded(item);
        }
      }
      setContenu([{ titreChapitre: '', titreType: '', type: '', url: '', texte: '', duree: 0 }]);
      handleClose();
    } catch (err) {
      setError(err.message || 'Erreur lors de l\'opération');
    }
  };

  return (
    <Modal show={show} onHide={handleClose} size="lg" backdrop="static" style={{ zIndex: 1302 }}>
      <form onSubmit={handleSubmit}>
        <Modal.Header>
          <h2>{isEdit ? 'Modifier le chapitre' : 'Ajouter de nouveaux chapitres'}</h2>
        </Modal.Header>
        <Modal.Body>
          {error && <div className="error-message text-danger mb-3">{error}</div>}
          <div className="contenu-section">
            <h5>Chapitre du cours</h5>
            {contenu.map((item, index) => (
              <div key={index} className="contenu-item">
                <div className="form-section">
                  <label>Titre du Chapitre *</label>
                  <input
                    type="text"
                    value={item.titreChapitre}
                    onChange={(e) => handleContenuChange(index, 'titreChapitre', e.target.value)}
                    required
                  />
                </div>

                <div className="form-row">
                  <div className="form-section" style={{ flex: 1 }}>
                    <label>Titre du Type *</label>
                    <input
                      type="text"
                      value={item.titreType}
                      onChange={(e) => handleContenuChange(index, 'titreType', e.target.value)}
                      required
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
                      <option value="texte">Texte</option>
                      <option value="image">Image</option>
                    </select>
                  </div>
                </div>

                <div className="form-section">
                  <label>URL *</label>
                  <input
                    type="url"
                    value={item.url}
                    onChange={(e) => handleContenuChange(index, 'url', e.target.value)}
                    required
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
                    <label>Durée (minutes) *</label>
                    <input
                      type="number"
                      min="1"
                      step="1"
                      value={item.duree}
                      onChange={(e) => handleContenuChange(index, 'duree', e.target.value)}
                      required
                    />
                  </div>
                </div>

                {!isEdit && index > 0 && (
                  <button
                    type="button"
                    className="remove-button"
                    onClick={() => removeContenu(index)}
                  >
                    <DeleteIcon /> Supprimer ce chapitre
                  </button>
                )}
              </div>
            ))}

            {!isEdit && (
              <button type="button" className="add-button" onClick={addContenu}>
                <AddCircleIcon /> Ajouter un chapitre
              </button>
            )}
          </div>
        </Modal.Body>
        <Modal.Footer className="modal-footer">
          <button type="submit" className="submit-button">
            <AddCircleIcon /> {isEdit ? 'Modifier le chapitre' : 'Ajouter les chapitres'}
          </button>
          <button type="button" className="cancel-button" onClick={handleClose}>
            <CancelIcon /> Annuler
          </button>
        </Modal.Footer>
      </form>
    </Modal>
  );
};

export default AddContenuModal;