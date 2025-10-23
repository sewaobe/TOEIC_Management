import { useEffect, useMemo, useState } from "react"
import { Topic } from "../../../../types/Topic"
import TopicHeader from "./TopicHeader"
import TopicFilters from "./TopicFilter"
import TopicList from "./TopicList"
import TopicModal from "./TopicModal"

import { useNavigate } from "react-router-dom"
import { availableIcons } from "../../../../utils/colorMapFromBg"
import { topicService } from "../../../../services/topic.service"
import { useFetchList } from "../../../../hooks/useFetchList"
import { EmptyState } from "../../../../components/EmptyState"

// Gradient options 
export const gradientOptions = [
    { name: "Blue", value: "from-blue-500 to-cyan-500" },
    { name: "Purple", value: "from-purple-500 to-pink-500" },
    { name: "Orange", value: "from-amber-500 to-orange-500" },
    { name: "Red", value: "from-rose-500 to-red-500" },
    { name: "Indigo", value: "from-indigo-500 to-purple-500" },
    { name: "Teal", value: "from-teal-500 to-emerald-500" },
    { name: "Green", value: "from-green-500 to-teal-500" },
    { name: "Pink", value: "from-pink-500 to-rose-500" },
    { name: "Cyan", value: "from-cyan-500 to-sky-500" },
    { name: "Violet", value: "from-violet-500 to-fuchsia-500" },
    { name: "Emerald", value: "from-emerald-500 to-green-500" },
    { name: "OrangeDeep", value: "from-orange-500 to-red-500" },
]
export const getDefaultFormData = (): Topic => ({
    id: "0",
    title: "",
    description: "",
    level: "A1",
    wordCount: 0,
    learnerCount: 0,
    iconName: "Book",
    gradient: gradientOptions[0].value,
    bgColor: "bg-blue-50",
    new: false,
    createdAt: Date.now().toString(),
    updatedAt: "",
})

export default function TopicPage() {
    const itemsPerPage = 6;
    const [page, setPage] = useState(1);

    const {
        items: topics,
        isLoading,
        isError,
        addItem,
        updateItem,
        deleteItem,
        pageCount,
        refresh
    } = useFetchList<Topic>({
        fetchFn: (params) => topicService.getAllTopics(params?.page || 1, params?.limit || itemsPerPage),
        createFn: topicService.createTopic,
        updateFn: topicService.updateTopic,
        deleteFn: topicService.deleteTopic,
    })

    useEffect(() => {
        refresh({ page, limit: itemsPerPage });
    }, [page]);

    const [search, setSearch] = useState("")
    const [filter, setFilter] = useState("all")

    const filteredTopics = useMemo(() => {
        return topics.filter((t) => {
            const matchesSearch =
                t.title.toLowerCase().includes(search.toLowerCase()) ||
                t.description.toLowerCase().includes(search.toLowerCase())
            const matchesFilter =
                filter === "all"
                    ? true
                    : filter === "new"
                        ? t.new
                        : filter === "short"
                            ? t.wordCount < 30
                            : true
            return matchesSearch && matchesFilter
        })
    }, [topics, search, filter])


    const [isModalOpen, setIsModalOpen] = useState(false)
    const [modalMode, setModalMode] = useState<"add" | "edit">("add")
    const [formData, setFormData] = useState<Topic>(getDefaultFormData())
    const [editingTopic, setEditingTopic] = useState<Topic | null>(null)

    const handleAddTopic = () => {
        setFormData(getDefaultFormData())
        setModalMode("add")
        setIsModalOpen(true)
    }

    const handleEdit = (id: string) => {
        const topic = topics.find((t) => t.id === id)
        if (!topic) return
        setFormData(topic)
        setEditingTopic(topic)
        setModalMode("edit")
        setIsModalOpen(true)
    }

    const handleSave = async () => {
        try {
            if (modalMode === "add") {
                const newTopic: Partial<Topic> = {
                    ...formData,
                    id: undefined, // BE sẽ generate id
                    learnerCount: 0,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                }
                await addItem(newTopic)
            } else if (modalMode === "edit" && editingTopic) {
                await updateItem(editingTopic.id, formData)
            }

            setIsModalOpen(false)
            setEditingTopic(null)
            setFormData(getDefaultFormData()) // ✅ Reset lại sau khi save
        } catch (err) {
            console.error("❌ Lỗi khi lưu chủ đề:", err)
            alert("Có lỗi xảy ra khi lưu chủ đề")
        }
    }

    const handleDelete = async (id: string) => {
        if (!window.confirm("Bạn có chắc muốn xóa chủ đề này?")) return
        try {
            await deleteItem(id)
        } catch (err) {
            console.error("❌ Lỗi khi xóa:", err)
            alert("Không thể xóa chủ đề, vui lòng thử lại.")
        }
    }

    const navigate = useNavigate();
    const handleView = (topicId: string) => {
        navigate(`${topicId}`)
    }


    if (isLoading) return <EmptyState mode="loading" />

    if (isError) return (
        <EmptyState
            mode="error"
            title="Không thể tải chủ đề"
            description="Vui lòng thử lại sau hoặc liên hệ quản trị viên."
        />
    )

    return (
        <div className="min-h-screen max-w-7xl mx-auto py-8">
            <TopicHeader onAdd={handleAddTopic} />
            <TopicFilters search={search} setSearch={setSearch} filter={filter} setFilter={setFilter} />
            {topics.length === 0 ? (
                <EmptyState
                    mode="empty"
                    title="Chưa có chủ đề nào"
                    description="Hãy thêm chủ đề mới để bắt đầu."
                />
            ) : (
                <TopicList
                    topics={filteredTopics}
                    page={page}
                    pageCount={pageCount}
                    onPageChange={setPage}
                    onView={(id: string) => handleView(id)}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                />
            )}

            <TopicModal
                open={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSave}
                formData={formData}
                setFormData={setFormData}
                availableIcons={availableIcons}
                gradientOptions={gradientOptions}
                title={modalMode === "add" ? "Thêm chủ đề mới" : "Chỉnh sửa chủ đề"}
            />
        </div>
    )
}
