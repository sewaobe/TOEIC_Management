import { useEffect, useState } from "react"
import { VocabularyForm } from "../types/Vocabulary"

const defaultForm: VocabularyForm = {
  word: "",
  phonetic: "",
  type: "noun",
  weight: 0.5,
  definition: "",
  examples: [{ en: "", vi: "" }],
  image: "",
  audio: "",
  part_type: "listening",
  tags: [],
}

export function useVocabularyForm(initial?: VocabularyForm) {
  const [formData, setFormData] = useState<VocabularyForm>(initial || defaultForm)
  const [isDirty, setIsDirty] = useState(false)

  useEffect(() => {
    const hasData =
      formData.word ||
      formData.phonetic ||
      formData.definition ||
      formData.examples.some((ex) => ex.en || ex.vi) ||
      formData.image ||
      formData.audio ||
      formData.tags.length > 0

    setIsDirty(!!hasData)
  }, [formData])

  const resetForm = () => setFormData(defaultForm)

  return { formData, setFormData, resetForm, isDirty }
}
