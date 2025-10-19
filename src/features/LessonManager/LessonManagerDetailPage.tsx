import React, { useState, useEffect, SyntheticEvent } from "react";
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
import { motion, AnimatePresence } from "framer-motion";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";
import SchoolIcon from "@mui/icons-material/School";
import QuizIcon from "@mui/icons-material/Quiz";
import HeadphonesIcon from "@mui/icons-material/Headphones";
import MicIcon from "@mui/icons-material/Mic";
import { useNavigate } from "react-router-dom";
import LessonManagerEditModal from "./components/LessonManagerEditModal";
import { LessonManager } from "../../types/LessonManager";

// Type definitions
interface Section {
    id: string;
    name: string;
    duration: number;
}

interface Lesson {
    id: string;
    title: string;
    duration: number;
    sections: Section[];
}

interface VocabularyTopic {
    id: string;
    title: string;
    word_count: number;
    words: string[];
}

interface DictationScript {
    id: string;
    text: string;
}

interface Dictation {
    id: string;
    title: string;
    difficulty: string;
    scripts: DictationScript[];
}

interface ShadowingSentence {
    id: string;
    line: string;
}

interface Shadowing {
    id: string;
    title: string;
    videoUrl: string;
    sentences: ShadowingSentence[];
}

interface QuizQuestion {
    id: string;
    question: string;
}

interface Quiz {
    id: string;
    title: string;
    questionCount: number;
    questions: QuizQuestion[];
}

interface LessonManagerDetail extends LessonManager {
    topic_vocabulary_ids: VocabularyTopic[];
    lesson_ids: Lesson[];
    dictation_ids: Dictation[];
    shadowing_ids: Shadowing[];
    quiz_ids: Quiz[];
}

const mockLessonManagerDetail: LessonManagerDetail = {
    _id: "lm01",
    title: "Unit 3 - Office Communication",
    description: "Rèn luyện kỹ năng giao tiếp trong môi trường công sở.",
    thumbnail: "https://picsum.photos/seed/office/1000/400",
    level: "A2",
    part_type: 2,
    status: "approved",
    planned_completion_time: 90,
    weight: 0.6,
    student_count: 235,
    rating: 4.6,
    created_by: "Nguyễn Văn A",
    created_at: new Date("2025-10-01T12:00:00Z"),
    updated_at: new Date("2025-10-10T12:00:00Z"),
    topic_vocabulary_ids: [
        {
            id: "v1",
            title: "Office Equipment",
            word_count: 20,
            words: ["printer", "scanner", "desk", "monitor", "keyboard"],
        },
        {
            id: "v2",
            title: "Email Communication",
            word_count: 15,
            words: ["subject", "attachment", "inbox", "draft", "reply"],
        },
    ],
    lesson_ids: [
        {
            id: "l1",
            title: "Present Simple for Office",
            duration: 15,
            sections: [
                { id: "s1", name: "Grammar Form", duration: 5 },
                { id: "s2", name: "Usage Examples", duration: 10 },
            ],
        },
        {
            id: "l2",
            title: "Office Etiquette",
            duration: 20,
            sections: [
                { id: "s3", name: "Greeting and Meeting", duration: 10 },
                { id: "s4", name: "Body Language", duration: 10 },
            ],
        },
    ],
    dictation_ids: [
        {
            id: "d1",
            title: "Customer Call Example",
            difficulty: "Medium",
            scripts: [
                { id: "a1", text: "Hello, how can I help you today?" },
                { id: "a2", text: "Please hold while I transfer your call." },
            ],
        },
    ],
    shadowing_ids: [
        {
            id: "s1",
            title: "Office Meeting Practice",
            videoUrl: "#",
            sentences: [
                { id: "ss1", line: "Let's start the meeting now." },
                { id: "ss2", line: "Please share your updates." },
            ],
        },
    ],
    quiz_ids: [
        {
            id: "q1",
            title: "Office Communication Quiz",
            questionCount: 10,
            questions: [
                { id: "qq1", question: "What is a polite way to start an email?" },
                { id: "qq2", question: "When do we use CC in emails?" },
            ],
        },
    ],
};

