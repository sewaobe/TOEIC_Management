import React from 'react';
import { Box, Pagination } from '@mui/material';

interface PaginationContainerProps<T> {
  items: T[];
  pageCount: number;
  page: number; // trang hiện tại từ ngoài
  onPageChange?: (page: number) => void; // callback khi user đổi page
  renderItem: (item: T, index: number) => React.ReactNode;
}

function PaginationContainer<T>({
  items,
  pageCount,
  page,
  onPageChange,
  renderItem,
}: PaginationContainerProps<T>) {
  return (
    <Box className='w-full'>
      <Box className='flex flex-wrap gap-4'>
        {items.map((item, index) => renderItem(item, index))}
      </Box>

      {pageCount > 1 && (
        <Box className='mt-6 flex justify-center'>
          <Pagination
            count={pageCount}
            page={page}
            onChange={(_, p) => onPageChange?.(p)} // gọi callback bên ngoài
            color='primary'
            shape='rounded'
            siblingCount={0}
          />
        </Box>
      )}
    </Box>
  );
}

export default PaginationContainer;