import React, { useState, useMemo, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
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
    Zoom,
    Tooltip,
    Fab,
} from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from "@mui/icons-material/Search";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import StarIcon from "@mui/icons-material/Star";
import { useNavigate } from "react-router-dom";
import { CERFLevel, LessonManager, TestStatus } from "../../types/LessonManager";
import LessonManagerEditModal from "./components/LessonManagerEditModal";
import LessonManagerDeleteModal from "./components/LessonManagerDeleteModal";
import { toast } from "sonner";
import { lessonManagerService } from "../../services/lesson_manager.service";
import { PaginationResult } from "../../types/PaginationResult";

// =====================
// Types
// =====================


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
interface LessonCardProps {
    data: LessonManager;
    onEdit: (lesson: LessonManager) => void;
    onDelete: (lesson: LessonManager) => void;
}
const LessonCard = ({ data, onEdit, onDelete }: LessonCardProps) => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const handleMenu = (event: React.MouseEvent<HTMLButtonElement>) => setAnchorEl(event.currentTarget);
    const handleClose = () => setAnchorEl(null);
    const [isHover, setIsHover] = useState(false);

    const navigate = useNavigate();
    const handleClickView = () => {
        navigate(`${data._id}`);
    }

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
                    className={`w-full h-full object-cover transition-transform duration-500 ${isHover ? 'scale-105' : ''}`}
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
                    <Chip label={`Part ${data.part_type}`} size="small" variant="outlined" />
                </Box>

                <Box className="flex justify-between items-center">
                    <Button className="flex-1" variant="contained" color="info" size="small" startIcon={<VisibilityIcon />} onClick={handleClickView}>
                        Xem
                    </Button>
                    <IconButton size="small" onClick={handleMenu}>
                        <MoreVertIcon />
                    </IconButton>
                    <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
                        <MuiMenuItem onClick={() => onEdit(data)}>
                            <EditIcon fontSize="small" className="mr-2" /> Chỉnh sửa
                        </MuiMenuItem>
                        <MuiMenuItem onClick={() => onDelete(data)}>
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

