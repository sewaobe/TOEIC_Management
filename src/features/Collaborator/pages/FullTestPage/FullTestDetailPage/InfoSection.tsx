import { Box, Chip, Divider, Grid, Paper, Typography } from "@mui/material";
import { FullTest } from "../../../../../types/fullTest";
import InfoRow from "./GroupsSection/InfoRow";
import { AccessTime, CalendarMonth, Forum, Person, TextSnippet } from "@mui/icons-material";

export default function InfoSection({ test }: { test: FullTest }) {
  return (
    <Paper sx={{ p: 4, mb: 5, boxShadow: 2, borderRadius: 2 }}>
      <Typography variant="h5" color="primary" fontWeight="bold">
        {test.title}
      </Typography>
      <Divider sx={{ my: 2 }} />

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 6 }}>
          <InfoRow icon={<TextSnippet color="primary" />} label="Chủ đề" value={test.topic || "—"} />
          <InfoRow icon={<AccessTime color="primary" />} label="Loại đề" value={test.type} />
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
            <Typography variant="body2" color="text.secondary">
              Trạng thái:
            </Typography>
            <Chip label={test.status.toUpperCase()} color="default" size="small" />
          </Box>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <InfoRow icon={<Person color="secondary" />} label="Người tạo" value={test.created_by || "Không rõ"} />
          <InfoRow
            icon={<CalendarMonth color="secondary" />}
            label="Ngày tạo"
            value={new Date(test.created_at).toLocaleDateString("vi-VN")}
          />
          <InfoRow icon={<Forum color="secondary" />} label="Bình luận" value={String(test.countComment ?? 0)} />
          <InfoRow icon={<TextSnippet color="secondary" />} label="Lượt làm" value={String(test.countSubmit ?? 0)} />
        </Grid>
      </Grid>
    </Paper>
  );
}
