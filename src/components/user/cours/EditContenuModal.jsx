import React, { useState, useEffect } from 'react';
import { Modal } from 'react-bootstrap';
import { editContenuInCours } from '../../../services/courservice';
import '../../../user.css';

const EditContenuModal = ({ show, handleClose, coursId, contenu, onContenuUpdated }) => {
    const [formContenu, setFormContenu] = useState({
        titreChapitre: '',
        titreType: '',
        type: '',
        url: '',
        texte: '',
        duree: ''
    });
    const [error, setError] = useState('');

    useEffect(() => {
        if (contenu) {
            setFormContenu({
                titreChapitre: contenu.titreChapitre || '',
                titreType: contenu.titreType || '',
                type: contenu.type || '',
                url: contenu.url || '',
                texte: contenu.texte || '',
                duree: contenu.duree || ''
            });
        }
    }, [contenu]);

    const handleContenuChange = (field, value) => {
        setFormContenu((prev) => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError('');

        if (!coursId || !contenu?._id) {
            setError('Erreur : ID du cours ou du contenu manquant.');
            return;
        }

        if (!formContenu.titreChapitre || !formContenu.titreType || !formContenu.url || !formContenu.duree) {
            setError('Veuillez remplir tous les champs requis (Titre du chapitre, Titre du type, URL, Durée).');
            return;
        }

        try {
            const updatedCours = await editContenuInCours(coursId, contenu._id, formContenu);
            onContenuUpdated(updatedCours.cours || updatedCours);
            handleClose();
        } catch (err) {
            console.error('Erreur dans handleSubmit:', err);
            setError(err.message || 'Erreur lors de la mise à jour du contenu. Vérifiez votre connexion ou les données.');
        }
    };

    return (
     <Modal show={show} onHide={handleClose} size="lg" backdrop="static" style={{ zIndex: 1302 }}>
            <form onSubmit={handleSubmit} >
                <Modal.Header closeButton>
                    <h2>Modifier le chapitre</h2>
                </Modal.Header>
                <Modal.Body>
                    {error && <div className="error-message text-danger mb-3">{error}</div>}
                    <div className="contenu-item">
                        <div className="form-section">
                            <label>Titre du Chapitre *</label>
                            <input
                                type="text"
                                value={formContenu.titreChapitre}
                                onChange={(e) => handleContenuChange('titreChapitre', e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-row">
                            <div className="form-section" style={{ flex: 1 }}>
                                <label>Titre du Type *</label>
                                <input
                                    type="text"
                                    value={formContenu.titreType}
                                    onChange={(e) => handleContenuChange('titreType', e.target.value)}
                                    required
                                />
                            </div>
                            <div className="form-section" style={{ flex: 1 }}>
                                <label>Type</label>
                                <select
                                    value={formContenu.type}
                                    onChange={(e) => handleContenuChange('type', e.target.value)}
                                >
                                    <option value="">Sélectionner</option>
                                    <option value="video">Vidéo</option>
                                    <option value="pdf">PDF</option>

                                </select>
                            </div>
                        </div>
                        <div className="form-section">
                            <label>URL *</label>
                            <input
                                type="url"
                                value={formContenu.url}
                                onChange={(e) => handleContenuChange('url', e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-row">
                            <div className="form-section">
                                <label>Texte complémentaire</label>
                                <textarea
                                    value={formContenu.texte}
                                    onChange={(e) => handleContenuChange('texte', e.target.value)}
                                    rows="2"
                                />
                            </div>
                            <div className="form-section">
                                <label>Durée *</label>
                                <input
                                    type="text"
                                    value={formContenu.duree}
                                    onChange={(e) => handleContenuChange('duree', e.target.value)}
                                    placeholder="Ex: 15min"
                                    required
                                />
                            </div>
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer className="modal-footer">

                    <button
                        type="button"
                        className="cancel-button"
                        onClick={handleClose}
                    >
                        Annuler
                    </button>
                    <button type="submit" className="submit-button">
                        Mettre à jour le chapitre
                    </button>
                </Modal.Footer>
            </form>
        </Modal>
    );
};

export default EditContenuModal;