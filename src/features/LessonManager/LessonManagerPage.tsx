import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    Fab,
    FormControl,
    IconButton,
    InputAdornment,
    InputLabel,
    Menu,
    MenuItem,
    MenuItem as MuiMenuItem,
    Pagination,
    Select,
    Skeleton,
    TextField,
    Tooltip,
    Typography,
    Zoom,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import StarIcon from "@mui/icons-material/Star";
import { useNavigate } from "react-router-dom";
import {
    CtvLessonManagerNodeRole,
    isLessonManagerEditable,
    LessonManager,
    LessonManagerFilters,
    LessonManagerUnitType,
    NodeRoleLabel,
    TestStatus,
    TestStatusLabel,
    UnitTypeLabel,
} from "../../types/LessonManager";
import LessonManagerEditModal from "./components/LessonManagerEditModal";
import LessonManagerDeleteModal from "./components/LessonManagerDeleteModal";
import { toast } from "sonner";
import { lessonManagerService } from "../../services/lesson_manager.service";
import { PaginationResult } from "../../types/PaginationResult";
import { toeicPartsArray } from "../../utils/toeicPart";

export const statusColor: Record<TestStatus, string> = {
    draft: "#9ca3af",
    pending: "#facc15",
    approved: "#22c55e",
    open: "#3b82f6",
    closed: "#ef4444",
    rejected: "#ef4444",
};

const unitTypeOptions: LessonManagerUnitType[] = [
    "foundation",
    "skill_drill",
    "mixed_practice",
    "exam_practice",
    "remedial",
];
const nodeRoleOptions: CtvLessonManagerNodeRole[] = ["normal", "support"];
const targetTagOptions = toeicPartsArray
    .flatMap((part) => part.tags)
    .filter((tag, index, tags) => tags.indexOf(tag) === index);

interface LessonCardProps {
    data: LessonManager;
    onEdit: (lesson: LessonManager) => void;
    onDelete: (lesson: LessonManager) => void;
}

