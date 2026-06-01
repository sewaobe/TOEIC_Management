export const TOEIC_PARTS = [1, 2, 3, 4, 5, 6, 7] as const;

export const getQuestionCountRuleText = (partType?: number | string) => {
  const part = Number(partType);
  if (part === 1 || part === 2) return `Part ${part} cần đúng 1 câu hỏi`;
  if (part === 3 || part === 4) return `Part ${part} cần đúng 3 câu hỏi`;
  if (part === 6) return "Part 6 cần đúng 4 câu hỏi";
  if (part === 7) return "Part 7 cần 2-5 câu hỏi";
  return "Part 5 cần ít nhất 1 câu hỏi";
};

export const getTargetQuestionCountForPart = (partType?: number | string) => {
  const part = Number(partType);
  if (part === 1 || part === 2) return 1;
  if (part === 3 || part === 4) return 3;
  if (part === 6) return 4;
  if (part === 7) return 3;
  return undefined;
};

export const getSuggestedPlannedTime = (
  partType?: number | string,
  questionCount = 0
) => {
  const part = Number(partType);
  if (part === 1 || part === 2) return 5;
  if (part === 3 || part === 4) return 10;
  if (part === 5) return Math.max(5, questionCount);
  if (part === 6) return 10;
  if (part === 7) return questionCount >= 4 ? 15 : 10;
  return Math.max(5, questionCount || 1);
};

export const validateQuestionCountForPart = (
  partType: number | string | undefined,
  questionCount: number
) => {
  const part = Number(partType || 5);
  if (part === 1 || part === 2) {
    return questionCount === 1 ? null : `Part ${part} cần đúng 1 câu hỏi`;
  }
  if (part === 3 || part === 4) {
    return questionCount === 3 ? null : `Part ${part} cần đúng 3 câu hỏi`;
  }
  if (part === 6) {
    return questionCount === 4 ? null : "Part 6 cần đúng 4 câu hỏi";
  }
  if (part === 7) {
    return questionCount >= 2 && questionCount <= 5
      ? null
      : "Part 7 cần từ 2 đến 5 câu hỏi";
  }
  return questionCount >= 1 ? null : "Part 5 cần ít nhất 1 câu hỏi";
};

export const validateQuizMediaForPart = (
  partType: number | string | undefined,
  media: {
    audio_url?: string;
    image_url?: string;
    content_html?: string;
  }
) => {
  const part = Number(partType || 5);
  const audioUrl = media.audio_url?.trim();
  const imageUrl = media.image_url?.trim();
  const contentHtml = media.content_html?.trim();

  if (part === 1) {
    if (!imageUrl) return "Part 1 cần ảnh minh họa";
    if (!audioUrl) return "Part 1 cần audio bài nghe";
  }
  if (part === 2 && !audioUrl) return "Part 2 cần audio bài nghe";
  if ((part === 3 || part === 4) && !audioUrl) {
    return `Part ${part} cần audio bài nghe`;
  }
  if ((part === 6 || part === 7) && !contentHtml) {
    return `Part ${part} cần nội dung đoạn văn / passage`;
  }

  return null;
};
