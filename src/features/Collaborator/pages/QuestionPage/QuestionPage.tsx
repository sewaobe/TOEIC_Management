import { Box, Typography, CircularProgress, useTheme } from "@mui/material";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { toast } from "sonner";

import { useFetchList } from "../../../../hooks/useFetchList";
import groupService from "../../../../services/group.service";
import { Question } from "../../../../types/question";

import ToolbarSection from "./ToolbarSection";
import QuestionTable from "./QuestionTable";
import DeleteConfirmDialog from "./DeleteConfirmDialog";
import GroupDetailModal from "./GroupDetailModal";
import useDebounce from "./useDebounce";

const QuestionPage = () => {
  const theme = useTheme();
  const navigate = useNavigate();

  // ===== State chính =====
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [partFilter, setPartFilter] = useState(0);
  const [tagFilter, setTagFilter] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10); // ✅ Cho phép đổi số dòng/trang
  const [openGroup, setOpenGroup] = useState<string | null>(null);
  const [openConfirm, setOpenConfirm] = useState(false);
  const pendingGroupId = useRef<string | null>(null);

  const debouncedSearch = useDebounce(search, 500);

  // ===== Fetch dữ liệu =====
  const {
    items: questions,
    pageCount,
    total,
    isLoading,
    refresh,
  } = useFetchList<Question, any>({
    fetchFn: (params) => groupService.getAllQuestionsWithGroup(params),
  });

  useEffect(() => {
    refresh({
      page,
      limit,
      search: debouncedSearch,
      part: partFilter || undefined,
      tag: tagFilter[0] || undefined,
    });
  }, [page, limit, debouncedSearch, partFilter, tagFilter]);

  // ===== Handlers =====
  const handleCreateNew = () => navigate("/ctv/questions/create");
  const handleEdit = (groupId: string) => navigate(`/ctv/questions/${groupId}/edit`);

  const handleDeleteClick = (groupId: string) => {
    pendingGroupId.current = groupId;
    setOpenConfirm(true);
  };

  const handleConfirmDelete = async () => {
    const groupId = pendingGroupId.current;
    if (!groupId) return;

    try {
      await groupService.delete(groupId);
      toast.success("Xóa nhóm câu hỏi thành công!");
      setOpenConfirm(false);
      refresh();
    } catch (err) {
      console.error(err);
      toast.error("Lỗi khi xóa nhóm câu hỏi!");
    }
  };

  const handleViewGroup = () => {
    if (pendingGroupId.current) {
      setOpenConfirm(false);
      setOpenGroup(pendingGroupId.current);
    }
  };

  // ===== Render =====
  return (
    <Box
      sx={{
        p: 3,
        bgcolor: theme.palette.background.default,
        height: "100%",
      }}
    >
      {/* ===== Header ===== */}
      <Typography variant="h5" sx={{ fontWeight: "bold", mb: 3 }}>
        Ngân hàng câu hỏi
      </Typography>

      {/* ===== Bộ lọc + Tìm kiếm ===== */}
      <ToolbarSection
        search={search}
        setSearch={setSearch}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        partFilter={partFilter}
        setPartFilter={setPartFilter}
        tagFilter={tagFilter}
        setTagFilter={setTagFilter}
        onAdd={handleCreateNew}
      />

      {/* ===== Bảng câu hỏi ===== */}
      {isLoading ? (
        <Box className="flex justify-center py-10">
          <CircularProgress />
        </Box>
      ) : (
        <QuestionTable
          questions={questions}
          page={page}
          setPage={setPage}
          limit={limit}
          setLimit={setLimit} // ✅ thêm prop này để TablePagination điều chỉnh
          total={total}
          onEdit={handleEdit}
          onDelete={handleDeleteClick}
          onViewGroup={setOpenGroup}
        />
      )}

      {/* ===== Modal xem chi tiết nhóm ===== */}
      {openGroup && (
        <GroupDetailModal
          open={Boolean(openGroup)}
          groupId={openGroup}
          onClose={() => setOpenGroup(null)}
          onDeleted={() => refresh()}
        />
      )}

      {/* ===== Hộp thoại xác nhận xóa ===== */}
      <AnimatePresence>
        {openConfirm && (
          <DeleteConfirmDialog
            open={openConfirm}
            onClose={() => setOpenConfirm(false)}
            onConfirm={handleConfirmDelete}
            onView={handleViewGroup}
          />
        )}
      </AnimatePresence>
    </Box>
  );
};

export default QuestionPage;
