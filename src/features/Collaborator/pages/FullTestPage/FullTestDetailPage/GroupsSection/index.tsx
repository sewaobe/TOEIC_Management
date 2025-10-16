import { Accordion, AccordionDetails, AccordionSummary, Paper, Typography } from "@mui/material";
import { ExpandMore } from "@mui/icons-material";
import { Group } from "../../../../../../types/group";
import GroupItem from "./GroupItem";

export default function GroupsSection({ groups }: { groups: Group[] }) {
  if (!groups?.length) return null;

  return (
    <Paper sx={{ p: 3, boxShadow: 1, borderRadius: 2 }}>
      <Typography variant="h6" fontWeight="bold" color="primary" sx={{ mb: 2 }}>
        Danh sách phần thi (Part 1 → Part 7)
      </Typography>

      {Array.from({ length: 7 }, (_, idx) => idx + 1).map((partNumber) => {
        const partGroups = groups.filter((g) => g.part === partNumber);
        if (!partGroups.length) return null;

        return (
          <Accordion key={partNumber} defaultExpanded={partNumber === 1} sx={{ mb: 1.5 }}>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Typography fontWeight="bold" color="primary">
                Part {partNumber} — {partGroups.length} nhóm,{" "}
                {partGroups.reduce((sum, g) => sum + g.questions.length, 0)} câu
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              {partGroups.map((group, i) => (
                <GroupItem key={group.id || i} group={group} index={i} />
              ))}
            </AccordionDetails>
          </Accordion>
        );
      })}
    </Paper>
  );
}
