import { useState, useEffect } from "react";
import { Box, CircularProgress, Typography } from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { FullTest } from "../../../../../types/fullTest";
import fullTestService from "../../../../../services/fullTest.service";
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
        const res = await fullTestService.getById(`${id}?full=true`);
        if (res.success) setTest(res.data);
        else toast.error(res.message || "Không tải được đề thi");
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
    toast.success("✅ Đề thi đã được duyệt!");
    setTest({ ...test, status: "approved" });
  };

  const handleReject = (reason: string) => {
    toast.error(`❌ Đã từ chối: ${reason}`);
    setTest({ ...test, status: "rejected" });
    setOpenReject(false);
  };

  const handleDelete = () => {
    toast.error("🗑️ Đề thi đã bị xóa!");
    navigate(-1);
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
