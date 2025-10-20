import React, { useState } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Box,
    IconButton,
    CircularProgress,
    Typography,
    Slider,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DeleteIcon from "@mui/icons-material/Delete";
import { LessonManager } from "../../../types/LessonManager";
import { uploadToCloudinary } from "../../../services/cloudinary.service";

interface Props {
    open: boolean;
    form: Partial<LessonManager>;
    onClose: () => void;
    onChange: (form: Partial<LessonManager>) => void;
    onSave: (finalForm?: Partial<LessonManager>) => void;
    isEdit?: boolean;
}

const LessonManagerEditModal: React.FC<Props> = ({
    open,
    form,
    onClose,
    onChange,
    onSave,
    isEdit = false,
}) => {
    const [preview, setPreview] = useState<string | null>(form.thumbnail || null);
    const [localFile, setLocalFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);

    React.useEffect(() => {
        if (!open) return; // chỉ reset khi mở modal

        // Nếu đang tạo mới (không có _id hoặc thumbnail rỗng)
        if (!form._id && !form.thumbnail) {
            setPreview(null);
            setLocalFile(null);
        } else {
            // Nếu đang chỉnh sửa, hiển thị lại thumbnail có sẵn
            setPreview(form.thumbnail || null);
        }
    }, [open, form.thumbnail]);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const localUrl = URL.createObjectURL(file);
            setLocalFile(file);
            setPreview(localUrl);
            onChange({ ...form, thumbnail: localUrl });
        }
    };


    const handleRemoveImage = () => {
        setLocalFile(null);
        setPreview(null);
        onChange({ ...form, thumbnail: "" });
    };

    const handleSave = async () => {
        let updatedForm = { ...form };
        try {
            if (localFile) {
                setUploading(true);
                const res = await uploadToCloudinary(localFile);
                updatedForm.thumbnail = res.url;
                console.log("✅ Uploaded to Cloudinary:", res.url);
            }
            onChange(updatedForm);
            onSave(updatedForm);
        } catch (error) {
            console.error("❌ Upload failed:", error);
        } finally {
            setUploading(false);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth>
            <DialogTitle>{isEdit ? "Chỉnh sửa bài học" : "Thêm bài học mới"}</DialogTitle>
            <DialogContent className="space-y-3 !mt-2">
                <TextField
                    fullWidth
                    label="Tên bài học"
                    value={form.title || ""}
                    onChange={(e) => onChange({ ...form, title: e.target.value })}
                    className="!mt-2"
                />
                <TextField
                    fullWidth
                    label="Mô tả"
                    multiline
                    rows={2}
                    value={form.description || ""}
                    onChange={(e) => onChange({ ...form, description: e.target.value })}
                />

                {/* Upload Thumbnail */}
                <Box className="flex flex-col gap-2">
                    <Box className="flex items-center gap-2">
                        <TextField
                            fullWidth
                            label="Ảnh Thumbnail (URL hoặc upload)"
                            value={form.thumbnail || ""}
                            onChange={(e) => onChange({ ...form, thumbnail: e.target.value })}
                        />
                        <IconButton component="label" color="primary">
                            <CloudUploadIcon />
                            <input
                                hidden
                                accept="image/*"
                                type="file"
                                onChange={handleFileSelect}
                            />
                        </IconButton>
                    </Box>

                    {preview && (
                        <Box className="relative border rounded-lg overflow-hidden">
                            <img
                                src={preview}
                                alt="Preview"
                                className="w-full max-h-56 object-cover"
                            />
                            <IconButton
                                color="error"
                                size="small"
                                sx={{ position: "absolute", top: 8, right: 8 }}
                                onClick={handleRemoveImage}
                            >
                                <DeleteIcon />
                            </IconButton>
                        </Box>
                    )}
                </Box>

                {/* Selects */}
                <FormControl fullWidth>
                    <InputLabel>Cấp độ</InputLabel>
                    <Select
                        value={form.level || "A1"}
                        label="Cấp độ"
                        onChange={(e) => onChange({ ...form, level: e.target.value as LessonManager["level"] })}
                    >
                        {["A1", "A2", "B1", "B2", "C1", "C2"].map((lvl) => (
                            <MenuItem key={lvl} value={lvl}>
                                {lvl}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <FormControl fullWidth>
                    <InputLabel>Phần</InputLabel>
                    <Select
                        value={form.part_type || 1}
                        label="Phần"
                        onChange={(e) => onChange({ ...form, part_type: e.target.value as LessonManager["part_type"] })}
                    >
                        {[1, 2, 3, 4, 5, 6, 7].map((part) => (
                            <MenuItem key={part} value={part}>
                                {`Part ${part}`}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <FormControl fullWidth>
                    <InputLabel>Trạng thái</InputLabel>
                    <Select
                        value={form.status || "draft"}
                        label="Trạng thái"
                        disabled={true}
                    >
                        <MenuItem value="approved">Đã duyệt</MenuItem>
                        <MenuItem value="pending">Chờ duyệt</MenuItem>
                        <MenuItem value="draft">Nháp</MenuItem>
                    </Select>
                </FormControl>

                <TextField
                    fullWidth
                    label="Thời gian hoàn thành (phút)"
                    type="number"
                    value={form.planned_completion_time || ""}
                    onChange={(e) => onChange({ ...form, planned_completion_time: Number(e.target.value) })}
                />

                {/* Weight - độ khó */}
                <Box>
                    <Typography variant="subtitle2" gutterBottom>
                        Độ khó (0 → dễ, 1 → khó)
                    </Typography>
                    <Box className="flex items-center gap-4">
                        <Slider
                            value={form.weight ?? 0}
                            min={0}
                            max={1}
                            step={0.01}
                            onChange={(_, val) =>
                                onChange({ ...form, weight: val as number })
                            }
                            valueLabelDisplay="auto"
                        />
                        <Typography variant="body2" sx={{ width: 40 }}>
                            {(form.weight ?? 0).toFixed(2)}
                        </Typography>
                    </Box>
                </Box>
            </DialogContent>

            <DialogActions>
                <Button onClick={onClose}>Hủy</Button>
                <Button
                    variant="contained"
                    onClick={handleSave}
                    disabled={uploading}
                    startIcon={uploading ? <CircularProgress size={16} color="inherit" /> : undefined}
                >
                    {uploading ? "Đang tải..." : "Lưu"}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default LessonManagerEditModal;
