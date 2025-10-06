import {
  Box,
  Paper,
  TextField,
  IconButton,
  Button,
  Tooltip,
} from "@mui/material";
import { Search, GridView, List, Add, Refresh } from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";

interface Props {
  viewMode: "grid" | "list";
  setViewMode: (v: "grid" | "list") => void;
  onAddClick: () => void;
  onRefresh: () => void;
  searchValue: string;
  onSearchChange: (value: string) => void;
}

export default function ToolbarSection({
  viewMode,
  setViewMode,
  onAddClick,
  onRefresh,
  searchValue,
  onSearchChange,
}: Props) {
  const theme = useTheme();

  return (
    <Paper
      className="flex items-center justify-between p-3 border-b shadow-sm mb-3"
      sx={{
        bgcolor: theme.palette.background.paper,
        color: theme.palette.text.primary,
      }}
    >
      {/* Ô tìm kiếm */}
      <TextField
        size="small"
        placeholder="Tìm kiếm video toàn hệ thống..."
        value={searchValue}
        onChange={(e) => onSearchChange(e.target.value)}
        sx={{
          width: 300,
          "& .MuiOutlinedInput-root fieldset": {
            borderColor: theme.palette.divider,
          },
          "& .MuiOutlinedInput-root:hover fieldset": {
            borderColor: theme.palette.primary.main,
          },
        }}
        InputProps={{
          startAdornment: <Search className="mr-2 text-gray-400" />,
        }}
      />

      {/* Các nút chức năng */}
      <Box className="flex gap-2 items-center">
        <Tooltip title="Tải lại dữ liệu">
          <IconButton color="default" onClick={onRefresh}>
            <Refresh />
          </IconButton>
        </Tooltip>

        <IconButton
          color={viewMode === "grid" ? "primary" : "default"}
          onClick={() => setViewMode("grid")}
        >
          <GridView />
        </IconButton>

        <IconButton
          color={viewMode === "list" ? "primary" : "default"}
          onClick={() => setViewMode("list")}
        >
          <List />
        </IconButton>

        <Button variant="contained" startIcon={<Add />} onClick={onAddClick}>
          Thêm File
        </Button>
      </Box>
    </Paper>
  );
}
