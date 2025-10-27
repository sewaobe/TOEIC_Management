import { useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Collapse,
  Button,
  useTheme,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import QuizIcon from "@mui/icons-material/Quiz";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { motion, AnimatePresence } from "framer-motion";
import { EmptyState } from "../../../../../../components/EmptyState";
import { QuizTrailer } from "../../../../../../types/LessonManagerDetail";
import QuizDetailDialog from "../detail/QuizDetailDialog";

export default function TabQuiz({ lessonManager }: { lessonManager: any }) {
  const theme = useTheme();
  const [expanded, setExpanded] = useState<string | null>(null);
  const [selectedQuiz, setSelectedQuiz] = useState<any | null>(null);

  const toggleExpand = (id: string) => {
    setExpanded(expanded === id ? null : id);
  };

  const fade = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.3 },
  };

  return (
    <>
      <AnimatePresence>
        <motion.div {...fade}>
          {lessonManager.quiz_ids?.length ? (
            lessonManager.quiz_ids.map((q: QuizTrailer) => (
              <Card
                key={q._id}
                sx={{
                  borderRadius: 3,
                  boxShadow: theme.shadows[1],
                  overflow: "hidden",
                  mb: 2,
                  bgcolor: theme.palette.background.paper,
                  border: `1px solid ${theme.palette.divider}`,
                  transition: "box-shadow 0.3s",
                  "&:hover": { boxShadow: theme.shadows[3] },
                }}
              >
                {/* Header */}
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    p: 2.5,
                    borderBottom: `1px solid ${theme.palette.divider}`,
                    cursor: "pointer",
                    bgcolor: theme.palette.background.paper,
                    transition: "background 0.25s",
                    "&:hover": {
                      bgcolor:
                        theme.palette.mode === "dark"
                          ? "rgba(255,255,255,0.05)"
                          : "rgba(0,0,0,0.03)",
                    },
                  }}
                  onClick={() => toggleExpand(q._id)}
                >
                  {/* Thông tin chính */}
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <QuizIcon color="secondary" />
                    <Box>
                      <Typography variant="subtitle1" fontWeight={600}>
                        {q.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        🧩 Part {q.part_type} • {q.level || "Không rõ"} • ⏱{" "}
                        {q.planned_completion_time} phút
                      </Typography>
                    </Box>
                  </Box>

                  {/* Nút xem chi tiết + mũi tên */}
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<VisibilityIcon />}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedQuiz(q);
                      }}
                    >
                      Xem chi tiết
                    </Button>
                    <ExpandMoreIcon
                      sx={{
                        transform:
                          expanded === q._id ? "rotate(180deg)" : "rotate(0deg)",
                        transition: "transform 0.3s",
                        color: theme.palette.text.secondary,
                      }}
                    />
                  </Box>
                </Box>

                {/* Body */}
                <Collapse in={expanded === q._id} timeout="auto" unmountOnExit>
                  <CardContent
                    sx={{
                      bgcolor:
                        theme.palette.mode === "dark"
                          ? "rgba(255,255,255,0.04)"
                          : theme.palette.grey[50],
                      borderTop: `1px solid ${theme.palette.divider}`,
                      p: 3,
                    }}
                  >
                    {q.question_ids?.length ? (
                      q.question_ids.map((question: any, qi: number) => (
                        <Box
                          key={question._id || qi}
                          sx={{
                            p: 2,
                            borderRadius: 2,
                            border: `1px solid ${theme.palette.divider}`,
                            bgcolor: theme.palette.background.paper,
                            mb: 1.5,
                            transition: "background 0.25s, box-shadow 0.25s",
                            "&:hover": {
                              boxShadow: theme.shadows[2],
                              bgcolor:
                                theme.palette.mode === "dark"
                                  ? "rgba(255,255,255,0.06)"
                                  : "rgba(0,0,0,0.02)",
                            },
                          }}
                        >
                          {/* Câu hỏi */}
                          <Typography
                            variant="body2"
                            fontWeight={600}
                            sx={{ mb: 1 }}
                          >
                            {qi + 1}. {question.textQuestion}
                          </Typography>

                          {/* Danh sách lựa chọn */}
                          <Box sx={{ pl: 3, display: "flex", flexDirection: "column", gap: 0.5 }}>
                            {question.choices &&
                              Object.entries(question.choices).map(
                                ([key, value]) => {
                                  const isCorrect =
                                    question.correctAnswer === key;
                                  return (
                                    <Typography
                                      key={key}
                                      variant="body2"
                                      sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 1,
                                        fontWeight: isCorrect ? 600 : 400,
                                        color: isCorrect
                                          ? theme.palette.success.main
                                          : theme.palette.text.primary,
                                      }}
                                    >
                                      {isCorrect ? "✅" : "•"} {key}.{" "}
                                      {value as string}
                                    </Typography>
                                  );
                                }
                              )}
                          </Box>
                        </Box>
                      ))
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        Bài quiz này chưa có câu hỏi nào.
                      </Typography>
                    )}
                  </CardContent>
                </Collapse>
              </Card>
            ))
          ) : (
            <EmptyState
              mode="empty"
              title="Không có quiz"
              description="Hiện không có bài quiz nào."
            />
          )}
        </motion.div>
      </AnimatePresence>

      {/* 🔹 Modal xem chi tiết */}
      {selectedQuiz && (
        <QuizDetailDialog
          open={!!selectedQuiz}
          onClose={() => setSelectedQuiz(null)}
          quizId={selectedQuiz._id}
        />
      )}
    </>
  );
}
