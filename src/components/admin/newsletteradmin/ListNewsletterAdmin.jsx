import React, { useState, useEffect } from 'react';
import { CircularProgress } from '@mui/material';
import AfficheNewsletterAdmin from './AfficheNewsletterAdmin';
import { getNewsletterSubscribers } from '../../../services/newsletter';

const ListNewsletterAdmin = () => {
  const [abonnés, setAbonnés] = useState([]);
  const [isPending, setIsPending] = useState(true);
  const [error, setError] = useState(null);

  const fetchAbonnés = async () => {
    try {
      const data = await getNewsletterSubscribers();
      setAbonnés(data);
    } catch (err) {
      setError('Erreur lors du chargement des abonnés');
      console.error(err);
    } finally {
      setIsPending(false);
    }
  };

  useEffect(() => {
    fetchAbonnés();
  }, []);

  return (
    <div>
      {isPending ? (
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <CircularProgress color="primary" size={40} />
        </div>
      ) : error ? (
        <div style={{ textAlign: 'center', color: 'red', marginTop: '20px' }}>
          {error}
        </div>
      ) : (
        <>
          <h1 style={{ textAlign: 'center' }}>Liste des abonnés à la newsletter</h1>
          <AfficheNewsletterAdmin abonnés={abonnés} />
        </>
      )}
    </div>
  );
};

export default ListNewsletterAdmin;
