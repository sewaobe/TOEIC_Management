import type { Student } from "../../../../../types/student"

// Cac ham format du lieu hien thi

function parseDate(value?: string | null): Date | null {
  if (!value) return null
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? null : date
}

export function getLearningRouteDisplay(student: Student): {
  primary: string
  secondary: string
  caption: string
} {
  const cycleNo = student.currentCycleNo
  const totalCycles = student.totalCycles ?? 0
  const cycleProgress = student.currentCycleProgress
  const hasCycle = typeof cycleNo === "number" && cycleNo > 0

  if (!hasCycle && !cycleProgress) {
    return {
      primary: "Chưa có lộ trình",
      secondary: "",
      caption: "",
    }
  }

  const primary =
    hasCycle && totalCycles > 0
      ? `Cycle ${cycleNo}/${totalCycles}`
      : hasCycle
        ? `Cycle ${cycleNo}`
        : "Cycle hiện tại"

  let secondary = ""
  if (cycleProgress && cycleProgress.totalStages > 0) {
    const nextStage =
      cycleProgress.completedStages >= cycleProgress.totalStages
        ? cycleProgress.totalStages
        : cycleProgress.completedStages + 1
    secondary = `Stage ${nextStage}/${cycleProgress.totalStages}`
  }

  return {
    primary,
    secondary,
    caption: "IRT tự điều chỉnh",
  }
}

export function getScoreSourceLabel(source?: string): string {
  if (source === "calibrated_user_skill_projection") return "Theo năng lực đã hiệu chỉnh"
  if (source === "projected_ability") return "Theo năng lực Part"
  if (source === "none") return "Chưa có dữ liệu điểm"
  return "Theo bài test gần nhất"
}

export function formatDate(dateString?: string | null): string {
  const date = parseDate(dateString)
  if (!date) return "—"

  return date.toLocaleDateString("vi-VN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  })
}

export function formatDateTime(dateString?: string | null): string {
  const date = parseDate(dateString)
  if (!date) return "—"

  return date.toLocaleString("vi-VN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  })
}

export function formatRelativeTime(dateString?: string | null): string {
  const date = parseDate(dateString)
  if (!date) return "Chưa có hoạt động"

  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMins / 60)
  const diffDays = Math.floor(diffHours / 24)

  if (diffMins < 1) return "Vừa xong"
  if (diffMins < 60) return `${diffMins} phút trước`
  if (diffHours < 24) return `${diffHours} giờ trước`
  if (diffDays < 7) return `${diffDays} ngày trước`

  return formatDate(dateString)
}

export function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60

  if (hours === 0) return `${mins} phút`
  if (mins === 0) return `${hours} giờ`
  return `${hours} giờ ${mins} phút`
}

export function formatProgress(completed: number, total: number): string {
  if (!total || total <= 0) return "0/0 (0%)"
  const percentage = Math.round((completed / total) * 100)
  return `${completed}/${total} (${percentage}%)`
}

export function getStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    not_started: "Chưa bắt đầu",
    active: "Đang học",
    at_risk: "Cần chú ý",
    inactive: "Không hoạt động",
    paused: "Tạm dừng",
    completed: "Hoàn thành",
  }
  return labels[status] || status
}

export function getLearningPathLabel(path?: string | null): string {
  if (!path) return "Chưa có lộ trình"

  const labels: Record<string, string> = {
    standard: "Tiêu chuẩn",
    intensive: "Tăng cường",
    custom: "Tùy chỉnh",
  }
  return labels[path] || path
}
