import React, { useEffect, useState } from 'react';
import { Modal } from 'react-bootstrap';
import { addfiliere } from "../../../services/filiereservice";
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

registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview);

const InsertfiliereAdmin = ({ show, handleAddFiliere, handleClose }) => {
  const [filiere, setFiliere] = useState({});
  const [files, setFiles] = useState([]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const res = await addfiliere(filiere);
      handleAddFiliere(res.data);
      toast.success('Filière ajoutée avec succès');
      handleClose();
      setFiliere({});
    } catch (err) {
      console.error('Erreur lors de l\'ajout de la filière:', err);
      toast.error('Erreur lors de l\'ajout de la filière');
    }
  };

  const serverOptions = () => ({
    process: (fieldName, file, metadata, load, error, progress, abort) => {
      const data = new FormData();
      data.append('file', file);
      data.append('upload_preset', 'bsmammr');
      fetch('https://api.cloudinary.com/v1_1/dchbcbmr2/image/upload', {
        method: 'POST',
        body: data
      })
        .then(res => res.json())
        .then(data => {
          setFiliere({ ...filiere, imagefiliere: data.secure_url });
          load(data);
        })
        .catch(err => {
          console.error(err);
          error('Upload échoué');
          abort();
        });
    }
  });

  return (
    <Modal
      show={show}
      onHide={handleClose}
      centered
      dialogClassName="insert-filiere-modal"
    >
      <form className="insert-filiere-form" onSubmit={handleSubmit}>
        <Modal.Header closeButton className="iff-header">
          <h3>🆕 Nouvelle Filière</h3>
        </Modal.Header>

        <Modal.Body className="iff-body">
          <div className="iff-group">
            <label htmlFor="nomfiliere">Nom de la Filière</label>
            <input
              id="nomfiliere"
              type="text"
              required
              value={filiere.nomfiliere || ''}
              onChange={e => setFiliere({ ...filiere, nomfiliere: e.target.value })}
            />
          </div>

          <div className="iff-group">
            <label htmlFor="descriptionfiliere">Description</label>
            <textarea
              id="descriptionfiliere"
              rows={3}
              value={filiere.descriptionfiliere || ''}
              onChange={e => setFiliere({ ...filiere, descriptionfiliere: e.target.value })}
            />
          </div>

          <div className="iff-group">
            <label>Image de la Filière</label>
            <FilePond
              files={files}
              allowMultiple={false}
              acceptedFileTypes={['image/*']}
              onupdatefiles={setFiles}
              server={serverOptions()}
              name="file"
              className="iff-filepond"
            />
          </div>
        </Modal.Body>

        <Modal.Footer className="iff-footer">
          <button type="button" className="iff-btn cancel" onClick={handleClose}>
            <CancelIcon /> Annuler
          </button>
          <button type="submit" className="iff-btn submit">
            <SaveIcon /> Enregistrer
          </button>
        </Modal.Footer>
      </form>
    </Modal>
  );
};

export default InsertfiliereAdmin;