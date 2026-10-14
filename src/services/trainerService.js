import api from "./api";

export const getTrainers = async () => {
  const { data } = await api.get("/trainers");
  return data;
};

export const getTrainer = async (id) => {
  const { data } = await api.get(`/trainers/${id}`);
  return data;
};

export const getMyTrainerProfile = async () => {
  const { data } = await api.get("/trainers/me");
  return data;
};

export const updateMyTrainerProfile = async (payload) => {
  const { data } = await api.put("/trainers/me", payload);
  return data;
};

export const getMyAssignedTrainer = async () => {
  const { data } = await api.get("/trainers/my-trainer");
  return data;
};

export const createTrainer = async (payload) => {
  const { data } = await api.post("/trainers", payload);
  return data;
};

export const updateTrainer = async (id, payload) => {
  const { data } = await api.put(`/trainers/${id}`, payload);
  return data;
};

export const deleteTrainer = async (id) => {
  const { data } = await api.delete(`/trainers/${id}`);
  return data;
};

export const toggleTrainerStatus = async (id) => {
  const { data } = await api.put(`/trainers/${id}/toggle-status`);
  return data;
};
