import { Box, CircularProgress, Typography } from "@mui/material";
import RecentCommentDashboard from "./components/RecentCommentDashboard";
import DashboardHeader from "./components/DashboardHeader";
import DashboardKpiSection from "./components/DashboardKpiSection";
import DashboardActionSection from "./components/DashboardActionSection";
import DashboardContentSection from "./components/DashboardContentSection";
import DashboardChartsSection from "./components/DashboardChartSection";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../stores/store";
import { useEffect, useState } from "react";
import { hideFab, showFab } from "../../stores/fabSlice";
import {
  dashboardService,
  DashboardData,
} from "../../services/dashboard.service";

const DashboardPage = () => {
  const user = useSelector((state: RootState) => state.user.user);
  const dispatch = useDispatch<AppDispatch>();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    dispatch(showFab());

    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await dashboardService.getCollaboratorDashboardData();
        setDashboardData(data);
        setError(null);
      } catch (err) {
        setError("Không thể tải dữ liệu dashboard. Vui lòng thử lại.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    return () => {
      dispatch(hideFab());
    };
  }, [dispatch]);

  if (loading) {
    return (
      <Box className="flex justify-center items-center h-full">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box className="flex justify-center items-center h-full">
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  if (!dashboardData) {
    return (
      <Box className="flex justify-center items-center h-full">
        <Typography>Không có dữ liệu để hiển thị.</Typography>
      </Box>
    );
  }

  const {
    kpiData,
    actionItems,
    topContent,
    needsAttention,
    weeklyEngagement,
    contentByStatus,
  } = dashboardData;

  return (
    <Box className="p-6 w-full h-full overflow-auto">
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
      <DashboardContentSection
        topContent={topContent}
        needsAttention={needsAttention}
      />

      {/* Charts */}
      <DashboardChartsSection
        weeklyEngagement={weeklyEngagement}
        contentByStatus={contentByStatus}
      />

      {/* Recent Comments */}
      <RecentCommentDashboard isDemo={true} />
    </Box>
  );
};

export default DashboardPage;
