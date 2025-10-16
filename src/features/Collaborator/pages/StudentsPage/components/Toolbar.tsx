"use client";

import {
  Box,
  TextField,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  Typography,
  Stack,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import GridViewIcon from "@mui/icons-material/GridView";
import ViewListIcon from "@mui/icons-material/ViewList";
import FilterListIcon from "@mui/icons-material/FilterList";

interface ToolbarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  statusFilter: string;
  onStatusFilterChange: (value: string) => void;
  targetScoreFilter: number;
  onTargetScoreChange: (value: number) => void;
  viewMode: "table" | "grid";
  onViewModeChange: (mode: "table" | "grid") => void;
}

export function Toolbar({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  targetScoreFilter,
  onTargetScoreChange,
  viewMode,
  onViewModeChange,
}: ToolbarProps) {
  return (
    <Paper sx={{ p: 2, borderRadius: 2, display: "flex", flexDirection: "column", gap: 2 }}>
      {/* 🔍 Tìm kiếm + chế độ xem */}
      <Stack direction={{ xs: "column", md: "row" }} spacing={2} justifyContent="space-between">
        <Box sx={{ position: "relative", flex: 1, maxWidth: 400 }}>
          <SearchIcon sx={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "text.secondary" }} />
          <TextField
            fullWidth
            size="small"
            variant="outlined"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Tìm kiếm theo tên hoặc email..."
            sx={{ "& .MuiInputBase-input": { pl: 4 } }}
          />
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <IconButton
            color={viewMode === "table" ? "primary" : "default"}
            onClick={() => onViewModeChange("table")}
          >
            <ViewListIcon />
          </IconButton>
          <IconButton
            color={viewMode === "grid" ? "primary" : "default"}
            onClick={() => onViewModeChange("grid")}
          >
            <GridViewIcon />
          </IconButton>
        </Box>
      </Stack>

      {/* 🧩 Bộ lọc */}
      <Stack direction={{ xs: "column", md: "row" }} spacing={2} alignItems="center">
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <FilterListIcon color="action" />
          <Typography variant="body2" fontWeight={500}>
            Bộ lọc:
          </Typography>
        </Box>

        <FormControl size="small" sx={{ minWidth: 180 }}>
          <InputLabel>Trạng thái</InputLabel>
          <Select
            label="Trạng thái"
            value={statusFilter}
            onChange={(e) => onStatusFilterChange(e.target.value)}
          >
            <MenuItem value="all">Tất cả trạng thái</MenuItem>
            <MenuItem value="active">Đang học</MenuItem>
            <MenuItem value="inactive">Không hoạt động</MenuItem>
            <MenuItem value="completed">Hoàn thành</MenuItem>
          </Select>
        </FormControl>

        <TextField
          size="small"
          label="Điểm mục tiêu ≥"
          type="number"
          value={targetScoreFilter || ""}
          onChange={(e) => onTargetScoreChange(Number(e.target.value) || 0)}
          sx={{ width: 160 }}
        />
      </Stack>
    </Paper>
  );
}
