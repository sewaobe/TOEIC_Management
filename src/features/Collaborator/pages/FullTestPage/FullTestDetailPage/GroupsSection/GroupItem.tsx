import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Typography,
  useTheme,
} from "@mui/material";
import { ExpandMore, Image as ImageIcon, TextSnippet, Translate, VolumeUp } from "@mui/icons-material";
import { Group } from "../../../../../../types/group";
import QuestionCard from "./QuestionCard";

export default function GroupItem({ group, index }: { group: Group; index: number }) {
  const theme = useTheme();
  const bgTranscript = theme.palette.mode === "light" ? "#EFF6FF" : theme.palette.info.light + "33";
  const bgTranslation = theme.palette.mode === "light" ? "#ECFDF5" : theme.palette.success.light + "33";

  return (
    <Accordion sx={{ mb: 1 }}>
      <AccordionSummary expandIcon={<ExpandMore />}>
        <Typography fontWeight="bold">Group {index + 1}</Typography>
      </AccordionSummary>
      <AccordionDetails>
        {/* Media */}
        {(group.audioUrl || group.imagesUrl?.length) && (
          <Box mb={2}>
            {group.audioUrl && (
              <Box mb={2}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                  <VolumeUp fontSize="small" color="primary" />
                  <Typography fontWeight="bold">Audio:</Typography>
                </Box>
                <audio controls src={group.audioUrl.url} style={{ width: "100%" }} />
              </Box>
            )}
            {group.imagesUrl?.length > 0 && (
              <Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                  <ImageIcon fontSize="small" color="primary" />
                  <Typography fontWeight="bold">Hình ảnh:</Typography>
                </Box>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                  {group.imagesUrl.map((img, i) => (
                    <img
                      key={i}
                      src={img.url}
                      alt={`Group ${index + 1} - ${i}`}
                      style={{
                        width: "180px",
                        height: "140px",
                        objectFit: "cover",
                        borderRadius: 8,
                        border: `1px solid ${theme.palette.divider}`,
                      }}
                    />
                  ))}
                </Box>
              </Box>
            )}
          </Box>
        )}

        {/* Transcript + Translation */}
        {(group.transcriptEnglish || group.transcriptTranslation) && (
          <Box mb={3}>
            {group.transcriptEnglish && (
              <Accordion sx={{ mb: 1, bgcolor: bgTranscript }}>
                <AccordionSummary expandIcon={<ExpandMore />}>
                  <TextSnippet color="info" fontSize="small" />
                  <Typography fontWeight="bold" ml={1}>
                    Transcript (English)
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography variant="body2" sx={{ whiteSpace: "pre-wrap" }}>
                    {group.transcriptEnglish}
                  </Typography>
                </AccordionDetails>
              </Accordion>
            )}
            {group.transcriptTranslation && (
              <Accordion sx={{ bgcolor: bgTranslation }}>
                <AccordionSummary expandIcon={<ExpandMore />}>
                  <Translate color="success" fontSize="small" />
                  <Typography fontWeight="bold" ml={1}>
                    Bản dịch (Translation)
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography variant="body2" sx={{ whiteSpace: "pre-wrap" }}>
                    {group.transcriptTranslation}
                  </Typography>
                </AccordionDetails>
              </Accordion>
            )}
          </Box>
        )}

        {/* Questions */}
        {group.questions?.map((q, idx) => (
          <QuestionCard key={q.id || idx} question={q} />
        ))}
      </AccordionDetails>
    </Accordion>
  );
}
