import React, { useEffect, useState } from 'react';
import { Modal } from 'react-bootstrap';
import { editfiliere } from "../../../services/filiereservice";
import { FilePond, registerPlugin } from 'react-filepond';
import 'filepond/dist/filepond.min.css';
import axios from "axios";
import FilePondPluginImageExifOrientation from 'filepond-plugin-image-exif-orientation';
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css';
import { Description, Update } from '@mui/icons-material';
import '../admin.css';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview);

const EditfiliereAdmin = ({ fil, show, handleClose, handleUpdateFiliere }) => {
  const [files, setFiles] = useState([]);
  const [filieres, setFilieres] = useState(fil);

  useEffect(() => {
    setFiles([
      {
        source: filieres.imagefiliere,
        options: { type: 'local' }
      }
    ]);
  }, [filieres]);

  const handleUpdate = async (event) => {
    event.preventDefault();
    try {
      const res = await editfiliere(filieres);
      handleUpdateFiliere(res.data);
      toast.success('Filière modifiée avec succès');
      handleClose();
      setFilieres({});
    } catch (err) {
      console.error('Erreur lors de la modification de la filière:', err);
      toast.error('Erreur lors de la modification de la filière');
    }
  };

  const serverOptions = () => {
    return {
      load: (source, load, error, progress, abort, headers) => {
        var myRequest = new Request(source);
        fetch(myRequest).then(function (response) {
          response.blob().then(function (myBlob) {
            load(myBlob);
          });
        });
      },
      process: (fieldName, file, metadata, load, error, progress, abort) => {
        const data = new FormData();
        data.append('file', file);
        data.append('upload_preset', 'bsmammr');
        data.append('cloud_name', 'dchbcbmr2');
        data.append('public_id', file.name);

        fetch('https://api.cloudinary.com/v1_1/dchbcbmr2/image/upload', {
          method: 'POST',
          body: data
        })
          .then(response => response.json())
          .then(data => {
            if (data.secure_url) {
              setFilieres({ ...filieres, imagefiliere: data.secure_url });
              load(data);
            } else {
              console.error("Erreur Cloudinary :", data);
              error('Erreur d\'upload');
              abort();
            }
          })
          .catch(err => {
            console.error("Erreur Fetch :", err);
            error('Upload échoué');
            abort();
          });
      }
    };
  };

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
    <div>
      <Modal
        show={show}
        onHide={handleClose}
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 1301,
          maxHeight: '90vh',
          overflowY: 'auto',
        }}
      >
        <Modal.Header closeButton><h2>Modifier Filière</h2></Modal.Header>
        <Modal.Body>
          <label htmlFor="nomfiliere"></label>
          <input
            type="text"
            value={filieres.nomfiliere}
            id="nomfiliere"
            onChange={(e) => setFilieres({ ...filieres, nomfiliere: e.target.value })}
            placeholder="Entrer le nouveau nom"
            style={inputStyle}
          />
          <label htmlFor="descrifiliere"></label>
          <input
            type="text"
            value={filieres.descriptionfiliere}
            id="descrifiliere"
            onChange={(e) => setFilieres({ ...filieres, descriptionfiliere: e.target.value })}
            placeholder="Entrer la description"
            style={inputStyle}
          />
          <label htmlFor="prix">Image</label>
          <div style={{ width: "80%", margin: "auto", padding: "1%" }}>
            <FilePond
              files={files}
              acceptedFileTypes="image/*"
              onupdatefiles={setFiles}
              allowMultiple={true}
              server={serverOptions()}
              name="file"
            />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <button
            type="button"
            onClick={handleClose}
            style={annulerButtonStyle}
            onMouseOver={(e) => Object.assign(e.target.style, annulerButtonHover)}
            onMouseOut={(e) => Object.assign(e.target.style, annulerButtonStyle)}
          >
            <CancelIcon /> Annuler
          </button>
          <button
            type="button"
            onClick={handleUpdate}
            style={modifierButtonStyle}
            onMouseOver={(e) => Object.assign(e.target.style, modifierButtonHover)}
            onMouseOut={(e) => Object.assign(e.target.style, modifierButtonStyle)}
          >
            <SaveIcon /> Modifier
          </button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default EditfiliereAdmin;