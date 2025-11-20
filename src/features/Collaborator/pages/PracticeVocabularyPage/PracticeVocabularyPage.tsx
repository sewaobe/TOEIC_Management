import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PracticeTopicVocabulary } from "../../../../types/PracticeVocabulary";
import PracticeTopicHeader from "./PracticeTopicHeader";
import PracticeTopicFilters from "./PracticeTopicFilters";
import PracticeTopicList from "./PracticeTopicList";
import PracticeTopicModal from "./PracticeTopicModal";
import { practiceTopicVocabularyService } from "../../../../services/practice_vocabulary.service";
import { useFetchList } from "../../../../hooks/useFetchList";
import { EmptyState } from "../../../../components/EmptyState";

const getDefaultFormData = (): Partial<PracticeTopicVocabulary> => ({
  title: "",
  description: "",
  tags: [],
  level: "A1",
  vocabulary_words: [],
  isPublic: false,
});

export default function PracticeVocabularyPage() {
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
    refresh,
  } = useFetchList<PracticeTopicVocabulary>({
    fetchFn: (params) =>
      practiceTopicVocabularyService.getAllPracticeTopics(
        params?.page || 1,
        params?.limit || itemsPerPage
      ),
    createFn: practiceTopicVocabularyService.createPracticeTopic,
    updateFn: practiceTopicVocabularyService.updatePracticeTopic,
    deleteFn: practiceTopicVocabularyService.deletePracticeTopic,
  });

  useEffect(() => {
    refresh({ page, limit: itemsPerPage });
  }, [page]);

  const [search, setSearch] = useState("");
  const [level, setLevel] = useState("all");

  const filteredTopics = useMemo(() => {
    return topics.filter((t) => {
      const matchesSearch =
        t.title.toLowerCase().includes(search.toLowerCase()) ||
        t.description?.toLowerCase().includes(search.toLowerCase());
      const matchesLevel = level === "all" || t.level === level;
      return matchesSearch && matchesLevel;
    });
  }, [topics, search, level]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"add" | "edit">("add");
  const [formData, setFormData] = useState<Partial<PracticeTopicVocabulary>>(
    getDefaultFormData()
  );
  const [editingTopic, setEditingTopic] =
    useState<PracticeTopicVocabulary | null>(null);

  const handleAddTopic = () => {
    setFormData(getDefaultFormData());
    setModalMode("add");
    setIsModalOpen(true);
  };

  const handleEdit = (id: string) => {
    const topic = topics.find((t) => t._id === id);
    if (!topic) return;
    setFormData(topic);
    setEditingTopic(topic);
    setModalMode("edit");
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    try {
      if (modalMode === "add") {
        await addItem(formData);
      } else if (modalMode === "edit" && editingTopic) {
        await updateItem(editingTopic._id!, formData);
      }

      setIsModalOpen(false);
      setEditingTopic(null);
      setFormData(getDefaultFormData());
    } catch (err) {
      console.error("❌ Lỗi khi lưu chủ đề:", err);
      alert("Có lỗi xảy ra khi lưu chủ đề");
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Bạn có chắc muốn xóa chủ đề này?")) return;
    try {
      await deleteItem(id);
    } catch (err) {
      console.error("❌ Lỗi khi xóa:", err);
      alert("Không thể xóa chủ đề, vui lòng thử lại.");
    }
  };

  const navigate = useNavigate();
  const handleView = (topicId: string) => {
    navigate(`${topicId}`);
  };

  if (isLoading) return <EmptyState mode="loading" />;

  if (isError)
    return (
      <EmptyState
        mode="error"
        title="Không thể tải chủ đề"
        description="Vui lòng thử lại sau hoặc liên hệ quản trị viên."
      />
    );

  return (
    <div className="min-h-screen max-w-7xl mx-auto py-8">
      <PracticeTopicHeader onAdd={handleAddTopic} />
      <PracticeTopicFilters
        search={search}
        setSearch={setSearch}
        level={level}
        setLevel={setLevel}
      />
      {topics.length === 0 ? (
        <EmptyState
          mode="empty"
          title="Chưa có chủ đề nào"
          description="Hãy thêm chủ đề mới để bắt đầu."
        />
      ) : (
        <PracticeTopicList
          topics={filteredTopics}
          page={page}
          pageCount={pageCount}
          onPageChange={setPage}
          onView={handleView}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}

      <PracticeTopicModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        formData={formData}
        setFormData={setFormData}
        title={modalMode === "add" ? "Thêm chủ đề mới" : "Chỉnh sửa chủ đề"}
      />
    </div>
  );
}
