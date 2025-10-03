import { motion } from "framer-motion"
import { IconButton, Tooltip } from "@mui/material"
import { Edit, KeyboardArrowUp, Close } from "@mui/icons-material"

interface Props {
  editingId: number | null
  word: string
  onRestore: () => void
  onClose: () => void
}

const MinimizedDraftCard = ({ editingId, word, onRestore, onClose }: Props) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 100, scale: 0.8 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 100, scale: 0.8 }}
      className="fixed bottom-6 right-6 z-50"
    >
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onRestore}
        className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-2xl shadow-2xl cursor-pointer overflow-hidden"
        style={{ width: "320px" }}
      >
        <div className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 rounded-full p-2">
              <Edit className="text-white" fontSize="small" />
            </div>
            <div>
              <div className="font-bold text-sm">{editingId ? "Chỉnh sửa từ vựng" : "Thêm từ vựng mới"}</div>
              <div className="text-xs text-blue-100">{word || "Chưa có tên"}</div>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Tooltip title="Mở lại">
              <IconButton size="small" onClick={onRestore} sx={{ color: "white" }}>
                <KeyboardArrowUp />
              </IconButton>
            </Tooltip>
            <Tooltip title="Đóng">
              <IconButton
                size="small"
                onClick={(e) => {
                  e.stopPropagation()
                  onClose()
                }}
                sx={{ color: "white" }}
              >
                <Close fontSize="small" />
              </IconButton>
            </Tooltip>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default MinimizedDraftCard
