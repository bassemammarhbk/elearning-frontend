import axios from 'axios';
axios.defaults.baseURL = "https://plateforme-e-learning-ndlr.vercel.app/api/"
axios.defaults.baseURL= 'http://localhost:4000/api/'
// Créer une instance Axios avec baseURL
const axiosInstance = axios.create({
  baseURL: axios.defaults.baseURL

});

// Intercepteur pour ajouter le token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('CC_Token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
