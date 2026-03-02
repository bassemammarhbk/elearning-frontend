import axios from '../api/axios'; // ou import axios from 'axios' si tu n'as pas d'instance

const newsletterApi = '/newsletter';

export const getNewsletterSubscribers = async () => {
  try {
    const response = await axios.get(`${newsletterApi}/newsletter-subscribers`);
    // Ici on retourne directement les données (pas res.data), car dans ton composant tu fais res.data, donc soit on change ça ici soit dans le composant.
    return response.data; // renvoie [{email, subscribedAt}, ...]
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Erreur lors de la récupération des abonnés');
  }
};
