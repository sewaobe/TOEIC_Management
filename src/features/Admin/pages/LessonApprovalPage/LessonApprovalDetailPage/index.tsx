import { useEffect, useState, SyntheticEvent } from "react";
import {
  Box,
  Typography,
  Chip,
  Tabs,
  Tab,
  Button,
  Skeleton,
  useTheme,
} from "@mui/material";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";

import {
  ArrowBack,
  CheckCircle,
  Close,
  Delete,
  Translate,
  LibraryBooks,
  RecordVoiceOver,
  Hearing,
  Quiz,
  AccountTree,
} from "@mui/icons-material";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import adminLessonService from "../services/adminLesson.service";
import { EmptyState } from "../../../../../components/EmptyState";
import { LessonManagerDetail } from "../../../../../types/LessonManagerDetail";
import { TestStatus } from "../../../../../types/enums/TestStatus.ts";

// 🧩 Tabs con
import TabVocabulary from "./tabs/TabVocabulary";
import TabMainLesson from "./tabs/TabMainLesson";
import TabDictation from "./tabs/TabDictation";
import TabShadowing from "./tabs/TabShadowing";
import TabQuiz from "./tabs/TabQuiz";
import TabGraphEdges from "./tabs/TabGraphEdges";
import { NodeRoleLabel, UnitTypeLabel } from "../../../../../types/LessonManager";

const getCreatorName = (createdBy: any) => {
  if (!createdBy) return "-";
  if (typeof createdBy === "string") return createdBy;
  return createdBy.displayName || createdBy.username || createdBy.email || "-";
};

