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
import MicIcon from "@mui/icons-material/Mic";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { motion, AnimatePresence } from "framer-motion";
import { EmptyState } from "../../../../../../components/EmptyState";
import ShadowingDetailDialog from "../detail/ShadowingDetailDialog";

export default function TabShadowing({ lessonManager }: { lessonManager: any }) {
  const theme = useTheme();
  const [expanded, setExpanded] = useState<string | null>(null);
  const [selectedShadowing, setSelectedShadowing] = useState<any | null>(null);

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
          {lessonManager.shadowing_ids?.length ? (
            lessonManager.shadowing_ids.map((s: any) => (
              <Card
                key={s._id}
                sx={{
                  borderRadius: 3,
                  boxShadow: theme.shadows[1],
                  overflow: "hidden",
                  mb: 2,
                  bgcolor: theme.palette.background.paper,
                  border: `1px solid ${theme.palette.divider}`,
                  transition: "box-shadow 0.3s ease",
                  "&:hover": { boxShadow: theme.shadows[3] },
                }}
              >
                {/* Header */}
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    p: 2.5,
                    borderBottom: `1px solid ${theme.palette.divider}`,
                    bgcolor: theme.palette.background.paper,
                    cursor: "pointer",
                    transition: "background 0.25s",
                    "&:hover": {
                      bgcolor:
                        theme.palette.mode === "dark"
                          ? "rgba(255,255,255,0.05)"
                          : "rgba(0,0,0,0.03)",
                    },
                  }}
                  onClick={() => toggleExpand(s._id)}
                >
                  {/* Icon + Info */}
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <MicIcon color="secondary" />
                    <Box>
                      <Typography variant="subtitle1" fontWeight={600}>
                        {s.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        💬 Level {s.level} • ⏱ {s.duration || 0}s • Part{" "}
                        {s.part_type}
                      </Typography>
                    </Box>
                  </Box>

                  {/* Nút xem chi tiết + mũi tên */}
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<VisibilityIcon />}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedShadowing(s);
                      }}
                    >
                      Xem chi tiết
                    </Button>
                    <ExpandMoreIcon
                      sx={{
                        transform:
                          expanded === s._id ? "rotate(180deg)" : "rotate(0deg)",
                        transition: "transform 0.3s",
                        color: theme.palette.text.secondary,
                      }}
                    />
                  </Box>
                </Box>

                {/* Collapse content */}
                <Collapse in={expanded === s._id} timeout="auto" unmountOnExit>
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
                    {s.audio_url ? (
                      <audio controls style={{ width: "100%", marginTop: 4 }}>
                        <source src={s.audio_url} type="audio/mpeg" />
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
                        {s.transcript?.slice(0, 120) +
                          (s.transcript?.length > 120 ? "..." : "")}
                      </Typography>
                    </Box>
                  </CardContent>
                </Collapse>
              </Card>
            ))
          ) : (
            <EmptyState
              mode="empty"
              title="Không có shadowing"
              description="Hiện không có bài luyện nói nào."
            />
          )}
        </motion.div>
      </AnimatePresence>

      {/* Modal chi tiết */}
      {selectedShadowing && (
        <ShadowingDetailDialog
          open={!!selectedShadowing}
          onClose={() => setSelectedShadowing(null)}
          shadowing={selectedShadowing}
        />
      )}
    </>
  );
}
