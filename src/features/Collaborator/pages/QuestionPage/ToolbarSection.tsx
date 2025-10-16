import {
  Box,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Autocomplete,
  Chip,
  Button,
} from "@mui/material";
import { Search, Add } from "@mui/icons-material";
import { motion } from "framer-motion";
import { examParts } from "../../../../constants/examParts";
import { Dispatch, SetStateAction } from "react";

interface Props {
  search: string;
  setSearch: Dispatch<SetStateAction<string>>;
  statusFilter: string;
  setStatusFilter: Dispatch<SetStateAction<string>>;
  partFilter: number;
  setPartFilter: Dispatch<SetStateAction<number>>;
  tagFilter: string[];
  setTagFilter: Dispatch<SetStateAction<string[]>>;
  onAdd: () => void;
}

export default function ToolbarSection({
  search,
  setSearch,
  statusFilter,
  setStatusFilter,
  partFilter,
  setPartFilter,
  tagFilter,
  setTagFilter,
  onAdd,
}: Props) {
  const currentTags =
    partFilter > 0 ? examParts[partFilter].tags.map((t) => t.name) : [];

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        mb: 2,
        flexWrap: "wrap",
        gap: 2,
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 2, flexWrap: "wrap" }}>
        {/* Search */}
        <TextField
          variant="outlined"
          placeholder="Tìm kiếm câu hỏi..."
          size="small"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ width: 300 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
        />

        {/* Status filter */}
        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>Trạng thái</InputLabel>
          <Select
            value={statusFilter}
            label="Trạng thái"
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <MenuItem value="">Tất cả</MenuItem>
            <MenuItem value="Chưa hoàn thiện">Chưa hoàn thiện</MenuItem>
            <MenuItem value="Hoàn thiện">Hoàn thiện</MenuItem>
          </Select>
        </FormControl>

        {/* Part filter */}
        <FormControl size="small" sx={{ minWidth: 180 }}>
          <InputLabel>Part</InputLabel>
          <Select
            value={partFilter}
            label="Part"
            onChange={(e) => {
              setPartFilter(Number(e.target.value));
              setTagFilter([]);
            }}
          >
            <MenuItem value={0}>Tất cả</MenuItem>
            {examParts.map(
              (part, idx) =>
                idx > 0 && (
                  <MenuItem key={idx} value={idx}>
                    {part.label}
                  </MenuItem>
                )
            )}
          </Select>
        </FormControl>

        {/* Tag filter */}
        {partFilter > 0 && (
          <Autocomplete
            multiple
            size="small"
            options={currentTags}
            value={tagFilter}
            onChange={(_, newValue) => setTagFilter(newValue)}
            sx={{ minWidth: 250 }}
            renderTags={(value, getTagProps) =>
              value.map((option, index) => (
                <Chip
                  variant="outlined"
                  label={option}
                  {...getTagProps({ index })}
                  key={option}
                />
              ))
            }
            renderInput={(params) => (
              <TextField {...params} label="Tags" placeholder="Chọn tag" />
            )}
          />
        )}
      </Box>

      {/* Add button */}
      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
        <Button variant="contained" color="primary" startIcon={<Add />} onClick={onAdd}>
          Thêm câu hỏi
        </Button>
      </motion.div>
    </Box>
  );
}
