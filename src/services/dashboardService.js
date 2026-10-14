import api from "./api";

export const getAdminDashboard = async () => {
  const { data } = await api.get("/admin/dashboard");
  return data;
};

export const getTrainerDashboard = async () => {
  const { data } = await api.get("/trainer/dashboard");
  return data;
};

export const getMemberDashboard = async () => {
  const { data } = await api.get("/member/dashboard");
  return data;
};

export const getReports = async (params = {}) => {
  const { data } = await api.get("/admin/reports", { params });
  return data;
};
