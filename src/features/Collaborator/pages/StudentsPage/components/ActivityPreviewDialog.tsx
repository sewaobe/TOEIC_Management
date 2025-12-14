import { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  IconButton,
  CircularProgress,
  Chip,
  Divider,
  Stack,
  Paper,
  useTheme,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import QuizIcon from "@mui/icons-material/Quiz";
import StyleIcon from "@mui/icons-material/Style";
import RecordVoiceOverIcon from "@mui/icons-material/RecordVoiceOver";
import MicIcon from "@mui/icons-material/Mic";
import AssignmentIcon from "@mui/icons-material/Assignment";
import {
  Description,
  ErrorOutline,
  Chat,
  Image as ImageIcon,
  Movie,
} from "@mui/icons-material";
import { motion } from "framer-motion";
import {
  activityService,
  ActivityDetail,
} from "../../../../../services/activityService";

interface ActivityPreviewDialogProps {
  open: boolean;
  onClose: () => void;
  activityId: string | null;
  kind: string | null;
}

export function ActivityPreviewDialog({
  open,
  onClose,
  activityId,
  kind,
}: ActivityPreviewDialogProps) {
  const theme = useTheme();
  const [loading, setLoading] = useState(false);
  const [activity, setActivity] = useState<ActivityDetail | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open && activityId && kind) {
      loadActivityDetails();
    } else {
      setActivity(null);
      setError(null);
    }
  }, [open, activityId, kind]);

  const loadActivityDetails = async () => {
    if (!activityId || !kind) return;

    setLoading(true);
    setError(null);
    try {
      const data = await activityService.getActivityDetails(activityId, kind);
      setActivity(data);
    } catch (err: any) {
      console.error("Failed to load activity details", err);
      setError(err?.message || "Không thể tải chi tiết hoạt động");
    } finally {
      setLoading(false);
    }
  };

  const getActivityIcon = (activityKind: string) => {
    switch (activityKind?.toLowerCase()) {
      case "lesson":
        return <MenuBookIcon />;
      case "quiz":
        return <QuizIcon />;
      case "flash_card":
      case "flashcard":
        return <StyleIcon />;
      case "dictation":
        return <RecordVoiceOverIcon />;
      case "shadowing":
        return <MicIcon />;
      case "mini_test":
      case "minitest":
        return <AssignmentIcon />;
      default:
        return null;
    }
  };

  const getActivityLabel = (activityKind: string) => {
    switch (activityKind?.toLowerCase()) {
      case "lesson":
        return "Bài học";
      case "quiz":
        return "Bài tập";
      case "flash_card":
      case "flashcard":
        return "Flashcard";
      case "dictation":
        return "Chính tả";
      case "shadowing":
        return "Shadowing";
      case "mini_test":
      case "minitest":
        return "Mini Test";
      default:
        return activityKind;
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "text":
        return <Description color="primary" />;
      case "example":
        return <Chat color="secondary" />;
      case "error":
        return <ErrorOutline color="error" />;
      case "media":
        return <Movie color="info" />;
      case "table":
        return <ImageIcon color="success" />;
      default:
        return <ImageIcon color="disabled" />;
    }
  };

  const getYouTubeEmbedUrl = (url: string) => {
    const youtubeRegex =
      /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = url.match(youtubeRegex);
    return match ? `https://www.youtube.com/embed/${match[1]}` : null;
  };

  const renderLessonSection = (section: any) => {
    switch (section.type) {
      case "text":
        return (
          <Typography sx={{ whiteSpace: "pre-wrap" }}>
            {section.content}
          </Typography>
        );
      case "example":
        return (
          <Paper
            variant="outlined"
            sx={{
              p: 2,
              borderRadius: 2,
              bgcolor:
                theme.palette.mode === "dark"
                  ? "rgba(255,255,255,0.05)"
                  : theme.palette.grey[50],
            }}
          >
            <Typography>
              <strong>EN:</strong> {section.example?.en}
            </Typography>
            <Typography>
              <strong>VI:</strong> {section.example?.vi}
            </Typography>
            {section.example?.note && (
              <Typography variant="caption" color="text.secondary">
                <em>Note: {section.example.note}</em>
              </Typography>
            )}
          </Paper>
        );
      case "error":
        return (
          <Paper
            variant="outlined"
            sx={{
              p: 2,
              borderLeft: `4px solid ${theme.palette.error.main}`,
              borderRadius: 2,
            }}
          >
            <Typography color="error" fontWeight={600}>
              Sai: {section.error?.wrong}
            </Typography>
            <Typography color="success.main" fontWeight={600}>
              Đúng: {section.error?.correct}
            </Typography>
            <Divider sx={{ my: 1 }} />
            <Typography variant="body2" color="text.secondary">
              Giải thích: {section.error?.explanation || "—"}
            </Typography>
          </Paper>
        );
      case "media": {
        // medias_id is populated with Media objects
        const medias = section.medias_id || [];
        if (medias.length === 0) {
          return <Typography color="text.secondary">Không có media</Typography>;
        }

        return (
          <Stack spacing={2}>
            {medias.map((media: any, idx: number) => {
              const url = media.url || media.path || "";
              const type = media.type || "";

              // YouTube embed
              const embedUrl = getYouTubeEmbedUrl(url);
              if (embedUrl) {
                return (
                  <Box
                    key={idx}
                    sx={{
                      position: "relative",
                      paddingBottom: "56.25%",
                      height: 0,
                      borderRadius: 2,
                      overflow: "hidden",
                    }}
                  >
                    <iframe
                      src={embedUrl}
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        border: 0,
                      }}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </Box>
                );
              }

              if (type === "video/youtube") {
                return (
                  <Typography key={idx} variant="body2" color="primary">
                    <a href={url} target="_blank" rel="noopener noreferrer">
                      🎥 YouTube: {url}
                    </a>
                  </Typography>
                );
              }

              // Image
              if (
                type.startsWith("image/") ||
                /\.(jpg|jpeg|png|gif|svg|webp)$/i.test(url)
              ) {
                return (
                  <img
                    key={idx}
                    src={url}
                    alt={`Media ${idx + 1}`}
                    style={{ width: "100%", borderRadius: 8 }}
                  />
                );
              }

              // Video
              if (type.startsWith("video/") || /\.(mp4|webm|ogg)$/i.test(url)) {
                return (
                  <video
                    key={idx}
                    controls
                    src={url}
                    style={{ width: "100%", borderRadius: 8 }}
                  />
                );
              }

              // Audio
              if (type.startsWith("audio/") || /\.(mp3|wav|ogg)$/i.test(url)) {
                return (
                  <audio
                    key={idx}
                    controls
                    src={url}
                    style={{ width: "100%" }}
                  />
                );
              }

              // Fallback link
              return (
                <Typography key={idx} variant="body2" color="primary">
                  <a href={url} target="_blank" rel="noopener noreferrer">
                    🔗 {media.filename || "Media file"}
                  </a>
                </Typography>
              );
            })}
          </Stack>
        );
      }
      case "table":
        return section.tableData && section.tableData.length > 0 ? (
          <TableContainer component={Paper} variant="outlined">
            <Table size="small">
              <TableBody>
                {section.tableData.map((row: string[], rIdx: number) => (
                  <TableRow key={rIdx}>
                    {row.map((cell: string, cIdx: number) => (
                      <TableCell key={cIdx}>{cell}</TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : null;
      default:
        return (
          <Typography color="text.secondary">
            Không hỗ trợ loại section này
          </Typography>
        );
    }
  };

  const renderLessonContent = (data: any) => (
    <Stack spacing={3}>
      <Paper
        sx={{
          p: 3,
          borderRadius: 2,
          bgcolor: theme.palette.background.paper,
          border: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Tóm tắt:
        </Typography>
        <Typography variant="body1">
          {data.summary || "Không có mô tả"}
        </Typography>
        <Divider sx={{ my: 2 }} />
        <Stack direction="row" spacing={2} flexWrap="wrap">
          {data.part_type && (
            <Chip
              label={`Part ${data.part_type}`}
              size="small"
              color="primary"
            />
          )}
          {data.planned_completion_time && (
            <Chip label={`${data.planned_completion_time} phút`} size="small" />
          )}
          {data.weight && (
            <Chip
              label={`Điểm: ${data.weight}`}
              size="small"
              variant="outlined"
            />
          )}
        </Stack>
      </Paper>

      {data.sections_id && data.sections_id.length > 0 && (
        <Box>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
            📚 Nội dung bài học
          </Typography>
          <Stack spacing={2}>
            {data.sections_id.map((section: any, idx: number) => (
              <Paper
                key={idx}
                component={motion.div}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                sx={{
                  p: 2,
                  borderRadius: 2,
                  border: `1px solid ${theme.palette.divider}`,
                }}
              >
                <Stack direction="row" alignItems="center" spacing={1} mb={1}>
                  {getIcon(section.type)}
                  <Typography variant="subtitle1" fontWeight={600}>
                    {section.title || `Section ${idx + 1}`}
                  </Typography>
                </Stack>
                {renderLessonSection(section)}
              </Paper>
            ))}
          </Stack>
        </Box>
      )}
    </Stack>
  );

  const renderQuizContent = (data: any) => (
    <Stack spacing={3}>
      <Paper
        sx={{
          p: 3,
          borderRadius: 2,
          bgcolor: theme.palette.background.paper,
          border: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Typography variant="h5" color="primary" fontWeight="bold" gutterBottom>
          {data.title}
        </Typography>
        <Divider sx={{ my: 2 }} />
        <Stack direction="row" spacing={2} flexWrap="wrap">
          {data.level && (
            <Chip label={data.level} size="small" color="primary" />
          )}
          {data.part_type && (
            <Chip label={`Part ${data.part_type}`} size="small" />
          )}
          {data.planned_completion_time && (
            <Chip
              label={`${data.planned_completion_time} phút`}
              size="small"
              variant="outlined"
            />
          )}
          {data.status && (
            <Chip
              label={data.status === "draft" ? "Nháp" : "Công khai"}
              size="small"
              variant="outlined"
            />
          )}
        </Stack>
      </Paper>

      {data.question_ids && data.question_ids.length > 0 && (
        <Box>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
            ❓ Danh sách câu hỏi ({data.question_ids.length})
          </Typography>
          <Stack spacing={2}>
            {data.question_ids.map((question: any, idx: number) => (
              <Paper
                key={idx}
                component={motion.div}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                sx={{
                  p: 3,
                  borderRadius: 2,
                  border: `1px solid ${theme.palette.divider}`,
                  bgcolor: theme.palette.background.paper,
                }}
              >
                <Typography
                  variant="subtitle1"
                  fontWeight={600}
                  color="primary"
                  gutterBottom
                >
                  {question.name || `Câu ${idx + 1}`}
                </Typography>
                <Typography variant="body1" gutterBottom>
                  {question.textQuestion ||
                    question.question_text ||
                    question.content ||
                    "Không có nội dung"}
                </Typography>
                {question.audio_url && (
                  <Box my={2}>
                    <audio
                      controls
                      src={question.audio_url}
                      style={{ width: "100%", maxWidth: 400 }}
                    />
                  </Box>
                )}
                {question.image_url && (
                  <Box my={2}>
                    <img
                      src={question.image_url}
                      alt={`Câu ${idx + 1}`}
                      style={{
                        maxWidth: "100%",
                        maxHeight: 200,
                        objectFit: "contain",
                        borderRadius: 8,
                      }}
                    />
                  </Box>
                )}
                {question.choices &&
                  Object.keys(question.choices).length > 0 && (
                    <Box mt={2}>
                      <Typography variant="subtitle2" gutterBottom>
                        Đáp án:
                      </Typography>
                      <Stack spacing={1}>
                        {Object.entries(question.choices).map(
                          ([key, text]: [string, any]) => {
                            const isCorrect = question.correctAnswer === key;
                            return (
                              <Box
                                key={key}
                                sx={{
                                  p: 1.5,
                                  borderRadius: 1,
                                  bgcolor: isCorrect
                                    ? "success.light"
                                    : "background.default",
                                  border: isCorrect
                                    ? `2px solid ${theme.palette.success.main}`
                                    : `1px solid ${theme.palette.divider}`,
                                }}
                              >
                                <Typography
                                  variant="body2"
                                  color={
                                    isCorrect ? "success.dark" : "text.primary"
                                  }
                                  sx={{ fontWeight: isCorrect ? 600 : 400 }}
                                >
                                  {key}. {text}
                                  {isCorrect && " ✓"}
                                </Typography>
                              </Box>
                            );
                          }
                        )}
                      </Stack>
                    </Box>
                  )}
                {question.explanation && (
                  <Box mt={2} p={2} bgcolor="info.light" borderRadius={1}>
                    <Typography variant="body2" fontWeight={600}>
                      Giải thích:
                    </Typography>
                    <Typography variant="body2">
                      {question.explanation}
                    </Typography>
                  </Box>
                )}
              </Paper>
            ))}
          </Stack>
        </Box>
      )}
    </Stack>
  );

  const renderFlashcardContent = (data: any) => {
    // data là PracticeTopicVocabulary, có vocabulary_words được populate
    const vocabularies = data.vocabulary_words || [];

    return (
      <Stack spacing={3}>
        <Paper
          sx={{
            p: 3,
            borderRadius: 2,
            bgcolor: theme.palette.background.paper,
            border: `1px solid ${theme.palette.divider}`,
          }}
        >
          <Typography
            variant="h5"
            color="primary"
            fontWeight="bold"
            gutterBottom
          >
            {data.title || "Flashcard"}
          </Typography>
          {data.description && (
            <Typography variant="body2" color="text.secondary" gutterBottom>
              {data.description}
            </Typography>
          )}
          <Divider sx={{ my: 2 }} />
          <Stack direction="row" spacing={1} flexWrap="wrap">
            {data.level && (
              <Chip label={data.level} size="small" color="primary" />
            )}
            {data.part_type && (
              <Chip label={`Part ${data.part_type}`} size="small" />
            )}
            <Chip
              label={`${vocabularies.length} từ vựng`}
              size="small"
              variant="outlined"
            />
            {data.tags &&
              data.tags.length > 0 &&
              data.tags.map((tag: string, i: number) => (
                <Chip key={i} label={tag} size="small" variant="outlined" />
              ))}
          </Stack>
        </Paper>

        {vocabularies.length > 0 && (
          <Box>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
              📚 Danh sách từ vựng
            </Typography>
            <Stack spacing={2}>
              {vocabularies.map((vocab: any, idx: number) => (
                <Paper
                  key={idx}
                  component={motion.div}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.03 }}
                  sx={{
                    p: 3,
                    borderRadius: 2,
                    border: `1px solid ${theme.palette.divider}`,
                    bgcolor: theme.palette.background.paper,
                  }}
                >
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="start"
                    spacing={2}
                  >
                    <Box flex={1}>
                      <Typography variant="h6" fontWeight={700} color="primary">
                        {vocab.word}
                      </Typography>
                      {vocab.phonetic && (
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ fontStyle: "italic", mb: 1 }}
                        >
                          /{vocab.phonetic}/
                        </Typography>
                      )}
                      <Stack direction="row" spacing={1} mb={1}>
                        {vocab.type && (
                          <Chip
                            label={vocab.type}
                            size="small"
                            variant="outlined"
                          />
                        )}
                        {vocab.level && (
                          <Chip
                            label={vocab.level}
                            size="small"
                            color="primary"
                          />
                        )}
                        {vocab.part && <Chip label={vocab.part} size="small" />}
                      </Stack>
                      {vocab.definitions && vocab.definitions.length > 0 && (
                        <Box mt={1}>
                          <Typography variant="subtitle2" fontWeight={600}>
                            Định nghĩa:
                          </Typography>
                          {vocab.definitions.map(
                            (def: string, dIdx: number) => (
                              <Typography
                                key={dIdx}
                                variant="body2"
                                color="text.primary"
                                sx={{ mt: 0.5 }}
                              >
                                {vocab.definitions.length > 1 &&
                                  `${dIdx + 1}. `}
                                {def}
                              </Typography>
                            )
                          )}
                        </Box>
                      )}
                      {vocab.hints && vocab.hints.length > 0 && (
                        <Box mt={1}>
                          <Typography variant="subtitle2" fontWeight={600}>
                            Gợi ý:
                          </Typography>
                          {vocab.hints.map((hint: string, hIdx: number) => (
                            <Typography
                              key={hIdx}
                              variant="body2"
                              color="text.secondary"
                              sx={{ mt: 0.5 }}
                            >
                              💡 {hint}
                            </Typography>
                          ))}
                        </Box>
                      )}
                      {vocab.examples && vocab.examples.length > 0 && (
                        <Box mt={1}>
                          <Typography variant="subtitle2" fontWeight={600}>
                            Ví dụ:
                          </Typography>
                          {vocab.examples.map(
                            (example: string, eIdx: number) => (
                              <Box
                                key={eIdx}
                                mt={0.5}
                                p={1.5}
                                bgcolor="action.hover"
                                borderRadius={1}
                              >
                                <Typography variant="body2" fontStyle="italic">
                                  "{example}"
                                </Typography>
                              </Box>
                            )
                          )}
                        </Box>
                      )}
                      {vocab.notes && (
                        <Box
                          mt={1}
                          p={1.5}
                          bgcolor="info.light"
                          borderRadius={1}
                        >
                          <Typography variant="body2">{vocab.notes}</Typography>
                        </Box>
                      )}
                    </Box>
                    <Box>
                      {vocab.image && (
                        <Box mb={1}>
                          <img
                            src={vocab.image}
                            alt={vocab.word}
                            style={{
                              width: 120,
                              height: 120,
                              objectFit: "cover",
                              borderRadius: 8,
                            }}
                          />
                        </Box>
                      )}
                      {vocab.audio && (
                        <audio
                          controls
                          src={vocab.audio}
                          style={{ width: 120 }}
                        />
                      )}
                    </Box>
                  </Stack>
                </Paper>
              ))}
            </Stack>
          </Box>
        )}
      </Stack>
    );
  };

  const renderDictationContent = (data: any) => (
    <Stack spacing={3}>
      <Paper
        sx={{
          p: 3,
          borderRadius: 3,
          background:
            theme.palette.mode === "dark"
              ? "linear-gradient(145deg, #1E293B, #111827)"
              : "linear-gradient(to right, #ECFDF5, #D1FAE5)",
        }}
      >
        <Stack direction="row" spacing={1} flexWrap="wrap" mb={2}>
          {data.level && (
            <Chip label={`Level ${data.level}`} size="small" color="primary" />
          )}
          {data.part_type && (
            <Chip label={`Part ${data.part_type}`} size="small" />
          )}
          {data.duration && (
            <Chip
              label={`${Math.floor(data.duration / 1000)} giây`}
              size="small"
              variant="outlined"
            />
          )}
          {data.display_mode && (
            <Chip
              label={data.display_mode}
              size="small"
              color="info"
              variant="outlined"
            />
          )}
        </Stack>
        {data.audio_url ? (
          <audio controls src={data.audio_url} style={{ width: "100%" }} />
        ) : (
          <Typography color="text.secondary">Không có file audio</Typography>
        )}
      </Paper>

      {data.transcript && (
        <Box>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
            📝 Nội dung Dictation
          </Typography>
          <Paper
            variant="outlined"
            sx={{
              p: 3,
              maxHeight: 400,
              overflow: "auto",
              bgcolor: theme.palette.background.paper,
              borderRadius: 2,
            }}
          >
            <Typography
              variant="body1"
              sx={{ whiteSpace: "pre-wrap", lineHeight: 1.8 }}
            >
              {data.transcript}
            </Typography>
          </Paper>
        </Box>
      )}

      {data.timings && data.timings.length > 0 && (
        <Box>
          <Typography variant="subtitle2" color="text.secondary">
            ✓ {data.timings.length} đoạn được đánh dấu thời gian
          </Typography>
        </Box>
      )}
    </Stack>
  );

  const renderShadowingContent = (data: any) => (
    <Stack spacing={3}>
      <Paper
        variant="outlined"
        sx={{
          p: 3,
          borderRadius: 3,
          background:
            theme.palette.mode === "dark"
              ? "linear-gradient(145deg, #1E293B, #111827)"
              : "linear-gradient(to right, #EEF2FF, #F5F7FF)",
        }}
      >
        <Stack direction="row" spacing={1} flexWrap="wrap" mb={2}>
          {data.level && (
            <Chip label={`Level ${data.level}`} size="small" color="primary" />
          )}
          {data.part_type && (
            <Chip label={`Part ${data.part_type}`} size="small" />
          )}
          {data.duration && (
            <Chip
              label={`${Math.floor(data.duration / 1000)} giây`}
              size="small"
              variant="outlined"
            />
          )}
        </Stack>
        {data.audio_url ? (
          <audio controls src={data.audio_url} style={{ width: "100%" }} />
        ) : (
          <Typography color="text.secondary">Không có file audio</Typography>
        )}
      </Paper>

      {data.video_url && (
        <Box>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
            🎥 Video
          </Typography>
          <video
            controls
            src={data.video_url}
            style={{ width: "100%", maxHeight: 400, borderRadius: 8 }}
          />
        </Box>
      )}

      {data.transcript && (
        <Box>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
            📝 Transcript (Luyện đọc theo)
          </Typography>
          <Paper
            variant="outlined"
            sx={{
              p: 3,
              maxHeight: 400,
              overflow: "auto",
              bgcolor: theme.palette.background.paper,
              borderRadius: 2,
            }}
          >
            <Typography
              variant="body1"
              sx={{ whiteSpace: "pre-wrap", lineHeight: 1.8 }}
            >
              {data.transcript}
            </Typography>
          </Paper>
        </Box>
      )}

      {data.timings && data.timings.length > 0 && (
        <Box>
          <Typography variant="subtitle2" color="text.secondary">
            ✓ {data.timings.length} đoạn được đánh dấu thời gian
          </Typography>
        </Box>
      )}
    </Stack>
  );

  const renderMiniTestContent = (data: any) => {
    const questions = data.question_ids || [];

    return (
      <Stack spacing={2}>
        <Stack direction="row" spacing={1} flexWrap="wrap">
          <Chip label="Mini Test" size="small" color="error" />
          {data.level && (
            <Chip label={data.level} size="small" color="primary" />
          )}
          {data.duration && (
            <Chip
              label={`${data.duration} phút`}
              size="small"
              variant="outlined"
            />
          )}
          <Chip
            label={`${questions.length} câu hỏi`}
            size="small"
            variant="outlined"
          />
        </Stack>

        {data.description && (
          <Typography variant="body2" color="text.secondary">
            {data.description}
          </Typography>
        )}

        {questions.length > 0 && (
          <Box>
            <Typography
              variant="subtitle2"
              gutterBottom
              sx={{ fontWeight: 600 }}
            >
              📝 Danh sách câu hỏi:
            </Typography>
            <Paper variant="outlined" sx={{ maxHeight: 400, overflow: "auto" }}>
              {questions.map((question: any, idx: number) => (
                <Box
                  key={idx}
                  sx={{
                    p: 2,
                    borderBottom:
                      idx < questions.length - 1 ? "1px solid" : "none",
                    borderColor: "divider",
                  }}
                >
                  <Stack direction="row" spacing={1} mb={1}>
                    <Chip label={`Part ${question.part || "?"}`} size="small" />
                    <Chip
                      label={question.question_type || "N/A"}
                      size="small"
                      variant="outlined"
                    />
                  </Stack>
                  <Typography variant="body2" fontWeight={600} gutterBottom>
                    {idx + 1}.{" "}
                    {question.question_text ||
                      question.content ||
                      "Không có nội dung"}
                  </Typography>
                  {question.audio_url && (
                    <Box mb={1}>
                      <audio
                        controls
                        src={question.audio_url}
                        style={{ width: "100%", height: 32 }}
                      />
                    </Box>
                  )}
                  {question.image_url && (
                    <Box mb={1}>
                      <img
                        src={question.image_url}
                        alt={`Q${idx + 1}`}
                        style={{ maxWidth: "100%", maxHeight: 120 }}
                      />
                    </Box>
                  )}
                </Box>
              ))}
            </Paper>
          </Box>
        )}
      </Stack>
    );
  };

  const renderContent = () => {
    if (!activity || !kind) return null;

    switch (kind.toLowerCase()) {
      case "lesson":
        return renderLessonContent(activity);
      case "quiz":
        return renderQuizContent(activity);
      case "flash_card":
      case "flashcard":
        return renderFlashcardContent(activity);
      case "dictation":
        return renderDictationContent(activity);
      case "shadowing":
        return renderShadowingContent(activity);
      case "mini_test":
      case "minitest":
        return renderMiniTestContent(activity);
      default:
        return (
          <Typography variant="body2" color="text.secondary">
            Không hỗ trợ xem chi tiết cho loại hoạt động này
          </Typography>
        );
    }
  };

  const getGradientByKind = (activityKind: string) => {
    switch (activityKind?.toLowerCase()) {
      case "lesson":
        return theme.palette.mode === "dark"
          ? "linear-gradient(135deg, #1E3A8A, #1E40AF)"
          : "linear-gradient(135deg, #2563EB, #1E40AF)";
      case "quiz":
        return theme.palette.mode === "dark"
          ? "linear-gradient(135deg, #7C3AED, #6D28D9)"
          : "linear-gradient(135deg, #8B5CF6, #7C3AED)";
      case "flashcard":
      case "flash_card":
        return theme.palette.mode === "dark"
          ? "linear-gradient(135deg, #059669, #047857)"
          : "linear-gradient(135deg, #10B981, #059669)";
      case "dictation":
        return theme.palette.mode === "dark"
          ? "linear-gradient(135deg, #047857, #065F46)"
          : "linear-gradient(135deg, #10B981, #047857)";
      case "shadowing":
        return theme.palette.mode === "dark"
          ? "linear-gradient(135deg, #0891B2, #0E7490)"
          : "linear-gradient(135deg, #06B6D4, #0891B2)";
      case "mini_test":
      case "minitest":
        return theme.palette.mode === "dark"
          ? "linear-gradient(135deg, #DC2626, #B91C1C)"
          : "linear-gradient(135deg, #EF4444, #DC2626)";
      default:
        return theme.palette.mode === "dark"
          ? `linear-gradient(135deg, ${theme.palette.primary.dark}, ${theme.palette.secondary.dark})`
          : `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`;
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          overflow: "hidden",
          bgcolor: theme.palette.background.paper,
          boxShadow: theme.shadows[6],
        },
        component: motion.div,
        initial: { opacity: 0, y: 40 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: 40 },
        transition: { duration: 0.3 },
      }}
    >
      <DialogTitle
        sx={{
          background: kind
            ? getGradientByKind(kind)
            : theme.palette.primary.main,
          color: "white",
          py: 2.5,
          px: 3,
        }}
      >
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box display="flex" alignItems="center" gap={2}>
            {kind && (
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: 2,
                  bgcolor: "rgba(255,255,255,0.2)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {getActivityIcon(kind)}
              </Box>
            )}
            <Box>
              <Typography variant="h6" fontWeight={700}>
                {kind ? getActivityLabel(kind) : "Chi tiết hoạt động"}
              </Typography>
              {activity && (
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  {activity.title}
                </Typography>
              )}
            </Box>
          </Box>
          <IconButton onClick={onClose} sx={{ color: "white" }}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ py: 4, px: 4 }}>
        {loading ? (
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            minHeight={300}
            gap={2}
          >
            <CircularProgress />
            <Typography color="text.secondary">Đang tải dữ liệu...</Typography>
          </Box>
        ) : error ? (
          <Box p={4} textAlign="center">
            <Typography color="error" gutterBottom>
              {error}
            </Typography>
            <Button
              variant="contained"
              onClick={loadActivityDetails}
              sx={{ mt: 2 }}
            >
              Thử lại
            </Button>
          </Box>
        ) : activity ? (
          <Box>
            {/* Dynamic Content */}
            {renderContent()}
          </Box>
        ) : (
          <Typography color="text.secondary" textAlign="center" py={4}>
            Không có dữ liệu
          </Typography>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Đóng</Button>
      </DialogActions>
    </Dialog>
  );
}
