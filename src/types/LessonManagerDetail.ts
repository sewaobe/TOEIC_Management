import { Dictation } from "./Dictation";
import { LessonSection } from "./lesson";
import { CERFLevel, LessonManager, LessonManagerGraphNode, PartType } from "./LessonManager";
import { Shadowing } from "./Shadowing";

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
    bgColor: string;
    description: string;
    gradient: string;
    vocabularies_id: {
        _id: string;
        word: string;
        definition: string;
    }[]
}

export interface QuizTrailer {
    _id: string;
    title: string;
    part_type: PartType;
    level: CERFLevel;
    planned_completion_time: number;
    question_ids: {
        _id: string;
        name: string;
        textQuestion: string;
        choices: Map<string, string>;
        correctAnswer: string;
    }[]
}

export interface LessonManagerDetail
    extends Omit<
        LessonManager,
        | "topic_vocabulary_ids"
        | "lesson_ids"
        | "dictation_ids"
        | "shadowing_ids"
        | "quiz_ids"
        | "next_unit_ids"
        | "prerequisite_unit_ids"
        | "auxiliary_unit_ids"
    > {
    topic_vocabulary_ids: VocabularyTopicTrailer[];
    lesson_ids: LessonTrailer[];
    dictation_ids: Dictation[];
    shadowing_ids: Shadowing[];
    quiz_ids: QuizTrailer[];
    next_unit_ids: LessonManagerGraphNode[];
    prerequisite_unit_ids: LessonManagerGraphNode[];
    auxiliary_unit_ids: LessonManagerGraphNode[];
}
