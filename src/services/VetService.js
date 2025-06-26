import axios from "axios";

const REST_API_BASE_URL = "http://localhost:5000/api/v1/vets";

export const getAllVets = () => axios.get(REST_API_BASE_URL);

export const createVet = (vet) => axios.post(REST_API_BASE_URL, vet);

export const getVetById = (vetId) => axios.get(REST_API_BASE_URL + "/" + vetId);

export const updateVet = (vetId, vet) =>
  axios.put(REST_API_BASE_URL + "/" + vetId, vet);

export const deleteVet = (vetId) =>
  axios.delete(REST_API_BASE_URL + "/" + vetId);
