import { Box, Paper, TextField, IconButton, Button } from "@mui/material";
import { Search, GridView, List, Add, OpenInNew } from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";

interface Props {
  viewMode: "grid" | "list";
  setViewMode: (v: "grid" | "list") => void;
  onAddClick: () => void;
  onToggleFloating?: () => void;
}

export default function ToolbarSection({
  viewMode,
  setViewMode,
  onAddClick,
  onToggleFloating,
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
        placeholder="Tìm kiếm..."
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

        {/* ✅ Nút cuối – đen trắng, không đổi màu, chỉ nhận click */}
        {onToggleFloating && (
          <Button
            id="floating-btn"
            onClick={onToggleFloating}
            className="ml-2 flex items-center justify-center w-10 h-10 rounded-full bg-black text-white hover:opacity-80 transition"
          >
            <OpenInNew className="text-white" />
          </Button>
        )}
      </Box>
    </Paper>
  );
}
