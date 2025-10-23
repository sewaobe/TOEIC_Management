import {
    Box,
    Typography,
    IconButton,
    Button,
    TextField,
    MenuItem,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Chip,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    RadioGroup,
    FormControlLabel,
    Radio,
    Alert,
    LinearProgress,
    CircularProgress,
    Tooltip,
    Divider,
    Switch,
    Stack,
    Tabs,
    Tab,
    Autocomplete,
} from "@mui/material";
import WarningAmberOutlinedIcon from "@mui/icons-material/WarningAmberOutlined";
import HeadphonesOutlinedIcon from "@mui/icons-material/HeadphonesOutlined";
import MusicNoteOutlinedIcon from "@mui/icons-material/MusicNoteOutlined";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import BoltOutlinedIcon from "@mui/icons-material/BoltOutlined";
import ContentCutOutlinedIcon from "@mui/icons-material/ContentCutOutlined";
import LinkOutlinedIcon from "@mui/icons-material/LinkOutlined";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import PlayArrowOutlinedIcon from "@mui/icons-material/PlayArrowOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import { motion } from "framer-motion";
import { Dictation, Timing } from "../../../types/Dictation";
import { useEffect, useRef, useState } from "react";
import { fmtTime, LEVELS, PART_TYPES } from "../DictationPage";
import CloudUploadOutlinedIcon from "@mui/icons-material/CloudUploadOutlined";
import { uploadToCloudinary } from "../../../services/cloudinary.service";
import { whisperService } from "../../../services/whisper.service";
import { lessonManagerService } from "../../../services/lesson_manager.service";


