import React, { useMemo } from 'react';
import { MaterialReactTable } from 'material-react-table';
import { Box } from '@mui/material';

const AfficheNewsletterAdmin = ({ abonnés }) => {
  const columns = useMemo(() => [
    {
      accessorKey: 'email',
      header: 'Email Abonné',
      size: 300,
    },
    {
      accessorKey: 'subscribedAt',
      header: "Date d'inscription",
      Cell: ({ cell }) => {
        const date = new Date(cell.getValue());
        return date.toLocaleDateString('fr-FR', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        });
      },
      size: 180,
    }
  ], []);

  return (
    <div style={{ margin: '20px' }}>
      <MaterialReactTable
        columns={columns}
        data={abonnés}
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
    </div>
  );
};

export default AfficheNewsletterAdmin;
