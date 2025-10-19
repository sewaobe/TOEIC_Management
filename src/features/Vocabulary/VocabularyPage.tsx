import { useEffect, useState } from "react"
import { Fab, Menu, MenuItem, ListItemIcon, ListItemText, Tooltip } from "@mui/material"
import { Add, ContentCopy, FileDownload } from "@mui/icons-material"
import { motion, AnimatePresence } from "framer-motion"

import TopicHeader from "./components/TopicHeader"
import StatsCards from "./components/StatsCard"
import SearchFilterBar from "./components/SearchFilterBar"
import VocabularyList from "./components/VocabularyList"
import AddEditVocabularyDialog from "./components/AddEditVocabularyDialog"
import MinimizedDraftCard from "./components/MinimizedDraftCard"
import DraftWarningDialog from "./components/DraftWarningDialog"
import { Vocabulary } from "../../types/Vocabulary"
import { useVocabularyForm } from "../../hooks/useVocabularyForm"
import { useLocation, useNavigate } from "react-router-dom"
import { useFetchList } from "../../hooks/useFetchList"
import { vocabularyService } from "../../services/vocabulary.service"
import { EmptyState } from "../../components/EmptyState"
import { TopicInfo } from "../../types/Topic"
import { useFetchOne } from "../../hooks/useFetchOne"

const wordTypes = ["noun", "verb", "adjective", "adverb", "preposition", "conjunction", "pronoun", "interjection"]
const commonTags = ["TOEIC", "Business", "Travel", "Daily Life", "Academic", "Technology", "Health", "Food"]