export default function DictationModal({
    open,
    value,
    onClose,
    onSave,
}: {
    open: boolean;
    value: Dictation;
    onClose: () => void;
    onSave: (payload: Dictation) => void;
}) {
    const [form, setForm] = useState<Dictation>({ ...value });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState(0);
    const [activeIdx, setActiveIdx] = useState<number | null>(null);
    const [showWordLevel, setShowWordLevel] = useState(false);
    const [confirmExit, setConfirmExit] = useState(false);
    const [controller, setController] = useState<AbortController | null>(null);
    const [taskId, setTaskId] = useState<string | null>(null);
    const [topicTitles, setTopicTitles] = useState<{ id: string; title: string }[]>([]);

    const audioRef = useRef<HTMLAudioElement | null>(null);

    // ---------------------
    // EFFECTS
    // ---------------------
    useEffect(() => setForm({ ...value }), [value]);

    // Theo dõi audio thời gian thực
    useEffect(() => {
        const el = audioRef.current;
        if (!el || !form.timings?.length) return;

        const onTime = () => {
            const t = el.currentTime * 1000;
            const idx = form.timings!.findIndex(
                (s) => t >= s.startTime && t < s.endTime
            );
            setActiveIdx(idx >= 0 ? idx : null);
        };

        el.addEventListener("timeupdate", onTime);

        // cleanup khi modal đóng hoặc audio đổi
        return () => {
            el.removeEventListener("timeupdate", onTime);
        };
    }, [open, activeTab, form.timings]);

    // Fetch dữ liệu tên chủ đề lessonManager
    useEffect(() => {
        const fetchData = async () => {
            try {
                const topics = await lessonManagerService.getAllTopicTitles();
                setTopicTitles(topics);
            } catch (error) {
                console.error("Error fetching topics:", error);
            }
        };

        fetchData();
    }, [])
    // ---------------------
    // FUNCTIONS
    // ---------------------
    const handleSave = () => {
        if (!form.title.trim()) {
            setError("Vui lòng nhập tiêu đề bài nghe");
            return;
        } else if (!form.transcript.trim()) {
            setError("Vui lòng nhập transcript bài nghe");
            return;
        }
        onSave({ ...form, updated_at: new Date().toISOString() });
    };

    const runGenerate = async () => {
        if (!form.transcript?.trim() && !form.audio_path?.trim()) {
            setError("Cần nhập transcript hoặc audio_path để xử lý.");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const start = await whisperService.startProcess({
                transcript: form.transcript || undefined,
                audio_path: form.audio_path || undefined,
                level: form.level || "A1",
            });

            if (!start.task_id) {
                setLoading(false);
                setError(start.error || "Không thể khởi tạo tiến trình AI");
                return;
            }

            const { task_id } = start;
            setTaskId(task_id);

            let done = false;
            while (!done) {
                const statusRes = await whisperService.getStatus(task_id);

                if (statusRes.status === "done") {
                    done = true;
                    const res = statusRes.result;
                    if (res.error) throw new Error(res.error);

                    const determinedAudio = res.audio_path ?? form.audio_path;

                    setForm((prev) => ({
                        ...prev,
                        audio_url: determinedAudio || prev.audio_url,
                        timings: res.highlightTimings || prev.timings,
                        transcript: res.transcript ?? prev.transcript,
                        duration: res.highlightTimings?.length
                            ? res.highlightTimings[res.highlightTimings.length - 1].endTime
                            : prev.duration,
                    }));
                    setActiveTab(1);
                    break;
                }

                if (statusRes.status === "cancelled" || statusRes.result?.error === "Task cancelled") {
                    throw new Error("Đã huỷ xử lý AI");
                }

                await new Promise((r) => setTimeout(r, 2000));
            }
        } catch (err: any) {
            console.error(err);
            setError(err.message || "Lỗi xử lý AI");
        } finally {
            setLoading(false);
            setTaskId(null);
        }
    };



    const addSegment = () => {
        const seg: Timing = {
            text: "(new segment)",
            startTime: form.timings?.length ? form.timings[form.timings.length - 1].endTime + 1 : 0,
            endTime: (form.timings?.length ? form.timings[form.timings.length - 1].endTime : 0) + 1000,
        };
        setForm((p) => ({ ...p, timings: [...(p.timings || []), seg] }));
    };

    const splitSegment = (idx: number) => {
        if (!form.timings) return;
        const s = form.timings[idx];
        const mid = Math.floor((s.startTime + s.endTime) / 2);
        const left: Timing = { text: s.text + " (1)", startTime: s.startTime, endTime: mid };
        const right: Timing = { text: s.text + " (2)", startTime: mid + 1, endTime: s.endTime };
        const next = [...form.timings];
        next.splice(idx, 1, left, right);
        setForm((p) => ({ ...p, timings: next }));
    };

    const mergeWithNext = (idx: number) => {
        if (!form.timings || idx >= form.timings.length - 1) return;
        const a = form.timings[idx];
        const b = form.timings[idx + 1];
        const merged: Timing = { text: `${a.text} ${b.text}`.trim(), startTime: a.startTime, endTime: b.endTime };
        const next = [...form.timings];
        next.splice(idx, 2, merged);
        setForm((p) => ({ ...p, timings: next }));
    };

    const fillSample = () => {
        setForm((p) => ({
            ...p,
            title: p.title || "Reception Dialogue",
            level: p.level || "A1",
            part_type: p.part_type || 1,
            transcript:
                p.transcript ||
                "Welcome to our company. Please take a seat and fill out this form. We will call your name shortly.",
        }));
    };

    const handleAttemptClose = () => {
        if (loading) {
            setConfirmExit(true);
        } else {
            // nếu đang chạy mà người ta đóng modal
            if (taskId) whisperService.cancel(taskId);
            onClose();
        }
    };

    const confirmExitAction = async (proceed: boolean) => {
        if (proceed) {
            try {
                if (taskId) {
                    await whisperService.cancel(taskId);
                    console.log(`[CANCEL] Đã gửi yêu cầu huỷ task ${taskId} tới Flask`);
                }
            } catch (err) {
                console.warn("Không thể huỷ task:", err);
            }

            if (controller) controller.abort();
            setConfirmExit(false);
            setLoading(false);
            setTaskId(null);
            onClose();
        } else {
            setConfirmExit(false);
        }
    };


    // ---------------------
    // UI
    // ---------------------
    return (
        <>
            <Dialog
                open={open}
                onClose={handleAttemptClose}
                fullWidth
                maxWidth="lg"
                PaperProps={{
                    component: motion.div,
                    initial: { opacity: 0, y: 20, scale: 0.96 },
                    animate: { opacity: 1, y: 0, scale: 1 },
                    exit: { opacity: 0, y: 20, scale: 0.96 },
                    transition: { duration: 0.25 },
                    className: "rounded-3xl shadow-2xl bg-white",
                    style: { maxHeight: "90vh", overflow: "hidden" },
                }}
            >
                {/* Header */}
                <DialogTitle className="border-b border-gray-200 pb-3">
                    <Box className="flex items-center justify-between">
                        <Box className="flex items-center gap-3">
                            <Box className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center">
                                <HeadphonesOutlinedIcon className="text-indigo-600" fontSize="small" />
                            </Box>
                            <Box>
                                <Typography variant="h6" className="font-semibold text-gray-900">
                                    {form._id ? "Chỉnh sửa Dictation" : "Tạo Dictation mới"}
                                </Typography>
                                <Typography variant="caption" className="text-gray-500">
                                    Quản lý bài nghe TOEIC của bạn
                                </Typography>
                            </Box>
                        </Box>
                    </Box>
                </DialogTitle>

                {/* Nội dung */}
                <DialogContent
                    className="p-0"
                    sx={{
                        overflowY: "auto",
                        maxHeight: "calc(90vh - 130px)",
                    }}>
                    {error && (
                        <Box className="px-6 pt-4">
                            <Alert severity="error" onClose={() => setError(null)} className="rounded-xl">
                                {error}
                            </Alert>
                        </Box>
                    )}

                    {/* Tabs */}
                    <Box className="border-b border-gray-200">
                        <Tabs
                            value={activeTab}
                            onChange={(_, v) => setActiveTab(v)}
                            className="px-6"
                            sx={{
                                "& .MuiTab-root": { textTransform: "none", fontWeight: 600, fontSize: "0.95rem" },
                            }}
                        >
                            <Tab icon={<SettingsOutlinedIcon fontSize="small" />} iconPosition="start" label="Cài đặt & Nội dung" />
                            <Tab
                                icon={<VisibilityOutlinedIcon fontSize="small" />}
                                iconPosition="start"
                                label="Xem trước & Chỉnh sửa"
                            />
                        </Tabs>
                    </Box>

                    {/* Tab Content */}
                    <Box className="px-6 py-6">
                        {/* Tab 1: Setup */}
                        {activeTab === 0 && (
                            <Box className="space-y-8">
                                {/* Basic Info */}
                                <Box>
                                    <Typography variant="subtitle2" className="font-bold text-gray-900 !mb-3 flex items-center gap-2">
                                        <DescriptionOutlinedIcon fontSize="small" className="text-indigo-600" /> Thông tin cơ bản
                                    </Typography>
                                    <Box className="space-y-5 bg-gray-50 p-5 rounded-2xl">
                                        <TextField
                                            label="Tiêu đề bài nghe (Title)"
                                            fullWidth
                                            value={form.title ?? ""}
                                            onChange={(e) => setForm({ ...form, title: e.target.value })}
                                        />
                                        <Stack direction={{ xs: "column", sm: "row" }} spacing={3}>
                                            <TextField
                                                select
                                                label="Độ khó (TOEIC Level)"
                                                className="w-full sm:w-48"
                                                value={form.level || "A1"}
                                                onChange={(e) => setForm({ ...form, level: e.target.value })}
                                            >
                                                {LEVELS.map((lv) => (
                                                    <MenuItem key={lv} value={lv.toUpperCase()}>
                                                        Level {lv}
                                                    </MenuItem>
                                                ))}
                                            </TextField>
                                            <TextField
                                                select
                                                label="Loại part (Part type)"
                                                className="w-full sm:w-48"
                                                value={String(form.part_type || "")} // 👈 ép kiểu về string
                                                onChange={(e) => setForm({ ...form, part_type: Number(e.target.value) })}
                                            >
                                                {PART_TYPES.map((part) => (
                                                    <MenuItem key={part} value={part}>
                                                        Part {part}
                                                    </MenuItem>
                                                ))}
                                            </TextField>
                                            <Autocomplete
                                                multiple
                                                options={topicTitles}
                                                getOptionLabel={(option) => option.title}
                                                renderInput={(params) => (
                                                    <TextField {...params} label="Chủ đề bài nghe" placeholder="Chọn chủ đề" />
                                                )}
                                                value={topicTitles.filter(t => form.topic?.includes(t.id))}
                                                onChange={(event, newValue) => {
                                                    setForm({
                                                        ...form,
                                                        topic: newValue.map(item => item.id),
                                                    });
                                                }}
                                                sx={{
                                                    flex: 1,
                                                    '& .MuiAutocomplete-inputRoot': {
                                                        flexWrap: 'nowrap !important',
                                                        overflowX: 'auto',
                                                        overflowY: 'hidden',
                                                        scrollbarWidth: 'none',
                                                        maxWidth: 305,
                                                        '&::-webkit-scrollbar': {
                                                            height: 6,
                                                        },
                                                        '&::-webkit-scrollbar-thumb': {
                                                            backgroundColor: 'transparent',
                                                            borderRadius: 3,
                                                        },
                                                        '&:hover::-webkit-scrollbar-thumb': {
                                                            backgroundColor: '#bbb',
                                                        },
                                                        '& input': {
                                                            minWidth: 120,
                                                        },
                                                    },
                                                    '& .MuiAutocomplete-tag': {
                                                        fontSize: '0.85rem',
                                                        backgroundColor: '#f1f3f4',
                                                        color: '#333',
                                                        borderRadius: '20px',
                                                        padding: '2px 8px',
                                                        marginRight: '4px',
                                                        transition: 'all 0.2s',
                                                        '&:hover': {
                                                            backgroundColor: '#e0e0e0',
                                                        },
                                                    },
                                                }}
                                                componentsProps={{
                                                    popper: {
                                                        modifiers: [
                                                            {
                                                                name: 'offset',
                                                                options: {
                                                                    offset: [0, 4],
                                                                },
                                                            },
                                                        ],
                                                    },
                                                    paper: {
                                                        sx: {
                                                            borderRadius: 2,
                                                            boxShadow: '0 2px 12px rgba(0,0,0,0.1)',
                                                            overflow: 'hidden',
                                                        },
                                                    },
                                                }}
                                            />
                                            <Box className="flex-1">
                                                <Typography variant="caption" className="text-gray-600 mb-1 block">
                                                    Chế độ hiển thị
                                                </Typography>
                                                <RadioGroup
                                                    row
                                                    value={form.display_mode || "sentence"}
                                                    onChange={(e) => setForm({ ...form, display_mode: e.target.value as any })}
                                                >
                                                    <FormControlLabel value="sentence" control={<Radio />} label="Theo câu" />
                                                    <FormControlLabel value="word" control={<Radio />} label="Theo từ" />
                                                </RadioGroup>
                                            </Box>
                                        </Stack>
                                    </Box>
                                </Box>

                                <Divider />

                                {/* Transcript */}
                                <Box>
                                    <Typography variant="subtitle2" className="font-bold text-gray-900 !mb-3 flex items-center gap-2">
                                        <MusicNoteOutlinedIcon fontSize="small" className="text-indigo-600" /> Nội dung bài nghe
                                    </Typography>
                                    <Box className="space-y-5">
                                        <TextField
                                            label="Transcript (Văn bản)"
                                            multiline
                                            minRows={5}
                                            fullWidth
                                            value={form.transcript ?? ""}
                                            onChange={(e) => setForm({ ...form, transcript: e.target.value })}
                                            placeholder="Nhập hoặc dán transcript..."
                                        />
                                        <Box className="relative">
                                            <TextField
                                                label="Đường dẫn Audio (trên server / Cloudinary)"
                                                fullWidth
                                                value={form.audio_path || ""}
                                                onChange={(e) => setForm({ ...form, audio_path: e.target.value })}
                                                placeholder="Hoặc chọn file audio từ máy của bạn..."
                                                helperText="Tự động upload lên Cloudinary khi chọn file từ máy."
                                                InputProps={{
                                                    endAdornment: (
                                                        <Button
                                                            component="label"
                                                            variant="outlined"
                                                            size="small"
                                                            startIcon={<CloudUploadOutlinedIcon fontSize="small" />}
                                                            sx={{ ml: 1, whiteSpace: "nowrap" }}
                                                        >
                                                            Chọn file
                                                            <input
                                                                type="file"
                                                                accept="audio/*"
                                                                hidden
                                                                onChange={async (e) => {
                                                                    const file = e.target.files?.[0];
                                                                    if (!file) return;
                                                                    try {
                                                                        setLoading(true);
                                                                        const res = await uploadToCloudinary(file);
                                                                        setForm((prev) => ({ ...prev, audio_path: res.url }));
                                                                        setError(null);
                                                                    } catch (err) {
                                                                        console.error(err);
                                                                        setError("Upload thất bại. Vui lòng thử lại.");
                                                                    } finally {
                                                                        setLoading(false);
                                                                    }
                                                                }}
                                                            />
                                                        </Button>
                                                    ),
                                                }}
                                            />
                                        </Box>
                                    </Box>
                                </Box>

                                <Divider />

                                {/* AI Section */}
                                <Box className="bg-gradient-to-br from-indigo-50 to-purple-50 p-6 rounded-2xl border border-indigo-200">
                                    <Box className="flex items-start gap-3 mb-5">
                                        <Box className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center flex-shrink-0">
                                            <BoltOutlinedIcon className="text-white" fontSize="small" />
                                        </Box>
                                        <Box>
                                            <Typography variant="subtitle2" className="font-bold text-gray-900">
                                                Xử lý AI tự động
                                            </Typography>
                                            <Typography variant="body2" className="text-gray-600 text-sm">
                                                Hệ thống sẽ phân tích transcript hoặc audio để tạo timings và đồng bộ.
                                            </Typography>
                                        </Box>
                                    </Box>
                                    <Stack direction="row" spacing={2} alignItems="center">
                                        <Button
                                            variant="contained"
                                            size="large"
                                            startIcon={loading ? <CircularProgress size={18} color="inherit" /> : <BoltOutlinedIcon fontSize="small" />}
                                            onClick={runGenerate}
                                            disabled={loading}
                                            className="bg-indigo-600 hover:bg-indigo-700 shadow-lg"
                                            sx={{ textTransform: "none", fontWeight: 600, px: 3 }}
                                        >
                                            {loading ? "Đang xử lý..." : "Xử lý với AI"}
                                        </Button>
                                        <Button variant="outlined" startIcon={<DescriptionOutlinedIcon fontSize="small" />} onClick={fillSample}>
                                            Điền mẫu
                                        </Button>
                                    </Stack>
                                    {loading && (
                                        <Box className="mt-4">
                                            <LinearProgress className="rounded-full" />
                                            <Typography variant="caption" className="text-gray-600 mt-2 block">
                                                Đang phân tích và tạo timings...
                                            </Typography>
                                        </Box>
                                    )}
                                </Box>
                            </Box>
                        )}

                        {/* Tab 2: Preview */}
                        {activeTab === 1 && (
                            <Box className="space-y-8">
                                {/* Audio */}
                                <Box>
                                    <Typography variant="subtitle2" className="font-bold text-gray-900 !mb-3 flex items-center gap-2">
                                        <PlayArrowOutlinedIcon fontSize="small" className="text-indigo-600" /> Audio Player
                                    </Typography>
                                    <Paper className="p-5 rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100">
                                        {form.audio_url || form.audio_path ? (
                                            <Box>
                                                <audio
                                                    ref={audioRef}
                                                    controls
                                                    src={form.audio_url || form.audio_path}
                                                    className="w-full rounded-xl"
                                                />
                                                <Typography variant="caption" className="text-gray-500 !mt-2 block">
                                                    Nhấp segment bên dưới để phát tại thời điểm tương ứng.
                                                </Typography>
                                            </Box>
                                        ) : (
                                            <Box className="text-center py-8 text-gray-500">
                                                <MusicNoteOutlinedIcon fontSize="large" className="text-gray-400 mx-auto mb-2" />
                                                Chưa có audio.
                                            </Box>
                                        )}
                                    </Paper>
                                </Box>

                                {/* Transcript Preview */}
                                <Box>
                                    <Typography variant="subtitle2" className="font-bold text-gray-900 !mb-3 flex items-center gap-2">
                                        <DescriptionOutlinedIcon fontSize="small" className="text-indigo-600" /> Transcript & Timings
                                    </Typography>
                                    <Paper className="p-5 rounded-2xl">
                                        {form.timings?.length ? (
                                            <Box className="space-y-3">
                                                {form.timings.map((s, i) => (
                                                    <motion.div
                                                        key={i}
                                                        initial={{ opacity: 0, x: -10 }}
                                                        animate={{ opacity: 1, x: 0 }}
                                                        transition={{ delay: i * 0.04 }}
                                                        className={`p-3 rounded-xl cursor-pointer transition-all border-2 ${activeIdx === i
                                                            ? "bg-indigo-100 border-indigo-400 shadow-md"
                                                            : "bg-gray-50 hover:bg-gray-100 border-transparent"
                                                            }`}
                                                        onClick={() => {
                                                            if (audioRef.current) audioRef.current.currentTime = s.startTime / 1000;
                                                        }}
                                                    >
                                                        <Box className="flex items-start gap-3">
                                                            <Chip
                                                                label={`#${i + 1}`}
                                                                size="small"
                                                                className={activeIdx === i ? "bg-indigo-600 text-white" : "bg-gray-300"}
                                                            />
                                                            <Box className="flex-1">
                                                                <Typography variant="body2" className="font-medium text-gray-900">
                                                                    {s.text}
                                                                </Typography>
                                                                <Typography variant="caption" className="text-gray-500">
                                                                    {fmtTime(s.startTime)} → {fmtTime(s.endTime)}
                                                                </Typography>
                                                            </Box>
                                                        </Box>
                                                    </motion.div>
                                                ))}
                                            </Box>
                                        ) : (
                                            <Box className="text-center py-10 text-gray-500">
                                                <DescriptionOutlinedIcon fontSize="large" className="text-gray-400 mx-auto mb-2" />
                                                Chưa có timings.
                                            </Box>
                                        )}
                                    </Paper>
                                </Box>

                                {/* Segment Editor */}
                                <Box>
                                    <Box className="flex items-center justify-between mb-3">
                                        <Typography variant="subtitle2" className="font-bold text-gray-900 flex items-center gap-2">
                                            <SettingsOutlinedIcon fontSize="small" className="text-indigo-600" /> Chỉnh sửa Segments
                                        </Typography>
                                        <Box className="flex items-center gap-2">
                                            <FormControlLabel
                                                control={<Switch checked={showWordLevel} onChange={(e) => setShowWordLevel(e.target.checked)} />}
                                                label={<Typography variant="caption">Word-level</Typography>}
                                            />
                                            <Button startIcon={<AddOutlinedIcon fontSize="small" />} onClick={addSegment} variant="outlined" size="small">
                                                Thêm
                                            </Button>
                                        </Box>
                                    </Box>
                                    <TableContainer component={Paper} className="rounded-2xl">
                                        <Table size="small">
                                            <TableHead>
                                                <TableRow className="bg-gray-50">
                                                    <TableCell>#</TableCell>
                                                    <TableCell>Start (ms)</TableCell>
                                                    <TableCell>End (ms)</TableCell>
                                                    <TableCell>Text</TableCell>
                                                    <TableCell align="right">Actions</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {(form.timings || []).map((s, idx) => (
                                                    <TableRow key={idx} className={activeIdx === idx ? "bg-indigo-50" : "hover:bg-gray-50"}>
                                                        <TableCell>
                                                            <Chip
                                                                label={idx + 1}
                                                                size="small"
                                                                className={activeIdx === idx ? "bg-indigo-600 text-white" : ""}
                                                            />
                                                        </TableCell>
                                                        <TableCell>
                                                            <TextField
                                                                size="small"
                                                                type="number"
                                                                value={s.startTime}
                                                                onChange={(e) => {
                                                                    const next = [...(form.timings || [])];
                                                                    next[idx] = { ...s, startTime: Number(e.target.value) };
                                                                    setForm((p) => ({ ...p, timings: next }));
                                                                }}
                                                                className="w-28"
                                                            />
                                                        </TableCell>
                                                        <TableCell>
                                                            <TextField
                                                                size="small"
                                                                type="number"
                                                                value={s.endTime}
                                                                onChange={(e) => {
                                                                    const next = [...(form.timings || [])];
                                                                    next[idx] = { ...s, endTime: Number(e.target.value) };
                                                                    setForm((p) => ({ ...p, timings: next }));
                                                                }}
                                                                className="w-28"
                                                            />
                                                        </TableCell>
                                                        <TableCell>
                                                            <TextField
                                                                size="small"
                                                                fullWidth
                                                                value={s.text}
                                                                onChange={(e) => {
                                                                    const next = [...(form.timings || [])];
                                                                    next[idx] = { ...s, text: e.target.value };
                                                                    setForm((p) => ({ ...p, timings: next }));
                                                                }}
                                                                multiline
                                                                maxRows={3}
                                                            />
                                                            {showWordLevel && s.words?.length ? (
                                                                <Box className="mt-2 p-2 rounded-lg bg-gray-50 border border-gray-200">
                                                                    {s.words.map((w, wi) => (
                                                                        <Chip
                                                                            key={wi}
                                                                            size="small"
                                                                            label={`${w.word} (${fmtTime(w.start)}-${fmtTime(w.end)})`}
                                                                            variant="outlined"
                                                                            className="mr-1 mb-1"
                                                                        />
                                                                    ))}
                                                                </Box>
                                                            ) : null}
                                                        </TableCell>
                                                        <TableCell align="right">
                                                            <Tooltip title="Tách segment">
                                                                <IconButton size="small" onClick={() => splitSegment(idx)}>
                                                                    <ContentCutOutlinedIcon fontSize="small" />
                                                                </IconButton>
                                                            </Tooltip>
                                                            <Tooltip title="Gộp với segment sau">
                                                                <IconButton
                                                                    size="small"
                                                                    onClick={() => mergeWithNext(idx)}
                                                                    disabled={idx >= (form.timings?.length || 0) - 1}
                                                                >
                                                                    <LinkOutlinedIcon fontSize="small" />
                                                                </IconButton>
                                                            </Tooltip>
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                                {(!form.timings || form.timings.length === 0) && (
                                                    <TableRow>
                                                        <TableCell colSpan={5}>
                                                            <Box className="text-center text-gray-500 py-10">
                                                                <SettingsOutlinedIcon fontSize="large" className="text-gray-400 mx-auto mb-2" />
                                                                Chưa có segment nào.
                                                            </Box>
                                                        </TableCell>
                                                    </TableRow>
                                                )}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                </Box>
                            </Box>
                        )}
                    </Box>
                </DialogContent>

                {/* Footer */}
                <DialogActions className="border-t border-gray-200 px-6 py-4">
                    <Button onClick={onClose}>Đóng</Button>
                    <Button
                        variant="contained"
                        className="bg-indigo-600 hover:bg-indigo-700 shadow-md"
                        onClick={handleSave}
                        sx={{ textTransform: "none", fontWeight: 600, px: 4 }}
                    >
                        Lưu Dictation
                    </Button>
                </DialogActions>

                {loading && (
                    <Box className="absolute inset-0 bg-white/70 backdrop-blur-sm flex items-center justify-center rounded-3xl">
                        <Box className="text-center">
                            <CircularProgress size={48} className="text-indigo-600" />
                            <Typography variant="body2" className="mt-3 text-gray-600 font-medium">
                                Đang xử lý...
                            </Typography>
                        </Box>
                    </Box>
                )}
            </Dialog>
            <Dialog open={confirmExit} onClose={() => confirmExitAction(false)}>
                <DialogTitle className="flex items-center gap-2 font-semibold">
                    <WarningAmberOutlinedIcon sx={{ color: "#f59e0b", fontSize: 20 }} />
                    Đang xử lý AI
                </DialogTitle>
                <DialogContent>
                    Hệ thống đang xử lý audio và transcript bằng AI. Nếu thoát bây giờ, quá
                    trình sẽ bị dừng lại.
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => confirmExitAction(false)}>Hủy</Button>
                    <Button
                        color="error"
                        variant="contained"
                        onClick={() => confirmExitAction(true)}
                    >
                        Đồng ý thoát
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}

