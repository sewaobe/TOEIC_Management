import { useState } from "react";

export function useQuizBuilderViewModel(initialData?: any) {
  const [quizTitle, setQuizTitle] = useState(initialData?.title || "");
  const [groups, setGroups] = useState<any[]>(initialData?.groups || []);

  // 🟢 Hàm khởi tạo lại dữ liệu từ quiz (dùng trong EditQuizPage)
  const initFromQuiz = (quiz: any) => {
    setQuizTitle(quiz.title || "");
    setGroups(quiz.group_ids || []); // ⚙️ Đồng bộ field với backend
  };

  // ➕ Thêm group mới
  const addGroup = () => {
    setGroups((prev) => [
      ...prev,
      {
        part: 0,
        audioUrl: null,
        imagesUrl: [],
        transcriptEnglish: "",
        transcriptTranslation: "",
        questions: [
          {
            name: "",
            textQuestion: "",
            choices: { A: "", B: "", C: "", D: "" },
            correctAnswer: "",
            planned_time: 0,
            explanation: "",
            tags: [],
          },
        ],
      },
    ]);
  };

  // 🗑️ Xóa group theo index
  const removeGroup = (groupIndex: number) => {
    setGroups((prev) => prev.filter((_, i) => i !== groupIndex));
  };

  // ➕ Thêm câu hỏi trong group
  const addQuestion = (groupIndex: number) => {
    setGroups((prev) => {
      const updated = [...prev];
      updated[groupIndex].questions.push({
        name: "",
        textQuestion: "",
        choices: { A: "", B: "", C: "", D: "" },
        correctAnswer: "",
        planned_time: 0,
        explanation: "",
        tags: [],
      });
      return updated;
    });
  };

  // 🗑️ Xóa câu hỏi
  const removeQuestion = (groupIndex: number, questionIndex: number) => {
    setGroups((prev) => {
      const updated = [...prev];
      updated[groupIndex].questions.splice(questionIndex, 1);
      return updated;
    });
  };

  // 🔄 Cập nhật field của group
  const updateGroup = (groupIndex: number, field: string, value: any) => {
    setGroups((prev) => {
      const updated = [...prev];
      updated[groupIndex][field] = value;
      return updated;
    });
  };

  // 🔄 Cập nhật field của câu hỏi
  const updateQuestion = (
    groupIndex: number,
    questionIndex: number,
    field: string,
    value: any
  ) => {
    setGroups((prev) => {
      const updated = [...prev];
      updated[groupIndex].questions[questionIndex][field] = value;
      return updated;
    });
  };

  return {
    quizTitle,
    setQuizTitle,
    groups,
    setGroups,
    addGroup,
    removeGroup,
    addQuestion,
    removeQuestion,
    updateGroup,
    updateQuestion,
    initFromQuiz, // ✅ thêm để dùng trong EditQuizPage
  };
}
