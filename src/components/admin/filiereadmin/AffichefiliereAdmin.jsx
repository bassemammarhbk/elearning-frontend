import React, { useState, useMemo } from 'react';
import EditfiliereAdmin from './EditfiliereAdmin';
import { MaterialReactTable, useMaterialReactTable } from 'material-react-table';
import { Box, Tooltip, IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const AffichefiliereAdmin = ({ filieres, handleUpdateFiliere, handleDeleteFiliere }) => {
  const [show, setShow] = useState(false);
  const [filiere, setFiliere] = useState(null);

  const handleshow = () => setShow(true);
  const handleClose = () => setShow(false);

  const handleEdit = (fil) => {
    setFiliere(fil);
    handleshow();
  };

  const columns = useMemo(
    () => [
      {
        accessorKey: 'imagefiliere',
        header: 'Image',
        Cell: ({ cell }) => (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <img
              alt="Filière"
              height={80}
              src={cell.getValue()}
              loading="lazy"
              style={{ borderRadius: '5px' }}
            />
          </Box>
        ),
      },
      {
        accessorKey: 'nomfiliere',
        header: 'Nom Filière',
      },
      {
        accessorKey: 'descriptionfiliere',
        header: 'Description',
      },
      {
        id: 'actions',
        header: 'Actions',
        size: 120,
        Cell: ({ row }) => {
          const fil = row.original;
          return (
            <Box sx={{ display: 'flex', gap: 1 }}>
              {/* Bouton Modifier (bleu) */}
              <Tooltip title="Modifier la filière" arrow>
                <IconButton
                  onClick={() => handleEdit(fil)}
                  sx={{
                    backgroundColor: '#1976d2',
                    color: 'white',
                    '&:hover': { backgroundColor: '#115293' },
                    '&:active': { transform: 'scale(0.95)' },
                  }}
                >
                  <EditIcon />
                </IconButton>
              </Tooltip>

              {/* Bouton Supprimer (rouge) */}
              <Tooltip title="Supprimer la filière" arrow>
                <IconButton
                  onClick={() => handleDeleteFiliere(fil._id)}
                  sx={{
                    backgroundColor: 'red',
                    color: 'white',
                    '&:hover': { backgroundColor: '#cc0000' },
                    '&:active': { transform: 'scale(0.95)' },
                  }}
                >
                  <DeleteIcon />
                </IconButton>
              </Tooltip>
            </Box>
          );
        },
      },
    ],
    []
  );

  const table = useMaterialReactTable({
    columns,
    data: filieres,
    initialState: { density: 'comfortable' },
    muiTablePaperProps: {
      sx: {
        borderRadius: '8px',
        boxShadow: 3,
        overflow: 'hidden',
        '& .MuiTableCell-root': { padding: '10px' },
        '& .MuiTableRow-root:hover': { backgroundColor: '#f5f5f5' },
      },
    },
  });

  return (
    <div style={{ margin: '20px' }}>
      <MaterialReactTable table={table} />
      {show && filiere && (
        <EditfiliereAdmin
          show={show}
          handleClose={handleClose}
          handleUpdateFiliere={handleUpdateFiliere}
          fil={filiere}
        />
      )}
    </div>
  );
};

export default AffichefiliereAdmin;
