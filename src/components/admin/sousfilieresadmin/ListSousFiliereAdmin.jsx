import React, { useEffect, useState } from 'react';
import { CircularProgress } from '@mui/material';
import { Modal, Button } from 'react-bootstrap';
import AfficheSousFiliereAdmin from './AfficheSousFiliereAdmin';
import InsertSousFiliereAdmin from './InsertSousFiliereAdmin';
import { getSousFilieres, deleteSousFiliere } from '../../../services/sousfiliereservice';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import PrintIcon from '@mui/icons-material/Print';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ListSousFiliereAdmin = ({ filiereId }) => {
  const [sousFilieres, setSousFilieres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showInsert, setShowInsert] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const fetch = async () => {
    try {
      const res = await getSousFilieres(filiereId);
      setSousFilieres(res.data);
    } catch (e) {
      setError(e);
      toast.error('Erreur lors du chargement des sous-filières');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetch();
  }, [filiereId]);

  const handleAdd = (sf) => {
    setSousFilieres([sf, ...sousFilieres]);
    toast.success('Sous-filière ajoutée avec succès');
  };

  const handleUpdate = (sf) => {
    setSousFilieres(sousFilieres.map((x) => (x._id === sf._id ? sf : x)));
  };

  const handleDelete = (id) => {
    setDeleteId(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      await deleteSousFiliere(deleteId);
      setSousFilieres(sousFilieres.filter((x) => x._id !== deleteId));
      setShowDeleteModal(false);
      setDeleteId(null);
      toast.success('Sous-filière supprimée avec succès');
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      setError(error);
      toast.error('Erreur lors de la suppression de la sous-filière');
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setDeleteId(null);
  };

  return (
    <div style={{ margin: 20 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
        <button
          style={{
            padding: '10px 20px',
            backgroundColor: '#28a745',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            fontSize: '16px',
            cursor: 'pointer',
            transition: 'background-color 0.3s ease, transform 0.3s ease',
          }}
          onClick={() => setShowInsert(true)}
          className="btn btn-success"
        >
          <AddCircleIcon /> Sous-filière
        </button>
        <button
          type="button"
          onClick={() => window.print()}
          style={{
            padding: '10px 20px',
            backgroundColor: '#007bff',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            fontSize: '16px',
            cursor: 'pointer',
            transition: 'background-color 0.3s ease, transform 0.3s ease',
          }}
        >
          <PrintIcon /> Imprimer
        </button>
      </div>
      {loading ? (
        <CircularProgress />
      ) : error ? (
        <div>Erreur: {error.message}</div>
      ) : (
        <div>
          <h1 style={{ textAlign: 'center', marginBottom: '20px' }}>Liste des Sous-Filières</h1>
          <AfficheSousFiliereAdmin
            sousFilieres={sousFilieres}
            onEdit={handleUpdate}
            onDelete={handleDelete}
          />
        </div>
      )}
      {showInsert && (
        <InsertSousFiliereAdmin
          show={showInsert}
          filiereId={filiereId}
          onAdd={handleAdd}
          onClose={() => setShowInsert(false)}
        />
      )}
      <Modal show={showDeleteModal} onHide={cancelDelete} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirmer la suppression</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Êtes-vous sûr de vouloir supprimer cette sous-filière ? Cette action est irréversible.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={cancelDelete}>
            Annuler
          </Button>
          <Button variant="danger" onClick={confirmDelete}>
            Supprimer
          </Button>
        </Modal.Footer>
      </Modal>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
      />
    </div>
  );
};

export default ListSousFiliereAdmin;