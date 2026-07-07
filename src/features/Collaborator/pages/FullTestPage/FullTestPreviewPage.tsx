import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  Collapse,
  Divider,
  IconButton,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import type { SxProps, Theme } from "@mui/material/styles";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import fullTestService from "../../../../services/fullTest.service";
import { FullTest } from "../../../../types/fullTest";

type PreviewAnswer = {
  question_id: string;
  question_no: number;
  selectedOption: string;
  isCorrect: true;
  correctAnswer: string;
  tags?: string[];
};

type PreviewQuestion = {
  id: string;
  questionNo: number;
  name?: string;
  textQuestion?: string;
  choices: Record<string, string>;
  correctAnswer: string;
  explanation?: string;
  tags?: string[];
};

type PreviewGroup = {
  id: string;
  part: number;
  questions: PreviewQuestion[];
  audioUrl?: string;
  imagesUrl: string[];
  transcriptEnglish?: string;
  transcriptTranslation?: string;
};

type NormalizedPreview = {
  groups: PreviewGroup[];
  answers: PreviewAnswer[];
  availableParts: number[];
};

const UNKNOWN_PART = 0;

const extractPartFromTags = (tags?: string[]) => {
  if (!tags?.length) return undefined;
  for (const tag of tags) {
    const match = String(tag).match(/\[Part\s+(\d+)\]/i);
    if (!match) continue;
    const part = Number(match[1]);
    if (Number.isFinite(part) && part >= 1 && part <= 7) return part;
  }
  return undefined;
};

const getId = (value: any, fallback: string) =>
  String(value?._id ?? value?.id ?? fallback);

const getMediaUrl = (media: any) => {
  if (!media) return undefined;
  if (typeof media === "string") return media;
  return typeof media.url === "string" ? media.url : undefined;
};

const getPartLabel = (part: number) =>
  part === UNKNOWN_PART ? "Khác" : `Part ${part}`;

const sortPartValues = (a: number, b: number) => {
  if (a === UNKNOWN_PART) return 1;
  if (b === UNKNOWN_PART) return -1;
  return a - b;
};

const normalizePreviewData = (test: FullTest | null): NormalizedPreview => {
  let nextQuestionNo = 1;
  const groups = (test?.groups ?? [])
    .map((rawGroup: any, groupIndex) => {
      const rawQuestions = Array.isArray(rawGroup?.questions)
        ? rawGroup.questions
        : [];
      const partFromGroup = Number(rawGroup?.part);
      const part =
        Number.isFinite(partFromGroup) && partFromGroup > 0
          ? partFromGroup
          : extractPartFromTags(rawQuestions[0]?.tags) ?? UNKNOWN_PART;

      const questions: PreviewQuestion[] = rawQuestions.map(
        (rawQuestion: any, questionIndex: number) => {
          const questionNoCandidate = Number(
            rawQuestion?.questionNumber ?? rawQuestion?.question_no
          );
          const questionNo =
            Number.isFinite(questionNoCandidate) && questionNoCandidate > 0
              ? questionNoCandidate
              : nextQuestionNo;
          nextQuestionNo = Math.max(nextQuestionNo + 1, questionNo + 1);

          return {
            id: getId(rawQuestion, `group-${groupIndex}-q-${questionIndex}`),
            questionNo,
            name: rawQuestion?.name,
            textQuestion: rawQuestion?.textQuestion,
            choices:
              rawQuestion?.choices && typeof rawQuestion.choices === "object"
                ? rawQuestion.choices
                : {},
            correctAnswer: String(rawQuestion?.correctAnswer ?? ""),
            explanation: rawQuestion?.explanation,
            tags: Array.isArray(rawQuestion?.tags) ? rawQuestion.tags : [],
          };
        }
      );

      const imagesUrl = Array.isArray(rawGroup?.imagesUrl)
        ? rawGroup.imagesUrl.map(getMediaUrl).filter(Boolean)
        : [];

      return {
        id: getId(rawGroup, `group-${groupIndex}`),
        part,
        questions,
        audioUrl: getMediaUrl(rawGroup?.audioUrl),
        imagesUrl,
        transcriptEnglish: rawGroup?.transcriptEnglish,
        transcriptTranslation: rawGroup?.transcriptTranslation,
      } as PreviewGroup;
    })
    .filter((group) => group.questions.length > 0)
    .sort((a, b) => {
      const partDiff = sortPartValues(a.part, b.part);
      if (partDiff !== 0) return partDiff;
      return a.questions[0].questionNo - b.questions[0].questionNo;
    });

  const answers = groups.flatMap((group) =>
    group.questions.map((question) => ({
      question_id: question.id,
      question_no: question.questionNo,
      selectedOption: question.correctAnswer,
      isCorrect: true as const,
      correctAnswer: question.correctAnswer,
      tags: question.tags,
    }))
  );

  const availableParts = Array.from(new Set(groups.map((group) => group.part)))
    .filter((part) => groups.some((group) => group.part === part))
    .sort(sortPartValues);

  return { groups, answers, availableParts };
};

