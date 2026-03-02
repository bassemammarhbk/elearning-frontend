import React, { useEffect, useState } from 'react';
import AfficheetudiantsAdmin from './AfficheetudiantsAdmin';
import EditetudiantsModal from './Editetudiants';
import { CircularProgress, Snackbar, Alert } from '@mui/material';
import { getEtudiants, toggleUserStatus, editUsers, deleteUsers } from '../../../services/userservice';

const ListetudiantsAdmin = () => {
  const [etudiants, setEtudiants] = useState([]);
  const [isPending, setIsPending] = useState(true);
  const [error, setError] = useState(null);
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastSeverity, setToastSeverity] = useState('success');
  const [editingEtudiant, setEditingEtudiant] = useState(null);

  const handleGetEtudiants = async () => {
    setIsPending(true);
    try {
      const res = await getEtudiants();
      setEtudiants(res.data);
      setError(null);
    } catch (err) {
      console.error(err);
      setError('Erreur lors du chargement des étudiants');
    } finally {
      setIsPending(false);
    }
  };

  const handleDisable = async (etudiant) => {
    try {
      await toggleUserStatus(etudiant.userId._id);
      await handleGetEtudiants();
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

  const handleDelete = async (etudiant) => {
    try {
      await deleteUsers(etudiant.userId._id);
      await handleGetEtudiants();
      setToastMessage('Étudiant supprimé avec succès');
      setToastSeverity('success');
      setToastOpen(true);
    } catch (err) {
      console.error('Delete error:', err);
      setToastMessage('Erreur lors de la suppression de l\'étudiant');
      setToastSeverity('error');
      setToastOpen(true);
    }
  };

  const handleEditClick = (etudiant) => {
    setEditingEtudiant(etudiant);
  };

  const handleSaveEdit = async (updated) => {
    try {
      await editUsers(updated.userId);
      setEditingEtudiant(null);
      await handleGetEtudiants();
      setToastMessage('Étudiant modifié avec succès');
      setToastSeverity('success');
      setToastOpen(true);
    } catch (err) {
      console.error('Erreur lors de la modification:', err);
      setToastMessage('Erreur lors de la modification de l\'étudiant');
      setToastSeverity('error');
      setToastOpen(true);
    }
  };

  const handleCloseToast = () => setToastOpen(false);

  useEffect(() => {
    handleGetEtudiants();
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
      <h1 style={{ textAlign: 'center', marginBottom: '20px' }}>Liste des Étudiants</h1>
      <AfficheetudiantsAdmin
        etudiant={etudiants}
        onDisable={handleDisable}
        onEdit={handleEditClick}
        onDelete={handleDelete}
      />
      <EditetudiantsModal
        open={Boolean(editingEtudiant)}
        etudiant={editingEtudiant}
        onClose={() => setEditingEtudiant(null)}
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

export default ListetudiantsAdmin;