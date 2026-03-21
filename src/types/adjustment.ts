export enum AdjustmentStatus {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
}

export enum AdjustmentActionType {
  REMOVE = "REMOVE",
  ADD = "ADD",
  REPLACE = "REPLACE",
  RESCHEDULE = "RESCHEDULE",
}

export interface IAdjustmentChange {
  action: AdjustmentActionType;
  targetDate?: string; // ISO string
  lessonId?: string; // ID của lesson/quiz/flashcard/etc
  oldLessonId?: string; // ID của lesson/quiz cũ (cho REPLACE)
  dayStudyId?: string;
  kind?: string; // 'lesson' | 'quiz' | 'flashcard' | 'dictation' | 'shadowing' | 'mini_test'
  note?: string;
  lessonTitle?: string; // Tên bài học (lưu trong DB)
  oldLessonTitle?: string; // Tên bài cũ (cho REPLACE, lưu trong DB)
  weekNumber: number; // Luôn có giá trị, không undefined
  dayNumber: number; // Luôn có giá trị, không undefined
  weekTitle: string; // Luôn có giá trị
  dayTitle: string; // Luôn có giá trị
}

export interface IAdjustmentRequest {
  _id: string;
  studentId: string | { _id: string; fullName: string; avatar: string };
  collaboratorId: string | { _id: string; fullName: string; avatar: string };
  learningPathId: string;
  status: AdjustmentStatus;
  reason: string;
  rejectionReason?: string;
  changes: IAdjustmentChange[];
  createdAt: string;
  updatedAt: string;
}

export interface ILessonSimple {
  _id: string;
  title: string;
  type?: string;
  duration?: number;
}

export interface ISessionItem {
  kind: string; // 'lesson' | 'quiz' | 'flashcard' etc
  activity_id: ILessonSimple | string;
  status: string;
}

export interface ISession {
  session_no: number;
  accuracy?: number;
  status: string;
  part_type?: number | null;
  items: ISessionItem[];
}

export interface IDayStudySimple {
  _id: string;
  dayOfWeek: number; // 0-6
  status: string;
  accuracy_overall?: number;
  sessions: ISession[];
}

export interface IWeekStudySimple {
  _id: string;
  week_no: number;
  week_name?: string;
  days: IDayStudySimple[]; // Changed from day_study_ids
}

export interface ILearningPathFull {
  _id: string;
  title?: string;
  week_study_ids: IWeekStudySimple[];
}
