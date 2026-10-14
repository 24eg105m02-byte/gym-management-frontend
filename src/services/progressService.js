import api from "./api";

export const getProgress = async (params = {}) => {
  const { data } = await api.get("/progress", { params });
  return data;
};

export const createProgress = async (payload) => {
  const { data } = await api.post("/progress", payload);
  return data;
};

export const updateProgress = async (id, payload) => {
  const { data } = await api.put(`/progress/${id}`, payload);
  return data;
};
