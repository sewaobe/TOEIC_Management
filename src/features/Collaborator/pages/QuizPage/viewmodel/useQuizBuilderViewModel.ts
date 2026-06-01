import { useState } from "react";
import {
  getTargetQuestionCountForPart,
  validateQuestionCountForPart,
} from "../quizPartRules";

export function useQuizBuilderViewModel(initialData?: any) {
  const [quizTitle, setQuizTitle] = useState(initialData?.title || "");
  const [questions, setQuestions] = useState<any[]>(initialData?.question_ids || []);

  const createQuestion = (index: number) => ({
    name: `Question ${index + 1}`,
    textQuestion: "",
    choices: { A: "", B: "", C: "", D: "" },
    correctAnswer: "",
    planned_time: 0,
    explanation: "",
    tags: [],
  });

  // 🟢 Khởi tạo lại dữ liệu từ quiz (dùng trong EditQuizPage)
  const initFromQuiz = (quiz: any) => {
    setQuizTitle(quiz.title || "");
    setQuestions(quiz.question_ids || []);
  };

  // ➕ Thêm câu hỏi mới
  const addQuestion = () => {
    setQuestions((prev) => [
      ...prev,
      createQuestion(prev.length),
    ]);
  };

  const setQuestionCount = (count: number) => {
    setQuestions((prev) => {
      if (count <= prev.length) return prev.slice(0, count);

      const next = [...prev];
      for (let i = prev.length; i < count; i++) {
        next.push(createQuestion(i));
      }
      return next;
    });
  };

  const ensureQuestionCountForPart = (partType: number | string) => {
    const targetCount = getTargetQuestionCountForPart(partType);
    if (targetCount) setQuestionCount(targetCount);
  };

  // 🗑️ Xóa câu hỏi theo index
  const removeQuestion = (index: number) => {
    setQuestions((prev) => prev.filter((_, i) => i !== index));
  };

  // 🔄 Cập nhật field trong 1 câu hỏi
  const updateQuestion = (index: number, field: string, value: any) => {
    setQuestions((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  return {
    quizTitle,
    setQuizTitle,
    questions,
    setQuestions,
    addQuestion,
    setQuestionCount,
    ensureQuestionCountForPart,
    validateQuestionCountForPart: (partType: number | string) =>
      validateQuestionCountForPart(partType, questions.length),
    removeQuestion,
    updateQuestion,
    initFromQuiz,
  };
}
