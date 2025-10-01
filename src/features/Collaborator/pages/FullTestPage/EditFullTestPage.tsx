import {
  Box,
  Typography,
  Stepper,
  Step,
  StepLabel,
  useTheme,
  Breadcrumbs,
  CircularProgress,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate, Link, useParams } from "react-router-dom";

import FullTestStep1Info from "../../components/fulltest/FullTestStep1Info";
import FullTestStep2Questions from "../../components/fulltest/FullTestStep2Questions";
import FullTestStep3Review from "../../components/fulltest/FullTestStep3Review";

import fullTestService from "../../../../services/fullTest.service";
import { FullTest } from "../../../../types/fullTest";

const steps = ["Thông tin đề thi", "Thêm câu hỏi", "Xem trước & Lưu"];

const EditFullTestPage = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(true);

  // Form state
  const [form, setForm] = useState({
    title: "",
    description: "",
    topic: "",
    duration: 120,
    status: "draft",
  });

  // Questions state
  const [questions, setQuestions] = useState({
    "Part 1": { groups: [] },
    "Part 2": { groups: [] },
    "Part 3": { groups: [] },
    "Part 4": { groups: [] },
    "Part 5": { groups: [] },
    "Part 6": { groups: [] },
    "Part 7": { groups: [] },
  });

  // Fetch test by id
  useEffect(() => {
    const fetchTest = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const res = await fullTestService.getById(`${id}?full=true`);
        if (res.success && res.data) {
          const test: FullTest = res.data;

          // ✅ fill form
          setForm({
            title: test.title || "",
            description: (test as any).description || "",
            topic: (test as any).topic || "",
            duration: (test as any).duration || 120,
            status: test.status || "draft",
          });

          // ✅ vì BE đã trả về { Part 1: { groups: [...] }, Part 2: {...} }
          if ((test as any).questions) {
            setQuestions((test as any).questions);
          }
        }
      } catch (err) {
        console.error("❌ Lỗi tải test:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTest();
  }, [id]);

  // Handlers
  const handleChange = (field: string, value: string | number) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleNext = () => setActiveStep((prev) => prev + 1);
  const handleBack = () => setActiveStep((prev) => prev - 1);

  const handleSave = () => {
    const payload = { ...form, questions };
    console.log("📌 Full payload UPDATE BE:", { id, ...payload });
    // TODO: gọi API PUT sau này
    navigate("/ctv/full-tests");
  };

  if (loading) {
    return (
      <Box sx={{ p: 3, display: "flex", justifyContent: "center", mt: 5 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box
      sx={{ p: 3, height: "100%", bgcolor: theme.palette.background.default }}
    >
      {/* Breadcrumb */}
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
        <Typography color="text.primary">Chỉnh sửa</Typography>
      </Breadcrumbs>

      {/* Tiêu đề */}
      <Typography variant="h5" sx={{ fontWeight: "bold", mb: 3 }}>
        Chỉnh sửa Full Test TOEIC
      </Typography>

      {/* Stepper */}
      <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 3 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      {/* Nội dung Step */}
      {activeStep === 0 && (
        <FullTestStep1Info
          form={form}
          onChange={handleChange}
          onNext={handleNext}
        />
      )}
      {activeStep === 1 && (
        <FullTestStep2Questions
          value={questions}
          onChange={setQuestions}
          onBack={handleBack}
          onNext={handleNext}
        />
      )}
      {activeStep === 2 && (
        <FullTestStep3Review
          form={form}
          questions={questions}
          onBack={handleBack}
          onSave={handleSave}
        />
      )}
    </Box>
  );
};

export default EditFullTestPage;
