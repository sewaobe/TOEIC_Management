// Định nghĩa các kiểu dữ liệu cho module quản lý học viên

export type StudentStatus = "active" | "inactive" | "paused" | "completed"
export type LearningPathType = "standard" | "intensive" | "custom"
export type ActivityType = "login" | "lesson_complete" | "test_submit" | "achievement"

export interface Student {
  id: string
  name: string
  email: string
  phone: string
  avatar?: string
  status: StudentStatus
  enrollDate: string
  lastActive: string
  currentLevel: string
  targetScore: number
  currentScore: number
  learningPath: LearningPathType
  completedLessons: number
  totalLessons: number
  studyStreak: number
  totalStudyTime: number // phút
  assignedMentor?: string
  tags: string[]
}

export interface LearningPathConfig {
  lessonsPerWeek: number
  hoursPerDay: number
  focusAreas: string[]
  startDate: string
  targetDate: string
}

export interface ProgressData {
  date: string
  listening: number
  reading: number
  vocabulary: number
  grammar: number
 [key: string]: string | number
}

export interface Activity {
  id: string
  type: ActivityType
  title: string
  description: string
  timestamp: string
  metadata?: Record<string, any>
}

export interface StudentDetail extends Student {
  learningPathConfig: LearningPathConfig
  progressHistory: ProgressData[]
  recentActivities: Activity[]
  notes: string
}

export interface GroupReport {
  groupName: string
  totalStudents: number
  activeStudents: number
  averageProgress: number
  averageScore: number
  completionRate: number
}

export interface LearningPathAdjustment {
  lessonsPerWeekDelta: number
  hoursPerDayDelta: number
  addFocusAreas: string[]
  removeFocusAreas: string[]
  extendDays: number
  reason: string
}
