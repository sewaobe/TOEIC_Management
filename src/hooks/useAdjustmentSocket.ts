import { useEffect } from "react";
import { getSocket } from "../services/socket.service";
import { toast } from "sonner";

export const useAdjustmentSocket = () => {
  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    // Lắng nghe khi học viên phản hồi request
    const handleRequestResponded = (data: {
      requestId: string;
      status: "APPROVED" | "REJECTED";
      studentName?: string;
      rejectionReason?: string;
    }) => {
      console.log("📬 Học viên đã phản hồi:", data);

      if (data.status === "APPROVED") {
        toast.success(
          `✅ ${
            data.studentName || "Học viên"
          } đã chấp nhận đề xuất điều chỉnh lộ trình`,
          {
            duration: 5000,
            description: "Thay đổi đã được áp dụng vào lộ trình học.",
          }
        );
      } else {
        toast.error(
          `❌ ${data.studentName || "Học viên"} đã từ chối đề xuất điều chỉnh`,
          {
            duration: 5000,
            description: data.rejectionReason || "Không có lý do cụ thể.",
          }
        );
      }
    };

    socket.on("REQUEST_RESPONDED", handleRequestResponded);

    return () => {
      socket.off("REQUEST_RESPONDED", handleRequestResponded);
    };
  }, []);
};
