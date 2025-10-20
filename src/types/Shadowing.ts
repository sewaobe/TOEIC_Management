import { Timing } from "./Dictation";

export type Shadowing = {
    _id?: string;
    topic?: string[];
    title: string;
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