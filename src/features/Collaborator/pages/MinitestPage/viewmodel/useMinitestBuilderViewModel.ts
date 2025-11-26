import { useState } from "react";
import { toast } from "sonner";
import groupService from "../../../../../services/group.service";

// ====== SỐ LƯỢNG CÂU HỎI QUY ĐỊNH CHO TỪNG PART ======
const PART_RULES: Record<number, { min: number; max: number }> = {
  1: { min: 1, max: 1 },
  2: { min: 1, max: 1 },
  3: { min: 3, max: 3 },
  4: { min: 3, max: 3 },
  5: { min: 1, max: 1 },
  6: { min: 4, max: 4 },
  7: { min: 2, max: 5 },
};

type GroupMeta = {
  id: string;
  part: number;
  questionCount: number;
};

const TARGET_TOTAL = 100;
const IDEAL_PART2 = 12;
const PART7_REQUIRED_SIZES = [2, 3, 4, 5];
const BANK_FETCH_LIMIT = 400;

const shuffleArray = <T,>(arr: T[]): T[] => {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
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

  const renumberQuestionsByPart = (input: Record<number, any[]>) => {
    const orderedParts = Object.keys(input)
      .map((p) => Number(p))
      .sort((a, b) => a - b);
    let counter = 1;
    const result: Record<number, any[]> = {};

    orderedParts.forEach((part) => {
      const groups = input[part] || [];
      result[part] = groups.map((g: any) => ({
        ...g,
        questions: (g.questions || []).map((q: any) => ({
          ...q,
          name: `Question ${counter++}`,
        })),
      }));
    });

    return { groups: result, total: counter - 1 };
  };

  const normalizeImportedGroup = (
    part: number,
    srcQuestions: any[],
    srcGroup: any,
    rule: { min: number; max: number }
  ) => {
    let qs = srcQuestions.slice(0, rule.max);
    if (qs.length < rule.min) {
      const pad = generateDefaultQuestions(part).slice(
        0,
        rule.min - qs.length
      );
      qs = qs.concat(pad);
    }

    return {
      type: "TEST",
      transcriptEnglish:
        srcGroup.transcriptEnglish ||
        srcGroup.transcript ||
        srcGroup.group_transcript ||
        "",
      transcriptTranslation:
        srcGroup.transcriptTranslation ||
        srcGroup.transcriptTranslation ||
        srcGroup.group_transcript_translation ||
        "",
      audioUrl: cloneMedia(srcGroup.audioUrl || srcGroup.group_audioUrl || null),
      imagesUrl: cloneImageArr(
        srcGroup.imagesUrl ||
          srcGroup.group_imagesUrl ||
          srcGroup.group_images ||
          []
      ),
      questions: qs,
    };
  };

  const handleImportGroupsFromBank = (part: number, selectedGroups: any[]) => {
    if (!Array.isArray(selectedGroups) || selectedGroups.length === 0) return;

    setGroupsByPart((prev) => {
      const dest = [...(prev[part] || [])];

      for (const src of selectedGroups) {
        const srcQs = Array.isArray(src.questions)
          ? src.questions.map(cloneQuestion)
          : [];
        const rule = PART_RULES[part] || { min: 1, max: 99 };
        const newG = normalizeImportedGroup(part, srcQs, src, rule);
        dest.push(newG as any);
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

  const fetchGroupPool = async (part: number): Promise<GroupMeta[]> => {
    const res = await groupService.getAllQuestionsWithGroup({
      page: 1,
      limit: BANK_FETCH_LIMIT,
      part,
    });
    const map = new Map<string, GroupMeta>();
    (res?.items || []).forEach((item: any) => {
      const gid = item.group_id || item.groupId || item.id;
      if (!gid) return;
      const current = map.get(gid) || {
        id: gid,
        part: item.group_part || part,
        questionCount: 0,
      };
      current.questionCount += 1;
      map.set(gid, current);
    });
    return Array.from(map.values());
  };

  const pickGroups = (
    pool: GroupMeta[],
    expectedSize: number,
    neededGroups: number,
    label: string
  ) => {
    const eligible = pool.filter((g) => g.questionCount === expectedSize);
    if (eligible.length < neededGroups) {
      throw new Error(
        `${label} khong du group ${expectedSize} cau (can ${neededGroups}, co ${eligible.length}).`
      );
    }
    return shuffleArray(eligible).slice(0, neededGroups);
  };

  const pickPart3Groups = (pool: GroupMeta[]) => {
    const eligible = pool.filter((g) => g.questionCount === 3);
    const target =
      eligible.length >= 7 ? 7 : eligible.length >= 6 ? 6 : 0;
    if (!target) {
      throw new Error("Part 3 khong du toi thieu 6 group 3 cau de tao mini test.");
    }
    return shuffleArray(eligible).slice(0, target);
  };

  const buildPart7Selection = (
    pool: GroupMeta[],
    target: number
  ): GroupMeta[] | null => {
    const allowed = pool.filter(
      (g) => g.questionCount >= 2 && g.questionCount <= 5
    );
    const buckets: Record<number, GroupMeta[]> = {
      2: allowed.filter((g) => g.questionCount === 2),
      3: allowed.filter((g) => g.questionCount === 3),
      4: allowed.filter((g) => g.questionCount === 4),
      5: allowed.filter((g) => g.questionCount === 5),
    };

    if (PART7_REQUIRED_SIZES.some((s) => buckets[s].length === 0)) {
      return null;
    }

    const tryBuildOnce = () => {
      const base = PART7_REQUIRED_SIZES.map((size) => {
        const options = buckets[size];
        return options[Math.floor(Math.random() * options.length)];
      });

      const used = new Set(base.map((g) => g.id));
      const baseTotal = base.reduce((sum, g) => sum + g.questionCount, 0);
      const remainingTarget = target - baseTotal;
      if (remainingTarget < 0) return null;

      const candidates = shuffleArray(
        allowed.filter((g) => !used.has(g.id))
      );

      const dfs = (
        start: number,
        acc: GroupMeta[],
        sum: number
      ): GroupMeta[] | null => {
        if (sum === remainingTarget) return acc;
        if (sum > remainingTarget) return null;

        for (let i = start; i < candidates.length; i++) {
          const g = candidates[i];
          const next = dfs(i + 1, [...acc, g], sum + g.questionCount);
          if (next) return next;
        }
        return null;
      };

      const extra = dfs(0, [], 0);
      return extra ? [...base, ...extra] : null;
    };

    for (let i = 0; i < 10; i++) {
      const res = tryBuildOnce();
      if (res) return res;
    }
    return null;
  };

  const fetchFullGroups = async (
    items: GroupMeta[],
    part: number
  ): Promise<any[]> => {
    const results = await Promise.all(
      items.map(async (meta) => {
        const res = await groupService.getById(meta.id);
        const data = (res as any)?.data ?? (res as any);
        if (!data) return null;
        const rule = PART_RULES[part] || { min: 1, max: 99 };
        const srcQs = Array.isArray(data.questions)
          ? data.questions.map(cloneQuestion)
          : [];
        return normalizeImportedGroup(part, srcQs, data, rule);
      })
    );
    return results.filter(Boolean) as any[];
  };

  const autoFillFromBank = async () => {
    const [
      pool1,
      pool2,
      pool3,
      pool4,
      pool5,
      pool6,
      pool7,
    ] = await Promise.all([
      fetchGroupPool(1),
      fetchGroupPool(2),
      fetchGroupPool(3),
      fetchGroupPool(4),
      fetchGroupPool(5),
      fetchGroupPool(6),
      fetchGroupPool(7),
    ]);

    const selected: Record<number, GroupMeta[]> = {};

    selected[1] = pickGroups(pool1, 1, 3, "Part 1");
    selected[4] = pickGroups(pool4, 3, 5, "Part 4");
    selected[5] = pickGroups(pool5, 1, 15, "Part 5");
    selected[6] = pickGroups(pool6, 4, 2, "Part 6");

    selected[3] = pickPart3Groups(pool3);

    const part3Questions = selected[3].reduce(
      (sum, g) => sum + g.questionCount,
      0
    );

    const baseTotal =
      selected[1].reduce((s, g) => s + g.questionCount, 0) +
      part3Questions +
      selected[4].reduce((s, g) => s + g.questionCount, 0) +
      selected[5].reduce((s, g) => s + g.questionCount, 0) +
      selected[6].reduce((s, g) => s + g.questionCount, 0);

    const candidatePart7Targets = [26, 27, 25].sort((a, b) => {
      const part2A = TARGET_TOTAL - (baseTotal + a);
      const part2B = TARGET_TOTAL - (baseTotal + b);
      return Math.abs(part2A - IDEAL_PART2) - Math.abs(part2B - IDEAL_PART2);
    });

    let chosenPart7: GroupMeta[] | null = null;
    let part7Questions = 0;
    let part2Needed = 0;

    for (const target of candidatePart7Targets) {
      const part2Candidate = TARGET_TOTAL - (baseTotal + target);
      if (part2Candidate <= 0) continue;

      const selection = buildPart7Selection(pool7, target);
      if (!selection) continue;

      if (
        selection.reduce((s, g) => s + g.questionCount, 0) + baseTotal >
        TARGET_TOTAL
      ) {
        continue;
      }

      chosenPart7 = selection;
      part7Questions = selection.reduce(
        (s, g) => s + g.questionCount,
        0
      );
      part2Needed = TARGET_TOTAL - (baseTotal + part7Questions);
      break;
    }

    if (!chosenPart7) {
      throw new Error("Khong tim duoc to hop Part 7 (bat buoc co group 2,3,4,5 cau).");
    }

    const part2Pool = pool2.filter((g) => g.questionCount === 1);
    if (part2Needed <= 0) {
      throw new Error("So cau Part 2 khong hop le khi tinh tong 100 cau.");
    }
    if (part2Pool.length < part2Needed) {
      throw new Error(
        `Part 2 khong du ${part2Needed} group. Vui long them cau hoi vao ngan hang.`
      );
    }
    selected[2] = shuffleArray(part2Pool).slice(0, part2Needed);
    selected[7] = chosenPart7;

    const finalGroups: Record<number, any[]> = {};
    for (const part of Object.keys(selected)) {
      const partNum = Number(part);
      finalGroups[partNum] = await fetchFullGroups(
        selected[partNum],
        partNum
      );
    }

    const renumbered = renumberQuestionsByPart(finalGroups);
    setGroupsByPart(renumbered.groups);

    const totalQuestions = renumbered.total;

    if (totalQuestions !== TARGET_TOTAL) {
      toast.warning(
        `Da tu dien ${totalQuestions}/100 cau (theo du lieu ngan hang). Vui long kiem tra lai cac part.`
      );
    } else {
      toast.success("Da lay 100 cau tu ngan hang cho mini test.");
    }

    return {
      addedParts: Object.keys(finalGroups).map((p) => Number(p)).sort(),
      totalQuestions,
      part2Questions: part2Needed,
      part7Questions,
    };
  };

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
    autoFillFromBank,
  };
}
