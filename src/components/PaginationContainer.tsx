import React from "react";
import { Box, Pagination } from "@mui/material";

interface PaginationContainerProps<T> {
  items: T[];
  pageCount: number;
  page: number;
  onPageChange?: (page: number) => void;
  renderItem: (item: T, index: number) => React.ReactNode;
  showTop?: boolean;
  viewMode?: "grid" | "list"; 
}

function PaginationContainer<T>({
  items,
  pageCount,
  page,
  onPageChange,
  renderItem,
  showTop = false,
  viewMode = "grid", // default list
}: PaginationContainerProps<T>) {
  return (
    <Box className="w-full space-y-6">
      {/* Pagination ở trên */}
      {showTop && pageCount > 1 && (
        <Box className="flex justify-center">
          <Pagination
            count={pageCount}
            page={page}
            onChange={(_, p) => onPageChange?.(p)}
            color="primary"
            shape="rounded"
            siblingCount={1}
            size="small"
            variant="outlined"
          />
        </Box>
      )}

      {/* Nội dung grid hoặc list */}
      <Box
        className={
          viewMode === "grid"
            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            : "grid grid-cols-1 gap-4"
        }
      >
        {items.map((item, index) => renderItem(item, index))}
      </Box>

      {/* Pagination ở dưới */}
      {pageCount > 1 && (
        <Box className="flex justify-center border-t pt-4">
          <Pagination
            count={pageCount}
            page={page}
            onChange={(_, p) => onPageChange?.(p)}
            color="primary"
            shape="rounded"
            siblingCount={1}
            size="medium"
          />
        </Box>
      )}
    </Box>
  );
}

export default PaginationContainer;
