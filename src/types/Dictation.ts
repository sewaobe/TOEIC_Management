// TODO: Đã bỏ WordTiming và words trong Timing
// export type WordTiming = { word: string; start: number; end: number };
// export type Timing = {
//     text: string;
//     startTime: number;
//     endTime: number;
//     words?: WordTiming[];
// };

export type Dictation = {
  _id?: string;
  topic?: string[];
  title: string;
  part_type?: number;
  level: string;
  transcript: string;
  duration?: number;
  // TODO: Đã bỏ audio_url, timings theo yêu cầu
  // audio_url?: string;
  // audio_path?: string;
  // timings?: Timing[];
  display_mode: "sentence" | "word";
  status?: string;
  weight?: number;
  created_at?: string;
  updated_at?: string;
};
