import { toast } from "sonner"
import { useEffect, useState } from "react"

interface UseFetchListOptions<T> {
    fetchFn: (params?: { page?: number; limit?: number }) => Promise<{
        items: T[];
        pageCount: number;
        total: number;
    }>;
    createFn?: (item: Partial<T>) => Promise<T>
    updateFn?: (id: string, item: Partial<T>) => Promise<T>
    deleteFn?: (id: string) => Promise<void>
}

export function useFetchList<T extends { id: string }>(
    { fetchFn, createFn, updateFn, deleteFn }: UseFetchListOptions<T>
) {
    const [items, setItems] = useState<T[]>([])
    const [pageCount, setPageCount] = useState(1);
    const [total, setTotal] = useState(0);
    const [isLoading, setIsLoading] = useState(true)
    const [isError, setIsError] = useState<string | null>(null)

    // fetch list
    const refresh = async (params?: { page?: number; limit?: number }) => {
        try {
            setIsLoading(true)
            const data = await fetchFn(params)
            setItems(data.items)
            setPageCount(data.pageCount)
            setTotal(data.total)
            setIsError(null)
        } catch (err: any) {
            setIsError(err.message || "Có lỗi xảy ra")
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        refresh()
    }, [])

    // create
    const addItem = async (item: Partial<T>, params?: { page?: number; limit?: number }) => {
        if (!createFn) throw new Error("createFn chưa được định nghĩa")
        return toast.promise(
            createFn(item).then(async (newItem) => {
                await refresh(params)   // lấy lại list mới nhất
                return newItem
            }),
            {
                loading: "Đang thêm...",
                success: "Thêm thành công 🎉",
                error: "Thêm thất bại ❌",
            }
        )
    }

    // update
    const updateItem = async (id: string, item: Partial<T>, params?: { page?: number; limit?: number }) => {
        if (!updateFn) throw new Error("updateFn chưa được định nghĩa")
        return toast.promise(
            updateFn(id, item).then(async (updated) => {
                await refresh(params)   // sync lại list
                return updated
            }),
            {
                loading: "Đang cập nhật...",
                success: "Cập nhật thành công ✅",
                error: "Cập nhật thất bại ❌",
            }
        )
    }

    // delete
    const deleteItem = async (id: string, params?: { page?: number; limit?: number }) => {
        if (!deleteFn) throw new Error("deleteFn chưa được định nghĩa")
        return toast.promise(
            deleteFn(id).then(async () => {
                await refresh(params)
            }),
            {
                loading: "Đang xóa...",
                success: "Xóa thành công 🗑️",
                error: "Xóa thất bại ❌",
            }
        )
    }

    return { items, pageCount, total, isLoading, isError, addItem, updateItem, deleteItem, refresh }
}
