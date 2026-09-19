import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:3000",
    withCredentials: true
});

export async function generateTargetedResume() {
    const response = await api.post(
        "/api/resume/generate",
        {},
        {
            responseType: "blob"
        }
    );

    return response.data;
}
