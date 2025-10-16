import { useState, useCallback, useRef } from "react";
import { useFullTestValidation } from "../hooks/useFullTestValidation";
import {
  initGroups,
  resetQuestionCounter,
  makeEmptyGroup,
  makeEmptyQuestion,
} from "../utils/groupHelpers";
import { cloneDeep } from "lodash";

// ===============================
// 🎯 ViewModel: Quản lý toàn bộ logic Step 2
// ===============================
export const useFullTestStep2ViewModel = (
  value: any,
  onChange: (val: any) => void,
  onNext: () => void
) => {
  const [activePart, setActivePart] = useState(0);
  const initialized = useRef(false);

  // ✅ Hook quản lý validate & toast
  const {
    errorParts,
    errorGroups,
    errorPath,
    forceErrorPart,
    forceOpenGroup,
    showFillAlert,
    handleValidate,
  } = useFullTestValidation();

  // ✅ Khởi tạo toàn bộ part khi load lần đầu
  if (!initialized.current) {
    resetQuestionCounter();
    for (let i = 0; i < 6; i++) {
      const key = `Part ${i + 1}`;
      if (!value[key]?.groups?.length) {
        const init = initGroups(i);
        value[key] = { groups: init };
      }
    }
    onChange({ ...value });
    initialized.current = true;
  }

  // ✅ Getter / Setter cho group
  const getGroups = useCallback(
    (partIdx: number) => value[`Part ${partIdx + 1}`]?.groups || [],
    [value]
  );

  const setGroups = useCallback(
    (partIdx: number, groups: any[]) => {
      const key = `Part ${partIdx + 1}`;
      onChange({ ...value, [key]: { groups } });
    },
    [value, onChange]
  );

  // ==========================
  // 🧠 Logic chỉnh sửa câu hỏi & group
  // ==========================
  const handleChangeGroup = (
    partIdx: number,
    gi: number,
    field: string,
    val: any
  ) => {
    const groups = getGroups(partIdx);
    const newGroups = groups.map((g: any, i: number) =>
      i === gi ? { ...g, [field]: val } : g
    );
    setGroups(partIdx, newGroups);
  };

  const handleChangeQuestion = (
    partIdx: number,
    gi: number,
    qi: number,
    field: string,
    val: any
  ) => {
    const groups = getGroups(partIdx);
    const newGroups = groups.map((g: any, i: number) =>
      i === gi
        ? {
            ...g,
            questions: g.questions.map((q: any, j: number) =>
              j === qi ? { ...q, [field]: val } : q
            ),
          }
        : g
    );
    setGroups(partIdx, newGroups);
  };

  const handleAddQuestion = (partIdx: number, gi: number) => {
    const groups = getGroups(partIdx);
    const newGroups = groups.map((g: any, i: number) =>
      i === gi
        ? { ...g, questions: [...g.questions, makeEmptyQuestion(partIdx + 1)] }
        : g
    );
    setGroups(partIdx, newGroups);
  };

  const handleRemoveQuestion = (partIdx: number, gi: number, qi: number) => {
    const groups = getGroups(partIdx);
    const newGroups = groups.map((g: any, i: number) =>
      i === gi
        ? {
            ...g,
            questions: g.questions.filter((_: any, j: number) => j !== qi),
          }
        : g
    );
    setGroups(partIdx, newGroups);
  };

  const handleAddGroup = (partIdx: number) => {
    const groups = getGroups(partIdx);
    setGroups(partIdx, [...groups, makeEmptyGroup(7, 2)]);
  };

  const handleRemoveGroup = (partIdx: number, gi: number) => {
    const groups = getGroups(partIdx);
    setGroups(
      partIdx,
      groups.filter((_: any, i: number) => i !== gi)
    );
  };
  // ==========================
  // 🧩 Import group từ ngân hàng câu hỏi
  // ==========================
  // ✅ Helper: clone question và media
  const cloneQuestion = (q: any) => ({
    textQuestion: q.textQuestion || "",
    choices: { ...(q.choices || {}) },
    correctAnswer: q.correctAnswer || "A",
    explanation: q.explanation || "",
    tags: Array.isArray(q.tags) ? [...q.tags] : [],
    planned_time: Number(q.planned_time || 0),
  });

  const cloneMedia = (m?: { url: string; type?: string } | null) =>
    m?.url ? { url: m.url, type: m.type || "AUDIO" } : null;

  const cloneImageArr = (arr?: { url: string; type?: string }[]) =>
    Array.isArray(arr)
      ? arr.map((i) => ({ url: i.url, type: i.type || "IMAGE" }))
      : [];

  // ✅ Hàm chính
  const handleImportGroupsFromBank = useCallback(
    (part: number, selectedGroups: any[]) => {
      const newValue = cloneDeep(value);
      const partKey = `Part ${part}`;
      const destGroups = newValue[partKey]?.groups || [];

      console.log(
        `📦 Hiện có ${destGroups.length} group trong ${partKey}:`,
        destGroups
      );

      // ✅ group nào đang lỗi thì coi như "trống"
      const errorGroupIndexes =
        errorGroups
          .filter((e: any) => e.part === part && e.group !== null)
          .map((e: any) => e.group) || [];

      // ---- 🧠 Part 1–6: fill vào group trống (group có lỗi) theo thứ tự ----
      if (part >= 1 && part <= 6) {
        for (const src of selectedGroups) {
          // 🔍 tìm group trống (có lỗi)
          const targetIdx = destGroups.findIndex((_: any, i: number) =>
            errorGroupIndexes.includes(i)
          );
          if (targetIdx === -1) break;

          const dest = destGroups[targetIdx];
          dest.audioUrl = cloneMedia(src.audioUrl);
          dest.imagesUrl = cloneImageArr(src.imagesUrl);
          dest.transcriptEnglish = src.transcriptEnglish || "";
          dest.transcriptTranslation = src.transcriptTranslation || "";
          dest.questions = Array.isArray(src.questions)
            ? src.questions.map(cloneQuestion)
            : [];

          // ✅ sau khi fill, loại bỏ index này khỏi danh sách lỗi để tránh ghi đè group khác
          errorGroupIndexes.splice(errorGroupIndexes.indexOf(targetIdx), 1);
        }

        newValue[partKey].groups = destGroups;
        onChange({ ...newValue });
        alert(`✅ Đã fill ${selectedGroups.length} group vào Part ${part}.`);
        return;
      }

      // ---- 🧠 Part 7: mỗi group ngân hàng → 1 group mới hoặc fill group lỗi ----
      if (part === 7) {
        for (const src of selectedGroups) {
          const qLen = Array.isArray(src.questions) ? src.questions.length : 0;
          if (qLen < 2 || qLen > 5) continue;

          // tìm group lỗi (trống) trước, nếu không có thì tạo mới
          let destIdx = destGroups.findIndex((_: any, i: number) =>
            errorGroupIndexes.includes(i)
          );
          let dest =
            destIdx !== -1 ? destGroups[destIdx] : makeEmptyGroup(7, qLen);

          if (destIdx === -1) destGroups.push(dest);

          dest.audioUrl = cloneMedia(src.audioUrl);
          dest.imagesUrl = cloneImageArr(src.imagesUrl);
          dest.transcriptEnglish = src.transcriptEnglish || "";
          dest.transcriptTranslation = src.transcriptTranslation || "";
          dest.questions = src.questions.map(cloneQuestion);

          if (destIdx !== -1)
            errorGroupIndexes.splice(errorGroupIndexes.indexOf(destIdx), 1);
        }

        newValue[partKey].groups = destGroups;
        onChange({ ...newValue });
        alert(`✅ Đã thêm ${selectedGroups.length} group vào Part 7.`);
      }
    },
    [value, onChange, errorGroups]
  );

  // ==========================
  // ▶️ Validate & chuyển bước
  // ==========================
  const handleNext = () => {
    const result = handleValidate(value);
    if (result) {
      setActivePart(result.first.part - 1);
      setTimeout(() => {
        const el = document.getElementById(
          `part-${result.first.part}-group-${result.first.group ?? 0}`
        );
        el?.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 400);
      return;
    }
    onNext();
  };
  const autoFillFullTest = () => {
    const newValue = { ...value };
    resetQuestionCounter();

    const audioDemo =
      "https://res.cloudinary.com/dmwfnictk/video/upload/v1759990685/jjgfe7ilhutpjloxtw7r.mp3";
    const imageDemo =
      "https://res.cloudinary.com/dmwfnictk/image/upload/v1759990115/xgtj0eghsue5wgfjwhna.png";

    for (let p = 1; p <= 7; p++) {
      const partKey = `Part ${p}`;
      const groups = initGroups(p - 1);

      // ✅ Xử lý riêng Part 7
      if (p === 7) {
        groups.length = 0; // reset part 7
        let remaining = 54;
        while (remaining > 0) {
          const size = Math.min(
            remaining,
            Math.floor(Math.random() * 4) + 2 // random 2–5
          );
          const newGroup = makeEmptyGroup(7, size);
          (newGroup as any).imagesUrl = [{ url: imageDemo, type: "IMAGE" }];
          newGroup.transcriptEnglish = `Reading passage - Group ${
            groups.length + 1
          }`;
          newGroup.transcriptTranslation = "";

          newGroup.questions.forEach((q: any, qi: number) => {
            q.textQuestion = `Part 7 - Câu ${
              qi + 1 + (54 - remaining)
            }: Đọc đoạn văn và trả lời.`;
            q.choices = { A: "A.", B: "B.", C: "C.", D: "D." };
            q.correctAnswer = ["A", "B", "C", "D"][
              Math.floor(Math.random() * 4)
            ];
            q.explanation = `Giải thích cho câu ${qi + 1}`;
          });

          groups.push(newGroup);
          remaining -= size;
        }
      } else {
        // Các Part 1–6 giống cũ
        groups.forEach((g: any, gi: number) => {
          if ([1, 2, 3, 4].includes(p))
            g.audioUrl = { url: audioDemo, type: "AUDIO" };
          if ([1, 6].includes(p))
            g.imagesUrl = [{ url: imageDemo, type: "IMAGE" }];

          g.transcriptEnglish = `Transcript for Part ${p} - Group ${gi + 1}`;
          g.transcriptTranslation = "";

          g.questions.forEach((q: any, qi: number) => {
            q.textQuestion = ![1, 2, 6].includes(p)
              ? `Câu hỏi ${qi + 1} - Phần ${p}`
              : "";
            q.choices = { A: "A.", B: "B.", C: "C.", D: "D." };
            q.correctAnswer = ["A", "B", "C", "D"][
              Math.floor(Math.random() * 4)
            ];
            q.explanation = `Giải thích cho câu ${qi + 1}`;
          });
        });
      }

      newValue[partKey] = { groups };
    }

    onChange({ ...newValue });
    alert("✅ Đã tự động điền dữ liệu hợp lệ cho 7 part (200 câu).");
  };

  return {
    // State chính
    activePart,
    setActivePart,

    // Getter / Setter
    getGroups,
    setGroups,

    // Logic xử lý (Add / Remove / Edit)
    handleChangeGroup,
    handleChangeQuestion,
    handleAddQuestion,
    handleRemoveQuestion,
    handleAddGroup,
    handleRemoveGroup,

    // Validate & Error
    errorParts,
    errorGroups,
    errorPath,
    forceErrorPart,
    forceOpenGroup,
    showFillAlert,
    handleNext,

    autoFillFullTest,
    handleImportGroupsFromBank,
  };
};
