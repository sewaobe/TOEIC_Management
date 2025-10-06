import { useEffect, useState } from "react"
import {
  Box,
  Typography,
  Avatar,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  Paper,
  Modal,
  TextField,
  Button,
  ToggleButtonGroup,
  ToggleButton,
} from "@mui/material"
import {
  AccessTime,
  MoreVert,
  HelpOutline,
  FeedbackOutlined,
  BugReportOutlined,
  CommentOutlined,
  OpenInNew,
  Reply,
  FlagOutlined,
  DeleteOutline,
} from "@mui/icons-material"
import { motion, AnimatePresence } from "framer-motion"
import { useTablePagination } from "../../../hooks/useTablePagination"
import TablePaginationContainer from "../../../components/TablePaginationContainer"
import { commentService } from "../../../services/comment.service"

// ===================== TYPES =====================
export interface CommentItem {
  id: string
  user: string
  content: string
  time: string
  avatar: string
  type: "test" | "lesson"
  flagged?: boolean
}

interface Props {
  isDemo?: boolean // 🔥 Chế độ demo
}

// ===================== MAIN COMPONENT =====================
export default function RecentCommentDashboard({ isDemo = false }: Props) {
  const [comments, setComments] = useState<CommentItem[]>([])
  const [total, setTotal] = useState(0)
  const [filter, setFilter] = useState<"all" | "test" | "lesson">("all")
  const { page, rowsPerPage, handleChangePage, handleChangeRowsPerPage } = useTablePagination({
    initialRowsPerPage: 5,
  })

  const [replyModal, setReplyModal] = useState<{ open: boolean; comment?: CommentItem }>({
    open: false,
  })
  const [confirmModal, setConfirmModal] = useState<{ open: boolean; comment?: CommentItem }>({
    open: false,
  })

  // ===================== FETCH DATA =====================
  useEffect(() => {
    async function fetchData() {
      const res = await commentService.getRecentCommentDashboard(page + 1, rowsPerPage)
      setComments(res.items)
      setTotal(res.total)
    }
    fetchData()
  }, [page, rowsPerPage])

  // ===================== FILTER LOGIC =====================
  const filteredComments =
    filter === "all" ? comments : comments.filter((c) => c.type === filter)

  // Nếu ở chế độ demo → chỉ hiển thị 5 comment đầu tiên
  const visibleComments = isDemo ? filteredComments.slice(0, 5) : filteredComments

  // ===================== HANDLERS =====================
  const handleFlagComment = (comment: CommentItem) => {
    setComments((prev) => {
      const updated = prev.map((c) =>
        c.id === comment.id ? { ...c, flagged: !c.flagged } : c
      );
      // Sort: đưa comment được gắn cờ lên đầu
      updated.sort((a, b) => (b.flagged ? 1 : 0) - (a.flagged ? 1 : 0));
      return updated;
    });
  };


  const handleDeleteConfirm = (comment: CommentItem) => {
    setComments((prev) => prev.filter((c) => c.id !== comment.id))
    setConfirmModal({ open: false })
  }

  // ===================== RENDER =====================
  return (
    <Paper className="p-6 rounded-2xl border-0 shadow-md hover:shadow-xl transition-shadow">
      {/* Header */}
      <Box className="flex items-center justify-between mb-5 flex-wrap gap-3">
        <Box className="flex items-center gap-2">
          <Box className="p-2 rounded-lg bg-indigo-500">
            <CommentOutlined sx={{ color: "#fff" }} />
          </Box>
          <Typography variant="h6" fontWeight="bold" color="#111827">
            Bình luận gần đây
          </Typography>
        </Box>

        {!isDemo && (
          <ToggleButtonGroup
            size="small"
            color="primary"
            value={filter}
            exclusive
            onChange={(_, newValue) => newValue && setFilter(newValue)}
          >
            <ToggleButton value="all">Tất cả</ToggleButton>
            <ToggleButton value="test">Đề thi</ToggleButton>
            <ToggleButton value="lesson">Bài học</ToggleButton>
          </ToggleButtonGroup>
        )}
      </Box>

      {/* Comment List */}
      <Box className="space-y-3 min-h-[300px]">
        <AnimatePresence>
          {visibleComments.length > 0 ? (
            visibleComments.map((comment) => (
              <motion.div
                key={comment.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ type: "spring", stiffness: 200, damping: 25 }}
              >
                <RecentCommentItem
                  comment={comment}
                  onAccess={() => console.log("🔗 Truy cập:", comment)}
                  onQuickReply={() => setReplyModal({ open: true, comment })}
                  onFlag={() => handleFlagComment(comment)}
                  onDelete={() => setConfirmModal({ open: true, comment })}
                />
              </motion.div>
            ))
          ) : (
            <Typography align="center" color="#6B7280" sx={{ py: 8, fontStyle: "italic" }}>
              Không có bình luận nào thuộc loại này.
            </Typography>
          )}
        </AnimatePresence>
      </Box>

      {/* Footer */}
      {isDemo ? (
        <Box className="flex justify-center mt-4">
          <Button
            variant="outlined"
            sx={{
              borderColor: "#6366F1",
              color: "#4F46E5",
              "&:hover": { backgroundColor: "#EEF2FF" },
              textTransform: "none",
            }}
            onClick={() => window.open("/ctv/report/comment", "_self")}
          >
            Xem thêm bình luận
          </Button>
        </Box>
      ) : (
        <TablePaginationContainer
          count={total}
          page={page}
          rowsPerPage={rowsPerPage}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      )}

      {/* Reply Modal */}
      <Modal
        open={replyModal.open}
        onClose={() => setReplyModal({ open: false })}
      >
        <Box
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-md bg-white rounded-2xl p-6 shadow-xl space-y-4"
        >
          <Typography variant="h6" fontWeight="bold">
            Phản hồi nhanh
          </Typography>
          <Typography color="text.secondary">
            Bình luận từ <strong>{replyModal.comment?.user}</strong>:
          </Typography>
          <Typography
            variant="body2"
            sx={{
              backgroundColor: "#F9FAFB",
              p: 2,
              borderRadius: 1.5,
              color: "#374151",
            }}
          >
            {replyModal.comment?.content}
          </Typography>
          <TextField
            multiline
            rows={4}
            fullWidth
            placeholder="Nhập phản hồi của bạn..."
          />
          <Box className="flex justify-end gap-2">
            <Button onClick={() => setReplyModal({ open: false })}>Hủy</Button>
            <Button
              variant="contained"
              sx={{ textTransform: "none" }}
              onClick={() => {
                setReplyModal({ open: false });
                console.log("📩 Gửi phản hồi cho:", replyModal.comment?.id);
              }}
            >
              Gửi phản hồi
            </Button>
          </Box>
        </Box>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        open={confirmModal.open}
        onClose={() => setConfirmModal({ open: false })}
      >
        <Box
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-sm bg-white rounded-2xl p-6 shadow-xl space-y-4"
        >
          <Typography variant="h6" fontWeight="bold" color="error">
            Xác nhận xóa
          </Typography>
          <Typography color="text.secondary">
            Bạn có chắc muốn xóa bình luận của{" "}
            <strong>{confirmModal.comment?.user}</strong> không?
          </Typography>
          <Box className="flex justify-end gap-2 mt-4">
            <Button onClick={() => setConfirmModal({ open: false })}>Hủy</Button>
            <Button
              variant="contained"
              color="error"
              sx={{ textTransform: "none" }}
              onClick={() => handleDeleteConfirm(confirmModal.comment!)}
            >
              Xóa
            </Button>
          </Box>
        </Box>
      </Modal>
    </Paper>
  )
}

