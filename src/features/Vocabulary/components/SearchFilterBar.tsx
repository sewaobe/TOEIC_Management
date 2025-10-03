import { TextField, InputAdornment, Tabs, Tab, IconButton, Tooltip } from "@mui/material"
import { Search, GridView, ViewList } from "@mui/icons-material"

interface Props {
  searchQuery: string
  setSearchQuery: (v: string) => void
  filterLevel: string
  setFilterLevel: (v: string) => void
  viewMode: "list" | "grid"
  setViewMode: (v: "list" | "grid") => void
}

const SearchFilterBar = ({
  searchQuery,
  setSearchQuery,
  filterLevel,
  setFilterLevel,
  viewMode,
  setViewMode,
}: Props) => {
  return (
    <div className="flex flex-col md:flex-row items-stretch md:items-center gap-4 bg-gray-50 rounded-2xl p-4 border border-gray-200">
      {/* Ô tìm kiếm */}
      <TextField
        placeholder="Tìm kiếm từ vựng..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        variant="outlined"
        size="small"
        className="flex-1"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Search className="text-gray-400" />
            </InputAdornment>
          ),
          sx: {
            backgroundColor: "white",
            borderRadius: 2,
            "& fieldset": { borderColor: "#E5E7EB" },
            "&:hover fieldset": { borderColor: "#14B8A6" },
            "&.Mui-focused fieldset": { borderColor: "#14B8A6" },
          },
        }}
      />

      {/* Tabs filter */}
      <Tabs
        value={filterLevel}
        onChange={(e, newValue) => setFilterLevel(newValue)}
        sx={{
          minHeight: 40,
          "& .MuiTab-root": {
            minHeight: 40,
            textTransform: "none",
            fontWeight: 600,
            fontSize: "0.875rem",
            transition: "all 0.2s ease",
          },
          "& .Mui-selected": {
            color: "#14B8A6 !important",
          },
          "& .MuiTabs-indicator": {
            backgroundColor: "#14B8A6",
          },
        }}
      >
        <Tab label="Tất cả" value="All" />
        <Tab label="Basic" value="Basic" />
        <Tab label="Intermediate" value="Intermediate" />
        <Tab label="Advanced" value="Advanced" />
      </Tabs>

      {/* Nút chuyển chế độ list / grid */}
      <div className="flex items-center gap-2 bg-white rounded-xl p-1 border border-gray-200">
        <Tooltip title="Chế độ danh sách">
          <IconButton
            size="small"
            onClick={() => setViewMode("list")}
            sx={{
              backgroundColor: viewMode === "list" ? "#14B8A6" : "transparent",
              color: viewMode === "list" ? "white" : "#6B7280",
              transition: "all 0.2s ease",
              "&:hover": {
                backgroundColor: viewMode === "list" ? "#0D9488" : "#F3F4F6",
              },
            }}
          >
            <ViewList />
          </IconButton>
        </Tooltip>
        <Tooltip title="Chế độ lưới">
          <IconButton
            size="small"
            onClick={() => setViewMode("grid")}
            sx={{
              backgroundColor: viewMode === "grid" ? "#14B8A6" : "transparent",
              color: viewMode === "grid" ? "white" : "#6B7280",
              transition: "all 0.2s ease",
              "&:hover": {
                backgroundColor: viewMode === "grid" ? "#0D9488" : "#F3F4F6",
              },
            }}
          >
            <GridView />
          </IconButton>
        </Tooltip>
      </div>
    </div>
  )
}

export default SearchFilterBar