export default function FullTestPreviewPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [loading, setLoading] = useState(true);
  const [test, setTest] = useState<FullTest | null>(null);
  const [error, setError] = useState("");
  const [activePart, setActivePart] = useState<number | null>(null);
  const [focusedQuestionId, setFocusedQuestionId] = useState<string | null>(
    null
  );

  useEffect(() => {
    const fetchPreview = async () => {
      if (!id) return;
      setLoading(true);
      setError("");
      try {
        const res = await fullTestService.getById(`${id}?full=true`);
        const payload = (res as any).data?.data ?? (res as any).data ?? res;
        setTest(payload);
      } catch (err) {
        console.error("Failed to load full test preview", err);
        setError("Không tải được dữ liệu xem trước đề thi.");
      } finally {
        setLoading(false);
      }
    };
    fetchPreview();
  }, [id]);

  const preview = useMemo(() => normalizePreviewData(test), [test]);

  useEffect(() => {
    if (!preview.availableParts.length) {
      setActivePart(null);
      return;
    }
    setActivePart((current) =>
      current && preview.availableParts.includes(current)
        ? current
        : preview.availableParts[0]
    );
  }, [preview.availableParts]);

  const visibleGroups = useMemo(() => {
    if (!activePart) return preview.groups;
    return preview.groups.filter((group) => group.part === activePart);
  }, [activePart, preview.groups]);

  const questionIdToPart = useMemo(() => {
    const map = new Map<string, number>();
    preview.groups.forEach((group) => {
      group.questions.forEach((question) => map.set(question.id, group.part));
    });
    return map;
  }, [preview.groups]);

  const scrollToPart = (part: number) => {
    setActivePart(part);
    window.setTimeout(() => {
      containerRef.current
        ?.querySelector(`#preview-part-${part}`)
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 0);
  };

  const focusQuestion = useCallback((questionId: string) => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        const element = containerRef.current?.querySelector(
          `[data-question-id="${questionId}"]`
        );
        if (!element) return;
        element.scrollIntoView({ behavior: "smooth", block: "center" });
        setFocusedQuestionId(questionId);
        window.setTimeout(() => {
          setFocusedQuestionId((current) =>
            current === questionId ? null : current
          );
        }, 1800);
      });
    });
  }, []);

  const scrollToQuestion = (questionId: string) => {
    const part = questionIdToPart.get(questionId);
    if (part && part !== activePart) {
      setActivePart(part);
      window.setTimeout(() => focusQuestion(questionId), 80);
      return;
    }
    focusQuestion(questionId);
  };

  const questionCount = preview.answers.length;

  return (
    <Box sx={{ p: { xs: 2, md: 3 }, bgcolor: "#F8FAFC", minHeight: "100vh" }}>
      <Stack
        direction={{ xs: "column", md: "row" }}
        alignItems={{ xs: "stretch", md: "center" }}
        justifyContent="space-between"
        spacing={2}
        sx={{ mb: 2 }}
      >
        <Stack direction="row" spacing={1.5} alignItems="center">
          <IconButton onClick={() => navigate(-1)} size="small">
            <ArrowBackIcon />
          </IconButton>
          <Box>
            <Typography variant="h5" fontWeight={800}>
              Xem trước đề thi{test?.title ? `: ${test.title}` : ""}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {test?.topic || "Chưa có chủ đề"} - {questionCount} câu hỏi
            </Typography>
          </Box>
        </Stack>

        {preview.availableParts.length === 1 && (
          <Chip
            label={getPartLabel(preview.availableParts[0])}
            color="primary"
            variant="outlined"
            sx={{ alignSelf: { xs: "flex-start", md: "center" } }}
          />
        )}
      </Stack>

      {preview.availableParts.length > 1 && (
        <Stack
          direction="row"
          spacing={1}
          sx={{ mb: 2, overflowX: "auto", pb: 0.5 }}
        >
          {preview.availableParts.map((part) => (
            <Chip
              key={part}
              label={getPartLabel(part)}
              color={activePart === part ? "primary" : "default"}
              onClick={() => scrollToPart(part)}
              variant={activePart === part ? "filled" : "outlined"}
              sx={{ flexShrink: 0, fontWeight: 700 }}
            />
          ))}
        </Stack>
      )}

      {loading && (
        <Box display="flex" justifyContent="center" mt={8}>
          <CircularProgress />
        </Box>
      )}

      {!loading && error && (
        <Paper sx={{ p: 3, textAlign: "center" }}>
          <Typography color="error">{error}</Typography>
        </Paper>
      )}

      {!loading && !error && questionCount === 0 && (
        <Paper sx={{ p: 3, textAlign: "center" }}>
          <Typography color="text.secondary">
            Đề thi này chưa có nhóm câu hỏi để xem trước.
          </Typography>
        </Paper>
      )}

      {!loading && !error && questionCount > 0 && (
        <Box display="flex" gap={2} alignItems="flex-start">
          <Box ref={containerRef} sx={{ flex: 1, minWidth: 0 }}>
            <Stack spacing={3}>
              {visibleGroups.map((group, groupIndex) => (
                <Box key={group.id} id={`preview-part-${group.part}`}>
                  {groupIndex === 0 && (
                    <Typography
                      variant="subtitle1"
                      fontWeight={800}
                      sx={{ mb: 1 }}
                    >
                      {getPartLabel(group.part)}
                    </Typography>
                  )}
                  <GroupPreviewCard
                    group={group}
                    focusedQuestionId={focusedQuestionId}
                  />
                </Box>
              ))}
            </Stack>
          </Box>

          <PreviewNavigator
            groups={preview.groups}
            availableParts={preview.availableParts}
            activePart={activePart}
            onPartClick={scrollToPart}
            onQuestionClick={scrollToQuestion}
          />
        </Box>
      )}
    </Box>
  );
}

