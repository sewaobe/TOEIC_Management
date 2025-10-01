import {
  Box,
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  IconButton,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import DeleteIcon from "@mui/icons-material/Delete";
import GroupForm from "../GroupForm";

interface Props {
  partIndex: number;
  groups: any[];
  tagOptions: string[];
  onChangeGroup: (groupIndex: number, field: string, value: any) => void;
  onChangeQuestion: (
    groupIndex: number,
    questionIndex: number,
    field: string,
    value: any
  ) => void;
  onRemoveQuestion?: (groupIndex: number, questionIndex: number) => void;
  onAddQuestion?: (groupIndex: number) => void;
  onAddGroup?: () => void; // cho Part 7
  onRemoveGroup?: (groupIndex: number) => void; // mới thêm
}

const PartRenderer: React.FC<Props> = ({
  partIndex,
  groups,
  tagOptions,
  onChangeGroup,
  onChangeQuestion,
  onRemoveQuestion,
  onAddQuestion,
  onAddGroup,
  onRemoveGroup,
}) => {
  return (
    <Box>
      {groups.map((g, idx) => (
        <Accordion key={idx} sx={{ mb: 2 }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                width: "100%",
              }}
            >
              <Typography fontWeight={600}>Group {idx + 1}</Typography>

              {/* Chỉ Part 7 mới có nút xóa group */}
              {partIndex === 7 && onRemoveGroup && (
                <IconButton
                  color="error"
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemoveGroup(idx);
                  }}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              )}
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            <GroupForm
              groupIndex={idx}
              group={g}
              tagOptions={tagOptions}
              onChange={onChangeGroup}
              onChangeQuestion={onChangeQuestion}
              onRemoveQuestion={onRemoveQuestion}
              onAddQuestion={onAddQuestion}
            />
          </AccordionDetails>
        </Accordion>
      ))}

      {/* Part 7 cho phép thêm group */}
      {partIndex === 7 && onAddGroup && (
        <Box textAlign="center" mt={2}>
          <Button variant="outlined" onClick={onAddGroup}>
            + Thêm Group mới
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default PartRenderer;
