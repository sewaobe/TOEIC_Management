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
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

import FullTestStep1Info from "../../components/fulltest/FullTestStep1Info";
import FullTestStep2Questions from "../../components/fulltest/FullTestStep2Questions";
import FullTestStep3Review from "../../components/fulltest/FullTestStep3Review";
import { useFullTestAutoSave } from "../../../../hooks/fullTest/useFullTestAutoSave";
import fullTestService from "../../../../services/fullTest.service";

// ======================
// 🧭 Danh sách step
// ======================
const steps = ["Thông tin đề thi", "Thêm câu hỏi", "Xem trước & Lưu"];

// ======================
// 📘 Dữ liệu mặc định
// ======================
const defaultDraft = {
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
};

// ======================
// 📄 Component chính
// ======================
const CreateFullTestPage = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);

  // ✅ Sử dụng hook auto-save
  const {
    draft,
    setDraft,
    showRestoreDialog,
    restoreDraft,
    discardDraft,
  } = useFullTestAutoSave(defaultDraft);

  // 🧭 Step navigation
  const handleNext = () => setActiveStep((prev) => prev + 1);
  const handleBack = () => setActiveStep((prev) => prev - 1);

  // 📝 Step 1 - cập nhật form
  const handleChange = (field: string, value: string | number) => {
    setDraft({
      ...draft,
      form: { ...draft.form, [field]: value },
    });
  };

  // 💾 Lưu đề thi
  const handleSave = async () => {
    try {
      const payload = {
        title: draft.form.title,
        topic: draft.form.topic,
        type: "full-test",
        status: "draft",
        groups: Object.values(draft.questions).flatMap((p: any) =>
          Array.isArray(p) ? p : p.groups || []
        ),
      };

      console.log("📌 Payload gửi BE:", payload);

      const res = await fullTestService.create(payload);
      console.log("✅ Tạo đề thi thành công:", res);

      localStorage.removeItem("draft-fulltest");
      navigate("/ctv/full-tests");
    } catch (error) {
      console.error("❌ Lỗi khi tạo đề thi:", error);
    }
  };

  return (
    <Box sx={{ p: 3, height: "100%", bgcolor: theme.palette.background.default }}>
      {/* ===== Breadcrumbs ===== */}
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

      {/* ===== Header ===== */}
      <Typography variant="h5" sx={{ fontWeight: "bold", mb: 3 }}>
        Tạo mới Full Test TOEIC
      </Typography>

      {/* ===== Stepper ===== */}
      <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 3 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      {/* ===== Nội dung từng bước ===== */}
      {activeStep === 0 && (
        <FullTestStep1Info form={draft.form} onChange={handleChange} onNext={handleNext} />
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

      {/* ===== Popup khôi phục draft ===== */}
      <Dialog open={showRestoreDialog}>
        <DialogTitle>Phát hiện bản nháp cũ</DialogTitle>
        <DialogContent>Bạn có muốn khôi phục bản nháp cũ không?</DialogContent>
        <DialogActions>
          <Button onClick={discardDraft} color="error">
            Bỏ qua
          </Button>
          <Button onClick={restoreDraft} variant="contained" color="primary">
            Khôi phục
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CreateFullTestPage;
