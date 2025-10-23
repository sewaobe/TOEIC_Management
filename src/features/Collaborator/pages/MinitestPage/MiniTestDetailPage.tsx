import { useEffect, useState } from "react";
import {
  Box,
  CircularProgress,
  Typography,
  Paper,
  Button,
  Chip,
  Divider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  useTheme,
} from "@mui/material";
import {
  ArrowBack,
  Edit,
  Delete,
  ExpandMore,
  AccessTime,
  Layers,
  TextSnippet,
  Translate,
  VolumeUp,
  Image as ImageIcon,
  PlayCircleFilledWhite,
} from "@mui/icons-material";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import miniTestService from "./services/miniTest.service";

/* ────────────────────────────────
   TRANG CHI TIẾT MINI TEST (CÓ MEDIA)
──────────────────────────────── */
export default function MiniTestDetailPage() {
  const { id } = useParams<{ id: string }>();
  const theme = useTheme();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [miniTest, setMiniTest] = useState<any | null>(null);

  // 🌀 Load dữ liệu mini test
  useEffect(() => {
    const fetchMiniTest = async () => {
      try {
        const res = await miniTestService.getById(`${id}?full=true`);
        setMiniTest(res.data);
      } catch {
        toast.error("Không tải được dữ liệu mini test!");
      } finally {
        setLoading(false);
      }
    };
    fetchMiniTest();
  }, [id]);

  if (loading)
    return (
      <Box className="flex flex-col items-center justify-center h-[80vh] gap-4">
        <CircularProgress />
        <Typography color="text.secondary">Đang tải dữ liệu...</Typography>
      </Box>
    );

  if (!miniTest)
    return (
      <Typography align="center" color="text.secondary" mt={4}>
        Không tìm thấy Mini Test
      </Typography>
    );

  // 🗑️ Xóa mini test
  const handleDelete = async () => {
    if (!confirm("Xác nhận xóa Mini Test này?")) return;
    try {
      await miniTestService.delete(miniTest._id);
      toast.success("Mini Test đã được xóa!");
      navigate(-1);
    } catch {
      toast.error("Không thể xóa Mini Test!");
    }
  };

  // 🧩 Gom group theo Part
  const groupsByPart: Record<number, any[]> = {};
  (miniTest.groups || miniTest.group_ids || []).forEach((g: any) => {
    const part = g.part || 1;
    if (!groupsByPart[part]) groupsByPart[part] = [];
    groupsByPart[part].push(g);
  });
  const parts = Object.keys(groupsByPart).map(Number).sort((a, b) => a - b);

  // 🌈 Theme color
  const bgCard = theme.palette.mode === "light" ? "#ffffff" : theme.palette.background.paper;
  const bgTranscript =
    theme.palette.mode === "light" ? "#EFF6FF" : theme.palette.info.light + "33";
  const bgTranslation =
    theme.palette.mode === "light" ? "#ECFDF5" : theme.palette.success.light + "33";
  const bgQuestion =
    theme.palette.mode === "light" ? "#fafafa" : theme.palette.background.default;

  return (
    <Box className="p-4 md:p-8 max-w-6xl mx-auto">
      {/* 🟦 Header */}
      <Paper
        sx={{
          p: 2,
          mb: 4,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderRadius: 2,
          boxShadow: 3,
          background: `linear-gradient(to right, ${theme.palette.primary.light}, ${theme.palette.secondary.light})`,
          color: theme.palette.getContrastText(theme.palette.primary.light),
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Button variant="outlined" startIcon={<ArrowBack />} onClick={() => navigate(-1)}>
            Quay lại
          </Button>
          <Typography variant="h5" fontWeight="bold">
            Chi tiết Mini Test
          </Typography>
        </Box>

        <Box sx={{ display: "flex", gap: 1 }}>
          <Button
            variant="outlined"
            color="primary"
            startIcon={<Edit />}
            onClick={() => navigate(`/ctv/minitests/edit/${miniTest._id}`)}
          >
            Sửa
          </Button>
          <Button
            variant="contained"
            color="error"
            startIcon={<Delete />}
            onClick={handleDelete}
          >
            Xóa
          </Button>
        </Box>
      </Paper>

      {/* 🧾 Thông tin Mini Test */}
      <Paper sx={{ p: 4, mb: 4, borderRadius: 2, boxShadow: 2, bgcolor: bgCard }}>
        <Typography variant="h5" color="primary" fontWeight="bold">
          {miniTest.title}
        </Typography>
        <Divider sx={{ my: 2 }} />

        <Box display="grid" gridTemplateColumns={{ xs: "1fr", md: "1fr 1fr" }} gap={3}>
          <Box>
            <InfoRow icon={<Layers color="primary" />} label="Loại bài test" value={miniTest.type || "Mini Test"} />
            <InfoRow
              icon={<AccessTime color="primary" />}
              label="Thời gian dự kiến"
              value={miniTest.planned_completion_time ? `${miniTest.planned_completion_time} phút` : "—"}
            />
            <InfoRow label="Trạng thái" value={miniTest.status === "draft" ? "Nháp" : "Công khai"} />
          </Box>

          <Box>
            <InfoRow label="Tổng số Part" value={parts.length.toString()} />
            <InfoRow label="Tổng số nhóm" value={(miniTest.groups?.length || 0).toString()} />
            <Typography variant="body2" color="text.secondary" mt={1}>
              Chủ đề:
            </Typography>
            {miniTest.topic ? (
              <Chip label={miniTest.topic} color="primary" variant="outlined" sx={{ fontWeight: 500 }} />
            ) : (
              <Typography variant="body2" color="text.disabled">
                Không có chủ đề
              </Typography>
            )}
          </Box>
        </Box>
      </Paper>

      {/* 🧩 Accordion Part → Group → Question */}
      <Paper sx={{ p: 3, borderRadius: 2, boxShadow: 1, bgcolor: bgCard }}>
        <Typography variant="h6" color="primary" fontWeight="bold" mb={2}>
          Danh sách nhóm câu hỏi
        </Typography>

        {parts.length ? (
          parts.map((part) => (
            <Accordion key={part} defaultExpanded={part === parts[0]} sx={{ mb: 1.5 }}>
              <AccordionSummary expandIcon={<ExpandMore />}>
                <Typography fontWeight="bold" color="primary">
                  Part {part} — {groupsByPart[part].length} nhóm,{" "}
                  {groupsByPart[part].reduce((sum, g) => sum + (g.questions?.length || 0), 0)} câu
                </Typography>
              </AccordionSummary>

              <AccordionDetails>
                {groupsByPart[part].map((g, gi) => (
                  <Accordion key={gi} defaultExpanded sx={{ mb: 1 }}>
                    <AccordionSummary expandIcon={<ExpandMore />}>
                      <Typography fontWeight="bold">
                        Nhóm {gi + 1} — {g.questions?.length || 0} câu
                      </Typography>
                    </AccordionSummary>

                    <AccordionDetails>
                      {/* 🎧 / 🖼️ / 🎥 Media */}
                      {(g.audioUrl || g.imagesUrl?.length || g.videosUrl?.length) && (
                        <Box mb={2}>
                          {g.audioUrl && (
                            <Box mb={2}>
                              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                                <VolumeUp color="primary" fontSize="small" />
                                <Typography fontWeight="bold">Audio:</Typography>
                              </Box>
                              <audio controls src={g.audioUrl.url} style={{ width: "100%" }} />
                            </Box>
                          )}

                          {g.imagesUrl?.length > 0 && (
                            <Box mb={2}>
                              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                                <ImageIcon color="primary" fontSize="small" />
                                <Typography fontWeight="bold">Hình ảnh:</Typography>
                              </Box>
                              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                                {g.imagesUrl.map((img: any, i: number) => (
                                  <img
                                    key={i}
                                    src={img.url}
                                    alt={`Group ${gi + 1} - ${i}`}
                                    style={{
                                      width: "180px",
                                      height: "140px",
                                      objectFit: "cover",
                                      borderRadius: 8,
                                      border: `1px solid ${theme.palette.divider}`,
                                    }}
                                  />
                                ))}
                              </Box>
                            </Box>
                          )}

                          {g.videosUrl?.length > 0 && (
                            <Box>
                              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                                <PlayCircleFilledWhite color="secondary" fontSize="small" />
                                <Typography fontWeight="bold">Video:</Typography>
                              </Box>
                              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
                                {g.videosUrl.map((vid: any, i: number) => (
                                  <video
                                    key={i}
                                    controls
                                    src={vid.url}
                                    style={{
                                      width: "320px",
                                      height: "180px",
                                      borderRadius: 8,
                                      border: `1px solid ${theme.palette.divider}`,
                                    }}
                                  />
                                ))}
                              </Box>
                            </Box>
                          )}
                        </Box>
                      )}

                      {/* 🗒️ Transcript */}
                      {(g.transcriptEnglish || g.transcriptTranslation) && (
                        <Box mb={2}>
                          {g.transcriptEnglish && (
                            <Box sx={{ bgcolor: bgTranscript, p: 2, borderRadius: 1, mb: 1 }}>
                              <TextSnippet fontSize="small" color="primary" sx={{ mr: 1 }} />
                              <Typography variant="body2" sx={{ whiteSpace: "pre-wrap", display: "inline" }}>
                                {g.transcriptEnglish}
                              </Typography>
                            </Box>
                          )}
                          {g.transcriptTranslation && (
                            <Box sx={{ bgcolor: bgTranslation, p: 2, borderRadius: 1 }}>
                              <Translate fontSize="small" color="success" sx={{ mr: 1 }} />
                              <Typography variant="body2" sx={{ whiteSpace: "pre-wrap", display: "inline" }}>
                                {g.transcriptTranslation}
                              </Typography>
                            </Box>
                          )}
                        </Box>
                      )}

                      {/* 🧾 Câu hỏi */}
                      {g.questions?.map((q: any, qi: number) => (
                        <Box
                          key={qi}
                          sx={{
                            p: 2,
                            borderRadius: 2,
                            border: `1px solid ${theme.palette.divider}`,
                            mb: 1.5,
                            bgcolor: bgQuestion,
                          }}
                        >
                          <Typography fontWeight="bold" mb={0.5}>
                            Câu {qi + 1}: {q.textQuestion || "—"}
                          </Typography>
                          <Box display="grid" gridTemplateColumns="repeat(2, 1fr)" gap={1}>
                            {Object.keys(q.choices || {}).map((opt) => (
                              <Typography
                                key={opt}
                                variant="body2"
                                color={q.correctAnswer === opt ? "primary" : "text.secondary"}
                                fontWeight={q.correctAnswer === opt ? 700 : 400}
                              >
                                {opt}. {q.choices?.[opt] || ""}
                              </Typography>
                            ))}
                          </Box>
                          {q.explanation && (
                            <Typography variant="body2" color="text.secondary" mt={1}>
                              <strong>Giải thích:</strong> {q.explanation}
                            </Typography>
                          )}
                        </Box>
                      ))}
                    </AccordionDetails>
                  </Accordion>
                ))}
              </AccordionDetails>
            </Accordion>
          ))
        ) : (
          <Typography color="text.secondary">Chưa có nhóm nào.</Typography>
        )}
      </Paper>
    </Box>
  );
}

/* ────────────────────────────────
   COMPONENT PHỤ DÙNG LẠI
──────────────────────────────── */
function InfoRow({
  icon,
  label,
  value,
}: {
  icon?: React.ReactNode;
  label: string;
  value?: string;
}) {
  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
      {icon}
      <Typography variant="body2" color="text.secondary">
        {label}:
      </Typography>
      <Typography variant="body2" fontWeight="bold">
        {value || "—"}
      </Typography>
    </Box>
  );
}
