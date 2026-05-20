import axios from "axios";

const BASE_URL = "http://localhost:8081/owner";

// CREATE OWNER (POST)
export const createOwner = (data) => {
  return axios.post(BASE_URL, data);
};

// GET ALL OWNERS
export const getOwners = () => {
  return axios.get(BASE_URL);
};

// UPDATE OWNER
export const updateOwner = (id, data) => {
  return axios.put(`${BASE_URL}/${id}`, data);
};

// DELETE OWNER
export const deleteOwner = (id) => {
  return axios.delete(`${BASE_URL}/${id}`);
};
