import { useState, useEffect, SyntheticEvent } from "react";
import {
    Box,
    Typography,
    Chip,
    Tabs,
    Tab,
    Card,
    CardContent,
    Button,
    Skeleton,
    IconButton,
    Collapse,
    Tooltip,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
} from "@mui/material";
import {
    PlayCircleOutline as MediaIcon,
    WarningAmber as ErrorIcon,
    MenuBook as ExampleIcon,
    Article as TextIcon,
    TableChart as TableIcon,
} from "@mui/icons-material";
import { motion, AnimatePresence } from "framer-motion";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";
import QuizIcon from "@mui/icons-material/Quiz";
import HeadphonesIcon from "@mui/icons-material/Headphones";
import MicIcon from "@mui/icons-material/Mic";
import { useLocation, useNavigate } from "react-router-dom";
import LessonManagerEditModal from "./components/LessonManagerEditModal";
import { toast } from "sonner";
import { lessonManagerService } from "../../services/lesson_manager.service";
import { EmptyState } from "../../components/EmptyState";
import { LessonManagerDetail, LessonTrailer, QuizTrailer, VocabularyTopicTrailer } from "../../types/LessonManagerDetail";
import { availableIcons, getIconComponentByName, mapBgToIconColor } from "../../utils/colorMapFromBg";
import { LessonSection } from "../../types/lesson";
import TopicModal from "../Collaborator/pages/TopicPage/TopicModal";
import { gradientOptions } from "../Collaborator/pages/TopicPage/TopicPage";
import { Topic } from "../../types/Topic";
import { topicService } from "../../services/topic.service";
import GrammarModal from "../Grammar/components/GrammarModal";
import DictationModal from "../Dictation/components/DictationModal";
import { Dictation } from "../../types/Dictation";
import { Shadowing } from "../../types/Shadowing";
import lessonService from "../../services/lesson.service";
import { dictationService } from "../../services/dictation.service";
import ShadowingModal from "../Shadowing/components/ShadowingModal";
import { shadowingService } from "../../services/shadowing.service";
import {
    ActivityOption,
    ActivityType,
    ActivityTypeLabel,
    isLessonManagerEditable,
    LessonManager,
    NodeRoleLabel,
    PartType,
    STATUS_COLOR_MAP,
    TestStatusLabel,
    UnitTypeLabel,
} from "../../types/LessonManager";

const toLessonManagerForm = (lesson: LessonManagerDetail): Partial<LessonManager> => ({
    _id: lesson._id,
    title: lesson.title,
    description: lesson.description,
    thumbnail: lesson.thumbnail,
    part_type: lesson.part_type,
    score_band: lesson.score_band,
    unit_type: lesson.unit_type,
    node_role: lesson.node_role,
    target_tags: lesson.target_tags,
    recommended_activity_order: lesson.recommended_activity_order,
    status: lesson.status,
    planned_completion_time: lesson.planned_completion_time,
    weight: lesson.weight,
});

