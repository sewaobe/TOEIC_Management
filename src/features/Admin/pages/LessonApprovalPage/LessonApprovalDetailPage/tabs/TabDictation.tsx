import { useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Collapse,
  Button,
  useTheme,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import HeadphonesIcon from "@mui/icons-material/Headphones";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { motion, AnimatePresence } from "framer-motion";
import { EmptyState } from "../../../../../../components/EmptyState";
import DictationDetailDialog from "../detail/DictationDetailDialog";

export default function TabDictation({ lessonManager }: { lessonManager: any }) {
  const theme = useTheme();
  const [expanded, setExpanded] = useState<string | null>(null);
  const [selectedDictation, setSelectedDictation] = useState<any | null>(null);

  const toggleExpand = (id: string) => {
    setExpanded(expanded === id ? null : id);
  };

  const fade = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.3 },
  };

  return (
    <>
      <AnimatePresence>
        <motion.div {...fade}>
          {lessonManager.dictation_ids?.length ? (
            lessonManager.dictation_ids.map((d: any) => (
              <Card
                key={d._id}
                sx={{
                  borderRadius: 3,
                  boxShadow: theme.shadows[1],
                  mb: 2,
                  overflow: "hidden",
                  bgcolor: theme.palette.background.paper,
                }}
              >
                {/* Header */}
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    p: 2.5,
                    bgcolor: theme.palette.background.paper,
                    borderBottom: `1px solid ${theme.palette.divider}`,
                    cursor: "pointer",
                    transition: "background 0.25s",
                    "&:hover": {
                      bgcolor:
                        theme.palette.mode === "dark"
                          ? "rgba(255,255,255,0.05)"
                          : "rgba(0,0,0,0.04)",
                    },
                  }}
                  onClick={() => toggleExpand(d._id)}
                >
                  {/* Icon + Info */}
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <HeadphonesIcon color="primary" />
                    <Box>
                      <Typography variant="subtitle1" fontWeight={600}>
                        {d.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        🧠 Level {d.level} • ⏱ {d.duration || 0}s • Part{" "}
                        {d.part_type}
                      </Typography>
                    </Box>
                  </Box>

                  {/* Nút xem chi tiết + mũi tên */}
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<VisibilityIcon />}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedDictation(d);
                      }}
                    >
                      Xem chi tiết
                    </Button>
                    <ExpandMoreIcon
                      sx={{
                        transform:
                          expanded === d._id ? "rotate(180deg)" : "rotate(0deg)",
                        transition: "transform 0.3s",
                        color: theme.palette.text.secondary,
                      }}
                    />
                  </Box>
                </Box>

                {/* Collapse content */}
                <Collapse in={expanded === d._id} timeout="auto" unmountOnExit>
                  <CardContent
                    sx={{
                      bgcolor:
                        theme.palette.mode === "dark"
                          ? "rgba(255,255,255,0.04)"
                          : theme.palette.grey[50],
                      borderTop: `1px solid ${theme.palette.divider}`,
                      p: 3,
                    }}
                  >
                    {d.audio_url ? (
                      <audio controls style={{ width: "100%", marginTop: 4 }}>
                        <source src={d.audio_url} type="audio/mpeg" />
                      </audio>
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        Không có audio
                      </Typography>
                    )}

                    <Box
                      sx={{
                        bgcolor: theme.palette.background.paper,
                        borderRadius: 2,
                        border: `1px solid ${theme.palette.divider}`,
                        p: 2,
                        mt: 2,
                      }}
                    >
                      <Typography variant="subtitle2" fontWeight={600}>
                        Transcript:
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          whiteSpace: "pre-line",
                          lineHeight: 1.6,
                        }}
                      >
                        {d.transcript?.slice(0, 120) +
                          (d.transcript?.length > 120 ? "..." : "")}
                      </Typography>
                    </Box>
                  </CardContent>
                </Collapse>
              </Card>
            ))
          ) : (
            <EmptyState
              mode="empty"
              title="Không có dictation"
              description="Hiện không có bài nghe nào."
            />
          )}
        </motion.div>
      </AnimatePresence>

      {/* Modal chi tiết */}
      {selectedDictation && (
        <DictationDetailDialog
          open={!!selectedDictation}
          onClose={() => setSelectedDictation(null)}
          dictation={selectedDictation}
        />
      )}
    </>
  );
}
