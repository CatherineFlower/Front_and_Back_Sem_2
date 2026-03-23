import { api } from "./apiClient";

export async function getProducts() {
    const response = await api.get("/products");
    return response.data;
}