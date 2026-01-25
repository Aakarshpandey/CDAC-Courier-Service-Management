import axios from "axios";

const API_BASE_URL = "http://localhost:8080";


export async function getShipments() {
    try {
        const response = await axios.get("http://localhost:8080/api/shipments/recentOrders", {
            headers: {
                "Authorization": `Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ5dXZyYWprYXJla2FyMzRAZ21haWwuY29tIiwicm9sZSI6IlJPTEVfVVNFUiIsImlhdCI6MTc2OTM2MTU0NCwiZXhwIjoxNzY5OTY2MzQ0fQ.t_RWeyRPlYDTMFXnczArS-e8CMu2fA63ydh6XPf0lK0`,
                "Content-Type": "application/json",
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching shipments:", error);
        throw error;
    }
}
