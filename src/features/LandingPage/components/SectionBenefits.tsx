import { forwardRef } from "react";
import { Typography } from "@mui/material";
import { motion } from "framer-motion";
import WorkspacePremiumIcon from "@mui/icons-material/WorkspacePremium";
import SchoolIcon from "@mui/icons-material/School";
import GroupsIcon from "@mui/icons-material/Groups";

const benefits = [
  {
    icon: <WorkspacePremiumIcon fontSize="large" className="text-indigo-500" />,
    title: "Hoa hồng hấp dẫn",
    desc: "Nhận mức thưởng cạnh tranh và xứng đáng cho mỗi đóng góp của bạn.",
  },
  {
    icon: <SchoolIcon fontSize="large" className="text-sky-500" />,
    title: "Đào tạo chuyên sâu",
    desc: "Được hướng dẫn, training kỹ năng xây dựng và chia sẻ nội dung TOEIC.",
  },
  {
    icon: <GroupsIcon fontSize="large" className="text-violet-500" />,
    title: "Cộng đồng năng động",
    desc: "Kết nối với hàng trăm cộng tác viên trên toàn quốc cùng chí hướng phát triển.",
  },
];

const SectionBenefits = forwardRef<HTMLElement>((_, ref) => (
  <section
    ref={ref}
    className="flex flex-col items-center justify-center min-h-screen bg-white text-center px-6"
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
        className="font-bold text-indigo-600 !mb-4"
      >
        Lợi ích khi tham gia
      </Typography>
      <Typography
        variant="body1"
        className="w-full text-gray-600 !mb-12 mx-auto"
      >
        Khi trở thành cộng tác viên TOEIC Master, bạn không chỉ phát triển bản thân
        mà còn đóng góp vào hành trình lan tỏa tri thức.
      </Typography>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-6xl mx-auto">
        {benefits.map((b, i) => (
          <motion.div
            key={i}
            whileHover={{ scale: 1.05 }}
            className="p-6 bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl shadow-sm hover:shadow-md"
          >
            <div className="flex flex-col items-center gap-3 !mb-3">{b.icon}</div>
            <h3 className="text-xl font-semibold text-gray-800 !mb-2">
              {b.title}
            </h3>
            <p className="text-gray-600 text-sm">{b.desc}</p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  </section>
));

export default SectionBenefits;
