import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { VocabularyForm } from "../types/Vocabulary";
import useLocalStorage from "./useLocalStorage";

const defaultForm: VocabularyForm = {
  word: "",
  phonetic: "",
  type: "noun",
  weight: 0.5,
  definition: "",
  examples: [{ en: "", vi: "" }],
  image: "",
  audio: "",
  part_type: "listening",
  tags: [],
};

export type VocabularyDraftMap = Record<string, VocabularyForm>; // { [url]: form }

export function useVocabularyForm() {
  const location = useLocation();
  const currentUrl = location.pathname;

  // Lưu tất cả bản nháp theo URL
  const [storedDrafts, setStoredDrafts] = useLocalStorage<VocabularyDraftMap>(
    "draft_vocab",
    {}
  );

  // Lấy form hiện tại của URL đang mở
  const currentDraft = storedDrafts[currentUrl] || defaultForm;
  const [formData, setFormData] = useState<VocabularyForm>(currentDraft);
  const [isDirty, setIsDirty] = useState(false);

  // Cập nhật localStorage mỗi khi formData thay đổi
  useEffect(() => {
    const hasData =
      formData.word ||
      formData.phonetic ||
      formData.definition ||
      formData.examples.some((ex) => ex.en || ex.vi) ||
      formData.image ||
      formData.audio ||
      formData.tags.length > 0;

    setIsDirty(!!hasData);

    // Nếu có dữ liệu → lưu vào localStorage
    if (hasData) {
      setStoredDrafts((prev) => ({
        ...prev,
        [currentUrl]: formData,
      }));
    } else {
      // Nếu không có dữ liệu → xoá bản nháp của trang này
      setStoredDrafts((prev) => {
        const updated = { ...prev };
        delete updated[currentUrl];
        return updated;
      });
    }
  }, [formData, currentUrl, setStoredDrafts]);

  // Reset form của trang hiện tại
  const resetForm = () => {
    setFormData(defaultForm);
    setStoredDrafts((prev) => ({
      ...prev,
      [currentUrl]: defaultForm,
    }));
  };

  // Xoá bản nháp của trang hiện tại
  const clearCurrentDraft = () => {
    setStoredDrafts((prev) => {
      const updated = { ...prev };
      delete updated[currentUrl];
      return updated;
    });
    setFormData(defaultForm);
  };

  // Xoá toàn bộ bản nháp
  const clearAllDrafts = () => {
    localStorage.removeItem("draft_vocab");
    setFormData(defaultForm);
  };

  return {
    formData,
    setFormData,
    resetForm,
    isDirty,
    clearCurrentDraft,
    clearAllDrafts,
    storedDrafts,
  };
}
