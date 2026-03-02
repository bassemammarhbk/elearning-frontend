import React, { useState, useMemo } from 'react';
import { MaterialReactTable, useMaterialReactTable } from 'material-react-table';
import {
  Stack,
  IconButton,
  Typography,
  Snackbar,
  Alert,
  Tooltip,
} from '@mui/material';
import { Modal, Button } from 'react-bootstrap';
import EditIcon from '@mui/icons-material/Edit';
import BlockIcon from '@mui/icons-material/Block';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DeleteIcon from '@mui/icons-material/Delete';

const AfficheetudiantsAdmin = ({ etudiant, onEdit, onDisable, onDelete }) => {
  const [etudiantToToggle, setEtudiantToToggle] = useState(null);
  const [etudiantToDelete, setEtudiantToDelete] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  const handleToggleClick = (etud) => {
    setEtudiantToToggle(etud);
    setConfirmOpen(true);
  };

  const handleDeleteClick = (etud) => {
    setEtudiantToDelete(etud);
    setDeleteConfirmOpen(true);
  };

  const handleConfirmCancel = () => {
    setEtudiantToToggle(null);
    setConfirmOpen(false);
  };

  const handleDeleteCancel = () => {
    setEtudiantToDelete(null);
    setDeleteConfirmOpen(false);
  };

  const handleConfirmToggle = () => {
    if (etudiantToToggle) {
      onDisable(etudiantToToggle);
      const action = etudiantToToggle.userId?.isActive ? 'désactivé' : 'activé';
      setSnackbarMessage(`Le compte a été ${action} avec succès`);
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
    }
    setConfirmOpen(false);
  };

  const handleConfirmDelete = () => {
    if (etudiantToDelete) {
      onDelete(etudiantToDelete);
      setSnackbarMessage('Étudiant supprimé avec succès');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
    }
    setDeleteConfirmOpen(false);
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const columns = useMemo(
    () => [
      {
        accessorFn: (row) =>
          row.userId
            ? `${row.userId.firstname || ''} ${row.userId.lastname || ''}`.trim()
            : 'N/A',
        header: 'Nom complet',
      },
      {
        accessorKey: 'userId.email',
        header: 'Email',
      },
      {
        accessorKey: 'userId.sexe',
        header: 'Sexe',
        Cell: ({ cell }) => cell.getValue() ?? 'N/A',
      },
      {
        accessorKey: 'userId.tel',
        header: 'Téléphone',
        Cell: ({ cell }) => cell.getValue() ?? 'N/A',
      },
      {
        accessorFn: (row) => row.coursInscri?.length ?? 0,
        header: 'Cours inscrits',
      },
      {
        accessorKey: 'userId.avatar',
        header: 'Avatar',
        Cell: ({ cell }) => {
          const src = cell.getValue();
          return src ? (
            <img
              src={src}
              alt="avatar"
              height={40}
              width={40}
              style={{ borderRadius: '50%' }}
            />
          ) : (
            'N/A'
          );
        },
      },
      {
        accessorKey: 'userId.isActive',
        header: 'Statut',
        Cell: ({ cell }) => {
          const isActive = cell.getValue() !== false;
          return (
            <Typography
              color={isActive ? 'success.main' : 'error.main'}
              fontWeight="bold"
            >
              {isActive ? 'Actif' : 'Désactivé'}
            </Typography>
          );
        },
      },
      {
        id: 'actions',
        header: 'Actions',
        Cell: ({ row }) => {
          const etud = row.original;
          const isActive = etud.userId?.isActive ?? true;

          return (
            <Stack direction="row" spacing={1}>
              <Tooltip title={isActive ? 'Désactiver' : 'Activer'} arrow>
                <IconButton
                  onClick={() => handleToggleClick(etud)}
                  sx={{
                    backgroundColor: isActive ? '#ff9800' : '#4caf50',
                    color: 'white',
                    '&:hover': {
                      backgroundColor: isActive ? '#fb8c00' : '#388e3c',
                    },
                  }}
                >
                  {isActive ? <BlockIcon /> : <CheckCircleIcon />}
                </IconButton>
              </Tooltip>
              <Tooltip title="Supprimer" arrow>
                <IconButton
                  onClick={() => handleDeleteClick(etud)}
                  sx={{
                    backgroundColor: 'red',
                    color: 'white',
                    '&:hover': {
                      backgroundColor: '#cc0000',
                    },
                  }}
                >
                  <DeleteIcon />
                </IconButton>
              </Tooltip>
            </Stack>
          );
        },
        size: 150,
        enableColumnResizing: false,
      },
    ],
    [onEdit, onDisable, onDelete]
  );

  const table = useMaterialReactTable({
    columns,
    data: etudiant,
    initialState: { density: 'comfortable' },
    enableColumnResizing: false,
    muiTablePaperProps: {
      sx: { width: '100%', overflowX: 'auto' },
    },
    muiTableContainerProps: {
      sx: { maxHeight: 'calc(100vh - 64px)', overflowY: 'auto' },
    },
  });

  return (
    <>
      <div style={{ margin: '20px' }}>
        <MaterialReactTable table={table} />
      </div>

      {/* Modale de confirmation pour Activer/Désactiver */}
      <Modal show={confirmOpen} onHide={handleConfirmCancel} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            {etudiantToToggle?.userId?.isActive
              ? 'Confirmation de désactivation'
              : 'Confirmation d\'activation'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {etudiantToToggle && (
            <Typography>
              Êtes-vous sûr(e) de vouloir {etudiantToToggle.userId?.isActive ? 'désactiver' : 'activer'} le compte de
              <strong>
                {etudiantToToggle.userId?.firstname || ''} {etudiantToToggle.userId?.lastname || ''}
              </strong>
              ?
            </Typography>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleConfirmCancel}>
            Annuler
          </Button>
          <Button
            variant={etudiantToToggle?.userId?.isActive ? 'danger' : 'success'}
            onClick={handleConfirmToggle}
          >
            {etudiantToToggle?.userId?.isActive ? 'Désactiver' : 'Activer'}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modale de confirmation pour Supprimer */}
      <Modal show={deleteConfirmOpen} onHide={handleDeleteCancel} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirmation de suppression</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {etudiantToDelete && (
            <Typography>
              Êtes-vous sûr(e) de vouloir supprimer le compte de
              <strong>
                {etudiantToDelete.userId?.firstname || ''} {etudiantToDelete.userId?.lastname || ''}
              </strong>
              ? Cette action est irréversible.
            </Typography>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleDeleteCancel}>
            Annuler
          </Button>
          <Button variant="danger" onClick={handleConfirmDelete}>
            Supprimer
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Snackbar de notification */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbarSeverity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

export default AfficheetudiantsAdmin;