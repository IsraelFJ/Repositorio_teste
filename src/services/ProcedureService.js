import axios from "axios";

const REST_API_BASE_URL = "http://localhost:5000/api/v1/procedures";

export const getAllProcedures = () => axios.get(REST_API_BASE_URL);

export const createProcedure = (procedure) =>
  axios.post(REST_API_BASE_URL, procedure);

export const getProcedureById = (procedureId) =>
  axios.get(REST_API_BASE_URL + "/" + procedureId);

export const updateProcedure = (procedureId, procedure) =>
  axios.put(REST_API_BASE_URL + "/" + procedureId, procedure);

export const deleteProcedure = (procedureId) =>
  axios.delete(REST_API_BASE_URL + "/" + procedureId);
