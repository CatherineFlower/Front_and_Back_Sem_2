import { api } from "./apiClient";

export async function getProtectedProducts() {
  const response = await api.get("/products");
  return response.data;
}