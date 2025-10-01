import React from "react";
import {
  Box,
  Typography,
  Paper,
  Grid,
  List,
  ListItem,
  ListItemText,
  useTheme,
} from "@mui/material";

// Mock Data cho Từ vựng
const vocabulary = [
  { id: 1, word: "Agreement", meaning: "Hợp đồng, thỏa thuận" },
  { id: 2, word: "Candidate", meaning: "Ứng viên" },
  { id: 3, word: "Delivery", meaning: "Sự giao hàng" },
  { id: 4, word: "Expense", meaning: "Chi phí" },
  { id: 5, word: "Guarantee", meaning: "Bảo đảm" },
];

const VocabularyPage = () => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        p: 3,
        width: "100%",
        height: "100%",
        bgcolor: theme.palette.background.default,
        overflow: "auto",
      }}
    >
      <Typography
        variant="h5"
        component="h1"
        sx={{ fontWeight: "bold", color: theme.palette.text.primary, mb: 3 }}
      >
        Từ vựng
      </Typography>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12 }}>
          <Paper
            sx={{
              p: 3,
              borderRadius: 2,
              bgcolor: theme.palette.background.paper,
              boxShadow: 2,
            }}
          >
            <Typography
              variant="h6"
              sx={{ fontWeight: 600, color: theme.palette.text.primary, mb: 2 }}
            >
              Danh sách từ vựng
            </Typography>
            <List>
              {vocabulary.map((item) => (
                <ListItem key={item.id} divider>
                  <ListItemText
                    primary={
                      <Typography
                        sx={{
                          fontWeight: 600,
                          color: theme.palette.text.primary,
                        }}
                      >
                        {item.word}
                      </Typography>
                    }
                    secondary={
                      <Typography sx={{ color: theme.palette.text.secondary }}>
                        {item.meaning}
                      </Typography>
                    }
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default VocabularyPage;
