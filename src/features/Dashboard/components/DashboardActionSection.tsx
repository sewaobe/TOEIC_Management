import { Box, Typography, Grid, Paper } from "@mui/material"
import { WarningAmberOutlined } from "@mui/icons-material"
import { ActionItems } from "../../../types/Dashboard"

interface Props {
    data: ActionItems
}

export default function DashboardActionSection({ data }: Props) {
    return (
        <Paper
            className="p-6 rounded-2xl border mb-6 hover:shadow-md transition-all"
            sx={{
                background: "linear-gradient(180deg, #F8FAFC 0%, #FFF7ED 100%)",
                borderColor: "#E5E7EB",
            }}
        >
            {/* Header */}
            <Box className="flex items-center gap-3 mb-6">
                <Box className="p-2 rounded-lg bg-gradient-to-br from-[#F59E0B] to-[#FBBF24] shadow-md">
                    <WarningAmberOutlined sx={{ color: "#fff", fontSize: 22 }} />
                </Box>
                <Box>
                    <Typography
                        variant="h6"
                        sx={{
                            fontWeight: 700,
                            color: "#92400E",
                            letterSpacing: 0.3,
                            lineHeight: 1.3,
                        }}
                    >
                        Cần xử lý
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#A16207", opacity: 0.9 }}>
                        Tổng hợp các mục bạn nên kiểm tra ngay
                    </Typography>
                </Box>
            </Box>

            {/* Inner Stats */}
            <Grid container spacing={3}>
                {/* 🟡 Chờ duyệt */}
                <Grid size={{ xs: 6, sm: 3 }}>
                    <Box className="text-center p-4 rounded-xl bg-gradient-to-br from-[#FEF3C7] to-[#FDE68A] border border-[#FBBF24]/40 hover:shadow-md transition-all">
                        <Typography variant="h4" sx={{ fontWeight: 800, color: "#92400E", mb: 0.5 }}>
                            {data.pendingApproval}
                        </Typography>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600, color: "#78350F", opacity: 0.85 }}>
                            Chờ duyệt
                        </Typography>
                    </Box>
                </Grid>

                {/* 🔵 Bình luận chưa trả lời */}
                <Grid size={{ xs: 6, sm: 3 }}>
                    <Box className="text-center p-4 rounded-xl border hover:shadow-sm transition-all"
                        sx={{ backgroundColor: "#CCFBF1", borderColor: "#2DD4BF" }}
                    >
                        <Typography variant="h4" sx={{ fontWeight: 800, color: "#115E59", mb: 0.5 }}>
                            {data.unansweredComments}
                        </Typography>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600, color: "#134E4A", opacity: 0.85 }}>
                            Bình luận chưa trả lời
                        </Typography>
                    </Box>
                </Grid>

                {/* 🟣 Cần cập nhật */}
                <Grid size={{ xs: 6, sm: 3 }}>
                    <Box className="text-center p-4 rounded-xl bg-gradient-to-br from-[#EDE9FE] to-[#DDD6FE] border border-[#A78BFA]/40 hover:shadow-md transition-all">
                        <Typography variant="h4" sx={{ fontWeight: 800, color: "#4C1D95", mb: 0.5 }}>
                            {data.needsUpdate}
                        </Typography>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600, color: "#5B21B6", opacity: 0.85 }}>
                            Cần cập nhật
                        </Typography>
                    </Box>
                </Grid>

                {/* 🔴 Báo lỗi */}
                <Grid size={{ xs: 6, sm: 3 }}>
                    <Box className="text-center p-4 rounded-xl bg-gradient-to-br from-[#FEE2E2] to-[#FECACA] border border-[#F87171]/40 hover:shadow-md transition-all">
                        <Typography variant="h4" sx={{ fontWeight: 800, color: "#991B1B", mb: 0.5 }}>
                            {data.errorReports}
                        </Typography>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600, color: "#7F1D1D", opacity: 0.85 }}>
                            Báo lỗi
                        </Typography>
                    </Box>
                </Grid>
            </Grid>
        </Paper>
    )
}
