import axios from "axios";

const REST_API_BASE_URL = "http://localhost:5000/api/v1/pets";

export const getAllPets = () => axios.get(REST_API_BASE_URL);

export const createPet = (pet) => axios.post(REST_API_BASE_URL, pet);

export const getPetById = (petId) => axios.get(REST_API_BASE_URL + "/" + petId);

export const updatePet = (petId, pet) =>
  axios.put(REST_API_BASE_URL + "/" + petId, pet);

export const deletePet = (petId) =>
  axios.delete(REST_API_BASE_URL + "/" + petId);
