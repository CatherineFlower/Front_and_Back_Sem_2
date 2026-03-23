import { api } from "./apiClient";

export async function registerUser(payload) {
    const response = await api.post("/auth/register", payload);
    return response.data;
}

export async function loginUser(payload) {
    const response = await api.post("/auth/login", payload);
    return response.data;
}

export async function getMe(token) {
    const response = await api.get("/auth/me", {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
}

export async function getProtectedProduct(id, token) {
    const response = await api.get(`/products/${id}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
}