function GroupPreviewCard({
  group,
  focusedQuestionId,
}: {
  group: PreviewGroup;
  focusedQuestionId: string | null;
}) {
  return (
    <Paper sx={{ p: { xs: 2, md: 2.5 }, borderRadius: 2 }}>
      {group.audioUrl && (
        <Box sx={{ mb: 2 }}>
          <audio src={group.audioUrl} controls style={{ width: "100%" }} />
        </Box>
      )}

      {group.imagesUrl.length > 0 && (
        <Stack spacing={1.5} sx={{ mb: 2 }}>
          {group.imagesUrl.map((url, index) => (
            <Box
              component="img"
              key={`${url}-${index}`}
              src={url}
              alt={`preview-${index + 1}`}
              sx={{
                width: "100%",
                maxHeight: 420,
                objectFit: "contain",
                border: "1px solid #E5E7EB",
                borderRadius: 2,
                bgcolor: "#fff",
              }}
            />
          ))}
        </Stack>
      )}

      <TranscriptBox
        english={group.transcriptEnglish}
        translation={group.transcriptTranslation}
      />

      <Stack spacing={2} sx={{ mt: 2 }}>
        {group.questions.map((question) => (
          <QuestionPreviewBlock
            key={question.id}
            question={question}
            focused={focusedQuestionId === question.id}
          />
        ))}
      </Stack>
    </Paper>
  );
}

function QuestionPreviewBlock({
  question,
  focused,
}: {
  question: PreviewQuestion;
  focused: boolean;
}) {
  const [openExplain, setOpenExplain] = useState(false);

  return (
    <Box
      data-question-id={question.id}
      sx={{
        p: 2,
        scrollMarginTop: "96px",
        borderRadius: 2,
        border: "1px solid #86EFAC",
        bgcolor: "#F0FDF4",
        transition: "box-shadow 0.25s ease, transform 0.25s ease",
        boxShadow: focused ? "0 0 0 3px rgba(37, 99, 235, 0.35)" : "none",
        transform: focused ? "translateY(-2px)" : "none",
      }}
    >
      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "flex-start", sm: "center" }}
        spacing={1}
        sx={{ mb: 1 }}
      >
        <Typography
          variant="subtitle2"
          fontWeight={800}
          sx={{ color: "primary.main" }}
        >
          {question.questionNo}. {question.textQuestion || question.name || ""}
        </Typography>
        <Chip label="Đúng" color="success" size="small" />
      </Stack>

      <Stack spacing={0.75}>
        {Object.entries(question.choices).map(([key, value]) => {
          const isCorrect = key === question.correctAnswer;
          return (
            <Box
              key={key}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                p: 1,
                borderRadius: 1.5,
                bgcolor: isCorrect ? "#DCFCE7" : "#fff",
                border: `1px solid ${isCorrect ? "#86EFAC" : "#E5E7EB"}`,
              }}
            >
              <Typography
                sx={{
                  fontSize: 15,
                  color: isCorrect ? "success.main" : "text.primary",
                  fontWeight: isCorrect ? 800 : 500,
                }}
              >
                {key}. {value}
              </Typography>
              {isCorrect && (
                <CheckCircleOutlineIcon fontSize="small" color="success" />
              )}
            </Box>
          );
        })}
      </Stack>

      <Divider sx={{ my: 1.25 }} />
      <Typography variant="body2" color="success.main" fontWeight={800}>
        Đáp án đúng: {question.correctAnswer || "-"}
      </Typography>

      {question.explanation && (
        <Box sx={{ mt: 0.5 }}>
          <Button
            endIcon={openExplain ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            size="small"
            onClick={() => setOpenExplain((value) => !value)}
            sx={{ color: "text.primary", fontWeight: 700, px: 0 }}
          >
            Giải thích chi tiết đáp án
          </Button>
          <Collapse in={openExplain}>
            <Typography
              sx={{
                whiteSpace: "pre-line",
                mt: 0.5,
                bgcolor: "#F9FAFB",
                p: 1.5,
                borderRadius: 1,
              }}
            >
              {question.explanation}
            </Typography>
          </Collapse>
        </Box>
      )}
    </Box>
  );
}

