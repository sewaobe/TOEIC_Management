import { useState } from "react";
import { useTheme } from "@mui/material/styles";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import DeleteIcon from "@mui/icons-material/Delete";
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
    <div className="space-y-3">
      {groups.map((g, idx) => {
        const isOpen = openIndex === idx;
        return (
          <div
            key={idx}
            className="rounded-md overflow-hidden"
            style={{
              border: `1px solid ${theme.palette.divider}`,
              backgroundColor: theme.palette.background.paper,
              color: theme.palette.text.primary,
            }}
          >
            {/* Header */}
            <div
              className="flex items-center justify-between px-4 py-2 cursor-pointer select-none"
              style={{
                backgroundColor: isOpen
                  ? theme.palette.action.hover
                  : theme.palette.background.paper,
              }}
              onClick={() => toggleAccordion(idx)}
            >
              <span
                className="font-semibold"
                style={{ fontFamily: theme.typography.fontFamily }}
              >
                Group {idx + 1}
              </span>

              <div className="flex items-center gap-2">
                <ExpandMoreIcon
                  className={`transition-transform ${
                    isOpen ? "rotate-180" : "rotate-0"
                  }`}
                  htmlColor={theme.palette.text.secondary}
                />

                {partIndex === 7 && onRemoveGroup && (
                  <button
                    className="p-1 rounded hover:bg-red-100 dark:hover:bg-red-900"
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemoveGroup(idx);
                    }}
                  >
                    <DeleteIcon
                      fontSize="small"
                      htmlColor={theme.palette.error.main}
                    />
                  </button>
                )}
              </div>
            </div>

            {/* Content */}
            {isOpen && (
              <div
                className="p-4"
                style={{
                  borderTop: `1px solid ${theme.palette.divider}`,
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
            )}
          </div>
        );
      })}

      {/* Part 7 cho phép thêm group nếu chưa đủ 54 câu */}
      {partIndex === 7 && onAddGroup && totalQuestionsPart7 < MAX_PART7_QUESTIONS - 1 && (
        <div className="text-center mt-2">
          <button
            className="px-3 py-1.5 rounded text-sm font-medium"
            style={{
              border: `1px solid ${theme.palette.divider}`,
              color: theme.palette.primary.main,
              fontFamily: theme.typography.button?.fontFamily,
            }}
            onClick={onAddGroup}
          >
            + Thêm Group mới
          </button>
          <p
            className="text-xs mt-1"
            style={{ color: theme.palette.text.secondary }}
          >
            ({totalQuestionsPart7}/{MAX_PART7_QUESTIONS} câu)
          </p>
        </div>
      )}
    </div>
  );
};

export default PartRenderer;