const LessonCard = ({ data, onEdit, onDelete }: LessonCardProps) => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const [isHover, setIsHover] = useState(false);
    const navigate = useNavigate();
    const editable = isLessonManagerEditable(data.status);

    return (
        <Card className="rounded-2xl shadow-md hover:shadow-xl transition-all overflow-hidden w-full h-full">
            <Box
                className="relative h-44 overflow-hidden cursor-pointer"
                onMouseEnter={() => setIsHover(true)}
                onMouseLeave={() => setIsHover(false)}
            >
                <img
                    src={data.thumbnail || "https://res.cloudinary.com/dgi1g967z/image/upload/v1780219832/jh1nyaim79isvrgo4yf0.webp"}
                    alt={data.title}
                    className={`w-full h-full object-cover transition-transform duration-500 ${isHover ? "scale-105" : ""}`}
                />
                <Chip
                    label={TestStatusLabel[data.status]}
                    size="small"
                    sx={{
                        position: "absolute",
                        top: 8,
                        right: 8,
                        bgcolor: statusColor[data.status],
                        color: "white",
                        fontWeight: 600,
                    }}
                />
                {isHover && (
                    <Box className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center text-white text-center transition-opacity duration-300">
                        <Typography variant="h6">{data.title}</Typography>
                        <Typography variant="body2" className="text-gray-200 mt-1">
                            {data.planned_completion_time || 0} phút | {data.student_count || 0} học viên
                        </Typography>
                        <Box className="flex items-center justify-center mt-1">
                            {Array.from({ length: 5 }).map((_, i) => (
                                <StarIcon
                                    key={i}
                                    fontSize="small"
                                    color={i < Math.round(data.rating || 0) ? "warning" : "disabled"}
                                />
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
                <Box className="flex flex-wrap gap-1 my-2">
                    <Chip label={`Part ${data.part_type}`} size="small" variant="outlined" />
                    <Chip label={`${data.score_band?.from ?? "-"}-${data.score_band?.to ?? "-"}`} size="small" variant="outlined" />
                    <Chip label={UnitTypeLabel[data.unit_type]} size="small" variant="outlined" />
                    <Chip label={NodeRoleLabel[data.node_role]} size="small" variant="outlined" />
                    <Chip label={`Weight ${Number(data.weight || 0).toFixed(3)}`} size="small" variant="outlined" />
                </Box>
                <Box className="flex flex-wrap gap-1 mb-2">
                    {(data.target_tags || []).slice(0, 3).map((tag) => (
                        <Chip key={tag} label={tag} size="small" />
                    ))}
                    {(data.target_tags || []).length > 3 && (
                        <Chip label={`+${data.target_tags.length - 3}`} size="small" />
                    )}
                </Box>

                <Box className="flex justify-between items-center">
                    <Button
                        className="flex-1"
                        variant="contained"
                        color="info"
                        size="small"
                        startIcon={<VisibilityIcon />}
                        onClick={() => navigate(`${data._id}`)}
                    >
                        Xem
                    </Button>
                    <IconButton size="small" onClick={(event) => setAnchorEl(event.currentTarget)}>
                        <MoreVertIcon />
                    </IconButton>
                    <Menu anchorEl={anchorEl} open={open} onClose={() => setAnchorEl(null)}>
                        <MuiMenuItem onClick={() => onEdit(data)} disabled={!editable}>
                            <EditIcon fontSize="small" className="mr-2" /> Chỉnh sửa
                        </MuiMenuItem>
                        <MuiMenuItem onClick={() => onDelete(data)} disabled={!editable}>
                            <DeleteIcon fontSize="small" className="mr-2 text-red-500" /> Xóa
                        </MuiMenuItem>
                    </Menu>
                </Box>
            </CardContent>
        </Card>
    );
};

export default function LessonManagerPage() {
    const [lessons, setLessons] = useState<LessonManager[]>([]);
    const [pagination, setPagination] = useState<PaginationResult<LessonManager>["pagination"] | null>(null);
    const [page, setPage] = useState(1);
    const [filters, setFilters] = useState<LessonManagerFilters>({ query: "" });
    const [loading, setLoading] = useState(true);
    const [editModal, setEditModal] = useState(false);
    const [deleteModal, setDeleteModal] = useState(false);
    const [form, setForm] = useState<Partial<LessonManager>>({});
    const [selectedLesson, setSelectedLesson] = useState<LessonManager | null>(null);

    const initialForm: Partial<LessonManager> = {
        title: "",
        description: "",
        thumbnail: "",
        part_type: 1,
        score_band: { from: 200, to: 250 },
        unit_type: "foundation",
        node_role: "normal",
        target_tags: [],
        recommended_activity_order: [],
        status: "draft",
        planned_completion_time: 0,
        weight: 0,
    };

    const apiFilters = useMemo(
        () =>
            Object.fromEntries(
                Object.entries(filters).filter(([, value]) => value !== "" && value !== undefined)
            ) as LessonManagerFilters,
        [filters]
    );

    const fetchLessonManagers = async (pageNum: number) => {
        try {
            setLoading(true);
            const res = await lessonManagerService.getAllLessonManager(pageNum, 9, apiFilters);
            setLessons(res.data);
            setPagination(res.pagination);
        } catch (err) {
            console.error(err);
            toast.error("Không thể tải danh sách bài học.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLessonManagers(page);
    }, [page, apiFilters]);

    const setFilter = <K extends keyof LessonManagerFilters>(key: K, value: LessonManagerFilters[K]) => {
        setPage(1);
        setFilters((prev) => ({ ...prev, [key]: value }));
    };

    const handleOpenEdit = (lesson?: LessonManager) => {
        setSelectedLesson(lesson || null);
        setForm(lesson || initialForm);
        setEditModal(true);
    };

    const handleSave = async (finalForm?: Partial<LessonManager>) => {
        try {
            setLoading(true);
            const payload = finalForm || form;
            if (selectedLesson) {
                await lessonManagerService.updateLessonManager(selectedLesson._id, payload);
            } else {
                await lessonManagerService.createLessonManager(payload);
            }
            toast.success("Lưu bài học tổng hợp thành công.");
            setEditModal(false);
            fetchLessonManagers(page);
        } catch (err) {
            toast.error("Lưu bài học tổng hợp thất bại.");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!selectedLesson) return;
        try {
            setLoading(true);
            await lessonManagerService.deleteLessonManager(selectedLesson._id);
            toast.success("Xóa bài học tổng hợp thành công.");
            setPage(1);
            fetchLessonManagers(1);
        } catch (err) {
            toast.error("Không thể xóa bài học.");
        } finally {
            setLoading(false);
            setDeleteModal(false);
        }
    };

    return (
        <Box
            className="min-h-screen bg-gray-50 space-y-6"
            sx={{
                width: "100%",
                maxWidth: 1240,
                mx: "auto",
                px: { xs: 2, sm: 3, md: 3 },
                py: { xs: 2, md: 3 },
                boxSizing: "border-box",
                overflowX: "hidden",
            }}
        >
            <Typography variant="h5" fontWeight={700}>
                Danh sách bài học tổng hợp
            </Typography>

            <Box
                sx={{
                    display: "grid",
                    gridTemplateColumns: {
                        xs: "1fr",
                        sm: "1fr 1fr",
                        md: "repeat(3, minmax(0, 1fr))",
                        lg: "repeat(4, minmax(0, 1fr))",
                    },
                    gap: 2,
                    alignItems: "center",
                }}
            >
                <TextField
                    placeholder="Tìm kiếm bài học..."
                    variant="outlined"
                    size="small"
                    value={filters.query || ""}
                    onChange={(e) => setFilter("query", e.target.value)}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon color="action" />
                            </InputAdornment>
                        ),
                    }}
                />
                <FormControl size="small">
                    <InputLabel>Trạng thái</InputLabel>
                    <Select
                        value={filters.status || ""}
                        label="Trạng thái"
                        onChange={(e) => setFilter("status", e.target.value as TestStatus | "")}
                    >
                        <MenuItem value="">Tất cả</MenuItem>
                        {Object.entries(TestStatusLabel).map(([status, label]) => (
                            <MenuItem key={status} value={status}>{label}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <FormControl size="small">
                    <InputLabel>Unit type</InputLabel>
                    <Select
                        value={filters.unit_type || ""}
                        label="Unit type"
                        onChange={(e) => setFilter("unit_type", e.target.value as LessonManagerUnitType | "")}
                    >
                        <MenuItem value="">Tất cả</MenuItem>
                        {unitTypeOptions.map((type) => (
                            <MenuItem key={type} value={type}>{UnitTypeLabel[type]}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <FormControl size="small">
                    <InputLabel>Node role</InputLabel>
                    <Select
                        value={filters.node_role || ""}
                        label="Node role"
                        onChange={(e) => setFilter("node_role", e.target.value as CtvLessonManagerNodeRole | "")}
                    >
                        <MenuItem value="">Tất cả</MenuItem>
                        {nodeRoleOptions.map((role) => (
                            <MenuItem key={role} value={role}>{NodeRoleLabel[role]}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <FormControl size="small">
                    <InputLabel>Target tag</InputLabel>
                    <Select
                        value={filters.target_tag || ""}
                        label="Target tag"
                        onChange={(e) => setFilter("target_tag", e.target.value)}
                    >
                        <MenuItem value="">Tất cả</MenuItem>
                        {targetTagOptions.map((tag) => (
                            <MenuItem key={tag} value={tag}>{tag}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <FormControl size="small">
                    <InputLabel>Part</InputLabel>
                    <Select
                        value={filters.part_type || ""}
                        label="Part"
                        onChange={(e) => setFilter("part_type", e.target.value as LessonManager["part_type"] | "")}
                    >
                        <MenuItem value="">Tất cả</MenuItem>
                        {[1, 2, 3, 4, 5, 6, 7].map((part) => (
                            <MenuItem key={part} value={part}>Part {part}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <TextField
                    size="small"
                    label="Score từ"
                    type="number"
                    value={filters.score_from || ""}
                    onChange={(e) => setFilter("score_from", e.target.value ? Number(e.target.value) : "")}
                />
                <TextField
                    size="small"
                    label="Score đến"
                    type="number"
                    value={filters.score_to || ""}
                    onChange={(e) => setFilter("score_to", e.target.value ? Number(e.target.value) : "")}
                />
            </Box>

            <Box
                sx={{
                    display: "grid",
                    gridTemplateColumns: {
                        xs: "1fr",
                        sm: "1fr",
                        md: "repeat(2, minmax(0, 1fr))",
                        lg: "repeat(3, minmax(0, 1fr))",
                        xl: "repeat(3, minmax(0, 1fr))",
                    },
                    gap: { xs: 2, md: 3 },
                    width: "100%",
                }}
            >
                <>
                    {loading ? (
                        Array.from({ length: 9 }).map((_, i) => (
                            <Box key={i} sx={{ minWidth: 0 }}>
                                <Card className="rounded-2xl shadow-md overflow-hidden w-full h-full">
                                    <Skeleton variant="rectangular" height={176} width="100%" />
                                    <CardContent>
                                        <Skeleton width="90%" height={24} sx={{ mb: 1 }} />
                                        <Skeleton width="75%" height={20} sx={{ mb: 2 }} />
                                        <Box className="flex gap-2 mt-2">
                                            <Skeleton variant="rectangular" width={70} height={28} />
                                            <Skeleton variant="rectangular" width={70} height={28} />
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Box>
                        ))
                    ) : lessons.length > 0 ? (
                        lessons.map((lesson) => (
                            <Box key={lesson._id} sx={{ minWidth: 0 }}>
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.25 }}
                                >
                                    <LessonCard
                                        data={lesson}
                                        onEdit={handleOpenEdit}
                                        onDelete={(item) => {
                                            setSelectedLesson(item);
                                            setDeleteModal(true);
                                        }}
                                    />
                                </motion.div>
                            </Box>
                        ))
                    ) : (
                        <Box sx={{ gridColumn: "1 / -1" }}>
                            <Typography variant="body1" color="text.secondary" align="center" className="py-12">
                                Không tìm thấy bài học nào.
                            </Typography>
                        </Box>
                    )}
                </>
            </Box>

            {!loading && pagination && pagination.totalPages > 1 && (
                <Box className="flex justify-center mt-8">
                    <Pagination
                        count={pagination.totalPages}
                        page={pagination.page}
                        onChange={(_, newPage) => setPage(newPage)}
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
                readonly={!!selectedLesson && !isLessonManagerEditable(selectedLesson.status)}
            />

            <LessonManagerDeleteModal
                open={deleteModal}
                lesson={selectedLesson}
                onClose={() => setDeleteModal(false)}
                onConfirm={handleDelete}
            />

            <Tooltip title="Thêm bài học tổng hợp">
                <Zoom in>
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
