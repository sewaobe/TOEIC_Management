// ==== Media (populate) ====
export interface Media {
  id: string;
  topic: string;
  url: string;
  type: string;        // "AUDIO" | "IMAGE"
  duration?: number;
  transcript: string;
  created_at: string;
  updated_at?: string;
}

// ==== Question (populate) ====
export interface Question {
  id: string;
  name: string;
  textQuestion: string;
  choices: Record<string, string>;
  correctAnswer: string;
  explanation: string;
  tags: string[];
  planned_time: number;
  choiceLabels?: string[];   // ông đang có cái này trong payload
  created_at: string;
  created_by?: string;
  updated_at?: string;
}

// ==== Group (populate) ====
export type GroupType = "TEST" | "QUIZ";

export interface Group {
  id: string;
  test_id?: string | null;
  part?: number | null;
  type: GroupType;
  audioUrl?: Media | null;    // populate luôn
  imagesUrl: Media[];         // populate luôn
  transcriptEnglish: string;
  transcriptTranslation: string;
  questions: Question[];      // populate luôn
  created_at: string;
  updated_at?: string;
}
