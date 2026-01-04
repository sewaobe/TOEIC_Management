import axiosClient from "../../../../../services/axiosClient";
import { ApiResponse } from "../../../../../types/api";
import {
  CTVReportItem,
  CTVReportListResponse,
  CTVReportQuery,
  CTVUpdateReportPayload,
} from "../types";

const unwrap = <T>(res: any): T => (res?.data?.data ?? res?.data ?? res) as T;

const ctvReportService = {
  async list(params: CTVReportQuery = {}) {
    const response = await axiosClient.get<ApiResponse<CTVReportListResponse>>(
      "/ctv/reports",
      {
        params: {
          page: params.page,
          limit: params.limit,
          type: params.type && params.type !== "all" ? params.type : undefined,
          status:
            params.status && params.status !== "all"
              ? params.status
              : undefined,
          search: params.search,
          from: params.from,
          to: params.to,
        },
      }
    );

    return unwrap<CTVReportListResponse>(response);
  },

  async getDetail(reportId: string) {
    const response = await axiosClient.get<ApiResponse<CTVReportItem>>(
      `/ctv/reports/${reportId}`
    );
    return unwrap<CTVReportItem>(response);
  },

  async update(reportId: string, payload: CTVUpdateReportPayload) {
    const response = await axiosClient.patch<ApiResponse<CTVReportItem>>(
      `/ctv/reports/${reportId}`,
      payload
    );
    return unwrap<CTVReportItem>(response);
  },
};

export default ctvReportService;
