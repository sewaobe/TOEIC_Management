import { useEffect, useState } from "react"
import { toast } from "sonner"

interface UseFetchOneOptions<T, P = void> {
  fetchFn: (params?: P) => Promise<T>
  createFn?: (item: Partial<T>) => Promise<T>
  updateFn?: (id: string, item: Partial<T>) => Promise<T>
  deleteFn?: (id: string) => Promise<void>
}

export function useFetchOne<T extends { id?: string }, P = void>({
  fetchFn,
  createFn,
  updateFn,
  deleteFn,
}: UseFetchOneOptions<T, P>) {
  const [data, setData] = useState<T | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isError, setIsError] = useState<string | null>(null)

  // fetch detail
  const refresh = async (params?: P) => {
    try {
      setIsLoading(true)
      const result = await fetchFn(params)
      setData(result)
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
  const createItem = async (item: Partial<T>, params?: P) => {
    if (!createFn) throw new Error("createFn chưa được định nghĩa")
    return toast.promise(
      createFn(item).then(async (newItem) => {
        setData(newItem) // cập nhật detail
        await refresh(params)
        return newItem
      }),
      {
        loading: "Đang tạo...",
        success: "Tạo thành công 🎉",
        error: "Tạo thất bại ❌",
      }
    )
  }

  // update
  const updateItem = async (id: string, item: Partial<T>, params?: P) => {
    if (!updateFn) throw new Error("updateFn chưa được định nghĩa")
    return toast.promise(
      updateFn(id, item).then(async (updated) => {
        setData(updated) // cập nhật detail
        await refresh(params)
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
  const deleteItem = async (id: string, params?: P) => {
    if (!deleteFn) throw new Error("deleteFn chưa được định nghĩa")
    return toast.promise(
      deleteFn(id).then(async () => {
        setData(null)
        await refresh(params)
      }),
      {
        loading: "Đang xóa...",
        success: "Xóa thành công 🗑️",
        error: "Xóa thất bại ❌",
      }
    )
  }

  return { data, isLoading, isError, refresh, createItem, updateItem, deleteItem }
}