/* -------------------- ITEM COMPONENT -------------------- */
function RecentCommentItem({
  comment,
  onAccess,
  onQuickReply,
  onFlag,
  onDelete,
}: {
  comment: CommentItem
  onAccess: () => void
  onQuickReply: () => void
  onFlag: () => void
  onDelete: () => void
}) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)
  const handleMenuOpen = (e: React.MouseEvent<HTMLElement>) => setAnchorEl(e.currentTarget)
  const handleMenuClose = () => setAnchorEl(null)

  const styleByType = {
    test: {
      gradient: "linear-gradient(90deg, #EFF6FF, #DBEAFE)",
      border: "#60A5FA",
      chipBg: "#3B82F6",
      chipText: "#DBEAFE",
      text: "#1E3A8A",
    },
    lesson: {
      gradient: "linear-gradient(90deg, #ECFDF5, #D1FAE5)",
      border: "#34D399",
      chipBg: "#10B981",
      chipText: "#D1FAE5",
      text: "#065F46",
    },
  }[comment.type]

  return (
    <Box
      className="p-4 rounded-xl border hover:shadow-md transition-all hover:scale-[1.01] relative"
      sx={{ background: styleByType.gradient, borderColor: styleByType.border }}
    >
      {comment.flagged && (
        <FlagOutlined
          sx={{
            position: "absolute",
            top: 10,
            right: 10,
            fontSize: 18,
            color: "#F59E0B",
          }}
        />
      )}

      <Box className="flex items-start gap-3">
        <Avatar
          sx={{
            background: "linear-gradient(135deg, #6366F1, #8B5CF6)",
            fontWeight: 600,
            color: "#fff",
          }}
        >
          {comment.avatar}
        </Avatar>

        <Box flex={1}>
          <Box className="flex items-center gap-2 mb-2 flex-wrap">
            <Typography fontWeight="bold" sx={{ color: "#111827" }}>
              {comment.user}
            </Typography>

            <Chip
              icon={
                comment.type === "test" ? (
                  <FeedbackOutlined sx={{ fontSize: 14 }} />
                ) : (
                  <CommentOutlined sx={{ fontSize: 14 }} />
                )
              }
              label={
                comment.type === "test"
                  ? "Đề thi"
                  : "Bài học"
              }
              size="small"
              sx={{
                backgroundColor: styleByType.chipBg,
                color: styleByType.chipText,
                fontWeight: 600,
              }}
            />

            <Box className="flex items-center gap-1 ml-auto text-gray-500">
              <AccessTime sx={{ fontSize: 14, color: "#6B7280" }} />
              <Typography variant="caption" color="#6B7280">
                {comment.time}
              </Typography>

              <IconButton
                size="small"
                onClick={handleMenuOpen}
                sx={{ "&:hover": { backgroundColor: "#E5E7EB" } }}
              >
                <MoreVert sx={{ fontSize: 18, color: "#6B7280" }} />
              </IconButton>
            </Box>
          </Box>

          <Typography sx={{ color: styleByType.text, lineHeight: 1.6 }}>
            {comment.content}
          </Typography>
        </Box>
      </Box>

      {/* Menu */}
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleMenuClose}
        PaperProps={{
          sx: {
            borderRadius: 2,
            minWidth: 180,
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            p: 0.5,
          },
        }}
      >
        <MenuItem
          onClick={() => {
            handleMenuClose()
            onAccess()
          }}
        >
          <OpenInNew sx={{ fontSize: 18, mr: 1, color: "#2563EB" }} />
          Truy cập tới
        </MenuItem>
        <MenuItem
          onClick={() => {
            handleMenuClose()
            onQuickReply()
          }}
        >
          <Reply sx={{ fontSize: 18, mr: 1, color: "#059669" }} />
          Phản hồi nhanh
        </MenuItem>
        <MenuItem
          onClick={() => {
            handleMenuClose();
            onFlag();
          }}
          sx={{
            fontWeight: comment.flagged ? 600 : 400,
            backgroundColor: comment.flagged ? "#FFF7ED" : "transparent",
          }}
        >
          <FlagOutlined
            sx={{
              fontSize: 18,
              mr: 1,
              color: comment.flagged ? "#D97706" : "#F59E0B",
            }}
          />
          {comment.flagged ? "Bỏ gắn cờ" : "Gắn cờ"}
        </MenuItem>
        <MenuItem
          onClick={() => {
            handleMenuClose()
            onDelete()
          }}
        >
          <DeleteOutline sx={{ fontSize: 18, mr: 1, color: "#DC2626" }} />
          Xóa bình luận
        </MenuItem>
      </Menu>
    </Box>
  )
}
