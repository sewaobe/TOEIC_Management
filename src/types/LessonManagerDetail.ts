import { LessonManager } from "./LessonManager";

// Type definitions
export interface Section {
    id: string;
    name: string;
    duration: number;
}

export interface Lesson {
    id: string;
    title: string;
    duration: number;
    sections: Section[];
}

export interface VocabularyTopic {
    id: string;
    title: string;
    word_count: number;
    words: string[];
}

export interface DictationScript {
    id: string;
    text: string;
}

export interface Dictation {
    id: string;
    title: string;
    difficulty: string;
    scripts: DictationScript[];
}

export interface ShadowingSentence {
    id: string;
    line: string;
}

export interface Shadowing {
    id: string;
    title: string;
    videoUrl: string;
    sentences: ShadowingSentence[];
}

export interface QuizQuestion {
    id: string;
    question: string;
}

export interface Quiz {
    id: string;
    title: string;
    questionCount: number;
    questions: QuizQuestion[];
}

export interface LessonManagerDetail extends LessonManager {
    topic_vocabulary_ids: VocabularyTopic[];
    lesson_ids: Lesson[];
    dictation_ids: Dictation[];
    shadowing_ids: Shadowing[];
    quiz_ids: Quiz[];
}