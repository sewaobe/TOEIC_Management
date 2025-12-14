import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  CircularProgress,
  Tabs,
  Tab,
  Snackbar,
  Alert,
  Grid,
  Paper,
} from "@mui/material";
import { Toolbar } from "./components/Toolbar";
import { StudentTable } from "./components/StudentTable";
import { StudentGrid } from "./components/StudentGrid";
import { StudentDetailDrawer } from "./components/StudentDetailDrawer";
import { LearningPathAdjustDialog } from "./components/LearningPathAdjustDialog";
import { LearningPathEditorDialog } from "./components/LearningPathEditorDialog";
import { StudentReportSection } from "./components/StudentReportSection";
import studentService from "./services/studentService";
import { Student, StudentDetail } from "../../../../types/student";
import { useAdjustmentSocket } from "../../../../hooks/useAdjustmentSocket";

export default function StudentsPage() {
  // =========================
  // 🔧 STATE
  // =========================
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [targetScoreFilter, setTargetScoreFilter] = useState<number>(0);
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(
    null
  );
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [adjustDialogOpen, setAdjustDialogOpen] = useState(false);
  const [editorDialogOpen, setEditorDialogOpen] = useState(false); // New state for Editor
  const [studentForAdjustment, setStudentForAdjustment] =
    useState<StudentDetail | null>(null);
  const [tabValue, setTabValue] = useState("students");

  const [toast, setToast] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error";
  }>({
    open: false,
    message: "",
    severity: "success",
  });

  const showToast = (
    message: string,
    severity: "success" | "error" = "success"
  ) => setToast({ open: true, message, severity });

  // =========================
  // 🔌 SOCKET LISTENER
  // =========================
  useAdjustmentSocket(); // Listen for REQUEST_RESPONDED event

  // =========================
  // 📦 LOAD DỮ LIỆU
  // =========================
  useEffect(() => {
    loadStudents();
  }, [searchQuery, statusFilter, targetScoreFilter]);

  async function loadStudents() {
    setLoading(true);
    try {
      const { items } = await studentService.getAll({
        page: 1,
        limit: 20,
        search: searchQuery,
        status: statusFilter,
        targetScore: targetScoreFilter,
      });
      setStudents(items);
    } catch (error) {
      console.error("Error loading students:", error);
      showToast("Không thể tải danh sách học viên", "error");
    } finally {
      setLoading(false);
    }
  }

  // =========================
  // 🎯 HANDLERS
  // =========================
  function handleStudentClick(studentId: string) {
    setSelectedStudentId(studentId);
    setDrawerOpen(true);
  }

  function handleCloseDrawer() {
    setDrawerOpen(false);
    setSelectedStudentId(null);
  }

  async function handleAdjustLearningPath(studentId: string) {
    try {
      const detail = await studentService.getById(studentId);
      setStudentForAdjustment(detail);
      // setAdjustDialogOpen(true); // Old dialog
      setEditorDialogOpen(true); // New Editor Dialog
    } catch (error) {
      console.error("Error loading student for adjustment:", error);
      showToast("Không thể tải thông tin học viên", "error");
    }
  }

  async function handleSubmitAdjustment() {
    showToast("Chức năng cập nhật lộ trình học chưa khả dụng", "error");
  }

  // =========================
  // 🧱 RENDER
  // =========================
  return (
    <Box sx={{ p: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Quản lý học viên
        </Typography>
        <Typography color="text.secondary">
          Theo dõi và quản lý tiến độ học tập của học viên
        </Typography>
      </Box>

      {/* Tabs */}
      <Tabs
        value={tabValue}
        onChange={(_, val) => setTabValue(val)}
        sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}
      >
        <Tab label="Danh sách học viên" value="students" />
        <Tab label="Báo cáo nhóm" value="reports" />
      </Tabs>

      {/* Tab 1: Danh sách học viên */}
      {tabValue === "students" && (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          {/* Toolbar */}
          <Toolbar
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            statusFilter={statusFilter}
            onStatusFilterChange={setStatusFilter}
            targetScoreFilter={targetScoreFilter}
            onTargetScoreChange={setTargetScoreFilter}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
          />

          {/* Content */}
          {loading ? (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: 256,
              }}
            >
              <CircularProgress size={40} />
            </Box>
          ) : viewMode === "table" ? (
            <StudentTable
              students={students}
              onStudentClick={handleStudentClick}
            />
          ) : (
            <StudentGrid
              students={students}
              onStudentClick={handleStudentClick}
            />
          )}

          {/* Stats */}
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Paper sx={{ p: 2, borderRadius: 2 }}>
                <Typography variant="h5" fontWeight="bold">
                  {students.length}
                </Typography>
                <Typography color="text.secondary">Tổng học viên</Typography>
              </Paper>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Paper sx={{ p: 2, borderRadius: 2 }}>
                <Typography variant="h5" fontWeight="bold">
                  {
                    students.filter(
                      (s: any) => s.status === "active" || s.completionRate > 0
                    ).length
                  }
                </Typography>
                <Typography color="text.secondary">Đang học</Typography>
              </Paper>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Paper sx={{ p: 2, borderRadius: 2 }}>
                <Typography variant="h5" fontWeight="bold">
                  {Math.round(
                    students.reduce((acc, s) => {
                      const percent =
                        s.totalLessons && s.totalLessons > 0
                          ? (s.completedLessons / s.totalLessons) * 100
                          : 0;
                      return acc + percent;
                    }, 0) / (students.length || 1)
                  )}
                  %
                </Typography>
                <Typography color="text.secondary">
                  Tiến độ trung bình
                </Typography>
              </Paper>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Paper sx={{ p: 2, borderRadius: 2 }}>
                <Typography variant="h5" fontWeight="bold">
                  {Math.round(
                    students.reduce(
                      (acc, s) => acc + (s.currentScore || 0),
                      0
                    ) / students.length || 0
                  )}
                </Typography>
                <Typography color="text.secondary">Điểm trung bình</Typography>
              </Paper>
            </Grid>
          </Grid>
        </Box>
      )}

      {/* Tab 2: Báo cáo nhóm */}
      {tabValue === "reports" && (
        <Box sx={{ mt: 2 }}>
          <StudentReportSection />
        </Box>
      )}

      <StudentDetailDrawer
        studentId={selectedStudentId}
        open={drawerOpen}
        onClose={handleCloseDrawer}
        onAdjustLearningPath={handleAdjustLearningPath}
      />

      <LearningPathAdjustDialog
        student={studentForAdjustment}
        open={adjustDialogOpen}
        onClose={() => setAdjustDialogOpen(false)}
        onSubmit={handleSubmitAdjustment}
      />

      <LearningPathEditorDialog
        student={studentForAdjustment}
        open={editorDialogOpen}
        onClose={() => setEditorDialogOpen(false)}
      />

      <Snackbar
        open={toast.open}
        autoHideDuration={3000}
        onClose={() => setToast({ ...toast, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setToast({ ...toast, open: false })}
          severity={toast.severity}
          sx={{ width: "100%" }}
        >
          {toast.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
