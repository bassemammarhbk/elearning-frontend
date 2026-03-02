import axios from '../api/axios'; // Utilisation de l'instance pré-configurée

const forumApi = '/forum'; // Base de l'API cohérente avec les autres services

export const getMessages = async (coursId) => {
  try {
    const response = await axios.get(`${forumApi}/${coursId}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Erreur lors de la récupération des messages');
  }
};

export const postMessage = async (coursId, message) => {
  try {
    const response = await axios.post(`${forumApi}/${coursId}`, { message });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Erreur lors de la publication du message');
  }
};
export const deleteMessage = async (messageId) => {
  try {
    const response = await axios.delete(`${forumApi}/message/${messageId}`);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message ||
        "Erreur lors de la suppression du message"
    );
  }
};

// Met à jour le contenu d'un message par son ID
export const updateMessage = async (messageId, newContent) => {
  try {
    const response = await axios.put(
      `${forumApi}/message/${messageId}`,
      { message: newContent }
    );
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message ||
        "Erreur lors de la modification du message"
    );
  }
};