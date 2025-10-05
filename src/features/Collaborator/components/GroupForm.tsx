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
  totalQuestionsPart7?: number; // ✅ thêm prop tổng số câu toàn Part 7
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
}) => {
  // Xóa 1 ảnh khỏi danh sách
  const handleRemoveImage = (idx: number) => {
    const newList = group.imagesUrl.filter((_: any, i: number) => i !== idx);
    onChange(groupIndex, "imagesUrl", newList);
  };

  // Xóa audio
  const handleRemoveAudio = () => {
    onChange(groupIndex, "audioUrl", null);
  };

  return (
    <Box sx={{ border: "1px solid #ddd", borderRadius: 2, p: 2, mb: 3 }}>
      {/* Upload audio + ảnh */}
      <Grid container spacing={2} mb={2}>
        {/* Upload Audio */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Button variant="contained" component="label" fullWidth>
            UPLOAD AUDIO
            <input
              type="file"
              hidden
              accept="audio/*"
              onChange={async (e) => {
                if (e.target.files && e.target.files[0]) {
                  const uploaded = await uploadToCloudinary(e.target.files[0]);
                  onChange(groupIndex, "audioUrl", uploaded); // { url, type: "AUDIO" }
                }
              }}
            />
          </Button>
        </Grid>

        {/* Upload Images */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Button variant="contained" component="label" fullWidth>
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
                    uploadedList.push(uploaded); // { url, type: "IMAGE" }
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
        <Accordion sx={{ mb: 2 }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography sx={{ fontWeight: 600 }}>Media Preview</Typography>
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
                    background: "white",
                    "&:hover": { background: "#fdd" },
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
                          background: "white",
                          "&:hover": { background: "#fdd" },
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
            onChange={(e) =>
              onChange(groupIndex, "transcriptTranslation", e.target.value)
            }
          />
        </Grid>
      </Grid>

      {/* Danh sách câu hỏi */}
      {group.questions.map((q: any, qIdx: number) => (
        <Accordion key={qIdx} sx={{ mb: 1 }}>
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

              {group.part === 7 &&
                onRemoveQuestion &&
                group.questions.length > 2 && (
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

          <AccordionDetails>
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

      {/* Nút thêm câu hỏi cho Part 7 */}
      {group.part === 7 && (
        <Box textAlign="center" mt={2}>
          <Button
            variant="outlined"
            onClick={() => onAddQuestion && onAddQuestion(groupIndex)}
            disabled={
              group.questions.length >= 5 ||
              totalQuestionsPart7 >= MAX_PART7_QUESTIONS
            }
          >
            + Add Question
          </Button>
          <Typography
            variant="caption"
            sx={{ display: "block", mt: 1, color: "text.secondary" }}
          >
            {/* ({totalQuestionsPart7}/{MAX_PART7_QUESTIONS} câu trong Part 7) */}
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default GroupForm;
