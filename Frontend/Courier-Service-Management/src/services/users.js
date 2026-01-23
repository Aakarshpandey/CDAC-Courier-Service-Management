import axios from "axios";

export async function registerPartner(params) {
    try {

        const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";
        const response = await axios.post(`${API_URL}/register`, params);
        return response;
    } catch (error) {
        console.error("Error registering partner:", error);
        throw error;
    }
}