import axios from '../api/axios';

const user_Api = '/users';

export const signUp = async (user) => {
  return await axios.post(`${user_Api}/register`, user);
};

export const signIn = async (user) => {
  return await axios.post(`${user_Api}/login`, user);
};

export const getCurrentUser = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

export const logout = () => {
  localStorage.removeItem('CC_Token');
  localStorage.removeItem('user');
  localStorage.removeItem('refresh_token');
};
export const forgotPassword = data => axios.post(`${user_Api}/forgot-password`, data);
export const resetPassword = (token, data) => axios.post(`${user_Api}/reset-password/${token}`, data);