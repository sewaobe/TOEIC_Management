import { useEffect, useState } from "react";

/**
 * Hook chuyên dùng cho CreateFullTestPage:
 * - Tự động lưu draft vào localStorage
 * - Kiểm tra dữ liệu meaningful
 * - Cho phép khôi phục / bỏ qua draft
 */
export function useFullTestAutoSave(defaultDraft: any) {
  const STORAGE_KEY = "draft-fulltest";

  const [draft, setDraft] = useState(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : defaultDraft;
  });

  const [showRestoreDialog, setShowRestoreDialog] = useState(false);
  const [hasCheckedDraft, setHasCheckedDraft] = useState(false);

  // 🔎 Kiểm tra có draft cũ không & có dữ liệu meaningful không
  useEffect(() => {
    if (!hasCheckedDraft) {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        try {
          const parsed = JSON.parse(raw);
          if (hasMeaningfulFullTestData(parsed)) {
            setShowRestoreDialog(true);
          } else {
            localStorage.removeItem(STORAGE_KEY);
          }
        } catch {
          localStorage.removeItem(STORAGE_KEY);
        }
      }
      setHasCheckedDraft(true);
    }
  }, [hasCheckedDraft]);

  // 💾 Tự động lưu khi draft thay đổi
  useEffect(() => {
    if (hasMeaningfulFullTestData(draft)) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [draft]);

  // 🧭 Handlers
  const restoreDraft = () => setShowRestoreDialog(false);
  const discardDraft = () => {
    localStorage.removeItem(STORAGE_KEY);
    setDraft(defaultDraft);
    setShowRestoreDialog(false);
  };

  return { draft, setDraft, showRestoreDialog, restoreDraft, discardDraft };
}

// =============================
// 🧩 Hàm kiểm tra draft có dữ liệu meaningful
// =============================
function hasMeaningfulFullTestData(draft: any): boolean {
  if (!draft) return false;

  // ✅ Nếu có tiêu đề hoặc chủ đề → coi là meaningful
  if (draft.form?.title?.trim() || draft.form?.topic?.trim()) return true;

  // ✅ Duyệt qua từng Part trong draft.questions
  return Object.values(draft.questions || {}).some((p: any) => {
    if (!Array.isArray(p.groups)) return false;

    // Duyệt qua từng group
    return p.groups.some((g: any) => {
      const noTitle = !g.title?.trim();
      const noAudio = !g.audioUrl;
      const noImages = !Array.isArray(g.imagesUrl) || g.imagesUrl.length === 0;

      // === 🔎 Kiểm tra nội dung câu hỏi bên trong ===
      const hasRealQuestion =
        Array.isArray(g.questions) &&
        g.questions.some((q: any) => {
          const hasText =
            typeof q.textQuestion === "string" && q.textQuestion.trim() !== "";
          const hasExplanation =
            typeof q.explanation === "string" && q.explanation.trim() !== "";
          const hasTag = Array.isArray(q.tags) && q.tags.length > 0;
          const hasChoiceContent = Object.values(q.choices || {}).some(
            (v) => typeof v === "string" && v.trim() !== ""
          );

          // Nếu tất cả đều rỗng => không tính
          return hasText || hasExplanation || hasTag || hasChoiceContent;
        });

      // === 🔍 Nếu group hoàn toàn rỗng (không title/audio/image/câu hỏi thật) → bỏ qua ===
      const isCompletelyEmpty =
        noTitle && noAudio && noImages && !hasRealQuestion;

      return !isCompletelyEmpty;
    });
  });
}
