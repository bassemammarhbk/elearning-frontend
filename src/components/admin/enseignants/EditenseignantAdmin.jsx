import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';

const EditEnseignantModal = ({ open, onClose, enseignant, onSave }) => {
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    email: '',
    tel: '',
    sexe: '',
  });

  useEffect(() => {
    if (enseignant && enseignant.userId) {
      const { firstname = '', lastname = '', email = '', tel = '', sexe = '' } = enseignant.userId;
      // Normalize sexe value to match select options
      const normalizedSexe =
        sexe === 'Homme' || sexe === 'M' ? 'homme' :
        sexe === 'Femme' || sexe === 'F' ? 'femme' :
        sexe || '';
      setFormData({ firstname, lastname, email, tel, sexe: normalizedSexe });
      console.log('enseignant.userId:', enseignant.userId); // Debug log
      console.log('formData.sexe:', normalizedSexe); // Debug log
    }
  }, [enseignant]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    console.log('Selected sexe:', value); // Debug log for change
  };

  const handleSubmit = () => {
    onSave({ ...enseignant, userId: { ...enseignant.userId, ...formData } });
    onClose();
  };

  return (
    <Modal show={open} onHide={onClose} centered size="md">
      <Modal.Header closeButton>
        <Modal.Title>Modifier l'enseignant</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Prénom</Form.Label>
            <Form.Control
              type="text"
              name="firstname"
              value={formData.firstname}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Nom</Form.Label>
            <Form.Control
              type="text"
              name="lastname"
              value={formData.lastname}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              disabled
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Téléphone</Form.Label>
            <Form.Control
              type="text"
              name="tel"
              value={formData.tel}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Sexe</Form.Label>
            <Form.Select
              name="sexe"
              value={formData.sexe || ''}
              onChange={handleChange}
            >

              <option value="homme">Homme</option>
              <option value="femme">Femme</option>
            </Form.Select>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="danger" onClick={onClose}>
          <CancelIcon/>
                      &nbsp;
          Annuler
        </Button>
        <Button variant="success" onClick={handleSubmit}>
          <SaveIcon/>
          &nbsp;
          Enregistrer
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default EditEnseignantModal;