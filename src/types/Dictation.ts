export type WordTiming = { word: string; start: number; end: number };
export type Timing = {
    text: string;
    startTime: number;
    endTime: number;
    words?: WordTiming[];
};
export type Dictation = {
    _id?: string;
    topic: string;
    part_type?: number;
    level: string;
    transcript: string;
    audio_url?: string;
    audio_path?: string;
    duration?: number;
    timings?: Timing[];
    display_mode: "sentence" | "word";
    created_at?: string;
    updated_at?: string;
};