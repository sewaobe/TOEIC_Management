import { Alert, Box, Typography } from "@mui/material";
import ReportFilter from "./components/ReportFilter";
import ReportTable from "./components/ReportTable";
import ReportDetailDrawer from "./components/ReportDetailDrawer";
import { useAdminReportViewModel } from "./viewmodel/useAdminReportViewModel";

export default function AdminReportPage() {
  const vm = useAdminReportViewModel();

  return (
    <Box sx={{ p: 3, display: "flex", flexDirection: "column", gap: 2 }}>
      <Typography variant="h4" fontWeight={800}>
        🛠️ Quản lý báo lỗi
      </Typography>

      <ReportFilter
        search={vm.search}
        onSearchChange={(value) => vm.setSearch(value)}
        status={vm.status}
        onStatusChange={(value) => vm.setStatus(value)}
        type={vm.type}
        onTypeChange={(value) => vm.setType(value)}
        dateRange={vm.dateRange}
        onDateRangeChange={(value) => vm.setDateRange(value)}
        loading={vm.loading}
        onRefresh={vm.refresh}
      />

      {vm.error && <Alert severity="error">{vm.error}</Alert>}

      <ReportTable
        items={vm.items}
        page={vm.page}
        rowsPerPage={vm.rowsPerPage}
        total={vm.pagination.total}
        loading={vm.loading}
        onPageChange={(value) => vm.setPage(value)}
        onRowsPerPageChange={(rows) => {
          vm.setRowsPerPage(rows);
          vm.setPage(0);
        }}
        onSelect={vm.handleSelect}
      />

      <ReportDetailDrawer
        open={vm.drawerOpen}
        report={vm.selected}
        loading={vm.detailLoading}
        updating={vm.updating}
        onClose={vm.handleCloseDrawer}
        onSubmit={vm.handleUpdate}
      />
    </Box>
  );
}
