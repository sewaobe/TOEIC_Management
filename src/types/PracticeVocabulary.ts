export interface VocabularyWord {
  _id?: string;
  word: string;
  phonetic?: string;
  type?: string;
  definitions: string[]; // Nhiều định nghĩa
  hints?: string[]; // Nhiều gợi ý
  examples?: string[]; // Ví dụ đơn giản (mảng string)
  image?: string;
  audio?: string;
  tags?: string[]; // Tags từ toeicPart
  level?: string; // CERF level
  part?: string; // TOEIC Part
  notes?: string;
  created_at?: string;
  updated_at?: string;
}

export interface PracticeTopicVocabulary {
  _id?: string;
  id: string; // thêm để tương thích với useFetchList (bắt buộc)
  title: string;
  description?: string;
  tags?: string[];
  level?: "A1" | "A2" | "B1" | "B2" | "C1" | "C2";
  vocabulary_words: VocabularyWord[] | string[];
  created_at?: string;
  created_by?: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  updated_at?: string;
}
