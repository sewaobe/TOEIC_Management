// ============================
// 🎓 Kiểu dữ liệu học viên tổng quan (Student list)
// ============================
export interface Student {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  status: "active" | "inactive" | "completed";
  enrollDate: string;
  lastActive: string;
  currentLevel: string;
  targetScore: number;
  currentScore: number;
  learningPath: string;
  completedLessons: number;
  totalLessons: number;
  studyStreak: number;
  totalStudyTime: number;
  assignedMentor: string;
  tags: string[];
}

// ============================
// 🧠 Chi tiết học viên (StudentDetail)
// ============================
export interface LearningPathConfig {
  lessonsPerWeek: number;
  hoursPerDay: number;
  focusAreas: string[];
  startDate: string;
  targetDate: string;
}

export interface ProgressData {
  date: string;
  listening: number;
  reading: number;
  vocabulary: number;
  grammar: number;
  [key: string]: string | number | undefined;
}

export interface Activity {
  id: string;
  type: string;
  title: string;
  description: string;
  timestamp: string;
  metadata?: Record<string, any>;
}

export interface StudentDetail extends Student {
  learningPathConfig: LearningPathConfig;
  progressHistory: ProgressData[];
  recentActivities: Activity[];
  notes: string;
}

// ============================
// 📊 Báo cáo nhóm học viên
// ============================
export interface GroupReport {
  groupName: string;
  mentorName: string;
  totalStudents: number;
  activeStudents: number;
  averageProgress: number;
  averageScore: number;
  completionRate: number;
}
