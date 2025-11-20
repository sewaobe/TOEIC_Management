import {
  Card,
  CardContent,
  Typography,
  Box,
  IconButton,
  Chip,
  Avatar,
} from "@mui/material";
import { Edit, Delete, Visibility } from "@mui/icons-material";
import { PracticeTopicVocabulary } from "../../../../types/PracticeVocabulary";
import { motion } from "framer-motion";

interface PracticeTopicCardProps {
  topic: PracticeTopicVocabulary;
  onView: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function PracticeTopicCard({
  topic,
  onView,
  onEdit,
  onDelete,
}: PracticeTopicCardProps) {
  const wordCount = Array.isArray(topic.vocabulary_words)
    ? topic.vocabulary_words.length
    : 0;

  return (
    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
      <Card
        sx={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          borderRadius: 3,
          boxShadow: 2,
          transition: "all 0.3s",
          "&:hover": {
            boxShadow: 6,
          },
        }}
      >
        <Box
          sx={{
            height: 120,
            background: `linear-gradient(135deg, ${
              topic.bgColor || "#3b82f6"
            } 0%, ${topic.bgColor || "#2563eb"} 100%)`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
          }}
        >
          <Avatar
            sx={{
              width: 60,
              height: 60,
              bgcolor: "rgba(255,255,255,0.2)",
              fontSize: 32,
            }}
          >
            {topic.iconName || "📚"}
          </Avatar>
          <Chip
            label={topic.level}
            size="small"
            sx={{
              position: "absolute",
              top: 10,
              right: 10,
              bgcolor: "rgba(255,255,255,0.9)",
              fontWeight: 600,
            }}
          />
        </Box>

        <CardContent sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            {topic.title}
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mb: 2, flex: 1 }}
          >
            {topic.description || "Không có mô tả"}
          </Typography>

          <Box sx={{ display: "flex", gap: 1, mb: 2, flexWrap: "wrap" }}>
            {topic.tags?.slice(0, 3).map((tag, i) => (
              <Chip key={i} label={tag} size="small" variant="outlined" />
            ))}
          </Box>

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography variant="body2" color="text.secondary">
              {wordCount} từ vựng
            </Typography>
            <Box>
              <IconButton
                size="small"
                color="primary"
                onClick={() => onView(topic._id!)}
              >
                <Visibility />
              </IconButton>
              <IconButton
                size="small"
                color="info"
                onClick={() => onEdit(topic._id!)}
              >
                <Edit />
              </IconButton>
              <IconButton
                size="small"
                color="error"
                onClick={() => onDelete(topic._id!)}
              >
                <Delete />
              </IconButton>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </motion.div>
  );
}
