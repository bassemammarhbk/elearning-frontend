import axios from '../api/axios'
const userApi = 'Users'
import { getCurrentUser } from './authservice';

export const getUsers = async ()=>{
    return await axios.get(userApi)
}
export const getUsersById = async (userId)=>{
    return await axios.get(userApi + '/' + userId)
}
export const getEtudiants = async () => {
  return await axios.get(`${userApi}/etudiants`);
};
export const getEtudiantById = async (userId) => {
  return await axios.get(`${userApi}/etudiants/${userId}`);
};
export const getEnseignants = async () => {
  return await axios.get(`${userApi}/enseignants`);
};
export const getEnseignantById = async (userId) => {
  return await axios.get(`${userApi}/enseignants/${userId}`);
};
export const deleteUsers = async (userId)=>{
    return await axios.delete (userApi + '/' + userId)
}

export const addUsers = async (user) =>{
    return await axios.post (userApi,user)
}
export const editUsers = async (user) =>{
    return await axios.put(userApi +'/'+user._id,user)
}
  // <-- on l’importe ici

/**
 * Marquer un chapitre comme complété pour l'étudiant courant
 */
export const completeChapitre = (coursId, chapitreId) => {
    const user = getCurrentUser();
    if (!user) {
      return Promise.reject(new Error('Utilisateur non connecté'));
    }
    return axios.post(
      `/users/${user._id}/complete-chapitre`,
      { coursId, chapitreId }
    );
  };


  export const getChapitresCompletes = (userId) => {
    return axios.get(`/users/${userId}/chapitres-completes`);
  };


// New: Toggle user active status by email
export const toggleUserStatus = async (userId) =>
  axios.put(`${userApi}/${userId}/status`);

export const getLeaderboard = async () => {
  const response = await axios.get(`${userApi}/leaderboard`);
  return response.data;
};