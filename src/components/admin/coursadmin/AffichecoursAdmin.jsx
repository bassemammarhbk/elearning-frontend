import React, { useMemo, useState ,  } from 'react'
import { MaterialReactTable, useMaterialReactTable } from 'material-react-table';
import { Box } from '@mui/material';

const AffichecoursAdmin = ({cours}) => {

          const columns = useMemo(
      () => [
          {
          accessorKey: 'nomcours',
          header: 'Nom Cours',
        },
        {
          accessorKey: 'imagecours',
          header: 'Image',
          Cell: ({ cell }) => (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
              }}
            >
              <img
                alt=""
                height={80}
                src={cell.getValue()}
                loading="lazy"
                style={{
                  borderRadius: '10px', // Bord arrondi
                  border: '2px solid #ddd', // Bord simple
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease', // Animation douce au survol
                  '&:hover': {
                    transform: 'scale(1.1)', // Zoom au survol
                    boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)', // Ombre au survol
                  },
                }}
              />
            </Box>
          ),
        },
        {
          accessorKey: 'description',
          header: 'Description Cours',
          size: 100,
        },
        {
          accessorKey: 'duree',
          header: 'Durée Cours',
        },
       {
        accessorKey: 'sousFiliereId.nomSousFiliere',
        header: 'Sous-filière ',
      },
        {
                accessorFn: (row) => {
                    const teacher = row.enseignantId;
                    return teacher ? `${teacher.firstname} ${teacher.lastname}` : 'Non assigné';
                },
                header: 'Enseignant',
                id: 'enseignantName',
            },

      ],
      [cours]
    );
    const table = useMaterialReactTable({
        columns ,
        data:cours
    })
  return (
    <div style={{ margin: '20px' }}>
          <MaterialReactTable
            table={table}
            sx={{
              borderRadius: '8px',
              boxShadow: 3,
              overflow: 'hidden',
              '& .MuiTableCell-root': {
                padding: '10px',
              },
              '& .MuiTableRow-root:hover': {
                backgroundColor: '#f5f5f5',
              },
            }}
          />
    </div>
  )
}

export default AffichecoursAdmin
