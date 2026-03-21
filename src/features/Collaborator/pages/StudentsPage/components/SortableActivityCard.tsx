import {
  Box,
  Chip,
  IconButton,
  Paper,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";

interface SortableActivityCardProps {
  id: string;
  item: any;
  activityId: string;
  activityTitle: string;
  color: any;
  isDone: boolean;
  removed: boolean;
  replaced: boolean;
  replaceTitle?: string;
  dayId: string;
  sIdx: number;
  iIdx: number;
  getActivityIcon: (kind?: string) => JSX.Element | null;
  getActivityLabel: (kind?: string) => string;
  getStatusLabel: (status: string) => string;
  onMenuOpen: (
    event: React.MouseEvent<HTMLElement>,
    lesson: any,
    dayId: string
  ) => void;
  onPreviewClick: () => void;
}

export function SortableActivityCard({
  id,
  item,
  activityId,
  activityTitle,
  color,
  isDone,
  removed,
  replaced,
  replaceTitle,
  dayId,
  sIdx,
  iIdx,
  getActivityIcon,
  getActivityLabel,
  getStatusLabel,
  onMenuOpen,
  onPreviewClick,
}: SortableActivityCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id, disabled: isDone });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const baseCard = (
    <Paper
      ref={setNodeRef}
      style={style}
      variant="outlined"
      sx={{
        position: "relative",
        p: 1.25,
        minWidth: 190,
        maxWidth: 240,
        borderColor: color === "default" ? "divider" : `${color}.main`,
        bgcolor: isDone ? "action.hover" : "background.paper",
        cursor: isDone ? "default" : "grab",
        transition: "all 0.15s ease",
        "&:hover": {
          boxShadow: 2,
          transform: isDragging ? undefined : "translateY(-2px)",
        },
        "&:active": {
          cursor: isDone ? "default" : "grabbing",
        },
      }}
    >
      {/* Drag handle - chỉ hiện khi chưa completed */}
      {!isDone && (
        <Box
          {...attributes}
          {...listeners}
          sx={{
            position: "absolute",
            top: 4,
            left: 4,
            cursor: "grab",
            "&:active": { cursor: "grabbing" },
            color: "text.secondary",
            display: "flex",
            alignItems: "center",
          }}
        >
          <DragIndicatorIcon fontSize="small" />
        </Box>
      )}

      <Box onClick={onPreviewClick} sx={{ cursor: "pointer" }}>
        <Stack
          direction="row"
          alignItems="center"
          spacing={1}
          mb={0.5}
          ml={!isDone ? 3 : 0}
        >
          {getActivityIcon(item.kind)}
          <Typography variant="body2" fontWeight={600} noWrap>
            {getActivityLabel(item.kind)}
          </Typography>
        </Stack>
        <Typography variant="body2" sx={{ wordBreak: "break-word" }}>
          {activityTitle || "Chưa có tiêu đề"}
        </Typography>
        <Box
          mt={1}
          display="flex"
          justifyContent="space-between"
          alignItems="center"
        >
          <Chip
            size="small"
            label={getStatusLabel(item.status)}
            variant="outlined"
            color={isDone ? "default" : color}
          />
          <Typography variant="caption" color="text.secondary">
            #{activityId?.slice(0, 6)}
          </Typography>
        </Box>
      </Box>

      {!isDone && (
        <IconButton
          size="small"
          sx={{ position: "absolute", top: 4, right: 4 }}
          onClick={(e) => {
            e.stopPropagation();
            onMenuOpen(
              e,
              {
                _id: activityId,
                title: activityTitle,
                kind: item.kind,
                status: item.status,
              },
              dayId
            );
          }}
        >
          <MoreVertIcon fontSize="small" />
        </IconButton>
      )}
    </Paper>
  );

  if (removed) {
    return (
      <Tooltip key={`${sIdx}-${iIdx}`} title="Đã đánh dấu xóa">
        <Box sx={{ opacity: 0.6 }}>{baseCard}</Box>
      </Tooltip>
    );
  }

  if (replaced) {
    return (
      <Tooltip
        key={`${sIdx}-${iIdx}`}
        title={`Sẽ thay thế bằng: ${replaceTitle}`}
      >
        <Box sx={{ opacity: 0.6, borderColor: "warning.main" }}>{baseCard}</Box>
      </Tooltip>
    );
  }

  return baseCard;
}