const VocabularyPage = () => {
    const location = useLocation();
    const url = location.pathname.split("/");
    const topicId = url[url.length - 1];
    const {
        items: vocabulary,
        isLoading,
        isError,
        pageCount,
        refresh,
        addItem,
        updateItem,
        deleteItem,
    } = useFetchList<Vocabulary, { topicId: string; page?: number; limit?: number }>({
        fetchFn: (params) => vocabularyService.getByTopic(params!.topicId, params?.page, params?.limit),
        createFn: (item) => vocabularyService.create(item),
        updateFn: (id, item) => vocabularyService.update(id, { ...item, topicId }),
        deleteFn: (id) => vocabularyService.delete(id, topicId),
    })

    const {
        data: topicInfo
    } = useFetchOne<TopicInfo>({
        fetchFn: () => vocabularyService.getTopicInfo(topicId)
    })

    const [page, setPage] = useState(1)

    useEffect(() => {
        refresh({ topicId, page, limit: 9 })
    }, [topicId, page])

    const [openModal, setOpenModal] = useState(false)
    const [modalState, setModalState] = useState<"normal" | "fullscreen">("normal")
    const [editingId, setEditingId] = useState<string | null>(null)

    const [searchQuery, setSearchQuery] = useState("")
    const [filterLevel, setFilterLevel] = useState("All")
    const [viewMode, setViewMode] = useState<"grid" | "list">("list")

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
    const [showDraftWarning, setShowDraftWarning] = useState(false)

    const { formData, setFormData, resetForm, isDirty, clearCurrentDraft } = useVocabularyForm()

    // thêm từ mới
    const handleAddNew = () => {
        setEditingId(null)
        resetForm()
        setOpenModal(true)
        setModalState("normal")
    }

    // sửa từ
    const handleEdit = (vocab: Vocabulary) => {
        setEditingId(vocab.id)
        setFormData({ ...vocab })
        setOpenModal(true)
        setModalState("normal")
    }

    // xóa từ
    const handleDelete = async (id: string) => {
        if (window.confirm("Bạn có chắc chắn muốn xóa từ vựng này?")) {
            await deleteItem(id, { topicId, page, limit: 9 });
            resetForm();
            setEditingId(null);
        }
    }

    // lưu từ
    const handleSave = async () => {
        if (!formData.word || !formData.definition) {
            alert("Vui lòng điền đầy đủ thông tin từ vựng và định nghĩa")
            return
        }

        if (editingId) {
            await updateItem(editingId, formData, { topicId, page, limit: 9 });
        } else {
            await addItem({ ...formData, topicId }, { topicId, page, limit: 9 });
        }

        setOpenModal(false)
        resetForm()
        setEditingId(null);
        clearCurrentDraft();
    }

    // FAB logic
    const handleFabClick = () => {
        if (isDirty && openModal) {
            setModalState("normal")
        } else if (isDirty && !openModal) {
            setShowDraftWarning(true)
        } else {
            handleAddNew()
        }
    }

    //handle back icon
    const navigate = useNavigate();
    const handleBack = () => {
        navigate(-1);
    }

    //Auto scroll to top
    useEffect(() => {
        const el = document.getElementById("layout_container");
        if (el) {
            el.scrollTo({ top: 0, behavior: 'smooth' })
        }
    }, [])

    if (isLoading) return <EmptyState mode="loading" />

    if (isError) return (
        <EmptyState
            mode="error"
            title="Không thể tải chủ đề"
            description="Vui lòng thử lại sau hoặc liên hệ quản trị viên."
        />
    )
    return (
        <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-teal-50 to-emerald-50">
            {/* Header */}
            <div className="bg-white shadow-lg border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    {topicInfo && <TopicHeader
                        name={topicInfo.name}
                        description={topicInfo.description}
                        learnersCount={topicInfo.totalLearner}
                        onBack={handleBack}
                        onOpenMenu={(e) => setAnchorEl(e.currentTarget)}
                    />}
                    <StatsCards vocabulary={vocabulary} />
                    <SearchFilterBar
                        searchQuery={searchQuery}
                        setSearchQuery={setSearchQuery}
                        filterLevel={filterLevel}
                        setFilterLevel={setFilterLevel}
                        viewMode={viewMode}
                        setViewMode={setViewMode}
                    />
                </div>
            </div>

            {/* List */}
            <VocabularyList
                vocabulary={vocabulary}
                searchQuery={searchQuery}
                filterLevel={filterLevel}
                viewMode={viewMode}
                onEdit={handleEdit}
                onDelete={handleDelete}
                page={page}
                pageCount={pageCount}
                onPageChange={setPage}
            />

            {/* FAB thêm từ mới */}
            <AnimatePresence>
                {!openModal && !isDirty && (
                    <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        transition={{ type: "spring", stiffness: 260, damping: 20 }}
                        className="fixed bottom-6 right-6 z-40"
                    >
                        <Tooltip title="Thêm từ vựng mới" placement="left">
                            <Fab
                                color="primary"
                                onClick={handleFabClick}
                                sx={{
                                    width: 64,
                                    height: 64,
                                    background: "linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)",
                                    boxShadow: "0 8px 24px rgba(37, 99, 235, 0.4)",
                                }}
                            >
                                <Add sx={{ fontSize: 32 }} />
                            </Fab>
                        </Tooltip>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Modal Add/Edit */}
            <AddEditVocabularyDialog
                open={openModal}
                mode={editingId ? "edit" : "add"}
                formData={formData}
                onChange={setFormData}
                onSave={handleSave}
                onClose={() => setOpenModal(false)}
                modalState={modalState}
                setModalState={setModalState}
                wordTypes={wordTypes}
                commonTags={commonTags}
            />

            {/* Minimized draft card */}
            <AnimatePresence>
                {openModal === false && isDirty && (
                    <MinimizedDraftCard
                        editingId={editingId}
                        word={formData.word}
                        onRestore={() => setOpenModal(true)}
                        onClose={() => {
                            resetForm()
                            setEditingId(null)
                        }}
                    />
                )}
            </AnimatePresence>

            {/* Draft warning */}
            <DraftWarningDialog
                open={showDraftWarning}
                word={formData.word}
                definition={formData.definition}
                onContinue={() => {
                    setShowDraftWarning(false)
                    setOpenModal(true)
                    setModalState("normal")
                }}
                onDiscard={() => {
                    setShowDraftWarning(false)
                    resetForm()
                    handleAddNew()
                }}
                onClose={() => setShowDraftWarning(false)}
            />

            {/* Menu xuất dữ liệu */}
            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}>
                <MenuItem onClick={() => setAnchorEl(null)}>
                    <ListItemIcon>
                        <ContentCopy fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Sao chép tất cả</ListItemText>
                </MenuItem>
                <MenuItem onClick={() => setAnchorEl(null)}>
                    <ListItemIcon>
                        <FileDownload fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Xuất CSV</ListItemText>
                </MenuItem>
            </Menu>
        </div>
    )
}

export default VocabularyPage
