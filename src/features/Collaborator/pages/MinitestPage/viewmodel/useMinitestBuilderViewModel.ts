import { useState } from "react";
import { toast } from "sonner";
import { cloneDeep } from "lodash";

// ====== SỐ LƯỢNG CÂU HỎI QUY ĐỊNH CHO TỪNG PART ======
const PART_RULES: Record<number, { min: number; max: number }> = {
  1: { min: 1, max: 1 },
  2: { min: 1, max: 1 },
  3: { min: 3, max: 3 },
  4: { min: 3, max: 3 },
  5: { min: 1, max: 1 },
  6: { min: 3, max: 3 },
  7: { min: 2, max: 5 },
};

/**
 * ViewModel cho Mini Test — mỗi Part có mảng group riêng biệt
 */
export function useMiniTestBuilderViewModel(initialData?: any) {
  const [groupsByPart, setGroupsByPart] = useState<Record<number, any[]>>({});

  // 🧭 Dành cho edit mini-test
  const initFromMiniTest = (miniTest: any) => {
    const grouped: Record<number, any[]> = {};
    (miniTest.groups || []).forEach((g: any) => {
      if (!grouped[g.part]) grouped[g.part] = [];
      grouped[g.part].push({
        ...g,
        audioUrl: g.audioUrl || null,
        imagesUrl: g.imagesUrl || [],
        questions: g.questions || [],
      });
    });
    setGroupsByPart(grouped);
  };

  // 🧩 Tạo câu hỏi mặc định theo Part
  const generateDefaultQuestions = (part: number) => {
    const rule = PART_RULES[part];
    const count = rule?.min || 1;
    return Array.from({ length: count }, (_, i) => ({
      name: `Question ${i + 1}`,
      textQuestion: "",
      choices: { A: "", B: "", C: "", D: "" },
      correctAnswer: "",
      planned_time: 0,
      explanation: "",
      tags: [],
    }));
  };

  // ➕ Thêm group mới cho part
  const addGroup = (part: number) => {
    const newGroup = {
      type: "TEST",
      transcriptEnglish: "",
      transcriptTranslation: "",
      audioUrl: null,
      imagesUrl: [],
      questions: generateDefaultQuestions(part),
    };
    setGroupsByPart((prev) => ({
      ...prev,
      [part]: [...(prev[part] || []), newGroup],
    }));
  };

  // 🗑️ Xóa group
  const removeGroup = (part: number, groupIndex: number) => {
    setGroupsByPart((prev) => ({
      ...prev,
      [part]: (prev[part] || []).filter((_, i) => i !== groupIndex),
    }));
  };

  // 🔄 Cập nhật group
  const updateGroup = (
    part: number,
    groupIndex: number,
    field: string,
    value: any
  ) => {
    setGroupsByPart((prev) => {
      const updatedPart = [...(prev[part] || [])];
      updatedPart[groupIndex] = { ...updatedPart[groupIndex], [field]: value };
      return { ...prev, [part]: updatedPart };
    });
  };

  // ➕ Thêm câu hỏi
  const addQuestion = (part: number, groupIndex: number) => {
    setGroupsByPart((prev) => {
      const updatedPart = [...(prev[part] || [])];
      const group = updatedPart[groupIndex];
      const rule = PART_RULES[part] || { max: 99 };
      if (group.questions.length >= rule.max) {
        toast.warning(`Part ${part} chỉ cho phép tối đa ${rule.max} câu hỏi.`);
        return prev;
      }
      group.questions.push({
        name: `Question ${group.questions.length + 1}`,
        textQuestion: "",
        choices: { A: "", B: "", C: "", D: "" },
        correctAnswer: "",
        planned_time: 0,
        explanation: "",
        tags: [],
      });
      updatedPart[groupIndex] = group;
      return { ...prev, [part]: updatedPart };
    });
  };

  // 🗑️ Xóa câu hỏi
  const removeQuestion = (
    part: number,
    groupIndex: number,
    questionIndex: number
  ) => {
    setGroupsByPart((prev) => {
      const updatedPart = [...(prev[part] || [])];
      const group = updatedPart[groupIndex];
      const rule = PART_RULES[part] || { min: 1 };
      if (group.questions.length <= rule.min) {
        toast.warning(`Part ${part} cần ít nhất ${rule.min} câu hỏi.`);
        return prev;
      }
      group.questions.splice(questionIndex, 1);
      updatedPart[groupIndex] = group;
      return { ...prev, [part]: updatedPart };
    });
  };

  // 🔄 Update question
  const updateQuestion = (
    part: number,
    groupIndex: number,
    questionIndex: number,
    field: string,
    value: any
  ) => {
    setGroupsByPart((prev) => {
      const updatedPart = [...(prev[part] || [])];
      const group = updatedPart[groupIndex];
      if (!group) return prev;
      group.questions[questionIndex][field] = value;
      updatedPart[groupIndex] = group;
      return { ...prev, [part]: updatedPart };
    });
  };

  // ==========================
  // Import groups from question bank
  // ==========================
  const cloneQuestion = (q: any) => ({
    name: q.name || "",
    textQuestion: q.textQuestion || q.text || "",
    choices: { ...(q.choices || {}) },
    correctAnswer: q.correctAnswer || q.correct || "",
    planned_time: Number(q.planned_time || q.plannedTime || 0),
    explanation: q.explanation || q.explain || "",
    tags: Array.isArray(q.tags) ? [...q.tags] : [],
  });

  const cloneMedia = (m?: { url: string; type?: string } | null) =>
    m?.url ? { url: m.url, type: m.type || "AUDIO" } : null;

  const cloneImageArr = (arr?: any[]) =>
    Array.isArray(arr)
      ? arr.map((i) => ({ url: i.url || i, type: i.type || "IMAGE" }))
      : [];

  const handleImportGroupsFromBank = (part: number, selectedGroups: any[]) => {
    if (!Array.isArray(selectedGroups) || selectedGroups.length === 0) return;

    setGroupsByPart((prev) => {
      const dest = [...(prev[part] || [])];

      for (const src of selectedGroups) {
        const srcQs = Array.isArray(src.questions)
          ? src.questions.map(cloneQuestion)
          : [];
        const rule = PART_RULES[part] || { min: 1, max: 99 };
        // truncate to max
        let qs = srcQs.slice(0, rule.max);
        // pad to min if needed
        if (qs.length < rule.min) {
          const pad = generateDefaultQuestions(part).slice(
            0,
            rule.min - qs.length
          );
          qs = qs.concat(pad);
        }

        const newG = {
          type: "TEST",
          transcriptEnglish:
            src.transcriptEnglish ||
            src.transcript ||
            src.group_transcript ||
            "",
          transcriptTranslation:
            src.transcriptTranslation ||
            src.transcriptTranslation ||
            src.group_transcript_translation ||
            "",
          audioUrl: cloneMedia(src.audioUrl || src.group_audioUrl || null),
          imagesUrl: cloneImageArr(
            src.imagesUrl || src.group_imagesUrl || src.group_images || []
          ),
          questions: qs,
        } as any;

        dest.push(newG);
      }

      toast.success(`Đã thêm ${selectedGroups.length} group vào Part ${part}.`);
      return { ...prev, [part]: dest };
    });
  };

  // 🧱 Build payload đúng model ITest
  const buildPayload = (form: any) => ({
    title: form.title,
    topic: form.topic,
    type: "mini-test",
    status: form.status || "draft",
    groups: Object.entries(groupsByPart).flatMap(([part, arr]) =>
      (arr || []).map((g) => ({
        ...g,
        part: Number(part),
      }))
    ),
  });

  return {
    groupsByPart,
    addGroup,
    removeGroup,
    addQuestion,
    removeQuestion,
    updateGroup,
    updateQuestion,
    initFromMiniTest,
    buildPayload,
    handleImportGroupsFromBank,
  };
}
