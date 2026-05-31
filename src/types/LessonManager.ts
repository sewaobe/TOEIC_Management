import { ChipProps } from "@mui/material";

export type CERFLevel = "A1" | "A2" | "B1" | "B2" | "C1" | "C2";
export type PartType = 1 | 2 | 3 | 4 | 5 | 6 | 7;
export type TestStatus = "draft" | "pending" | "approved" | "open" | "closed" | "rejected";
export type LessonManagerUnitType =
    | "foundation"
    | "skill_drill"
    | "mixed_practice"
    | "exam_practice"
    | "remedial";
export type LessonManagerNodeRole = "entry" | "normal" | "target" | "support";
export type CtvLessonManagerNodeRole = "normal" | "support";
export type ActivityType = "lesson" | "vocabulary" | "dictation" | "shadowing" | "quiz";

export interface ScoreBand {
    from: number;
    to: number;
}

export interface RecommendedActivity {
    activity_type: ActivityType;
    activity_id: string;
    estimated_minutes: number;
    is_required?: boolean;
    order?: number;
}

export interface ActivityOption {
    _id: string;
    title: string;
    activity_type: ActivityType;
    part_type?: PartType;
    estimated_minutes: number;
}

export interface LessonManagerGraphNode {
    _id: string;
    title: string;
    part_type: PartType;
    score_band: ScoreBand;
    unit_type: LessonManagerUnitType;
    node_role: LessonManagerNodeRole;
    target_tags: string[];
    status: TestStatus;
    planned_completion_time?: number;
    weight?: number;
}

export interface LessonManagerFilters {
    query?: string;
    part_type?: PartType | "";
    status?: TestStatus | "";
    unit_type?: LessonManagerUnitType | "";
    node_role?: CtvLessonManagerNodeRole | "";
    target_tag?: string;
    score_from?: number | "";
    score_to?: number | "";
}

export const TestStatusLabel: Record<TestStatus, string> = {
    draft: "Nháp",
    pending: "Chờ duyệt",
    approved: "Đã duyệt",
    open: "Mở",
    closed: "Đóng",
    rejected: "Bị từ chối",
};

export const STATUS_COLOR_MAP: Record<TestStatus, ChipProps["color"]> = {
    draft: "default",
    pending: "warning",
    approved: "success",
    open: "primary",
    closed: "secondary",
    rejected: "error",
};

export const UnitTypeLabel: Record<LessonManagerUnitType, string> = {
    foundation: "Foundation",
    skill_drill: "Skill drill",
    mixed_practice: "Mixed practice",
    exam_practice: "Exam practice",
    remedial: "Remedial",
};

export const NodeRoleLabel: Record<LessonManagerNodeRole, string> = {
    entry: "Entry",
    normal: "Normal",
    target: "Target",
    support: "Support",
};

export const ActivityTypeLabel: Record<ActivityType, string> = {
    lesson: "Bài học",
    vocabulary: "Từ vựng",
    dictation: "Dictation",
    shadowing: "Shadowing",
    quiz: "Quiz",
};

export const isLessonManagerEditable = (status?: TestStatus) =>
    status === "draft" || status === "rejected";

export interface LessonManager {
    _id: string;
    title: string;
    description?: string;
    thumbnail?: string;
    part_type: PartType;
    score_band: ScoreBand;
    unit_type: LessonManagerUnitType;
    node_role: LessonManagerNodeRole;
    target_tags: string[];
    recommended_activity_order: RecommendedActivity[];
    next_unit_ids?: string[] | LessonManagerGraphNode[];
    prerequisite_unit_ids?: string[] | LessonManagerGraphNode[];
    auxiliary_unit_ids?: string[] | LessonManagerGraphNode[];
    lesson_ids?: string[];
    topic_vocabulary_ids?: string[];
    dictation_ids?: string[];
    shadowing_ids?: string[];
    quiz_ids?: string[];
    status: TestStatus;
    weight: number;
    planned_completion_time: number;
    rating?: number;
    student_count?: number;
    created_at: Date;
    created_by: string;
    updated_at?: Date;
}
