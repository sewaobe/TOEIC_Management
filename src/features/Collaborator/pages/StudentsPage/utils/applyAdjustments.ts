// Logic áp dụng điều chỉnh lộ trình học

import type { LearningPathConfig, LearningPathAdjustment } from "../mock/mockTypes"

export function applyLearningPathAdjustment(
  config: LearningPathConfig,
  adjustment: LearningPathAdjustment,
): LearningPathConfig {
  const newConfig = { ...config }

  // Áp dụng delta cho số buổi/tuần
  newConfig.lessonsPerWeek = Math.max(1, config.lessonsPerWeek + adjustment.lessonsPerWeekDelta)

  // Áp dụng delta cho số giờ/ngày
  newConfig.hoursPerDay = Math.max(0.5, config.hoursPerDay + adjustment.hoursPerDayDelta)

  // Thêm focus areas mới
  const focusAreas = [...config.focusAreas]
  adjustment.addFocusAreas.forEach((area) => {
    if (!focusAreas.includes(area)) {
      focusAreas.push(area)
    }
  })

  // Xóa focus areas
  adjustment.removeFocusAreas.forEach((area) => {
    const index = focusAreas.indexOf(area)
    if (index > -1) {
      focusAreas.splice(index, 1)
    }
  })

  newConfig.focusAreas = focusAreas

  // Gia hạn thời gian
  if (adjustment.extendDays > 0) {
    const targetDate = new Date(config.targetDate)
    targetDate.setDate(targetDate.getDate() + adjustment.extendDays)
    newConfig.targetDate = targetDate.toISOString().split("T")[0]
  }

  return newConfig
}

export function validateAdjustment(
  config: LearningPathConfig,
  adjustment: LearningPathAdjustment,
): { valid: boolean; errors: string[] } {
  const errors: string[] = []

  // Kiểm tra số buổi/tuần
  const newLessonsPerWeek = config.lessonsPerWeek + adjustment.lessonsPerWeekDelta
  if (newLessonsPerWeek < 1) {
    errors.push("Số buổi học mỗi tuần phải ít nhất 1")
  }
  if (newLessonsPerWeek > 7) {
    errors.push("Số buổi học mỗi tuần không được vượt quá 7")
  }

  // Kiểm tra số giờ/ngày
  const newHoursPerDay = config.hoursPerDay + adjustment.hoursPerDayDelta
  if (newHoursPerDay < 0.5) {
    errors.push("Số giờ học mỗi ngày phải ít nhất 0.5 giờ")
  }
  if (newHoursPerDay > 8) {
    errors.push("Số giờ học mỗi ngày không được vượt quá 8 giờ")
  }

  // Kiểm tra focus areas
  const remainingAreas = config.focusAreas.filter((area) => !adjustment.removeFocusAreas.includes(area))
  if (remainingAreas.length + adjustment.addFocusAreas.length === 0) {
    errors.push("Phải có ít nhất 1 lĩnh vực tập trung")
  }

  // Kiểm tra gia hạn
  if (adjustment.extendDays < 0) {
    errors.push("Số ngày gia hạn không được âm")
  }

  return {
    valid: errors.length === 0,
    errors,
  }
}
