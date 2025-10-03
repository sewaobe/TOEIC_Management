export interface VocabularyExample {
  en: string
  vi: string
}

export type PartType = "listening" | "reading"

export interface Vocabulary {
  id: number
  word: string
  phonetic: string
  type: string // noun, verb, adj, adv, etc.
  weight: number // 0-1
  definition: string
  examples: VocabularyExample[]
  image: string
  audio: string
  part_type: PartType
  tags: string[]
}

export interface VocabularyForm
  extends Omit<Vocabulary, "id"> {}
