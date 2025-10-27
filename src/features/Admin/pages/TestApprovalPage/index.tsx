import { Box, Typography } from "@mui/material";
import { useState } from "react";
import { mockTests } from "./mock/mockTests";
import { useTestApprovalViewModel } from "./viewmodel/useTestApprovalViewModel";
import FilterToolbar from "./components/FilterToolbar";
import TestTable from "./components/TestTable";

export default function TestApprovalPage() {
  const vm = useTestApprovalViewModel(mockTests);
  const [showPending, setShowPending] = useState(true);

  const creatorOptions = Array.from(new Set(mockTests.map((t) => t.creator)));
  const topicOptions = Array.from(new Set(mockTests.map((t) => t.topic)));
  const pendingList = mockTests.filter((t) => t.status === "pending");

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
          items={pendingList}
          page={vm.page}
          rowsPerPage={vm.rowsPerPage}
          setPage={vm.setPage}
          setRowsPerPage={vm.setRowsPerPage}
        />
      )}

      <TestTable
        title="Tất cả đề thi"
        items={vm.filtered}
        page={vm.page}
        rowsPerPage={vm.rowsPerPage}
        setPage={vm.setPage}
        setRowsPerPage={vm.setRowsPerPage}
      />
    </Box>
  );
}
