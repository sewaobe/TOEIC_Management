import React, { useState } from "react";
import {
  Close as CloseIcon,
  CheckCircle as CheckCircleIcon,
  ArrowBack as ChevronLeftIcon,
  ArrowForward as ChevronRightIcon,
} from "@mui/icons-material";
import { motion, AnimatePresence } from "framer-motion";
import { uploadDocumentToCloudinary } from "../../../services/cloudinary.service";
import { requestCollaboratorService } from "../../../services/request_collaborator.service";

interface RegisterCollaboratorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function RegisterCollaboratorModal({
  isOpen,
  onClose,
}: RegisterCollaboratorModalProps) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    experience: "",
    expertise: [] as string[],
    motivation: "",
    availability: "",
    cvFile: null as File | null,
  });

  const expertiseOptions = [
    "Ngữ pháp",
    "Listening",
    "Reading",
    "Writing",
    "Speaking",
    "Vocabulary",
  ];

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleExpertiseToggle = (skill: string) => {
    setFormData((prev) => ({
      ...prev,
      expertise: prev.expertise.includes(skill)
        ? prev.expertise.filter((s) => s !== skill)
        : [...prev.expertise, skill],
    }));
  };

  const handleNext = () => {
    if (
      step === 1 &&
      formData.fullName &&
      formData.email &&
      formData.experience
    ) {
      setStep(2);
    }
  };

  const handlePrev = () => setStep(1);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let cvUrl = "";

      // 1. Upload file CV nếu có
      if (formData.cvFile) {
        const uploadRes = await uploadDocumentToCloudinary(formData.cvFile);
        cvUrl = uploadRes.url;
        console.log("Uploaded CV:", cvUrl);
      }

      // 2. Gửi toàn bộ thông tin lên backend
      const payload = {
        fullName: formData.fullName,
        email: formData.email,
        experience: formData.experience,
        expertise: formData.expertise,
        motivation: formData.motivation,
        availability: formData.availability,
        cv_url: cvUrl, // chỉ gửi URL, không gửi file nhị phân
      };
      requestCollaboratorService.submitRequestCollaborator(payload);
      
      // 3. Hiển thị trạng thái thành công
      setSubmitted(true);
    } catch (err) {
      console.error("❌ Lỗi upload hoặc gửi form:", err);
      alert("Đã xảy ra lỗi khi gửi thông tin, vui lòng thử lại!");
    } finally {
      setLoading(false);
      // 4. Tự động đóng modal sau khi gửi xong
      setTimeout(() => {
        onClose();
        setSubmitted(false);
        setStep(1);
      }, 2800);
    }
  };


  const handleFileChange = (file: File | null) => {
    if (!file) return;
    if (file.type !== "application/pdf") {
      alert("Vui lòng chọn file PDF hợp lệ!");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert("File vượt quá 5MB, vui lòng chọn file nhỏ hơn!");
      return;
    }
    setFormData((prev) => ({ ...prev, cvFile: file }));
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-x-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Overlay */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-teal-100/25 via-white/40 to-cyan-100/30 backdrop-blur-md backdrop-brightness-95"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.97, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="relative w-full max-w-lg md:max-w-2xl h-auto max-h-[90vh] flex flex-col bg-white rounded-lg shadow-[0_4px_24px_rgba(0,0,0,0.08)] border border-teal-100 overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-cyan-500 via-teal-400 to-emerald-400 px-8 py-5 flex items-center justify-between shadow-md">
              <h2 className="text-xl font-semibold text-white tracking-wide">
                Đăng ký Cộng Tác Viên TOEIC Master
              </h2>
              <button
                onClick={onClose}
                className="p-2 rounded-md hover:bg-white/20 transition"
              >
                <CloseIcon className="text-white" />
              </button>
            </div>

            {/* Scrollable content */}
            <div className="flex-1 overflow-y-auto px-8 py-6 bg-gradient-to-br from-white via-teal-50/30 to-cyan-50/30 mb-2">
              <AnimatePresence mode="wait">
                {submitted ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.4 }}
                    className="flex flex-col items-center justify-center py-10 text-center"
                  >
                    <motion.div
                      initial={{ y: 0 }}
                      animate={{ y: [0, -10, 0] }}
                      transition={{
                        repeat: Infinity,
                        duration: 1.2,
                        ease: "easeInOut",
                      }}
                      className="mb-3"
                    >
                      <CheckCircleIcon sx={{ fontSize: 72, color: "#14B8A6" }} />
                    </motion.div>
                    <h3 className="text-2xl font-semibold text-slate-800 mb-2">
                      Đăng ký thành công!
                    </h3>
                    <p className="text-slate-500 max-w-sm">
                      Cảm ơn bạn đã gửi thông tin. Chúng tôi sẽ liên hệ trong
                      24h để hoàn tất đăng ký cộng tác viên.
                    </p>
                  </motion.div>
                ) : (
                  <>
                    {/* Stepper */}
                    <div className="flex items-center gap-3 mb-8">
                      <div className="flex-1 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                        <motion.div
                          className="h-full bg-gradient-to-r from-cyan-500 to-teal-400"
                          animate={{ width: step === 2 ? "100%" : "50%" }}
                          transition={{ duration: 0.5 }}
                        />
                      </div>
                      <span className="text-sm font-medium text-slate-600">
                        Bước {step} / 2
                      </span>
                    </div>

                    {/* Steps */}
                    <div className="relative min-h-[300px]">
                      <AnimatePresence mode="wait">
                        {step === 1 ? (
                          <motion.div
                            key="step1"
                            initial={{ opacity: 0, x: -40 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 40 }}
                            transition={{ duration: 0.4 }}
                            className="absolute w-full"
                          >
                            <Step1
                              formData={formData}
                              handleInputChange={handleInputChange}
                              handleNext={handleNext}
                            />
                          </motion.div>
                        ) : (
                          <motion.div
                            key="step2"
                            initial={{ opacity: 0, x: 40 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -40 }}
                            transition={{ duration: 0.4 }}
                            className="absolute w-full"
                          >
                            <Step2
                              formData={formData}
                              handleExpertiseToggle={handleExpertiseToggle}
                              handleInputChange={handleInputChange}
                              handlePrev={handlePrev}
                              handleSubmit={handleSubmit}
                              loading={loading}
                              expertiseOptions={expertiseOptions}
                              handleFileChange={handleFileChange}
                            />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </>
                )}
              </AnimatePresence>
            </div>

            {/* Fixed bottom action bar */}
            {!submitted && (
              <div className="px-8 py-5 border-t border-slate-200 bg-white/80 backdrop-blur-sm flex gap-3 sticky bottom-0">
                {step === 2 && (
                  <button
                    type="button"
                    onClick={handlePrev}
                    className="flex-1 py-2.5 rounded-md border border-slate-300 text-slate-700 hover:bg-slate-100 transition text-sm font-medium flex items-center justify-center"
                  >
                    <ChevronLeftIcon fontSize="small" /> Quay lại
                  </button>
                )}
                {step === 1 ? (
                  <button
                    type="button"
                    onClick={handleNext}
                    disabled={
                      !formData.fullName ||
                      !formData.email ||
                      !formData.experience
                    }
                    className="flex-1 py-2.5 rounded-md bg-gradient-to-r from-cyan-500 to-teal-400 text-white hover:shadow-[0_0_12px_rgba(20,184,166,0.4)] hover:brightness-105 transition text-sm font-medium disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    Tiếp tục <ChevronRightIcon fontSize="small" />
                  </button>
                ) : (
                  <button
                    type="submit"
                    onClick={handleSubmit}
                    disabled={
                      loading ||
                      !formData.expertise.length ||
                      !formData.motivation ||
                      !formData.availability ||
                      !formData.cvFile
                    }
                    className="flex-1 py-2.5 rounded-md bg-gradient-to-r from-cyan-500 to-teal-400 text-white hover:shadow-[0_0_12px_rgba(20,184,166,0.4)] hover:brightness-105 transition text-sm font-medium disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <motion.div
                          className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                          animate={{ rotate: 360 }}
                          transition={{
                            repeat: Infinity,
                            duration: 1,
                            ease: "linear",
                          }}
                        />
                        Đang gửi...
                      </>
                    ) : (
                      "Gửi đăng ký"
                    )}
                  </button>
                )}
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ---------- Step 1 ---------- */
function Step1({ formData, handleInputChange }: any) {
  return (
    <form className="space-y-6">
      <Input label="Họ và tên" required name="fullName" value={formData.fullName} onChange={handleInputChange} />
      <Input label="Email" required name="email" type="email" value={formData.email} onChange={handleInputChange} placeholder="Email sẽ được dùng để đăng nhập sau khi trở thành công tác viên. Vui lòng nhập đúng!" />
      <Select
        label="Kinh nghiệm giảng dạy"
        required
        name="experience"
        value={formData.experience}
        onChange={handleInputChange}
        options={[
          { label: "Dưới 1 năm", value: "0-1" },
          { label: "1-3 năm", value: "1-3" },
          { label: "3-5 năm", value: "3-5" },
          { label: "Trên 5 năm", value: "5+" },
        ]}
      />
    </form>
  );
}

/* ---------- Step 2 ---------- */
function Step2({
  formData,
  handleExpertiseToggle,
  handleInputChange,
  handleSubmit,
  loading,
  expertiseOptions,
  handleFileChange,
}: any) {
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-2">
          Chuyên môn <span className="text-red-500">*</span>
        </label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {expertiseOptions.map((skill: string) => (
            <button
              key={skill}
              type="button"
              onClick={() => handleExpertiseToggle(skill)}
              className={`px-4 py-2 rounded-md border text-sm font-medium transition-all ${formData.expertise.includes(skill)
                ? "bg-gradient-to-r from-cyan-500 to-teal-400 text-white border-transparent shadow-sm"
                : "border-slate-300 text-slate-700 hover:bg-slate-100"
                }`}
            >
              {skill}
            </button>
          ))}
        </div>
      </div>

      <Select
        label="Thời gian có sẵn"
        required
        name="availability"
        value={formData.availability}
        onChange={handleInputChange}
        options={[
          { label: "Bán thời gian (<20h/tuần)", value: "part-time" },
          { label: "Toàn thời gian (>20h/tuần)", value: "full-time" },
          { label: "Linh hoạt", value: "flexible" },
        ]}
      />

      <Textarea
        label="Lý do muốn trở thành cộng tác viên"
        required
        name="motivation"
        value={formData.motivation}
        onChange={handleInputChange}
        rows={4}
      />

      <FileDropzone
        onFileSelect={handleFileChange}
        selectedFile={formData.cvFile}
      />
    </form>
  );
}

