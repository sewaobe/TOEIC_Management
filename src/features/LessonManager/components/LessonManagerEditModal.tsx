import React, { useState } from "react";
import {
    Box,
    Button,
    Chip,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    IconButton,
    InputLabel,
    MenuItem,
    Select,
    TextField,
    Typography,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DeleteIcon from "@mui/icons-material/Delete";
import {
    CtvLessonManagerNodeRole,
    LessonManager,
    LessonManagerUnitType,
    NodeRoleLabel,
    UnitTypeLabel,
} from "../../../types/LessonManager";
import { uploadToCloudinary } from "../../../services/cloudinary.service";
import { toeicPartsArray } from "../../../utils/toeicPart";

interface Props {
    open: boolean;
    form: Partial<LessonManager>;
    onClose: () => void;
    onChange: (form: Partial<LessonManager>) => void;
    onSave: (finalForm?: Partial<LessonManager>) => void;
    isEdit?: boolean;
    readonly?: boolean;
}

const partOptions: LessonManager["part_type"][] = [1, 2, 3, 4, 5, 6, 7];
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

const LessonManagerEditModal: React.FC<Props> = ({
    open,
    form,
    onClose,
    onChange,
    onSave,
    isEdit = false,
    readonly = false,
}) => {
    const [preview, setPreview] = useState<string | null>(form.thumbnail || null);
    const [localFile, setLocalFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);

    React.useEffect(() => {
        if (!open) return;
        setPreview(form.thumbnail || null);
        setLocalFile(null);
    }, [open, form.thumbnail]);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || readonly) return;
        const localUrl = URL.createObjectURL(file);
        setLocalFile(file);
        setPreview(localUrl);
        onChange({ ...form, thumbnail: localUrl });
    };

    const handleRemoveImage = () => {
        if (readonly) return;
        setLocalFile(null);
        setPreview(null);
        onChange({ ...form, thumbnail: "" });
    };

    const handleSave = async () => {
        if (readonly) return;
        let updatedForm = { ...form };
        try {
            if (localFile) {
                setUploading(true);
                const res = await uploadToCloudinary(localFile);
                updatedForm.thumbnail = res.url;
            }
            onChange(updatedForm);
            onSave(updatedForm);
        } finally {
            setUploading(false);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
            <DialogTitle>{isEdit ? "Chỉnh sửa Lesson Manager" : "Thêm Lesson Manager"}</DialogTitle>
            <DialogContent className="space-y-3 !mt-2">
                <TextField
                    fullWidth
                    label="Tên bài học"
                    value={form.title || ""}
                    disabled={readonly}
                    onChange={(e) => onChange({ ...form, title: e.target.value })}
                    className="!mt-2"
                />
                <TextField
                    fullWidth
                    label="Mô tả"
                    multiline
                    rows={2}
                    value={form.description || ""}
                    disabled={readonly}
                    onChange={(e) => onChange({ ...form, description: e.target.value })}
                />

                <Box className="flex flex-col gap-2">
                    <Box className="flex items-center gap-2">
                        <TextField
                            fullWidth
                            label="Ảnh thumbnail"
                            value={form.thumbnail || ""}
                            disabled={readonly}
                            onChange={(e) => onChange({ ...form, thumbnail: e.target.value })}
                        />
                        <IconButton component="label" color="primary" disabled={readonly}>
                            <CloudUploadIcon />
                            <input hidden accept="image/*" type="file" onChange={handleFileSelect} />
                        </IconButton>
                    </Box>

                    {preview && (
                        <Box className="relative border rounded-lg overflow-hidden !my-2">
                            <img src={preview} alt="Preview" className="w-full max-h-56 object-cover" />
                            <IconButton
                                color="error"
                                size="small"
                                disabled={readonly}
                                sx={{ position: "absolute", top: 8, right: 8 }}
                                onClick={handleRemoveImage}
                            >
                                <DeleteIcon />
                            </IconButton>
                        </Box>
                    )}
                </Box>

                <Box className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <FormControl fullWidth>
                        <InputLabel>Phần</InputLabel>
                        <Select
                            value={form.part_type || 1}
                            label="Phần"
                            disabled={readonly}
                            onChange={(e) =>
                                onChange({ ...form, part_type: e.target.value as LessonManager["part_type"] })
                            }
                        >
                            {partOptions.map((part) => (
                                <MenuItem key={part} value={part}>{`Part ${part}`}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <FormControl fullWidth>
                        <InputLabel>Loại unit</InputLabel>
                        <Select
                            value={form.unit_type || "foundation"}
                            label="Loại unit"
                            disabled={readonly}
                            onChange={(e) =>
                                onChange({ ...form, unit_type: e.target.value as LessonManagerUnitType })
                            }
                        >
                            {unitTypeOptions.map((type) => (
                                <MenuItem key={type} value={type}>{UnitTypeLabel[type]}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Box>

                <Box className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <TextField
                        fullWidth
                        label="Score từ"
                        type="number"
                        value={form.score_band?.from ?? 200}
                        disabled={readonly}
                        onChange={(e) =>
                            onChange({
                                ...form,
                                score_band: { from: Number(e.target.value), to: form.score_band?.to ?? 250 },
                            })
                        }
                    />
                    <TextField
                        fullWidth
                        label="Score đến"
                        type="number"
                        value={form.score_band?.to ?? 250}
                        disabled={readonly}
                        onChange={(e) =>
                            onChange({
                                ...form,
                                score_band: { from: form.score_band?.from ?? 200, to: Number(e.target.value) },
                            })
                        }
                    />
                    <FormControl fullWidth>
                        <InputLabel>Vai trò node</InputLabel>
                        <Select
                            value={form.node_role || "normal"}
                            label="Vai trò node"
                            disabled={readonly}
                            onChange={(e) =>
                                onChange({ ...form, node_role: e.target.value as CtvLessonManagerNodeRole })
                            }
                        >
                            {nodeRoleOptions.map((role) => (
                                <MenuItem key={role} value={role}>{NodeRoleLabel[role]}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Box>

                <FormControl fullWidth>
                    <InputLabel>Target tags</InputLabel>
                    <Select
                        multiple
                        value={form.target_tags || []}
                        label="Target tags"
                        disabled={readonly}
                        onChange={(e) =>
                            onChange({
                                ...form,
                                target_tags:
                                    typeof e.target.value === "string"
                                        ? e.target.value.split(",")
                                        : (e.target.value as string[]),
                            })
                        }
                        renderValue={(selected) => (
                            <Box className="flex flex-wrap gap-1">
                                {(selected as string[]).map((tag) => (
                                    <Chip key={tag} label={tag} size="small" />
                                ))}
                            </Box>
                        )}
                    >
                        {targetTagOptions.map((tag) => (
                            <MenuItem key={tag} value={tag}>{tag}</MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <Box className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <TextField
                        fullWidth
                        label="Thời gian hoàn thành"
                        value={`${form.planned_completion_time ?? 0} phút`}
                        InputProps={{ readOnly: true }}
                    />
                    <TextField
                        fullWidth
                        label="Weight"
                        value={(form.weight ?? 0).toFixed(3)}
                        InputProps={{ readOnly: true }}
                    />
                </Box>

                {readonly && (
                    <Typography variant="body2" color="text.secondary">
                        Lesson Manager ở trạng thái này chỉ được xem, không thể chỉnh sửa.
                    </Typography>
                )}
            </DialogContent>

            <DialogActions>
                <Button onClick={onClose}>Đóng</Button>
                {!readonly && (
                    <Button
                        variant="contained"
                        onClick={handleSave}
                        disabled={uploading}
                        startIcon={uploading ? <CircularProgress size={16} color="inherit" /> : undefined}
                    >
                        {uploading ? "Đang tải..." : "Lưu"}
                    </Button>
                )}
            </DialogActions>
        </Dialog>
    );
};

export default LessonManagerEditModal;
