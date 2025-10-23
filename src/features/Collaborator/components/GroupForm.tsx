import {
  Box,
  Button,
  Grid,
  TextField,
  IconButton,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  useTheme,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import DeleteIcon from "@mui/icons-material/Delete";
import QuestionForm from "./QuestionForm";
import { uploadToCloudinary } from "../../../services/cloudinary.service";

interface Props {
  groupIndex: number;
  group: any;
  tagOptions: string[];
  onChange: (groupIndex: number, field: string, value: any) => void;
  onChangeQuestion: (
    groupIndex: number,
    questionIndex: number,
    field: string,
    value: any
  ) => void;
  onRemoveQuestion?: (groupIndex: number, questionIndex: number) => void;
  onAddQuestion?: (groupIndex: number) => void;
  totalQuestionsPart7?: number;
  isQuiz?: boolean;
}

const MAX_PART7_QUESTIONS = 54;

const GroupForm: React.FC<Props> = ({
  groupIndex,
  group,
  tagOptions,
  onChange,
  onChangeQuestion,
  onRemoveQuestion,
  onAddQuestion,
  totalQuestionsPart7 = 0,
  isQuiz = false,
}) => {
  const theme = useTheme();

  const handleRemoveImage = (idx: number) => {
    const newList = group.imagesUrl.filter((_: any, i: number) => i !== idx);
    onChange(groupIndex, "imagesUrl", newList);
  };

  const handleRemoveAudio = () => {
    onChange(groupIndex, "audioUrl", null);
  };

  // 🎨 Colors theo theme
  const bgBox =
    theme.palette.mode === "light"
      ? theme.palette.background.paper
      : theme.palette.background.default;
  const borderColor = theme.palette.divider;

  return (
    <Box
      sx={{
        border: `1px solid ${borderColor}`,
        borderRadius: 2,
        p: 2,
        mb: 3,
        bgcolor: bgBox,
      }}
    >
      {/* Upload audio + ảnh */}
      <Grid container spacing={2} mb={2}>
        {/* Upload Audio */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Button
            variant="contained"
            component="label"
            fullWidth
            sx={{
              bgcolor: theme.palette.primary.main,
              ":hover": { bgcolor: theme.palette.primary.dark },
              fontWeight: 600,
            }}
          >
            UPLOAD AUDIO
            <input
              type="file"
              hidden
              accept="audio/*"
              onChange={async (e) => {
                if (e.target.files && e.target.files[0]) {
                  const uploaded = await uploadToCloudinary(e.target.files[0]);
                  onChange(groupIndex, "audioUrl", uploaded);
                }
              }}
            />
          </Button>
        </Grid>

        {/* Upload Images */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Button
            variant="contained"
            component="label"
            fullWidth
            sx={{
              bgcolor: theme.palette.primary.main,
              ":hover": { bgcolor: theme.palette.primary.dark },
              fontWeight: 600,
            }}
          >
            UPLOAD IMAGES
            <input
              type="file"
              hidden
              accept="image/*"
              multiple
              onChange={async (e) => {
                if (e.target.files) {
                  const uploadedList: any[] = [...(group.imagesUrl || [])];
                  for (const file of Array.from(e.target.files)) {
                    const uploaded = await uploadToCloudinary(file);
                    uploadedList.push(uploaded);
                  }
                  onChange(groupIndex, "imagesUrl", uploadedList);
                }
              }}
            />
          </Button>
        </Grid>
      </Grid>

      {/* Media Preview */}
      {(group.audioUrl || (group.imagesUrl && group.imagesUrl.length > 0)) && (
        <Accordion
          sx={{
            mb: 2,
            bgcolor: bgBox,
            border: `1px solid ${borderColor}`,
          }}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography fontWeight={600}>Media Preview</Typography>
          </AccordionSummary>
          <AccordionDetails>
            {/* Audio */}
            {group.audioUrl && (
              <Box mb={2} sx={{ position: "relative" }}>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  Audio:
                </Typography>
                <audio
                  controls
                  src={group.audioUrl.url}
                  style={{ width: "100%" }}
                />
                <IconButton
                  size="small"
                  color="error"
                  onClick={handleRemoveAudio}
                  sx={{
                    position: "absolute",
                    top: 0,
                    right: 0,
                    background: theme.palette.background.paper,
                    "&:hover": {
                      background: theme.palette.error.light,
                    },
                  }}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Box>
            )}

            {/* Images */}
            {group.imagesUrl?.length > 0 && (
              <Box>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  Images:
                </Typography>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                  {group.imagesUrl.map((img: any, idx: number) => (
                    <Box
                      key={idx}
                      sx={{
                        position: "relative",
                        width: 80,
                        height: 80,
                        borderRadius: 1,
                        overflow: "hidden",
                      }}
                    >
                      <img
                        src={img.url}
                        alt={`preview-${idx}`}
                        style={{
                          width: "100%",
                          height: "100%",
                          borderRadius: 4,
                          objectFit: "cover",
                        }}
                      />
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleRemoveImage(idx)}
                        sx={{
                          position: "absolute",
                          top: -8,
                          right: -8,
                          background: theme.palette.background.paper,
                          "&:hover": {
                            background: theme.palette.error.light,
                          },
                        }}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  ))}
                </Box>
              </Box>
            )}
          </AccordionDetails>
        </Accordion>
      )}

      {/* Transcript */}
      <Grid container spacing={2} mb={2}>
        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            label="Transcript English"
            fullWidth
            multiline
            rows={2}
            value={group.transcriptEnglish || ""}
            sx={{
              "& .MuiInputBase-root": {
                bgcolor: theme.palette.background.paper,
              },
            }}
            onChange={(e) =>
              onChange(groupIndex, "transcriptEnglish", e.target.value)
            }
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            label="Transcript Translation"
            fullWidth
            multiline
            rows={2}
            value={group.transcriptTranslation || ""}
            sx={{
              "& .MuiInputBase-root": {
                bgcolor: theme.palette.background.paper,
              },
            }}
            onChange={(e) =>
              onChange(groupIndex, "transcriptTranslation", e.target.value)
            }
          />
        </Grid>
      </Grid>

      {/* Danh sách câu hỏi */}
      {group.questions.map((q: any, qIdx: number) => (
        <Accordion
          key={qIdx}
          sx={{
            mb: 1,
            bgcolor: bgBox,
            border: `1px solid ${borderColor}`,
          }}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                width: "100%",
              }}
            >
              <TextField
                variant="standard"
                placeholder={q.name || `Question ${qIdx + 1}`}
                value={q.name || `Question ${qIdx + 1}`}
                onClick={(e) => e.stopPropagation()}
                onFocus={(e) => e.stopPropagation()}
                onChange={(e) =>
                  onChangeQuestion(groupIndex, qIdx, "name", e.target.value)
                }
                sx={{ flexGrow: 1, mr: 1 }}
              />

              {onRemoveQuestion && (
                <IconButton
                  color="error"
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemoveQuestion(groupIndex, qIdx);
                  }}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              )}
            </Box>
          </AccordionSummary>

          <AccordionDetails
            sx={{
              bgcolor: theme.palette.background.paper,
            }}
          >
            <QuestionForm
              form={q}
              partIndex={group.part}
              choices={Object.keys(q.choices || {})}
              tagOptions={tagOptions}
              onChange={(field, value) =>
                onChangeQuestion(groupIndex, qIdx, field, value)
              }
              onChoiceChange={(key, value) =>
                onChangeQuestion(groupIndex, qIdx, "choices", {
                  ...q.choices,
                  [key]: value,
                })
              }
            />
          </AccordionDetails>
        </Accordion>
      ))}

      {/* ➕ Nút thêm câu hỏi */}
      {(isQuiz || group.part === 7) && (
        <Box textAlign="center" mt={2}>
          <Button
            variant="outlined"
            onClick={() => onAddQuestion && onAddQuestion(groupIndex)}
            disabled={
              !isQuiz &&
              (group.questions.length >= 5 ||
                totalQuestionsPart7 >= MAX_PART7_QUESTIONS)
            }
            sx={{
              borderColor: theme.palette.primary.main,
              color: theme.palette.primary.main,
              ":hover": { bgcolor: theme.palette.action.hover },
            }}
          >
            + Thêm câu hỏi
          </Button>

          {!isQuiz && (
            <Typography
              variant="caption"
              sx={{ display: "block", mt: 1, color: theme.palette.text.secondary }}
            >
              ({totalQuestionsPart7}/{MAX_PART7_QUESTIONS} câu trong Part 7)
            </Typography>
          )}
        </Box>
      )}
    </Box>
  );
};

export default GroupForm;
