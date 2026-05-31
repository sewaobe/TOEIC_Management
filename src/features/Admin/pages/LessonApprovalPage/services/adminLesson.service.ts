import axiosClient from "../../../../../services/axiosClient";
import { ApiResponse } from "../../../../../types/api";
import {
  LessonManagerGraphNode,
  LessonManagerNodeRole,
  LessonManagerUnitType,
  PartType,
  TestStatus,
} from "../../../../../types/LessonManager";

const objectIdRegex = /^[a-f\d]{24}$/i;

export interface AdminLessonListParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: TestStatus | string;
  part_type?: PartType | number | "";
  unit_type?: LessonManagerUnitType | string;
  node_role?: LessonManagerNodeRole | string;
  target_tag?: string;
  score_from?: number | "";
  score_to?: number | "";
  creator?: string;
}

export interface AdminLessonOptionsParams extends AdminLessonListParams {
  query?: string;
  exclude_id?: string;
}

export interface UpdateLessonGraphPayload {
  next_unit_ids: string[];
  prerequisite_unit_ids: string[];
  auxiliary_unit_ids: string[];
}

export type AdminLessonGraphEdgeType = "next" | "prerequisite" | "auxiliary";

export interface AdminLessonGraphNode {
  id: string;
  title: string;
  description?: string;
  part_type: number;
  score_band: { from: number; to: number };
  unit_type: string;
  node_role: string;
  target_tags: string[];
  status: string;
  planned_completion_time: number;
  weight: number;
}

export interface AdminLessonGraphEdge {
  id: string;
  source: string;
  target: string;
  type: AdminLessonGraphEdgeType;
}

export interface AdminLessonGraphResponse {
  nodes: AdminLessonGraphNode[];
  edges: AdminLessonGraphEdge[];
  highlightedNodeId?: string;
}

export interface AdminLessonGraphParams {
  part_type?: number | "";
  status?: string;
  unit_type?: string;
  node_role?: string;
  target_tag?: string;
  score_from?: number | "";
  score_to?: number | "";
  query?: string;
  highlight_id?: string;
}

const sanitizeParams = <T extends { creator?: string }>(params?: T) => {
  if (!params) return params;
  const next = { ...params };
  Object.keys(next).forEach((key) => {
    const value = (next as any)[key];
    if (value === "" || value === undefined || value === null) {
      delete (next as any)[key];
    }
  });
  if (next.creator && !objectIdRegex.test(next.creator)) {
    delete next.creator;
  }
  return next;
};

const adminLessonService = {
  list: async (params?: AdminLessonListParams) => {
    const res = await axiosClient.get<ApiResponse<any>>(`/admin/lessons`, {
      params: sanitizeParams(params),
    });
    return (res as any).data?.data ?? (res as any).data;
  },

  getDetail: async (id: string) => {
    const res = await axiosClient.get<ApiResponse<any>>(`/admin/lessons/${id}`);
    return (res as any).data?.data ?? (res as any).data;
  },

  approve: async (id: string) => {
    const res = await axiosClient.post<ApiResponse<any>>(
      `/admin/lessons/${id}/approve`
    );
    return (res as any).data?.data ?? (res as any).data;
  },

  reject: async (id: string, reason?: string) => {
    const res = await axiosClient.post<ApiResponse<any>>(
      `/admin/lessons/${id}/reject`,
      { reason }
    );
    return (res as any).data?.data ?? (res as any).data;
  },

  softDelete: async (id: string) => {
    const res = await axiosClient.post<ApiResponse<any>>(
      `/admin/lessons/${id}/delete`
    );
    return (res as any).data?.data ?? (res as any).data;
  },

  getOptions: async (params?: AdminLessonOptionsParams) => {
    const res = await axiosClient.get<ApiResponse<{ items: LessonManagerGraphNode[] }>>(
      `/admin/lessons/options`,
      { params: sanitizeParams(params) }
    );
    return (res as any).data?.data ?? (res as any).data;
  },

  updateGraph: async (id: string, payload: UpdateLessonGraphPayload) => {
    const res = await axiosClient.put<ApiResponse<any>>(
      `/admin/lessons/${id}/graph`,
      payload
    );
    return (res as any).data?.data ?? (res as any).data;
  },

  getGraph: async (params?: AdminLessonGraphParams) => {
    const res = await axiosClient.get<ApiResponse<AdminLessonGraphResponse>>(
      `/admin/lessons/graph`,
      { params: sanitizeParams(params) }
    );
    return (res as any).data?.data ?? (res as any).data;
  },
};

export default adminLessonService;
