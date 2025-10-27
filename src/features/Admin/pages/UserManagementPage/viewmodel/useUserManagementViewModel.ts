import { useState } from "react";
import { User } from "../types";

export const statusColor = {
  active: "success",
  inactive: "default",
  suspended: "warning",
} as const;

export function useUserManagementViewModel(allUsers: User[]) {
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const filtered = allUsers.filter(
    (u) =>
      (u.name.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase())) &&
      (role ? u.role_id.name === role : true) &&
      (status ? u.status === status : true)
  );

  const paginated = filtered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return {
    search,
    role,
    status,
    page,
    rowsPerPage,
    setSearch,
    setRole,
    setStatus,
    setPage,
    setRowsPerPage,
    filtered,
    paginated,
  };
}
