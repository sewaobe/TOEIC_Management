import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import ctvReportService from "../services/ctvReport.service";
import {
  CTVReportItem,
  CTVReportStatus,
  CTVReportType,
  CTVUpdateReportPayload,
} from "../types";

export function useCTVReportViewModel() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<CTVReportStatus | "all">("all");
  const [type, setType] = useState<CTVReportType | "all">("all");
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([
    null,
    null,
  ]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [items, setItems] = useState<CTVReportItem[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [selected, setSelected] = useState<CTVReportItem | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const fetchReports = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const [from, to] = dateRange;
      const response = await ctvReportService.list({
        page: page + 1,
        limit: rowsPerPage,
        search: search || undefined,
        status,
        type,
        from: from ? from.toISOString() : undefined,
        to: to ? to.toISOString() : undefined,
      });

      setItems(response.items);
      setTotal(response.pagination.total);
    } catch (err: any) {
      setItems([]);
      setTotal(0);
      const message =
        err?.response?.data?.message || err?.message || "Không thể tải dữ liệu";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, [dateRange, page, rowsPerPage, search, status, type]);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  useEffect(() => {
    setPage(0);
  }, [search, status, type, dateRange]);

  const handleSelect = useCallback(async (report: CTVReportItem) => {
    setDrawerOpen(true);
    setDetailLoading(true);
    try {
      const detail = await ctvReportService.getDetail(report.id);
      setSelected(detail);
    } catch (err: any) {
      setSelected(report);
      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Không thể tải chi tiết báo lỗi";
      toast.error(message);
    } finally {
      setDetailLoading(false);
    }
  }, []);

  const handleCloseDrawer = useCallback(() => {
    setDrawerOpen(false);
    setSelected(null);
  }, []);

  const handleUpdate = useCallback(
    async (payload: CTVUpdateReportPayload) => {
      if (!selected) return;
      try {
        setUpdating(true);
        const updated = await ctvReportService.update(selected.id, payload);
        setSelected(updated);
        setItems((prev) =>
          prev.map((item) => (item.id === updated.id ? updated : item))
        );
        toast.success("Cập nhật báo lỗi thành công");
        fetchReports();
      } catch (err: any) {
        const message =
          err?.response?.data?.message ||
          err?.message ||
          "Cập nhật báo lỗi thất bại";
        toast.error(message);
      } finally {
        setUpdating(false);
      }
    },
    [fetchReports, selected]
  );

  const pagination = useMemo(
    () => ({ page, rowsPerPage, total }),
    [page, rowsPerPage, total]
  );

  return {
    search,
    setSearch,
    status,
    setStatus,
    type,
    setType,
    dateRange,
    setDateRange,
    page,
    setPage,
    rowsPerPage,
    setRowsPerPage,
    items,
    loading,
    error,
    pagination,
    drawerOpen,
    selected,
    detailLoading,
    updating,
    refresh: fetchReports,
    handleSelect,
    handleCloseDrawer,
    handleUpdate,
  } as const;
}
