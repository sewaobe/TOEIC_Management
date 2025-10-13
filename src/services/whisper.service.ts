// --------------------------
// Mock service (Flask API)
// --------------------------
const API_URL = "http://localhost:5001/api";

export const whisperService = {
    async startProcess(payload: { transcript?: string; audio_path?: string; level?: string }) {
        const res = await fetch(`${API_URL}/process`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });
        return await res.json(); // { task_id, status }
    },

    async getStatus(taskId: string) {
        const res = await fetch(`${API_URL}/status/${taskId}`);
        return await res.json(); // { status, result? }
    },

    async cancel(taskId: string) {
        const res = await fetch(`${API_URL}/cancel/${taskId}`, { method: "POST" });
        return await res.json();
    },
};