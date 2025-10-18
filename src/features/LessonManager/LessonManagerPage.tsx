import React, { useState, useMemo, useEffect } from "react";
import {
    Box,
    Grid,
    Pagination,
    Typography,
    TextField,
    MenuItem,
    InputAdornment,
    Select,
    FormControl,
    InputLabel,
    Card,
    CardContent,
    Chip,
    Button,
    IconButton,
    Menu,
    MenuItem as MuiMenuItem,
    Skeleton,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import StarIcon from "@mui/icons-material/Star";

// =====================
// Types
// =====================
type CERFLevel = "A1" | "A2" | "B1" | "B2" | "C1" | "C2";
type PartType = "Part1" | "Part2" | "Part3" | "Part4" | "Part5" | "Part6" | "Part7";
type TestStatus = "draft" | "pending" | "approved";

interface ILessonManager {
    _id: string;
    title: string;
    description?: string;
    thumbnail?: string;
    level: CERFLevel;
    part_type: PartType;
    status: TestStatus;
    weight: number;
    planned_completion_time: number;
    rating?: number;
    student_count?: number;
    created_at: Date;
    created_by: string;
}

// =====================
// UI helpers
// =====================
const levelColors: Record<CERFLevel, string> = {
    A1: "#22c55e",
    A2: "#10b981",
    B1: "#06b6d4",
    B2: "#3b82f6",
    C1: "#8b5cf6",
    C2: "#f97316",
};

const statusColor: Record<TestStatus, string> = {
    draft: "#9ca3af",
    pending: "#facc15",
    approved: "#22c55e",
};

// =====================
// Card component
// =====================
const LessonCard = ({ data }: { data: ILessonManager }) => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const handleMenu = (event: React.MouseEvent<HTMLButtonElement>) => setAnchorEl(event.currentTarget);
    const handleClose = () => setAnchorEl(null);
    const [isHover, setIsHover] = useState(false);

    return (
        <Card
            className="rounded-2xl shadow-md hover:shadow-xl transition-all overflow-hidden w-full h-full"
        >
            <Box
                className="relative h-44 overflow-hidden cursor-pointer"
                onMouseEnter={() => setIsHover(true)}
                onMouseLeave={() => setIsHover(false)}>
                <img
                    src={data.thumbnail}
                    alt={data.title}
                    className={`w-full h-full object-cover transition-transform duration-300 ${isHover ? 'scale-105' : ''}`}
                />
                <Chip
                    label={data.status === "approved" ? "Đã duyệt" : data.status === "pending" ? "Chờ duyệt" : "Nháp"}
                    size="small"
                    sx={{ position: "absolute", top: 8, right: 8, bgcolor: statusColor[data.status], color: "white", fontWeight: 600 }}
                />
                {isHover && (
                    <Box className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center text-white text-center transition-opacity duration-300">
                        <Typography variant="h6">{data.title}</Typography>
                        <Typography variant="body2" className="text-gray-200 mt-1">
                            🕒 {data.planned_completion_time} phút | 👥 {data.student_count}
                        </Typography>
                        <Box className="flex items-center justify-center mt-1">
                            {Array.from({ length: 5 }).map((_, i) => (
                                <StarIcon key={i} fontSize="small" color={i < Math.round(data.rating || 0) ? "warning" : "disabled"} />
                            ))}
                        </Box>
                    </Box>
                )}
            </Box>

            <CardContent>
                <Typography variant="subtitle1" fontWeight={700} noWrap>
                    {data.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" noWrap>
                    {data.description}
                </Typography>
                <Box className="flex gap-1 my-2">
                    <Chip label={data.level} size="small" sx={{ bgcolor: levelColors[data.level], color: "white" }} />
                    <Chip label={data.part_type} size="small" variant="outlined" />
                </Box>

                <Box className="flex justify-between items-center">
                    <Button variant="contained" color="info" size="small" startIcon={<VisibilityIcon />}>
                        Xem
                    </Button>
                    <IconButton size="small" onClick={handleMenu}>
                        <MoreVertIcon />
                    </IconButton>
                    <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
                        <MuiMenuItem onClick={handleClose}>
                            <EditIcon fontSize="small" className="mr-2" /> Chỉnh sửa
                        </MuiMenuItem>
                        <MuiMenuItem onClick={handleClose}>
                            <DeleteIcon fontSize="small" className="mr-2 text-red-500" /> Xóa
                        </MuiMenuItem>
                    </Menu>
                </Box>
            </CardContent>
        </Card>
    );
};

// =====================
// Mock data
// =====================
const mockLessons: ILessonManager[] = Array.from({ length: 40 }).map((_, i) => ({
    _id: `m${i + 1}`,
    title: `Unit ${i + 1} - Business Topic ${i + 1}`,
    description: "Learn essential communication and vocabulary skills.",
    thumbnail: `https://picsum.photos/seed/lesson${i}/500/300`,
    level: (["A1", "A2", "B1", "B2"] as any)[i % 4],
    part_type: (`Part${(i % 7) + 1}`) as any,
    status: i % 3 === 0 ? "approved" : i % 3 === 1 ? "pending" : "draft",
    weight: 70,
    planned_completion_time: 30 + (i % 4) * 15,
    rating: 3.5 + (i % 2),
    student_count: 150 + i * 12,
    created_at: new Date(),
    created_by: "u1",
}));

// =====================
// Page component
// =====================
export default function LessonManagerPage() {
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");
    const [levelFilter, setLevelFilter] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => setLoading(false), 1200);
        return () => clearTimeout(timer);
    }, []);

    const lessonsPerPage = 6;

    const filteredLessons = useMemo(() => {
        return mockLessons.filter((lesson) => {
            const matchSearch = lesson.title.toLowerCase().includes(search.toLowerCase());
            const matchLevel = levelFilter ? lesson.level === levelFilter : true;
            const matchStatus = statusFilter ? lesson.status === statusFilter : true;
            return matchSearch && matchLevel && matchStatus;
        });
    }, [search, levelFilter, statusFilter]);

    const totalPages = Math.ceil(filteredLessons.length / lessonsPerPage);
    const currentLessons = filteredLessons.slice((page - 1) * lessonsPerPage, page * lessonsPerPage);

    return (
        <Box className="min-h-screen bg-gray-50 p-8 space-y-6">
            <Typography variant="h5" fontWeight={700}>
                Danh sách bài học tổng hợp
            </Typography>

            {/* Search & Filters */}
            <Box className="flex flex-col md:flex-row gap-4 md:items-center">
                <TextField
                    placeholder="Tìm kiếm bài học..."
                    variant="outlined"
                    size="small"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon color="action" />
                            </InputAdornment>
                        ),
                    }}
                    sx={{ flex: 1 }}
                />

                <FormControl size="small" sx={{ minWidth: 150 }}>
                    <InputLabel>Cấp độ</InputLabel>
                    <Select value={levelFilter} label="Cấp độ" onChange={(e) => setLevelFilter(e.target.value)}>
                        <MenuItem value="">Tất cả</MenuItem>
                        <MenuItem value="A1">A1</MenuItem>
                        <MenuItem value="A2">A2</MenuItem>
                        <MenuItem value="B1">B1</MenuItem>
                        <MenuItem value="B2">B2</MenuItem>
                    </Select>
                </FormControl>

                <FormControl size="small" sx={{ minWidth: 150 }}>
                    <InputLabel>Trạng thái</InputLabel>
                    <Select value={statusFilter} label="Trạng thái" onChange={(e) => setStatusFilter(e.target.value)}>
                        <MenuItem value="">Tất cả</MenuItem>
                        <MenuItem value="approved">Đã duyệt</MenuItem>
                        <MenuItem value="pending">Chờ duyệt</MenuItem>
                        <MenuItem value="draft">Nháp</MenuItem>
                    </Select>
                </FormControl>
            </Box>

            {/* Grid list */}
            <Grid container spacing={3}>
                {loading ? (
                    Array.from({ length: lessonsPerPage }).map((_, i) => (
                        <Grid size={{ xs: 12, sm: 6, md: 4 }} key={i}>
                            <Card className="rounded-2xl shadow-md overflow-hidden w-full h-full">
                                <Skeleton variant="rectangular" height={176} width="100%" />
                                <CardContent>
                                    <Skeleton width="90%" height={24} sx={{ mb: 1 }} />
                                    <Skeleton width="75%" height={20} sx={{ mb: 2 }} />
                                    <Box className="flex gap-2 mt-2">
                                        <Skeleton variant="rectangular" width={70} height={28} />
                                        <Skeleton variant="rectangular" width={70} height={28} />
                                    </Box>
                                    <Box className="flex justify-between items-center mt-3">
                                        <Skeleton variant="rectangular" width={90} height={36} />
                                        <Skeleton variant="circular" width={36} height={36} />
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))
                ) : currentLessons.length > 0 ? (
                    currentLessons.map((lesson) => (
                        <Grid size={{ xs: 12, sm: 6, md: 4 }} key={lesson._id}>
                            <LessonCard data={lesson} />
                        </Grid>
                    ))
                ) : (
                    <Grid size={{ xs: 12 }}>
                        <Typography variant="body1" color="text.secondary" align="center" className="py-12">
                            Không tìm thấy bài học nào.
                        </Typography>
                    </Grid>
                )}
            </Grid>

            {/* Pagination */}
            {!loading && totalPages > 1 && (
                <Box className="flex justify-center mt-8">
                    <Pagination
                        count={totalPages}
                        page={page}
                        onChange={(_, val) => setPage(val)}
                        color="primary"
                        shape="rounded"
                    />
                </Box>
            )}
        </Box>
    );
}
