import api from "./api";

export const getPayments = async () => {
  const { data } = await api.get("/payments");
  return data;
};

export const getPaymentStats = async () => {
  const { data } = await api.get("/payments/stats");
  return data;
};

export const createPayment = async (payload) => {
  const { data } = await api.post("/payments", payload);
  return data;
};

export const updatePaymentStatus = async (id, status) => {
  const { data } = await api.put(`/payments/${id}/status`, { status });
  return data;
};
