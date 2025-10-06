import { forwardRef } from "react";
import { Button } from "@mui/material";

const SectionHero = forwardRef<HTMLElement>((_, ref) => (
  <section ref={ref} className="flex flex-col items-center justify-center min-h-screen text-center px-6">
    <h1 className="text-5xl md:text-6xl font-[Playfair_Display] font-extrabold bg-gradient-to-r from-violet-500 via-blue-500 to-amber-400 bg-clip-text text-transparent mb-6">
      Kiến tạo tri thức – Kết nối thành công
    </h1>
    <p className="max-w-2xl text-lg text-gray-700 mb-10">
      Cùng nhau tạo dựng mạng lưới cộng tác viên TOEIC chuyên nghiệp – nơi tri thức lan tỏa và cơ hội phát triển mở rộng không giới hạn.
    </p>
    <div className="flex flex-col sm:flex-row gap-4">
      <Button
        variant="contained"
        sx={{
          background: "linear-gradient(to right, #6366f1, #a78bfa, #38bdf8)",
          textTransform: "none",
          borderRadius: "9999px",
          px: 4,
        }}
      >
        Tham gia ngay
      </Button>
      <Button
        variant="outlined"
        sx={{
          color: "#374151",
          borderColor: "#d1d5db",
          borderRadius: "9999px",
          px: 4,
        }}
      >
        Tìm hiểu thêm
      </Button>
    </div>
  </section>
));

export default SectionHero;