/* ---------- Subcomponents ---------- */
function Input({
  label,
  required,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-semibold text-slate-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        {...props}
        required={required}
        className="px-3 py-2.5 rounded-md border border-slate-300 text-slate-800 placeholder:text-slate-400 focus:border-cyan-600 focus:ring-2 focus:ring-cyan-100 outline-none transition"
      />
    </div>
  );
}

function Textarea({
  label,
  required,
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-semibold text-slate-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <textarea
        {...props}
        required={required}
        className="px-3 py-2.5 rounded-md border border-slate-300 text-slate-800 placeholder:text-slate-400 focus:border-cyan-600 focus:ring-2 focus:ring-cyan-100 outline-none transition resize-none"
      />
    </div>
  );
}

function Select({
  label,
  required,
  options,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement> & {
  label: string;
  required?: boolean;
  options: { label: string; value: string }[];
}) {
  return (
    <div className="flex flex-col gap-1 relative">
      <label className="text-sm font-semibold text-slate-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative">
        <select
          {...props}
          required={required}
          className="
            appearance-none w-full px-3 py-2.5 rounded-md
            border border-slate-300 text-slate-800 bg-white
            focus:border-cyan-600 focus:ring-2 focus:ring-cyan-100
            hover:border-cyan-400
            outline-none transition
            pr-8
          "
        >
          <option value="">Chọn...</option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-cyan-600 text-sm">
          ▼
        </span>
      </div>
    </div>
  );
}

function FileDropzone({
  onFileSelect,
  selectedFile,
}: {
  onFileSelect: (file: File | null) => void;
  selectedFile: File | null;
}) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (file) onFileSelect(file);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onFileSelect(file);
  };

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
      className={`border-2 border-dashed rounded-lg p-5 text-center transition-all cursor-pointer ${isDragging
        ? "border-cyan-500 bg-cyan-50"
        : "border-slate-300 hover:border-cyan-400"
        }`}
      onClick={() => document.getElementById("cv-input")?.click()}
    >
      <input
        id="cv-input"
        type="file"
        accept="application/pdf"
        onChange={handleChange}
        className="hidden"
      />
      {selectedFile ? (
        <p className="text-sm text-teal-700 font-medium">
          Đã chọn: {selectedFile.name}
        </p>
      ) : (
        <p className="text-slate-600 text-sm">
          Kéo & thả file CV (PDF) vào đây hoặc{" "}
          <span className="text-cyan-600 underline">chọn từ máy</span>
        </p>
      )}
    </div>
  );
}
