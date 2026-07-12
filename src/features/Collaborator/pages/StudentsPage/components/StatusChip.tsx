// Component hien thi trang thai hoc vien dang chip

import type { Student } from "../../../../../types/student";

interface StatusChipProps {
  status: Student["status"];
}

export function StatusChip({ status }: StatusChipProps) {
  const statusColors: Record<NonNullable<Student["status"]>, string> = {
    not_started:
      "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300",
    active:
      "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
    at_risk:
      "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400",
    inactive:
      "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400",
    paused:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
    completed:
      "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  };

  const statusLabels: Record<NonNullable<Student["status"]>, string> = {
    not_started: "Chưa bắt đầu",
    active: "Đang học",
    at_risk: "Cần chú ý",
    inactive: "Không hoạt động",
    paused: "Tạm dừng",
    completed: "Hoàn thành",
  };

  const color = statusColors[status];
  const label = statusLabels[status];

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${color}`}
    >
      {label}
    </span>
  );
}
