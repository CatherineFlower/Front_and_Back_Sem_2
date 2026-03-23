import { api, clearTokens, setTokens } from "./apiClient";

export async function registerUser(payload) {
  const response = await api.post("/auth/register", payload);
  return response.data;
}

export async function loginUser(payload) {
  const response = await api.post("/auth/login", payload);
  const { accessToken, refreshToken } = response.data;
  setTokens(accessToken, refreshToken);
  return response.data;
}

export async function getMe() {
  const response = await api.get("/auth/me");
  return response.data;
}

export function logoutUser() {
  clearTokens();
}