export default function LessonManagerDetailPage(): JSX.Element {
    const [tab, setTab] = useState<number>(0);
    const [expanded, setExpanded] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [editModal, setEditModal] = useState<boolean>(false);
    const [form, setForm] = useState<Partial<LessonManagerDetail>>(mockLessonManagerDetail);
    const navigate = useNavigate();
    useEffect(() => {
        const timer = setTimeout(() => setLoading(false), 800);
        return () => clearTimeout(timer);
    }, [tab]);

    const handleTabChange = (event: SyntheticEvent, newValue: number): void => {
        setTab(newValue);
        setExpanded(null);
        setLoading(true);
    };

    const toggleExpand = (id: string): void => {
        setExpanded(expanded === id ? null : id);
    };

    const handleBack = () => {
        navigate(-1);
    }

    const handleOpenEditLessonManager = () => {
        setEditModal(true);
    }
    const fade = {
        initial: { opacity: 0, y: 10 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -10 },
        transition: { duration: 0.35 },
    };

    const data: LessonManagerDetail = mockLessonManagerDetail;

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

    const renderExpandableList = <T,>(
        items: T[],
        renderHeader: (item: T) => JSX.Element,
        renderBody: (item: T) => JSX.Element
    ): JSX.Element => (
        <Box className="space-y-3">
            {items.map((item: any) => (
                <Card
                    key={item.id}
                    className="rounded-2xl shadow-sm hover:shadow-md transition-all overflow-hidden"
                >
                    <Box
                        className="flex justify-between items-center p-4 cursor-pointer bg-white"
                        onClick={() => toggleExpand(item.id)}
                    >
                        {renderHeader(item)}
                        <ExpandMoreIcon
                            className={`transform transition-transform ${expanded === item.id ? 'rotate-180' : ''}`}
                        />
                    </Box>
                    <Collapse in={expanded === item.id} timeout="auto" unmountOnExit>
                        <CardContent className="bg-gray-50 border-t">
                            {renderBody(item)}
                            <Box className="flex justify-end mt-3 gap-2">
                                <Tooltip title="Chỉnh sửa"><IconButton color="info" size="small" ><EditIcon fontSize="small" /></IconButton></Tooltip>
                                <Button size="small" variant="outlined">Xem chi tiết</Button>
                            </Box>
                        </CardContent>
                    </Collapse>
                </Card>
            ))}
        </Box>
    );

    return (
        <Box className="min-h-screen bg-gray-50 p-6 space-y-6">
            {/* Hero Section with Back and Edit */}
            <Box className="relative rounded-2xl overflow-hidden shadow-md">
                <img src={data.thumbnail} alt={data.title} className="w-full h-64 object-cover" />
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
                        <Typography variant="h4" fontWeight={700}>{data.title}</Typography>
                        <Typography variant="body1">{data.description}</Typography>
                        <Box className="flex flex-wrap gap-2 mt-2">
                            <Chip label={data.level} color="info" />
                            <Chip
                                label={`Part ${data.part_type}`}
                                color="error"
                                sx={{
                                    color: "white",         
                                }}
                            />
                            <Chip label={data.status === 'approved' ? 'Đã duyệt' : data.status} color="success" />
                        </Box>
                        <Typography variant="body2" className="opacity-80 mt-1">
                            ⭐ {data.rating} | 👥 {data.student_count} | ⏱ {data.planned_completion_time} phút
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
                {loading ? (
                    renderSkeletonList()
                ) : (
                    <motion.div key={tab} {...fade}>
                        {tab === 0 && renderExpandableList<VocabularyTopic>(
                            data.topic_vocabulary_ids,
                            (v) => (
                                <Box className="flex items-center gap-3">
                                    <SchoolIcon color="info" />
                                    <Box>
                                        <Typography variant="subtitle1" fontWeight={600}>{v.title}</Typography>
                                        <Typography variant="body2" color="text.secondary">{v.word_count} từ</Typography>
                                    </Box>
                                </Box>
                            ),
                            (v) => (
                                <>
                                    {v.words.map((w, i) => (
                                        <Typography key={i} variant="body2" className="py-1 border-b last:border-0">• {w}</Typography>
                                    ))}
                                </>
                            )
                        )}

                        {tab === 1 && renderExpandableList<Lesson>(
                            data.lesson_ids,
                            (lesson) => (
                                <Box className="flex items-center gap-3">
                                    <PlayCircleOutlineIcon color="success" />
                                    <Box>
                                        <Typography variant="subtitle1" fontWeight={600}>{lesson.title}</Typography>
                                        <Typography variant="body2" color="text.secondary">⏱ {lesson.duration} phút</Typography>
                                    </Box>
                                </Box>
                            ),
                            (lesson) => (
                                <>
                                    {lesson.sections.map((section) => (
                                        <Box key={section.id} className="flex justify-between py-2 border-b last:border-0">
                                            <Typography variant="body2">• {section.name}</Typography>
                                            <Typography variant="body2" color="text.secondary">⏱ {section.duration} phút</Typography>
                                        </Box>
                                    ))}
                                </>
                            )
                        )}

                        {tab === 2 && renderExpandableList<Dictation>(
                            data.dictation_ids,
                            (d) => (
                                <Box className="flex items-center gap-3">
                                    <HeadphonesIcon color="primary" />
                                    <Box>
                                        <Typography variant="subtitle1" fontWeight={600}>{d.title}</Typography>
                                        <Typography variant="body2" color="text.secondary">Độ khó: {d.difficulty}</Typography>
                                    </Box>
                                </Box>
                            ),
                            (d) => (
                                <>
                                    {d.scripts.map((s) => (
                                        <Typography key={s.id} variant="body2" className="py-1 border-b last:border-0">• {s.text}</Typography>
                                    ))}
                                </>
                            )
                        )}

                        {tab === 3 && renderExpandableList<Shadowing>(
                            data.shadowing_ids,
                            (s) => (
                                <Box className="flex items-center gap-3">
                                    <MicIcon color="secondary" />
                                    <Box>
                                        <Typography variant="subtitle1" fontWeight={600}>{s.title}</Typography>
                                        <Typography variant="body2" color="text.secondary">Video luyện nói</Typography>
                                    </Box>
                                </Box>
                            ),
                            (s) => (
                                <>
                                    {s.sentences.map((line) => (
                                        <Typography key={line.id} variant="body2" className="py-1 border-b last:border-0">• {line.line}</Typography>
                                    ))}
                                </>
                            )
                        )}

                        {tab === 4 && renderExpandableList<Quiz>(
                            data.quiz_ids,
                            (q) => (
                                <Box className="flex items-center gap-3">
                                    <QuizIcon color="secondary" />
                                    <Box>
                                        <Typography variant="subtitle1" fontWeight={600}>{q.title}</Typography>
                                        <Typography variant="body2" color="text.secondary">{q.questionCount} câu hỏi</Typography>
                                    </Box>
                                </Box>
                            ),
                            (q) => (
                                <>
                                    {q.questions.map((question) => (
                                        <Typography key={question.id} variant="body2" className="py-1 border-b last:border-0">• {question.question}</Typography>
                                    ))}
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
                onSave={() => { setEditModal(false); }}
                isEdit={true}
            />
        </Box>
    );
}
