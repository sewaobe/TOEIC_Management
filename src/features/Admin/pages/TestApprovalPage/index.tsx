import { Box, Typography } from "@mui/material";
import { useState, useEffect } from "react";
import { useTestApprovalViewModel } from "./viewmodel/useTestApprovalViewModel";
import FilterToolbar from "./components/FilterToolbar";
import TestTable from "./components/TestTable";
import adminTestService from "./services/adminTest.service";

export default function TestApprovalPage() {
  const vm = useTestApprovalViewModel();
  const [showPending, setShowPending] = useState(true);

  // Pending-specific paging & data (server-backed) so filters are accurate
  const [pendingItems, setPendingItems] = useState<any[]>([]);
  const [pendingTotal, setPendingTotal] = useState(0);
  const [pendingPage, setPendingPage] = useState(0);
  const [pendingRowsPerPage, setPendingRowsPerPage] = useState(10);

  const creatorOptions = vm.creatorOptions;
  const topicOptions = vm.topicOptions;

  const fetchPending = async () => {
    try {
      const res = await adminTestService.list({
        page: pendingPage + 1,
        limit: pendingRowsPerPage,
        search: vm.search || undefined,
        status: "pending",
        topic: vm.topic || undefined,
        type: vm.type || undefined,
      });

      if (res) {
        setPendingItems(res.items || []);
        setPendingTotal(res.total || 0);
      }
    } catch (err) {
      setPendingItems([]);
      setPendingTotal(0);
    }
  };

  useEffect(() => {
    if (showPending) fetchPending();
    // refresh when filters or pending paging changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    showPending,
    vm.search,
    vm.type,
    vm.topic,
    vm.status,
    pendingPage,
    pendingRowsPerPage,
  ]);

  // Nếu user thay đổi filter ở master view, reset trang pending về 0
  useEffect(() => {
    setPendingPage(0);
  }, [vm.search, vm.type, vm.topic, vm.status]);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" fontWeight={800} mb={3}>
        📋 Duyệt đề thi
      </Typography>

      <FilterToolbar
        {...vm}
        showPending={showPending}
        setShowPending={setShowPending}
        creatorOptions={creatorOptions}
        topicOptions={topicOptions}
      />

      {!vm.status && showPending && (
        <TestTable
          title="Cần duyệt"
          items={pendingItems}
          page={pendingPage}
          rowsPerPage={pendingRowsPerPage}
          setPage={setPendingPage}
          setRowsPerPage={(r) => {
            setPendingRowsPerPage(r);
            setPendingPage(0);
          }}
          count={pendingTotal}
        />
      )}

      <TestTable
        title="Tất cả đề thi"
        items={vm.items}
        page={vm.page}
        rowsPerPage={vm.rowsPerPage}
        setPage={vm.setPage}
        setRowsPerPage={vm.setRowsPerPage}
        count={vm.total}
      />
    </Box>
  );
}
