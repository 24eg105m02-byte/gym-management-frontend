import api from "./api";

export const getFeedback = async () => {
  const { data } = await api.get("/feedback");
  return data;
};

export const createFeedback = async (payload) => {
  const { data } = await api.post("/feedback", payload);
  return data;
};
