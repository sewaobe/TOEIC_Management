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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Chip,
} from "@mui/material";
import { ArrowBack, Add, Delete } from "@mui/icons-material";
import {
  practiceTopicVocabularyService,
  vocabularyWordService,
} from "../../../../services/practice_vocabulary.service";
import {
  PracticeTopicVocabulary,
  VocabularyWord,
} from "../../../../types/PracticeVocabulary";
import { EmptyState } from "../../../../components/EmptyState";

export default function PracticeVocabularyDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [topic, setTopic] = useState<PracticeTopicVocabulary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"add" | "edit">("add");
  const [formData, setFormData] = useState<Partial<VocabularyWord>>({
    word: "",
    phonetic: "",
    type: "",
    definition_vi: "",
    definition_en: "",
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
      definition_vi: "",
      definition_en: "",
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
                <TableCell>Định nghĩa (VI)</TableCell>
                <TableCell>Định nghĩa (EN)</TableCell>
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
                  <TableRow key={word._id}>
                    <TableCell>{word.word}</TableCell>
                    <TableCell>{word.phonetic}</TableCell>
                    <TableCell>{word.type}</TableCell>
                    <TableCell>{word.definition_vi}</TableCell>
                    <TableCell>{word.definition_en}</TableCell>
                    <TableCell align="right">
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleDeleteWord(word._id!)}
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

      <Dialog
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {modalMode === "add" ? "Thêm từ vựng mới" : "Chỉnh sửa từ vựng"}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}>
            <TextField
              label="Từ vựng"
              value={formData.word || ""}
              onChange={(e) =>
                setFormData({ ...formData, word: e.target.value })
              }
              required
            />
            <TextField
              label="Phiên âm"
              value={formData.phonetic || ""}
              onChange={(e) =>
                setFormData({ ...formData, phonetic: e.target.value })
              }
            />
            <TextField
              label="Loại từ"
              value={formData.type || ""}
              onChange={(e) =>
                setFormData({ ...formData, type: e.target.value })
              }
            />
            <TextField
              label="Định nghĩa tiếng Việt"
              value={formData.definition_vi || ""}
              onChange={(e) =>
                setFormData({ ...formData, definition_vi: e.target.value })
              }
              multiline
              rows={2}
              required
            />
            <TextField
              label="Định nghĩa tiếng Anh"
              value={formData.definition_en || ""}
              onChange={(e) =>
                setFormData({ ...formData, definition_en: e.target.value })
              }
              multiline
              rows={2}
              required
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setModalOpen(false)}>Hủy</Button>
          <Button variant="contained" onClick={handleSaveWord}>
            Lưu
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
