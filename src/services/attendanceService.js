import api from "./api";

export const getAttendance = async (params = {}) => {
  const { data } = await api.get("/attendance", { params });
  return data;
};

export const getAttendanceStats = async () => {
  const { data } = await api.get("/attendance/stats");
  return data;
};

export const createAttendance = async (payload) => {
  const { data } = await api.post("/attendance", payload);
  return data;
};

export const updateAttendance = async (id, payload) => {
  const { data } = await api.put(`/attendance/${id}`, payload);
  return data;
};

export const getAttendancePercentage = async (memberId) => {
  const { data } = await api.get(`/attendance/percentage/${memberId}`);
  return data;
};
