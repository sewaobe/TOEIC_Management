import { Box, Card, CardContent, Chip, Grid, Paper, Typography, useTheme } from "@mui/material";
import { Label, Timer } from "@mui/icons-material";
import { Question } from "../../../../../../types/group";

export default function QuestionCard({ question }: { question: Question }) {
  const theme = useTheme();
  const bgCorrect = theme.palette.mode === "light" ? "#ECFDF5" : theme.palette.success.light + "33";
  const bgExplain = theme.palette.mode === "light" ? "#FEF3C7" : theme.palette.warning.light + "33";

  return (
    <Card variant="outlined" sx={{ mb: 2 }}>
      <CardContent>
        <Typography fontWeight="bold" sx={{ mb: 1 }}>
          {question.name}: {question.textQuestion}
        </Typography>

        <Grid container spacing={1} sx={{ mb: 1 }}>
          {Object.entries(question.choices).map(([key, val]) => (
            <Grid size={{ xs: 12, sm: 6 }} key={key}>
              <Paper
                variant="outlined"
                sx={{
                  p: 1.5,
                  bgcolor: key === question.correctAnswer ? bgCorrect : theme.palette.background.paper,
                  borderColor:
                    key === question.correctAnswer
                      ? theme.palette.success.main
                      : theme.palette.divider,
                }}
              >
                <Typography variant="body2">
                  <strong>{key}.</strong> {val}
                  {key === question.correctAnswer && (
                    <Chip
                      label="Đúng"
                      size="small"
                      sx={{
                        ml: 1,
                        bgcolor: theme.palette.success.main,
                        color: "#fff",
                      }}
                    />
                  )}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>

        {question.explanation && (
          <Paper
            variant="outlined"
            sx={{
              p: 1.5,
              mb: 1,
              bgcolor: bgExplain,
              borderColor: theme.palette.warning.main,
            }}
          >
            <Typography fontWeight="bold" color="warning.main">
              Giải thích:
            </Typography>
            <Typography variant="body2">{question.explanation}</Typography>
          </Paper>
        )}

        <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            <Timer fontSize="small" color="action" />
            <Typography variant="caption" color="text.secondary">
              {question.planned_time}s
            </Typography>
          </Box>
          {question.tags?.length > 0 && (
            <Box sx={{ display: "flex", gap: 0.5, flexWrap: "wrap" }}>
              {question.tags.map((tag, tIdx) => (
                <Chip
                  key={tIdx}
                  label={tag}
                  variant="outlined"
                  size="small"
                  icon={<Label fontSize="small" />}
                />
              ))}
            </Box>
          )}
        </Box>
      </CardContent>
    </Card>
  );
}
