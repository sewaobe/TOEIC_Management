import {
  Box,
  IconButton,
  MenuItem,
  Paper,
  TextField,
  Tooltip,
} from "@mui/material";
import { Refresh } from "@mui/icons-material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { vi } from "date-fns/locale";
import { CTVReportStatus, CTVReportType } from "../types";

interface Props {
  search: string;
  onSearchChange: (value: string) => void;
  status: CTVReportStatus | "all";
  onStatusChange: (value: CTVReportStatus | "all") => void;
  type: CTVReportType | "all";
  onTypeChange: (value: CTVReportType | "all") => void;
  dateRange: [Date | null, Date | null];
  onDateRangeChange: (value: [Date | null, Date | null]) => void;
  loading: boolean;
  onRefresh: () => void;
}

const statusOptions: { value: CTVReportStatus | "all"; label: string }[] = [
  { value: "all", label: "Tất cả trạng thái" },
  { value: "pending", label: "Chờ xử lý" },
  { value: "in_progress", label: "Đang xử lý" },
  { value: "resolved", label: "Đã xử lý" },
  { value: "rejected", label: "Từ chối" },
];

// CTV chỉ xử lý 2 loại: bài học và flashcard
const typeOptions: { value: CTVReportType | "all"; label: string }[] = [
  { value: "all", label: "Tất cả loại" },
  { value: "lesson", label: "Lỗi bài học" },
  { value: "flashcard", label: "Lỗi flashcard" },
];

export default function CTVReportFilter({
  search,
  onSearchChange,
  status,
  onStatusChange,
  type,
  onTypeChange,
  dateRange,
  onDateRangeChange,
  loading,
  onRefresh,
}: Props) {
  const [from, to] = dateRange;

  return (
    <Paper
      sx={{
        p: 2,
        mb: 2,
        display: "flex",
        flexWrap: "wrap",
        gap: 2,
        alignItems: "center",
      }}
    >
      <TextField
        label="Tìm kiếm"
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        sx={{ minWidth: 220, flex: 1 }}
      />

      <TextField
        label="Trạng thái"
        select
        value={status}
        onChange={(e) =>
          onStatusChange(e.target.value as CTVReportStatus | "all")
        }
        sx={{ width: 200 }}
      >
        {statusOptions.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </TextField>

      <TextField
        label="Loại báo lỗi"
        select
        value={type}
        onChange={(e) => onTypeChange(e.target.value as CTVReportType | "all")}
        sx={{ width: 200 }}
      >
        {typeOptions.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </TextField>

      <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={vi}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <DatePicker
            label="Từ ngày"
            value={from}
            onChange={(value) => onDateRangeChange([value, to])}
            slotProps={{ textField: { size: "small" } }}
          />
          <DatePicker
            label="Đến ngày"
            value={to}
            onChange={(value) => onDateRangeChange([from, value])}
            slotProps={{ textField: { size: "small" } }}
          />
        </Box>
      </LocalizationProvider>

      <Tooltip title="Tải lại dữ liệu">
        <span>
          <IconButton onClick={onRefresh} disabled={loading}>
            <Refresh />
          </IconButton>
        </span>
      </Tooltip>
    </Paper>
  );
}
