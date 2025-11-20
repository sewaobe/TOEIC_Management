import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Chip,
} from "@mui/material";
import { ArrowBack, Add, Delete, Edit } from "@mui/icons-material";
import {
  practiceTopicVocabularyService,
  vocabularyWordService,
} from "../../../../services/practice_vocabulary.service";
import {
  PracticeTopicVocabulary,
  VocabularyWord,
} from "../../../../types/PracticeVocabulary";
import { EmptyState } from "../../../../components/EmptyState";
import VocabularyWordModal from "./VocabularyWordModal";
import VocabularyWordDetailModal from "./VocabularyWordDetailModal";

export default function PracticeVocabularyDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [topic, setTopic] = useState<PracticeTopicVocabulary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedWord, setSelectedWord] = useState<VocabularyWord | null>(null);
  const [modalMode, setModalMode] = useState<"add" | "edit">("add");
  const [formData, setFormData] = useState<Partial<VocabularyWord>>({
    word: "",
    phonetic: "",
    type: "",
    definitions: [],
    hints: [],
    examples: [],
  });

  useEffect(() => {
    if (id) {
      loadTopic();
    }
  }, [id]);

  const loadTopic = async () => {
    try {
      setIsLoading(true);
      const data = await practiceTopicVocabularyService.getPracticeTopicById(
        id!
      );
      setTopic(data);
    } catch (error) {
      console.error("Lỗi khi tải chủ đề:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddWord = () => {
    setFormData({
      word: "",
      phonetic: "",
      type: "",
      definitions: [],
      hints: [],
      examples: [],
    });
    setModalMode("add");
    setModalOpen(true);
  };

  const handleSaveWord = async () => {
    try {
      if (modalMode === "add") {
        const newWord = await vocabularyWordService.createVocabularyWord(
          formData
        );
        await practiceTopicVocabularyService.addVocabularyWordToTopic(
          id!,
          newWord._id!
        );
      } else if (modalMode === "edit") {
        if (!formData._id) throw new Error("Missing word id for update");
        await vocabularyWordService.updateVocabularyWord(
          formData._id!,
          formData
        );
      }
      await loadTopic();
      setModalOpen(false);
    } catch (error) {
      console.error("Lỗi khi lưu từ vựng:", error);
      alert("Có lỗi xảy ra khi lưu từ vựng");
    }
  };

  const handleDeleteWord = async (wordId: string) => {
    if (!window.confirm("Bạn có chắc muốn xóa từ vựng này?")) return;
    try {
      await practiceTopicVocabularyService.removeVocabularyWordFromTopic(
        id!,
        wordId
      );
      await loadTopic();
    } catch (error) {
      console.error("Lỗi khi xóa từ vựng:", error);
      alert("Có lỗi xảy ra khi xóa từ vựng");
    }
  };

  const handleViewDetail = (word: VocabularyWord) => {
    setSelectedWord(word);
    setDetailModalOpen(true);
  };

  if (isLoading) return <EmptyState mode="loading" />;

  if (!topic) return <EmptyState mode="error" title="Không tìm thấy chủ đề" />;

  const vocabularyWords = Array.isArray(topic.vocabulary_words)
    ? (topic.vocabulary_words as VocabularyWord[])
    : [];

  return (
    <Box sx={{ maxWidth: 1200, mx: "auto", py: 4 }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 4 }}>
        <IconButton onClick={() => navigate(-1)}>
          <ArrowBack />
        </IconButton>
        <Box sx={{ flex: 1 }}>
          <Typography variant="h4" fontWeight="bold">
            {topic.title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {topic.description}
          </Typography>
          <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
            <Chip label={topic.level} size="small" color="primary" />
            <Chip label={`${vocabularyWords.length} từ vựng`} size="small" />
          </Box>
        </Box>
        <Button variant="contained" startIcon={<Add />} onClick={handleAddWord}>
          Thêm từ vựng
        </Button>
      </Box>

      <Paper sx={{ width: "100%", overflow: "hidden" }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Từ vựng</TableCell>
                <TableCell>Phiên âm</TableCell>
                <TableCell>Loại từ</TableCell>
                <TableCell>Định nghĩa đầu tiên</TableCell>
                <TableCell>Tags</TableCell>
                <TableCell align="right">Thao tác</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {vocabularyWords.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    <EmptyState mode="empty" title="Chưa có từ vựng nào" />
                  </TableCell>
                </TableRow>
              ) : (
                vocabularyWords.map((word) => (
                  <TableRow
                    key={word._id}
                    hover
                    sx={{ cursor: "pointer" }}
                    onClick={() => handleViewDetail(word)}
                  >
                    <TableCell>
                      <Typography variant="body2" fontWeight="bold">
                        {word.word}
                      </Typography>
                    </TableCell>
                    <TableCell>{word.phonetic || "-"}</TableCell>
                    <TableCell>
                      {word.type ? (
                        <Chip
                          label={word.type}
                          size="small"
                          variant="outlined"
                        />
                      ) : (
                        "-"
                      )}
                    </TableCell>
                    <TableCell sx={{ maxWidth: 300 }}>
                      {word.definitions && word.definitions.length > 0 ? (
                        <Typography variant="body2" noWrap>
                          {word.definitions[0]}
                        </Typography>
                      ) : (
                        "-"
                      )}
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                        {word.tags?.slice(0, 2).map((tag, i) => (
                          <Chip key={i} label={tag} size="small" />
                        ))}
                        {word.tags && word.tags.length > 2 && (
                          <Chip
                            label={`+${word.tags.length - 2}`}
                            size="small"
                          />
                        )}
                      </Box>
                    </TableCell>
                    <TableCell align="right">
                      <IconButton
                        size="small"
                        color="info"
                        onClick={(e) => {
                          e.stopPropagation();
                          // open modal in edit mode
                          setFormData(word);
                          setModalMode("edit");
                          setModalOpen(true);
                        }}
                        title="Chỉnh sửa"
                      >
                        <Edit />
                      </IconButton>
                      <IconButton
                        size="small"
                        color="error"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteWord(word._id!);
                        }}
                        title="Xóa"
                      >
                        <Delete />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <VocabularyWordModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSaveWord}
        formData={formData}
        setFormData={setFormData}
        title={modalMode === "add" ? "Thêm từ vựng mới" : "Chỉnh sửa từ vựng"}
      />

      <VocabularyWordDetailModal
        open={detailModalOpen}
        onClose={() => setDetailModalOpen(false)}
        word={selectedWord}
      />
    </Box>
  );
}
