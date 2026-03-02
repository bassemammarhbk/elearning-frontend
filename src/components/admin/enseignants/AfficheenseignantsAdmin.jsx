import React, { useState, useMemo } from 'react';
import {
  MaterialReactTable,
  useMaterialReactTable,
} from 'material-react-table';
import {
  Stack,
  IconButton,
  Typography,
  Snackbar,
  Alert,
  Tooltip,
} from '@mui/material';
import { Modal, Button } from 'react-bootstrap';
import BlockIcon from '@mui/icons-material/Block';
import EditIcon from '@mui/icons-material/Edit';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DeleteIcon from '@mui/icons-material/Delete';

const AfficheenseignantsAdmin = ({ enseignants, onEdit, onDisable, onDelete }) => {
  const [enseignantToToggle, setEnseignantToToggle] = useState(null);
  const [enseignantToDelete, setEnseignantToDelete] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  const handleToggleClick = (enseignant) => {
    setEnseignantToToggle(enseignant);
    setConfirmOpen(true);
  };

  const handleDeleteClick = (enseignant) => {
    setEnseignantToDelete(enseignant);
    setDeleteConfirmOpen(true);
  };

  const handleConfirmCancel = () => {
    setEnseignantToToggle(null);
    setConfirmOpen(false);
  };

  const handleDeleteCancel = () => {
    setEnseignantToDelete(null);
    setDeleteConfirmOpen(false);
  };

  const handleConfirmToggle = () => {
    if (enseignantToToggle) {
      onDisable(enseignantToToggle);
      const action = enseignantToToggle.userId?.isActive ? 'désactivé' : 'activé';
      setSnackbarMessage(`Le compte a été ${action} avec succès`);
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
    }
    setConfirmOpen(false);
  };

  const handleConfirmDelete = () => {
    if (enseignantToDelete) {
      onDelete(enseignantToDelete);
      setSnackbarMessage('Enseignant supprimé avec succès');
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
        Cell: ({ cell }) => cell.getValue() ?? 'N/A',
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
        Cell: ({ cell }) => (
          <Typography
            color={cell.getValue() ? 'success.main' : 'error.main'}
            fontWeight="bold"
          >
            {cell.getValue() ? 'Actif' : 'Désactivé'}
          </Typography>
        ),
      },
      {
        id: 'actions',
        header: 'Actions',
        Cell: ({ row }) => {
          const enseignant = row.original;
          const isActive = enseignant.userId?.isActive ?? true;

          return (
            <Stack direction="row" spacing={1}>
              <Tooltip title={isActive ? 'Désactiver' : 'Activer'} arrow>
                <IconButton
                  onClick={() => handleToggleClick(enseignant)}
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
                  onClick={() => handleDeleteClick(enseignant)}
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
    data: enseignants,
    initialState: {
      density: 'comfortable',
    },
    enableColumnResizing: false,
    muiTablePaperProps: {
      sx: {
        width: '100%',
        overflowX: 'auto',
      },
    },
    muiTableContainerProps: {
      sx: {
        maxHeight: 'calc(100vh - 64px)',
        overflowY: 'auto',
      },
    },
  });

  return (
    <>
      <div style={{ margin: '20px' }}>
        <MaterialReactTable table={table} />
      </div>

      {/* Modale de confirmation pour activation/désactivation */}
      <Modal show={confirmOpen} onHide={handleConfirmCancel} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            {enseignantToToggle?.userId?.isActive
              ? 'Confirmation de désactivation'
              : 'Confirmation d\'activation'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {enseignantToToggle && (
            <Typography>
              Êtes-vous sûr(e) de vouloir {enseignantToToggle.userId?.isActive ? 'désactiver' : 'activer'} le compte de
              <strong>
                {enseignantToToggle.userId?.firstname || ''} {enseignantToToggle.userId?.lastname || ''}
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
            variant={enseignantToToggle?.userId?.isActive ? 'danger' : 'success'}
            onClick={handleConfirmToggle}
          >
            {enseignantToToggle?.userId?.isActive ? 'Désactiver' : 'Activer'}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modale de confirmation pour suppression */}
      <Modal show={deleteConfirmOpen} onHide={handleDeleteCancel} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirmation de suppression</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {enseignantToDelete && (
            <Typography>
              Êtes-vous sûr(e) de vouloir supprimer le compte de
              <strong>
                {enseignantToDelete.userId?.firstname || ''} {enseignantToDelete.userId?.lastname || ''}
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

      {/* Toast de notification */}
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

export default AfficheenseignantsAdmin;