import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Box,
  Typography,
} from "@mui/material"
import {
  ArticleOutlined,
  SchoolOutlined,
  CommentOutlined,
  BugReportOutlined,
  StarBorderOutlined,
  TrendingUpOutlined,
} from "@mui/icons-material"
import { useTheme } from "@mui/material/styles"
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns"
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider"
import { DatePicker } from "@mui/x-date-pickers/DatePicker"
import { vi } from "date-fns/locale"
import { ReportType } from "../../../types/Report"
import React, { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { AppDispatch, RootState } from "../../../stores/store"
import {
  fetchReportData,
  setDateRange,
  setReportType,
} from "../../../stores/reportFilterSlice"

export default function ReportFilter() {
  const theme = useTheme()
  const dispatch = useDispatch<AppDispatch>()
  const { reportType, dateRange } = useSelector(
    (state: RootState) => state.reportFilter
  )
  const [startDate, endDate] = dateRange

  // 🎨 Màu icon riêng cho từng loại báo cáo
  const iconColors: Record<ReportType, string> = {
    contentCreation: theme.palette.primary.main,
    studentActivity: theme.palette.success.main,
    commentFeedback: theme.palette.info.main,
    errorReports: theme.palette.error.main,
    ratingPerformance: theme.palette.warning.main,
    overallPerformance: theme.palette.secondary.main,
  }

  const options = [
    { value: "contentCreation", label: "Nội dung đã tạo", icon: <ArticleOutlined /> },
    { value: "studentActivity", label: "Hoạt động học viên", icon: <SchoolOutlined /> },
    { value: "commentFeedback", label: "Bình luận & phản hồi", icon: <CommentOutlined /> },
    { value: "errorReports", label: "Báo lỗi & cập nhật", icon: <BugReportOutlined /> },
    { value: "ratingPerformance", label: "Hiệu suất đánh giá", icon: <StarBorderOutlined /> },
    { value: "overallPerformance", label: "Hiệu suất tổng quan", icon: <TrendingUpOutlined /> },
  ]

  // 🔁 Fetch lại dữ liệu mỗi khi filter thay đổi
  useEffect(() => {
    dispatch(fetchReportData({ reportType, dateRange }))
  }, [reportType, dateRange, dispatch])

  return (
    <Grid container spacing={3} sx={{ mb: 3 }}>
      {/* Loại báo cáo */}
      <Grid size={{ xs: 12, md: 6 }}>
        <FormControl fullWidth size="small">
          <InputLabel id="report-type-label">Loại Báo cáo</InputLabel>
          <Select
            labelId="report-type-label"
            value={reportType}
            label="Loại Báo cáo"
            onChange={(e) => dispatch(setReportType(e.target.value as ReportType))}
          >
            {options.map((opt) => (
              <MenuItem key={opt.value} value={opt.value}>
                <Box display="flex" alignItems="center" gap={1}>
                  {React.cloneElement(opt.icon, {
                    sx: { color: iconColors[opt.value as ReportType], fontSize: 20 },
                  })}
                  <Typography>{opt.label}</Typography>
                </Box>
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>

      {/* Khoảng thời gian */}
      <Grid size={{ xs: 12, md: 6 }}>
        <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={vi}>
          <Box display="flex" alignItems="center" gap={2}>
            <DatePicker
              label="Từ ngày"
              value={startDate}
              onChange={(newStart) =>
                dispatch(setDateRange([newStart, endDate]))
              }
              slotProps={{ textField: { fullWidth: true, size: "small" } }}
            />
            <DatePicker
              label="Đến ngày"
              value={endDate}
              onChange={(newEnd) =>
                dispatch(setDateRange([startDate, newEnd]))
              }
              slotProps={{ textField: { fullWidth: true, size: "small" } }}
            />
          </Box>
        </LocalizationProvider>
      </Grid>
    </Grid>
  )
}
