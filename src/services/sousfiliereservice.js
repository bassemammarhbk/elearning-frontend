// src/services/sousfiliereservice.js
import axios from '../api/axios';

const baseUrl = '/sous-filieres';

// Récupère *toutes* les sous-filières (pas utilisé ici)
export const getSousFilieres = () =>
  axios.get(baseUrl);

// Nouveau : récupère uniquement celles de la filière donnée
export const getSousFilieresByFiliere = (filiereId) =>
  axios.get(`${baseUrl}/by-filiere/${filiereId}`);

export const getSousFiliereById = (id) =>
  axios.get(`${baseUrl}/${id}`);

export const getsousfilieresByFiliereId = (filiereId) => {
  return axios.get(`/sous-filieres/by-filiere/${filiereId}`);
};
export const addSousFiliere = (data) =>
  axios.post(baseUrl, data);

export const editSousFiliere = (data) =>
  axios.put(`${baseUrl}/${data._id}`, data);

export const deleteSousFiliere = (id) =>
  axios.delete(`${baseUrl}/${id}`);
