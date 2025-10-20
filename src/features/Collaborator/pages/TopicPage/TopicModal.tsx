import {
    Dialog, DialogTitle, DialogContent, DialogActions,
    Button, IconButton, TextField,
    MenuItem,
    Autocomplete
} from "@mui/material"
import { motion } from "framer-motion"
import CloseIcon from "@mui/icons-material/Close"
import { Book as BookIcon } from "@mui/icons-material"
import { levelOptions, Topic } from "../../../../types/Topic"
import { getIconInfoByName, mapBgToIconColor } from "../../../../utils/colorMapFromBg"
import { useEffect, useState } from "react"
import { lessonManagerService } from "../../../../services/lesson_manager.service"

interface TopicModalProps {
    open: boolean
    onClose: () => void
    onSave: () => void
    formData: Topic
    setFormData: React.Dispatch<React.SetStateAction<Topic>>
    availableIcons: { name: string; icon: any; bgColor: string }[]
    gradientOptions: { name: string; value: string }[]
    title: string
}

export default function TopicModal({
    open, onClose, onSave,
    formData, setFormData,
    availableIcons, gradientOptions,
    title
}: TopicModalProps) {
    const iconFormData = getIconInfoByName(formData.iconName);
    const [topicTitles, setTopicTitles] = useState<{ id: string; title: string }[]>([]);

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

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle className="flex items-center justify-between border-b border-gray-200 pb-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                        <BookIcon className="text-white" sx={{ fontSize: 24 }} />
                    </div>
                    <span className="text-xl font-bold text-gray-900">{title}</span>
                </div>
                <IconButton onClick={onClose} size="small"><CloseIcon /></IconButton>
            </DialogTitle>

            <DialogContent className="pt-6 space-y-4">
                {/* Title */}
                <TextField
                    fullWidth label="Tên chủ đề"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    className="!mt-4"
                />

                {/* Description */}
                <TextField
                    fullWidth multiline rows={3}
                    label="Mô tả" value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                />

                {/* Level topic */}
                <TextField
                    select
                    fullWidth
                    label="Cấp độ (Level)"
                    value={formData.level || "A1"} // default A1
                    onChange={(e) =>
                        setFormData((prev) => ({
                            ...prev,
                            level: e.target.value,
                        }))
                    }
                >
                    {levelOptions.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                            {option.label}
                        </MenuItem>
                    ))}
                </TextField>

                <Autocomplete
                    multiple
                    options={topicTitles}
                    getOptionLabel={(option) => option.title}
                    getOptionKey={(option) => option.id}
                    renderInput={(params) => (
                        <TextField {...params} label="Chủ đề bài nghe" placeholder="Chọn chủ đề" />
                    )}
                    value={topicTitles.filter(t => formData.topic?.includes(t.id))}
                    onChange={(event, newValue) => {
                        setFormData({
                            ...formData,
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
                            maxWidth: "100%", // ✅ Giới hạn chiều ngang gọn gàng
                            '&::-webkit-scrollbar': {
                                height: 6,
                            },
                            '&::-webkit-scrollbar-thumb': {
                                backgroundColor: 'transparent',
                                borderRadius: 3,
                            },
                            '&:hover::-webkit-scrollbar-thumb': {
                                backgroundColor: '#bbb', // Chỉ hiện khi hover
                            },
                            '& input': {
                                minWidth: 120, // Giúp placeholder không bị ép
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
                                        offset: [0, 4], // ✅ cách khung input 4px cho tự nhiên
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

                {/* Icons */}
                <label className="block text-sm font-semibold text-gray-700">Chọn biểu tượng</label>
                <div className="grid grid-cols-6 gap-2">
                    {availableIcons.map((iconItem, index) => {
                        const IconComp = iconItem.icon
                        return (
                            <motion.button
                                key={index}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setFormData(prev => ({
                                    ...prev,
                                    iconName: iconItem.name,
                                    bgColor: iconItem.bgColor
                                }))}
                                className={`w-12 h-12 rounded-xl flex items-center justify-center ${formData.iconName === iconItem.name
                                    ? "bg-blue-500 shadow-lg ring-2 ring-blue-300"
                                    : "bg-gray-100 hover:bg-gray-200"
                                    }`}
                            >
                                <IconComp
                                    className={formData.iconName === iconItem.name ? "text-white" : mapBgToIconColor(iconItem.bgColor)}
                                    sx={{ fontSize: 24 }}
                                />
                            </motion.button>
                        )
                    })}
                </div>

                {/* Gradient */}
                <label className="block text-sm font-semibold text-gray-700">Chọn màu gradient</label>
                <div className="grid grid-cols-4 gap-2">
                    {gradientOptions.map((gradient, index) => (
                        <motion.button
                            key={index}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setFormData(prev => ({ ...prev, gradient: gradient.value }))}
                            className={`h-12 rounded-xl bg-gradient-to-br ${gradient.value} ${formData.gradient === gradient.value ? "ring-4 ring-offset-2 ring-blue-300" : ""
                                }`}
                        />
                    ))}
                </div>

                {/* Preview */}
                <div className="mt-6 p-4 bg-gray-50 rounded-xl">
                    <p className="text-xs font-semibold text-gray-600 mb-3">Xem trước</p>
                    <div className={`h-24 bg-gradient-to-br ${formData.gradient} rounded-xl relative`}>
                        <div className="absolute bottom-3 left-3">
                            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-lg">
                                {iconFormData && <iconFormData.icon className={mapBgToIconColor(formData.bgColor)} sx={{ fontSize: 24 }} />}
                            </div>
                        </div>
                    </div>
                    <div className="mt-3">
                        <h4 className="font-bold text-gray-900">{formData.title || "Tên chủ đề"}</h4>
                        <p className="text-sm text-gray-600 mt-1">{formData.description || "Mô tả chủ đề"}</p>
                    </div>
                </div>
            </DialogContent>

            <DialogActions>
                <Button onClick={onClose} variant="outlined">Hủy</Button>
                <Button
                    onClick={onSave}
                    variant="contained"
                    disabled={!formData.title || !formData.description}
                >
                    Lưu
                </Button>
            </DialogActions>
        </Dialog>
    )
}
