import axios from '../api/axios';

const certificatApi = 'certificats';

export const getCertification = async (coursId) => {
  const response = await axios.get(`${certificatApi}/cours/${coursId}`, { responseType: 'blob' });
  return response.data;
};