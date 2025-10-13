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
  Image as ImageIcon,
  AudioFile,
  Fullscreen,
  FullscreenExit,
  Close,
} from "@mui/icons-material"
import { motion } from "framer-motion"
import {  VocabularyForm } from "../../../types/Vocabulary"

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
          <div className="mt-4 mx-2">
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
                { value: 0, label: "Easy" },
                { value: 0.33, label: "Basic" },
                { value: 0.66, label: "Intermediate" },
                { value: 1, label: "Advanced" },
              ]}
              valueLabelDisplay="auto"
              valueLabelFormat={(v) => v.toFixed(2)}
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* URL Hình ảnh hoặc upload file */}
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
            <Button
              variant="outlined"
              component="label"
              startIcon={<ImageIcon />}
            >
              Tải ảnh từ máy
              <input
                type="file"
                accept="image/*"
                hidden
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const localUrl = URL.createObjectURL(file);
                    onChange({ ...formData, image: localUrl }); // preview ngay
                  }
                }}
              />
            </Button>

            {/* URL Âm thanh hoặc upload file */}
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
            <Button
              variant="outlined"
              component="label"
              startIcon={<AudioFile />}
            >
              Tải âm thanh từ máy
              <input
                type="file"
                accept="audio/*"
                hidden
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const localUrl = URL.createObjectURL(file);
                    onChange({ ...formData, audio: localUrl }); // preview ngay
                  }
                }}
              />
            </Button>
          </div>

          {/* Preview hình ảnh */}
          {formData.image && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4">
              <p className="text-sm font-semibold text-gray-700 mb-2">Xem trước hình ảnh:</p>
              <div className="relative h-48 rounded-xl overflow-hidden border-2 border-gray-300">
                <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
              </div>
            </motion.div>
          )}

          {/* Preview âm thanh */}
          {formData.audio && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4">
              <p className="text-sm font-semibold text-gray-700 mb-2">Nghe thử âm thanh:</p>
              <audio controls src={formData.audio} className="w-full" />
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
              value.map((option, index) => {
                const { key, ...chipProps } = getTagProps({ index }) // tách key
                return <Chip key={key} label={option} color="primary" {...chipProps} />
              })
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
