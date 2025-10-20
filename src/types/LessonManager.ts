export type CERFLevel = "A1" | "A2" | "B1" | "B2" | "C1" | "C2";
export type PartType = 1 | 2 | 3 | 4 | 5 | 6 | 7;
export type TestStatus = "draft" | "pending" | "approved";

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