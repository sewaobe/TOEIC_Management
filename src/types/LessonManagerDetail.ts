import { LessonSection } from "./lesson";
import { CERFLevel, LessonManager, PartType } from "./LessonManager";

export interface LessonTrailer {
    _id: string;
    title: string;
    part_type: PartType;
    summary: string;
    planned_completion_time: number;
    sections_id: LessonSection[];
}

export interface VocabularyTopicTrailer {
    _id: string;
    title: string;
    level: CERFLevel;
    iconName: string;
    vocabularies_id: {
        _id: string;
        word: string;
        definition: string;
    }[]
}

export interface DictationTrailer {
    _id: string;
    title: string;
    part_type: PartType;
    level: CERFLevel;
    duration: number;
    transcript: string;
    audio_url: string;
}

export interface ShadowingTrailer {
    _id: string;
    title: string;
    part_type: PartType;
    level: CERFLevel;
    duration: number;
    transcript: string;
    audio_url: string;
}

export interface QuizTrailer {
    _id: string;
    title: string;
    part_type: PartType;
    level: CERFLevel;
    planned_completion_time: number;
}

export interface LessonManagerDetail extends LessonManager {
    topic_vocabulary_ids: VocabularyTopicTrailer[];
    lesson_ids: LessonTrailer[];
    dictation_ids: DictationTrailer[];
    shadowing_ids: ShadowingTrailer[];
    quiz_ids: QuizTrailer[];
}