import React, { useState, useCallback } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  MenuItem,
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Typography,
  Chip,
  CircularProgress,
  IconButton,
  InputAdornment,
  Stack,
  Paper,
  Tabs,
  Tab,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import VisibilityIcon from "@mui/icons-material/Visibility";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import QuizIcon from "@mui/icons-material/Quiz";
import StyleIcon from "@mui/icons-material/Style";
import RecordVoiceOverIcon from "@mui/icons-material/RecordVoiceOver";
import MicIcon from "@mui/icons-material/Mic";
import { debounce } from "lodash";
import { ActivityPreviewDialog } from "../features/Collaborator/pages/StudentsPage/components/ActivityPreviewDialog";

interface Activity {
  _id: string;
  title: string;
  description?: string;
  summary?: string;
  thumbnail?: string;
  level?: string;
  part_type?: number;
  planned_completion_time?: number;
  duration?: number;
  weight?: number;
  rating?: number;
  student_count?: number;
  question_count?: number;
}

interface LessonSearchDialogProps {
  open: boolean;
  onClose: () => void;
  onSelectLesson: (lessonId: string, lessonTitle: string, kind: string) => void;
}

type ActivityType = "lesson" | "quiz" | "flashcard" | "dictation" | "shadowing";

const ACTIVITY_TABS = [
  { value: "lesson" as ActivityType, label: "Bài học", icon: <MenuBookIcon /> },
  { value: "quiz" as ActivityType, label: "Quiz", icon: <QuizIcon /> },
  {
    value: "flashcard" as ActivityType,
    label: "Flashcard",
    icon: <StyleIcon />,
  },
  {
    value: "dictation" as ActivityType,
    label: "Dictation",
    icon: <RecordVoiceOverIcon />,
  },
  { value: "shadowing" as ActivityType, label: "Shadowing", icon: <MicIcon /> },
];

const CERF_LEVELS = ["A1", "A2", "B1", "B2", "C1", "C2"];
const PART_TYPES = [
  { value: 1, label: "Part 1 - Photos" },
  { value: 2, label: "Part 2 - Q&A" },
  { value: 3, label: "Part 3 - Conversations" },
  { value: 4, label: "Part 4 - Talks" },
  { value: 5, label: "Part 5 - Incomplete Sentences" },
  { value: 6, label: "Part 6 - Text Completion" },
  { value: 7, label: "Part 7 - Reading Comprehension" },
];

