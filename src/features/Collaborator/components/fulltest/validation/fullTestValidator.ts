export interface ErrorGroup {
  part: number;
  group: number | null;
}

export const validateFullTest = (data: any) => {
  const errorGroups: ErrorGroup[] = [];
  const errorParts: number[] = [];

  for (let p = 1; p <= 7; p++) {
    const part = data[`Part ${p}`];
    if (!part?.groups?.length) continue;

    let partHasError = false;

    // 🧮 Part 7: phải đủ 54 câu
    if (p === 7) {
      const totalQ = part.groups.reduce(
        (sum: number, g: any) => sum + (g.questions?.length || 0),
        0
      );
      if (totalQ !== 54) {
        errorGroups.push({ part: 7, group: null });
        partHasError = true;
      }
    }

    for (let gi = 0; gi < part.groups.length; gi++) {
      const g = part.groups[gi];
      let groupHasError = false;

      // 🎧 / 📸 Media check
      if ([1, 2, 3, 4].includes(p) && !g.audioUrl) groupHasError = true;
      if ([1, 6, 7].includes(p) && (!g.imagesUrl || g.imagesUrl.length === 0))
        groupHasError = true;

      // 🧩 Validate câu hỏi (chỉ với part KHÔNG phải 6)
      if (p !== 6) {
        for (const q of g.questions || []) {
          // ❗ Phải có đủ nội dung đáp án
          const missingChoice = Object.values(q.choices || {}).some(
            (v) => !String(v || "").trim()
          );
          if (missingChoice) groupHasError = true;

          // ❗ Phải chọn đáp án đúng, key hợp lệ
          const validAnswerKey =
            typeof q.correctAnswer === "string" &&
            q.correctAnswer.trim() &&
            Object.prototype.hasOwnProperty.call(
              q.choices || {},
              q.correctAnswer
            );
          if (!validAnswerKey) groupHasError = true;

          // ❗ Với part 3–7 (trừ part 6): bắt buộc có textQuestion
          if (![1, 2, 6].includes(p) && !String(q.textQuestion || "").trim())
            groupHasError = true;
        }
      }

      if (groupHasError) {
        errorGroups.push({ part: p, group: gi });
        partHasError = true;
      }
    }

    if (partHasError) errorParts.push(p);
  }

  if (errorGroups.length > 0)
    return {
      first: errorGroups[0],
      all: errorGroups,
      parts: errorParts,
    };

  return null;
};
