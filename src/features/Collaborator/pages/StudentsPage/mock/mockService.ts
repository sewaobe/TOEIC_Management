// Service giả lập API calls với delay

import type { Student, StudentDetail, GroupReport, LearningPathAdjustment } from "./mockTypes"
import { mockStudents, mockGroupReports, getStudentDetail } from "./mockData"

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export const mockService = {
  // Lấy danh sách học viên với filter
  async getStudents(filters?: {
    search?: string
    status?: string
    learningPath?: string
  }): Promise<Student[]> {
    await delay(500)

    let filtered = [...mockStudents]

    if (filters?.search) {
      const searchLower = filters.search.toLowerCase()
      filtered = filtered.filter(
        (s) =>
          s.name.toLowerCase().includes(searchLower) ||
          s.email.toLowerCase().includes(searchLower) ||
          s.id.toLowerCase().includes(searchLower),
      )
    }

    if (filters?.status && filters.status !== "all") {
      filtered = filtered.filter((s) => s.status === filters.status)
    }

    if (filters?.learningPath && filters.learningPath !== "all") {
      filtered = filtered.filter((s) => s.learningPath === filters.learningPath)
    }

    return filtered
  },

  // Lấy chi tiết học viên
  async getStudentDetail(studentId: string): Promise<StudentDetail | null> {
    await delay(300)
    return getStudentDetail(studentId)
  },

  // Cập nhật lộ trình học
  async updateLearningPath(studentId: string, adjustment: LearningPathAdjustment): Promise<StudentDetail> {
    await delay(800)

    const detail = getStudentDetail(studentId)
    if (!detail) throw new Error("Student not found")

    // Áp dụng các thay đổi
    detail.learningPathConfig.lessonsPerWeek += adjustment.lessonsPerWeekDelta
    detail.learningPathConfig.hoursPerDay += adjustment.hoursPerDayDelta

    adjustment.addFocusAreas.forEach((area) => {
      if (!detail.learningPathConfig.focusAreas.includes(area)) {
        detail.learningPathConfig.focusAreas.push(area)
      }
    })

    adjustment.removeFocusAreas.forEach((area) => {
      detail.learningPathConfig.focusAreas = detail.learningPathConfig.focusAreas.filter((a) => a !== area)
    })

    if (adjustment.extendDays > 0) {
      const targetDate = new Date(detail.learningPathConfig.targetDate)
      targetDate.setDate(targetDate.getDate() + adjustment.extendDays)
      detail.learningPathConfig.targetDate = targetDate.toISOString().split("T")[0]
    }

    return detail
  },

  // Lấy báo cáo nhóm
  async getGroupReports(): Promise<GroupReport[]> {
    await delay(600)
    return mockGroupReports
  },
}
