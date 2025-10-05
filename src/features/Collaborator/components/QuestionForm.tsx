import { Grid, TextField, MenuItem, Autocomplete, Chip } from "@mui/material";

interface Props {
  form: any;
  partIndex: number;
  choices: string[];
  tagOptions: string[];
  onChange: (field: string, value: any) => void;
  onChoiceChange: (key: string, value: string) => void;
}

const QuestionForm: React.FC<Props> = ({
  form,
  partIndex,
  choices,
  tagOptions,
  onChange,
  onChoiceChange,
}) => {
  return (
    <Grid container spacing={2}>
      {/* Nội dung câu hỏi */}
      <Grid size={{ xs: 12 }}>
        <TextField
          label="Nội dung câu hỏi"
          fullWidth
          multiline
          rows={2}
          value={form.textQuestion}
          onChange={(e) => onChange("textQuestion", e.target.value)}
        />
      </Grid>

      {/* Lựa chọn */}
      {choices.map((label) => (
        <Grid key={label} size={{ xs: 12, md: 6 }}>
          <TextField
            label={`Đáp án ${label}`}
            fullWidth
            value={form.choices[label]}
            onChange={(e) => onChoiceChange(label, e.target.value)}
          />
        </Grid>
      ))}

      {/* Nhóm cuối: Đáp án đúng + Thời gian dự kiến */}
      <Grid size={{ xs: 12 }}>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              select
              label="Đáp án đúng"
              fullWidth
              value={form.correctAnswer}
              onChange={(e) => onChange("correctAnswer", e.target.value)}
            >
              {choices.map((label) => (
                <MenuItem key={label} value={label}>
                  {label}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              type="number"
              label="Thời gian dự kiến (giây)"
              fullWidth
              value={form.planned_time ?? 0}
              onChange={(e) => onChange("planned_time", Number(e.target.value))}
            />
          </Grid>
        </Grid>
      </Grid>

      {/* Giải thích */}
      <Grid size={{ xs: 12 }}>
        <TextField
          label="Giải thích"
          fullWidth
          multiline
          rows={2}
          value={form.explanation}
          onChange={(e) => onChange("explanation", e.target.value)}
        />
      </Grid>

      {/* Tags của câu hỏi */}
      <Grid size={{ xs: 12 }}>
        <Autocomplete
          multiple
          options={tagOptions}
          value={form.tags || []}
          onChange={(_, newValue) => onChange("tags", newValue)}
          renderTags={(value: readonly string[], getTagProps) =>
            value.map((option: string, index: number) => (
              <Chip
                variant="outlined"
                label={option}
                {...getTagProps({ index })}
                key={option}
              />
            ))
          }
          renderInput={(params) => <TextField {...params} label="Tags" />}
        />
      </Grid>
    </Grid>
  );
};

export default QuestionForm;
