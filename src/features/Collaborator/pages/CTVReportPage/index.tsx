import { Alert, Box, Typography } from "@mui/material";
import CTVReportFilter from "./components/CTVReportFilter";
import CTVReportTable from "./components/CTVReportTable";
import CTVReportDetailDrawer from "./components/CTVReportDetailDrawer";
import { useCTVReportViewModel } from "./viewmodel/useCTVReportViewModel";

export default function CTVReportPage() {
  const vm = useCTVReportViewModel();

  return (
    <Box sx={{ p: 3, display: "flex", flexDirection: "column", gap: 2 }}>
      <Typography variant="h4" fontWeight={800}>
        🛠️ Quản lý báo lỗi
      </Typography>

      <CTVReportFilter
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

      <CTVReportTable
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

      <CTVReportDetailDrawer
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