export default function LessonApprovalDetailPage(): JSX.Element {
  const theme = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const lessonManagerId = location.pathname.split("/")[3];

  const [lessonManager, setLessonManager] =
    useState<LessonManagerDetail | null>(null);
  const [tab, setTab] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadingTab, setLoadingTab] = useState(false);
  // 🧩 State modal từ chối
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState("");

  // 🧩 Fetch data
  const fetchLessonManager = async () => {
    try {
      setLoading(true);
      const res = await adminLessonService.getDetail(lessonManagerId);
      setLessonManager(res);
    } catch {
      toast.error("❌ Lấy thông tin bài học thất bại. Vui lòng thử lại!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLessonManager();
  }, [lessonManagerId]);

  // 🔄 Giả lập loading khi chuyển tab
  useEffect(() => {
    const timer = setTimeout(() => setLoadingTab(false), 600);
    return () => clearTimeout(timer);
  }, [tab]);

  const handleTabChange = (_: SyntheticEvent, newValue: number) => {
    setTab(newValue);
    setLoadingTab(true);
  };

  const handleBack = () => navigate(-1);

  // 🧠 Nút duyệt / từ chối / xóa
  const handleApprove = () => {
    (async () => {
      try {
        await adminLessonService.approve(lessonManagerId);
        toast.success("✅ Đã duyệt bài học!");
        navigate("/admin/lessons");
      } catch {
        toast.error("Duyệt thất bại");
      }
    })();
  };
  const handleDelete = () => {
    (async () => {
      try {
        await adminLessonService.softDelete(lessonManagerId);
        toast.warning("🗑️ Đã xóa bài học!");
        navigate("/admin/lessons");
      } catch {
        toast.error("Xóa thất bại");
      }
    })();
  };

  // 🎬 Animation config
  const fade = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 },
    transition: { duration: 0.35 },
  };

  // ⏳ Skeleton hiển thị khi loading
  const renderSkeletonList = () => (
    <Box className="space-y-3">
      {Array.from({ length: 3 }).map((_, i) => (
        <Box
          key={i}
          sx={{
            p: 3,
            borderRadius: 3,
            bgcolor: theme.palette.background.paper,
            boxShadow: theme.shadows[1],
          }}
        >
          <Skeleton variant="text" width="60%" />
          <Skeleton variant="rectangular" height={80} sx={{ mt: 1 }} />
        </Box>
      ))}
    </Box>
  );

  if (loading)
    return (
      <Box
        sx={{
          minHeight: "100vh",
          p: 6,
          bgcolor: theme.palette.background.default,
        }}
      >
        {renderSkeletonList()}
      </Box>
    );

  if (!lessonManager)
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: theme.palette.background.default,
        }}
      >
        <Typography variant="h6" color="text.secondary">
          Không tìm thấy bài học.
        </Typography>
      </Box>
    );

  // 🎨 Map status -> chip color
  const getStatusColor = (status: string) => {
    switch (status) {
      case TestStatus.APPROVED:
        return { label: "Đã duyệt", color: "success" };
      case TestStatus.PENDING:
        return { label: "Chờ duyệt", color: "warning" };
      case TestStatus.DRAFT:
        return { label: "Bản nháp", color: "default" };
      case TestStatus.CLOSED:
        return { label: "Đã đóng", color: "error" };
      case TestStatus.REJECTED:
        return { label: "Bị từ chối", color: "error" };
      default:
        return { label: "Khác", color: "default" };
    }
  };

  const statusChip = getStatusColor(lessonManager.status);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: theme.palette.background.default,
        p: 6,
        color: theme.palette.text.primary,
      }}
    >
      {/* 🧠 Header */}
      <Box
        sx={{
          position: "relative",
          borderRadius: 3,
          overflow: "hidden",
          boxShadow: theme.shadows[3],
        }}
      >
        <img
          src={
            lessonManager.thumbnail ||
            "https://res.cloudinary.com/dgi1g967z/image/upload/v1780219832/jh1nyaim79isvrgo4yf0.webp"
          }
          alt={lessonManager.title}
          style={{ width: "100%", height: "16rem", objectFit: "cover" }}
        />

        {/* Overlay */}
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            bgcolor:
              theme.palette.mode === "dark"
                ? "rgba(0,0,0,0.6)"
                : "rgba(0,0,0,0.4)",
            color: "white",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            p: 4,
          }}
        >
          {/* 🔙 Back + Actions */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Box sx={{ display: "flex", gap: 1 }}>
              <Button
                startIcon={<ArrowBack />}
                variant="outlined"
                color="inherit"
                size="small"
                onClick={handleBack}
              >
                Quay lại
              </Button>
              <Button
                startIcon={<AccountTree />}
                variant="contained"
                size="small"
                onClick={() =>
                  navigate(`/admin/lessons/graph?highlight=${lessonManagerId}`)
                }
              >
                Xem trong graph
              </Button>
            </Box>

            {lessonManager.status === TestStatus.PENDING ? (
              <Box sx={{ display: "flex", gap: 1.5 }}>
                <Button
                  startIcon={<CheckCircle />}
                  color="success"
                  variant="contained"
                  size="small"
                  onClick={handleApprove}
                >
                  Duyệt
                </Button>
                <Button
                  startIcon={<Close />}
                  color="error"
                  variant="contained"
                  size="small"
                  onClick={() => setRejectModalOpen(true)}
                >
                  Từ chối
                </Button>
              </Box>
            ) : (
              <Button
                startIcon={<Delete />}
                color="error"
                variant="outlined"
                size="small"
                onClick={handleDelete}
              >
                Xóa
              </Button>
            )}
          </Box>

          {/* 📘 Info */}
          <Box>
            <Typography variant="h4" fontWeight={700}>
              {lessonManager.title}
            </Typography>
            <Typography variant="body1" sx={{ opacity: 0.9 }}>
              {lessonManager.description}
            </Typography>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1.2, mt: 2 }}>
              <Chip
                label={`Part ${lessonManager.part_type}`}
                color="secondary"
                sx={{ color: "white" }}
              />
              <Chip
                label={`${lessonManager.score_band?.from ?? "-"}-${lessonManager.score_band?.to ?? "-"}`}
                color="info"
              />
              <Chip
                label={
                  lessonManager.unit_type
                    ? UnitTypeLabel[lessonManager.unit_type]
                    : "-"
                }
                color="default"
              />
              <Chip
                label={
                  lessonManager.node_role
                    ? NodeRoleLabel[lessonManager.node_role]
                    : "-"
                }
                color="default"
              />
              <Chip label={statusChip.label} color={statusChip.color as any} />
              {(lessonManager.target_tags || []).map((tag) => (
                <Chip
                  key={tag}
                  label={tag}
                  variant="outlined"
                  sx={{ color: "white", borderColor: "white" }}
                />
              ))}
            </Box>
            <Typography variant="body2" sx={{ opacity: 0.85, mt: 1 }}>
              ⭐ {lessonManager.rating || 0} | 👥{" "}
              {lessonManager.student_count || 0} | ⏱{" "}
              {lessonManager.planned_completion_time || 0} phút | Weight{" "}
              {lessonManager.weight ?? 0} | Creator{" "}
              {getCreatorName(lessonManager.created_by)}
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* 🧩 Tabs */}
      <Tabs
        value={tab}
        onChange={handleTabChange}
        textColor="primary"
        indicatorColor="primary"
        variant="scrollable"
        scrollButtons="auto"
        sx={{
          mt: 4,
          "& .MuiTab-root": {
            fontWeight: 600,
            textTransform: "none",
          },
        }}
      >
        <Tab label="Từ vựng" icon={<Translate />} iconPosition="start" />
        <Tab
          label="Bài học chính"
          icon={<LibraryBooks />}
          iconPosition="start"
        />
        <Tab label="Dictation" icon={<Hearing />} iconPosition="start" />
        <Tab
          label="Shadowing"
          icon={<RecordVoiceOver />}
          iconPosition="start"
        />
        <Tab label="Quiz" icon={<Quiz />} iconPosition="start" />
        <Tab label="Graph Edges" icon={<AccountTree />} iconPosition="start" />
      </Tabs>

      {/* 🧠 Tab content */}
      <AnimatePresence mode="sync">
        {loadingTab ? (
          renderSkeletonList()
        ) : (
          <motion.div key={tab} {...fade}>
            {tab === 0 && <TabVocabulary lessonManager={lessonManager} />}
            {tab === 1 && <TabMainLesson lessonManager={lessonManager} />}
            {tab === 2 && <TabDictation lessonManager={lessonManager} />}
            {tab === 3 && <TabShadowing lessonManager={lessonManager} />}
            {tab === 4 && <TabQuiz lessonManager={lessonManager} />}
            {tab === 5 && (
              <TabGraphEdges
                lessonManager={lessonManager}
                onSaved={fetchLessonManager}
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ✅ Empty fallback */}
      {!lessonManager && (
        <EmptyState
          title="Không có dữ liệu"
          description="Không tìm thấy thông tin bài học này."
          mode="empty"
        />
      )}

      {/* 🟥 Modal từ chối bài học */}
      <Dialog
        open={rejectModalOpen}
        onClose={() => setRejectModalOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle sx={{ fontWeight: 600 }}>Từ chối bài học</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ mb: 2 }}>
            Vui lòng nhập lý do từ chối (không bắt buộc):
          </Typography>
          <TextField
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            multiline
            rows={3}
            fullWidth
            placeholder="Nhập lý do..."
            variant="outlined"
          />
        </DialogContent>
        <DialogActions sx={{ p: 2.5 }}>
          <Button onClick={() => setRejectModalOpen(false)} color="inherit">
            Hủy
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={async () => {
              try {
                await adminLessonService.reject(lessonManagerId, rejectReason);
                toast.error("❌ Đã từ chối bài học!");
                setRejectModalOpen(false);
                navigate("/admin/lessons");
              } catch {
                toast.error("Từ chối thất bại");
              }
            }}
          >
            Xác nhận từ chối
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
