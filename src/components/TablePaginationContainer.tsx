import { useEffect } from "react"
import { TablePagination } from "@mui/material"

interface Props {
  count: number
  page: number
  rowsPerPage: number
  onPageChange: (event: unknown, newPage: number) => void
  onRowsPerPageChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  rowsPerPageOptions?: number[]
  labelRowsPerPage?: string
}

export default function TablePaginationContainer({
  count,
  page,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
  rowsPerPageOptions = [5, 10, 25, 50, 100],
  labelRowsPerPage = "Hiển thị",
}: Props) {
  // 🪄 Inject CSS khi component mount
  useEffect(() => {
    const style = document.createElement("style")
    style.innerHTML = `
      .MuiMenu-paper {
        border-radius: 0 !important;
      }
      .MuiTablePagination-menuItem.Mui-selected {
        background-color: #EEF2FF !important;
        color: #1E3A8A !important;
        font-weight: 600 !important;
      }
      .MuiTablePagination-menuItem:hover {
        background-color: #F3F4F6 !important;
      }
    `
    document.head.appendChild(style)
    return () => {
      document.head.removeChild(style)
    }
  }, [])

  return (
    <TablePagination
      component="div"
      count={count}
      page={page}
      rowsPerPage={rowsPerPage}
      onPageChange={onPageChange}
      onRowsPerPageChange={onRowsPerPageChange}
      rowsPerPageOptions={rowsPerPageOptions}
      labelRowsPerPage={labelRowsPerPage}
      sx={{
        "& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows": {
          color: "#4B5563",
        },
        "& .MuiTablePagination-actions button": {
          color: "#374151",
        },
        "& .MuiTablePagination-select": {
          borderRadius: 0,
        },
      }}
    />
  )
}
