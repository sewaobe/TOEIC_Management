export interface SeriesItem {
  dataKey: string
  label: string
}

export type ReportType =
  | "contentCreation"
  | "studentActivity"
  | "commentFeedback"
  | "errorReports"
  | "ratingPerformance"
  | "overallPerformance"
