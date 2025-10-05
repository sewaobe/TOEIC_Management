import { useState } from "react";
import { useTheme } from "@mui/material/styles";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import DeleteIcon from "@mui/icons-material/Delete";
import GroupForm from "../GroupForm";
import Collapse from "@mui/material/Collapse"; // 👈 thêm import

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
  onAddGroup?: () => void; // cho Part 7
  onRemoveGroup?: (groupIndex: number) => void; // mới thêm
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
}) => {
  const theme = useTheme();
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleAccordion = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  // Đếm tổng số câu trong Part 7
  const totalQuestionsPart7 =
    partIndex === 7
      ? groups.reduce((sum, g) => sum + (g.questions?.length || 0), 0)
      : 0;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {groups.map((g, idx) => {
        const isOpen = openIndex === idx;
        return (
          <div
            key={idx}
            style={{
              border: `1px solid ${theme.palette.divider}`,
              borderRadius: 6,
              overflow: "hidden",
              backgroundColor: theme.palette.background.paper,
              color: theme.palette.text.primary,
            }}
          >
            {/* Header */}
            <div
              onClick={() => toggleAccordion(idx)}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "8px 16px",
                cursor: "pointer",
                userSelect: "none",
                backgroundColor: isOpen
                  ? theme.palette.action.hover
                  : theme.palette.background.paper,
              }}
            >
              {/* Title */}
              <span
                style={{
                  flex: 1,
                  fontWeight: 600,
                  fontFamily: theme.typography.fontFamily,
                }}
              >
                Group {idx + 1}
              </span>

              {/* Action buttons */}
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                {/* Mũi tên xuống (xoay lên khi mở) */}
                <ExpandMoreIcon
                  htmlColor={theme.palette.text.secondary}
                  sx={{
                    display: "inline-flex",
                    verticalAlign: "middle",
                    alignSelf: "center",
                    transition: "transform 0.25s ease",
                    transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                  }}
                />

                {/* Nút xóa chỉ cho Part 7 */}
                {partIndex === 7 && onRemoveGroup && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemoveGroup(idx);
                    }}
                    style={{
                      padding: 4,
                      borderRadius: 4,
                      background: "transparent",
                      border: "none",
                      cursor: "pointer",
                    }}
                  >
                    <DeleteIcon
                      fontSize="small"
                      htmlColor={theme.palette.error.main}
                      sx={{
                        display: "inline-flex",
                        verticalAlign: "middle",
                        alignSelf: "center",
                      }}
                    />
                  </button>
                )}
              </div>
            </div>

            {/* Content với hiệu ứng Collapse */}
            <Collapse in={isOpen} timeout="auto" unmountOnExit>
              <div
                style={{
                  borderTop: `1px solid ${theme.palette.divider}`,
                  padding: 16,
                }}
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
              </div>
            </Collapse>
          </div>
        );
      })}

      {/* Part 7 cho phép thêm group nếu chưa đủ 54 câu */}
      {partIndex === 7 &&
        onAddGroup &&
        totalQuestionsPart7 < MAX_PART7_QUESTIONS - 1 && (
          <div style={{ textAlign: "center", marginTop: 8 }}>
            <button
              style={{
                padding: "6px 12px",
                borderRadius: 6,
                fontSize: 14,
                fontWeight: 500,
                border: `1px solid ${theme.palette.divider}`,
                color: theme.palette.primary.main,
                fontFamily: theme.typography.button?.fontFamily,
                cursor: "pointer",
                background: "transparent",
              }}
              onClick={onAddGroup}
            >
              + Thêm Group mới
            </button>
            <p
              style={{
                fontSize: 12,
                marginTop: 4,
                color: theme.palette.text.secondary,
              }}
            >
              ({totalQuestionsPart7}/{MAX_PART7_QUESTIONS} câu)
            </p>
          </div>
        )}
    </div>
  );
};

export default PartRenderer;
