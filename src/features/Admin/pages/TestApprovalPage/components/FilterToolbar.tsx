import {
  Box,
  Paper,
  TextField,
  MenuItem,
  IconButton,
  Tooltip,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";

interface Props {
  search: string;
  setSearch: (v: string) => void;
  status: string;
  setStatus: (v: string) => void;
  type: string;
  setType: (v: string) => void;
  creator: string;
  setCreator: (v: string) => void;
  topic: string;
  setTopic: (v: string) => void;
  showPending: boolean;
  setShowPending: (v: boolean) => void;
  creatorOptions: string[];
  topicOptions: string[];
}

export default function FilterToolbar({
  search,
  setSearch,
  status,
  setStatus,
  type,
  setType,
  creator,
  setCreator,
  topic,
  setTopic,
  showPending,
  setShowPending,
  creatorOptions,
  topicOptions,
}: Props) {
  return (
    <Paper
      sx={{
        p: 2,
        mb: 2,
        display: "flex",
        flexWrap: "wrap",
        gap: 2,
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", flex: 1 }}>
        <TextField
          label="Tìm kiếm"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ width: "40%" }}
        />
        <TextField
          label="Trạng thái"
          select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          sx={{ width: 150 }}
        >
          <MenuItem value="">Tất cả</MenuItem>
          <MenuItem value="draft">Bản nháp</MenuItem>
          <MenuItem value="pending">Chờ duyệt</MenuItem>
          <MenuItem value="approved">Đã duyệt</MenuItem>
          <MenuItem value="open">Đang mở</MenuItem>
          <MenuItem value="closed">Đã đóng / Từ chối</MenuItem>
        </TextField>
        <TextField
          label="Loại đề"
          select
          value={type}
          onChange={(e) => setType(e.target.value)}
          sx={{ width: 150 }}
        >
          <MenuItem value="">Tất cả</MenuItem>
          {/* Giá trị truyền về backend phải khớp enum TestType (full-test, mini-test, part-test) */}
          <MenuItem value="full-test">Đề thi lớn</MenuItem>
          <MenuItem value="mini-test">Đề thi nhỏ</MenuItem>
        </TextField>
        <TextField
          label="Chủ đề"
          select
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          sx={{ width: 150 }}
        >
          <MenuItem value="">Tất cả</MenuItem>
          {topicOptions.map((tp) => (
            <MenuItem key={tp} value={tp}>
              {tp}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          label="Người tạo"
          select
          value={creator}
          onChange={(e) => setCreator(e.target.value)}
          sx={{ width: 180 }}
        >
          <MenuItem value="">Tất cả</MenuItem>
          {creatorOptions.map((c) => (
            <MenuItem key={c} value={c}>
              {c}
            </MenuItem>
          ))}
        </TextField>
      </Box>

      {!status && (
        <Tooltip
          title={showPending ? "Ẩn bảng cần duyệt" : "Hiện bảng cần duyệt"}
        >
          <IconButton
            onClick={() => setShowPending(!showPending)}
            sx={{
              bgcolor: "action.hover",
              "&:hover": { bgcolor: "primary.main", color: "white" },
            }}
          >
            {showPending ? <VisibilityOff /> : <Visibility />}
          </IconButton>
        </Tooltip>
      )}
    </Paper>
  );
}
