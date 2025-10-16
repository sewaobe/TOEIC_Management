import { useState } from "react";
import {
  Box,
  Paper,
  Typography,
  Button,
  Tabs,
  Tab,
} from "@mui/material";
import { examParts } from "../../../../constants/examParts";
import PartRenderer from "./PartRenderer";
import AlertBox from "./AlertBox";
import { useFullTestStep2ViewModel } from "./viewmodel/useFullTestStep2ViewModel";
import SelectGroupDialog from "./SelectGroupDialog"; // ✅ import dialog mới

interface Props {
  value: any;
  onChange: (val: any) => void;
  onBack: () => void;
  onNext: () => void;
}

const FullTestStep2Questions: React.FC<Props> = ({
  value,
  onChange,
  onBack,
  onNext,
}) => {
  // 🧠 Gọi ViewModel để quản lý toàn bộ logic
  const vm = useFullTestStep2ViewModel(value, onChange, onNext);

  const groups = vm.getGroups(vm.activePart);
  const tagOptions =
    examParts[vm.activePart + 1]?.tags?.map((t: any) => t.name) || [];

  // ===============================
  // 🧩 State quản lý dialog chọn group
  // ===============================
  const [openSelectDialog, setOpenSelectDialog] = useState(false);

  const handleSelectConfirm = (selectedGroups: any[]) => {
    vm.handleImportGroupsFromBank(vm.activePart + 1, selectedGroups);
  };

  return (
    <Paper
      sx={{
        p: 3,
        borderRadius: 2,
        maxWidth: 1100,
        mx: "auto",
        mt: 4,
        boxShadow: 2,
      }}
    >
      <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
        Thêm câu hỏi
      </Typography>

      {/* 🔖 Tabs Part */}
      <Tabs
        value={vm.activePart}
        onChange={(_, val) => vm.setActivePart(val)}
        variant="scrollable"
        scrollButtons
      >
        {Array.from({ length: 7 }, (_, i) => (
          <Tab key={i} label={`Part ${i + 1}`} />
        ))}
      </Tabs>

      {/* 📦 Nút thêm từ ngân hàng */}
      <Box sx={{ mt: 2, textAlign: "right" }}>
        <Button
          variant="outlined"
          color="primary"
          onClick={() => setOpenSelectDialog(true)}
        >
          + Thêm từ ngân hàng
        </Button>
      </Box>

      {/* 📦 Nội dung của part hiện tại */}
      <Box sx={{ mt: 3 }}>
        <PartRenderer
          key={vm.activePart}
          partIndex={vm.activePart + 1}
          groups={groups}
          tagOptions={tagOptions}
          onChangeGroup={(gi, field, val) =>
            vm.handleChangeGroup(vm.activePart, gi, field, val)
          }
          onChangeQuestion={(gi, qi, field, val) =>
            vm.handleChangeQuestion(vm.activePart, gi, qi, field, val)
          }
          onAddQuestion={(gi) => vm.handleAddQuestion(vm.activePart, gi)}
          onRemoveQuestion={(gi, qi) =>
            vm.handleRemoveQuestion(vm.activePart, gi, qi)
          }
          onAddGroup={() => vm.handleAddGroup(vm.activePart)}
          onRemoveGroup={(gi) => vm.handleRemoveGroup(vm.activePart, gi)}
          errorPath={vm.errorPath}
          forceOpenGroup={vm.forceOpenGroup}
          forceErrorPart={vm.forceErrorPart}
          errorParts={vm.errorParts}
          errorGroups={vm.errorGroups}
        />
      </Box>

      <AlertBox show={vm.showFillAlert} />

      {/* ⚙️ Dialog chọn group */}
      <SelectGroupDialog
        open={openSelectDialog}
        part={vm.activePart + 1}
        onClose={() => setOpenSelectDialog(false)}
        onConfirm={handleSelectConfirm}
      />

      {/* 🔘 Nút điều hướng */}
      <Box sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}>
        <Button variant="outlined" onClick={onBack}>
          Quay lại
        </Button>
        <Box>
          {/* 🆕 Nút auto fill */}
          <Button
            variant="outlined"
            color="secondary"
            onClick={vm.autoFillFullTest}
            sx={{ mr: 2 }}
          >
            Tự động điền
          </Button>
          <Button variant="contained" onClick={vm.handleNext}>
            Tiếp tục
          </Button>
        </Box>
      </Box>
    </Paper>
  );
};

export default FullTestStep2Questions;
