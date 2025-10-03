export interface Topic {
  id: string
  title: string
  description: string
  level: string
  wordCount: number
  learnerCount: number
  iconName: string
  gradient: string
  bgColor: string
  new: boolean
  createdAt: string
  updatedAt: string
}

export const levelOptions = [
  { value: "A1", label: "A1 (0 - 199 điểm)" },
  { value: "A2", label: "A2 (200 - 399 điểm)" },
  { value: "B1", label: "B1 (400 - 599 điểm)" },
  { value: "B2", label: "B2 (600 - 799 điểm)" },
  { value: "C1", label: "C1 (800 - 899 điểm)" },
  { value: "C2", label: "C2 (900 - 990 điểm)" },
]

export interface TopicInfo {
  id: string
  name: string
  description: string
  totalLearner: number
  totalWords: number
  totalBasic: number
  totalIntermediate: number
  totalAdvance: number
}