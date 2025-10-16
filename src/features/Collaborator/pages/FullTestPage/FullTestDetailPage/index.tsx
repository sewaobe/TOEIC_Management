import { useEffect, useState } from "react";
import { Box, CircularProgress, Typography } from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { FullTest } from "../../../../../types/fullTest";
import fullTestService from "../../../../../services/fullTest.service";
import HeaderSection from "./HeaderSection";
import InfoSection from "./InfoSection";
import GroupsSection from "./GroupsSection";
import DeleteConfirmDialog from "./DeleteConfirmDialog";

export default function FullTestDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [test, setTest] = useState<FullTest | null>(null);
  const [openDelete, setOpenDelete] = useState(false);

  // 🔄 Fetch dữ liệu đề thi
  useEffect(() => {
    const fetchTest = async () => {
      try {
        setLoading(true);
        const res = await fullTestService.getById(`${id}?full=true`);
        console.log(res)
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

  return (
    <Box className="p-4 md:p-8 max-w-7xl mx-auto">
      <HeaderSection test={test} onDelete={() => setOpenDelete(true)} />
      <InfoSection test={test} />
      <GroupsSection groups={test.groups || []} />
      <DeleteConfirmDialog
        open={openDelete}
        onClose={() => setOpenDelete(false)}
        testTitle={test.title}
        onConfirm={() => {
          toast.success("Đề thi đã được xóa!");
          navigate(-1);
        }}
      />
    </Box>
  );
}
