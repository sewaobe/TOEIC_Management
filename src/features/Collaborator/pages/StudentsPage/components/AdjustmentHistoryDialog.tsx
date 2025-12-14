import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  List,
  ListItem,
  Chip,
  CircularProgress,
  IconButton,
  Divider,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useTheme } from "@mui/material/styles";
import {
  IAdjustmentRequest,
  AdjustmentStatus,
} from "../../../../../types/adjustment";
import { adjustmentService } from "../services/adjustmentService";

interface AdjustmentHistoryDialogProps {
  open: boolean;
  onClose: () => void;
  studentId: string | null;
  studentName?: string;
  initialRequestId?: string | null;
}

export const AdjustmentHistoryDialog: React.FC<
  AdjustmentHistoryDialogProps
> = ({ open, onClose, studentId, studentName, initialRequestId }) => {
  const theme = useTheme();
  const [requests, setRequests] = useState<IAdjustmentRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedRequest, setSelectedRequest] =
    useState<IAdjustmentRequest | null>(null);

  useEffect(() => {
    if (open && studentId) {
      fetchRequests();
    }
  }, [open, studentId]);

  // Tự động mở chi tiết nếu có initialRequestId
  useEffect(() => {
    if (initialRequestId && requests.length > 0) {
      const request = requests.find((r) => r._id === initialRequestId);
      if (request) {
        setSelectedRequest(request);
      }
    }
  }, [initialRequestId, requests]);

  const fetchRequests = async () => {
    if (!studentId) return;
    setLoading(true);
    try {
      const res: any = await adjustmentService.getByStudentId(studentId);
      let data: IAdjustmentRequest[] = [];
      if (Array.isArray(res)) data = res;
      else if (res?.data && Array.isArray(res.data)) data = res.data;
      else if (res?.data?.data && Array.isArray(res.data.data))
        data = res.data.data;

      setRequests(data);
    } catch (error) {
      console.error("Error fetching adjustment history:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: AdjustmentStatus) => {
    switch (status) {
      case AdjustmentStatus.PENDING:
        return "warning";
      case AdjustmentStatus.APPROVED:
        return "success";
      case AdjustmentStatus.REJECTED:
        return "error";
      default:
        return "default";
    }
  };

  const getStatusLabel = (status: AdjustmentStatus) => {
    switch (status) {
      case AdjustmentStatus.PENDING:
        return "Đang chờ";
      case AdjustmentStatus.APPROVED:
        return "Đã chấp nhận";
      case AdjustmentStatus.REJECTED:
        return "Đã từ chối";
      default:
        return status;
    }
  };

  const handleViewDetail = (request: IAdjustmentRequest) => {
    setSelectedRequest(request);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          {selectedRequest ? (
            <Box display="flex" alignItems="center" gap={1}>
              <IconButton size="small" onClick={() => setSelectedRequest(null)}>
                <ArrowBackIcon fontSize="small" />
              </IconButton>
              <Typography variant="subtitle1">
                Chi tiết đề xuất điều chỉnh
              </Typography>
            </Box>
          ) : (
            <span>
              Lịch sử điều chỉnh lộ trình - {studentName || "Học viên"}
            </span>
          )}

          <Box>
            {selectedRequest && (
              <Chip
                label={getStatusLabel(selectedRequest.status)}
                color={getStatusColor(selectedRequest.status)}
                size="small"
                sx={{ mr: 1 }}
              />
            )}
            <IconButton size="small" onClick={onClose}>
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>
        </Box>
      </DialogTitle>
      <DialogContent dividers>
        {loading ? (
          <Box display="flex" justifyContent="center" py={4}>
            <CircularProgress />
          </Box>
        ) : selectedRequest ? (
          (() => {
            const isPending =
              selectedRequest.status === AdjustmentStatus.PENDING;
            const isApproved =
              selectedRequest.status === AdjustmentStatus.APPROVED;
            const isRejected =
              selectedRequest.status === AdjustmentStatus.REJECTED;
            return (
              <>
                <Box mb={2}>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    gutterBottom
                  >
                    Thời gian gửi:
                  </Typography>
                  <Typography variant="body1">
                    {new Date(selectedRequest.createdAt).toLocaleString(
                      "vi-VN"
                    )}
                  </Typography>
                </Box>

                <Box bgcolor="grey.50" p={2} borderRadius={2} mb={2}>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    gutterBottom
                  >
                    Lý do điều chỉnh:
                  </Typography>
                  <Typography variant="body1" fontStyle="italic">
                    "{selectedRequest.reason}"
                  </Typography>
                </Box>

                <Typography variant="subtitle2" gutterBottom>
                  Chi tiết thay đổi:
                </Typography>
                <List dense>
                  {selectedRequest.changes.map((change, index) => {
                    const getLessonTitle = (
                      item: any,
                      fallback: string
                    ): string => {
                      if (!item) return fallback;
                      return typeof item === "string"
                        ? fallback
                        : item.title || fallback;
                    };
                    const locationText = [
                      change.weekTitle ||
                        (change.weekNumber ? `Tuần ${change.weekNumber}` : ""),
                      change.dayTitle ||
                        (change.dayNumber ? `Ngày ${change.dayNumber}` : ""),
                    ]
                      .filter(Boolean)
                      .join(", ");

                    let actionText = "";
                    if (change.action === "REMOVE") {
                      actionText = `Xóa "${change.lessonTitle || "Bài học"}"`;
                    } else if (change.action === "ADD") {
                      actionText = `Thêm "${change.lessonTitle || "Bài học"}"`;
                    } else if (change.action === "REPLACE") {
                      actionText = `Thay "${
                        change.oldLessonTitle || "Bài cũ"
                      }" bằng "${change.lessonTitle || "Bài mới"}"`;
                    }

                    // Code cũ dưới đây để backup
                    /*
                    if (change.action === "REMOVE") {
                      // Code backup đã xóa
                    */

                    const fullText = locationText
                      ? `${actionText} ở ${locationText}`
                      : actionText;

                    return (
                      <ListItem
                        key={index}
                        sx={{
                          borderBottom: "1px solid #eee",
                          flexDirection: "column",
                          alignItems: "flex-start",
                          py: 1.5,
                        }}
                      >
                        <Box
                          display="flex"
                          alignItems="center"
                          gap={1}
                          mb={0.5}
                        >
                          <Chip
                            size="small"
                            label={
                              change.action === "REMOVE"
                                ? "Xóa"
                                : change.action === "ADD"
                                ? "Thêm"
                                : "Thay thế"
                            }
                            color={
                              change.action === "REMOVE"
                                ? "error"
                                : change.action === "ADD"
                                ? "success"
                                : "info"
                            }
                          />
                          <Typography variant="body2" fontWeight={500}>
                            {fullText}
                          </Typography>
                        </Box>
                        {change.note && (
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{ pl: 1, fontStyle: "italic" }}
                          >
                            Ghi chú: {change.note}
                          </Typography>
                        )}
                      </ListItem>
                    );
                  })}
                </List>

                {!isPending && (
                  <Box
                    mt={2}
                    p={2}
                    borderRadius={2}
                    sx={{
                      bgcolor: isApproved
                        ? theme.palette.success.light
                        : theme.palette.error.light,
                      color: isApproved
                        ? theme.palette.success.contrastText
                        : theme.palette.error.contrastText,
                    }}
                  >
                    <Typography variant="body1" fontWeight="bold">
                      {isApproved
                        ? "✅ Học viên đã chấp nhận"
                        : "❌ Học viên đã từ chối"}
                    </Typography>
                    {isRejected && selectedRequest.rejectionReason && (
                      <Typography variant="body2" sx={{ mt: 1 }}>
                        Lý do: {selectedRequest.rejectionReason}
                      </Typography>
                    )}
                  </Box>
                )}
              </>
            );
          })()
        ) : requests.length === 0 ? (
          <Box py={4} textAlign="center">
            <Typography variant="body2" color="text.secondary">
              Chưa có lịch sử điều chỉnh nào
            </Typography>
          </Box>
        ) : (
          <List>
            {requests.map((request, index) => (
              <React.Fragment key={request._id}>
                <ListItem
                  sx={{
                    flexDirection: "column",
                    alignItems: "flex-start",
                    "&:hover": {
                      bgcolor: theme.palette.action.hover,
                      cursor: "pointer",
                    },
                  }}
                  onClick={() => handleViewDetail(request)}
                >
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    width="100%"
                    mb={1}
                  >
                    <Box display="flex" alignItems="center" gap={1}>
                      <Typography variant="body2" fontWeight={600}>
                        Đề xuất #{requests.length - index}
                      </Typography>
                      <Chip
                        label={getStatusLabel(request.status)}
                        color={getStatusColor(request.status)}
                        size="small"
                      />
                    </Box>
                    <Typography variant="caption" color="text.secondary">
                      {new Date(request.createdAt).toLocaleString("vi-VN", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </Typography>
                  </Box>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}
                  >
                    {request.reason}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" mt={0.5}>
                    {request.changes.length} thay đổi
                  </Typography>
                </ListItem>
                {index < requests.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        )}
      </DialogContent>
      <DialogActions>
        {selectedRequest ? (
          <>
            <Button onClick={() => setSelectedRequest(null)}>Quay lại</Button>
            <Button onClick={onClose}>Đóng</Button>
          </>
        ) : (
          <Button onClick={onClose}>Đóng</Button>
        )}
      </DialogActions>
    </Dialog>
  );
};
