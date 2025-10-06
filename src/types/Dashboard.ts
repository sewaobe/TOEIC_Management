export interface KPIData {
  totalLearners: number
  learnerGrowth: number
  avgRating: number
  ratingChange: number
  engagementRate: number
  engagementChange: number
  completionRate: number
  completionChange: number
}

export interface ActionItems {
  pendingApproval: number
  unansweredComments: number
  needsUpdate: number
  errorReports: number
}

export interface TopContentItem {
  title: string
  learners: number
  rating: number
  completion: number
}

export interface AttentionItem {
  title: string
  issue: string
  priority: "high" | "medium"
}
export interface WeeklyEngagement {
  day: string
  learners: number
  [key: string]: string | number 
}

export interface ContentByStatus {
  month: string
  published: number
  draft: number
  [key: string]: string | number
}
