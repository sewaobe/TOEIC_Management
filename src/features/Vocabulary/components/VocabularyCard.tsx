import { motion } from "framer-motion"
import {
  IconButton,
  Tooltip,
  Chip,
} from "@mui/material"
import { Edit, Delete, VolumeUp } from "@mui/icons-material"
import { Vocabulary } from "../../../types/Vocabulary"

interface Props {
  vocab: Vocabulary
  index: number
  onEdit: (vocab: Vocabulary) => void
  onDelete: (id: number) => void
}

const getLevelFromWeight = (weight: number) => {
  if (weight <= 0.33) return "Basic"
  if (weight <= 0.66) return "Intermediate"
  return "Advanced"
}

const getLevelGradient = (weight: number) => {
  const level = getLevelFromWeight(weight)
  switch (level) {
    case "Basic":
      return "linear-gradient(135deg, #10B981 0%, #059669 100%)"
    case "Intermediate":
      return "linear-gradient(135deg, #F59E0B 0%, #D97706 100%)"
    case "Advanced":
      return "linear-gradient(135deg, #EF4444 0%, #DC2626 100%)"
    default:
      return "linear-gradient(135deg, #6B7280 0%, #4B5563 100%)"
  }
}

const VocabularyCard = ({ vocab, index, onEdit, onDelete }: Props) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ delay: index * 0.03 }}
      whileHover={{ y: -4, boxShadow: "0 20px 40px rgba(0,0,0,0.1)" }}
      layout
    >
      <div className="bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 h-full">
        <div
          className="h-2"
          style={{ background: getLevelGradient(vocab.weight) }}
        />

        {vocab.image && (
          <div className="relative h-48 overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
            <motion.img
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
              src={vocab.image || "/placeholder.svg"}
              alt={vocab.word}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 shadow-lg">
              <span className="text-xs font-bold text-gray-700">{vocab.word}</span>
            </div>
          </div>
        )}

        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="text-2xl font-bold text-gray-900">{vocab.word}</h3>
                <Tooltip title="Phát âm">
                  <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                    <IconButton size="small">
                      <VolumeUp className="text-teal-600" fontSize="small" />
                    </IconButton>
                  </motion.div>
                </Tooltip>
              </div>
              <span className="text-gray-500 text-sm font-mono">{vocab.phonetic}</span>
              <div className="flex items-center gap-2 mt-3 flex-wrap">
                <Chip
                  label={getLevelFromWeight(vocab.weight)}
                  size="small"
                  sx={{
                    background: getLevelGradient(vocab.weight),
                    color: "white",
                    fontWeight: 600,
                    fontSize: "0.75rem",
                  }}
                />
                <Chip label={vocab.type} size="small" variant="outlined" />
                <Chip
                  label={vocab.part_type}
                  size="small"
                  color={vocab.part_type === "listening" ? "primary" : "secondary"}
                />
              </div>
            </div>

            <div className="flex gap-1">
              <Tooltip title="Chỉnh sửa">
                <IconButton size="small" onClick={() => onEdit(vocab)}>
                  <Edit fontSize="small" />
                </IconButton>
              </Tooltip>
              <Tooltip title="Xóa">
                <IconButton size="small" onClick={() => onDelete(vocab.id)}>
                  <Delete fontSize="small" />
                </IconButton>
              </Tooltip>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-4 border border-gray-200">
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                Định nghĩa
              </div>
              <div className="text-base text-gray-900 font-medium">{vocab.definition}</div>
            </div>

            {vocab.examples.map((example, idx) => (
              <div
                key={idx}
                className="bg-gradient-to-br from-teal-50 to-cyan-50 rounded-xl p-4 border border-teal-200"
              >
                <div className="text-xs font-semibold text-teal-700 uppercase tracking-wide mb-2">
                  Ví dụ {vocab.examples.length > 1 ? idx + 1 : ""}
                </div>
                <div className="text-gray-900 italic mb-2 font-medium">{example.en}</div>
                <div className="text-gray-600 text-sm leading-relaxed">{example.vi}</div>
              </div>
            ))}

            {vocab.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {vocab.tags.map((tag, idx) => (
                  <Chip key={idx} label={tag} size="small" variant="outlined" color="primary" />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default VocabularyCard
