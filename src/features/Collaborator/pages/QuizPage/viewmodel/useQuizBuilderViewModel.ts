import { useState } from "react";

export function useQuizBuilderViewModel(initialData?: any) {
  const [quizTitle, setQuizTitle] = useState(initialData?.title || "");
  const [questions, setQuestions] = useState<any[]>(initialData?.question_ids || []);

  // 🟢 Khởi tạo lại dữ liệu từ quiz (dùng trong EditQuizPage)
  const initFromQuiz = (quiz: any) => {
    setQuizTitle(quiz.title || "");
    setQuestions(quiz.question_ids || []);
  };

  // ➕ Thêm câu hỏi mới
  const addQuestion = () => {
    setQuestions((prev) => [
      ...prev,
      {
        name: "",
        textQuestion: "",
        choices: { A: "", B: "", C: "", D: "" },
        correctAnswer: "",
        planned_time: 0,
        explanation: "",
        tags: [],
      },
    ]);
  };

  // 🗑️ Xóa câu hỏi theo index
  const removeQuestion = (index: number) => {
    setQuestions((prev) => prev.filter((_, i) => i !== index));
  };

  // 🔄 Cập nhật field trong 1 câu hỏi
  const updateQuestion = (index: number, field: string, value: any) => {
    setQuestions((prev) => {
      const updated = [...prev];
      updated[index][field] = value;
      return updated;
    });
  };

  return {
    quizTitle,
    setQuizTitle,
    questions,
    setQuestions,
    addQuestion,
    removeQuestion,
    updateQuestion,
    initFromQuiz,
  };
}
