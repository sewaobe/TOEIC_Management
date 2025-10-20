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
} from "@mui/material";
import {
    PlayCircleOutline as MediaIcon,
    WarningAmber as ErrorIcon,
    MenuBook as ExampleIcon,
    Article as TextIcon,
    TableChart as TableIcon,
} from "@mui/icons-material";
import { motion, AnimatePresence } from "framer-motion";
import SchoolIcon from "@mui/icons-material/School";
import ArticleIcon from "@mui/icons-material/Article";
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
import { DictationTrailer, LessonManagerDetail, LessonTrailer, QuizTrailer, ShadowingTrailer, VocabularyTopicTrailer } from "../../types/LessonManagerDetail";
import { getIconComponentByName, mapBgToIconColor } from "../../utils/colorMapFromBg";
import { LessonSection } from "../../types/lesson";



// const mockLessonManagerDetail: LessonManagerDetail = {
//     _id: "lm01",
//     title: "Unit 3 - Office Communication",
//     description: "Rèn luyện kỹ năng giao tiếp trong môi trường công sở.",
//     thumbnail: "https://picsum.photos/seed/office/1000/400",
//     level: "A2",
//     part_type: 2,
//     status: "approved",
//     planned_completion_time: 90,
//     weight: 0.6,
//     student_count: 235,
//     rating: 4.6,
//     created_by: "Nguyễn Văn A",
//     created_at: new Date("2025-10-01T12:00:00Z"),
//     updated_at: new Date("2025-10-10T12:00:00Z"),
//     topic_vocabulary_ids: [
//         {
//             id: "v1",
//             title: "Office Equipment",
//             word_count: 20,
//             words: ["printer", "scanner", "desk", "monitor", "keyboard"],
//         },
//         {
//             id: "v2",
//             title: "Email Communication",
//             word_count: 15,
//             words: ["subject", "attachment", "inbox", "draft", "reply"],
//         },
//     ],
//     lesson_ids: [
//         {
//             id: "l1",
//             title: "Present Simple for Office",
//             duration: 15,
//             sections: [
//                 { id: "s1", name: "Grammar Form", duration: 5 },
//                 { id: "s2", name: "Usage Examples", duration: 10 },
//             ],
//         },
//         {
//             id: "l2",
//             title: "Office Etiquette",
//             duration: 20,
//             sections: [
//                 { id: "s3", name: "Greeting and Meeting", duration: 10 },
//                 { id: "s4", name: "Body Language", duration: 10 },
//             ],
//         },
//     ],
//     dictation_ids: [
//         {
//             id: "d1",
//             title: "Customer Call Example",
//             difficulty: "Medium",
//             scripts: [
//                 { id: "a1", text: "Hello, how can I help you today?" },
//                 { id: "a2", text: "Please hold while I transfer your call." },
//             ],
//         },
//     ],
//     shadowing_ids: [
//         {
//             id: "s1",
//             title: "Office Meeting Practice",
//             videoUrl: "#",
//             sentences: [
//                 { id: "ss1", line: "Let's start the meeting now." },
//                 { id: "ss2", line: "Please share your updates." },
//             ],
//         },
//     ],
//     quiz_ids: [
//         {
//             id: "q1",
//             title: "Office Communication Quiz",
//             questionCount: 10,
//             questions: [
//                 { id: "qq1", question: "What is a polite way to start an email?" },
//                 { id: "qq2", question: "When do we use CC in emails?" },
//             ],
//         },
//     ],
// };