function TranscriptBox({
  english,
  translation,
}: {
  english?: string;
  translation?: string;
}) {
  const [open, setOpen] = useState(false);
  if (!english && !translation) return null;

  return (
    <Box sx={{ mb: 1 }}>
      <Button
        size="small"
        endIcon={open ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        onClick={() => setOpen((value) => !value)}
        sx={{ fontWeight: 700, px: 0 }}
      >
        Hiện transcript
      </Button>
      <Collapse in={open}>
        {english && (
          <Typography
            sx={{
              whiteSpace: "pre-line",
              mt: 0.5,
              bgcolor: "#E5F4FF",
              p: 1.25,
              borderRadius: 1,
            }}
          >
            {english}
          </Typography>
        )}
        {translation && (
          <Typography
            sx={{
              whiteSpace: "pre-line",
              color: "text.secondary",
              mt: 0.75,
              bgcolor: "#F3F4F6",
              p: 1.25,
              borderRadius: 1,
            }}
          >
            {translation}
          </Typography>
        )}
      </Collapse>
    </Box>
  );
}

function PreviewNavigator({
  groups,
  availableParts,
  activePart,
  onPartClick,
  onQuestionClick,
}: {
  groups: PreviewGroup[];
  availableParts: number[];
  activePart: number | null;
  onPartClick: (part: number) => void;
  onQuestionClick: (questionId: string) => void;
}) {
  return (
    <Box
      sx={{
        display: { xs: "none", lg: "block" },
        width: 240,
        position: "sticky",
        top: 12,
        alignSelf: "flex-start",
      }}
    >
      <Paper
        sx={{
          p: 2,
          borderRadius: 2,
          maxHeight: "calc(100vh - 24px)",
          overflowY: "auto",
          overscrollBehavior: "contain",
        }}
      >
        <Typography variant="subtitle2" fontWeight={800} sx={{ mb: 1 }}>
          Điều hướng
        </Typography>
        {availableParts.map((part) => {
          const questions = groups
            .filter((group) => group.part === part)
            .flatMap((group) => group.questions)
            .sort((a, b) => a.questionNo - b.questionNo);
          if (!questions.length) return null;

          return (
            <Box key={part} sx={{ mb: 1.5 }}>
              <Chip
                size="small"
                label={getPartLabel(part)}
                color={activePart === part ? "primary" : "default"}
                variant={activePart === part ? "filled" : "outlined"}
                onClick={() => onPartClick(part)}
                sx={{ mb: 0.75, fontWeight: 700 }}
              />
              <Box sx={{ display: "flex", gap: 0.5, flexWrap: "wrap" }}>
                {questions.map((question) => {
                  const sxStyle: SxProps<Theme> = {
                    minWidth: 36,
                    p: 0,
                    fontSize: 12,
                    bgcolor: "#D1FADF",
                    color: "#065F46",
                    border: "none",
                    "&:hover": { bgcolor: "#A7F3D0", border: "none" },
                  };

                  return (
                    <Button
                      key={question.id}
                      size="small"
                      variant="outlined"
                      sx={sxStyle}
                      onClick={() => onQuestionClick(question.id)}
                    >
                      {question.questionNo}
                    </Button>
                  );
                })}
              </Box>
            </Box>
          );
        })}
      </Paper>
    </Box>
  );
}
