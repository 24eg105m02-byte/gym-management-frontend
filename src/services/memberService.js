import api from "./api";

export const getMembers = async () => {
  const { data } = await api.get("/members");
  return data;
};

export const getMember = async (id) => {
  const { data } = await api.get(`/members/${id}`);
  return data;
};

export const getMyProfile = async () => {
  const { data } = await api.get("/members/me");
  return data;
};

export const updateMyProfile = async (payload) => {
  const { data } = await api.put("/members/me", payload);
  return data;
};

export const createMember = async (payload) => {
  const { data } = await api.post("/members", payload);
  return data;
};

export const updateMember = async (id, payload) => {
  const { data } = await api.put(`/members/${id}`, payload);
  return data;
};

export const deleteMember = async (id) => {
  const { data } = await api.delete(`/members/${id}`);
  return data;
};

export const toggleMemberStatus = async (id) => {
  const { data } = await api.put(`/members/${id}/toggle-status`);
  return data;
};
