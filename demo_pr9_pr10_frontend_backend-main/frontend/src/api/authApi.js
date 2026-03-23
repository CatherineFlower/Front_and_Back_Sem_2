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

export async function refreshTokensRequest(refreshToken) {
  const response = await api.post("/auth/refresh", { refreshToken });
  return response.data;
}

export function logoutUser() {
  clearTokens();
}