import { Box } from "@mui/material"
import RecentCommentDashboard from "./components/RecentCommentDashboard"
import DashboardHeader from "./components/DashboardHeader"
import DashboardKpiSection from "./components/DashboardKpiSection"
import { ActionItems, AttentionItem, ContentByStatus, KPIData, TopContentItem, WeeklyEngagement } from "../../types/Dashboard"
import DashboardActionSection from "./components/DashboardActionSection"
import DashboardContentSection from "./components/DashboardContentSection"
import DashboardChartsSection from "./components/DashboardChartSection"
import { useDispatch, useSelector } from "react-redux"
import { AppDispatch, RootState } from "../../stores/store"
import { useEffect } from "react"
import { hideFab, showFab } from "../../stores/fabSlice"

const kpiData: KPIData = {
  totalLearners: 2847,
  learnerGrowth: 12.5,
  avgRating: 4.6,
  ratingChange: 0.3,
  engagementRate: 78.5,
  engagementChange: 5.2,
  completionRate: 65.3,
  completionChange: -2.1,
}

const actionItems: ActionItems = {
  pendingApproval: 3,
  unansweredComments: 8,
  needsUpdate: 5,
  errorReports: 2,
}

const topContent: TopContentItem[] = [
  { title: "TOEIC Reading Part 7 - Advanced", learners: 456, rating: 4.8, completion: 82 },
  { title: "Business Vocabulary Set 1", learners: 389, rating: 4.7, completion: 91 },
  { title: "Listening Practice - Part 3", learners: 312, rating: 4.6, completion: 76 },
]

const needsAttention: AttentionItem[] = [
  { title: "Grammar Basics - Tenses", issue: "Low completion rate (32%)", priority: "high" },
  { title: "Minitest #12", issue: "3 error reports", priority: "high" },
  { title: "Vocabulary Set 5", issue: "Rating dropped to 3.2", priority: "medium" },
]

const weeklyEngagement: WeeklyEngagement[] = [
  { day: "Mon", learners: 245 },
  { day: "Tue", learners: 312 },
  { day: "Wed", learners: 289 },
  { day: "Thu", learners: 356 },
  { day: "Fri", learners: 401 },
  { day: "Sat", learners: 478 },
  { day: "Sun", learners: 423 },
]

const contentByStatus: ContentByStatus[] = [
  { month: "Jan", published: 12, draft: 5 },
  { month: "Feb", published: 15, draft: 3 },
  { month: "Mar", published: 18, draft: 4 },
  { month: "Apr", published: 22, draft: 6 },
  { month: "May", published: 25, draft: 2 },
  { month: "Jun", published: 28, draft: 4 },
]

const DashboardPage = () => {
  const user = useSelector((state: RootState) => state.user.user);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(showFab());

    return () => {
      dispatch(hideFab());
    }
  }, [dispatch])
  return (
    <Box
      className="p-6 w-full h-full overflow-auto"
    >
      {/* Header */}
      <DashboardHeader
        collaboratorName={user?.profile.fullname}
        slogan="Cảm ơn bạn đã lan tỏa cảm hứng học TOEIC mỗi ngày 💪" 
      />

      {/* KPI Section */}
      <DashboardKpiSection data={kpiData} />

      {/* Action Section */}
      <DashboardActionSection data={actionItems} />

      {/* Top Content & Needs Attention */}
      <DashboardContentSection topContent={topContent} needsAttention={needsAttention} />

      {/* Charts */}
      <DashboardChartsSection
        weeklyEngagement={weeklyEngagement}
        contentByStatus={contentByStatus}
      />

      {/* Recent Comments */}
      <RecentCommentDashboard isDemo={true} />
    </Box >
  )
}

export default DashboardPage
