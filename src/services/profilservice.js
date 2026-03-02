import axios from '../api/axios' ;

const user_Api = '/users';

export const getProfile = async () => {
  const token = localStorage.getItem('CC_Token');
  if (!token) {
    throw new Error('No token found. Please log in.');
  }
  return await axios.get(`${user_Api}/profile`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const updateProfile = async (userId, profileData) => {
  const token = localStorage.getItem('CC_Token');
  if (!token) {
    throw new Error('No token found. Please log in.');
  }
  return await axios.put(`${user_Api}/profile/${userId}`, profileData, {
    headers: { Authorization: `Bearer ${token}` },
  });
};