import axios from '../api/axios' ;
const filiereApi = "filiere"
export const getfiliere = async ()=>{
    return await axios.get(filiereApi)
}
export const getfiliereById = async (filiereId)=>{
    return await axios.get(filiereApi + '/' + filiereId )
}
export const deletefiliere = async (filiereId)=>{
    return await axios.delete(filiereApi + '/' + filiereId)
}
export const addfiliere = async (filiere)=>{
    return await axios.post(filiereApi,filiere)
}
export const editfiliere = async(filiere)=>{
    return await axios.put(filiereApi +'/' + filiere._id , filiere)
}
export const getFilieresAvecCours = async () => {
    return await axios.get(filiereApi + '/avec-cours');
};
export const getFiliereWithCourses = async (filiereId) => {
    try {
        const response = await axios.get(`${filiereApi}/avec-cours/${filiereId}`);
        return {
            data: response.data,
            status: response.status
        };
    } catch (error) {
        console.error("Erreur API:", error.response?.data);
        throw new Error(error.response?.data?.message || "Erreur de connexion");
    }
};