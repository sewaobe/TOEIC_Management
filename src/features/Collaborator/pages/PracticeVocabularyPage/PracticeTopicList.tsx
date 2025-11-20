import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Chip,
  Box,
  Typography,
  Pagination,
} from "@mui/material";
import { Visibility, Edit, Delete } from "@mui/icons-material";
import { PracticeTopicVocabulary } from "../../../../types/PracticeVocabulary";

interface PracticeTopicListProps {
  topics: PracticeTopicVocabulary[];
  page: number;
  pageCount: number;
  onPageChange: (page: number) => void;
  onView: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function PracticeTopicList({
  topics,
  page,
  pageCount,
  onPageChange,
  onView,
  onEdit,
  onDelete,
}: PracticeTopicListProps) {
  return (
    <Box>
      <Paper sx={{ width: "100%", overflow: "hidden" }}>
        <TableContainer sx={{ maxWidth: "100%", overflowX: "auto" }}>
          <Table sx={{ minWidth: 800 }}>
            <TableHead>
              <TableRow>
                <TableCell>Tiêu đề</TableCell>
                <TableCell>Mô tả</TableCell>
                <TableCell>Cấp độ</TableCell>
                <TableCell>Tags</TableCell>
                <TableCell>Số từ vựng</TableCell>
                <TableCell align="right">Thao tác</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {topics.map((topic) => {
                const vocabularyCount = Array.isArray(topic.vocabulary_words)
                  ? topic.vocabulary_words.length
                  : 0;

                return (
                  <TableRow
                    key={topic._id}
                    hover
                    sx={{ cursor: "pointer" }}
                    onClick={() => onView(topic._id!)}
                  >
                    <TableCell sx={{ width: 240 }}>
                      <Typography variant="body2" fontWeight="bold">
                        {topic.title}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ maxWidth: 400 }}>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                        }}
                      >
                        {topic.description || "-"}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={topic.level || "A1"}
                        size="small"
                        color="primary"
                      />
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                        {topic.tags && topic.tags.length > 0 ? (
                          <>
                            {topic.tags.slice(0, 2).map((tag, i) => (
                              <Chip
                                key={i}
                                label={tag}
                                size="small"
                                variant="outlined"
                              />
                            ))}
                            {topic.tags.length > 2 && (
                              <Chip
                                label={`+${topic.tags.length - 2}`}
                                size="small"
                                variant="outlined"
                              />
                            )}
                          </>
                        ) : (
                          <Typography variant="caption" color="text.secondary">
                            -
                          </Typography>
                        )}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip label={vocabularyCount} size="small" />
                    </TableCell>
                    <TableCell align="right">
                      <IconButton
                        size="small"
                        color="primary"
                        onClick={(e) => {
                          e.stopPropagation();
                          onView(topic._id!);
                        }}
                      >
                        <Visibility />
                      </IconButton>
                      <IconButton
                        size="small"
                        color="info"
                        onClick={(e) => {
                          e.stopPropagation();
                          onEdit(topic._id!);
                        }}
                      >
                        <Edit />
                      </IconButton>
                      <IconButton
                        size="small"
                        color="error"
                        onClick={(e) => {
                          e.stopPropagation();
                          onDelete(topic._id!);
                        }}
                      >
                        <Delete />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Pagination */}
      {pageCount > 1 && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
          <Pagination
            count={pageCount}
            page={page}
            onChange={(_, p) => onPageChange(p)}
            color="primary"
            shape="rounded"
            siblingCount={1}
            size="medium"
          />
        </Box>
      )}
    </Box>
  );
}
