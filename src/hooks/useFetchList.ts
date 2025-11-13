import { toast } from "sonner";
import { useCallback, useEffect, useState } from "react";

interface UseFetchListOptions<T, P = { page?: number; limit?: number }> {
  fetchFn: (params?: P) => Promise<{
    items: T[];
    pageCount: number;
    total: number;
  }>;
  createFn?: (item: Partial<T>) => Promise<T>;
  updateFn?: (id: string, item: Partial<T>) => Promise<T>;
  deleteFn?: (id: string) => Promise<void>;
  autoFetch?: boolean; // ✅ thêm option để control auto fetch
}

export function useFetchList<
  T extends { id: string },
  P = { page?: number; limit?: number }
>({
  fetchFn,
  createFn,
  updateFn,
  deleteFn,
  autoFetch = true,
}: UseFetchListOptions<T, P>) {
  const [items, setItems] = useState<T[]>([]);
  const [pageCount, setPageCount] = useState(1);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState<string | null>(null);

  // fetch list
  const refresh = useCallback(
    async (params?: P) => {
      try {
        setIsLoading(true);
        const data = await fetchFn(params);
        setItems(data.items);
        setPageCount(data.pageCount);
        setTotal(data.total);
        setIsError(null);
      } catch (err: any) {
        setIsError(err.message || "Có lỗi xảy ra");
      } finally {
        setIsLoading(false);
      }
    },
    [fetchFn]
  ); // ✅ memo hóa refresh để tránh tạo mới mỗi lần render

  useEffect(() => {
    if (autoFetch) {
      refresh();
    }
  }, []);

  // create
  const addItem = async (item: Partial<T>, params?: P) => {
    if (!createFn) throw new Error("createFn chưa được định nghĩa");
    return toast.promise(
      createFn(item).then(async (newItem) => {
        await refresh(params); // lấy lại list mới nhất
        return newItem;
      }),
      {
        loading: "Đang thêm...",
        success: "Thêm thành công 🎉",
        error: "Thêm thất bại ❌",
      }
    );
  };

  // update
  const updateItem = async (id: string, item: Partial<T>, params?: P) => {
    if (!updateFn) throw new Error("updateFn chưa được định nghĩa");
    return toast.promise(
      updateFn(id, item).then(async (updated) => {
        await refresh(params); // sync lại list
        return updated;
      }),
      {
        loading: "Đang cập nhật...",
        success: "Cập nhật thành công ✅",
        error: "Cập nhật thất bại ❌",
      }
    );
  };

  // delete
  const deleteItem = async (id: string, params?: P) => {
    if (!deleteFn) throw new Error("deleteFn chưa được định nghĩa");
    return toast.promise(
      deleteFn(id).then(async () => {
        await refresh(params);
      }),
      {
        loading: "Đang xóa...",
        success: "Xóa thành công 🗑️",
        error: "Xóa thất bại ❌",
      }
    );
  };

  return {
    items,
    pageCount,
    total,
    isLoading,
    isError,
    addItem,
    updateItem,
    deleteItem,
    refresh,
  };
}
