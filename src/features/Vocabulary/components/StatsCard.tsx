
import { motion } from "framer-motion"
import { Vocabulary } from "../../../types/Vocabulary"

interface Props {
  vocabulary: Vocabulary[]
}

const getLevelFromWeight = (weight: number) => {
  if (weight <= 0.33) return "Basic"
  if (weight <= 0.66) return "Intermediate"
  return "Advanced"
}

const StatsCards = ({ vocabulary }: Props) => {
  const total = vocabulary.length
  const basic = vocabulary.filter((v) => getLevelFromWeight(v.weight) === "Basic").length
  const intermediate = vocabulary.filter((v) => getLevelFromWeight(v.weight) === "Intermediate").length
  const advanced = vocabulary.filter((v) => getLevelFromWeight(v.weight) === "Advanced").length

  const cards = [
    {
      label: "Tổng số từ",
      value: total,
      gradient: "linear-gradient(135deg, #14B8A6 0%, #06B6D4 100%)",
    },
    {
      label: "Basic",
      value: basic,
      gradient: "linear-gradient(135deg, #10B981 0%, #059669 100%)",
    },
    {
      label: "Intermediate",
      value: intermediate,
      gradient: "linear-gradient(135deg, #F59E0B 0%, #D97706 100%)",
    },
    {
      label: "Advanced",
      value: advanced,
      gradient: "linear-gradient(135deg, #EF4444 0%, #DC2626 100%)",
    },
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      {cards.map((c, idx) => (
        <motion.div
          key={idx}
          whileHover={{ scale: 1.02, y: -4 }}
          transition={{ type: "spring", stiffness: 300 }}
          className="rounded-2xl p-4 shadow-lg cursor-pointer"
          style={{ background: c.gradient }}
        >
          <div className="text-sm font-medium text-white/80 mb-1">{c.label}</div>
          <div className="text-white text-3xl font-bold">{c.value}</div>
        </motion.div>
      ))}
    </div>
  )
}

export default StatsCards
