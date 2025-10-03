import { motion, AnimatePresence } from "framer-motion"
import VocabularyCard from "./VocabularyCard"
import { Vocabulary } from "../../../types/Vocabulary"

interface Props {
  vocabulary: Vocabulary[]
  searchQuery: string
  filterLevel: string
  viewMode: "list" | "grid"
  onEdit: (vocab: Vocabulary) => void
  onDelete: (id: number) => void
}

const getLevelFromWeight = (weight: number) => {
  if (weight <= 0.33) return "Basic"
  if (weight <= 0.66) return "Intermediate"
  return "Advanced"
}

const VocabularyList = ({
  vocabulary,
  searchQuery,
  filterLevel,
  viewMode,
  onEdit,
  onDelete,
}: Props) => {
  // lọc dữ liệu theo search + filter
  const filteredVocabulary = vocabulary.filter((vocab) => {
    const matchesSearch =
      vocab.word.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vocab.definition.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFilter = filterLevel === "All" || getLevelFromWeight(vocab.weight) === filterLevel
    return matchesSearch && matchesFilter
  })

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <AnimatePresence mode="wait">
        {filteredVocabulary.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="text-center py-16"
          >
            <div className="text-6xl mb-4">📚</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">Không tìm thấy từ vựng</h3>
            <p className="text-gray-500">Thử thay đổi bộ lọc hoặc thêm từ vựng mới</p>
          </motion.div>
        ) : (
          <div
            className={
              viewMode === "grid"
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                : "grid grid-cols-1 gap-4"
            }
          >
            {filteredVocabulary.map((vocab, index) => (
              <VocabularyCard
                key={vocab.id}
                vocab={vocab}
                index={index}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))}
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default VocabularyList
