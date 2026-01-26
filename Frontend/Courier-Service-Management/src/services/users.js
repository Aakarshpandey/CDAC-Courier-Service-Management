import axios from "axios";

export async function registerPartner(params) {
    try {
        const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";
        const response = await axios.post(`${API_URL}/api/partner/register`, params);
        return response;
    } catch (error) {
        console.error("Error registering partner:", error);
        throw error;
    }
}


export async function login(email, password, activeTab, rememberMe) {
    try {
        const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

        const response = await axios.post(`${API_URL}/login`, {
            email: email,
            password: password,
            loginType: `ROLE_${activeTab.toUpperCase()}`, // "ROLE_USER" or "ROLE_PARTNER"
            rememberMe: rememberMe
        });

        console.log("Login response:", response.data);
        return response;
    } catch (error) {
        console.error("Error logging in:", error);
        throw error;
    }
}