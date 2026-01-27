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

export async function registerUser(params) {
    try {
        const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";
        const response = await axios.post(`${API_URL}/register`, params);
        return response;
    } catch (error) {
        console.error("Error registering User:", error);
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
        
        if (!token) {
            throw new Error("No authentication token found");
        }
        
        const response = await axios.get(`${API_URL}/api/partners/profile`, {
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });
        return response;
    } catch (error) {
        console.error("Error fetching partner profile:", error);
        if (error.response) {
            console.error("Response data:", error.response.data);
            console.error("Response status:", error.response.status);
        }
        throw error;
    }
}

export async function getPartnerDashboardStats() {
    try {
        const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";
        const token = localStorage.getItem("authToken");
        
        if (!token) {
            throw new Error("No authentication token found");
        }
        
        const response = await axios.get(`${API_URL}/api/partners/dashboard/stats`, {
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });
        return response;
    } catch (error) {
        console.error("Error fetching partner dashboard stats:", error);
        if (error.response) {
            console.error("Response data:", error.response.data);
            console.error("Response status:", error.response.status);
        }
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

export async function updatePartnerProfile(profileUpdate) {
    try {
        const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";
        const token = localStorage.getItem("authToken");

        const response = await axios.put(`${API_URL}/api/partners/profile`, profileUpdate, {
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });
        return response;
    } catch (error) {
        console.error("Error updating partner profile:", error);
        throw error;
    }
}

export async function uploadPartnerProfilePhoto(file) {
    try {
        const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";
        const token = localStorage.getItem("authToken");

        const formData = new FormData();
        formData.append("file", file);

        const response = await axios.post(`${API_URL}/api/partners/profile-photo`, formData, {
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "multipart/form-data"
            }
        });
        return response;
    } catch (error) {
        console.error("Error uploading partner profile photo:", error);
        throw error;
    }
}

export async function removePartnerProfilePhoto() {
    try {
        const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";
        const token = localStorage.getItem("authToken");

        const response = await axios.delete(`${API_URL}/api/partners/profile-photo`, {
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });
        return response;
    } catch (error) {
        console.error("Error removing partner profile photo:", error);
        throw error;
    }
}

export async function getAvailableOrders() {
    try {
        const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";
        const token = localStorage.getItem("authToken");

        const response = await axios.get(`${API_URL}/api/partners/available-orders`, {
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });
        return response;
    } catch (error) {
        console.error("Error fetching available orders:", error);
        throw error;
    }
}

export async function getPartnerPayouts() {
    try {
        const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";
        const token = localStorage.getItem("authToken");

        const response = await axios.get(`${API_URL}/api/partners/payouts`, {
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });
        return response;
    } catch (error) {
        console.error("Error fetching partner payouts:", error);
        throw error;
    }
}

export async function transferEarnings(amount) {
    try {
        const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";
        const token = localStorage.getItem("authToken");

        const response = await axios.post(`${API_URL}/api/partners/transfer-earnings`, {
            amount: amount
        }, {
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });
        return response;
    } catch (error) {
        console.error("Error transferring earnings:", error);
        throw error;
    }
}

export async function getPartnerEarnings(period = "week") {
    try {
        const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";
        const token = localStorage.getItem("authToken");

        if (!token) {
            throw new Error("No authentication token found");
        }

        const response = await axios.get(`${API_URL}/api/partners/earnings`, {
            params: { period },
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });
        return response;
    } catch (error) {
        console.error("Error fetching partner earnings:", error);
        if (error.response) {
            console.error("Response data:", error.response.data);
            console.error("Response status:", error.response.status);
        }
        throw error;
    }
}

export async function acceptOrder(shipmentId) {
    try {
        const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";
        const token = localStorage.getItem("authToken");

        if (!token) {
            throw new Error("No authentication token found");
        }

        const response = await axios.post(`${API_URL}/api/partners/accept-order/${shipmentId}`, {}, {
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });
        return response;
    } catch (error) {
        console.error("Error accepting order:", error);
        if (error.response) {
            console.error("Response data:", error.response.data);
            console.error("Response status:", error.response.status);
        }
        throw error;
    }
}