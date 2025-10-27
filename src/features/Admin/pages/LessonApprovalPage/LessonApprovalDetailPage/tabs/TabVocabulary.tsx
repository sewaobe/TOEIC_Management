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
import VisibilityIcon from "@mui/icons-material/Visibility";
import { motion, AnimatePresence } from "framer-motion";
import { EmptyState } from "../../../../../../components/EmptyState";
import { VocabularyTopicTrailer } from "../../../../../../types/LessonManagerDetail";
import {
  getIconComponentByName,
  mapBgToIconColor,
} from "../../../../../../utils/colorMapFromBg";
import VocabularyDetailDialog from "../detail/VocabularyDetailDialog";

export default function TabVocabulary({ lessonManager }: { lessonManager: any }) {
  const theme = useTheme();
  const [expanded, setExpanded] = useState<string | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<any | null>(null);

  const toggleExpand = (id: string) =>
    setExpanded(expanded === id ? null : id);

  const fade = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.3 },
  };

  return (
    <>
      <AnimatePresence>
        <motion.div {...fade}>
          {lessonManager.topic_vocabulary_ids?.length ? (
            lessonManager.topic_vocabulary_ids.map((v: VocabularyTopicTrailer) => {
              const { IconComponent, bgColor } = getIconComponentByName(v.iconName);
              const iconBg =
                theme.palette.mode === "dark"
                  ? "rgba(255,255,255,0.08)"
                  : bgColor;
              const iconColor =
                theme.palette.mode === "dark"
                  ? theme.palette.primary.light
                  : mapBgToIconColor(bgColor);

              return (
                <Card
                  key={v._id}
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
                    onClick={() => toggleExpand(v._id)}
                  >
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                      {/* Icon chủ đề */}
                      <Box
                        sx={{
                          width: 40,
                          height: 40,
                          borderRadius: 2,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          bgcolor: iconBg,
                          color: iconColor,
                        }}
                      >
                        <IconComponent fontSize="medium" />
                      </Box>

                      {/* Thông tin chủ đề */}
                      <Box>
                        <Typography variant="subtitle1" fontWeight={600}>
                          {v.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          📚 {v.vocabularies_id.length} từ • Level {v.level}
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
                          setSelectedTopic(v);
                        }}
                      >
                        Xem chi tiết
                      </Button>
                      <ExpandMoreIcon
                        sx={{
                          transform:
                            expanded === v._id ? "rotate(180deg)" : "rotate(0deg)",
                          transition: "transform 0.3s",
                          color: theme.palette.text.secondary,
                        }}
                      />
                    </Box>
                  </Box>

                  {/* Collapse body */}
                  <Collapse in={expanded === v._id} timeout="auto" unmountOnExit>
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
                      {v.vocabularies_id?.length ? (
                        v.vocabularies_id.map((w, i) => (
                          <Typography
                            key={i}
                            variant="body2"
                            sx={{
                              color: theme.palette.text.secondary,
                              mb: 0.5,
                              "& span": {
                                fontWeight: 600,
                                color: theme.palette.text.primary,
                              },
                            }}
                          >
                            • <span>{w.word}</span>: {w.definition}
                          </Typography>
                        ))
                      ) : (
                        <EmptyState
                          title="Không có từ vựng"
                          description="Chủ đề này chưa có từ."
                          mode="empty"
                        />
                      )}
                    </CardContent>
                  </Collapse>
                </Card>
              );
            })
          ) : (
            <EmptyState
              mode="empty"
              title="Không có dữ liệu"
              description="Hiện không có topic từ vựng nào."
            />
          )}
        </motion.div>
      </AnimatePresence>

      {/* Modal chi tiết */}
      {selectedTopic && (
        <VocabularyDetailDialog
          open={!!selectedTopic}
          vocab={selectedTopic}
          onClose={() => setSelectedTopic(null)}
        />
      )}
    </>
  );
}
