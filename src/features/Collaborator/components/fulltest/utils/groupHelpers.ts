// ===============================
// 🧩 groupHelpers.ts
// Logic tạo câu hỏi và nhóm rỗng
// ===============================

let questionCounter = 1;

export const resetQuestionCounter = () => {
  questionCounter = 1;
};

// ✅ Tạo câu hỏi mặc định theo Part
export const makeEmptyQuestion = (part: number) => {
  const defaultChoices =
    part === 2
      ? { A: "A.", B: "B.", C: "C." }
      : part === 1
      ? { A: "A.", B: "B.", C: "C.", D: "D." }
      : { A: "", B: "", C: "", D: "" };

  const question = {
    name: `Question ${questionCounter}`,
    textQuestion: "",
    choices: defaultChoices,
    correctAnswer: "",
    planned_time: 0,
    explanation: "",
    tags: [],
    choiceLabels: part === 2 ? ["A", "B", "C"] : ["A", "B", "C", "D"],
  };
  questionCounter++;
  return question;
};

// ✅ Tạo group rỗng theo Part
export const makeEmptyGroup = (part: number, size: number) => ({
  type: "TEST",
  part,
  transcriptEnglish: "",
  transcriptTranslation: "",
  audioUrl: null,
  imagesUrl: [],
  questions: Array.from({ length: size }, () => makeEmptyQuestion(part)),
});

// ✅ Tạo sẵn group mặc định theo từng Part
export const initGroups = (partIdx: number) => {
  const part = partIdx + 1;
  switch (part) {
    case 1:
      return Array.from({ length: 6 }, () => makeEmptyGroup(1, 1));
    case 2:
      return Array.from({ length: 25 }, () => makeEmptyGroup(2, 1));
    case 3:
      return Array.from({ length: 13 }, () => makeEmptyGroup(3, 3));
    case 4:
      return Array.from({ length: 10 }, () => makeEmptyGroup(4, 3));
    case 5:
      return Array.from({ length: 30 }, () => makeEmptyGroup(5, 1));
    case 6:
      return Array.from({ length: 4 }, () => makeEmptyGroup(6, 4));
    case 7:
      return [];
    default:
      return [];
  }
};
