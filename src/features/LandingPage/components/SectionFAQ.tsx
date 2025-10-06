import { forwardRef } from "react";
import { Typography, Accordion, AccordionSummary, AccordionDetails } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { motion } from "framer-motion";

const faqs = [
    {
        q: "Tôi có cần kinh nghiệm để trở thành cộng tác viên không?",
        a: "Không cần. Bạn sẽ được hướng dẫn và đào tạo cụ thể trước khi bắt đầu.",
    },
    {
        q: "Khi nào tôi nhận được hoa hồng?",
        a: "Hoa hồng được tổng kết và chi trả định kỳ vào cuối mỗi tháng.",
    },
    {
        q: "Tôi có thể tham gia nếu đang là sinh viên không?",
        a: "Hoàn toàn có thể. Chúng tôi hoan nghênh các bạn sinh viên năng động.",
    },
];

const SectionFAQ = forwardRef<HTMLElement>((_, ref) => (
    <section
        ref={ref}
        className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-center px-6"
    >
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="w-full flex flex-col items-center"
        >
            <Typography
                variant="h3"
                component="h2"
                className="font-bold text-indigo-700 !mb-6"
            >
                Những câu hỏi thường gặp
            </Typography>

            <div className="max-w-2xl !w-full">
                {faqs.map((f, i) => (
                    <Accordion key={i} sx={{ mb: 2, borderRadius: "12px !important" }}>
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon sx={{ color: "#4f46e5" }} />}
                        >
                            <Typography sx={{ fontWeight: 600, color: "#111827" }}>
                                {f.q}
                            </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Typography sx={{ color: "#4b5563", textAlign: "start" }}>{f.a}</Typography>
                        </AccordionDetails>
                    </Accordion>
                ))}
            </div>
        </motion.div>
    </section>
));

export default SectionFAQ;