export default function LessonManagerDetailPage(): JSX.Element {
    const location = useLocation();
    const lessonManagerId = location.pathname.split("/")[3];
    const [lessonManager, setLessonsManager] = useState<LessonManagerDetail | null>(null);
    const [tab, setTab] = useState<number>(0);
    const [expanded, setExpanded] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [loadingTab, setLoadingTab] = useState<boolean>(false);
    const [editModal, setEditModal] = useState<boolean>(false);
    const [form, setForm] = useState<Partial<LessonManagerDetail>>(lessonManager || {});
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
            setForm(res);
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
        try {
            setLoading(true);
            const res = await lessonManagerService.updateLessonManager(lessonManagerId, form);
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
                                className={`transform transition-transform ${expanded === item.id ? "rotate-180" : ""
                                    }`}
                            />
                        </Box>

                        <Collapse in={expanded === item._id} timeout="auto" unmountOnExit>
                            <CardContent className="bg-gray-50 border-t">
                                {renderBody(item)}
                                <Box className="flex justify-end mt-3 gap-2">
                                    <Tooltip title="Chỉnh sửa">
                                        <IconButton color="info" size="small">
                                            <EditIcon fontSize="small" />
                                        </IconButton>
                                    </Tooltip>
                                    <Button size="small" variant="outlined">
                                        Xem chi tiết
                                    </Button>
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

    return (
        <Box className="min-h-screen bg-gray-50 p-6 space-y-6">
            {/* Hero Section with Back and Edit */}
            <Box className="relative rounded-2xl overflow-hidden shadow-md">
                <img src={lessonManager.thumbnail} alt={lessonManager.title} className="w-full h-64 object-cover" />
                <Box className="absolute inset-0 bg-black/50 text-white flex flex-col justify-between p-6">
                    <Box className="flex justify-between items-center">
                        <Button startIcon={<ArrowBackIcon />} variant="outlined" color="inherit" size="small" onClick={handleBack}>
                            Quay lại
                        </Button>
                        <Button startIcon={<EditIcon />} variant="contained" color="info" size="small" onClick={handleOpenEditLessonManager}>
                            Chỉnh sửa Lesson Manager
                        </Button>
                    </Box>

                    <Box>
                        <Typography variant="h4" fontWeight={700}>{lessonManager.title}</Typography>
                        <Typography variant="body1">{lessonManager.description}</Typography>
                        <Box className="flex flex-wrap gap-2 mt-2">
                            <Chip label={lessonManager.level} color="info" />
                            <Chip
                                label={`Part ${lessonManager.part_type}`}
                                color="error"
                                sx={{
                                    color: "white",
                                }}
                            />
                            <Chip label={lessonManager.status === 'approved' ? 'Đã duyệt' : lessonManager.status} color="success" />
                        </Box>
                        <Typography variant="body2" className="opacity-80 mt-1">
                            ⭐ {lessonManager.rating} | 👥 {lessonManager.student_count} | ⏱ {lessonManager.planned_completion_time} phút
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
                </Tabs>
                <Button startIcon={<AddIcon />} variant="contained" color="primary" size="small">
                    {tab === 0 && 'Thêm chủ đề từ vựng'}
                    {tab === 1 && 'Thêm bài học chính'}
                    {tab === 2 && 'Thêm dictation'}
                    {tab === 3 && 'Thêm bài shadowing'}
                    {tab === 4 && 'Thêm quiz'}
                </Button>
            </Box>

            {/* Tab Content */}
            <AnimatePresence mode="wait">
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

                        {tab === 2 && renderExpandableList<DictationTrailer>(
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

                        {tab === 3 && renderExpandableList<ShadowingTrailer>(
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
                                        <Typography variant="subtitle1" fontWeight={600}>{q.title}</Typography>
                                        <Typography variant="body2" color="text.secondary">{q.part_type} câu hỏi</Typography>
                                    </Box>
                                </Box>
                            ),
                            (q) => (
                                <>
                                    {/* {q.questions.map((question) => (
                                        <Typography key={question.id} variant="body2" className="py-1 border-b last:border-0">• {question.question}</Typography>
                                    ))} */}
                                </>
                            )
                        )}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* EditModal */}
            <LessonManagerEditModal
                open={editModal}
                onClose={() => setEditModal(false)}
                form={form}
                onChange={setForm}
                onSave={handleSaveEditLessonManager}
                isEdit={true}
            />
        </Box>
    );
}
