// --------------------------
// Azure AI Service (TOEIC_server)
// --------------------------
const API_URL = "http://localhost:5000/api/azure-ai";

export const whisperService = {
  async startProcess(payload: {
    transcript?: string;
    audio_path?: string;
    level?: string;
  }) {
    const token = localStorage.getItem("accessToken");
    const res = await fetch(`${API_URL}/process`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : "",
      },
      body: JSON.stringify(payload),
    });
    return await res.json(); // { task_id, status }
  },

  async getStatus(taskId: string) {
    const token = localStorage.getItem("accessToken");
    const res = await fetch(`${API_URL}/status/${taskId}`, {
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
      },
    });
    return await res.json(); // { status, result? }
  },

  async cancel(taskId: string) {
    const token = localStorage.getItem("accessToken");
    const res = await fetch(`${API_URL}/cancel/${taskId}`, {
      method: "POST",
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
      },
    });
    return await res.json();
  },
};
