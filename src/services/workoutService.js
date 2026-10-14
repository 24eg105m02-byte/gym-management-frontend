import api from "./api";

export const getWorkouts = async () => {
  const { data } = await api.get("/workouts");
  return data;
};

export const getWorkout = async (id) => {
  const { data } = await api.get(`/workouts/${id}`);
  return data;
};

export const createWorkout = async (payload) => {
  const { data } = await api.post("/workouts", payload);
  return data;
};

export const updateWorkout = async (id, payload) => {
  const { data } = await api.put(`/workouts/${id}`, payload);
  return data;
};

export const deleteWorkout = async (id) => {
  const { data } = await api.delete(`/workouts/${id}`);
  return data;
};
