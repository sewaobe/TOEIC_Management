import { Grid, Paper, Box, Typography, Chip } from "@mui/material"
import {
    PeopleOutline,
    TrendingUp,
    TrendingDown,
    StarOutline,
    CheckCircleOutline,
} from "@mui/icons-material"
import { KPIData } from "../../../types/Dashboard"

interface Props {
    data: KPIData
}

export default function DashboardKpiSection({ data }: Props) {
    return (
        <Grid container spacing={3} className="mb-6">
            {/* Total Learners */}
            <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
                <Paper className="p-5 rounded-2xl border-0 !bg-gradient-to-br from-[#C7D2FE] to-[#A5B4FC] text-[#312E81] hover:shadow-xl hover:scale-105 transition-all duration-300">
                    <Box className="flex items-start justify-between mb-4">
                        <Box className="p-3 bg-white/40 rounded-xl text-[#4338CA]">
                            <PeopleOutline sx={{ fontSize: 28 }} />
                        </Box>
                        <Chip
                            icon={<TrendingUp sx={{ fontSize: 16, color: "#4338CA" }} />}
                            label={`+${data.learnerGrowth}%`}
                            size="small"
                            className="font-semibold border border-[#4338CA]/40 bg-[#E0E7FF]/50 text-[#4338CA] backdrop-blur-sm"
                        />
                    </Box>
                    <Typography variant="h3" className="font-bold mb-1 text-[#1E1B4B]">
                        {data.totalLearners.toLocaleString()}
                    </Typography>
                    <Typography variant="body2" className="text-[#4B5563] opacity-80">
                        Tổng số người học
                    </Typography>
                </Paper>
            </Grid>

            {/* Average Rating */}
            <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
                <Paper className="p-5 rounded-2xl border-0 !bg-gradient-to-br from-[#FFE4CC] to-[#FFD1B5] text-[#78350F] hover:shadow-xl hover:scale-105 transition-all duration-300">
                    <Box className="flex items-start justify-between mb-4">
                        <Box className="p-3 bg-white/40 rounded-xl text-[#B45309]">
                            <StarOutline sx={{ fontSize: 28 }} />
                        </Box>
                        <Chip
                            icon={<TrendingUp sx={{ fontSize: 16, color: "#B45309" }} />}
                            label={`+${data.ratingChange}`}
                            size="small"
                            className="font-semibold border border-[#B45309]/40 bg-[#FFF0DA]/60 text-[#B45309] backdrop-blur-sm"
                        />
                    </Box>
                    <Typography variant="h3" className="font-bold mb-1 text-[#78350F]">
                        {data.avgRating}
                    </Typography>
                    <Typography variant="body2" className="text-[#7C2D12] opacity-80">
                        Đánh giá trung bình
                    </Typography>
                </Paper>
            </Grid>

            {/* Engagement Rate */}
            <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
                <Paper className="p-5 rounded-2xl border-0 !bg-gradient-to-br from-[#BBF7D0] to-[#86EFAC] text-[#14532D] hover:shadow-xl hover:scale-105 transition-all duration-300">
                    <Box className="flex items-start justify-between mb-4">
                        <Box className="p-3 bg-white/40 rounded-xl text-[#15803D]">
                            <TrendingUp sx={{ fontSize: 28 }} />
                        </Box>
                        <Chip
                            icon={<TrendingUp sx={{ fontSize: 16, color: "#15803D" }} />}
                            label={`+${data.engagementChange}%`}
                            size="small"
                            className="font-semibold border border-[#15803D]/40 bg-[#DCFCE7]/50 text-[#15803D] backdrop-blur-sm"
                        />
                    </Box>
                    <Typography variant="h3" className="font-bold mb-1 text-[#166534]">
                        {data.engagementRate}%
                    </Typography>
                    <Typography variant="body2" className="text-[#064E3B] opacity-80">
                        Tỷ lệ tương tác
                    </Typography>
                </Paper>
            </Grid>

            {/* Completion Rate */}
            <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
                <Paper className="p-5 rounded-2xl border-0 !bg-gradient-to-br from-[#DBEAFE] to-[#BFDBFE] text-[#1E3A8A] hover:shadow-xl hover:scale-105 transition-all duration-300">
                    <Box className="flex items-start justify-between mb-4">
                        <Box className="p-3 bg-white/40 rounded-xl text-[#1E40AF]">
                            <CheckCircleOutline sx={{ fontSize: 28 }} />
                        </Box>
                        <Chip
                            icon={<TrendingDown sx={{ fontSize: 16, color: "#1E40AF" }} />}
                            label={`${data.completionChange}%`}
                            size="small"
                            className="font-semibold border border-[#1E40AF]/40 bg-[#E0F2FE]/60 text-[#1E40AF] backdrop-blur-sm"
                        />
                    </Box>
                    <Typography variant="h3" className="font-bold mb-1 text-[#1E3A8A]">
                        {data.completionRate}%
                    </Typography>
                    <Typography variant="body2" className="text-[#1E293B] opacity-80">
                        Tỷ lệ hoàn thành
                    </Typography>
                </Paper>
            </Grid>
        </Grid>
    )
}
