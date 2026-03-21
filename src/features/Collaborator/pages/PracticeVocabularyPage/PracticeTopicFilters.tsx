import {
  Box,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";

interface PracticeTopicFiltersProps {
  search: string;
  setSearch: (value: string) => void;
  level: string;
  setLevel: (value: string) => void;
}

export default function PracticeTopicFilters({
  search,
  setSearch,
  level,
  setLevel,
}: PracticeTopicFiltersProps) {
  return (
    <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
      <TextField
        placeholder="Tìm kiếm chủ đề..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        sx={{ flex: 1 }}
        size="small"
      />
      <FormControl size="small" sx={{ minWidth: 150 }}>
        <InputLabel>Cấp độ</InputLabel>
        <Select
          value={level}
          onChange={(e) => setLevel(e.target.value)}
          label="Cấp độ"
        >
          <MenuItem value="all">Tất cả</MenuItem>
          <MenuItem value="A1">A1</MenuItem>
          <MenuItem value="A2">A2</MenuItem>
          <MenuItem value="B1">B1</MenuItem>
          <MenuItem value="B2">B2</MenuItem>
          <MenuItem value="C1">C1</MenuItem>
          <MenuItem value="C2">C2</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
}
