import {
  Box,
  Paper,
  Typography,
  Button,
  Tabs,
  Tab,
} from "@mui/material";
import { useState, useCallback, useEffect } from "react";
import PartRenderer from "./PartRenderer";
import { examParts } from "../../../../constants/examParts";

// ===== Props =====
interface Props {
  value: any;
  onChange: (val: any) => void;
  onBack: () => void;
  onNext: () => void;
}

const parts = [
  "Part 1",
  "Part 2",
  "Part 3",
  "Part 4",
  "Part 5",
  "Part 6",
  "Part 7",
];

// ===== Helpers =====
const makeEmptyQuestion = (part: number) => ({
  textQuestion: "",
  choices: { A: "", B: "", C: "", D: "" },
  correctAnswer: "A",
  planned_time: 0,
  explanation: "",
  tags: [],
  choiceLabels: part === 2 ? ["A", "B", "C"] : ["A", "B", "C", "D"],
});

const makeEmptyGroup = (part: number, size: number) => ({
  type: "TEST",
  partIndex: part,
  transcriptEnglish: "",
  transcriptTranslation: "",
  audioUrl: null, // { url, type: "AUDIO" }
  imagesUrl: [], // array các { url, type: "IMAGE" }
  questions: Array.from({ length: size }, () => makeEmptyQuestion(part)),
});

// khởi tạo groups cố định theo TOEIC
const initGroups = (partIdx: number) => {
  switch (partIdx + 1) {
    case 1:
      return Array.from({ length: 6 }, () => makeEmptyGroup(1, 1));
    case 2:
      return Array.from({ length: 25 }, () => makeEmptyGroup(2, 1));
    case 3:
      return Array.from({ length: 13 }, () => makeEmptyGroup(3, 3));
    case 4:
      return Array.from({ length: 10 }, () => makeEmptyGroup(4, 3));
    case 5:
      return Array.from({ length: 30 }, () => makeEmptyGroup(5, 1));
    case 6:
      return Array.from({ length: 4 }, () => makeEmptyGroup(6, 4));
    case 7:
      return []; // Part 7: để trống, user add group
    default:
      return [];
  }
};

const PAGE_SIZE = 6;

const FullTestStep2Questions: React.FC<Props> = ({
  value,
  onChange,
  onBack,
  onNext,
}) => {
  const [activePart, setActivePart] = useState(0);
  const [visibleCount, setVisibleCount] = useState<Record<number, number>>({});

  // helper get groups (lazy init)
  const getGroups = useCallback(
    (partIdx: number) => {
      const key = `Part ${partIdx + 1}`;
      if (!value[key]?.groups?.length) {
        const init = initGroups(partIdx);
        if (init.length) {
          onChange({ ...value, [key]: { groups: init } });
        }
        return init;
      }
      return value[key].groups;
    },
    [value, onChange]
  );

  // helper set groups
  const setGroups = useCallback(
    (partIdx: number, groups: any[]) => {
      const key = `Part ${partIdx + 1}`;
      onChange({ ...value, [key]: { groups } });
    },
    [value, onChange]
  );

  const totalGroups = getGroups(activePart);
  const currentVisibleCount = visibleCount[activePart] || PAGE_SIZE;
  const groups = totalGroups.slice(0, currentVisibleCount);

  // reset visibleCount khi đổi tab
  useEffect(() => {
    setVisibleCount((prev) => ({
      ...prev,
      [activePart]: PAGE_SIZE,
    }));
  }, [activePart]);

  const tagOptions =
    examParts[activePart + 1]?.tags?.map((t: any) => t.name) || [];

  return (
    <Paper
      sx={{
        p: 3,
        borderRadius: 2,
        maxWidth: 1100,
        mx: "auto",
        mt: 4,
        boxShadow: 2,
      }}
    >
      <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
        Thêm câu hỏi
      </Typography>

      {/* Tabs cho từng Part */}
      <Tabs
        value={activePart}
        onChange={(_, val) => setActivePart(val)}
        variant="scrollable"
        scrollButtons
      >
        {parts.map((label, idx) => (
          <Tab key={idx} label={label} />
        ))}
      </Tabs>

      {/* Render chỉ tab đang active */}
      <Box sx={{ mt: 3 }}>
        <PartRenderer
          key={activePart}
          partIndex={activePart + 1}
          groups={groups}
          tagOptions={tagOptions}
          onChangeGroup={(groupIndex, field, valueField) => {
            const newGroups = totalGroups.map((g: any, i: number) =>
              i === groupIndex ? { ...g, [field]: valueField } : g
            );
            setGroups(activePart, newGroups);
          }}
          onChangeQuestion={(groupIndex, questionIndex, field, valueField) => {
            const newGroups = totalGroups.map((g: any, i: number) =>
              i === groupIndex
                ? {
                    ...g,
                    questions: g.questions.map((q: any, j: number) =>
                      j === questionIndex ? { ...q, [field]: valueField } : q
                    ),
                  }
                : g
            );
            setGroups(activePart, newGroups);
          }}
          onRemoveQuestion={(groupIndex, questionIndex) => {
            const newGroups = totalGroups.map((g: any, i: number) =>
              i === groupIndex
                ? {
                    ...g,
                    questions: g.questions.filter(
                      (_: any, j: number) => j !== questionIndex
                    ),
                  }
                : g
            );
            setGroups(activePart, newGroups);
          }}
          onAddQuestion={(groupIndex) => {
            const newGroups = totalGroups.map((g: any, i: number) =>
              i === groupIndex
                ? {
                    ...g,
                    questions: [
                      ...g.questions,
                      makeEmptyQuestion(activePart + 1),
                    ],
                  }
                : g
            );
            setGroups(activePart, newGroups);
          }}
          onAddGroup={() =>
            setGroups(activePart, [
              ...totalGroups,
              makeEmptyGroup(7, 2), // default Part 7 group có 2 câu
            ])
          }
          onRemoveGroup={(groupIndex) => {
            const newGroups = totalGroups.filter(
              (_: any, i: number) => i !== groupIndex
            );
            setGroups(activePart, newGroups);
          }}
        />
      </Box>

      {/* View More */}
      {currentVisibleCount < totalGroups.length && (
        <Box sx={{ textAlign: "center", mt: 2 }}>
          <Button
            variant="outlined"
            onClick={() =>
              setVisibleCount((prev) => ({
                ...prev,
                [activePart]: Math.min(
                  (prev[activePart] || PAGE_SIZE) + PAGE_SIZE,
                  totalGroups.length
                ),
              }))
            }
          >
            Xem thêm
          </Button>
        </Box>
      )}

      <Box sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}>
        <Button variant="outlined" onClick={onBack}>
          Quay lại
        </Button>
        <Button variant="contained" onClick={onNext}>
          Tiếp tục
        </Button>
      </Box>
    </Paper>
  );
};

export default FullTestStep2Questions;
