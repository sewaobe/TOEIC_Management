import { useEffect, useRef, useState } from "react";
import {
  Card,
  CardContent,
  Button,
  TextField,
  Tabs,
  Tab,
  Select,
  MenuItem,
  IconButton,
  Typography,
  Box,
  Stack,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  Paper,
  TableRow,
} from "@mui/material";
import {
  Add,
  Delete,
  Visibility,
  DragIndicator,
  Save,
  Close,
  ArrowBack,
} from "@mui/icons-material";
import { motion, AnimatePresence } from "framer-motion";
import {
  DndContext,
  closestCenter,
  DragEndEvent,
  DragStartEvent,
  DragOverlay,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import lessonService from "../../services/lesson.service";

import { toast } from "sonner";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../stores/store";
import { hideFab, showFab } from "../../stores/fabSlice";
import { EmptyState } from "../../components/EmptyState";
import { InteractiveVideo } from "../../components/InteractiveVideo";

// --- INTERFACES ---
interface Example {
  en?: string;
  vi?: string;
  note?: string;
}
interface ErrorExample {
  wrong?: string;
  correct?: string;
  explanation?: string;
}
import { QuestionMarker } from "../../hooks/useInteractiveVideo";

interface LessonSection {
  id: string;
  order: number;
  title: string;
  type: "text" | "example" | "error" | "media" | "table";
  content?: string;
  example?: Example;
  error?: ErrorExample;
  mediaId?: string;
  mediaUrl?: string;
  tableData?: string[][];
  markers?: QuestionMarker[];
}
interface SortableLessonSectionProps {
  section: LessonSection;
  isOpen: boolean;
  isEditing: boolean;
  typeColors: Record<LessonSection["type"], string>;
  onToggleAccordion: (id: string) => void;
  onDelete: (id: string) => void;
  onTitleChange: (id: string, newTitle: string) => void;
  onSetEditing: (id: string | null) => void;
  onContentChange: (id: string, content: string) => void;
  onMediaUrlChange: (id: string, url: string) => void;
  onMediaIdChange?: (id: string, mediaId: string) => void;
  onExampleChange: (id: string, field: keyof Example, value: string) => void;
  onErrorChange: (id: string, field: keyof ErrorExample, value: string) => void;
  onTableChange: (
    id: string,
    rowIndex: number,
    colIndex: number,
    value: string
  ) => void;
  onAddTableRow: (id: string) => void;
  onDeleteTableRow: (id: string, rowIndex: number) => void;
  onAddTableCol: (id: string) => void;
  onDeleteTableCol: (id: string, colIndex: number) => void;
  // Marker handlers for media sections
  onAddMarker: (id: string) => void;
  onUpdateMarker: (
    id: string,
    markerIndex: number,
    marker: QuestionMarker
  ) => void;
  onDeleteMarker: (id: string, markerIndex: number) => void;
  onOpenPreview: (
    url: string,
    markers?: QuestionMarker[],
    startTime?: number
  ) => void;
}

// --- COMPONENT XEM TRƯỚC BÀI HỌC ---
interface LessonPreviewProps {
  open: boolean;
  onClose: () => void;
  lesson: { title: string; summary: string; sections: LessonSection[] };
}

function LessonPreview({ open, onClose, lesson }: LessonPreviewProps) {
  const getYouTubeEmbedUrl = (url: string) => {
    if (!url) return null;
    const youtubeRegex =
      /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = url.match(youtubeRegex);
    return match ? `https://www.youtube.com/embed/${match[1]}` : null;
  };

  const isImageUrl = (url: string) =>
    url && /\.(jpeg|jpg|gif|png|svg)$/i.test(url);

  const renderSection = (section: LessonSection) => {
    switch (section.type) {
      case "text":
        return (
          <Typography sx={{ whiteSpace: "pre-wrap" }}>
            {section.content}
          </Typography>
        );
      case "example":
        return (
          <Paper variant="outlined" sx={{ p: 2, bgcolor: "#f5f5f5" }}>
            <Typography>
              <strong>EN:</strong> {section.example?.en}
            </Typography>
            <Typography>
              <strong>VI:</strong> {section.example?.vi}
            </Typography>
            {section.example?.note && (
              <Typography variant="caption" color="text.secondary">
                <em>Note: {section.example.note}</em>
              </Typography>
            )}
          </Paper>
        );
      case "error":
        return (
          <Paper variant="outlined" sx={{ p: 2 }}>
            <Typography color="error">
              <strong>Sai:</strong> {section.error?.wrong}
            </Typography>
            <Typography color="success.main">
              <strong>Đúng:</strong> {section.error?.correct}
            </Typography>
            <Divider sx={{ my: 1 }} />
            <Typography>
              <strong>Giải thích:</strong> {section.error?.explanation}
            </Typography>
          </Paper>
        );
      case "media": {
        const embedUrl = getYouTubeEmbedUrl(section.mediaUrl || "");
        if (embedUrl)
          return (
            <Box
              component="iframe"
              src={embedUrl}
              frameBorder="0"
              allowFullScreen
              sx={{ width: "100%", height: "315px", borderRadius: 1 }}
            />
          );
        if (isImageUrl(section.mediaUrl || ""))
          return (
            <Box
              component="img"
              src={section.mediaUrl}
              sx={{ maxWidth: "100%", borderRadius: 1 }}
            />
          );
        return (
          <Typography color="text.secondary">
            Không thể hiển thị media từ URL này.
          </Typography>
        );
      }
      case "table":
        return (
          <TableContainer component={Paper} variant="outlined">
            <Table size="small">
              <TableBody>
                {section.tableData?.map((row, rIdx) => (
                  <TableRow key={rIdx}>
                    {row.map((cell, cIdx) => (
                      <TableCell
                        key={cIdx}
                        sx={{ fontWeight: rIdx === 0 ? "bold" : "normal" }}
                      >
                        {cell}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        );
      default:
        return null;
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="md"
      scroll="paper"
    >
      <DialogTitle>
        {lesson.title}
        <IconButton
          onClick={onClose}
          sx={{ position: "absolute", right: 8, top: 8 }}
        >
          <Close />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        <Typography variant="subtitle1" color="text.secondary" gutterBottom>
          {lesson.summary}
        </Typography>
        <Stack spacing={3} mt={2}>
          {lesson.sections.length === 0 && (
            <EmptyState
              mode="empty"
              title="Chưa có section nào"
              description="Hãy thêm section mới để bắt đầu."
            />
          )}
          {lesson.sections.map((section) => (
            <Box key={section.id}>
              <Typography variant="h6" gutterBottom>
                {section.title}
              </Typography>
              {renderSection(section)}
            </Box>
          ))}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Đóng</Button>
      </DialogActions>
    </Dialog>
  );
}

// --- COMPONENT CON (SORTABLE SECTION) ---
function SortableLessonSection({
  section,
  isOpen,
  ...props
}: SortableLessonSectionProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: section.id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const renderContent = () => {
    switch (section.type) {
      case "text":
        return (
          <TextField
            fullWidth
            multiline
            minRows={3}
            label="Nội dung lý thuyết"
            value={section.content ?? ""}
            onChange={(e) => props.onContentChange(section.id, e.target.value)}
          />
        );
      case "example":
        return (
          <Stack spacing={1.5}>
            <TextField
              label="Câu Tiếng Anh"
              value={section.example?.en ?? ""}
              onChange={(e) =>
                props.onExampleChange(section.id, "en", e.target.value)
              }
            />
            <TextField
              label="Câu Tiếng Việt"
              value={section.example?.vi ?? ""}
              onChange={(e) =>
                props.onExampleChange(section.id, "vi", e.target.value)
              }
            />
            <TextField
              label="Ghi chú"
              value={section.example?.note ?? ""}
              onChange={(e) =>
                props.onExampleChange(section.id, "note", e.target.value)
              }
            />
          </Stack>
        );
      case "error":
        return (
          <Stack spacing={1.5}>
            <TextField
              label="Câu sai"
              value={section.error?.wrong ?? ""}
              onChange={(e) =>
                props.onErrorChange(section.id, "wrong", e.target.value)
              }
            />
            <TextField
              label="Câu đúng"
              value={section.error?.correct ?? ""}
              onChange={(e) =>
                props.onErrorChange(section.id, "correct", e.target.value)
              }
            />
            <TextField
              multiline
              minRows={2}
              label="Giải thích"
              value={section.error?.explanation ?? ""}
              onChange={(e) =>
                props.onErrorChange(section.id, "explanation", e.target.value)
              }
            />
          </Stack>
        );
      case "media":
        return (
          <Box
            onDragOver={(e) => e.preventDefault()}
            onDragEnter={(e) => {
              e.currentTarget.style.background = "#f3e8ff";
              e.currentTarget.style.border = "2px dashed #9c27b0";
            }}
            onDragLeave={(e) => {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.border = "1px dashed #ccc";
            }}
            onDrop={(e) => {
              e.preventDefault();
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.border = "1px dashed #ccc";
              try {
                const data = JSON.parse(e.dataTransfer.getData("video"));
                if (data?.id && data?.url) {
                  props.onMediaUrlChange(section.id, data.url);
                  props.onMediaIdChange?.(section.id, data.id); // 🆕 Lưu id thật
                }
              } catch {
                console.warn("Không đọc được dữ liệu video kéo thả");
              }
            }}
            sx={{
              p: 2,
              border: "1px dashed #ccc",
              borderRadius: 2,
              textAlign: "center",
              transition: "0.25s all ease-in-out",
              bgcolor: "background.paper",
            }}
          >
            <Typography variant="body2" color="text.secondary" mb={1}>
              Kéo thả video từ trình quản lý video vào đây 🎥
            </Typography>

            <TextField
              fullWidth
              label="URL Media (Video/Ảnh)"
              value={section.mediaUrl ?? ""}
              onChange={(e) =>
                props.onMediaUrlChange(section.id, e.target.value)
              }
            />

            {section.mediaUrl && (
              <Box mt={3}>
                {/* 🎬 YouTube link */}
                {section.mediaUrl.includes("youtu") ? (
                  <Box
                    component="iframe"
                    src={`https://www.youtube.com/embed/${
                      section.mediaUrl.match(
                        /(?:v=|\/|watch\?v=|embed\/)([A-Za-z0-9_-]{11})/
                      )?.[1]
                    }`}
                    frameBorder="0"
                    allowFullScreen
                    sx={{
                      width: "100%",
                      aspectRatio: "16/9", // 🔥 Giữ tỉ lệ 16:9
                      borderRadius: 2,
                      boxShadow: 3,
                    }}
                  />
                ) : /* ☁️ Cloudinary video */
                section.mediaUrl.match(/\.(mp4|webm|mov|avi|mkv)$/i) ? (
                  <Box
                    component="video"
                    src={section.mediaUrl}
                    controls
                    sx={{
                      width: "100%",
                      aspectRatio: "16/9",
                      borderRadius: 2,
                      boxShadow: 3,
                      objectFit: "contain",
                      backgroundColor: "#000",
                    }}
                  />
                ) : /* 🖼️ Cloudinary image */
                section.mediaUrl.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? (
                  <Box
                    component="img"
                    src={section.mediaUrl}
                    sx={{
                      width: "100%",
                      maxHeight: 600,
                      borderRadius: 2,
                      objectFit: "contain",
                      boxShadow: 3,
                    }}
                  />
                ) : /* ❌ Không nhận dạng được */
                section.mediaUrl.includes("cloudinary.com") ? (
                  <Box
                    component="img"
                    src={section.mediaUrl.replace("/upload/", "/upload/w_800/")}
                    sx={{
                      width: "100%",
                      aspectRatio: "16/9",
                      borderRadius: 2,
                      objectFit: "cover",
                      boxShadow: 3,
                    }}
                  />
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    Không thể hiển thị media này
                  </Typography>
                )}
                {/* --- Marker list + add button for media questions --- */}
                <Box mt={2}>
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Typography variant="subtitle2">
                      Câu hỏi tương tác
                    </Typography>
                    <Stack direction="row" spacing={1}>
                      <Button
                        size="small"
                        onClick={() => props.onAddMarker(section.id)}
                      >
                        + Thêm câu hỏi
                      </Button>
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() =>
                          props.onOpenPreview(
                            section.mediaUrl || "",
                            section.markers,
                            0
                          )
                        }
                      >
                        Xem trước
                      </Button>
                    </Stack>
                  </Stack>

                  <Stack spacing={1} mt={1}>
                    {(section.markers || []).map((m, mi) => (
                      <Paper key={mi} variant="outlined" sx={{ p: 1 }}>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <TextField
                            label="Thời điểm (s)"
                            size="small"
                            type="number"
                            value={m.time}
                            onChange={(e) =>
                              props.onUpdateMarker(section.id, mi, {
                                ...m,
                                time: Number(e.target.value),
                              })
                            }
                            sx={{ width: 120 }}
                          />
                          <TextField
                            label="Câu hỏi"
                            size="small"
                            value={m.question}
                            onChange={(e) =>
                              props.onUpdateMarker(section.id, mi, {
                                ...m,
                                question: e.target.value,
                              })
                            }
                            sx={{ flex: 1 }}
                          />
                          <IconButton
                            size="small"
                            onClick={() =>
                              props.onOpenPreview(
                                section.mediaUrl || "",
                                section.markers,
                                m.time
                              )
                            }
                          >
                            <Visibility />
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={() => props.onDeleteMarker(section.id, mi)}
                          >
                            <Delete />
                          </IconButton>
                        </Stack>
                        <Stack direction="row" spacing={1} mt={1}>
                          <TextField
                            label="Option A"
                            size="small"
                            value={m.options?.[0] ?? ""}
                            onChange={(e) => {
                              const opts = [...(m.options || [])];
                              opts[0] = e.target.value;
                              props.onUpdateMarker(section.id, mi, {
                                ...m,
                                options: opts,
                              });
                            }}
                            sx={{ flex: 1 }}
                          />
                          <TextField
                            label="Option B"
                            size="small"
                            value={m.options?.[1] ?? ""}
                            onChange={(e) => {
                              const opts = [...(m.options || [])];
                              opts[1] = e.target.value;
                              props.onUpdateMarker(section.id, mi, {
                                ...m,
                                options: opts,
                              });
                            }}
                            sx={{ flex: 1 }}
                          />
                        </Stack>
                        <Stack direction="row" spacing={1} mt={1}>
                          <TextField
                            label="Option C"
                            size="small"
                            value={m.options?.[2] ?? ""}
                            onChange={(e) => {
                              const opts = [...(m.options || [])];
                              opts[2] = e.target.value;
                              props.onUpdateMarker(section.id, mi, {
                                ...m,
                                options: opts,
                              });
                            }}
                            sx={{ flex: 1 }}
                          />
                          <TextField
                            label="Option D"
                            size="small"
                            value={m.options?.[3] ?? ""}
                            onChange={(e) => {
                              const opts = [...(m.options || [])];
                              opts[3] = e.target.value;
                              props.onUpdateMarker(section.id, mi, {
                                ...m,
                                options: opts,
                              });
                            }}
                            sx={{ flex: 1 }}
                          />
                        </Stack>
                        <Stack
                          direction="row"
                          spacing={1}
                          mt={1}
                          alignItems="center"
                        >
                          <TextField
                            label="Index đáp án đúng"
                            size="small"
                            type="number"
                            value={m.correctAnswer}
                            onChange={(e) =>
                              props.onUpdateMarker(section.id, mi, {
                                ...m,
                                correctAnswer: Number(e.target.value),
                              })
                            }
                            sx={{ width: 160 }}
                          />
                          <TextField
                            label="Giải thích (tùy chọn)"
                            size="small"
                            value={m.explanation ?? ""}
                            onChange={(e) =>
                              props.onUpdateMarker(section.id, mi, {
                                ...m,
                                explanation: e.target.value,
                              })
                            }
                            sx={{ flex: 1 }}
                          />
                        </Stack>
                      </Paper>
                    ))}
                  </Stack>
                </Box>
              </Box>
            )}
          </Box>
        );

      case "table":
        return (
          <Stack spacing={2}>
            <Stack direction="row" spacing={1}>
              <Button
                size="small"
                variant="outlined"
                onClick={() => props.onAddTableRow(section.id)}
              >
                Thêm hàng
              </Button>
              <Button
                size="small"
                variant="outlined"
                onClick={() => props.onAddTableCol(section.id)}
              >
                Thêm cột
              </Button>
            </Stack>
            <Box sx={{ overflowX: "auto" }}>
              <table style={{ borderCollapse: "collapse", width: "100%" }}>
                <thead>
                  <tr>
                    <th />
                    {section.tableData?.[0]?.map((_, colIndex) => (
                      <th key={colIndex} style={{ padding: "4px" }}>
                        <IconButton
                          size="small"
                          onClick={() =>
                            props.onDeleteTableCol(section.id, colIndex)
                          }
                        >
                          <Delete />
                        </IconButton>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {section.tableData?.map((row, rowIndex) => (
                    <tr key={rowIndex}>
                      <td style={{ padding: "4px" }}>
                        <IconButton
                          size="small"
                          onClick={() =>
                            props.onDeleteTableRow(section.id, rowIndex)
                          }
                        >
                          <Delete />
                        </IconButton>
                      </td>
                      {row.map((cell, colIndex) => (
                        <td key={colIndex} style={{ padding: "4px" }}>
                          <TextField
                            size="small"
                            fullWidth
                            value={cell}
                            onChange={(e) =>
                              props.onTableChange(
                                section.id,
                                rowIndex,
                                colIndex,
                                e.target.value
                              )
                            }
                          />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </Box>
          </Stack>
        );
      default:
        return null;
    }
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      <Card
        variant="outlined"
        sx={{
          position: "relative",
          overflow: "hidden",
          boxShadow: props.isEditing
            ? "0 0 8px rgba(33, 150, 243, 0.5)"
            : "none",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            height: 4,
            width: "100%",
            bgcolor: props.typeColors[section.type],
          }}
        />
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            px: 2,
            py: 1.5,
            bgcolor: "#f5f5f5",
            cursor: "pointer",
          }}
          onClick={() => props.onToggleAccordion(section.id)}
        >
          <Box display="flex" alignItems="center" gap={1}>
            <DragIndicator
              {...listeners}
              sx={{ color: "gray", cursor: "grab" }}
            />
            {props.isEditing ? (
              <TextField
                size="small"
                value={section.title}
                onChange={(e) =>
                  props.onTitleChange(section.id, e.target.value)
                }
                onBlur={() => props.onSetEditing(null)}
                onClick={(e) => e.stopPropagation()}
                autoFocus
              />
            ) : (
              <Typography
                fontWeight={600}
                onDoubleClick={(e) => {
                  e.stopPropagation();
                  props.onSetEditing(section.id);
                }}
              >
                {section.title}
              </Typography>
            )}
          </Box>
          <IconButton
            onClick={(e) => {
              e.stopPropagation();
              props.onDelete(section.id);
            }}
          >
            <Delete />
          </IconButton>
        </Box>
        <AnimatePresence initial={false}>
          {isOpen && (
            <motion.div
              key="content"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Box p={2}>
                <Divider sx={{ mb: 2 }} />
                {renderContent()}
              </Box>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </div>
  );
}

// --- COMPONENT CHÍNH ---
export default function LessonManager() {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  const grammar = location.state?.grammar || null;

  const [lesson, setLesson] = useState<{
    title: string;
    summary: string;
    sections: LessonSection[];
  }>({
    title: grammar?.title || "Chủ đề ngữ pháp",
    summary: grammar
      ? `Trình độ: ${grammar.level} | Trạng thái: ${grammar.status}`
      : "Đang tải dữ liệu...",
    sections: [],
  });

  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const fetchLessonDetail = async () => {
      try {
        if (id) {
          const res = await lessonService.getById(id);
          const lessonData = res.data;
          if (!lessonData) {
            toast.error("Không tìm thấy bài học!");
            return;
          }

          // ✅ Cập nhật dữ liệu từ server
          setLesson({
            title: lessonData.title,
            summary: lessonData.summary || "",
            sections:
              lessonData.sections_id?.map((s: any, index: number) => ({
                id: s._id || `section-${index}`,
                title: s.title || `Phần ${index + 1}`,
                type: s.type || "text",
                order: s.order ?? index,
                content: s.content || "",
                example: s.example,
                error: s.error,
                // ✅ Lấy đúng URL từ media đầu tiên (nếu có)
                mediaUrl:
                  Array.isArray(s.medias_id) && s.medias_id.length > 0
                    ? s.medias_id[0].url
                    : s.mediaUrl || "",
                // ✅ Lưu lại ID thật của media (nếu cần để BE update)
                mediaId:
                  Array.isArray(s.medias_id) && s.medias_id.length > 0
                    ? s.medias_id[0]._id
                    : s.mediaId || "",
                tableData: s.tableData,
                // ✅ Lấy markers (câu hỏi tương tác) nếu backend trả về
                markers: Array.isArray(s.markers)
                  ? s.markers.map((m: any) => ({
                      time: Number(m.time) || 0,
                      question: String(m.question || ""),
                      options: Array.isArray(m.options)
                        ? m.options.map(String)
                        : ["", "", "", ""],
                      correctAnswer: Number(m.correctAnswer) || 0,
                      explanation: m.explanation || "",
                    }))
                  : [],
              })) || [],
          });
        }
      } catch (err) {
        toast.error("Không thể tải chi tiết bài học!");
        console.error(err);
      }
    };

    fetchLessonDetail();
  }, [id]);

  const [openSections, setOpenSections] = useState<string[]>([]);
  const [editingTitle, setEditingTitle] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState<LessonSection | null>(
    null
  );
  const [newType, setNewType] = useState<LessonSection["type"]>("text");
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  // Preview modal for markers
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [previewMarkers, setPreviewMarkers] = useState<QuestionMarker[]>([]);
  const [previewStartTime, setPreviewStartTime] = useState<number>(0);

  // Add marker flow
  const [addingMarkerFor, setAddingMarkerFor] = useState<string | null>(null);
  const [pickedTime, setPickedTime] = useState<number | null>(null);
  const [markerDialogOpen, setMarkerDialogOpen] = useState(false);
  const [newMarker, setNewMarker] = useState<QuestionMarker>({
    time: 0,
    question: "",
    options: ["", "", "", ""],
    correctAnswer: 0,
    explanation: "",
  });

  const typeColors: Record<LessonSection["type"], string> = {
    text: "#2196f3",
    example: "#4caf50",
    error: "#f44336",
    media: "#9c27b0",
    table: "#ff9800",
  };

  const handleAddSectionByType = () => {
    const typeTitles: Record<LessonSection["type"], string> = {
      text: "Lý thuyết mới",
      example: "Ví dụ mới",
      error: "Lỗi sai mới",
      media: "Media mới",
      table: "Bảng mới",
    };
    const baseSection: Omit<LessonSection, "type"> = {
      id: `section-${Date.now()}`,
      title: typeTitles[newType],
      order: lesson.sections.length,
    };
    let newSection: LessonSection;
    switch (newType) {
      case "example":
        newSection = {
          ...baseSection,
          type: newType,
          example: { en: "", vi: "", note: "" },
        };
        break;
      case "error":
        newSection = {
          ...baseSection,
          type: newType,
          error: { wrong: "", correct: "", explanation: "" },
        };
        break;
      case "table":
        newSection = {
          ...baseSection,
          type: newType,
          tableData: [
            ["", ""],
            ["", ""],
          ],
        };
        break;
      case "media":
        newSection = { ...baseSection, type: newType, mediaUrl: "" };
        break;
      default:
        newSection = { ...baseSection, type: "text", content: "" };
    }
    setLesson((prev) => ({
      ...prev,
      sections: [...prev.sections, newSection],
    }));
  };

  const updateSection = (
    id: string,
    updateFn: (section: LessonSection) => LessonSection
  ) => {
    setLesson((prev) => ({
      ...prev,
      sections: prev.sections.map((s) => (s.id === id ? updateFn(s) : s)),
    }));
  };

  const handleSave = async () => {
    try {
      const res = await lessonService.updateWithSections(grammar._id, lesson);
      toast.success("Đã lưu bài học thành công!");

      // ✅ Quay lại trang trước sau 1 giây (để kịp thấy toast)
      setTimeout(() => {
        navigate(-1);
      }, 1000);
    } catch (err) {
      console.error(err);
      toast.error("Không thể lưu bài học!");
    }
  };

  const handlers = {
    onToggleAccordion: (id: string) =>
      setOpenSections((prev) =>
        prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
      ),
    onDelete: (id: string) =>
      setLesson((prev) => ({
        ...prev,
        sections: prev.sections.filter((s) => s.id !== id),
      })),
    onTitleChange: (id: string, newTitle: string) =>
      updateSection(id, (s) => ({ ...s, title: newTitle })),
    onSetEditing: (id: string | null) => setEditingTitle(id),
    onContentChange: (id: string, content: string) =>
      updateSection(id, (s) => ({ ...s, content })),
    onMediaUrlChange: (id: string, url: string) =>
      updateSection(id, (s) => ({ ...s, mediaUrl: url })),
    onMediaIdChange: (id: string, mediaId: string) =>
      updateSection(id, (s) => ({ ...s, mediaId })),
    onExampleChange: (id: string, field: keyof Example, value: string) =>
      updateSection(id, (s) => ({
        ...s,
        example: { ...s.example, [field]: value } as Example,
      })),
    onErrorChange: (id: string, field: keyof ErrorExample, value: string) =>
      updateSection(id, (s) => ({
        ...s,
        error: { ...s.error, [field]: value } as ErrorExample,
      })),
    onTableChange: (
      id: string,
      rowIndex: number,
      colIndex: number,
      value: string
    ) =>
      updateSection(id, (s) => {
        const newTable = s.tableData?.map((r) => [...r]) || [];
        newTable[rowIndex][colIndex] = value;
        return { ...s, tableData: newTable };
      }),
    onAddTableRow: (id: string) =>
      updateSection(id, (s) => {
        const table = s.tableData?.map((r) => [...r]) || [];
        const colCount = table[0]?.length || 1;
        table.push(Array(colCount).fill(""));
        return { ...s, tableData: table };
      }),
    onDeleteTableRow: (id: string, rowIndex: number) =>
      updateSection(id, (s) => ({
        ...s,
        tableData: s.tableData?.filter((_, i) => i !== rowIndex),
      })),
    onAddTableCol: (id: string) =>
      updateSection(id, (s) => ({
        ...s,
        tableData: s.tableData?.map((r) => [...r, ""]) || [],
      })),
    onDeleteTableCol: (id: string, colIndex: number) =>
      updateSection(id, (s) => ({
        ...s,
        tableData: s.tableData?.map((r) => r.filter((_, i) => i !== colIndex)),
      })),
    onAddMarker: (id: string) => {
      const section = lesson.sections.find((s) => s.id === id);
      if (section?.mediaUrl) {
        setAddingMarkerFor(id);
        setPreviewUrl(section.mediaUrl);
        setPreviewMarkers(section.markers || []);
        setPreviewStartTime(0);
        setPreviewOpen(true);
      }
    },
    onUpdateMarker: (id: string, markerIndex: number, marker: QuestionMarker) =>
      updateSection(id, (s) => {
        const m = (s.markers || []).map((mm, i) =>
          i === markerIndex ? marker : mm
        );
        return { ...s, markers: m };
      }),
    onDeleteMarker: (id: string, markerIndex: number) =>
      updateSection(id, (s) => ({
        ...s,
        markers: (s.markers || []).filter((_, i) => i !== markerIndex),
      })),
    onOpenPreview: (
      url: string,
      markers?: QuestionMarker[],
      startTime?: number
    ) => {
      setPreviewUrl(url);
      setPreviewMarkers(markers || []);
      setPreviewStartTime(startTime || 0);
      setPreviewOpen(true);
      setAddingMarkerFor(null);
    },
  };

  const handleDragStart = (event: DragStartEvent) =>
    setActiveSection(
      lesson.sections.find((s) => s.id === event.active.id) || null
    );
  const handleDragEnd = (event: DragEndEvent) => {
    setActiveSection(null);
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = lesson.sections.findIndex((s) => s.id === active.id);
      const newIndex = lesson.sections.findIndex((s) => s.id === over.id);

      const reordered = arrayMove(lesson.sections, oldIndex, newIndex).map(
        (s, index) => ({ ...s, order: index }) // 🔁 Cập nhật lại order
      );

      setLesson((prev) => ({ ...prev, sections: reordered }));
      console.log("🔄 Danh sách mới:", reordered);
    }
  };

  return (
    <>
      <Box sx={{ p: 4, maxWidth: 1560, mx: "auto" }}>
        <Card sx={{ p: 3 }}>
          {/* Hàng tiêu đề và nút hành động */}
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            sx={{ width: "100%", mb: 2 }}
          >
            {/* Nhóm icon quay lại + tiêu đề */}
            <Box display="flex" alignItems="center" gap={1}>
              <IconButton
                color="primary"
                onClick={() => navigate(-1)}
                sx={{
                  border: "1px solid",
                  borderColor: "divider",
                  mr: 1,
                  "&:hover": { bgcolor: "action.hover" },
                }}
              >
                <ArrowBack />
              </IconButton>
              <Typography variant="h5" fontWeight={600}>
                {lesson.title}
              </Typography>
            </Box>

            {/* Nhóm nút hành động bên phải */}
            <Box display="flex" gap={1}>
              <Button
                variant="outlined"
                startIcon={<Visibility />}
                onClick={() => setIsPreviewOpen(true)}
              >
                Xem thử
              </Button>
              <Button
                variant="contained"
                startIcon={<Save />}
                onClick={handleSave}
              >
                Lưu
              </Button>
            </Box>
          </Stack>

          {/* Phần nội dung còn lại giữ nguyên */}
          <Typography color="text.secondary" mb={2}>
            {lesson.summary}
          </Typography>

          <Tabs value={0}>
            <Tab label="Nội dung bài học" />
          </Tabs>

          <CardContent>
            <DndContext
              collisionDetection={closestCenter}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={lesson.sections.map((s) => s.id)}
                strategy={verticalListSortingStrategy}
              >
                {lesson.sections.length === 0 && (
                  <EmptyState
                    mode="empty"
                    title="Chưa có section nào"
                    description="Hãy thêm section mới để bắt đầu."
                  />
                )}
                <Box mt={3} display="flex" flexDirection="column" gap={2}>
                  {lesson.sections.map((section) => (
                    <SortableLessonSection
                      key={section.id}
                      section={section}
                      isOpen={openSections.includes(section.id)}
                      isEditing={editingTitle === section.id}
                      typeColors={typeColors}
                      {...handlers}
                    />
                  ))}
                </Box>
              </SortableContext>

              <DragOverlay
                dropAnimation={{
                  duration: 250,
                  easing: "cubic-bezier(0.18, 0.67, 0.6, 1.22)",
                }}
              >
                {activeSection ? (
                  <SortableLessonSection
                    section={activeSection}
                    isOpen={false}
                    isEditing={false}
                    typeColors={typeColors}
                    {...handlers}
                  />
                ) : null}
              </DragOverlay>
            </DndContext>

            <Box display="flex" gap={2} mt={4}>
              <Select
                size="small"
                value={newType}
                onChange={(e) =>
                  setNewType(e.target.value as LessonSection["type"])
                }
              >
                <MenuItem value="text">Lý thuyết</MenuItem>
                <MenuItem value="example">Ví dụ</MenuItem>
                <MenuItem value="error">Lỗi sai</MenuItem>
                <MenuItem value="table">Bảng</MenuItem>
                <MenuItem value="media">Media</MenuItem>
              </Select>
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={handleAddSectionByType}
              >
                Thêm phần
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Box>

      <LessonPreview
        open={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        lesson={lesson}
      />

      {/* Preview Dialog for Markers */}
      <Dialog
        open={previewOpen}
        onClose={() => {
          setPreviewOpen(false);
          setAddingMarkerFor(null);
        }}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle>
          {addingMarkerFor
            ? "Chọn thời điểm để thêm câu hỏi"
            : "Xem trước câu hỏi"}
          <IconButton
            onClick={() => {
              setPreviewOpen(false);
              setAddingMarkerFor(null);
            }}
            sx={{ position: "absolute", right: 8, top: 8 }}
          >
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent
          sx={{
            py: 2,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: 360,
          }}
        >
          {previewUrl && (
            <Box
              sx={{
                position: "relative",
                width: "100%",
                maxWidth: 920,
                minHeight: 320,
              }}
            >
              <InteractiveVideo
                videoUrl={previewUrl}
                markers={previewMarkers}
                title=""
                initialTime={previewStartTime}
              />
              {addingMarkerFor && (
                <Box sx={{ mt: 2, textAlign: "center" }}>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 1 }}
                  >
                    Click vào nút bên dưới để chọn thời điểm hiện tại của video
                  </Typography>
                  <Button
                    variant="contained"
                    onClick={() => {
                      // Request current time from InteractiveVideo via CustomEvent.
                      // Use a requestId so multiple concurrent requests can be matched.
                      const requestId = `req_${Date.now()}_${Math.random()
                        .toString(36)
                        .slice(2, 8)}`;
                      const responseEvent = "iv-current-time";

                      let to: number | null = null;
                      const onResponse = (ev: Event) => {
                        const detail = (ev as CustomEvent).detail || {};
                        if (detail.requestId !== requestId) return; // not our response
                        // Clear fallback timeout and remove listener
                        if (to) {
                          clearTimeout(to);
                          to = null;
                        }
                        window.removeEventListener(
                          responseEvent,
                          onResponse as EventListener
                        );

                        const time = detail.time;
                        if (time === null || time === undefined) {
                          console.debug(
                            "InteractiveVideo reported time not ready",
                            detail
                          );
                          toast.error("Video chưa sẵn sàng, vui lòng thử lại!");
                          return;
                        }

                        setPickedTime(time);
                        setNewMarker((prev) => ({ ...prev, time }));
                        setMarkerDialogOpen(true);
                      };

                      // Timeout fallback in case player doesn't respond
                      to = window.setTimeout(() => {
                        window.removeEventListener(
                          responseEvent,
                          onResponse as EventListener
                        );
                        console.debug(
                          "Timeout waiting for InteractiveVideo current time"
                        );
                        toast.error(
                          "Không lấy được thời điểm video. Vui lòng thử lại."
                        );
                        to = null;
                      }, 1500);

                      window.addEventListener(
                        responseEvent,
                        onResponse as EventListener
                      );
                      window.dispatchEvent(
                        new CustomEvent("iv-request-current-time", {
                          detail: { requestId },
                        })
                      );
                    }}
                  >
                    Chọn thời điểm hiện tại
                  </Button>
                </Box>
              )}
            </Box>
          )}
        </DialogContent>
      </Dialog>

      {/* Marker Input Dialog */}
      <Dialog
        open={markerDialogOpen}
        onClose={() => {
          setMarkerDialogOpen(false);
          setPickedTime(null);
        }}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          Thêm câu hỏi tại {pickedTime}s
          <IconButton
            onClick={() => {
              setMarkerDialogOpen(false);
              setPickedTime(null);
            }}
            sx={{ position: "absolute", right: 8, top: 8 }}
          >
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label="Thời điểm (giây)"
              type="number"
              value={newMarker.time}
              onChange={(e) =>
                setNewMarker((prev) => ({
                  ...prev,
                  time: Number(e.target.value),
                }))
              }
              fullWidth
            />
            <TextField
              label="Câu hỏi"
              value={newMarker.question}
              onChange={(e) =>
                setNewMarker((prev) => ({ ...prev, question: e.target.value }))
              }
              fullWidth
              multiline
              rows={2}
            />
            <TextField
              label="Đáp án A"
              value={newMarker.options[0]}
              onChange={(e) => {
                const opts = [...newMarker.options];
                opts[0] = e.target.value;
                setNewMarker((prev) => ({ ...prev, options: opts }));
              }}
              fullWidth
            />
            <TextField
              label="Đáp án B"
              value={newMarker.options[1]}
              onChange={(e) => {
                const opts = [...newMarker.options];
                opts[1] = e.target.value;
                setNewMarker((prev) => ({ ...prev, options: opts }));
              }}
              fullWidth
            />
            <TextField
              label="Đáp án C"
              value={newMarker.options[2]}
              onChange={(e) => {
                const opts = [...newMarker.options];
                opts[2] = e.target.value;
                setNewMarker((prev) => ({ ...prev, options: opts }));
              }}
              fullWidth
            />
            <TextField
              label="Đáp án D"
              value={newMarker.options[3]}
              onChange={(e) => {
                const opts = [...newMarker.options];
                opts[3] = e.target.value;
                setNewMarker((prev) => ({ ...prev, options: opts }));
              }}
              fullWidth
            />
            <TextField
              label="Đáp án đúng (0-3)"
              type="number"
              value={newMarker.correctAnswer}
              onChange={(e) =>
                setNewMarker((prev) => ({
                  ...prev,
                  correctAnswer: Number(e.target.value),
                }))
              }
              fullWidth
              inputProps={{ min: 0, max: 3 }}
            />
            <TextField
              label="Giải thích"
              value={newMarker.explanation}
              onChange={(e) =>
                setNewMarker((prev) => ({
                  ...prev,
                  explanation: e.target.value,
                }))
              }
              fullWidth
              multiline
              rows={2}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setMarkerDialogOpen(false);
              setPickedTime(null);
              // Reset new marker form
              setNewMarker({
                time: 0,
                question: "",
                options: ["", "", "", ""],
                correctAnswer: 0,
                explanation: "",
              });
            }}
          >
            Đóng
          </Button>
          <Button
            variant="contained"
            onClick={() => {
              // Validate
              const video = document.querySelector("video");
              const videoDuration = video ? video.duration : Infinity;

              if (newMarker.time < 0) {
                toast.error("Thời điểm phải lớn hơn hoặc bằng 0!");
                return;
              }
              if (
                !isNaN(videoDuration) &&
                videoDuration !== Infinity &&
                newMarker.time >= videoDuration
              ) {
                toast.error(
                  `Thời điểm phải nhỏ hơn ${Math.floor(videoDuration)}s!`
                );
                return;
              }
              if (!newMarker.question.trim()) {
                toast.error("Vui lòng nhập câu hỏi!");
                return;
              }
              const validOptions = newMarker.options.filter((opt) =>
                opt.trim()
              );
              if (validOptions.length < 2) {
                toast.error("Cần ít nhất 2 đáp án!");
                return;
              }
              if (
                newMarker.correctAnswer < 0 ||
                newMarker.correctAnswer >= newMarker.options.length
              ) {
                toast.error("Index đáp án đúng không hợp lệ!");
                return;
              }
              if (!newMarker.options[newMarker.correctAnswer]?.trim()) {
                toast.error("Đáp án đúng không được để trống!");
                return;
              }

              if (addingMarkerFor) {
                const section = lesson.sections.find(
                  (s) => s.id === addingMarkerFor
                );
                if (section) {
                  // Prevent duplicate marker times in the same section
                  const conflict = (section.markers || []).some(
                    (m) => m.time === newMarker.time
                  );
                  if (conflict) {
                    toast.error("Đã có câu hỏi ở thời điểm này!");
                    return;
                  }
                  // Update section with new marker
                  updateSection(addingMarkerFor, (s) => ({
                    ...s,
                    markers: [...(s.markers || []), newMarker],
                  }));

                  // Update preview markers to show the new question immediately
                  const updatedMarkers = [...previewMarkers, newMarker];
                  setPreviewMarkers(updatedMarkers);

                  // Update the start time to show the new marker immediately
                  setPreviewStartTime(newMarker.time);

                  // Close dialog
                  setMarkerDialogOpen(false);
                  setPickedTime(null);
                  // Close preview modal as requested
                  setPreviewOpen(false);
                  setAddingMarkerFor(null);

                  // Reset form for next question
                  setNewMarker({
                    time: 0,
                    question: "",
                    options: ["", "", "", ""],
                    correctAnswer: 0,
                    explanation: "",
                  });

                  toast.success(
                    "Đã thêm câu hỏi! Có thể tiếp tục thêm câu hỏi khác."
                  );
                }
              }
            }}
          >
            Lưu
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
