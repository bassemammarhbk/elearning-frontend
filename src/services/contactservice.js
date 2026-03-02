// src/api/ContactService.js
import axios from '../api/axios'; // ton instance Axios pré-configurée

const contactApi = '/contact';

/**
 * Envoie un nouveau message de contact.
 * @param {{ name: string, email: string, subject: string, message: string }} payload
 */
export const sendContactMessage = async (payload) => {
  try {
    const response = await axios.post(contactApi, payload);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Erreur lors de l’envoi du message de contact');
  }
};

/**
 * Récupère tous les messages de contact (admin only).
 */
export const getAllContactMessages = async () => {
  try {
    const response = await axios.get(contactApi);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Erreur lors de la récupération des messages de contact');
  }
};

/**
 * Marque un message comme lu.
 * @param {string} messageId
 */
export const markMessageAsRead = async (messageId) => {
  try {
    const response = await axios.patch(`${contactApi}/${messageId}/read`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Erreur lors de la mise à jour du statut du message');
  }
};

/**
 * Supprime un message de contact.
 * @param {string} messageId
 */
export const deleteContactMessage = async (messageId) => {
  try {
    const response = await axios.delete(`${contactApi}/${messageId}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Erreur lors de la suppression du message de contact');
  }
};
