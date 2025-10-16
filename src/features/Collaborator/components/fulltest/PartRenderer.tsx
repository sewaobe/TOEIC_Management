import { useState, useEffect } from "react";
import { useTheme, alpha } from "@mui/material/styles";
import { Box, Typography, Collapse, Alert } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import DeleteIcon from "@mui/icons-material/Delete";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import GroupForm from "../GroupForm";

interface Props {
  partIndex: number;
  groups: any[];
  tagOptions: string[];
  onChangeGroup: (groupIndex: number, field: string, value: any) => void;
  onChangeQuestion: (
    groupIndex: number,
    questionIndex: number,
    field: string,
    value: any
  ) => void;
  onRemoveQuestion?: (groupIndex: number, questionIndex: number) => void;
  onAddQuestion?: (groupIndex: number) => void;
  onAddGroup?: () => void;
  onRemoveGroup?: (groupIndex: number) => void;
  errorPath?: {
    part: number;
    group: number | null;
    question: number | null;
  } | null;
  forceOpenGroup?: number | null;
  forceErrorPart?: number | null;
  errorParts?: number[];
  errorGroups?: { part: number; group: number | null }[];
}

const MAX_PART7_QUESTIONS = 54;

const PartRenderer: React.FC<Props> = ({
  partIndex,
  groups,
  tagOptions,
  onChangeGroup,
  onChangeQuestion,
  onRemoveQuestion,
  onAddQuestion,
  onAddGroup,
  onRemoveGroup,
  errorPath,
  forceOpenGroup,
  forceErrorPart,
  errorParts,
  errorGroups,
}) => {
  const theme = useTheme();
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [hasValidated, setHasValidated] = useState(false);

  // ✅ Bật validated khi có lỗi ở bất kỳ part nào
  useEffect(() => {
    // ✅ Khi validate xong bất kỳ part nào lỗi → bật toàn bộ validate
    if (errorParts && errorParts.length > 0) {
      setHasValidated(true);
    }

    // ✅ Nếu part này nằm trong danh sách lỗi → bật highlight icon
    if (errorParts?.includes(partIndex)) {
      setHasValidated(true);
    }

    // ✅ Mở group lỗi đầu tiên của part hiện tại
    if (forceErrorPart === partIndex && forceOpenGroup != null) {
      setOpenIndex(forceOpenGroup);
    }
  }, [errorParts, forceOpenGroup, forceErrorPart, partIndex]);

  const toggleAccordion = (idx: number) =>
    setOpenIndex(openIndex === idx ? null : idx);

  // ✅ Kiểm tra group thiếu media bắt buộc
  const isGroupMissingRequired = (g: any): boolean => {
    // 🔹 Part 1 cần cả audio & ảnh
    if (partIndex === 1) return !g.audioUrl || !g.imagesUrl?.length;
    // 🔹 Part 2–4 chỉ cần audio
    if ([2, 3, 4].includes(partIndex)) return !g.audioUrl;
    // 🔹 Part 6–7 cần ảnh
    if ([6, 7].includes(partIndex)) return !g.imagesUrl?.length;
    return false;
  };

  // ✅ Mô tả yêu cầu từng Part
  const renderRequiredInfo = (p: number) => {
    switch (p) {
      case 1:
        return "Bắt buộc có Audio 🎧 và Hình ảnh 📸. Cần chọn đáp án đúng.";
      case 2:
        return "Bắt buộc có Audio 🎧. Cần chọn đáp án đúng.";
      case 3:
      case 4:
        return "Bắt buộc có Audio 🎧. Ảnh tùy chọn. Cần nhập nội dung câu hỏi, 4 đáp án và chọn đáp án đúng.";
      case 5:
        return "Cần nhập nội dung câu hỏi, 4 đáp án và chọn đáp án đúng.";
      case 6:
        return "Bắt buộc có Hình ảnh 📸, nhập 4 đáp án và chọn đáp án đúng.";
      case 7:
        return "Bắt buộc có Hình ảnh 📸, nhập nội dung câu hỏi, 4 đáp án và chọn đáp án đúng. Tổng cộng phải đủ 54 câu.";
      default:
        return "";
    }
  };

  // ✅ Tổng số câu hỏi part 7
  const totalQuestionsPart7 =
    partIndex === 7
      ? groups.reduce((s, g) => s + (g.questions?.length || 0), 0)
      : 0;

  // ✅ Part hiện tại có lỗi không
  const isPartHasError =
    hasValidated && (errorParts?.includes(partIndex) ?? false);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
      {/* ⚠️ Thông báo đầu Part */}
      {isPartHasError && (
        <Alert
          severity="warning"
          variant="outlined"
          sx={{
            mb: 2,
            borderRadius: 1.5,
            borderColor: alpha(theme.palette.warning.main, 0.5),
            bgcolor: alpha(theme.palette.warning.light, 0.08),
            color: theme.palette.text.primary,
            fontWeight: 500,
            "& .MuiAlert-icon": { color: theme.palette.warning.main },
          }}
        >
          {renderRequiredInfo(partIndex)}
        </Alert>
      )}

      {/* Danh sách group */}
      {groups.map((g, idx) => {
        const isOpen = openIndex === idx;
        const isError =
          hasValidated &&
          errorGroups?.some((e) => e.part === partIndex && e.group === idx);

        const isMissing = hasValidated && isGroupMissingRequired(g);

        return (
          <Box
            key={idx}
            id={`part-${partIndex}-group-${idx}`}
            sx={{
              border: `1px solid ${theme.palette.divider}`, // ✅ viền đen nhạt mặc định
              borderRadius: 2,
              overflow: "hidden",
              bgcolor: theme.palette.background.paper,
              transition: "all 0.3s ease",
            }}
          >
            {/* Header Group */}
            <Box
              onClick={() => toggleAccordion(idx)}
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                px: 2,
                py: 1.2,
                cursor: "pointer",
                bgcolor: isOpen
                  ? alpha(theme.palette.action.hover, 0.2)
                  : theme.palette.background.paper,
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 0.8,
                  flex: 1,
                }}
              >
                {/* ⚠️ Chỉ hiện icon khi có lỗi */}
                {hasValidated && (isError || isMissing) && (
                  <WarningAmberIcon
                    fontSize="small"
                    sx={{ color: theme.palette.warning.main }}
                  />
                )}
                <Typography sx={{ fontWeight: 600 }}>
                  Group {idx + 1}
                </Typography>
              </Box>

              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <ExpandMoreIcon
                  htmlColor={theme.palette.text.secondary}
                  sx={{
                    transition: "transform 0.25s ease",
                    transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                  }}
                />
                {partIndex === 7 && onRemoveGroup && (
                  <DeleteIcon
                    fontSize="small"
                    htmlColor={theme.palette.error.main}
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemoveGroup(idx);
                    }}
                    sx={{ cursor: "pointer" }}
                  />
                )}
              </Box>
            </Box>

            {/* Nội dung Group */}
            <Collapse in={isOpen} timeout="auto" unmountOnExit>
              <Box
                sx={{ borderTop: `1px solid ${theme.palette.divider}`, p: 2 }}
              >
                <GroupForm
                  groupIndex={idx}
                  group={g}
                  tagOptions={tagOptions}
                  onChange={onChangeGroup}
                  onChangeQuestion={onChangeQuestion}
                  onRemoveQuestion={onRemoveQuestion}
                  onAddQuestion={onAddQuestion}
                  totalQuestionsPart7={totalQuestionsPart7}
                />
              </Box>
            </Collapse>
          </Box>
        );
      })}

      {/* ➕ Giữ nguyên logic thêm group cho Part 7 */}
      {partIndex === 7 &&
        onAddGroup &&
        totalQuestionsPart7 < MAX_PART7_QUESTIONS - 1 && (
          <Box sx={{ textAlign: "center", mt: 1 }}>
            <button
              onClick={onAddGroup}
              style={{
                padding: "6px 12px",
                borderRadius: 6,
                border: `1px solid ${theme.palette.divider}`,
                color: theme.palette.primary.main,
                cursor: "pointer",
                background: "transparent",
              }}
            >
              + Thêm Group mới
            </button>
            <Typography
              variant="caption"
              sx={{ display: "block", mt: 0.5, color: "text.secondary" }}
            >
              ({totalQuestionsPart7}/{MAX_PART7_QUESTIONS} câu)
            </Typography>
          </Box>
        )}
    </Box>
  );
};

export default PartRenderer;
