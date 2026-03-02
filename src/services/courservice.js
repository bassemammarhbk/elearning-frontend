import axios from '../api/axios'; // utilise l'instance pré-configurée

const coursApi = '/cours';

export const getcours = async () => {
  return await axios.get(coursApi);
};

export const getcoursById = async (coursId) => {
  return await axios.get(`${coursApi}/${coursId}`);
};

export const deletecours = async (coursId) => {
  return await axios.delete(`${coursApi}/${coursId}`);
};



export const addcours = async (cours) => {
  // `cours` doit contenir { filiereId, sousFiliereId, nomcours, ... }
  return await axios.post(coursApi, cours);
};

// … le reste des services inchangé …


export const editcours = async (cours) => {
  try {
    const response = await axios.put(`${coursApi}/${cours._id}`, cours);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Erreur lors de la mise à jour du cours');
  }
};

export const addContenuToCours = async (coursId, contenu) => {
  try {
    const response = await axios.patch(`${coursApi}/${coursId}/contenu`, contenu);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Erreur lors de l\'ajout du contenu');
  }
};

export const getCoursByEnseignant = async (enseignantId) => {
  return await axios.get(`${coursApi}/enseignant/${enseignantId}`);
};
export const getCoursByEtudiant = async (etudiantId) => {
  try {
    const response = await axios.get(`${coursApi}/etudiant/${etudiantId}`);
    return response.data;
  } catch (error) {
    console.error(`Erreur lors de la récupération des cours de l'étudiant ${etudiantId}:`, error);
    throw error;
  }
};

export const deleteContenuFromCours = async (coursId, contenuId) => {
  try {
    const response = await axios.delete(`${coursApi}/${coursId}/contenu/${contenuId}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Erreur lors de la suppression du contenu');
  }
};
export const editContenuInCours = async (coursId, contenuId, contenu) => {
  try {
      console.log('editContenuInCours appelé avec:', { coursId, contenuId, contenu });
      const response = await axios.put(`${coursApi}/${coursId}/contenu/${contenuId}`, contenu);
      console.log('Réponse de editContenuInCours:', response.data);
      return response.data;
  } catch (error) {
      console.error('Erreur dans editContenuInCours:', error.response?.data);
      throw new Error(error.response?.data?.message || 'Erreur lors de la mise à jour du contenu');
  }
};


// Récupérer les cours inscrits d’un étudiant
export const getStudentDetails = async (userId) => {
  const response = await axios.get(`/users/etudiants/${userId}`);
  return response.data;
};

export const enrollInCourse = async (coursId, userId) => {
  try {
    const response = await axios.post(`/users/enroll/${coursId}`, { userId });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Erreur lors de l'appel API");
  }
};


