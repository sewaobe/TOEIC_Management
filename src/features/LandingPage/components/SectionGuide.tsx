import { forwardRef } from "react";
import { Typography, Button } from "@mui/material";
import { motion } from "framer-motion";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

const steps = [
  "Đăng ký tài khoản cộng tác viên TOEIC Master.",
  "Hoàn thiện hồ sơ và xác nhận thông tin cá nhân.",
  "Bắt đầu chia sẻ và nhận hoa hồng cho mỗi hoạt động.",
];

const SectionGuide = forwardRef<HTMLElement>((_, ref) => (
  <section
    ref={ref}
    className="flex flex-col items-center justify-center min-h-screen bg-indigo-50 text-center px-6 "
  >
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
    >
      <Typography
        variant="h3"
        component="h2"
        className="font-bold text-indigo-700 !mb-4"
      >
        Hướng dẫn tham gia
      </Typography>
      <Typography
        variant="body1"
        className="max-w-2xl text-gray-700 !mb-8 mx-auto"
      >
        Chỉ với vài bước đơn giản, bạn đã có thể trở thành một phần của cộng đồng
        cộng tác viên TOEIC Master chuyên nghiệp.
      </Typography>

      <div className="flex flex-col items-center gap-5 max-w-md mx-auto">
        {steps.map((s, i) => (
          <motion.div
            key={i}
            whileHover={{ scale: 1.03 }}
            className="flex items-center gap-3 bg-white rounded-xl p-4 w-full shadow-sm hover:shadow-md transition"
          >
            <CheckCircleIcon className="text-indigo-500" />
            <p className="text-gray-700">{s}</p>
          </motion.div>
        ))}
      </div>

      <Button
        variant="contained"
        sx={{
          mt: 5,
          background: "linear-gradient(to right, #6366f1, #38bdf8)",
          borderRadius: "9999px",
          px: 4,
          textTransform: "none",
        }}
      >
        Đăng ký ngay
      </Button>
    </motion.div>
  </section>
));

export default SectionGuide;
