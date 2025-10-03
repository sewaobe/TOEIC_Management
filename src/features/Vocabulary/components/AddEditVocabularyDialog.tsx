import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  MenuItem,
  InputAdornment,
  Slider,
  IconButton,
  Chip,
  Autocomplete,
  Tooltip,
} from "@mui/material"
import {
  AddCircleOutline,
  RemoveCircleOutline,
  Image as ImageIcon,
  AudioFile,
  Minimize,
  Fullscreen,
  FullscreenExit,
  Close,
} from "@mui/icons-material"
import { motion } from "framer-motion"
import { VocabularyExample, VocabularyForm } from "../../../types/Vocabulary"

interface Props {
  open: boolean
  mode: "add" | "edit"
  formData: VocabularyForm
  onChange: (data: VocabularyForm) => void
  onSave: () => void
  onClose: () => void
  modalState: "normal" | "fullscreen"
  setModalState: (s: "normal" | "fullscreen") => void
  wordTypes: string[]
  commonTags: string[]
}

const getLevelFromWeight = (weight: number) => {
  if (weight <= 0.33) return "Basic"
  if (weight <= 0.66) return "Intermediate"
  return "Advanced"
}

const AddEditVocabularyDialog = ({
  open,
  mode,
  formData,
  onChange,
  onSave,
  onClose,
  modalState,
  setModalState,
  wordTypes,
  commonTags,
}: Props) => {
  const updateExample = (index: number, field: keyof VocabularyExample, value: string) => {
    const newExamples = [...formData.examples]
    newExamples[index][field] = value
    onChange({ ...formData, examples: newExamples })
  }

  const addExample = () => {
    onChange({ ...formData, examples: [...formData.examples, { en: "", vi: "" }] })
  }

  const removeExample = (index: number) => {
    if (formData.examples.length > 1) {
      onChange({ ...formData, examples: formData.examples.filter((_, i) => i !== index) })
    }
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={modalState === "fullscreen" ? false : "lg"}
      fullWidth={modalState !== "fullscreen"}
      fullScreen={modalState === "fullscreen"}
      PaperProps={{
        sx: {
          borderRadius: modalState === "fullscreen" ? 0 : 4,
          maxHeight: modalState === "fullscreen" ? "100vh" : "90vh",
        },
      }}
    >
      <DialogTitle sx={{ background: "#2563EB", color: "white", py: 3 }}>
        <div className="flex items-center justify-between">
          <span className="text-xl font-bold">
            {mode === "edit" ? "Chỉnh sửa từ vựng" : "Thêm từ vựng mới"}
          </span>
          <div className="flex items-center gap-1">
            <Tooltip title={modalState === "fullscreen" ? "Thu nhỏ" : "Toàn màn hình"}>
              <IconButton
                onClick={() => setModalState(modalState === "fullscreen" ? "normal" : "fullscreen")}
                size="small"
                sx={{ color: "white" }}
              >
                {modalState === "fullscreen" ? <FullscreenExit /> : <Fullscreen />}
              </IconButton>
            </Tooltip>
            <Tooltip title="Đóng">
              <IconButton onClick={onClose} size="small" sx={{ color: "white" }}>
                <Close />
              </IconButton>
            </Tooltip>
          </div>
        </div>
      </DialogTitle>

      <DialogContent
        className="mt-6"
        sx={{
          overflowY: "auto",
          pt: 4,
        }}
      >
        <div className="space-y-6">
          {/* Từ, phiên âm, loại */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TextField
              fullWidth
              label="Từ vựng *"
              margin="normal"
              value={formData.word}
              onChange={(e) => onChange({ ...formData, word: e.target.value })}
            />
            <TextField
              fullWidth
              label="Phiên âm"
              margin="normal"
              value={formData.phonetic}
              onChange={(e) => onChange({ ...formData, phonetic: e.target.value })}
              placeholder="/ˈeksəmpl/"
            />
            <TextField
              fullWidth
              select
              label="Loại từ *"
              value={formData.type}
              onChange={(e) => onChange({ ...formData, type: e.target.value })}
            >
              {wordTypes.map((type) => (
                <MenuItem key={type} value={type}>
                  {type}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              fullWidth
              select
              label="Phân loại *"
              value={formData.part_type}
              onChange={(e) => onChange({ ...formData, part_type: e.target.value as "listening" | "reading" })}
            >
              <MenuItem value="listening">Listening</MenuItem>
              <MenuItem value="reading">Reading</MenuItem>
            </TextField>
          </div>

          {/* Slider độ khó */}
          <div className="mt-4">
            <label className="text-sm font-semibold text-gray-700 mb-2 block">
              Độ khó: {getLevelFromWeight(formData.weight)}
            </label>
            <Slider
              value={formData.weight}
              onChange={(e, value) => onChange({ ...formData, weight: value as number })}
              min={0}
              max={1}
              step={0.01}
              marks={[
                { value: 0, label: "Dễ" },
                { value: 0.33, label: "Basic" },
                { value: 0.66, label: "Intermediate" },
                { value: 1, label: "Khó" },
              ]}
            />
          </div>

          {/* Định nghĩa */}
          <TextField
            fullWidth
            label="Định nghĩa *"
            value={formData.definition}
            onChange={(e) => onChange({ ...formData, definition: e.target.value })}
            multiline
            rows={3}
          />

          {/* Ví dụ */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-gray-900">Ví dụ minh họa</h3>
              <Button size="small" startIcon={<AddCircleOutline />} onClick={addExample}>
                Thêm ví dụ
              </Button>
            </div>
            {formData.examples.map((example, index) => (
              <div key={index} className="bg-gray-50 rounded-xl p-4 border border-gray-200 mb-3">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-semibold">Ví dụ {index + 1}</span>
                  {formData.examples.length > 1 && (
                    <IconButton size="small" onClick={() => removeExample(index)}>
                      <RemoveCircleOutline fontSize="small" />
                    </IconButton>
                  )}
                </div>
                <TextField
                  fullWidth
                  label="Câu tiếng Anh"
                  value={example.en}
                  onChange={(e) => updateExample(index, "en", e.target.value)}
                  multiline
                  rows={2}
                  sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth
                  label="Dịch tiếng Việt"
                  value={example.vi}
                  onChange={(e) => updateExample(index, "vi", e.target.value)}
                  multiline
                  rows={2}
                />
              </div>
            ))}
          </div>

          {/* Media */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TextField
              fullWidth
              label="URL Hình ảnh"
              value={formData.image}
              onChange={(e) => onChange({ ...formData, image: e.target.value })}
              placeholder="https://example.com/image.jpg"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <ImageIcon />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              fullWidth
              label="URL Âm thanh"
              value={formData.audio}
              onChange={(e) => onChange({ ...formData, audio: e.target.value })}
              placeholder="https://example.com/audio.mp3"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <AudioFile />
                  </InputAdornment>
                ),
              }}
            />
          </div>
          {formData.image && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4">
              <p className="text-sm font-semibold text-gray-700 mb-2">Xem trước hình ảnh:</p>
              <div className="relative h-48 rounded-xl overflow-hidden border-2 border-gray-300">
                <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
              </div>
            </motion.div>
          )}

          {/* Tags */}
          <Autocomplete
            multiple
            options={commonTags}
            value={formData.tags}
            onChange={(e, newValue) => onChange({ ...formData, tags: newValue })}
            freeSolo
            renderTags={(value, getTagProps) =>
              value.map((option, index) => (
                <Chip label={option} {...getTagProps({ index })} color="primary" />
              ))
            }
            renderInput={(params) => <TextField {...params} placeholder="Chọn hoặc nhập tags..." />}
          />
        </div>
      </DialogContent>

      <DialogActions className="border-t px-6 py-4 bg-gray-50">
        <Button onClick={onClose}>Hủy</Button>
        <Button variant="contained" onClick={onSave}>
          {mode === "edit" ? "Cập nhật" : "Thêm mới"}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default AddEditVocabularyDialog
