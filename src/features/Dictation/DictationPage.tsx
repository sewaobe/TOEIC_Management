import { useMemo, useState, useEffect } from "react";
import {
    Box,
    IconButton,
    Button,
    TextField,
    InputAdornment,
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
    Snackbar,
    Alert,
    Tooltip,
    Fab,
    Zoom,
    TableFooter,
    TablePagination,
    Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import WarningAmberOutlinedIcon from "@mui/icons-material/WarningAmberOutlined";
import { AnimatePresence } from "framer-motion";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../stores/store";
import { hideFab, showFab } from "../../stores/fabSlice";
import { Dictation } from "../../types/Dictation";
import DictationModal from "./components/DictationModal";
import { dictationService } from "../../services/dictation.service";
import { EmptyState } from "../../components/EmptyState";
import { parseArgs } from "util";


// --------------------------
// Helpers
// --------------------------
export const LEVELS = ["A1", "A2", "B1", "B2", "C1", "C2"];
export const PART_TYPES = [1, 2, 3, 4]
export const fmtTime = (ms?: number) => (typeof ms === "number" ? `${(ms / 1000).toFixed(2)}s` : "-");

// =========================================================
// MAIN COMPONENT
// =========================================================
export default function DictationPage() {
    const [rows, setRows] = useState<Dictation[]>([]);
    const [page, setPage] = useState(1);
    const [pageCount, setPageCount] = useState(1);
    const [loading, setLoading] = useState(false);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [total, setTotal] = useState(0); // nếu API có trả total

    const [query, setQuery] = useState("");
    const [levelFilter, setLevelFilter] = useState<string | "">("");
    const [modeFilter, setModeFilter] = useState<"" | "sentence" | "word">("");

    const [editing, setEditing] = useState<Dictation | null>(null);
    const [openModal, setOpenModal] = useState(false);
    const [toast, setToast] = useState<{ open: boolean; msg: string; sev: any }>({
        open: false,
        msg: "",
        sev: "success",
    });
    const [confirm, setConfirm] = useState<{ open: boolean; id?: string }>({ open: false });

    // =============================
    // FILTERED ROWS
    // =============================
    const filtered = useMemo(() => {
        return rows.filter((r) => {
            if (levelFilter && r.level !== levelFilter) return false;
            if (modeFilter && r.display_mode !== modeFilter) return false;
            const q = query.trim().toLowerCase();
            if (!q) return true;
            return r.topic.toLowerCase().includes(q) || r.transcript.toLowerCase().includes(q);
        });
    }, [rows, query, levelFilter, modeFilter]);

    // =============================
    // CRUD
    // =============================
    const openCreate = () => {
        setEditing({
            topic: "",
            level: "A1",
            transcript: "",
            display_mode: "sentence",
            audio_path: "",
        });
        setOpenModal(true);
    };

    const openEdit = (row: Dictation) => {
        setEditing({ ...row });
        setOpenModal(true);
    };

    const onSave = async (payload: Dictation) => {
        try {
            if (payload._id) {
                await dictationService.update(payload, payload._id);
                setToast({ open: true, msg: "Đã cập nhật dictation", sev: "success" });
            } else {
                await dictationService.create(payload);
                console.log("======Payload Dictation ", payload);
                setToast({ open: true, msg: "Đã tạo dictation mới", sev: "success" });
            }

            await fetchData(page, rowsPerPage);
            setOpenModal(false);
            setEditing(null);
        }
        catch (err) {
            console.error(err);
            setToast({ open: true, msg: "Không thể lưu dictation", sev: "error" });
        }
    };

    const askDelete = (id: string) => setConfirm({ open: true, id });
    const doDelete = async () => {
        if (confirm.id) {
            await dictationService.delete(confirm.id);
        }
        await fetchData(page, rowsPerPage);
        setConfirm({ open: false });
        setToast({ open: true, msg: "Đã xoá bài nghe", sev: "success" });
    };

    const dispatch = useDispatch<AppDispatch>();

    const fetchData = async (pageNum = 1, limit = rowsPerPage) => {
        try {
            setLoading(true);
            const res = await dictationService.getAll(pageNum, limit);
            setRows(res.items || []);
            setPage(res.page);
            setPageCount(res.pageCount);
            setTotal(res.total || 0);
        } catch (err) {
            console.error(err);
            setToast({
                open: true,
                msg: "Không thể tải danh sách dictation",
                sev: "error",
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        dispatch(hideFab());
        fetchData();

        return () => {
            dispatch(showFab());
        }
    }, [])

    if (loading) return <EmptyState mode="loading" />

    return (
        <Box className="w-full h-full bg-gradient-to-b from-gray-50 to-gray-100 text-gray-900">
            <Box className="max-w-6xl mx-auto p-5 space-y-5">
                <Typography variant="h5" sx={{ fontWeight: "bold", mb: 3 }}>
                    Bài tập nghe chép chính tả
                </Typography>
                {/* Toolbar */}
                <Paper className="p-4 rounded-2xl shadow-sm flex flex-col md:flex-row gap-3 items-stretch md:items-center">
                    <TextField
                        size="small"
                        placeholder="Tìm theo chủ đề hoặc transcript…"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon fontSize="small" />
                                </InputAdornment>
                            ),
                        }}
                        className="w-full md:w-1/2"
                    />
                    <Box className="flex-1" />

                    <TextField
                        size="small"
                        select
                        label="Level"
                        value={levelFilter}
                        onChange={(e) => setLevelFilter((e.target.value))}
                        className="w-full md:w-40"
                    >
                        <MenuItem value="">Tất cả</MenuItem>
                        {LEVELS.map((lv) => (
                            <MenuItem key={lv} value={lv.toUpperCase()}>
                                {lv}
                            </MenuItem>
                        ))}
                    </TextField>
                    <TextField
                        size="small"
                        select
                        label="Display"
                        value={modeFilter}
                        onChange={(e) => setModeFilter(e.target.value as any)}
                        className="w-full md:w-44"
                    >
                        <MenuItem value="">Tất cả</MenuItem>
                        <MenuItem value="sentence">sentence</MenuItem>
                        <MenuItem value="word">word</MenuItem>
                    </TextField>
                </Paper>

                {/* Table */}
                <TableContainer component={Paper} className="rounded-2xl shadow-sm">
                    <Table size="small">
                        <TableHead>
                            <TableRow className="bg-gray-50">
                                <TableCell>Topic</TableCell>
                                <TableCell>Level</TableCell>
                                <TableCell>Duration</TableCell>
                                <TableCell>Display</TableCell>
                                <TableCell>Updated</TableCell>
                                <TableCell align="right">Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filtered.map((r) => (
                                <TableRow key={r._id} hover>
                                    <TableCell>{r.topic}</TableCell>
                                    <TableCell>
                                        <Chip label={r.level} size="small" color="primary" variant="outlined" />
                                    </TableCell>
                                    <TableCell>{fmtTime(r.duration)}</TableCell>
                                    <TableCell>
                                        <Chip label={r.display_mode} size="small" variant="outlined" />
                                    </TableCell>
                                    <TableCell>{r.updated_at ? new Date(r.updated_at).toLocaleDateString() : "-"}</TableCell>
                                    <TableCell align="right">
                                        <Tooltip title="Sửa">
                                            <IconButton onClick={() => openEdit(r)}>
                                                <EditOutlinedIcon fontSize="small" />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Xoá">
                                            <IconButton color="error" onClick={() => askDelete(r._id!)}>
                                                <DeleteOutlineIcon fontSize="small" />
                                            </IconButton>
                                        </Tooltip>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {filtered.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={6}>
                                        <Box className="text-center py-10 text-gray-500">Không có bài nào phù hợp.</Box>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                        <TableFooter>
                            <TableRow>
                                <TablePagination
                                    count={total}
                                    page={page - 1} // MUI đếm từ 0, còn API của bạn đếm từ 1
                                    onPageChange={(_, newPage) => {
                                        setPage(newPage + 1);
                                        fetchData(newPage + 1, rowsPerPage);
                                    }}
                                    rowsPerPage={rowsPerPage}
                                    onRowsPerPageChange={(e) => {
                                        const newLimit = parseInt(e.target.value, 10);
                                        setRowsPerPage(newLimit);
                                        fetchData(1, newLimit);
                                    }}
                                    rowsPerPageOptions={[5, 10, 20, 50]}
                                    labelRowsPerPage="Số dòng mỗi trang:"
                                    labelDisplayedRows={({ from, to, count }) =>
                                        `${from}–${to} trên tổng ${count}`
                                    }
                                />
                            </TableRow>
                        </TableFooter>
                    </Table>
                </TableContainer>
            </Box>

            {/* Modal */}
            <AnimatePresence>
                {openModal && editing && (
                    <DictationModal
                        key="modal"
                        open={openModal}
                        value={editing}
                        onClose={() => {
                            setOpenModal(false);
                            setEditing(null);
                        }}
                        onSave={onSave}
                    />
                )}
            </AnimatePresence>

            {/* Confirm Delete */}
            <Dialog open={confirm.open} onClose={() => setConfirm({ open: false })}>
                <DialogTitle className="flex items-center gap-2 font-semibold">
                    <WarningAmberOutlinedIcon sx={{ color: "#f59e0b", fontSize: 20 }} />
                    Xác nhận xoá
                </DialogTitle>
                <DialogContent>Bạn có chắc chắn muốn xoá bài nghe này?</DialogContent>
                <DialogActions>
                    <Button onClick={() => setConfirm({ open: false })}>Huỷ</Button>
                    <Button color="error" variant="contained" onClick={doDelete}>
                        Xoá
                    </Button>
                </DialogActions>
            </Dialog>

            <Snackbar
                open={toast.open}
                autoHideDuration={3000}
                onClose={() => setToast({ ...toast, open: false })}
                anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            >
                <Alert severity={toast.sev as any}>{toast.msg}</Alert>
            </Snackbar>
            {/* Floating Add Button */}
            <Zoom in unmountOnExit>
                <Tooltip title="Thêm dictation mới" arrow placement="left">
                    <Fab
                        color="primary"
                        onClick={openCreate}
                        sx={{
                            position: "fixed",
                            bottom: 32,
                            right: 32,
                            backgroundColor: "#4f46e5",
                            "&:hover": { backgroundColor: "#4338ca" },
                            boxShadow: 6,
                        }}
                    >
                        <AddIcon />
                    </Fab>
                </Tooltip>
            </Zoom>
        </Box>
    );
}

