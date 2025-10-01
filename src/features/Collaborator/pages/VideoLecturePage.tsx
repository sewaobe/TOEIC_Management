import React from "react";
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  CardMedia,
  useTheme,
} from "@mui/material";

// Mock Data cho Video bài giảng
const videos = [
  {
    id: 1,
    title: "Ngữ pháp cơ bản - Thì hiện tại đơn",
    thumbnail: "https://phunugioi.com/wp-content/uploads/2021/08/Anh-Nhat-Ban.jpg",
    duration: "12:30",
  },
  {
    id: 2,
    title: "Từ vựng TOEIC chủ đề Văn phòng",
    thumbnail: "https://phunugioi.com/wp-content/uploads/2021/08/Anh-Nhat-Ban.jpg",
    duration: "15:45",
  },
  {
    id: 3,
    title: "Chiến lược làm Part 5 hiệu quả",
    thumbnail: "https://phunugioi.com/wp-content/uploads/2021/08/Anh-Nhat-Ban.jpg",
    duration: "10:20",
  },
];

const VideoLecturePage = () => {
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
        Video bài giảng
      </Typography>

      <Grid container spacing={3}>
        {videos.map((video) => (
          <Grid key={video.id} size={{ xs: 12, md: 6, lg: 4 }}>
            <Card
              sx={{
                borderRadius: 2,
                bgcolor: theme.palette.background.paper,
                boxShadow: 2,
              }}
            >
              <CardMedia
                component="img"
                height="200"
                image={video.thumbnail}
                alt={video.title}
              />
              <CardContent>
                <Typography
                  variant="subtitle1"
                  sx={{ fontWeight: 600, color: theme.palette.text.primary }}
                >
                  {video.title}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: theme.palette.text.secondary }}
                >
                  Thời lượng: {video.duration}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default VideoLecturePage;
