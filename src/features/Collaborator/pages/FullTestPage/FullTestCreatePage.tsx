import {
  Box,
  Typography,
  Stepper,
  Step,
  StepLabel,
  useTheme,
  Breadcrumbs,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";

import FullTestStep1Info from "../../components/fulltest/FullTestStep1Info";
import FullTestStep2Questions from "../../components/fulltest/FullTestStep2Questions";
import FullTestStep3Review from "../../components/fulltest/FullTestStep3Review";
import { useAutoSaveLocalStorage } from "../../../../hooks/useAutoSaveLocalStorage";
import fullTestService from "../../../../services/fullTest.service";

const steps = ["Thông tin đề thi", "Thêm câu hỏi", "Xem trước & Lưu"];

const CreateFullTestPage = () => {
  const theme = useTheme();
  const navigate = useNavigate();

  const [activeStep, setActiveStep] = useState(0);

  // ✅ Auto save với key = draft-fulltest
  const [draft, setDraft] = useAutoSaveLocalStorage("draft-fulltest", {
    form: {
      title: "",
      description: "",
      topic: "",
      duration: 120,
      status: "draft",
    },
    questions: {
      "Part 1": { groups: [] as any[] },
      "Part 2": { groups: [] as any[] },
      "Part 3": { groups: [] as any[] },
      "Part 4": { groups: [] as any[] },
      "Part 5": { groups: [] as any[] },
      "Part 6": { groups: [] as any[] },
      "Part 7": { groups: [] as any[] },
    },
  });

  // ✅ Popup khôi phục draft
  const [showRestoreDialog, setShowRestoreDialog] = useState(false);
  const [hasCheckedDraft, setHasCheckedDraft] = useState(false);

  useEffect(() => {
    if (!hasCheckedDraft) {
      const rawDraft = localStorage.getItem("draft-fulltest");
      if (rawDraft) {
        setShowRestoreDialog(true);
      }
      setHasCheckedDraft(true);
    }
  }, [hasCheckedDraft]);

  // Step1: form metadata
  const handleChange = (field: string, value: string | number) => {
    setDraft({
      ...draft,
      form: { ...draft.form, [field]: value },
    });
  };

  // Step navigation
  const handleNext = () => setActiveStep((prev) => prev + 1);
  const handleBack = () => setActiveStep((prev) => prev - 1);

  // Save final payload
  const handleSave = async () => {
    try {
      // Gom payload
      const payload = {
        title: draft.form.title,
        topic: draft.form.topic,
        type: "full-test", // enum TestType
        status: "draft", // enum TestStatus
        groups: Object.values(draft.questions).flatMap((p: any) =>
          Array.isArray(p) ? p : p.groups || []
        ),
      };

      console.log("📌 Payload gửi BE:", payload);

      // Gọi API tạo đề thi
      const res = await fullTestService.create(payload);

      console.log("✅ Tạo đề thi thành công:", res);

      // Clear draft sau khi lưu
      localStorage.removeItem("draft-fulltest");

      // Quay lại danh sách đề thi
      navigate("/ctv/full-tests");
    } catch (error) {
      console.error("❌ Lỗi khi tạo đề thi:", error);
    }
  };

  // Xử lý popup
  const handleRestoreDraft = () => {
    // dữ liệu đã tự load từ hook nên chỉ cần đóng popup
    setShowRestoreDialog(false);
  };

  const handleDiscardDraft = () => {
    localStorage.removeItem("draft-fulltest");
    // reset lại form rỗng
    setDraft({
      form: {
        title: "",
        description: "",
        topic: "",
        duration: 120,
        status: "draft",
      },
      questions: {
        "Part 1": { groups: [] as any[] },
        "Part 2": { groups: [] as any[] },
        "Part 3": { groups: [] as any[] },
        "Part 4": { groups: [] as any[] },
        "Part 5": { groups: [] as any[] },
        "Part 6": { groups: [] as any[] },
        "Part 7": { groups: [] as any[] },
      },
    });
    setShowRestoreDialog(false);
  };

  return (
    <Box
      sx={{ p: 3, height: "100%", bgcolor: theme.palette.background.default }}
    >
      {/* Breadcrumbs */}
      <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 2 }}>
        <Link
          to="/ctv/full-tests"
          style={{
            textDecoration: "none",
            color: theme.palette.primary.main,
            fontWeight: 500,
          }}
        >
          Đề thi lớn
        </Link>
        <Typography color="text.primary">Tạo mới</Typography>
      </Breadcrumbs>

      {/* Header */}
      <Typography variant="h5" sx={{ fontWeight: "bold", mb: 3 }}>
        Tạo mới Full Test TOEIC
      </Typography>

      {/* Stepper */}
      <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 3 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      {/* Steps */}
      {activeStep === 0 && (
        <FullTestStep1Info
          form={draft.form}
          onChange={handleChange}
          onNext={handleNext}
        />
      )}
      {activeStep === 1 && (
        <FullTestStep2Questions
          value={draft.questions}
          onChange={(val) => setDraft({ ...draft, questions: val })}
          onBack={handleBack}
          onNext={handleNext}
        />
      )}
      {activeStep === 2 && (
        <FullTestStep3Review
          form={draft.form}
          questions={draft.questions}
          onBack={handleBack}
          onSave={handleSave}
        />
      )}

      {/* Dialog phát hiện draft */}
      <Dialog open={showRestoreDialog}>
        <DialogTitle>Phát hiện bản nháp cũ</DialogTitle>
        <DialogContent>Bạn có muốn khôi phục bản nháp cũ không?</DialogContent>
        <DialogActions>
          <Button onClick={handleDiscardDraft} color="error">
            Bỏ qua
          </Button>
          <Button
            onClick={handleRestoreDraft}
            variant="contained"
            color="primary"
          >
            Khôi phục
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CreateFullTestPage;