export default function LessonManagerDetailPage(): JSX.Element {
    const location = useLocation();
    const lessonManagerId = location.pathname.split("/")[3];
    const [lessonManager, setLessonsManager] = useState<LessonManagerDetail | null>(null);
    const [tab, setTab] = useState<number>(0);
    const [expanded, setExpanded] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [loadingTab, setLoadingTab] = useState<boolean>(false);
    const [editModal, setEditModal] = useState<boolean>(false);
    const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
    const [isModeModal, setIsModeModal] = useState<"add" | "edit">("add");
    const [formData, setFormData] = useState<any>({});
    const [form, setForm] = useState<Partial<LessonManager>>({});
    const [activityType, setActivityType] = useState<ActivityType>("lesson");
    const [activityQuery, setActivityQuery] = useState("");
    const [activityPartType, setActivityPartType] = useState<PartType | "">("");
    const [activityOptions, setActivityOptions] = useState<ActivityOption[]>([]);
    const [activityLoading, setActivityLoading] = useState(false);
    const navigate = useNavigate();
    useEffect(() => {
        const timer = setTimeout(() => setLoadingTab(false), 800);
        return () => clearTimeout(timer);
    }, [tab]);

    const fetchLessonManager = async () => {
        try {
            setLoading(true);
            const res = await lessonManagerService.getLessonManagerDetail(lessonManagerId);
            setLessonsManager(res);
            setForm(toLessonManagerForm(res));
        }
        catch (err) {
            toast.error("Lấy thông tin Lesson Manager thất bại. Vui lòng thử lại.");
        }
        finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchLessonManager();
    }, [lessonManagerId]);

    const handleTabChange = (event: SyntheticEvent, newValue: number): void => {
        setTab(newValue);
        setIsOpenModal(false);
        setIsModeModal("add");
        setExpanded(null);
        setLoadingTab(true);
    };

    const toggleExpand = (_id: string): void => {
        setExpanded(expanded === _id ? null : _id);
    };

    const handleBack = () => {
        navigate(-1);
    }

    const handleOpenEditLessonManager = () => {
        setEditModal(true);
    }

    const handleSaveEditLessonManager = async () => {
        if (lessonManager && !isLessonManagerEditable(lessonManager.status)) {
            toast.error("Lesson Manager ở trạng thái này chỉ được xem.");
            return;
        }
        try {
            setLoading(true);
            await lessonManagerService.updateLessonManager(lessonManagerId, form);
            fetchLessonManager();
            toast.success("Lưu Lesson Manager thành công.");
        }
        catch (err) {
            toast.error("Lưu Lesson Manager thất bại. Vui lòng thử lại.");
        }
        finally {
            setLoading(false);
            setEditModal(false);
        }
    }
    const saveRecommendedActivityOrder = async (nextOrder: LessonManagerDetail["recommended_activity_order"]) => {
        if (!lessonManager || !isLessonManagerEditable(lessonManager.status)) {
            toast.error("Lesson Manager ở trạng thái này chỉ được xem.");
            return;
        }

        const payload = {
            title: lessonManager.title,
            description: lessonManager.description,
            thumbnail: lessonManager.thumbnail,
            part_type: lessonManager.part_type,
            score_band: lessonManager.score_band,
            unit_type: lessonManager.unit_type,
            node_role: lessonManager.node_role,
            target_tags: lessonManager.target_tags,
            recommended_activity_order: nextOrder.map((activity, index) => ({
                ...activity,
                order: index,
            })),
        };

        try {
            await lessonManagerService.updateLessonManager(lessonManagerId, payload);
            toast.success("Cập nhật thứ tự hoạt động thành công.");
            fetchLessonManager();
        } catch (err) {
            toast.error("Cập nhật thứ tự hoạt động thất bại.");
        }
    };

    const fetchActivityOptions = async () => {
        try {
            setActivityLoading(true);
            const res = await lessonManagerService.getActivityOptions({
                activity_type: activityType,
                part_type: activityPartType,
                query: activityQuery,
                page: 1,
                limit: 20,
            });
            setActivityOptions(res.data);
        } catch (err) {
            toast.error("Không thể tải danh sách hoạt động.");
        } finally {
            setActivityLoading(false);
        }
    };

    const resolveActivityTitle = (type: ActivityType, activityId: string) => {
        const id = String(activityId);
        const source =
            type === "lesson"
                ? lessonManager?.lesson_ids
                : type === "vocabulary"
                    ? lessonManager?.topic_vocabulary_ids
                    : type === "dictation"
                        ? lessonManager?.dictation_ids
                        : type === "shadowing"
                            ? lessonManager?.shadowing_ids
                            : lessonManager?.quiz_ids;
        return source?.find((item: any) => String(item._id) === id)?.title || id;
    };

    const addRecommendedActivity = (option: ActivityOption) => {
        if (!lessonManager) return;
        const exists = (lessonManager.recommended_activity_order || []).some(
            (activity) =>
                activity.activity_type === option.activity_type &&
                String(activity.activity_id) === option._id
        );
        if (exists) {
            toast.error("Hoạt động này đã có trong thứ tự học.");
            return;
        }

        saveRecommendedActivityOrder([
            ...(lessonManager.recommended_activity_order || []),
            {
                activity_type: option.activity_type,
                activity_id: option._id,
                estimated_minutes: option.estimated_minutes || 1,
                is_required: true,
                order: lessonManager.recommended_activity_order?.length || 0,
            },
        ]);
    };

    const updateRecommendedActivity = (
        index: number,
        patch: Partial<LessonManagerDetail["recommended_activity_order"][number]>
    ) => {
        if (!lessonManager) return;
        const nextOrder = [...(lessonManager.recommended_activity_order || [])];
        nextOrder[index] = { ...nextOrder[index], ...patch };
        saveRecommendedActivityOrder(nextOrder);
    };

    const moveRecommendedActivity = (index: number, direction: -1 | 1) => {
        if (!lessonManager) return;
        const nextIndex = index + direction;
        const nextOrder = [...(lessonManager.recommended_activity_order || [])];
        if (nextIndex < 0 || nextIndex >= nextOrder.length) return;
        [nextOrder[index], nextOrder[nextIndex]] = [nextOrder[nextIndex], nextOrder[index]];
        saveRecommendedActivityOrder(nextOrder);
    };

    const removeRecommendedActivity = (index: number) => {
        if (!lessonManager) return;
        const nextOrder = [...(lessonManager.recommended_activity_order || [])];
        nextOrder.splice(index, 1);
        saveRecommendedActivityOrder(nextOrder);
    };

    const fade = {
        initial: { opacity: 0, y: 10 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -10 },
        transition: { duration: 0.35 },
    };


    const renderSkeletonList = (): JSX.Element => (
        <Box className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
                <Card key={i} className="p-4 rounded-2xl shadow-sm">
                    <Skeleton variant="text" width="60%" />
                    <Skeleton variant="rectangular" height={80} sx={{ mt: 1 }} />
                </Card>
            ))}
        </Box>
    );

    const handleClickCreateModal = () => {
        setIsOpenModal(true);
        setIsModeModal("add");
        if (tab === 0) {
            setFormData({
                id: "0",
                title: "",
                description: "",
                topic: [`${lessonManagerId}`],
                level: "A1",
                wordCount: 0,
                learnerCount: 0,
                iconName: "Book",
                gradient: gradientOptions[0].value,
                bgColor: "bg-blue-50",
                new: false,
                createdAt: Date.now().toString(),
                updatedAt: "",
            });
        } else {
            setFormData({
                topic: [`${lessonManagerId}`],
            })
        }

    }

    const handleClickEditModal = (data: any) => {
        setIsOpenModal(true);
        setIsModeModal("edit");
        setFormData(data);
    }

    const handleViewDetail = (data: any) => {
        if (tab === 0) {
            navigate(`/ctv/topics/${data._id}`);
        } else if (tab === 1) {
            navigate(`/ctv/grammar/${data._id}`, { state: { grammar: data } });
        } else if (tab === 4) {
            navigate(`/ctv/quiz/${data._id}/detail`);
        }
    }

    const submitApproveLessonManager = async () => {
        try {
            await toast.promise(lessonManagerService.updateStatusLessonManager(lessonManagerId, "pending"), {
                loading: "Đang gửi duyệt bài học...",
                success: () => {
                    fetchLessonManager();
                    return "Gửi duyệt bài học thành công";
                },
                error: "Gửi duyệt bài học thất bại",
            });
        } catch (err) {
            toast.error("Gửi duyệt bài học thất bại");
        }
    }

    if (loading) {
        return (
            <Box className="min-h-screen p-6">
                {renderSkeletonList()}
            </Box>
        );
    }

    if (!lessonManager) {
        return (
            <Box className="min-h-screen flex items-center justify-center">
                <Typography variant="h6" color="text.secondary">
                    Không tìm thấy Lesson Manager.
                </Typography>
            </Box>
        );
    }

    const editable = isLessonManagerEditable(lessonManager.status);

    const renderExpandableList = <T,>(
        items: T[],
        renderHeader: (item: T) => JSX.Element,
        renderBody: (item: T) => JSX.Element
    ): JSX.Element => (
        <Box className="space-y-3">
            {items && items.length > 0 ? (
                items.map((item: any) => (
                    <Card
                        key={item._id}
                        className="rounded-2xl shadow-sm hover:shadow-md transition-all overflow-hidden"
                    >
                        <Box
                            className="flex justify-between items-center p-4 cursor-pointer bg-white"
                            onClick={() => toggleExpand(item._id)}
                        >
                            {renderHeader(item)}
                            <ExpandMoreIcon
                                className={`transform transition-transform ${expanded === item.id ? "rotate-180" : ""}`}
                            />
                        </Box>

                        <Collapse in={expanded === item._id} timeout="auto" unmountOnExit>
                            <CardContent className="bg-gray-50 border-t">
                                {renderBody(item)}
                                <Box className="flex justify-end mt-3 gap-2">
                                    <Tooltip title="Chỉnh sửa">
                                        <IconButton color="info" size="small" disabled={!editable} onClick={() => handleClickEditModal(item)}>
                                            <EditIcon fontSize="small" />
                                        </IconButton>
                                    </Tooltip>
                                    {tab !== 2 && tab !== 3 && (
                                        <Button size="small" variant="outlined" onClick={() => handleViewDetail(item)}>
                                            Xem chi tiết
                                        </Button>
                                    )}
                                </Box>
                            </CardContent>
                        </Collapse>
                    </Card>
                ))
            ) : (
                <EmptyState
                    mode="empty"
                    title="Không có dữ liệu"
                    description="Hiện không có lesson nào."
                />
            )}
        </Box>
    );

    const renderRecommendedActivityOrder = () => (
        <Box className="space-y-4">
            {editable && (
                <Card className="p-4 rounded-2xl shadow-sm">
                    <Box className="grid grid-cols-1 md:grid-cols-5 gap-3">
                        <FormControl size="small">
                            <InputLabel>Loại hoạt động</InputLabel>
                            <Select
                                value={activityType}
                                label="Loại hoạt động"
                                onChange={(e) => setActivityType(e.target.value as ActivityType)}
                            >
                                {Object.entries(ActivityTypeLabel).map(([type, label]) => (
                                    <MenuItem key={type} value={type}>{label}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <FormControl size="small">
                            <InputLabel>Part</InputLabel>
                            <Select
                                value={activityPartType}
                                label="Part"
                                onChange={(e) => setActivityPartType(e.target.value as PartType | "")}
                            >
                                <MenuItem value="">Tất cả</MenuItem>
                                {[1, 2, 3, 4, 5, 6, 7].map((part) => (
                                    <MenuItem key={part} value={part}>Part {part}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <TextField
                            size="small"
                            label="Tìm hoạt động"
                            value={activityQuery}
                            onChange={(e) => setActivityQuery(e.target.value)}
                            className="md:col-span-2"
                        />
                        <Button variant="contained" onClick={fetchActivityOptions} disabled={activityLoading}>
                            {activityLoading ? "Đang tải..." : "Tìm"}
                        </Button>
                    </Box>

                    {activityOptions.length > 0 && (
                        <Box className="mt-3 space-y-2">
                            {activityOptions.map((option) => (
                                <Box key={`${option.activity_type}-${option._id}`} className="flex items-center justify-between border rounded-lg p-2">
                                    <Box>
                                        <Typography variant="body2" fontWeight={600}>{option.title}</Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            {ActivityTypeLabel[option.activity_type]} • Part {option.part_type || "-"} • {option.estimated_minutes} phút
                                        </Typography>
                                    </Box>
                                    <Button size="small" variant="outlined" onClick={() => addRecommendedActivity(option)}>
                                        Thêm
                                    </Button>
                                </Box>
                            ))}
                        </Box>
                    )}
                </Card>
            )}

            {(lessonManager.recommended_activity_order || []).length > 0 ? (
                lessonManager.recommended_activity_order
                    .slice()
                    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
                    .map((activity, index) => (
                        <Card key={`${activity.activity_type}-${activity.activity_id}-${index}`} className="rounded-2xl shadow-sm">
                            <CardContent className="flex flex-col md:flex-row md:items-center gap-3 justify-between">
                                <Box>
                                    <Typography variant="subtitle1" fontWeight={700}>
                                        {index + 1}. {resolveActivityTitle(activity.activity_type, activity.activity_id)}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {ActivityTypeLabel[activity.activity_type]} • {activity.is_required === false ? "Không bắt buộc" : "Bắt buộc"}
                                    </Typography>
                                </Box>
                                <Box className="flex items-center gap-2">
                                    <TextField
                                        size="small"
                                        type="number"
                                        label="Phút"
                                        value={activity.estimated_minutes}
                                        disabled={!editable}
                                        sx={{ width: 100 }}
                                        onChange={(e) =>
                                            updateRecommendedActivity(index, {
                                                estimated_minutes: Math.max(1, Number(e.target.value)),
                                            })
                                        }
                                    />
                                    <Button size="small" disabled={!editable || index === 0} onClick={() => moveRecommendedActivity(index, -1)}>
                                        Lên
                                    </Button>
                                    <Button
                                        size="small"
                                        disabled={!editable || index === lessonManager.recommended_activity_order.length - 1}
                                        onClick={() => moveRecommendedActivity(index, 1)}
                                    >
                                        Xuống
                                    </Button>
                                    <Button size="small" color="error" disabled={!editable} onClick={() => removeRecommendedActivity(index)}>
                                        Xóa
                                    </Button>
                                </Box>
                            </CardContent>
                        </Card>
                    ))
            ) : (
                <EmptyState
                    mode="empty"
                    title="Chưa có activity order"
                    description="Thêm hoạt động vào thứ tự học trước khi gửi duyệt."
                />
            )}
        </Box>
    );

    return (
        <Box className="min-h-screen bg-gray-50 p-6 space-y-6">
            {/* Hero Section with Back and Edit */}
            <Box className="relative rounded-2xl overflow-hidden shadow-md">
                <img src="https://res.cloudinary.com/dgi1g967z/image/upload/v1780219832/jh1nyaim79isvrgo4yf0.webp" alt={lessonManager.title} className="w-full h-64 object-cover" />
                <Box className="absolute inset-0 bg-black/50 text-white flex flex-col justify-between p-6">
                    <Box className="flex justify-between items-center">
                        <Button
                            startIcon={<ArrowBackIcon />}
                            variant="outlined"
                            color="inherit"
                            size="small"
                            onClick={handleBack}
                        >
                            Quay lại
                        </Button>

                        <Box className="flex items-center gap-2">
                            {/* Nút gửi duyệt bài học */}
                            {editable && (
                                <Button
                                    variant="contained"
                                    color="primary"
                                    size="small"
                                    onClick={submitApproveLessonManager}
                                >
                                    Gửi duyệt bài học
                                </Button>
                            )}

                            {/* Khi đang chờ duyệt */}
                            {lessonManager.status === "pending" && (
                                <Button
                                    variant="outlined"
                                    color="warning"
                                    size="small"
                                    disabled
                                >
                                    Đang chờ duyệt
                                </Button>
                            )}

                            {/* Khi đã duyệt */}
                            {lessonManager.status === "approved" && (
                                <Button
                                    variant="outlined"
                                    color="success"
                                    size="small"
                                    disabled
                                >
                                    Đã duyệt
                                </Button>
                            )}

                            {/* Nút chỉnh sửa */}
                            <Button
                                startIcon={<EditIcon />}
                                variant="contained"
                                color="info"
                                size="small"
                                disabled={!editable}
                                onClick={handleOpenEditLessonManager}
                            >
                                Chỉnh sửa Lesson Manager
                            </Button>
                        </Box>
                    </Box>

                    <Box>
                        <Typography variant="h4" fontWeight={700}>{lessonManager.title}</Typography>
                        <Typography variant="body1">{lessonManager.description}</Typography>
                        <Box className="flex flex-wrap gap-2 !mt-2">
                            <Chip
                                label={`Part ${lessonManager.part_type}`}
                                color="info"
                                sx={{
                                    color: "white",
                                }}
                            />
                            <Chip label={TestStatusLabel[lessonManager.status]} color={STATUS_COLOR_MAP[lessonManager.status] ?? "default"} />
                            <Chip label={`${lessonManager.score_band?.from ?? "-"}-${lessonManager.score_band?.to ?? "-"}`} color="default" />
                            <Chip label={UnitTypeLabel[lessonManager.unit_type]} color="default" />
                            <Chip label={NodeRoleLabel[lessonManager.node_role]} color="default" />
                            {(lessonManager.target_tags || []).slice(0, 4).map((tag) => (
                                <Chip key={tag} label={tag} color="default" />
                            ))}
                        </Box>
                        <Typography variant="body2" className="opacity-80 !mt-1">
                            ⭐ {lessonManager.rating || 0} | 👥 {lessonManager.student_count || 0} | ⏱ {lessonManager.planned_completion_time} phút
                        </Typography>
                    </Box>
                </Box>
            </Box>

            {/* Tabs + Add Button */}
            <Box className="flex justify-between items-center">
                <Tabs value={tab} onChange={handleTabChange} textColor="primary" indicatorColor="primary">
                    <Tab label="Từ vựng" />
                    <Tab label="Bài học chính" />
                    <Tab label="Dictation" />
                    <Tab label="Shadowing" />
                    <Tab label="Quiz" />
                    <Tab label="Activity order" />
                </Tabs>
                {tab < 5 && <Button startIcon={<AddIcon />} variant="contained" color="primary" size="small" disabled={!editable} onClick={handleClickCreateModal}>
                    {tab === 0 && 'Thêm'}
                    {tab === 1 && 'Thêm'}
                    {tab === 2 && 'Thêm'}
                    {tab === 3 && 'Thêm'}
                    {tab === 4 && 'Thêm'}
                </Button>}
            </Box>

            {/* Tab Content */}
            <AnimatePresence mode="sync">
                {loadingTab ? (
                    renderSkeletonList()
                ) : (
                    <motion.div key={tab} {...fade}>
                        {tab === 0 && renderExpandableList<VocabularyTopicTrailer>(
                            lessonManager.topic_vocabulary_ids,
                            (v) => (
                                <Box className="flex justify-between items-center w-full">
                                    <Box className="flex items-center gap-3">
                                        {(() => {
                                            const { IconComponent, bgColor } = getIconComponentByName(v.iconName);
                                            return (
                                                <Box
                                                    className={`w-10 h-10 flex items-center justify-center rounded-xl ${bgColor} ${mapBgToIconColor(bgColor)}`}
                                                >
                                                    <IconComponent fontSize="medium" />
                                                </Box>
                                            );
                                        })()}
                                        <Box>
                                            <Typography variant="subtitle1" fontWeight={600}>
                                                {v.title}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                {v.vocabularies_id.length} từ | Trình độ: {v.level}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Box>
                            ),
                            (v) => (
                                <Box className="space-y-3">
                                    {/* Giả định sau này có danh sách words */}
                                    {v.vocabularies_id && v.vocabularies_id.length > 0 ? (
                                        <Box className="bg-white rounded-xl p-3 border">
                                            <Typography variant="subtitle2" fontWeight={600} className="mb-2">
                                                Danh sách từ vựng:
                                            </Typography>
                                            <Box className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-1">
                                                {v.vocabularies_id.map((w, i) => (
                                                    <Typography
                                                        key={i}
                                                        variant="body2"
                                                        color="text.secondary"
                                                        className="py-0.5"
                                                    >
                                                        • {w.word} : {w.definition}
                                                    </Typography>
                                                ))}
                                            </Box>
                                        </Box>
                                    ) : (
                                        <Typography variant="body2" color="text.secondary">
                                            Không có từ vựng nào trong chủ đề này.
                                        </Typography>
                                    )}
                                </Box>
                            )
                        )}

                        {tab === 1 && renderExpandableList<LessonTrailer>(
                            lessonManager.lesson_ids,
                            (lesson) => (
                                <Box className="flex justify-between items-center w-full">
                                    <Box className="flex items-center gap-3">
                                        <PlayCircleOutlineIcon color="success" />
                                        <Box>
                                            <Typography variant="subtitle1" fontWeight={600}>
                                                {lesson.title}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                {lesson.sections_id.length} phần | Part {lesson.part_type} | ⏱ {lesson.planned_completion_time} phút
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Box>
                            ),
                            (lesson) => (
                                <Box className="space-y-3">
                                    {lesson.sections_id && lesson.sections_id.length > 0 ? (
                                        lesson.sections_id.map((section: LessonSection, idx: number) => {
                                            let icon: JSX.Element;
                                            let color: "default" | "primary" | "secondary" | "success" | "error" | "info" = "default";
                                            let label = "";
                                            let preview = "";

                                            switch (section.type) {
                                                case "media":
                                                    icon = <MediaIcon color="info" fontSize="small" />;
                                                    color = "info";
                                                    label = "Media";
                                                    preview = section.mediaUrl
                                                        ? "🎬 Có nội dung nghe/xem"
                                                        : "Chưa có media";
                                                    break;

                                                case "example":
                                                    icon = <ExampleIcon color="success" fontSize="small" />;
                                                    color = "success";
                                                    label = "Ví dụ";
                                                    preview = section.example?.en
                                                        ? `"${section.example.en}" — ${section.example.vi || ""}`
                                                        : "Chưa có ví dụ minh họa";
                                                    break;

                                                case "error":
                                                    icon = <ErrorIcon color="error" fontSize="small" />;
                                                    color = "error";
                                                    label = "Lỗi sai";
                                                    preview = section.error?.wrong
                                                        ? `❌ ${section.error.wrong} → ✅ ${section.error.correct}`
                                                        : "Chưa có cặp lỗi/sửa";
                                                    break;

                                                case "text":
                                                    icon = <TextIcon color="disabled" fontSize="small" />;
                                                    color = "default";
                                                    label = "Văn bản";
                                                    preview = section.content
                                                        ? section.content.slice(0, 100) + (section.content.length > 100 ? "..." : "")
                                                        : "Chưa có nội dung";
                                                    break;

                                                case "table":
                                                    icon = <TableIcon color="secondary" fontSize="small" />;
                                                    color = "secondary";
                                                    label = "Bảng";
                                                    preview = section.tableData?.length
                                                        ? `📊 ${section.tableData.length} hàng × ${section.tableData[0]?.length || 0} cột`
                                                        : "Bảng trống";
                                                    break;

                                                default:
                                                    icon = <TextIcon color="disabled" fontSize="small" />;
                                                    color = "default";
                                                    label = "Khác";
                                                    preview = "";
                                            }

                                            return (
                                                <Box
                                                    key={section._id || idx}
                                                    className="flex items-start justify-between p-3 border rounded-xl bg-white shadow-sm hover:shadow transition-all"
                                                >
                                                    {/* Nội dung bên trái */}
                                                    <Box className="flex items-start gap-3">
                                                        <Box className="flex items-center justify-center w-8 h-8 bg-gray-100 rounded-lg">
                                                            {icon}
                                                        </Box>

                                                        <Box>
                                                            <Typography variant="body2" fontWeight={600}>
                                                                {idx + 1}. {section.title || "Chưa có tiêu đề"}
                                                            </Typography>

                                                            <Typography
                                                                variant="body2"
                                                                color="text.secondary"
                                                                className="mt-0.5 leading-snug"
                                                            >
                                                                {preview}
                                                            </Typography>
                                                        </Box>
                                                    </Box>

                                                    {/* Nhãn type */}
                                                    <Chip
                                                        label={label}
                                                        color={color}
                                                        size="small"
                                                        variant="outlined"
                                                    />
                                                </Box>
                                            );
                                        })
                                    ) : (
                                        <Typography variant="body2" color="text.secondary">
                                            Không có section nào trong bài học này.
                                        </Typography>
                                    )}
                                </Box>
                            )
                        )}

                        {tab === 2 && renderExpandableList<Dictation>(
                            lessonManager.dictation_ids,
                            (d) => (
                                <Box className="flex justify-between items-center w-full">
                                    <Box className="flex items-center gap-3">
                                        <HeadphonesIcon color="primary" />
                                        <Box>
                                            <Typography variant="subtitle1" fontWeight={600}>
                                                {d.title}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                Độ khó: {d.level} | ⏱ {d.duration || 0} giây | Part {d.part_type}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Box>
                            ),
                            (d) => (
                                <Box className="space-y-3">
                                    {/* Audio player */}
                                    {d.audio_url ? (
                                        <audio controls className="w-full mt-1">
                                            <source src={d.audio_url} type="audio/mpeg" />
                                            Trình duyệt của bạn không hỗ trợ phát âm thanh.
                                        </audio>
                                    ) : (
                                        <Typography variant="body2" color="text.secondary">
                                            Không có audio
                                        </Typography>
                                    )}

                                    {/* Transcript */}
                                    <Box className="bg-white rounded-xl p-3 border">
                                        <Typography variant="subtitle2" fontWeight={600} className="mb-2">
                                            Transcript:
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary" className="whitespace-pre-line leading-relaxed">
                                            {d.transcript}
                                        </Typography>
                                    </Box>
                                </Box>
                            )
                        )}

                        {tab === 3 && renderExpandableList<Shadowing>(
                            lessonManager.shadowing_ids,
                            (s) => (
                                <Box className="flex items-center gap-3">
                                    <MicIcon color="secondary" />
                                    <Box>
                                        <Typography variant="subtitle1" fontWeight={600}>
                                            {s.title}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Độ khó: {s.level} | ⏱ {s.duration || 0} giây | Part {s.part_type}
                                        </Typography>
                                    </Box>
                                </Box>
                            ),
                            (s) => (
                                <Box className="space-y-3">
                                    {/* Audio player */}
                                    {s.audio_url ? (
                                        <audio controls className="w-full mt-1">
                                            <source src={s.audio_url} type="audio/mpeg" />
                                            Trình duyệt của bạn không hỗ trợ phát âm thanh.
                                        </audio>
                                    ) : (
                                        <Typography variant="body2" color="text.secondary">
                                            Không có audio
                                        </Typography>
                                    )}

                                    {/* Transcript */}
                                    <Box className="bg-white rounded-xl p-3 border">
                                        <Typography variant="subtitle2" fontWeight={600} className="mb-2">
                                            Transcript:
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary" className="whitespace-pre-line leading-relaxed">
                                            {s.transcript}
                                        </Typography>
                                    </Box>
                                </Box>
                            )
                        )}

                        {tab === 4 && renderExpandableList<QuizTrailer>(
                            lessonManager.quiz_ids,
                            (q) => (
                                <Box className="flex items-center gap-3">
                                    <QuizIcon color="secondary" />
                                    <Box>
                                        <Typography variant="subtitle1" fontWeight={600}>
                                            {q.title}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            🧩 Part {q.part_type} • {q.level} • ⏱ {q.planned_completion_time} phút
                                        </Typography>
                                    </Box>
                                </Box>
                            ),
                            (q) => (
                                <Box className="space-y-4">
                                    <Box className="space-y-4">
                                        {q.question_ids && q.question_ids.length > 0 ? (
                                            q.question_ids.map((question, qi) => (
                                                <Box
                                                    key={question._id || qi}
                                                    className="p-3 border border-gray-200 rounded-xl bg-gray-50"
                                                >
                                                    {/* Tiêu đề câu hỏi */}
                                                    <Typography
                                                        variant="body2"
                                                        fontWeight={600}
                                                        className="mb-1"
                                                    >
                                                        {qi + 1}. {question.textQuestion}
                                                    </Typography>

                                                    {/* Danh sách lựa chọn */}
                                                    <Box className="pl-4 space-y-0.5">
                                                        {question.choices && (
                                                            Object.entries(question.choices).map(([key, value]) => {
                                                                const isCorrect = question.correctAnswer === key;
                                                                return (
                                                                    <Typography
                                                                        key={key}
                                                                        variant="body2"
                                                                        className={`flex items-center gap-1 ${isCorrect ? "text-green-600 font-medium" : "text-gray-700"
                                                                            }`}
                                                                    >
                                                                        {isCorrect ? "✅" : "•"} {key}. {value}
                                                                    </Typography>
                                                                );
                                                            })
                                                        )}
                                                    </Box>
                                                </Box>
                                            ))
                                        ) : (
                                            <Typography variant="body2" color="text.secondary">
                                                Bài quiz này chưa có câu hỏi nào.
                                            </Typography>
                                        )}
                                    </Box>
                                </Box>
                            )
                        )}
                        {tab === 5 && renderRecommendedActivityOrder()}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* EditModal */}
            <LessonManagerEditModal
                open={editModal}
                onClose={() => {
                    setEditModal(false)
                    setFormData({});
                }}
                form={form}
                onChange={setForm}
                onSave={handleSaveEditLessonManager}
                isEdit={true}
                readonly={!editable}
            />

            {/* TopicVocabulary modal */}
            <TopicModal
                open={tab === 0 && isOpenModal}
                onClose={() => {
                    setIsOpenModal(false)
                    setFormData({});
                }}
                onSave={async () => {
                    try {
                        if (isModeModal === "add") {
                            const newTopicVocabulary: Partial<Topic> = {
                                ...formData,
                                learnerCount: 0,
                                id: undefined,
                                createdAt: new Date().toISOString(),
                                updatedAt: new Date().toISOString(),
                            }
                            await topicService.createTopic(newTopicVocabulary);
                            toast.success("Thêm chủ đề từ vựng thành công.");
                        } else {
                            await topicService.updateTopic(formData._id, formData);
                            toast.success("Cập nhật chủ đề từ vựng thành công.");
                        }

                        fetchLessonManager();
                    }
                    catch (err) {
                        toast.error("Thêm chủ đề từ vựng thất bại. Vui lòng thử lại.");
                    }
                    finally {
                        setIsOpenModal(false);
                    }
                }}
                formData={formData}
                setFormData={setFormData}
                availableIcons={availableIcons}
                gradientOptions={gradientOptions}
                title={isModeModal === "add" ? "Thêm chủ đề từ vựng" : "Chỉnh sửa chủ đề từ vựng"}
            />

            {/* Lesson modal */}
            <GrammarModal
                open={tab === 1 && isOpenModal}
                onClose={() => {
                    setIsOpenModal(false)
                    setFormData({});
                }}
                onSave={async (data) => {
                    try {
                        if (isModeModal === "add") {
                            await lessonService.create(data);
                        }
                        else {
                            if (data._id) {
                                await lessonService.updateBasic(data._id, data);
                            }
                        }
                        toast.success("Lưu bài học thành công.");
                        fetchLessonManager();
                    }
                    catch (err) {
                        toast.error("Lưu bài học thất bại. Vui lòng thử lại.");
                    }
                    finally {
                        setIsOpenModal(false);
                    }
                }}
                initialData={isModeModal === "edit" ? formData : null}
            />

            {/* Dictation modal */}
            <DictationModal
                open={tab === 2 && isOpenModal}
                value={formData}
                onClose={() => {
                    setIsOpenModal(false)
                    setFormData({});
                }}
                onSave={async (data) => {
                    try {
                        if (isModeModal === "add") {
                            await dictationService.create(data);
                        } else {
                            if (data._id) {
                                await dictationService.update(data, data._id);
                            }
                            toast.success("Lưu dictation thành công.");
                            fetchLessonManager();
                        }
                    }
                    catch (err) {
                        toast.error("Lưu dictation thất bại. Vui lòng thử lại.");
                    }
                    finally {
                        setIsOpenModal(false);
                    }
                }}
            />

            {/* Shadowing modal */}
            <ShadowingModal
                open={tab === 3 && isOpenModal}
                value={formData}
                onClose={() => {
                    setIsOpenModal(false)
                    setFormData({});
                }}
                onSave={async (data) => {
                    try {
                        if (isModeModal === "add") {
                            await shadowingService.create(data);
                        } else {
                            if (data._id) {
                                await shadowingService.update(data, data._id);
                            }
                            toast.success("Lưu shadowing thành công.");
                            fetchLessonManager();
                        }
                    }
                    catch (err) {
                        toast.error("Lưu shadowing thất bại. Vui lòng thử lại.");
                    }
                    finally {
                        setIsOpenModal(false);
                    }
                }}
            />

            {/* Quiz modal */}

        </Box>
    );
}
