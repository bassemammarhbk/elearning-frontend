import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { editSousFiliere } from '../../../services/sousfiliereservice';
import { getfiliere } from '../../../services/filiereservice';
import { FilePond, registerPlugin } from 'react-filepond';
import 'filepond/dist/filepond.min.css';
import FilePondPluginImageExifOrientation from 'filepond-plugin-image-exif-orientation';
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css';
import '../admin.css';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Register FilePond plugins
registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview);

const EditSousFiliereAdmin = ({ show, onClose, onUpdate, fil }) => {
  const [data, setData] = useState(fil);
  const [files, setFiles] = useState([]);
  const [filieres, setFilieres] = useState([]);

  // Fetch filières for the dropdown
  useEffect(() => {
    const fetchFilieres = async () => {
      try {
        const res = await getfiliere();
        setFilieres(res.data);
      } catch (err) {
        console.error('Erreur au chargement des filières', err);
        toast.error('Erreur lors du chargement des filières');
      }
    };
    fetchFilieres();
  }, []);

  // Update data and files when fil prop changes
  useEffect(() => {
    setData(fil);
    if (fil.imageSousFiliere) {
      setFiles([
        {
          source: fil.imageSousFiliere,
          options: { type: 'local' },
        },
      ]);
    } else {
      setFiles([]);
    }
  }, [fil]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await editSousFiliere(data);
      onUpdate(res.data);
      onClose();
      toast.success('Sous-filière modifiée avec succès');
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la sous-filière', error);
      toast.error('Erreur lors de la mise à jour de la sous-filière');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  // FilePond server options for Cloudinary upload
  const serverOptions = () => ({
    load: (source, load, error, progress, abort, headers) => {
      fetch(source)
        .then((response) => response.blob())
        .then((blob) => load(blob))
        .catch((err) => {
          console.error('Erreur lors du chargement de l\'image', err);
          error('Erreur de chargement');
          abort();
        });
    },
    process: (fieldName, file, metadata, load, error, progress, abort) => {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', 'bsmammr');
      formData.append('cloud_name', 'dchbcbmr2');
      formData.append('public_id', `sousfiliere_${fil._id}_${file.name}`);

      fetch('https://api.cloudinary.com/v1_1/dchbcbmr2/image/upload', {
        method: 'POST',
        body: formData,
      })
        .then((response) => response.json())
        .then((responseData) => {
          if (responseData.secure_url) {
            setData({ ...data, imageSousFiliere: responseData.secure_url });
            load(responseData);
          } else {
            console.error('Erreur Cloudinary:', responseData);
            error('Erreur d\'upload');
            abort();
          }
        })
        .catch((err) => {
          console.error('Erreur lors de l\'upload:', err);
          error('Upload échoué');
          abort();
        });
    },
  });

  // Inline styles (matching EditfiliereAdmin for consistency)
  const inputStyle = {
    width: '100%',
    padding: '10px',
    marginBottom: '15px',
    border: '1px solid #ccc',
    borderRadius: '8px',
    fontSize: '16px',
    boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.1)',
    transition: 'border-color 0.3s ease-in-out',
  };

  const buttonStyle = {
    padding: '10px 20px',
    margin: '0 5px',
    borderRadius: '8px',
    border: 'none',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'background-color 0.3s, transform 0.2s ease-in-out',
  };

  const modifierButtonStyle = {
    ...buttonStyle,
    backgroundColor: '#28a745',
    color: 'white',
  };

  const annulerButtonStyle = {
    ...buttonStyle,
    backgroundColor: '#dc3545',
    color: 'white',
  };

  const modifierButtonHover = {
    backgroundColor: '#218838',
    transform: 'scale(1.05)',
  };

  const annulerButtonHover = {
    backgroundColor: '#c82333',
    transform: 'scale(1.05)',
  };

  return (
    <Modal show={show} onHide={onClose}>
      <Form onSubmit={handleSubmit}>
        <Modal.Header closeButton>
          <Modal.Title>Modifier sous-filière</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Filière </Form.Label>
            <Form.Select
              name="filiereId"
              value={data.filiereId?._id || data.filiereId || ''}
              onChange={handleChange}
              required
              style={inputStyle}
            >
              <option value="" disabled>Choisir une filière…</option>
              {filieres.map((filiere) => (
                <option key={filiere._id} value={filiere._id}>
                  {filiere.nomfiliere}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Nom</Form.Label>
            <Form.Control
              name="nomSousFiliere"
              value={data.nomSousFiliere || ''}
              onChange={handleChange}
              required
              style={inputStyle}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="description"
              value={data.description || ''}
              onChange={handleChange}
              style={inputStyle}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Image de la sous-filière</Form.Label>
            <div style={{ width: '80%', margin: 'auto', padding: '1%' }}>
              <FilePond
                files={files}
                acceptedFileTypes={['image/*']}
                onupdatefiles={setFiles}
                allowMultiple={false}
                server={serverOptions()}
                name="file"
                labelIdle='Glissez-déposez votre image ou <span class="filepond--label-action">Parcourir</span>'
              />
            </div>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={onClose}
            style={annulerButtonStyle}
            onMouseOver={(e) => Object.assign(e.target.style, annulerButtonHover)}
            onMouseOut={(e) => Object.assign(e.target.style, annulerButtonStyle)}
          >
            <CancelIcon /> Annuler
          </Button>
          <Button
            type="submit"
            variant="primary"
            style={modifierButtonStyle}
            onMouseOver={(e) => Object.assign(e.target.style, modifierButtonHover)}
            onMouseOut={(e) => Object.assign(e.target.style, modifierButtonStyle)}
          >
            <SaveIcon /> Mettre à jour
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default EditSousFiliereAdmin;