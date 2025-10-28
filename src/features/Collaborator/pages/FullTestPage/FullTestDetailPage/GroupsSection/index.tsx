import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Paper,
  Typography,
} from "@mui/material";
import { ExpandMore } from "@mui/icons-material";
import { Group } from "../../../../../../types/group";
import GroupItem from "./GroupItem";

export default function GroupsSection({ groups }: { groups: Group[] }) {
  if (!groups?.length) return null;

  // Tính danh sách các part thực tế từ dữ liệu groups (hỗ trợ mini-test có part = 0)
  const partNumbers = Array.from(
    new Set(groups.map((g) => Number(g.part)))
  ).sort((a, b) => a - b);

  return (
    <Paper sx={{ p: 3, boxShadow: 1, borderRadius: 2 }}>
      <Typography variant="h6" fontWeight="bold" color="primary" sx={{ mb: 2 }}>
        Danh sách phần thi
      </Typography>

      {partNumbers.map((partNumber, idxPart) => {
        const partGroups = groups.filter((g) => Number(g.part) === partNumber);
        if (!partGroups.length) return null;

        return (
          <Accordion
            key={partNumber}
            defaultExpanded={idxPart === 0}
            sx={{ mb: 1.5 }}
          >
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Typography fontWeight="bold" color="primary">
                Part {partNumber} — {partGroups.length} nhóm,{" "}
                {partGroups.reduce(
                  (sum, g) => sum + (g.questions?.length || 0),
                  0
                )}{" "}
                câu
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              {partGroups.map((group, i) => (
                <GroupItem
                  key={(group as any)._id || group.id || i}
                  group={group}
                  index={i}
                />
              ))}
            </AccordionDetails>
          </Accordion>
        );
      })}
    </Paper>
  );
}
