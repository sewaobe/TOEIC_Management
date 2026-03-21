import axiosClient from "../../../../../services/axiosClient";
import { ApiResponse } from "../../../../../types/api";
import {
  AdminReportItem,
  AdminReportListResponse,
  AdminReportQuery,
  AdminUpdateReportPayload,
} from "../types";

const unwrap = <T>(res: any): T => (res?.data?.data ?? res?.data ?? res) as T;

const adminReportService = {
  async list(params: AdminReportQuery = {}) {
    const response = await axiosClient.get<
      ApiResponse<AdminReportListResponse>
    >("/admin/reports", {
      params: {
        page: params.page,
        limit: params.limit,
        type: params.type && params.type !== "all" ? params.type : undefined,
        status:
          params.status && params.status !== "all" ? params.status : undefined,
        search: params.search,
        from: params.from,
        to: params.to,
      },
    });

    return unwrap<AdminReportListResponse>(response);
  },

  async getDetail(reportId: string) {
    const response = await axiosClient.get<ApiResponse<AdminReportItem>>(
      `/admin/reports/${reportId}`
    );
    return unwrap<AdminReportItem>(response);
  },

  async update(reportId: string, payload: AdminUpdateReportPayload) {
    const response = await axiosClient.put<ApiResponse<AdminReportItem>>(
      `/admin/reports/${reportId}`,
      payload
    );
    return unwrap<AdminReportItem>(response);
  },
};

export default adminReportService;
