import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  CircularProgress,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Checkbox,
  Box,
  Typography,
  TextField,
  Pagination,
  Divider,
  Avatar,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useFetchList } from "../../../../hooks/useFetchList";
import { toast } from "sonner";
import groupService from "../../../../services/group.service";
import GroupDetailModal from "../../pages/QuestionPage/GroupDetailModal"; // ✅ import modal chi tiết

interface Props {
  open: boolean;
  part: number;
  onClose: () => void;
  onConfirm: (groups: any[]) => void;
}

const PAGE_SIZE = 10;

const SelectGroupDialog = ({ open, part, onClose, onConfirm }: Props) => {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [detailId, setDetailId] = useState<string | null>(null); // ✅ xem chi tiết

  // ✅ Dùng hook useFetchList để quản lý fetch và phân trang
  const {
    items: groups,
    pageCount,
    total,
    isLoading,
    refresh,
  } = useFetchList<
    any,
    { page: number; limit: number; part: number; query?: string }
  >({
    fetchFn: async (params) => {
      const res = await groupService.getAllQuestionsWithGroup(params || {});
      const { items = [], total = 0 } = res || {};
      const map = new Map<string, any>();

      items.forEach((q: any) => {
        const gid = q.group_id;
        if (!map.has(gid)) {
          map.set(gid, {
            id: gid,
            part: q.group_part,
            firstQuestion: q.textQuestion || "", // ✅ lấy nội dung câu hỏi đầu tiên
            hasAudio: !!q.group_audioUrl,
            images:
              Array.isArray(q.group_imagesUrl) && q.group_imagesUrl.length > 0
                ? q.group_imagesUrl
                : [],
            questionCount: 0,
          });
        }
        map.get(gid).questionCount++;
      });

      return {
        items: Array.from(map.values()),
        pageCount: Math.ceil(total / PAGE_SIZE),
        total,
      };
    },
  });

  // ✅ Khi mở dialog hoặc đổi part → fetch mới
  useEffect(() => {
    if (!open) return;
    refresh({ page: 1, limit: PAGE_SIZE, part, query: search });
  }, [open, part]);

  // ✅ Reset khi đổi part
  useEffect(() => {
    setSelected(new Set());
    setPage(1);
    setSearch("");
  }, [part]);

  // ✅ Chuyển trang
  const handlePageChange = (_: any, newPage: number) => {
    setPage(newPage);
    refresh({ page: newPage, limit: PAGE_SIZE, part, query: search });
  };

  // ✅ Tìm kiếm
  const handleSearch = () => {
    setPage(1);
    refresh({ page: 1, limit: PAGE_SIZE, part, query: search });
  };

  // ✅ Toggle chọn group
  const toggleSelect = (id: string) => {
    const newSet = new Set(selected);
    newSet.has(id) ? newSet.delete(id) : newSet.add(id);
    setSelected(newSet);
  };

  // ✅ Xác nhận: gọi API lấy chi tiết từng group
  const handleConfirm = async () => {
    if (selected.size === 0) return onClose();
    setConfirmLoading(true);

    try {
      const selectedGroups = groups.filter((g) => selected.has(g.id));
      const fullGroups: any[] = [];

      for (const g of selectedGroups) {
        const res = await groupService.getById(g.id);
        if (res?.data) fullGroups.push(res.data);
      }

      toast.success(`Đã chọn ${fullGroups.length} group từ ngân hàng`);
      onConfirm(fullGroups);
      onClose();
    } catch (err) {
      toast.error("Lỗi khi tải chi tiết group");
      console.error(err);
    } finally {
      setConfirmLoading(false);
    }
  };

  // ====== Render ======
  return (
    <>
      <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
        <DialogTitle>Chọn group từ ngân hàng (Part {part})</DialogTitle>
        <DialogContent>
          {/* 🔍 Thanh tìm kiếm */}
          <Box display="flex" gap={2} mb={2}>
            <TextField
              fullWidth
              size="small"
              placeholder="Tìm theo transcript hoặc nội dung..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
            <Button variant="outlined" onClick={handleSearch}>
              Tìm
            </Button>
          </Box>

          {/* 🌀 Loading / Empty / List */}
          {isLoading ? (
            <Box display="flex" justifyContent="center" py={3}>
              <CircularProgress />
            </Box>
          ) : groups.length === 0 ? (
            <Typography textAlign="center" py={2}>
              Không có group nào cho Part {part}.
            </Typography>
          ) : (
            <>
              <List sx={{ maxHeight: 480, overflowY: "auto" }}>
                {groups.map((g, idx) => (
                  <ListItem
                    key={g.id}
                    disablePadding
                    divider
                    secondaryAction={
                      <Checkbox
                        checked={selected.has(g.id)}
                        onChange={() => toggleSelect(g.id)}
                      />
                    }
                  >
                    <ListItemButton
                      onClick={() => setDetailId(g.id)} // ✅ mở chi tiết
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 2,
                      }}
                    >
                      {/* 🖼️ Thumbnail (nếu có ảnh) */}
                      {g.images.length > 0 ? (
                        <Avatar
                          variant="rounded"
                          src={g.images[0].url}
                          sx={{
                            width: 70,
                            height: 50,
                            borderRadius: 1,
                            flexShrink: 0,
                          }}
                        />
                      ) : (
                        <Avatar
                          variant="rounded"
                          sx={{
                            width: 70,
                            height: 50,
                            borderRadius: 1,
                            flexShrink: 0,
                            bgcolor: "grey.200",
                            color: "text.secondary",
                            fontSize: 14,
                          }}
                        >
                          Không ảnh
                        </Avatar>
                      )}

                      {/* 📄 Nội dung */}
                      <ListItemText
                        primary={`Group ${idx + 1} - ${g.questionCount} câu`}
                        secondary={
                          <>
                            {g.firstQuestion ? (
                              <Typography
                                variant="body2"
                                color="text.secondary"
                                noWrap
                              >
                                {g.firstQuestion}
                              </Typography>
                            ) : (
                              <Typography variant="body2" color="gray">
                                (Không có nội dung câu hỏi)
                              </Typography>
                            )}

                            <Typography variant="caption" color="gray">
                              {g.hasAudio && "🎧 "}{" "}
                              {g.images.length > 0 && "🖼️ "}
                            </Typography>
                          </>
                        }
                      />
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>

              {/* 📄 Pagination */}
              <Box display="flex" justifyContent="center" py={2}>
                <Pagination
                  count={pageCount}
                  page={page}
                  onChange={handlePageChange}
                  color="primary"
                />
              </Box>
            </>
          )}
        </DialogContent>

        <Divider />
        <DialogActions>
          <Button onClick={onClose} disabled={confirmLoading}>
            Hủy
          </Button>
          <Button
            onClick={handleConfirm}
            variant="contained"
            disabled={selected.size === 0 || confirmLoading}
          >
            {confirmLoading ? (
              <CircularProgress size={22} sx={{ color: "white" }} />
            ) : (
              `Xác nhận (${selected.size})`
            )}
          </Button>
        </DialogActions>
      </Dialog>

      {/* 🔍 Modal xem chi tiết nhóm (chỉ đọc) */}
      <GroupDetailModal
        open={!!detailId}
        groupId={detailId}
        onClose={() => setDetailId(null)}
        readOnly
      />
    </>
  );
};

export default SelectGroupDialog;
