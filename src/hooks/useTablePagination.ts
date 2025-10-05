import { useState } from "react"

export interface UseTablePaginationOptions {
  initialPage?: number
  initialRowsPerPage?: number
}

export function useTablePagination({ initialPage = 0, initialRowsPerPage = 5 }: UseTablePaginationOptions = {}) {
  const [page, setPage] = useState(initialPage)
  const [rowsPerPage, setRowsPerPage] = useState(initialRowsPerPage)

  const handleChangePage = (_: unknown, newPage: number) => setPage(newPage)
  const handleChangeRowsPerPage = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(e.target.value, 10))
    setPage(0)
  }

  return {
    page,
    rowsPerPage,
    setPage,
    setRowsPerPage,
    handleChangePage,
    handleChangeRowsPerPage,
  }
}
