import axios from "axios";

const API_BASE_URL = "http://localhost:8080";

// Get the auth token from localStorage or wherever you store it
const getAuthToken = () => {
    // TODO: Replace with actual token retrieval logic
    return localStorage.getItem('authToken') ||
        "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ5dXZyYWprYXJla2FyMzRAZ21haWwuY29tIiwicm9sZSI6IlJPTEVfVVNFUiIsImlhdCI6MTc2OTM2MTU0NCwiZXhwIjoxNzY5OTY2MzQ0fQ.t_RWeyRPlYDTMFXnczArS-e8CMu2fA63ydh6XPf0lK0";
};

/**
 * Fetch all suspended partner applications
 */
export async function getSuspendedPartners() {
    try {
        const response = await axios.get(`${API_BASE_URL}/partner/applications`, {
            headers: {
                "Authorization": `Bearer ${getAuthToken()}`,
                "Content-Type": "application/json",
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching suspended partners:", error);
        throw error;
    }
}

/**
 * Approve a partner application
 * @param {number} partnerId - The ID of the partner to approve
 */
export async function approvePartner(partnerId) {
    try {
        const response = await axios.put(
            `${API_BASE_URL}/partner/approve/${partnerId}`,
            {},
            {
                headers: {
                    "Authorization": `Bearer ${getAuthToken()}`,
                    "Content-Type": "application/json",
                },
            }
        );
        return response.data;
    } catch (error) {
        console.error("Error approving partner:", error);
        throw error;
    }
}

/**
 * Reject a partner application
 * @param {number} partnerId - The ID of the partner to reject
 */
export async function rejectPartner(partnerId) {
    try {
        const response = await axios.put(
            `${API_BASE_URL}/partner/reject/${partnerId}`,
            {},
            {
                headers: {
                    "Authorization": `Bearer ${getAuthToken()}`,
                    "Content-Type": "application/json",
                },
            }
        );
        return response.data;
    } catch (error) {
        console.error("Error rejecting partner:", error);
        throw error;
    }
}
