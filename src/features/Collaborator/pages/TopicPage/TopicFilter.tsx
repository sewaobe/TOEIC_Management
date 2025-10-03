import { TextField, Select, MenuItem, InputAdornment } from "@mui/material"
import SearchIcon from "@mui/icons-material/Search"

interface Props {
  search: string
  setSearch: (v: string) => void
  filter: string
  setFilter: (v: string) => void
}

export default function TopicFilters({ search, setSearch, filter, setFilter }: Props) {
  return (
    <div className="flex flex-col md:flex-row gap-4 mb-6">
      <TextField
        placeholder="Tìm kiếm chủ đề..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon color="action" />
            </InputAdornment>
          ),
        }}
        className="flex-1"
        size="small"
      />

      <Select value={filter} onChange={(e) => setFilter(e.target.value)} size="small">
        <MenuItem value="all">Tất cả</MenuItem>
        <MenuItem value="new">Mới tạo</MenuItem>
        <MenuItem value="short">Ít hơn 30 từ</MenuItem>
      </Select>
    </div>
  )
}
