import axios from "axios";

// ATENÇÃO: Confirme se esta URL e porta são as mesmas do seu backend Express
const REST_API_BASE_URL = "http://localhost:5000/api/v1/kits";

// CORRIGIDO: Nome da função de getAllProcedures para getAllKits
export const getAllKits = () => axios.get(REST_API_BASE_URL);

// CORRIGIDO: Nome da função de createkit para createKit
export const createKit = (kit) => axios.post(REST_API_BASE_URL, kit);

// CORRIGIDO: Nome da função de getKitById para getKit
export const getKit = (kitId) => axios.get(REST_API_BASE_URL + "/" + kitId);

export const updateKit = (kitId, kit) =>
  axios.put(REST_API_BASE_URL + "/" + kitId, kit);

export const deleteKit = (kitId) =>
  axios.delete(REST_API_BASE_URL + "/" + kitId);