// =====================
// Page component
// =====================
export default function LessonManagerPage() {
    const [lessons, setLessons] = useState<LessonManager[]>([]);
    const [pagination, setPagination] = useState<PaginationResult<LessonManager>["pagination"] | null>(null);
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");
    const [levelFilter, setLevelFilter] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    const [loading, setLoading] = useState(true);

    const [editModal, setEditModal] = useState(false);
    const [deleteModal, setDeleteModal] = useState(false);
    const [form, setForm] = useState<Partial<LessonManager>>({});
    const [selectedLesson, setSelectedLesson] = useState<LessonManager | null>(null);

    const initialForm: Partial<LessonManager> = {
        title: "",
        description: "",
        level: "A1",
        part_type: 1,
        status: "draft",
        planned_completion_time: 30,
        weight: 0.5,
    };

    // Gọi API backend có phân trang
    const fetchLessonManagers = async (pageNum: number) => {
        try {
            setLoading(true);
            const start = performance.now();

            const res: PaginationResult<LessonManager> = await lessonManagerService.getAllLessonManager(pageNum, 9);
            setLessons(res.data);
            setPagination(res.pagination);

            const elapsed = performance.now() - start;
            const minDelay = 400;
            if (elapsed < minDelay) {
                await new Promise((resolve) => setTimeout(resolve, minDelay - elapsed));
            }

        } catch (err) {
            console.error(err);
            toast.error("Không thể tải danh sách bài học.");
        } finally {
            setLoading(false);
        }
    };

    // Lấy dữ liệu lần đầu
    useEffect(() => {
        fetchLessonManagers(1);
    }, []);

    // Khi đổi trang
    const handleChangePage = (_: any, newPage: number) => {
        setPage(newPage);
        fetchLessonManagers(newPage);
    };

    // Lọc client-side (nếu muốn kết hợp)
    const filteredLessons = useMemo(() => {
        return lessons.filter((lesson) => {
            const matchSearch = lesson.title.toLowerCase().includes(search.toLowerCase());
            const matchLevel = levelFilter ? lesson.level === levelFilter : true;
            const matchStatus = statusFilter ? lesson.status === statusFilter : true;
            return matchSearch && matchLevel && matchStatus;
        });
    }, [lessons, search, levelFilter, statusFilter]);

    const handleOpenEdit = (lesson?: LessonManager) => {
        setSelectedLesson(lesson || null);
        setForm(lesson || initialForm);
        setEditModal(true);
    };

    const handleOpenDelete = (lesson: LessonManager) => {
        setSelectedLesson(lesson);
        setDeleteModal(true);
    };

    const handleSave = async (finalForm?: Partial<LessonManager>) => {
        try {
            setLoading(true);
            if (!finalForm) finalForm = form;
            if (selectedLesson) {
                // Cập nhật
                await lessonManagerService.updateLessonManager(selectedLesson._id, finalForm);
            } else {
                // Tạo mới
                await lessonManagerService.createLessonManager(finalForm);
            }
        } catch (err) {
            toast.error("Lưu bài học tổng hợp thất bại.");
            return;
        }
        finally {
            setLoading(false);
        }
        toast.success("Lưu bài học tổng hợp thành công!");
        setEditModal(false);
        fetchLessonManagers(page);
    };

    const handleDelete = async () => {
        if (!selectedLesson) return;
        try {
            setLoading(true);
            await lessonManagerService.deleteLessonManager(selectedLesson._id);
            toast.success("Xóa bài học tổng hợp thành công!");
            fetchLessonManagers(1);
        } catch (err) {
            toast.error("Không thể xóa bài học.");
        } finally {
            setLoading(false);
            setDeleteModal(false);
        }
    };

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
                <AnimatePresence mode="wait">
                    {loading ? (
                        Array.from({ length: 9 }).map((_, i) => (
                            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={i}>
                                <motion.div
                                    key={`skeleton-${i}`}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.3 }}
                                >
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
                                </motion.div>
                            </Grid>
                        ))
                    ) : filteredLessons.length > 0 ? (
                        filteredLessons.map((lesson) => (
                            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={lesson._id}>
                                <motion.div
                                    key={lesson._id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ duration: 0.25 }}
                                >
                                    <LessonCard data={lesson} onEdit={handleOpenEdit} onDelete={handleOpenDelete} />
                                </motion.div>
                            </Grid>
                        ))
                    ) : (
                        <Grid size={{ xs: 12 }}>
                            <Typography variant="body1" color="text.secondary" align="center" className="py-12">
                                Không tìm thấy bài học nào.
                            </Typography>
                        </Grid>
                    )}
                </AnimatePresence>
            </Grid>

            {/* Pagination */}
            {!loading && pagination && pagination.totalPages > 1 && (
                <Box className="flex justify-center mt-8">
                    <Pagination
                        count={pagination.totalPages}
                        page={pagination.page}
                        onChange={handleChangePage}
                        color="primary"
                        shape="rounded"
                    />
                </Box>
            )}

            <LessonManagerEditModal
                open={editModal}
                form={form}
                onClose={() => setEditModal(false)}
                onChange={setForm}
                onSave={handleSave}
                isEdit={!!selectedLesson}
            />

            <LessonManagerDeleteModal
                open={deleteModal}
                lesson={selectedLesson}
                onClose={() => setDeleteModal(false)}
                onConfirm={handleDelete}
            />

            {/* Fab */}
            <Tooltip title="Thêm bài học tổng hợp">
                <Zoom in={true}>
                    <Fab
                        aria-label="add"
                        color="primary"
                        onClick={() => handleOpenEdit()}
                        sx={{ position: "fixed", bottom: 32, right: 32 }}
                    >
                        <AddIcon />
                    </Fab>
                </Zoom>
            </Tooltip>
        </Box>
    );
}
