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
import studentService from "./services/studentService";
import { Student } from "../../../../types/student";

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
                  {
                    students.filter(
                      (s: any) => s.status === "at_risk" || s.status === "inactive"
                    ).length
                  }
                </Typography>
                <Typography color="text.secondary">
                  Cần chú ý
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
                <Typography color="text.secondary">Điểm ước tính TB</Typography>
              </Paper>
            </Grid>
          </Grid>
        </Box>
      )}

      <StudentDetailDrawer
        studentId={selectedStudentId}
        open={drawerOpen}
        onClose={handleCloseDrawer}
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
