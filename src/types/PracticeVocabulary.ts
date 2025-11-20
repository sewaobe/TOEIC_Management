export interface VocabularyWord {
  _id?: string;
  word: string;
  phonetic: string;
  type: string;
  definition_vi: string;
  definition_en: string;
  examples?: {
    en: string;
    vi: string;
  }[];
  image?: string;
  audio?: string;
  tags?: string[];
  notes?: string;
  created_at?: string;
  updated_at?: string;
}

export interface PracticeTopicVocabulary {
  _id?: string;
  id: string; // thêm để tương thích với useFetchList (bắt buộc)
  title: string;
  description: string;
  tags: string[];
  level: "A1" | "A2" | "B1" | "B2" | "C1" | "C2";
  iconName: string;
  bgColor: string;
  gradient: string;
  vocabulary_words: VocabularyWord[] | string[];
  isPublic: boolean;
  created_at?: string;
  created_by?: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  updated_at?: string;
}
