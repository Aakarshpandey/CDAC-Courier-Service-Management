import api from "./api";

export async function registerPartner(params) {
    try {
        const response = await api.post("/api/partners/register", params);
        return response;
    } catch (error) {
        console.error("Error registering partner:", error);
        throw error;
    }
}

export async function registerUser(params) {
    try {
        const response = await api.post("/register", params);
        return response;
    } catch (error) {
        console.error("Error registering User:", error);
        throw error;
    }
}

export async function login(email, password, activeTab, rememberMe) {
    try {
        const response = await api.post("/login", {
            email: email,
            password: password,
            loginType: `ROLE_${activeTab.toUpperCase()}`,
            rememberMe: rememberMe
        });

        console.log("Login response:", response.data);
        return response;
    } catch (error) {
        console.error("Error logging in:", error);
        throw error;
    }
}

export async function adminLogin(email, password) {
    try {

        const response = await api.post(`/login`, {
            email: email,
            password: password,
            loginType: "ROLE_ADMIN",
            rememberMe: false
        });

        console.log("Admin login response:", response.data);
        return response;
    } catch (error) {
        console.error("Error logging in as admin:", error);
        throw error;
    }
}
export async function getPartnerProfile() {
    try {
        const response = await api.get("/api/partners/profile");
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
        const response = await api.get("/api/partners/dashboard/stats");
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
        const response = await api.put("/api/partners/online-status", {
            isOnline: isOnline
        });
        return response;
    } catch (error) {
        console.error("Error updating partner online status:", error);
        throw error;
    }
}

export async function updatePartnerProfile(profileUpdate) {
    try {
        const response = await api.put("/api/partners/profile", profileUpdate);
        return response;
    } catch (error) {
        console.error("Error updating partner profile:", error);
        throw error;
    }
}

export async function uploadPartnerProfilePhoto(file) {
    try {
        const formData = new FormData();
        formData.append("file", file);

        const response = await api.post("/api/partners/profile-photo", formData, {
            headers: {
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
        const response = await api.delete("/api/partners/profile-photo");
        return response;
    } catch (error) {
        console.error("Error removing partner profile photo:", error);
        throw error;
    }
}

export async function getAvailableOrders() {
    try {
        const response = await api.get("/api/partners/available-orders");
        return response;
    } catch (error) {
        console.error("Error fetching available orders:", error);
        throw error;
    }
}

export async function getPartnerPayouts() {
    try {
        const response = await api.get("/api/partners/payouts");
        return response;
    } catch (error) {
        console.error("Error fetching partner payouts:", error);
        throw error;
    }
}

export async function transferEarnings(amount) {
    try {
        const response = await api.post("/api/partners/transfer-earnings", {
            amount: amount
        });
        return response;
    } catch (error) {
        console.error("Error transferring earnings:", error);
        throw error;
    }
}

export async function getPartnerEarnings(period = "week") {
    try {
        const response = await api.get("/api/partners/earnings", {
            params: { period }
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
        const response = await api.post(`/api/partners/accept-order/${shipmentId}`, {});
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
//getting partners order
export async function getMyOrders() {
    try {
        

        const response = await api.get(`/api/partners/available-orders`);
        return response;
    } catch (error) {
        console.error("Error fetching my orders:", error);
        if (error.response) {
            console.error("Response data:", error.response.data);
            console.error("Response status:", error.response.status);
        }
        throw error;
    }
}

export async function submitRating(shipmentId, rating, review) {
    try {
        

        const response = await api.post(`$/api/ratings`, {
            shipmentId,
            rating,
            review
        });
        return response;
    } catch (error) {
        console.error("Error submitting rating:", error);
        if (error.response) {
            console.error("Response data:", error.response.data);
            console.error("Response status:", error.response.status);
        }
        throw error;
    }
}
