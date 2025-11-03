import { useEffect, useState, useCallback } from "react";
import { User } from "../types";
import adminUserService from "../services/adminUser.service";

export const statusColor = {
  active: "success",
  inactive: "default",
  banned: "warning",
  banned_permanent: "error",
} as const;

// ViewModel dùng server-side list API. Trả về list, total và các state + handlers.
export function useUserManagementViewModel() {
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(0); // zero-based for TablePagination
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [users, setUsers] = useState<User[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        q: search || undefined,
        role: role || undefined,
        status: status || undefined,
        page: page + 1, // API is 1-based
        limit: rowsPerPage,
      };

      const res: any = await adminUserService.listUsers(params);
      // res is { data: [...], total, page, limit }
      setUsers(res.data || []);
      setTotal(res.total || 0);
    } catch (err) {
      console.error("Lỗi khi lấy danh sách người dùng", err);
    } finally {
      setLoading(false);
    }
  }, [search, role, status, page, rowsPerPage]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const refresh = () => fetchUsers();

  return {
    // filters
    search,
    role,
    status,
    setSearch,
    setRole,
    setStatus,

    // pagination
    page,
    rowsPerPage,
    setPage,
    setRowsPerPage,

    // data
    users,
    total,
    loading,

    // actions
    refresh,
  };
}
