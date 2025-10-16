// Component hiển thị trạng thái học viên dạng chip

import type { Student } from "../../../../../types/student"; // ✅ import type thực tế

interface StatusChipProps {
  status: Student["status"]; // ✅ Lấy type status trực tiếp từ Student
}

export function StatusChip({ status }: StatusChipProps) {
  // 🎨 Màu sắc theo trạng thái (Tailwind + hỗ trợ dark mode)
  const statusColors: Record<
    NonNullable<Student["status"]>,
    string
  > = {
    active:
      "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
    inactive:
      "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400",
    completed:
      "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  };

  // ⚙️ Map nhãn hiển thị (có thể tách riêng formatter nếu bạn muốn)
  const statusLabels: Record<
    NonNullable<Student["status"]>,
    string
  > = {
    active: "Đang học",
    inactive: "Không hoạt động",
    completed: "Hoàn thành",
  };

  const color = statusColors[status ?? "inactive"];
  const label = statusLabels[status ?? "inactive"];

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${color}`}
    >
      {label}
    </span>
  );
}
