import axiosClient from './axiosClient';

type EmailTemplate = { subject: string; body: string };

const mailService = {
	async sendReminder(studentId: string, template: EmailTemplate) {
		// axiosClient baseURL is /api
		return axiosClient.post(`/ctv/students/${studentId}/send-reminder`, { template });
	},

	async getEmailLogs(studentId: string, page = 1, limit = 20) {
		return axiosClient.get(`/ctv/students/${studentId}/email-logs?page=${page}&limit=${limit}`);
	},
};

export default mailService;
