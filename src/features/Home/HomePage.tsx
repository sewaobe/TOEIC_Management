import React from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Paper,
  Grid,
  Card,
  CardContent,
  Avatar,
} from '@mui/material';
import {
  ExitToApp as LogoutIcon,
  Person as PersonIcon,
  School as SchoolIcon,
  Assessment as AssessmentIcon,
} from '@mui/icons-material';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../stores/store';
import { logout } from '../../stores/userSlice';
import authService from '../../services/auth.service';
import { useNavigate } from 'react-router-dom';
import { FadeUp } from '../../components/animations/motionWrappers';

const HomePage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useSelector((state: RootState) => state.user);

  const handleLogout = async () => {
    try {
      await authService.logout();
      dispatch(logout());
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
      // Force logout even if API call fails
      dispatch(logout());
      navigate('/');
    }
  };

  if (!isAuthenticated || !user) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Typography variant="h6">Đang tải...</Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        py: 4,
      }}
    >
      <Container maxWidth="lg">
        <FadeUp>
          {/* Header */}
          <Paper
            elevation={8}
            sx={{
              p: 3,
              mb: 4,
              borderRadius: 3,
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(10px)',
            }}
          >
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              flexWrap="wrap"
              gap={2}
            >
              <Box display="flex" alignItems="center" gap={2}>
                <Avatar
                  sx={{
                    width: 60,
                    height: 60,
                    background: 'linear-gradient(45deg, #2563EB, #7C3AED)',
                  }}
                >
                  <PersonIcon fontSize="large" />
                </Avatar>
                <Box>
                  <Typography variant="h4" fontWeight="bold" color="primary">
                    Chào mừng, {user.fullname || user.username}!
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    @{user.username} • {user.email}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Vai trò: {user.role_name || 'Người dùng'}
                  </Typography>
                </Box>
              </Box>
              <Button
                variant="outlined"
                color="error"
                startIcon={<LogoutIcon />}
                onClick={handleLogout}
                sx={{
                  borderRadius: 2,
                  px: 3,
                  py: 1,
                }}
              >
                Đăng xuất
              </Button>
            </Box>
          </Paper>

          {/* Dashboard Cards */}
          <Grid container spacing={3}>
            <Grid item xs={12} md={6} lg={4}>
              <Card
                elevation={8}
                sx={{
                  height: '100%',
                  background: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: 3,
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                  },
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box display="flex" alignItems="center" gap={2} mb={2}>
                    <Avatar
                      sx={{
                        background: 'linear-gradient(45deg, #10B981, #059669)',
                      }}
                    >
                      <SchoolIcon />
                    </Avatar>
                    <Typography variant="h6" fontWeight="bold">
                      Học TOEIC
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary" mb={2}>
                    Bắt đầu hành trình học TOEIC với các bài học được thiết kế chuyên nghiệp
                  </Typography>
                  <Button
                    variant="contained"
                    fullWidth
                    sx={{
                      background: 'linear-gradient(45deg, #10B981, #059669)',
                      '&:hover': {
                        background: 'linear-gradient(45deg, #059669, #047857)',
                      },
                    }}
                  >
                    Bắt đầu học
                  </Button>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6} lg={4}>
              <Card
                elevation={8}
                sx={{
                  height: '100%',
                  background: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: 3,
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                  },
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box display="flex" alignItems="center" gap={2} mb={2}>
                    <Avatar
                      sx={{
                        background: 'linear-gradient(45deg, #F97316, #EA580C)',
                      }}
                    >
                      <AssessmentIcon />
                    </Avatar>
                    <Typography variant="h6" fontWeight="bold">
                      Luyện thi
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary" mb={2}>
                    Thực hành với các đề thi thử TOEIC để cải thiện kỹ năng và điểm số
                  </Typography>
                  <Button
                    variant="contained"
                    fullWidth
                    sx={{
                      background: 'linear-gradient(45deg, #F97316, #EA580C)',
                      '&:hover': {
                        background: 'linear-gradient(45deg, #EA580C, #DC2626)',
                      },
                    }}
                  >
                    Làm bài thi
                  </Button>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6} lg={4}>
              <Card
                elevation={8}
                sx={{
                  height: '100%',
                  background: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: 3,
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                  },
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box display="flex" alignItems="center" gap={2} mb={2}>
                    <Avatar
                      sx={{
                        background: 'linear-gradient(45deg, #7C3AED, #5B21B6)',
                      }}
                    >
                      <PersonIcon />
                    </Avatar>
                    <Typography variant="h6" fontWeight="bold">
                      Hồ sơ cá nhân
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary" mb={2}>
                    Quản lý thông tin cá nhân và theo dõi tiến độ học tập của bạn
                  </Typography>
                  <Button
                    variant="contained"
                    fullWidth
                    sx={{
                      background: 'linear-gradient(45deg, #7C3AED, #5B21B6)',
                      '&:hover': {
                        background: 'linear-gradient(45deg, #5B21B6, #4C1D95)',
                      },
                    }}
                  >
                    Xem hồ sơ
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Welcome Message */}
          <Paper
            elevation={8}
            sx={{
              p: 4,
              mt: 4,
              borderRadius: 3,
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(10px)',
              textAlign: 'center',
            }}
          >
            <Typography variant="h5" fontWeight="bold" color="primary" mb={2}>
              🎉 Chúc mừng bạn đã đăng nhập thành công!
            </Typography>
            <Typography variant="body1" color="text.secondary" mb={2}>
              Hệ thống quản lý TOEIC đã sẵn sàng giúp bạn chinh phục mục tiêu điểm số mong muốn.
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Hãy bắt đầu hành trình học tập của bạn ngay hôm nay!
            </Typography>
          </Paper>
        </FadeUp>
      </Container>
    </Box>
  );
};

export default HomePage;
