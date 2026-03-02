import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL
    ? `${import.meta.env.VITE_API_URL}/api/`
    : 'http://localhost:4000/api/'
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('CC_Token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;
