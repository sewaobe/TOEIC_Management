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
import LoginIcon from "@mui/icons-material/Login";
import type { Activity } from "../../../../../types/student";
import { formatDateTime } from "../utils/formatters";

interface ActivityListProps {
  activities: Activity[];
}

export function ActivityList({ activities }: ActivityListProps) {
  const theme = useTheme();

  // 🧩 Map icon theo type
  const getActivityIcon = (type: string) => {
    const t = type.toLowerCase();
    switch (t) {
      case "lesson_complete":
      case "lesson":
        return <MenuBookIcon fontSize="small" />;
      case "test_submit":
      case "test":
        return <TaskAltIcon fontSize="small" />;
      case "achievement":
        return <EmojiEventsIcon fontSize="small" />;
      case "login":
        return <LoginIcon fontSize="small" />;
      default:
        return <AccessTimeIcon fontSize="small" />;
    }
  };

  // 🎨 Map màu chip / avatar theo type
  const getActivityColor = (
    type: string
  ): "primary" | "success" | "warning" | "info" | "secondary" => {
    const t = type.toLowerCase();
    switch (t) {
      case "lesson_complete":
      case "lesson":
        return "primary";
      case "test_submit":
      case "test":
        return "success";
      case "achievement":
        return "warning";
      case "login":
        return "secondary";
      default:
        return "info";
    }
  };

  if (activities.length === 0) {
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

  // 🔹 Sort mới nhất trước
  const sortedActivities = [...activities].sort(
    (a, b) =>
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

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
            {/* Icon trái */}
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

            {/* Nội dung chính */}
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

              <Typography variant="body2" color="text.secondary">
                {activity.description}
              </Typography>

              {activity.metadata && (
                <Box
                  display="flex"
                  flexWrap="wrap"
                  gap={1}
                  mt={1}
                  sx={{ "& .MuiChip-root": { fontSize: "0.75rem" } }}
                >
                  {typeof activity.metadata.score === "number" && (
                    <Chip
                      label={`Điểm: ${activity.metadata.score}`}
                      size="small"
                      color="info"
                      variant="outlined"
                    />
                  )}
                  {typeof activity.metadata.duration === "number" && (
                    <Chip
                      label={`Thời gian: ${activity.metadata.duration} phút`}
                      size="small"
                      color="secondary"
                      variant="outlined"
                    />
                  )}
                  {typeof activity.metadata.totalQuestions === "number" && (
                    <Chip
                      label={`Số câu: ${activity.metadata.totalQuestions}`}
                      size="small"
                      variant="outlined"
                    />
                  )}
                </Box>
              )}
            </CardContent>

            {/* Thời gian bên phải */}
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
