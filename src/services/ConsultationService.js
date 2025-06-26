import axios from "axios";

const REST_API_BASE_URL = "http://localhost:5000/api/v1/consultations";

export const getAllConsultations = () => axios.get(REST_API_BASE_URL);

export const createConsultation = (consultation) =>
  axios.post(REST_API_BASE_URL, consultation);

export const deleteConsultation = (consultationId) =>
  axios.delete(REST_API_BASE_URL + "/" + consultationId);
