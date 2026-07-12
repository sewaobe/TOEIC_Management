"use client";

import {
  Box,
  Typography,
  Card,
  CardContent,
  Stack,
  Avatar,
  Chip,
  useTheme,
} from "@mui/material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import EditNoteIcon from "@mui/icons-material/EditNote";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import LocalFireDepartmentIcon from "@mui/icons-material/LocalFireDepartment";
import type { Activity } from "../../../../../types/student";
import { formatDateTime } from "../utils/formatters";

interface ActivityListProps {
  activities: Activity[];
}

type PaletteKey =
  | "primary"
  | "success"
  | "warning"
  | "info"
  | "secondary"
  | "error";

function getTimestampValue(timestamp: string) {
  if (!timestamp) return null;
  const value = new Date(timestamp).getTime();
  return Number.isNaN(value) ? null : value;
}

function getActivityIcon(type: string) {
  const normalizedType = type.toLowerCase();

  switch (normalizedType) {
    case "activity_completed":
    case "stage_completed":
    case "lesson_complete":
    case "lesson":
      return <MenuBookIcon fontSize="small" />;
    case "cycle_completed":
      return <EmojiEventsIcon fontSize="small" />;
    case "test_submit":
    case "test":
      return <TaskAltIcon fontSize="small" />;
    case "adjustment_requested":
      return <EditNoteIcon fontSize="small" />;
    case "adjustment_approved":
      return <CheckCircleIcon fontSize="small" />;
    case "adjustment_rejected":
      return <CancelIcon fontSize="small" />;
    case "streak_milestone":
      return <LocalFireDepartmentIcon fontSize="small" />;
    default:
      return <AccessTimeIcon fontSize="small" />;
  }
}

function getActivityColor(type: string): PaletteKey {
  const normalizedType = type.toLowerCase();

  switch (normalizedType) {
    case "activity_completed":
    case "stage_completed":
    case "lesson_complete":
    case "lesson":
      return "primary";
    case "cycle_completed":
    case "streak_milestone":
      return "warning";
    case "test_submit":
    case "test":
    case "adjustment_approved":
      return "success";
    case "adjustment_requested":
      return "info";
    case "adjustment_rejected":
      return "error";
    default:
      return "secondary";
  }
}

function renderMetadataChips(activity: Activity) {
  const metadata = activity.metadata;
  if (!metadata) return null;
  const activityKind = metadata.activityKind ?? metadata.activity_kind;
  const sessionNo = metadata.sessionNo ?? metadata.session_no;

  return (
    <Box
      display="flex"
      flexWrap="wrap"
      gap={1}
      mt={1}
      sx={{ "& .MuiChip-root": { fontSize: "0.75rem" } }}
    >
      {typeof metadata.score === "number" && (
        <Chip
          label={`Điểm: ${metadata.score}`}
          size="small"
          color="info"
          variant="outlined"
        />
      )}
      {typeof activityKind === "string" && (
        <Chip
          label={`Loại bài: ${activityKind}`}
          size="small"
          color="primary"
          variant="outlined"
        />
      )}
      {typeof metadata.dayOfWeek === "number" && (
        <Chip
          label={`Stage: ${metadata.dayOfWeek + 1}`}
          size="small"
          color="primary"
          variant="outlined"
        />
      )}
      {typeof sessionNo === "number" && (
        <Chip
          label={`Session: ${sessionNo}`}
          size="small"
          color="secondary"
          variant="outlined"
        />
      )}
      {typeof metadata.duration === "number" && (
        <Chip
          label={`Thời gian: ${metadata.duration} phút`}
          size="small"
          color="secondary"
          variant="outlined"
        />
      )}
      {typeof metadata.totalQuestions === "number" && (
        <Chip
          label={`Số câu: ${metadata.totalQuestions}`}
          size="small"
          variant="outlined"
        />
      )}
      {typeof metadata.total_activities === "number" && (
        <Chip
          label={`Hoạt động: ${metadata.total_activities}`}
          size="small"
          color="primary"
          variant="outlined"
        />
      )}
      {typeof metadata.avg_accuracy === "number" && (
        <Chip
          label={`Độ chính xác: ${Math.round(metadata.avg_accuracy)}%`}
          size="small"
          color="success"
          variant="outlined"
        />
      )}
      {typeof metadata.week_no === "number" && (
        <Chip
          label={`Cycle: ${metadata.week_no}`}
          size="small"
          color="warning"
          variant="outlined"
        />
      )}
      {typeof metadata.changesCount === "number" && (
        <Chip
          label={`Thay đổi: ${metadata.changesCount}`}
          size="small"
          color="info"
          variant="outlined"
        />
      )}
      {typeof metadata.status === "string" && (
        <Chip
          label={`Trạng thái: ${metadata.status}`}
          size="small"
          color="secondary"
          variant="outlined"
        />
      )}
      {typeof metadata.milestone === "number" && (
        <Chip
          label={`Streak: ${metadata.milestone} ngày`}
          size="small"
          color="warning"
          variant="outlined"
        />
      )}
    </Box>
  );
}

export function ActivityList({ activities }: ActivityListProps) {
  const theme = useTheme();
  const sortedActivities = [...activities]
    .filter((activity) => getTimestampValue(activity.timestamp) !== null)
    .sort(
      (a, b) =>
        (getTimestampValue(b.timestamp) || 0) -
        (getTimestampValue(a.timestamp) || 0)
    );

  if (sortedActivities.length === 0) {
    return (
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        height={120}
      >
        <Typography color="text.secondary">
          Chưa có hoạt động nào
        </Typography>
      </Box>
    );
  }

  return (
    <Stack spacing={2}>
      {sortedActivities.map((activity) => {
        const paletteKey = getActivityColor(activity.type);
        const palette = theme.palette[paletteKey];

        return (
          <Card
            key={activity.id}
            variant="outlined"
            sx={{
              display: "flex",
              alignItems: "flex-start",
              gap: 2,
              p: 2,
              borderRadius: 2,
              bgcolor: theme.palette.background.paper,
            }}
          >
            <Avatar
              sx={{
                bgcolor: palette.light,
                color: palette.main,
                width: 36,
                height: 36,
                flexShrink: 0,
              }}
            >
              {getActivityIcon(activity.type)}
            </Avatar>

            <CardContent
              sx={{
                flex: 1,
                p: 0,
                "&:last-child": { pb: 0 },
              }}
            >
              <Typography variant="subtitle1" fontWeight={600}>
                {activity.title}
              </Typography>

              {activity.description && (
                <Typography variant="body2" color="text.secondary">
                  {activity.description}
                </Typography>
              )}

              {renderMetadataChips(activity)}
            </CardContent>

            <Typography
              variant="caption"
              color="text.secondary"
              sx={{
                minWidth: 80,
                textAlign: "right",
                mt: 0.5,
                flexShrink: 0,
              }}
            >
              {formatDateTime(activity.timestamp)}
            </Typography>
          </Card>
        );
      })}
    </Stack>
  );
}
