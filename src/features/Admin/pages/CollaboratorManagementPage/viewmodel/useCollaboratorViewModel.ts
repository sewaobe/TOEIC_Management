import { useEffect, useState } from "react";
import { toast } from "sonner";
import { requestCollaboratorService } from "../../../../../services/request_collaborator.service";
import { CollaboratorRequest } from "../types";
import { tr } from "date-fns/locale";

export const useCollaboratorViewModel = () => {
  const [collaborators, setCollaborators] = useState<CollaboratorRequest[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [pageCount, setPageCount] = useState(0);
  const [selectedUser, setSelectedUser] = useState<CollaboratorRequest | null>(null);
  const [loading, setLoading] = useState(false);
  const [openDrawer, setOpenDrawer] = useState(false);

  // 🔹 Hàm gọi API theo trang
  const fetchCollaborators = async (pageNum = page, pageLimit = limit) => {
    try {
      setLoading(true);
      const res = await requestCollaboratorService.getAllRequest(pageNum, pageLimit);
      setCollaborators(res.items || []);
      setTotal(res.total || 0);
      setPage(res.page || 1);
      setPageCount(res.pageCount || 1);
    } catch (err) {
      toast.error("Lấy danh sách cộng tác viên thất bại!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCollaborators();
  }, []);

  const handleChangePage = (newPage: number) => {
    setPage(newPage);
    fetchCollaborators(newPage, limit);
  };

  const handleChangeRowsPerPage = (newLimit: number) => {
    setLimit(newLimit);
    setPage(1);
    fetchCollaborators(1, newLimit);
  };

  const handleViewDetail = async (userId: string) => {
    setLoading(true);
    setOpenDrawer(true);
    setSelectedUser(collaborators.find((user) => user._id === userId) || null);
    setLoading(false);
  };

  const handleApprove = async (id: string) => {
    try {
      await toast.promise(requestCollaboratorService.updateRequestStatus(id, "approved"), {
        loading: "Đang duyệt cộng tác viên...",
        success: "✅ Duyệt cộng tác viên thành công!",
      });
    } catch (err) {
      toast.error("Duyệt cộng tác viên thất bại!");
    }
  };

  const handleReject = async (id: string, rejectionReason: string) => {
    try {
      await toast.promise(requestCollaboratorService.updateRequestStatus(id, "rejected", rejectionReason), {
        loading: "Đang từ chối cộng tác viên...",
        success: "Từ chối cộng tác viên thành công!",
      });
    } catch (err) {
      toast.error("Từ chối cộng tác viên thất bại!");
    }
  };

  const handleCloseDrawer = () => setOpenDrawer(false);

  return {
    collaborators,
    total,
    page,
    pageCount,
    limit,
    loading,
    selectedUser,
    openDrawer,
    fetchCollaborators,
    handleChangePage,
    handleChangeRowsPerPage,
    handleViewDetail,
    handleCloseDrawer,
    handleApprove,
    handleReject,
  };
};
