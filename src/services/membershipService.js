import api from "./api";

export const getMemberships = async () => {
  const { data } = await api.get("/memberships");
  return data;
};

export const createMembership = async (payload) => {
  const { data } = await api.post("/memberships", payload);
  return data;
};

export const updateMembership = async (id, payload) => {
  const { data } = await api.put(`/memberships/${id}`, payload);
  return data;
};

export const deleteMembership = async (id) => {
  const { data } = await api.delete(`/memberships/${id}`);
  return data;
};

export const toggleMembershipStatus = async (id) => {
  const { data } = await api.put(`/memberships/${id}/toggle-status`);
  return data;
};
