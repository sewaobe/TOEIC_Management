import { useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Collapse,
  Button,
  Chip,
  useTheme,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  PlayCircleOutline,
  WarningAmber as ErrorIcon,
  MenuBook as ExampleIcon,
  Article as TextIcon,
  TableChart as TableIcon,
} from "@mui/icons-material";
import MovieIcon from "@mui/icons-material/Movie";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { motion, AnimatePresence } from "framer-motion";
import { EmptyState } from "../../../../../../components/EmptyState";
import { LessonTrailer } from "../../../../../../types/LessonManagerDetail";
import { LessonSection } from "../../../../../../types/lesson";
import LessonPreviewDialog from "../detail/LessonPreviewDialog";

export default function TabMainLesson({ lessonManager }: { lessonManager: any }) {
  const theme = useTheme();
  const [expanded, setExpanded] = useState<string | null>(null);
  const [selectedLesson, setSelectedLesson] = useState<any | null>(null);

  const toggleExpand = (id: string) => setExpanded(expanded === id ? null : id);

  const fade = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.3 },
  };

  // 🎨 Helper map: type → color
  const typeColors: Record<
    string,
    { color: string; bgLight: string; bgDark: string }
  > = {
    media: { color: "#1E88E5", bgLight: "#E3F2FD", bgDark: "rgba(33,150,243,0.1)" },
    example: { color: "#43A047", bgLight: "#E8F5E9", bgDark: "rgba(76,175,80,0.1)" },
    error: { color: "#E53935", bgLight: "#FFEBEE", bgDark: "rgba(244,67,54,0.1)" },
    table: { color: "#FB8C00", bgLight: "#FFF3E0", bgDark: "rgba(255,152,0,0.1)" },
    text: { color: "#616161", bgLight: "#FAFAFA", bgDark: "rgba(255,255,255,0.05)" },
  };

  const getBg = (item: any) =>
    theme.palette.mode === "dark" ? item.bgDark : item.bgLight;

  return (
    <>
      <AnimatePresence>
        <motion.div {...fade}>
          {lessonManager.lesson_ids?.length ? (
            lessonManager.lesson_ids.map((lesson: LessonTrailer) => (
              <Card
                key={lesson._id}
                sx={{
                  borderRadius: 3,
                  boxShadow: theme.shadows[1],
                  overflow: "hidden",
                  mb: 2,
                  bgcolor: theme.palette.background.paper,
                  border: `1px solid ${theme.palette.divider}`,
                  transition: "box-shadow 0.3s ease",
                  "&:hover": {
                    boxShadow: theme.shadows[4],
                  },
                }}
              >
                {/* Header */}
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    p: 2.5,
                    bgcolor: theme.palette.background.paper,
                    borderBottom: `1px solid ${theme.palette.divider}`,
                    cursor: "pointer",
                    transition: "background 0.25s",
                    "&:hover": {
                      bgcolor:
                        theme.palette.mode === "dark"
                          ? "rgba(255,255,255,0.05)"
                          : "rgba(0,0,0,0.03)",
                    },
                  }}
                  onClick={() => toggleExpand(lesson._id)}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <PlayCircleOutline color="success" />
                    <Box>
                      <Typography variant="subtitle1" fontWeight={600}>
                        {lesson.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        📚 {lesson.sections_id.length} phần • Part {lesson.part_type} • ⏱{" "}
                        {lesson.planned_completion_time} phút
                      </Typography>
                    </Box>
                  </Box>

                  {/* Button + arrow */}
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Button
                      variant="contained"
                      size="small"
                      color="primary"
                      startIcon={<VisibilityIcon />}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedLesson({
                          title: lesson.title,
                          summary: lesson.summary,
                          sections: lesson.sections_id || [],
                        });
                      }}
                      sx={{
                        borderRadius: 1.5,
                        textTransform: "none",
                        fontWeight: 500,
                        boxShadow: "none",
                      }}
                    >
                      Xem chi tiết
                    </Button>
                    <ExpandMoreIcon
                      sx={{
                        transform:
                          expanded === lesson._id ? "rotate(180deg)" : "rotate(0deg)",
                        transition: "transform 0.3s",
                        color: theme.palette.text.secondary,
                      }}
                    />
                  </Box>
                </Box>

                {/* Collapse body */}
                <Collapse in={expanded === lesson._id} timeout="auto" unmountOnExit>
                  <CardContent
                    sx={{
                      bgcolor:
                        theme.palette.mode === "dark"
                          ? "rgba(255,255,255,0.04)"
                          : theme.palette.grey[50],
                      borderTop: `1px solid ${theme.palette.divider}`,
                      p: 3,
                      transition: "background 0.3s",
                    }}
                  >
                    {lesson.sections_id?.length ? (
                      lesson.sections_id.map((section: LessonSection, idx: number) => {
                        const colorMap =
                          typeColors[section.type] || typeColors.text;
                        const bg = getBg(colorMap);

                        let icon: JSX.Element;
                        let label = "";
                        let preview = "";

                        switch (section.type) {
                          case "media":
                            icon = (
                              <MovieIcon sx={{ color: colorMap.color }} fontSize="small" />
                            );
                            label = "Media";
                            preview = section.medias_id?.length
                              ? `🎬 ${section.medias_id.length} media`
                              : "Chưa có media";
                            break;
                          case "example":
                            icon = (
                              <ExampleIcon sx={{ color: colorMap.color }} fontSize="small" />
                            );
                            label = "Ví dụ";
                            preview = section.example?.en
                              ? `"${section.example.en}" — ${section.example.vi || ""}`
                              : "Chưa có ví dụ minh họa";
                            break;
                          case "error":
                            icon = (
                              <ErrorIcon sx={{ color: colorMap.color }} fontSize="small" />
                            );
                            label = "Lỗi sai";
                            preview = section.error?.wrong
                              ? `❌ ${section.error.wrong} → ✅ ${section.error.correct}`
                              : "Chưa có cặp lỗi/sửa";
                            break;
                          case "table":
                            icon = (
                              <TableIcon sx={{ color: colorMap.color }} fontSize="small" />
                            );
                            label = "Bảng";
                            preview = section.tableData?.length
                              ? `📊 ${section.tableData.length} hàng × ${
                                  section.tableData[0]?.length || 0
                                } cột`
                              : "Bảng trống";
                            break;
                          default:
                            icon = (
                              <TextIcon sx={{ color: colorMap.color }} fontSize="small" />
                            );
                            label = "Văn bản";
                            preview = section.content
                              ? section.content.slice(0, 100) +
                                (section.content.length > 100 ? "..." : "")
                              : "Chưa có nội dung";
                        }

                        return (
                          <Box
                            key={section._id || idx}
                            sx={{
                              display: "flex",
                              alignItems: "flex-start",
                              justifyContent: "space-between",
                              p: 2,
                              borderRadius: 2,
                              border: `1px solid ${theme.palette.divider}`,
                              bgcolor: theme.palette.background.paper,
                              mb: 1.5,
                              boxShadow: theme.shadows[0],
                              transition: "background 0.25s, box-shadow 0.25s",
                              "&:hover": {
                                bgcolor: bg,
                                boxShadow: theme.shadows[2],
                              },
                            }}
                          >
                            <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2 }}>
                              <Box
                                sx={{
                                  width: 36,
                                  height: 36,
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  borderRadius: 1.5,
                                  bgcolor: bg,
                                  color: colorMap.color,
                                }}
                              >
                                {icon}
                              </Box>
                              <Box>
                                <Typography variant="body2" fontWeight={600}>
                                  {idx + 1}. {section.title || "Chưa có tiêu đề"}
                                </Typography>
                                <Typography
                                  variant="body2"
                                  color="text.secondary"
                                  sx={{ mt: 0.5, lineHeight: 1.6 }}
                                >
                                  {preview}
                                </Typography>
                              </Box>
                            </Box>
                            <Chip
                              label={label}
                              size="small"
                              sx={{
                                backgroundColor: bg,
                                color: colorMap.color,
                                fontWeight: 600,
                                borderRadius: 1,
                              }}
                            />
                          </Box>
                        );
                      })
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        Không có section nào.
                      </Typography>
                    )}
                  </CardContent>
                </Collapse>
              </Card>
            ))
          ) : (
            <EmptyState
              mode="empty"
              title="Không có dữ liệu"
              description="Hiện không có bài học chính nào."
            />
          )}
        </motion.div>
      </AnimatePresence>

      {/* Modal chi tiết bài học */}
      {selectedLesson && (
        <LessonPreviewDialog
          open={!!selectedLesson}
          onClose={() => setSelectedLesson(null)}
          lesson={selectedLesson}
        />
      )}
    </>
  );
}
