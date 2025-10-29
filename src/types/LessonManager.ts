import { ChipProps } from "@mui/material";

export type CERFLevel = "A1" | "A2" | "B1" | "B2" | "C1" | "C2";
export type PartType = 1 | 2 | 3 | 4 | 5 | 6 | 7;
export type TestStatus = "draft" | "pending" | "approved" | "open" | "closed" | "rejected";
export const TestStatusLabel: Record<TestStatus, string> = {
    draft: "Nháp",
    pending: "Chờ duyệt",
    approved: "Đã duyệt",
    open: "Mở",
    closed: "Đóng",
    rejected: "Bị từ chối",
};
export const STATUS_COLOR_MAP: Record<TestStatus, ChipProps["color"]> = {
    draft: "default",     // xám nhạt
    pending: "warning",   // vàng
    approved: "success",  // xanh lá
    open: "primary",      // xanh dương
    closed: "secondary",  // tím/xám
    rejected: "error",    // đỏ
};

export interface LessonManager {
    _id: string;
    title: string;
    description?: string;
    thumbnail?: string;
    level: CERFLevel;
    part_type: PartType;
    status: TestStatus;
    weight: number;
    planned_completion_time: number;
    rating?: number;
    student_count?: number;
    created_at: Date;
    created_by: string;
    updated_at?: Date;
}