import React, { useState, useEffect } from 'react';
import { Modal, Form, Button, Alert } from 'react-bootstrap';
import { FilePond, registerPlugin } from 'react-filepond';
import 'filepond/dist/filepond.min.css';
import FilePondPluginImageExifOrientation from 'filepond-plugin-image-exif-orientation';
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css';
import axios from 'axios';
import CancelIcon from '@mui/icons-material/Cancel';
import SaveIcon from '@mui/icons-material/Save';

registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview);

const EditCoursEnseignant = ({ show, handleClose, course, handleUpdateCours }) => {
  const [files, setFiles] = useState([]);
  const [updatedCourse, setUpdatedCourse] = useState(course);
  const [error, setError] = useState('');

  useEffect(() => {
    console.log('Course prop received:', course);
    setUpdatedCourse(course);
    setFiles(course.imagecours ? [{ source: course.imagecours, options: { type: 'local' } }] : []);
    setError('');
  }, [course]);

  const handleSave = async (e) => {
    e.preventDefault();
    console.log('handleSave triggered with updatedCourse:', updatedCourse);

    if (!updatedCourse.nomcours || !updatedCourse.description || !updatedCourse.niveau) {
      console.log('Validation failed: Missing required fields');
      setError('Veuillez remplir tous les champs requis (Nom, Description, Niveau).');
      return;
    }

    try {
      console.log('Calling handleUpdateCours...');
      await handleUpdateCours(updatedCourse);
      console.log('handleUpdateCours completed successfully');
      handleClose();
    } catch (error) {
      console.error('Erreur lors de la mise à jour du cours:', error);
      setError('Erreur lors de la mise à jour du cours. Veuillez réessayer.');
    }
  };

  const serverOptions = () => ({
    load: (source, load) => {
      fetch(source)
        .then(res => res.blob())
        .then(load)
        .catch(err => console.error('Erreur lors du chargement de l\'image:', err));
    },
    process: (fieldName, file, metadata, load, error, abort) => {
      const data = new FormData();
      data.append('file', file);
      data.append('upload_preset', 'Ecommerce_cloudinary');
      data.append('cloud_name', 'iset-sfax');
      data.append('public_id', file.name);

      axios.post('https://api.cloudinary.com/v1_1/iset-sfax/image/upload', data)
        .then(res => res.data)
        .then(data => {
          setUpdatedCourse({ ...updatedCourse, imagecours: data.url });
          load(data);
        })
        .catch(err => {
          console.error('Erreur upload:', err);
          error('Échec du téléchargement');
          abort();
        });
    }
  });

  return (
    <Modal show={show} onHide={handleClose} size="lg" backdrop="static" style={{ zIndex: 1302 }}>
      <Modal.Header closeButton>
        <Modal.Title>Modifier le cours</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <Alert variant="danger" className="pre-wrap">{error}</Alert>}
        <Form onSubmit={handleSave}>
          <Form.Group className="mb-3">
            <Form.Label>Nom du cours *</Form.Label>
            <Form.Control
              type="text"
              value={updatedCourse.nomcours || ''}
              onChange={(e) => setUpdatedCourse({ ...updatedCourse, nomcours: e.target.value })}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Description *</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={updatedCourse.description || ''}
              onChange={(e) => setUpdatedCourse({ ...updatedCourse, description: e.target.value })}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Niveau *</Form.Label>
            <Form.Control
              as="select"
              value={updatedCourse.niveau || ''}
              onChange={(e) => setUpdatedCourse({ ...updatedCourse, niveau: e.target.value })}
              required
            >
              <option value="" disabled hidden>Sélectionner un niveau</option>
              <option value="debutant">Débutant</option>
              <option value="intermediaire">Intermédiaire</option>
              <option value="avancé">Avancé</option>
            </Form.Control>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Image du cours</Form.Label>
            <FilePond
              files={files}
              onupdatefiles={setFiles}
              allowImagePreview={true}
              allowMultiple={false}
              imagePreviewHeight={170}
              maxFiles={1}
              server={serverOptions()}
              labelIdle='Glissez & déposez une image ou <span class="filepond--label-action">cliquez ici</span>'
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer className="modal-footer">
        <Button variant="danger" onClick={handleClose}>
          <CancelIcon /> Annuler
        </Button>
        <Button variant="success" type="submit" onClick={handleSave}>
          <SaveIcon /> Sauvegarder
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default EditCoursEnseignant;