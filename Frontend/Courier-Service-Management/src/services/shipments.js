import axios from "axios";

const API_BASE_URL = "http://localhost:8080";

// Get the auth token from localStorage or wherever you store it
const getAuthToken = () => {
    // TODO: Replace with actual token retrieval logic
    return localStorage.getItem('authToken') ||
        "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJnYW5lc2hAZ21haWwuY29tIiwicm9sZSI6IlJPTEVfUEFSVE5FUiIsImlhdCI6MTc2OTk3MDU2NSwiZXhwIjoxNzcwMDU2OTY1fQ.dr7pwhZvOiLumnb0KyASTRcBPVHKFYSsDBpj-y0ih_8";
};

export async function getShipments() {
    try {
        const response = await axios.get("http://localhost:8080/api/shipments/recentOrders", {
            headers: {
                "Authorization": `Bearer ${getAuthToken()}`,
                "Content-Type": "application/json",
            },
        });
        // console.log("Response:", response);
        return response.data;
    } catch (error) {
        console.error("Error fetching shipments:", error);
        throw error;
    }
}

export async function getAllOrders() {
    try {
        const response = await axios.get("http://localhost:8080/api/shipments/allOrders", {
            headers: {
                "Authorization": `Bearer ${getAuthToken()}`,
                "Content-Type": "application/json",
            },
        });
        // console.log("Response:", response);
        return response.data;
    } catch (error) {
        console.error("Error fetching shipments:", error);
        throw error;
    }
}

