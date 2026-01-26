import axios from "axios";

export async function registerPartner(params) {
    try {
        const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";
        const response = await axios.post(`${API_URL}/api/partners/register`, params);
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

export async function getPartnerProfile() {
    try {
        const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";
        const token = localStorage.getItem("authToken");
        
        const response = await axios.get(`${API_URL}/api/partners/profile`, {
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });
        return response;
    } catch (error) {
        console.error("Error fetching partner profile:", error);
        throw error;
    }
}

export async function getPartnerDashboardStats() {
    try {
        const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";
        const token = localStorage.getItem("authToken");
        
        const response = await axios.get(`${API_URL}/api/partners/dashboard/stats`, {
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });
        return response;
    } catch (error) {
        console.error("Error fetching partner dashboard stats:", error);
        throw error;
    }
}

export async function updatePartnerOnlineStatus(isOnline) {
    try {
        const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";
        const token = localStorage.getItem("authToken");

        const response = await axios.put(`${API_URL}/api/partners/online-status`, {
            isOnline: isOnline
        }, {
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });
        return response;
    } catch (error) {
        console.error("Error updating partner online status:", error);
        throw error;
    }
}