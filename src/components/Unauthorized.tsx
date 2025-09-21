import React from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Paper,
  useTheme,
} from '@mui/material';
import {
  Home as HomeIcon,
  ArrowBack as ArrowBackIcon,
  Lock as LockIcon,
  ExitToApp as LogoutIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { logout } from '../stores/userSlice';
import { AppDispatch } from '../stores/store';

const MotionBox = motion(Box);
const MotionPaper = motion(Paper);

const Unauthorized = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const theme = useTheme();

  const handleGoHome = () => {
    navigate('/home');
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/auth');
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 2,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background Animation Elements */}
      <MotionBox
        sx={{
          position: 'absolute',
          top: '15%',
          left: '15%',
          width: 120,
          height: 120,
          borderRadius: '50%',
          background: 'rgba(255, 255, 255, 0.1)',
        }}
        animate={{
          y: [0, -25, 0],
          scale: [1, 1.15, 1],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      <MotionBox
        sx={{
          position: 'absolute',
          top: '70%',
          right: '10%',
          width: 80,
          height: 80,
          borderRadius: '50%',
          background: 'rgba(255, 255, 255, 0.08)',
        }}
        animate={{
          y: [0, 20, 0],
          x: [0, -15, 0],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      <Container maxWidth="md">
        <MotionPaper
          elevation={24}
          sx={{
            padding: { xs: 3, md: 4 },   // giảm padding
            borderRadius: 3,
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(15px)',
            textAlign: 'center',
            position: 'relative',
            overflow: 'hidden',
          }}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          {/* Lock Icon */}
          <MotionBox
            sx={{ mb: 2 }}
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.3, duration: 0.8, type: 'spring' }}
          >
            <LockIcon
              sx={{
                fontSize: { xs: 60, md: 80 },   // nhỏ hơn
                color: '#ff6b6b',
                filter: 'drop-shadow(0 3px 6px rgba(0,0,0,0.1))',
              }}
            />
          </MotionBox>

          {/* 401 Text */}
          <Typography
            variant="h1"
            sx={{
              fontSize: { xs: '3rem', md: '4rem' }, // nhỏ hơn
              fontWeight: 'bold',
              background: 'linear-gradient(45deg, #ff6b6b, #ee5a24)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mb: 1.5,
            }}
          >
            401
          </Typography>

          {/* Error Message */}
          <Typography
            variant="h5"
            sx={{
              fontWeight: 'bold',
              color: theme.palette.text.primary,
              mb: 1.5,
              fontSize: { xs: '1.2rem', md: '1.5rem' }, // nhỏ hơn
            }}
          >
            Access Denied
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: theme.palette.text.secondary,
              mb: 3,
              maxWidth: 500,
              mx: 'auto',
              lineHeight: 1.5,
              fontSize: { xs: '0.9rem', md: '1rem' }, // nhỏ hơn
            }}
          >
            You don't have permission to access this resource.
            Please contact your administrator or try logging in with a different account.
          </Typography>

          {/* Action Buttons */}
          <MotionBox
            sx={{ display: 'flex', gap: 1.5, justifyContent: 'center', flexWrap: 'wrap' }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.6 }}
          >
            <Button
              variant="contained"
              size="medium"
              startIcon={<HomeIcon />}
              onClick={handleGoHome}
              sx={{
                px: 3,
                py: 1,
                borderRadius: 2,
                fontSize: '1rem',  // nhỏ hơn
                fontWeight: 'bold',
              }}
            >
              Go Home
            </Button>
            <Button
              variant="outlined"
              size="medium"
              startIcon={<ArrowBackIcon />}
              onClick={handleGoBack}
              sx={{
                px: 3,
                py: 1,
                borderRadius: 2,
                fontSize: '1rem',
              }}
            >
              Go Back
            </Button>
            <Button
              variant="text"
              size="medium"
              startIcon={<LogoutIcon />}
              onClick={handleLogout}
              sx={{
                px: 3,
                py: 1,
                borderRadius: 2,
                fontSize: '1rem',
              }}
            >
              Logout
            </Button>
          </MotionBox>
        </MotionPaper>
      </Container>
    </Box>
  );
};

export default Unauthorized;
