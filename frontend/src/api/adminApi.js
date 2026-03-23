import { api } from "./apiClient";

export async function getUsersList() {
  const response = await api.get("/admin/users");
  return response.data;
}

export async function changeUserRole(id, role) {
  const response = await api.patch(`/admin/users/${id}/role`, { role });
  return response.data;
}