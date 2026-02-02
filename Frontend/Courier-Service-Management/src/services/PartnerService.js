import api from "./api";

/**
 * Fetch all suspended partner applications
 */
export async function getSuspendedPartners() {
    try {
        const response = await api.get("/api/partners/applications");
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
        const response = await api.put(`/api/partners/approve/${partnerId}`, {});
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
        const response = await api.put(`/api/partners/reject/${partnerId}`, {});
        return response.data;
    } catch (error) {
        console.error("Error rejecting partner:", error);
        throw error;
    }
}


/**
 * Update order status (IN_TRANSIT or DELIVERED)
 * @param {number} shipmentId - The ID of the shipment to update
 * @param {string} status - The new status ("IN_TRANSIT" or "DELIVERED")
 */
export async function updateOrderStatus(shipmentId, status) {
    try {
        const response = await api.put(
            `/api/partners/orders/${shipmentId}/status`,
            { status },
        );
        return response.data;
    } catch (error) {
        console.error("Error updating order status:", error);
        throw error;
    }
}

