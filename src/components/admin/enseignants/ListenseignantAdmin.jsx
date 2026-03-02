import React, { useEffect, useState } from 'react';
import AfficheenseignantsAdmin from './AfficheenseignantsAdmin';
import EditEnseignantModal from './EditenseignantAdmin';
import { CircularProgress, Snackbar, Alert } from '@mui/material';
import { getEnseignants, toggleUserStatus, editUsers, deleteUsers } from '../../../services/userservice';

const ListenseignantsAdmin = () => {
  const [enseignants, setEnseignants] = useState([]);
  const [isPending, setIsPending] = useState(true);
  const [error, setError] = useState(null);
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastSeverity, setToastSeverity] = useState('success');
  const [editingEnseignant, setEditingEnseignant] = useState(null);

  const handleGetEnseignants = async () => {
    setIsPending(true);
    try {
      const res = await getEnseignants();
      console.log('Fetched enseignants:', res.data); // Debug log
      setEnseignants(res.data);
    } catch (err) {
      console.error(err);
      setError('Erreur lors du chargement des enseignants');
    } finally {
      setIsPending(false);
    }
  };

  const handleDisable = async (enseignant) => {
    try {
      await toggleUserStatus(enseignant.userId._id);
      await handleGetEnseignants();
      setToastMessage('Statut mis à jour avec succès');
      setToastSeverity('success');
      setToastOpen(true);
    } catch (err) {
      console.error('Toggle status error:', err);
      setToastMessage('Erreur lors de la mise à jour du statut');
      setToastSeverity('error');
      setToastOpen(true);
    }
  };

  const handleDelete = async (enseignant) => {
    try {
      console.log('Deleting enseignant with userId:', enseignant.userId._id); // Debug log
      await deleteUsers(enseignant.userId._id);
      await handleGetEnseignants();
      setToastMessage('Enseignant supprimé avec succès');
      setToastSeverity('success');
      setToastOpen(true);
    } catch (err) {
      console.error('Delete error:', err);
      setToastMessage('Erreur lors de la suppression de l\'enseignant');
      setToastSeverity('error');
      setToastOpen(true);
    }
  };

  const handleEditClick = (enseignant) => {
    setEditingEnseignant(enseignant);
  };

  const handleSaveEdit = async (updated) => {
    try {
      await editUsers(updated.userId);
      setEditingEnseignant(null);
      await handleGetEnseignants();
      setToastMessage('Enseignant modifié avec succès');
      setToastSeverity('success');
      setToastOpen(true);
    } catch (err) {
      console.error('Error updating user:', err);
      setToastMessage('Erreur lors de la modification de l\'enseignant');
      setToastSeverity('error');
      setToastOpen(true);
    }
  };

  const handleCloseToast = () => setToastOpen(false);

  useEffect(() => {
    handleGetEnseignants();
  }, []);

  if (isPending) return (
    <div style={{ display: 'flex', justifyContent: 'center', margin: '20px' }}>
      <CircularProgress color="primary" size={40} />
    </div>
  );

  if (error) return (
    <div style={{ color: 'red', textAlign: 'center', marginTop: '20px' }}>
      {error}
    </div>
  );

  return (
    <div>
      <h1 style={{ textAlign: 'center', marginBottom: '20px' }}>Liste des Enseignants</h1>
      <AfficheenseignantsAdmin
        enseignants={enseignants}
        onDisable={handleDisable}
        onEdit={handleEditClick}
        onDelete={handleDelete}
      />
      <EditEnseignantModal
        open={Boolean(editingEnseignant)}
        enseignant={editingEnseignant}
        onClose={() => setEditingEnseignant(null)}
        onSave={handleSaveEdit}
      />
      <Snackbar
        open={toastOpen}
        autoHideDuration={3000}
        onClose={handleCloseToast}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseToast} severity={toastSeverity} sx={{ width: '100%' }}>
          {toastMessage}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default ListenseignantsAdmin;