import axiosClient from "./axiosClient";
import {
  ActionItems,
  AttentionItem,
  ContentByStatus,
  KPIData,
  TopContentItem,
  WeeklyEngagement,
} from "../types/Dashboard";

export interface DashboardData {
  kpiData: KPIData;
  actionItems: ActionItems;
  topContent: TopContentItem[];
  needsAttention: AttentionItem[];
  weeklyEngagement: WeeklyEngagement[];
  contentByStatus: ContentByStatus[];
}

export const dashboardService = {
  getCollaboratorDashboardData: async (): Promise<DashboardData> => {
    const res = await axiosClient.get("/ctv/dashboard");
    return res.data;
  },
};
