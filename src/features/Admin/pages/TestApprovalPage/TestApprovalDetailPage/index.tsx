import { useState, useEffect } from "react";
import { Box, CircularProgress, Typography } from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { FullTest } from "../../../../../types/fullTest";
import adminTestService from "../services/adminTest.service";
import miniTestService from "../../../../Collaborator/pages/MinitestPage/services/miniTest.service";
import HeaderSection from "./components/HeaderSection";
import InfoSection from "../../../../Collaborator/pages/FullTestPage/FullTestDetailPage/InfoSection"; // lấy lại từ CTV
import GroupsSection from "../../../../Collaborator/pages/FullTestPage/FullTestDetailPage/GroupsSection"; // lấy lại từ CTV
import DeleteConfirmDialog from "../../../../Collaborator/pages/FullTestPage/FullTestDetailPage/DeleteConfirmDialog"; // dùng lại
import ReasonDialog from "./components/ReasonDialog";

export default function TestApprovalDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [test, setTest] = useState<FullTest | null>(null);
  const [openDelete, setOpenDelete] = useState(false);
  const [openReject, setOpenReject] = useState(false);

  // 🔄 Lấy chi tiết đề thi
  useEffect(() => {
    const fetchTest = async () => {
      try {
        setLoading(true);
        // Với quyền admin, gọi API admin để lấy dữ liệu đầy đủ
        const res = await adminTestService.getDetail(String(id));
        if (!res) {
          toast.error("Không tải được đề thi");
          return;
        }

        // Nếu backend trả về đối tượng test có type = 'mini-test' hoặc không có groups,
        // gọi API mini-test tương ứng để lấy đầy đủ groups (mini test dùng model/endpoint khác).
        const maybeType = (res as any).type || (res as any).testType || (res as any).t?.type;
        if (maybeType === "mini-test" || !((res as any).groups && (res as any).groups.length)) {
          try {
            const mini = await miniTestService.getById(`${id}?full=true`);
            // miniTestService trả về { data: {...} } hoặc data trực tiếp tùy implement
            const payload = (mini as any).data?.data ?? (mini as any).data ?? mini;
            setTest(payload);
          } catch {
            // fallback: dùng res nếu mini fetch thất bại
            setTest(res.data || res);
          }
        } else {
          setTest(res.data || res);
        }
      } catch {
        toast.error("Lỗi khi tải dữ liệu đề thi");
      } finally {
        setLoading(false);
      }
    };
    fetchTest();
  }, [id]);

  // 🕓 Loading
  if (loading)
    return (
      <Box className="flex flex-col items-center justify-center h-[80vh] gap-4">
        <CircularProgress />
        <Typography color="text.secondary">Đang tải dữ liệu...</Typography>
      </Box>
    );

  if (!test)
    return (
      <Typography align="center" color="text.secondary" mt={4}>
        Không tìm thấy đề thi
      </Typography>
    );

  // 🧠 Xử lý hành động
  const handleApprove = () => {
    (async () => {
      try {
        await adminTestService.approve(String(id));
        toast.success("✅ Đề thi đã được duyệt!");
        setTest((t) => (t ? { ...t, status: "approved" } : t));
        // Quay về danh sách sau khi duyệt xong
        navigate(-1);
      } catch (err) {
        toast.error("Duyệt đề thi thất bại");
      }
    })();
  };

  const handleReject = (reason: string) => {
    (async () => {
      try {
        await adminTestService.reject(String(id), reason);
        toast.error(`❌ Đã từ chối: ${reason}`);
        setTest((t) => (t ? { ...t, status: "closed" } : t));
        setOpenReject(false);
        // Quay về danh sách sau khi từ chối
        navigate(-1);
      } catch (err) {
        toast.error("Từ chối đề thi thất bại");
      }
    })();
  };

  const handleDelete = () => {
    (async () => {
      try {
        await adminTestService.softDelete(String(id));
        toast.error("🗑️ Đề thi đã bị xóa (soft)!");
        navigate(-1);
      } catch (err) {
        toast.error("Xóa đề thi thất bại");
      }
    })();
  };

  return (
    <Box className="p-4 md:p-8 max-w-7xl mx-auto">
      <HeaderSection
        test={test}
        onApprove={handleApprove}
        onReject={() => setOpenReject(true)}
        onDelete={() => setOpenDelete(true)}
      />
      <InfoSection test={test} />
      <GroupsSection groups={test.groups || []} />

      {/* Modal */}
      <ReasonDialog
        open={openReject}
        onClose={() => setOpenReject(false)}
        onSubmit={handleReject}
      />
      <DeleteConfirmDialog
        open={openDelete}
        onClose={() => setOpenDelete(false)}
        testTitle={test.title}
        onConfirm={handleDelete}
      />
    </Box>
  );
}
