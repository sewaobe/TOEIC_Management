// ============================
// 🎓 Kiểu dữ liệu học viên tổng quan (Student list)
// ============================
export interface Student {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  status: "not_started" | "active" | "at_risk" | "inactive" | "paused" | "completed";
  enrollDate: string;
  lastActive: string | null;
  lastActiveSource?: string | null;
  currentLevel: string;
  targetScore: number;
  currentScore: number;
  scoreSource?: string;
  estimatedScore?: number;
  estimatedListeningScore?: number;
  estimatedReadingScore?: number;
  scoreAbilityCoverage?: number;
  missingAbilityParts?: number[];
  learningPath: string;
  completedLessons: number;
  totalLessons: number;
  completionRate?: number;
  progressUnit?: "stage";
  progressScope?: "program";
  currentCycleNo?: number | null;
  totalCycles?: number;
  completedCycles?: number;
  currentCycleProgress?: {
    completedStages: number;
    totalStages: number;
    completionRate: number;
  } | null;
  progressUpdatedAt?: string | null;
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
  learningPathId?: string | null;
  type: string;
  title: string;
  description: string;
  timestamp: string;
  metadata?: Record<string, any>;
  source?: "user_activity" | "user_test";
}

export interface AbilityPart {
  partType: number;
  label: string;
  section: "listening" | "reading";
  abilityPercent: number;
  status: "weak" | "medium" | "strong";
  trend?: "improving" | "stable" | "declining";
  skillCount: number;
  weakSkillCount: number;
  lastEvaluatedAt?: string | null;
}

export interface AbilitySkill {
  skillKey: string;
  label: string;
  partType: number;
  section: "listening" | "reading";
  skillGroup?: string;
  abilityPercent: number;
  status: "weak" | "medium" | "strong";
  absoluteLevel?: string;
  trend?: "improving" | "stable" | "declining";
  trendSlope?: number | null;
  historyCount?: number;
  itemCount?: number;
  correctCount?: number;
  lastEvaluatedAt?: string | null;
}

export interface AbilityProfile {
  hasData: boolean;
  lastEvaluatedAt?: string | null;
  summary: {
    listeningAbilityPercent: number;
    readingAbilityPercent: number;
    weakestPart: AbilityPart | null;
    weakestSkill: AbilitySkill | null;
    overallTrend: "improving" | "stable" | "declining";
  };
  sections: Array<{
    key: "listening" | "reading";
    label: string;
    abilityPercent: number;
    partTypes: number[];
    weakPartCount: number;
  }>;
  parts: AbilityPart[];
  skills: AbilitySkill[];
  history: Array<{
    id: string;
    date: string;
    triggerType: string;
    parts: Array<{
      partType: number;
      abilityPercent: number;
      status: "weak" | "medium" | "strong";
      itemCount: number;
      correctCount: number;
    }>;
    skills: Array<{
      skillKey: string;
      label: string;
      partType: number;
      abilityPercent: number;
      status: "weak" | "medium" | "strong";
      itemCount: number;
      correctCount: number;
    }>;
  }>;
  currentFocus: {
    cycleNo: number | null;
    partType: number | null;
    primarySkillKey: string | null;
    primarySkillLabel: string;
    coveredSkillKeys: string[];
    coveredSkillLabels: string[];
    expectedSkillGain: number | null;
    assessmentType: string | null;
  } | null;
}

export interface InterventionProfile {
  engagement: {
    lastActive: string | null;
    daysSinceLastActive: number | null;
    streakDays: number;
    completedStages: number;
    recentLearningActivityCount: number;
    totalStudyTime: number;
    daysUntilLearningPathDeletion?: number | null;
    learningPathDeletionRiskAtDays?: number;
    nextReminderEligibleAt?: string | null;
    recommendedReminderStep?: 1 | 2 | 3 | null;
  };
  assessment: {
    latestAssessmentAt: string | null;
    daysSinceLastAssessment: number | null;
    latestScore: number;
    scoreSource: string;
    needsAssessment: boolean;
  };
  riskFlags: string[];
  recommendedActions: Array<{
    type: string;
    title: string;
    description: string;
    priority: "high" | "medium" | "low";
  }>;
  notes: string;
}

export type CareSignalType =
  | "low_engagement"
  | "no_recent_assessment"
  | "studying_without_score_gain"
  | "skill_plateau"
  | "declining_skill"
  | "continue_monitoring";

export type CareConversationStatus =
  | "waiting_for_response"
  | "responded"
  | "needs_support"
  | "solution_provided"
  | "follow_up_due"
  | "resolved";

export interface CareContextItem {
  code: string;
  label: string;
  value?: string | number | null;
}

export interface CareSignal {
  signalType: CareSignalType;
  signalScopeKey: string;
  title: string;
  severity: "info" | "warning" | "high";
  actionMode: "internal_only" | "care_conversation" | "direct_request";
  contextSummary: CareContextItem[];
  internalHypotheses: string[];
  relatedSkill?: string;
  relatedPart?: number;
  metrics?: Record<string, unknown>;
  suggestedQuestion?: {
    templateId: string;
    version: number;
    text: string;
  };
  hasOpenConversation: boolean;
  openConversationId?: string;
}

export interface CareConversationSummary {
  id: string;
  signalType: CareSignalType;
  signalTitle: string;
  signalScopeKey: string;
  status: CareConversationStatus;
  questionText: string;
  primaryAnswer?: { code: string; label: string };
  secondaryAnswer?: { code: string; label: string };
  studentNote?: string;
  respondedAt?: string;
  latestSolutionAt?: string;
  followUpDueAt?: string;
  createdAt: string;
}

export interface CareProfile {
  signals: CareSignal[];
  activeCareConversations: CareConversationSummary[];
  recentHistory: CareConversationSummary[];
  totalHistory: number;
}

export interface StudentDetail extends Student {
  learningPathConfig: LearningPathConfig;
  progressHistory: ProgressData[];
  recentActivities: Activity[];
  abilityProfile?: AbilityProfile;
  interventionProfile?: InterventionProfile;
  careProfile?: CareProfile;
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
