import { useState } from "react";
import { toast } from "sonner";
import { validateFullTest } from "../validation/fullTestValidator";

export function useFullTestValidation() {
  const [errorParts, setErrorParts] = useState<number[]>([]);
  const [errorGroups, setErrorGroups] = useState<{ part: number; group: number | null }[]>([]);
  const [errorPath, setErrorPath] = useState<{ part: number; group: number | null; question: number | null } | null>(null);
  const [forceErrorPart, setForceErrorPart] = useState<number | null>(null);
  const [forceOpenGroup, setForceOpenGroup] = useState<number | null>(null);
  const [showFillAlert, setShowFillAlert] = useState(false);

  /**
   * Validate toàn bộ test và lưu lại thông tin lỗi đầu tiên (nếu có)
   */
  const handleValidate = (data: any) => {
    const result = validateFullTest(data);
    if (result) {
      toast.warning("⚠️ Vui lòng điền đầy đủ thông tin trước khi tiếp tục.");
      setShowFillAlert(true);
      setErrorParts(result.parts);
      setErrorGroups(result.all);
      setErrorPath({
        part: result.first.part,
        group: result.first.group,
        question: null,
      });
      setForceErrorPart(result.first.part);
      setForceOpenGroup(result.first.group ?? null);
      return result; // ✅ trả toàn bộ result để file chính xử lý mở group & scroll
    }

    // ✅ Reset nếu không có lỗi
    setErrorPath(null);
    setForceOpenGroup(null);
    setForceErrorPart(null);
    setShowFillAlert(false);
    setErrorParts([]);
    setErrorGroups([]);
    return null;
  };

  return {
    errorParts,
    errorGroups,
    errorPath,
    forceErrorPart,
    forceOpenGroup,
    showFillAlert,
    handleValidate,
  };
}