const LessonSearchDialog: React.FC<LessonSearchDialogProps> = ({
  open,
  onClose,
  onSelectLesson,
}) => {
  const [activeTab, setActiveTab] = useState<ActivityType>("lesson");
  const [query, setQuery] = useState("");
  const [level, setLevel] = useState<string>("");
  const [partType, setPartType] = useState<number | "">("");
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewActivityId, setPreviewActivityId] = useState<string | null>(
    null
  );
  const [previewActivityKind, setPreviewActivityKind] = useState<string | null>(
    null
  );
  const [previewOpen, setPreviewOpen] = useState(false);

  // Get API endpoint based on activity type
  const getApiEndpoint = (type: ActivityType): string => {
    switch (type) {
      case "lesson":
        return "/ctv/lesson";
      case "quiz":
        return "/ctv/quiz";
      case "flashcard":
        return "/ctv/practice-topics";
      case "dictation":
        return "/ctv/dictation";
      case "shadowing":
        return "/ctv/shadowing";
      default:
        return "/ctv/lesson";
    }
  };

  // Search function
  const performSearch = async (
    type: ActivityType,
    searchQuery: string,
    searchLevel: string,
    searchPartType: number | ""
  ) => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      if (searchQuery) params.append("search", searchQuery);
      if (searchLevel) params.append("level", searchLevel);
      if (searchPartType !== "")
        params.append("part_type", searchPartType.toString());
      params.append("page", "1");
      params.append("limit", "50");

      const endpoint = getApiEndpoint(type);
      console.log(
        `🔍 Fetching ${type}:`,
        `${import.meta.env.VITE_API_URL}${endpoint}?${params.toString()}`
      );

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}${endpoint}?${params.toString()}`,
        {
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error(`Không thể tải danh sách ${type}`);
      }

      const data = await response.json();
      console.log("✅ Response data:", data);

      // Backend trả về format: { success, data: { items/lessons/data, total, pageCount } }
      let activityList: Activity[] = [];
      if (data.data) {
        // Try different response formats
        if (Array.isArray(data.data)) {
          activityList = data.data;
        } else if (data.data.items && Array.isArray(data.data.items)) {
          activityList = data.data.items;
        } else if (data.data.lessons && Array.isArray(data.data.lessons)) {
          activityList = data.data.lessons;
        } else if (data.data.data && Array.isArray(data.data.data)) {
          activityList = data.data.data;
        }
      }

      console.log(
        `✅ ${type} loaded:`,
        activityList.length,
        "items:",
        activityList
      );
      setActivities(activityList);
    } catch (err) {
      console.error(`❌ Error loading ${type}:`, err);
      setError(err instanceof Error ? err.message : "Có lỗi xảy ra");
      setActivities([]);
    } finally {
      setLoading(false);
    }
  };

  // Debounced version for typing
  const debouncedSearch = useCallback(
    debounce(
      (
        type: ActivityType,
        searchQuery: string,
        searchLevel: string,
        searchPartType: number | ""
      ) => {
        performSearch(type, searchQuery, searchLevel, searchPartType);
      },
      500
    ),
    []
  );

  // Load when tab changes
  React.useEffect(() => {
    if (open) {
      console.log(`📂 Loading ${activeTab}...`);
      performSearch(activeTab, query, level, partType);
    }
  }, [activeTab, open]);

  // Trigger debounced search when filters change
  React.useEffect(() => {
    if (open && (query || level || partType !== "")) {
      debouncedSearch(activeTab, query, level, partType);
    }
  }, [query, level, partType]);

  // Reset when dialog closes
  React.useEffect(() => {
    if (!open) {
      setQuery("");
      setLevel("");
      setPartType("");
      setActivities([]);
      setError(null);
      setActiveTab("lesson");
    }
  }, [open]);

  const handleSelectActivity = (activity: Activity) => {
    onSelectLesson(activity._id, activity.title, activeTab);
    onClose();
  };

  const formatTime = (minutes: number) => {
    if (minutes < 60) return `${minutes}p`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h${mins}p` : `${hours}h`;
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">Chọn bài học</Typography>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent>
        {/* Activity Type Tabs */}
        <Tabs
          value={activeTab}
          onChange={(_e, newValue) => setActiveTab(newValue)}
          variant="fullWidth"
          sx={{ borderBottom: 1, borderColor: "divider", mb: 2 }}
        >
          {ACTIVITY_TABS.map((tab) => (
            <Tab
              key={tab.value}
              value={tab.value}
              icon={tab.icon}
              label={tab.label}
              iconPosition="start"
            />
          ))}
        </Tabs>

        <Stack spacing={2}>
          {/* Search Input */}
          <TextField
            fullWidth
            placeholder="Tìm kiếm theo tên bài học..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />

          {/* Filters */}
          <Box display="flex" gap={2}>
            <TextField
              select
              label="Level"
              value={level}
              onChange={(e) => setLevel(e.target.value)}
              sx={{ minWidth: 120 }}
            >
              <MenuItem value="">Tất cả</MenuItem>
              {CERF_LEVELS.map((lv) => (
                <MenuItem key={lv} value={lv}>
                  {lv}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              select
              label="Part"
              value={partType}
              onChange={(e) =>
                setPartType(e.target.value ? Number(e.target.value) : "")
              }
              sx={{ minWidth: 200, flex: 1 }}
            >
              <MenuItem value="">Tất cả</MenuItem>
              {PART_TYPES.map((pt) => (
                <MenuItem key={pt.value} value={pt.value}>
                  {pt.label}
                </MenuItem>
              ))}
            </TextField>
          </Box>

          {/* Results */}
          <Paper variant="outlined" sx={{ maxHeight: 400, overflow: "auto" }}>
            {loading ? (
              <Box display="flex" justifyContent="center" p={3}>
                <CircularProgress />
              </Box>
            ) : error ? (
              <Box p={3} textAlign="center">
                <Typography color="error">{error}</Typography>
              </Box>
            ) : activities.length === 0 ? (
              <Box p={3} textAlign="center">
                <Typography color="text.secondary">
                  Không có{" "}
                  {ACTIVITY_TABS.find((t) => t.value === activeTab)?.label} nào
                </Typography>
              </Box>
            ) : (
              <List disablePadding>
                {activities.map((activity) => (
                  <ListItem
                    key={activity._id}
                    disablePadding
                    divider
                    secondaryAction={
                      <IconButton
                        edge="end"
                        onClick={(e) => {
                          e.stopPropagation();
                          setPreviewActivityId(activity._id);
                          setPreviewActivityKind(activeTab);
                          setPreviewOpen(true);
                        }}
                        sx={{ mr: 1 }}
                      >
                        <VisibilityIcon />
                      </IconButton>
                    }
                  >
                    <ListItemButton
                      onClick={() => handleSelectActivity(activity)}
                    >
                      <ListItemText
                        primary={
                          <Box display="flex" alignItems="center" gap={1}>
                            <Typography variant="subtitle1">
                              {activity.title}
                            </Typography>
                            {activity.level && (
                              <Chip
                                label={activity.level}
                                size="small"
                                color="primary"
                              />
                            )}
                            {activity.part_type && (
                              <Chip
                                label={`Part ${activity.part_type}`}
                                size="small"
                              />
                            )}
                          </Box>
                        }
                        secondary={
                          <Stack spacing={0.5} mt={0.5}>
                            {(activity.description || activity.summary) && (
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                {activity.description || activity.summary}
                              </Typography>
                            )}
                            <Box display="flex" gap={2}>
                              {activity.planned_completion_time && (
                                <Typography
                                  variant="caption"
                                  color="text.secondary"
                                >
                                  ⏱{" "}
                                  {formatTime(activity.planned_completion_time)}
                                </Typography>
                              )}
                              {activity.duration && (
                                <Typography
                                  variant="caption"
                                  color="text.secondary"
                                >
                                  ⏱ {activity.duration}s
                                </Typography>
                              )}
                              {activity.question_count && (
                                <Typography
                                  variant="caption"
                                  color="text.secondary"
                                >
                                  ❓ {activity.question_count} câu
                                </Typography>
                              )}
                              {activity.student_count !== undefined && (
                                <Typography
                                  variant="caption"
                                  color="text.secondary"
                                >
                                  👥 {activity.student_count} học viên
                                </Typography>
                              )}
                              {activity.rating !== undefined &&
                                activity.rating > 0 && (
                                  <Typography
                                    variant="caption"
                                    color="text.secondary"
                                  >
                                    ⭐ {activity.rating.toFixed(1)}
                                  </Typography>
                                )}
                            </Box>
                          </Stack>
                        }
                      />
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
            )}
          </Paper>
        </Stack>
      </DialogContent>

      {/* Activity Preview Dialog */}
      <ActivityPreviewDialog
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
        activityId={previewActivityId}
        kind={previewActivityKind}
      />
    </Dialog>
  );
};

export default LessonSearchDialog;
