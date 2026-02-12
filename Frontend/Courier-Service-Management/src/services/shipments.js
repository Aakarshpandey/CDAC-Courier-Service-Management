import api from "./api";

export async function getShipments() {
    try {
        const response = await api.get("/api/shipments/recentOrders");
        return response.data;
    } catch (error) {
        console.error("Error fetching shipments:", error);
        throw error;
    }
}

export async function getAllOrders() {
    try {
        const response = await api.get("/api/shipments/allOrders");
        return response.data;
    } catch (error) {
        console.error("Error fetching shipments:", error);
        throw error;
    }
}


export async function submitRating(shipmentId, rating, review) {
    try {
        const response = await api.post("/api/ratings", {
            shipmentId,
            rating,
            review
        });
        return response;
    } catch (error) {
        console.error("Error submitting rating:", error);
        throw error;
    }
}

