import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

// Get the auth token from localStorage
const getAuthToken = () => {
    return localStorage.getItem('authToken');
};

/**
 * Fetch dashboard statistics for admin
 * @returns {Promise} Dashboard stats including total orders, active deliveries, partners, and revenue
 */
export async function getDashboardStats() {
    try {
        const response = await axios.get(`${API_BASE_URL}/api/admin/dashboard/stats`, {
            headers: {
                "Authorization": `Bearer ${getAuthToken()}`,
                "Content-Type": "application/json",
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching dashboard stats:", error);
        throw error;
    }
}

/**
 * Fetch all users with optional search and pagination
 * @param {string} search - Optional search query
 * @param {number} page - Page number (default: 0)
 * @param {number} size - Page size (default: 10)
 * @returns {Promise} Paginated list of users
 */
export async function getAllUsers(search = null, page = 0, size = 10) {
    try {
        const params = new URLSearchParams();
        if (search) params.append('search', search);
        params.append('page', page);
        params.append('size', size);

        const response = await axios.get(`${API_BASE_URL}/api/admin/users?${params.toString()}`, {
            headers: {
                "Authorization": `Bearer ${getAuthToken()}`,
                "Content-Type": "application/json",
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching users:", error);
        throw error;
    }
}

/**
 * Fetch all partners with optional filters and pagination
 * @param {string} status - Optional partner status filter (ACTIVE, INACTIVE, SUSPENDED)
 * @param {boolean} isApproved - Optional approval status filter
 * @param {number} page - Page number (default: 0)
 * @param {number} size - Page size (default: 10)
 * @returns {Promise} Paginated list of partners
 */
export async function getAllPartners(status = null, isApproved = null, page = 0, size = 10) {
    try {
        const params = new URLSearchParams();
        if (status) params.append('status', status);
        if (isApproved !== null) params.append('isApproved', isApproved);
        params.append('page', page);
        params.append('size', size);

        const response = await axios.get(`${API_BASE_URL}/api/admin/partners?${params.toString()}`, {
            headers: {
                "Authorization": `Bearer ${getAuthToken()}`,
                "Content-Type": "application/json",
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching partners:", error);
        throw error;
    }
}

/**
 * Update partner approval status
 * @param {number} partnerId - Partner ID
 * @param {object} approvalData - Approval data {isApproved: boolean, reason: string}
 * @returns {Promise} Response message
 */
export async function updatePartnerApproval(partnerId, approvalData) {
    try {
        const response = await axios.put(
            `${API_BASE_URL}/api/admin/partners/${partnerId}/approval`,
            approvalData,
            {
                headers: {
                    "Authorization": `Bearer ${getAuthToken()}`,
                    "Content-Type": "application/json",
                },
            }
        );
        return response.data;
    } catch (error) {
        console.error("Error updating partner approval:", error);
        throw error;
    }
}
