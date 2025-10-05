import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import PersonAddIcon from "@mui/icons-material/PersonAdd";

const SHOW_MS = 2000; // hiển thị 2 giây
const HIDE_MS = 5000; // ẩn 5 giây

export default function JoinBadge() {
  const names = ["Linh Nguyen", "Khang Tran", "Minh Anh", "Bao Pham", "Quyen Do"];
  const [currentName, setCurrentName] = useState(names[0]);
  const [visible, setVisible] = useState(false);

  // Giữ ref cho timeout để clean khi unmount
  const hideTO = useRef<number | null>(null);
  const cycleTO = useRef<number | null>(null);

  useEffect(() => {
    const startCycle = () => {
      // 1) Bật badge
      setVisible(true);

      // Clear timeout cũ nếu có
      if (hideTO.current) window.clearTimeout(hideTO.current);
      if (cycleTO.current) window.clearTimeout(cycleTO.current);

      // 2) Sau 2s thì tắt badge
      hideTO.current = window.setTimeout(() => setVisible(false), SHOW_MS);

      // 3) Sau tổng 2s + 5s, đổi tên và lặp lại chu kỳ
      cycleTO.current = window.setTimeout(() => {
        const randomName = names[Math.floor(Math.random() * names.length)];
        setCurrentName(randomName);
        startCycle(); // chạy vòng tiếp theo
      }, SHOW_MS + HIDE_MS);
    };

    startCycle();

    return () => {
      if (hideTO.current) window.clearTimeout(hideTO.current);
      if (cycleTO.current) window.clearTimeout(cycleTO.current);
    };
  }, []);

  return (
    <AnimatePresence mode="wait">
      {visible && (
        <motion.div
          key={currentName}
          className="fixed bottom-10 left-10 flex items-center gap-3 bg-white/90 backdrop-blur-lg border border-gray-200 px-4 py-3 rounded-2xl shadow-md z-50"
          initial={{ opacity: 0, y: 20, scale: 0.92 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.92 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-r from-indigo-400 to-cyan-400 text-white shadow-md">
            <PersonAddIcon />
          </div>
          <div className="text-sm leading-tight">
            <div className="font-semibold text-gray-900">{currentName}</div>
            <div className="text-gray-500">Vừa tham gia hệ thống 🎉</div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
