import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Typography,
  Box,
  Chip,
  Divider,
  Paper,
} from "@mui/material";
import { Close, AccessTime, BarChart, Layers } from "@mui/icons-material";
import InfoRow from "../FullTestPage/FullTestDetailPage/GroupsSection/InfoRow";
import GroupsSection from "../FullTestPage/FullTestDetailPage/GroupsSection";

export default function QuizDetailDialog({
  open,
  quiz,
  onClose,
}: {
  open: boolean;
  quiz: any;
  onClose: () => void;
}) {
  if (!quiz) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="md"
      sx={{
        "& .MuiDialog-paper": {
          borderRadius: 3,
          boxShadow: 8,
        },
      }}
    >
      {/* 🔹 Header */}
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          bgcolor: "#f8fafc",
          borderBottom: "1px solid #e0e0e0",
        }}
      >
        <Typography variant="h6" fontWeight="bold" color="primary">
          📘 {quiz.title}
        </Typography>
        <IconButton onClick={onClose}>
          <Close />
        </IconButton>
      </DialogTitle>

      {/* 🔸 Nội dung chính */}
      <DialogContent sx={{ p: 3, bgcolor: "#fafafa" }}>
        {/* 🧾 Thông tin tổng quan */}
        <Paper
          sx={{
            p: 3,
            mb: 3,
            borderRadius: 2,
            boxShadow: 1,
          }}
        >
          <Typography variant="subtitle1" fontWeight={600} color="primary" mb={1.5}>
            Thông tin Quiz
          </Typography>

          <Box display="flex" flexWrap="wrap" gap={2}>
            <Box flex={1} minWidth={220}>
              <InfoRow
                icon={<Layers color="primary" fontSize="small" />}
                label="Phần thi"
                value={quiz.part_type ? `Part ${quiz.part_type}` : "—"}
              />
              <InfoRow
                icon={<AccessTime color="primary" fontSize="small" />}
                label="Thời gian"
                value={quiz.planned_completion_time + " phút"}
              />
            </Box>

            <Box flex={1} minWidth={220}>
              <InfoRow
                icon={<BarChart color="primary" fontSize="small" />}
                label="Trình độ"
                value={quiz.level || "—"}
              />
              <InfoRow
                icon={<BarChart color="primary" fontSize="small" />}
                label="Trạng thái"
                value={quiz.status === "draft" ? "Nháp" : "Công khai"}
              />
            </Box>
          </Box>

          {/* 🏷️ Chủ đề (Topic) */}
          <Box mt={2}>
            <Typography variant="body2" color="text.secondary" mb={0.5}>
              Chủ đề:
            </Typography>
            {quiz.topic?.length ? (
              <Box display="flex" flexWrap="wrap" gap={1}>
                {quiz.topic.map((t: any) => (
                  <Chip
                    key={t._id || t.id}
                    label={t.title}
                    color="primary"
                    variant="outlined"
                    sx={{ fontWeight: 500 }}
                  />
                ))}
              </Box>
            ) : (
              <Typography variant="body2" color="text.disabled">
                Không có chủ đề
              </Typography>
            )}
          </Box>
        </Paper>

        <Divider sx={{ my: 3 }} />

        {/* 🧩 Danh sách nhóm câu hỏi */}
        <GroupsSection groups={quiz.group_ids || []} />
      </DialogContent>
    </Dialog>
  );
}
