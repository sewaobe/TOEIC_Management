import { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Chip,
  TextField,
  CircularProgress,
  Menu,
  MenuItem,
  ListItemIcon,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Paper,
  Stack,
  Divider,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import QuizIcon from "@mui/icons-material/Quiz";
import StyleIcon from "@mui/icons-material/Style";
import RecordVoiceOverIcon from "@mui/icons-material/RecordVoiceOver";
import AssignmentIcon from "@mui/icons-material/Assignment";
import MicIcon from "@mui/icons-material/Mic";
import { adjustmentService } from "../services/adjustmentService";
import { toast } from "sonner";
import {
  ILearningPathFull,
  IAdjustmentChange,
  AdjustmentActionType,
} from "../../../../../types/adjustment";
import { StudentDetail } from "../../../../../types/student";
import LessonSearchDialog from "../../../../../components/LessonSearchDialog";
import { ActivityPreviewDialog } from "./ActivityPreviewDialog";
import { SortableActivityCard } from "./SortableActivityCard";
import { Tabs, Tab } from "@mui/material";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  horizontalListSortingStrategy,
} from "@dnd-kit/sortable";

interface LearningPathEditorDialogProps {
  student: StudentDetail | null;
  open: boolean;
  onClose: () => void;
}
export function LearningPathEditorDialog({
  student,
  open,
  onClose,
}: LearningPathEditorDialogProps) {
  const [loading, setLoading] = useState(false);
  const [learningPath, setLearningPath] = useState<ILearningPathFull | null>(
    null
  );
  const [changes, setChanges] = useState<IAdjustmentChange[]>([]);
  const [reason, setReason] = useState("");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [selectedActivity] = useState<any | null>(null);
  const [previewDialogOpen, setPreviewDialogOpen] = useState(false);
  const [previewActivityId, setPreviewActivityId] = useState<string | null>(
    null
  );
  const [previewActivityKind, setPreviewActivityKind] = useState<string | null>(
    null
  );
  const [activeTab, setActiveTab] = useState(0);

  // Drag and drop sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // Require 8px movement before drag starts
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Menu state
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedLesson, setSelectedLesson] = useState<{
    lessonId: string;
    dayId: string;
    lessonTitle: string;
    kind?: string;
    status?: string;
  } | null>(null);

  // Lesson search dialog state
  const [searchDialogOpen, setSearchDialogOpen] = useState(false);
  const [selectedDayForAdd, setSelectedDayForAdd] = useState<string | null>(
    null
  );

  // Helper: trả về thông tin tuần/ngày cho một dayStudyId
  const getDayContext = (dayId?: string) => {
    const defaultCtx = {
      weekNumber: 1,
      dayNumber: 1,
      weekTitle: "Tuần 1",
      dayTitle: "Ngày 1",
    };
    if (!dayId || !learningPath) return defaultCtx;

    const weeks = learningPath.week_study_ids || [];
    for (let wi = 0; wi < weeks.length; wi++) {
      const week: any = weeks[wi];
      if (!week.days) continue;
      const day = week.days.find((d: any) => String(d._id) === String(dayId));
      if (day) {
        const weekNumber = week.week_no || wi + 1;
        const dayNumber = day.dayOfWeek || 1;
        return {
          weekNumber,
          dayNumber,
          weekTitle: week.title || `Tuần ${weekNumber}`,
          dayTitle: day.title || `Ngày ${dayNumber}`,
        };
      }
    }
    console.warn(
      `Không tìm thấy day ${dayId} trong learningPath ${learningPath._id}`
    );
    return defaultCtx;
  };
  const [replaceMode, setReplaceMode] = useState(false);
  const [lessonToReplace, setLessonToReplace] = useState<{
    lessonId: string;
    dayId: string;
    lessonTitle: string;
  } | null>(null);

  useEffect(() => {
    if (open && student) {
      loadLearningPath();
      setChanges([]);
      setReason("");
    }
  }, [open, student]);

  const loadLearningPath = async () => {
    if (!student) return;
    setLoading(true);
    try {
      const data = await adjustmentService.getFullLearningPath(student.id);
      console.log("📚 Learning Path Data:", data);
      console.log("📚 First Week:", data?.week_study_ids?.[0]);
      console.log("📚 First Day:", data?.week_study_ids?.[0]?.days?.[0]);
      console.log(
        "📚 First Session:",
        data?.week_study_ids?.[0]?.days?.[0]?.sessions?.[0]
      );
      setLearningPath(data);
    } catch (error) {
      console.error("Failed to load learning path", error);
    } finally {
      setLoading(false);
    }
  };

  const getKindLabel = (kind?: string) => {
    if (!kind) return "bài học";
    switch (kind.toLowerCase()) {
      case "lesson":
        return "bài học";
      case "quiz":
        return "bài tập";
      case "flash_card":
        return "flashcard";
      case "dictation":
        return "chính tả";
      case "shadowing":
        return "shadowing";
      case "mini_test":
        return "mini test";
      default:
        return kind;
    }
  };

  const handleMenuOpen = (
    event: React.MouseEvent<HTMLElement>,
    lesson: any,
    dayId: string
  ) => {
    setAnchorEl(event.currentTarget);
    setSelectedLesson({
      lessonId: lesson._id,
      dayId,
      lessonTitle: lesson.title,
      kind: lesson.kind,
      status: lesson.status,
    });
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedLesson(null);
  };

  const handleRemoveLesson = () => {
    if (selectedLesson) {
      const ctx = getDayContext(selectedLesson.dayId);
      setChanges((prev) => [
        ...prev,
        {
          action: AdjustmentActionType.REMOVE,
          lessonId: selectedLesson.lessonId,
          dayStudyId: selectedLesson.dayId,
          lessonTitle: selectedLesson.lessonTitle,
          note: `Xóa ${getKindLabel(selectedLesson.kind)}`,
          weekNumber: ctx.weekNumber,
          dayNumber: ctx.dayNumber,
          weekTitle: ctx.weekTitle,
          dayTitle: ctx.dayTitle,
        },
      ]);
    }
    handleMenuClose();
  };

  const handleAddLesson = (dayId: string) => {
    setReplaceMode(false);
    setSelectedDayForAdd(dayId);
    setSearchDialogOpen(true);
  };

  const handleReplaceLesson = () => {
    if (selectedLesson && selectedLesson.kind?.toLowerCase() === "lesson") {
      setReplaceMode(true);
      setLessonToReplace(selectedLesson);
      setSearchDialogOpen(true);
    }
    handleMenuClose();
  };

  const handleSelectLesson = (
    lessonId: string,
    lessonTitle: string,
    kind: string
  ) => {
    // Kiểm tra trùng lặp: duyệt tất cả các ngày trong lộ trình
    type DuplicateInfo = { dayNo: number; weekNo: number; dayId: string };
    let duplicateInfo: DuplicateInfo | null = null;

    if (learningPath) {
      learningPath.week_study_ids.forEach((week) => {
        week.days.forEach((day) => {
          if (day.sessions) {
            day.sessions.forEach((session) => {
              if (session.items) {
                session.items.forEach((item: any) => {
                  const activityId =
                    typeof item.activity_id === "string"
                      ? item.activity_id
                      : item.activity_id?._id;
                  if (activityId === lessonId) {
                    duplicateInfo = {
                      dayNo: day.dayOfWeek,
                      weekNo: week.week_no,
                      dayId: day._id,
                    };
                  }
                });
              }
            });
          }
        });
      });
    }

    // Nếu tìm thấy trùng lặp
    if (duplicateInfo) {
      const { dayId, weekNo, dayNo } = duplicateInfo;
      const currentDayId = replaceMode
        ? lessonToReplace?.dayId
        : selectedDayForAdd;
      const isSameDay = dayId === currentDayId;

      if (isSameDay) {
        // TH1: Trùng với ngày hiện tại
        alert(`❌ Ngày này đã có bài "${lessonTitle}" rồi!`);
        return; // Không thêm nếu trùng ngày hiện tại
      } else {
        // TH2: Bài này đã có ở ngày khác
        const confirmed = window.confirm(
          `⚠️ Bài "${lessonTitle}" đã có ở Tuần ${weekNo} - Ngày ${dayNo}.\n\nBạn có chắc muốn thêm lại?`
        );
        if (!confirmed) {
          return; // Hủy thao tác
        }
      }
    }

    if (replaceMode && lessonToReplace) {
      // REPLACE mode
      const ctx = getDayContext(lessonToReplace.dayId);
      setChanges((prev) => [
        ...prev,
        {
          action: AdjustmentActionType.REPLACE,
          dayStudyId: lessonToReplace.dayId,
          oldLessonId: lessonToReplace.lessonId,
          lessonId: lessonId,
          lessonTitle: lessonTitle,
          oldLessonTitle: lessonToReplace.lessonTitle,
          kind: kind,
          note: `Thay thế "${lessonToReplace.lessonTitle}" bằng "${lessonTitle}"`,
          weekNumber: ctx.weekNumber,
          dayNumber: ctx.dayNumber,
          weekTitle: ctx.weekTitle,
          dayTitle: ctx.dayTitle,
        },
      ]);
      setLessonToReplace(null);
    } else if (selectedDayForAdd) {
      // ADD mode
      const ctx = getDayContext(selectedDayForAdd || undefined);
      setChanges((prev) => [
        ...prev,
        {
          action: AdjustmentActionType.ADD,
          dayStudyId: selectedDayForAdd,
          lessonId: lessonId,
          lessonTitle: lessonTitle,
          kind: kind,
          note: `Thêm ${getKindLabel(kind)}: ${lessonTitle}`,
          weekNumber: ctx.weekNumber,
          dayNumber: ctx.dayNumber,
          weekTitle: ctx.weekTitle,
          dayTitle: ctx.dayTitle,
        },
      ]);
      setSelectedDayForAdd(null);
    }
  };

  const handleSubmit = async () => {
    if (!student || !learningPath) return;
    setSubmitting(true);
    try {
      await adjustmentService.createRequest({
        studentId: student.id,
        learningPathId: learningPath._id,
        reason: reason,
        changes: changes,
      });
      onClose();
      toast.success("Đã gửi yêu cầu điều chỉnh thành công!");
    } catch (error) {
      console.error("Failed to submit request", error);
      toast.error("Gửi yêu cầu thất bại");
    } finally {
      setSubmitting(false);
      setConfirmOpen(false);
    }
  };

  // Handler cho drag and drop
  const handleDragEnd = (
    event: DragEndEvent,
    dayId: string,
    sessionIdx: number
  ) => {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    setLearningPath((prev) => {
      if (!prev) return prev;

      const newPath = { ...prev };
      const week = newPath.week_study_ids.find((w) =>
        w.days.some((d) => d._id === dayId)
      );

      if (!week) return prev;

      const day = week.days.find((d) => d._id === dayId);
      if (!day || !day.sessions || !day.sessions[sessionIdx]) return prev;

      const session = day.sessions[sessionIdx];
      if (!session.items) return prev;

      const oldIndex = session.items.findIndex((item: any) => {
        const id =
          typeof item.activity_id === "string"
            ? item.activity_id
            : item.activity_id._id;
        return id === active.id;
      });

      const newIndex = session.items.findIndex((item: any) => {
        const id =
          typeof item.activity_id === "string"
            ? item.activity_id
            : item.activity_id._id;
        return id === over.id;
      });

      if (oldIndex === -1 || newIndex === -1) return prev;

      session.items = arrayMove(session.items, oldIndex, newIndex);

      return newPath;
    });

    // TODO: Add reorder change to changes array if needed
  };

  // Helper to check if a lesson is removed in current changes
  const isLessonRemoved = (lessonId: string) => {
    return changes.some(
      (c) => c.action === AdjustmentActionType.REMOVE && c.lessonId === lessonId
    );
  };

  // Helper to check if a lesson is replaced in current changes
  const isLessonReplaced = (lessonId: string) => {
    return changes.some(
      (c) =>
        c.action === AdjustmentActionType.REPLACE && c.oldLessonId === lessonId
    );
  };

  // Helper to get added lessons for a day
  const getAddedLessons = (dayId: string) => {
    return changes.filter(
      (c) => c.action === AdjustmentActionType.ADD && c.dayStudyId === dayId
    );
  };

  if (!student) return null;

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          Điều chỉnh lộ trình: {student.name}
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers>
          {loading ? (
            <Box display="flex" justifyContent="center" p={4}>
              <CircularProgress />
            </Box>
          ) : learningPath ? (
            <Box>
              {/* Changes Summary */}
              {changes.length > 0 && (
                <Box mb={2} p={2} bgcolor="warning.light" borderRadius={1}>
                  <Typography variant="subtitle2" fontWeight="bold">
                    Thay đổi dự kiến ({changes.length}):
                  </Typography>
                  <List dense>
                    {changes.map((c, idx) => (
                      <ListItem key={idx}>
                        <Chip
                          size="small"
                          label={
                            c.action === "REMOVE"
                              ? "Xóa"
                              : c.action === "ADD"
                              ? "Thêm"
                              : "Sửa"
                          }
                          color={
                            c.action === "REMOVE"
                              ? "error"
                              : c.action === "ADD"
                              ? "success"
                              : "info"
                          }
                          sx={{ mr: 1 }}
                        />
                        <ListItemText
                          primary={`${c.lessonTitle || "Bài học"} - ${c.note}`}
                        />
                        <IconButton
                          size="small"
                          onClick={() =>
                            setChanges((prev) =>
                              prev.filter((_, i) => i !== idx)
                            )
                          }
                        >
                          <CloseIcon fontSize="small" />
                        </IconButton>
                      </ListItem>
                    ))}
                  </List>
                </Box>
              )}

              {/* Tabs View for Weeks */}
              <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 2 }}>
                <Tabs
                  value={activeTab}
                  onChange={(_e, newValue) => setActiveTab(newValue)}
                  variant="scrollable"
                  scrollButtons="auto"
                >
                  {learningPath.week_study_ids?.map(
                    (week: any, weekIdx: number) => (
                      <Tab
                        key={week._id}
                        label={`Tuần ${week.week_no || weekIdx + 1} (${
                          week.days?.length || 0
                        } ngày)`}
                      />
                    )
                  )}
                </Tabs>
              </Box>

              {/* Current Week Content */}
              {learningPath.week_study_ids?.[activeTab] && (
                <Box display="flex" flexDirection="column" gap={1}>
                  {learningPath.week_study_ids[activeTab].days?.map(
                    (day: any) => (
                      <Accordion key={day._id} defaultExpanded={false}>
                        <AccordionSummary
                          expandIcon={<ExpandMoreIcon />}
                          sx={{
                            bgcolor: "action.hover",
                            "&:hover": { bgcolor: "action.selected" },
                          }}
                        >
                          <Box
                            display="flex"
                            alignItems="center"
                            gap={2}
                            width="100%"
                          >
                            <Typography fontWeight="bold">
                              Ngày {day.dayOfWeek + 1}
                            </Typography>
                            <Chip
                              size="small"
                              label={`${
                                day.sessions?.reduce(
                                  (acc: number, s: any) =>
                                    acc + (s.items?.length || 0),
                                  0
                                ) || 0
                              } bài`}
                              color="default"
                            />
                          </Box>
                        </AccordionSummary>
                        <AccordionDetails>
                          <Box>
                            <Box
                              display="flex"
                              justifyContent="flex-end"
                              mb={2}
                            >
                              <Button
                                startIcon={<AddIcon />}
                                size="small"
                                variant="outlined"
                                onClick={() => handleAddLesson(day._id)}
                              >
                                Thêm bài học
                              </Button>
                            </Box>

                            {/* Display all sessions with their activities */}
                            <Box
                              display="flex"
                              flexDirection="column"
                              gap={1.5}
                            >
                              {day.sessions?.map(
                                (session: any, sIdx: number) => {
                                  const getActivityIcon = (kind?: string) => {
                                    if (!kind)
                                      return <MenuBookIcon fontSize="small" />;
                                    switch (kind.toLowerCase()) {
                                      case "lesson":
                                        return (
                                          <MenuBookIcon fontSize="small" />
                                        );
                                      case "quiz":
                                        return <QuizIcon fontSize="small" />;
                                      case "flash_card":
                                        return <StyleIcon fontSize="small" />;
                                      case "dictation":
                                        return (
                                          <RecordVoiceOverIcon fontSize="small" />
                                        );
                                      case "shadowing":
                                        return <MicIcon fontSize="small" />;
                                      case "mini_test":
                                        return (
                                          <AssignmentIcon fontSize="small" />
                                        );
                                      default:
                                        return null;
                                    }
                                  };

                                  const getActivityLabel = (
                                    kind?: string
                                  ): string => {
                                    if (!kind) return "Activity";
                                    switch (kind.toLowerCase()) {
                                      case "lesson":
                                        return "Bài học";
                                      case "quiz":
                                        return "Bài tập";
                                      case "flash_card":
                                        return "Flashcard";
                                      case "dictation":
                                        return "Chính tả";
                                      case "shadowing":
                                        return "Shadowing";
                                      case "mini_test":
                                        return "Mini Test";
                                      default:
                                        return kind;
                                    }
                                  };

                                  const getActivityColor = (kind?: string) => {
                                    if (!kind) return "default";
                                    switch (kind.toLowerCase()) {
                                      case "lesson":
                                        return "primary";
                                      case "quiz":
                                        return "secondary";
                                      case "flash_card":
                                        return "info";
                                      case "dictation":
                                        return "success";
                                      case "shadowing":
                                        return "warning";
                                      case "mini_test":
                                        return "error";
                                      default:
                                        return "default";
                                    }
                                  };

                                  const getStatusLabel = (status: string) => {
                                    switch (status) {
                                      case "completed":
                                        return "Hoàn thành";
                                      case "in_progress":
                                        return "Đang học";
                                      case "lock":
                                        return "Chưa mở";
                                      default:
                                        return "";
                                    }
                                  };

                                  return (
                                    <Box
                                      key={sIdx}
                                      sx={{
                                        p: 1.5,
                                        border: "1px solid",
                                        borderColor: "divider",
                                        borderRadius: 1.5,
                                        bgcolor: "background.paper",
                                      }}
                                    >
                                      <Box
                                        display="flex"
                                        alignItems="center"
                                        gap={1}
                                        mb={1}
                                      >
                                        <Typography
                                          variant="body2"
                                          fontWeight={600}
                                        >
                                          Session {session.session_no}{" "}
                                          {session.part_type
                                            ? `· Part ${session.part_type}`
                                            : ""}
                                        </Typography>
                                        <Chip
                                          size="small"
                                          label={getStatusLabel(session.status)}
                                          color="default"
                                          variant="outlined"
                                        />
                                      </Box>

                                      <DndContext
                                        sensors={sensors}
                                        collisionDetection={closestCenter}
                                        onDragEnd={(event) =>
                                          handleDragEnd(event, day._id, sIdx)
                                        }
                                      >
                                        <SortableContext
                                          items={
                                            session.items?.map((item: any) => {
                                              const id =
                                                typeof item.activity_id ===
                                                "string"
                                                  ? item.activity_id
                                                  : item.activity_id._id;
                                              return id;
                                            }) || []
                                          }
                                          strategy={
                                            horizontalListSortingStrategy
                                          }
                                        >
                                          <Stack
                                            direction="row"
                                            flexWrap="wrap"
                                            gap={1.5}
                                          >
                                            {session.items?.map(
                                              (item: any, iIdx: number) => {
                                                if (!item.activity_id)
                                                  return null;

                                                const activityId =
                                                  typeof item.activity_id ===
                                                  "string"
                                                    ? item.activity_id
                                                    : item.activity_id._id;
                                                const activityTitle =
                                                  typeof item.activity_id ===
                                                  "string"
                                                    ? `[${item.activity_id.substring(
                                                        0,
                                                        8
                                                      )}]`
                                                    : item.activity_id.title ||
                                                      "";

                                                const color = getActivityColor(
                                                  item.kind
                                                ) as any;
                                                const isLesson =
                                                  item.kind?.toLowerCase() ===
                                                  "lesson";
                                                const isDone =
                                                  item.status === "completed";
                                                const removed =
                                                  isLesson &&
                                                  isLessonRemoved(activityId);
                                                const replaced =
                                                  isLesson &&
                                                  isLessonReplaced(activityId);
                                                const replaceChange =
                                                  changes.find(
                                                    (c) =>
                                                      c.action ===
                                                        AdjustmentActionType.REPLACE &&
                                                      c.oldLessonId ===
                                                        activityId
                                                  );

                                                return (
                                                  <SortableActivityCard
                                                    key={activityId}
                                                    id={activityId}
                                                    item={item}
                                                    activityId={activityId}
                                                    activityTitle={
                                                      activityTitle
                                                    }
                                                    color={color}
                                                    isDone={isDone}
                                                    removed={removed}
                                                    replaced={replaced}
                                                    replaceTitle={
                                                      replaceChange?.lessonTitle
                                                    }
                                                    dayId={day._id}
                                                    sIdx={sIdx}
                                                    iIdx={iIdx}
                                                    getActivityIcon={
                                                      getActivityIcon
                                                    }
                                                    getActivityLabel={
                                                      getActivityLabel
                                                    }
                                                    getStatusLabel={
                                                      getStatusLabel
                                                    }
                                                    onMenuOpen={handleMenuOpen}
                                                    onPreviewClick={() => {
                                                      setPreviewActivityId(
                                                        activityId
                                                      );
                                                      setPreviewActivityKind(
                                                        item.kind
                                                      );
                                                      setPreviewDialogOpen(
                                                        true
                                                      );
                                                    }}
                                                  />
                                                );
                                              }
                                            )}
                                          </Stack>
                                        </SortableContext>
                                      </DndContext>
                                    </Box>
                                  );
                                }
                              )}

                              {/* Added Lessons */}
                              {getAddedLessons(day._id).map((c, i) => (
                                <Chip
                                  key={i}
                                  label={c.lessonTitle}
                                  color="success"
                                  variant="outlined"
                                />
                              ))}

                              {selectedActivity &&
                                selectedActivity.dayId === day._id && (
                                  <Paper
                                    variant="outlined"
                                    sx={{
                                      mt: 2,
                                      p: 1.5,
                                      borderColor: "primary.main",
                                      bgcolor: "action.hover",
                                    }}
                                  >
                                    <Typography
                                      variant="subtitle2"
                                      fontWeight={700}
                                      mb={1}
                                    >
                                      Xem nhanh hoạt động
                                    </Typography>
                                    <Divider sx={{ mb: 1 }} />
                                    <Stack spacing={0.5}>
                                      <Typography variant="body2">
                                        <b>Loại:</b>{" "}
                                        {getKindLabel(selectedActivity.kind)}
                                      </Typography>
                                      <Typography variant="body2">
                                        <b>Tiêu đề:</b>{" "}
                                        {selectedActivity.activityTitle ||
                                          "Chưa có tiêu đề"}
                                      </Typography>
                                      <Typography variant="body2">
                                        <b>Trạng thái:</b>{" "}
                                        {selectedActivity.status}
                                      </Typography>
                                      <Typography variant="body2">
                                        <b>Session:</b>{" "}
                                        {selectedActivity.sessionNo}
                                        {selectedActivity.part
                                          ? ` · Part ${selectedActivity.part}`
                                          : ""}
                                      </Typography>
                                      <Typography variant="body2">
                                        <b>ID:</b> {selectedActivity.activityId}
                                      </Typography>
                                    </Stack>
                                  </Paper>
                                )}
                            </Box>

                            {(() => {
                              const hasExisting = day.sessions?.some((s: any) =>
                                s.items?.some((i: any) => i.activity_id)
                              );
                              const hasAdded =
                                getAddedLessons(day._id).length > 0;
                              return (
                                !hasExisting &&
                                !hasAdded && (
                                  <Typography
                                    variant="body2"
                                    color="text.secondary"
                                    textAlign="center"
                                    py={2}
                                  >
                                    Chưa có bài học nào. Click "Thêm bài học" để
                                    bắt đầu.
                                  </Typography>
                                )
                              );
                            })()}
                          </Box>
                        </AccordionDetails>
                      </Accordion>
                    )
                  )}
                </Box>
              )}
            </Box>
          ) : (
            <Typography>Không có dữ liệu lộ trình</Typography>
          )}
        </DialogContent>

        <DialogActions>
          <Button onClick={onClose}>Hủy</Button>
          <Button
            variant="contained"
            disabled={changes.length === 0}
            onClick={() => setConfirmOpen(true)}
            startIcon={<SaveIcon />}
          >
            Gửi đề xuất
          </Button>
        </DialogActions>

        {/* Context Menu for Lesson */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          <MenuItem
            onClick={handleRemoveLesson}
            disabled={selectedLesson?.status === "completed"}
          >
            <ListItemIcon>
              <DeleteIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Xóa hoạt động này</ListItemText>
          </MenuItem>
          <MenuItem
            onClick={handleReplaceLesson}
            disabled={
              selectedLesson?.kind?.toLowerCase() !== "lesson" ||
              selectedLesson?.status === "completed"
            }
          >
            <ListItemIcon>
              <EditIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Thay thế bài học này</ListItemText>
          </MenuItem>
        </Menu>
      </Dialog>

      {/* Confirm Dialog */}
      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
        <DialogTitle>Xác nhận gửi đề xuất</DialogTitle>
        <DialogContent>
          <Typography gutterBottom>
            Bạn đang gửi {changes.length} thay đổi cho học viên{" "}
            <b>{student.name}</b>.
          </Typography>
          <TextField
            autoFocus
            margin="dense"
            label="Lý do điều chỉnh / Lời nhắn"
            fullWidth
            multiline
            rows={3}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Ví dụ: Bài này quá dễ so với trình độ của bạn..."
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmOpen(false)}>Hủy</Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={!reason.trim() || submitting}
          >
            {submitting ? <CircularProgress size={24} /> : "Gửi ngay"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Lesson Search Dialog */}
      <LessonSearchDialog
        open={searchDialogOpen}
        onClose={() => {
          setSearchDialogOpen(false);
          setSelectedDayForAdd(null);
          setReplaceMode(false);
          setLessonToReplace(null);
        }}
        onSelectLesson={handleSelectLesson}
      />

      {/* Activity Preview Dialog */}
      <ActivityPreviewDialog
        open={previewDialogOpen}
        onClose={() => {
          setPreviewDialogOpen(false);
          setPreviewActivityId(null);
          setPreviewActivityKind(null);
        }}
        activityId={previewActivityId}
        kind={previewActivityKind}
      />
    </>
  );
}
