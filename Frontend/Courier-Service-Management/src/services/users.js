import axios from "axios";

export async function registerPartner(params) {
    try {

        const response = await axios.post("http://localhost:8080/register", params);
        return response;
    } catch (error) {
        console.error("Error registering partner:", error);
        throw error;
    }
}