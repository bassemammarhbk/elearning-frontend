import React, { useMemo, useState } from 'react';
import { MaterialReactTable } from 'material-react-table';
import { Box, Tooltip, IconButton } from '@mui/material';
import EditSousFiliereAdmin from './EditSousFiliereAdmin';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const AfficheSousFiliereAdmin = ({ sousFilieres, onEdit, onDelete }) => {
  const [editing, setEditing] = useState(null);

  const columns = useMemo(
    () => [
      {
        accessorKey: 'imageSousFiliere',
        header: 'Image',
        Cell: ({ cell }) => (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            {cell.getValue() ? (
              <img
                alt="Sous-filière"
                height={80}
                src={cell.getValue()}
                loading="lazy"
                style={{ borderRadius: '5px' }}
              />
            ) : (
              '—'
            )}
          </Box>
        ),
      },
      { accessorKey: 'nomSousFiliere', header: 'Nom Sous-filière' },
      { accessorKey: 'description', header: 'Description' },
      {
        id: 'filiere',
        header: 'Filière',
        accessorFn: (row) => row.filiereId?.nomfiliere ?? '—',
      },
      {
        accessorKey: '_id',
        header: 'Actions',
        size: 120,
        Cell: ({ row }) => {
          const sf = row.original;
          return (
            <Box sx={{ display: 'flex', gap: 1 }}>
              {/* Bouton Modifier (bleu) */}
              <Tooltip title="Modifier la sous-filière" arrow>
                <IconButton
                  onClick={() => setEditing(sf)}
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
              <Tooltip title="Supprimer la sous-filière" arrow>
                <IconButton
                  onClick={() => onDelete(sf._id)}
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

  return (
    <div style={{ margin: '20px' }}>
      <MaterialReactTable
        columns={columns}
        data={sousFilieres}
        muiTableProps={{
          sx: {
            borderRadius: '8px',
            boxShadow: 3,
            overflow: 'hidden',
            '& .MuiTableCell-root': { padding: '10px' },
            '& .MuiTableRow-root:hover': { backgroundColor: '#f5f5f5' },
          },
        }}
      />
      {editing && (
        <EditSousFiliereAdmin
          show={!!editing}
          fil={editing}
          onUpdate={(updated) => {
            onEdit(updated);
            setEditing(null);
          }}
          onClose={() => setEditing(null)}
        />
      )}
    </div>
  );
};

export default AfficheSousFiliereAdmin;
