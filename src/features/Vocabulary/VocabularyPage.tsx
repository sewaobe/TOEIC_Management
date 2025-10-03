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
import { useNavigate } from "react-router-dom"

// Mock data
const initialVocabulary: Vocabulary[] = [
    {
        id: 1,
        word: "Meeting",
        phonetic: "/ˈmiːtɪŋ/",
        type: "noun",
        weight: 0.3,
        definition: "Cuộc họp, buổi gặp mặt",
        examples: [
            { en: "We have a team meeting at 3 PM today.", vi: "Chúng ta có cuộc họp nhóm lúc 3 giờ chiều hôm nay." },
        ],
        image: "/business-meeting-office.png",
        audio: "",
        part_type: "listening",
        tags: ["Business", "TOEIC"],
    },
    {
        id: 2,
        word: "Deadline",
        phonetic: "/ˈdedlaɪn/",
        type: "noun",
        weight: 0.5,
        definition: "Hạn chót, thời hạn",
        examples: [
            { en: "The deadline for this project is next Friday.", vi: "Hạn chót cho dự án này là thứ Sáu tuần sau." },
        ],
        image: "/calendar-deadline-clock-time.jpg",
        audio: "",
        part_type: "reading",
        tags: ["Business", "Work"],
    },
]

const topicInfo = {
    name: "Office Life",
    description: "Từ vựng công sở thông dụng",
    totalWords: 50,
}

const wordTypes = ["noun", "verb", "adjective", "adverb", "preposition", "conjunction", "pronoun", "interjection"]
const commonTags = ["TOEIC", "Business", "Travel", "Daily Life", "Academic", "Technology", "Health", "Food"]

const VocabularyPage = () => {
    const [vocabulary, setVocabulary] = useState<Vocabulary[]>(initialVocabulary)
    const [openModal, setOpenModal] = useState(false)
    const [modalState, setModalState] = useState<"normal" | "fullscreen">("normal")
    const [editingId, setEditingId] = useState<number | null>(null)

    const [searchQuery, setSearchQuery] = useState("")
    const [filterLevel, setFilterLevel] = useState("All")
    const [viewMode, setViewMode] = useState<"grid" | "list">("list")

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
    const [showDraftWarning, setShowDraftWarning] = useState(false)

    const { formData, setFormData, resetForm, isDirty } = useVocabularyForm()

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
    const handleDelete = (id: number) => {
        if (window.confirm("Bạn có chắc chắn muốn xóa từ vựng này?")) {
            setVocabulary((prev) => prev.filter((v) => v.id !== id))
        }
    }

    // lưu từ
    const handleSave = () => {
        if (!formData.word || !formData.definition) {
            alert("Vui lòng điền đầy đủ thông tin từ vựng và định nghĩa")
            return
        }

        if (editingId) {
            setVocabulary((prev) => prev.map((v) => (v.id === editingId ? { ...v, ...formData } : v)))
        } else {
            const newVocab: Vocabulary = {
                id: Math.max(...vocabulary.map((v) => v.id), 0) + 1,
                ...formData,
            }
            setVocabulary((prev) => [...prev, newVocab])
        }

        setOpenModal(false)
        resetForm()
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

    return (
        <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-teal-50 to-emerald-50">
            {/* Header */}
            <div className="bg-white shadow-lg border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <TopicHeader
                        name={topicInfo.name}
                        description={topicInfo.description}
                        learnersCount={0}
                        onBack={handleBack}
                        onOpenMenu={(e) => setAnchorEl(e.currentTarget)}
                    />
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
            />

            {/* FAB thêm từ mới */}
            <AnimatePresence>
                {!openModal && (
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
                        {isDirty && (
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="absolute -top-1 -right-1 w-5 h-5 bg-orange-500 rounded-full border-2 border-white flex items-center justify-center"
                            >
                                <span className="text-white text-xs font-bold">!</span>
                            </motion.div>
                        )}
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
