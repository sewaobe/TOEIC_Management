import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit"
import { ReportType } from "../types/Report"
import { reportService } from "../services/report.service"

interface ReportFilterState {
  reportType: ReportType
  dateRange: [Date | null, Date | null]
  data: any[]
  loading: boolean
  error: string | null
}

const initialState: ReportFilterState = {
  reportType: "contentCreation",
  dateRange: [new Date("2025-01-01"), new Date("2025-03-31")],
  data: [],
  loading: false,
  error: null,
}

// Giả lập API
export const fetchReportData = createAsyncThunk(
  "reportFilter/fetchReportData",
  async (
    { reportType, dateRange }: { reportType: ReportType; dateRange: [Date | null, Date | null] },
    thunkAPI
  ) => {
    try {
      const data = await reportService.fetchReportData(reportType, dateRange)
      return data
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.message)
    }
  }
)

const reportFilterSlice = createSlice({
  name: "reportFilter",
  initialState,
  reducers: {
    setReportType(state, action: PayloadAction<ReportType>) {
      state.reportType = action.payload
    },
    setDateRange(state, action: PayloadAction<[Date | null, Date | null]>) {
      state.dateRange = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchReportData.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchReportData.fulfilled, (state, action) => {
        state.loading = false
        state.data = action.payload
      })
      .addCase(fetchReportData.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
  },
})

export const { setReportType, setDateRange } = reportFilterSlice.actions
export default reportFilterSlice.reducer
