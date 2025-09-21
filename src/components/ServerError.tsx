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
  Refresh as RefreshIcon,
  BugReport as BugIcon,
  ContactSupport as ContactIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const MotionBox = motion(Box);
const MotionPaper = motion(Paper);

const ServerError = () => {
  const navigate = useNavigate();
  const theme = useTheme();

  const handleGoHome = () => navigate('/home');
  const handleRefresh = () => window.location.reload();
  const handleReportBug = () =>
    window.open(
      'mailto:support@toeicmanagement.com?subject=Bug Report - 500 Error',
      '_blank'
    );

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #fc466b 0%, #3f5efb 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 2,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background Animation */}
      <MotionBox
        sx={{
          position: 'absolute',
          top: '10%',
          right: '10%',
          width: 100,
          height: 100,
          borderRadius: '50%',
          background: 'rgba(255, 255, 255, 0.1)',
        }}
        animate={{ y: [0, -30, 0], scale: [1, 1.2, 1], rotate: [0, 360] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
      />
      <MotionBox
        sx={{
          position: 'absolute',
          bottom: '15%',
          left: '5%',
          width: 60,
          height: 60,
          borderRadius: '50%',
          background: 'rgba(255, 255, 255, 0.08)',
        }}
        animate={{ y: [0, 20, 0], x: [0, 15, 0], scale: [1, 1.1, 1] }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
      />

      <Container maxWidth="sm">
        <MotionPaper
          elevation={20}
          sx={{
            padding: { xs: 3, md: 4 },
            borderRadius: 3,
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(15px)',
            textAlign: 'center',
            position: 'relative',
          }}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          {/* Icon */}
          <MotionBox
            sx={{ mb: 2 }}
            initial={{ scale: 0, rotate: -90 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.3, duration: 0.8, type: 'spring' }}
          >
            <BugIcon
              sx={{
                fontSize: { xs: 60, md: 80 },
                color: '#fc466b',
                filter: 'drop-shadow(0 3px 6px rgba(0,0,0,0.1))',
              }}
            />
          </MotionBox>

          {/* 500 Text */}
          <Typography
            variant="h1"
            sx={{
              fontSize: { xs: '3rem', md: '4rem' },
              fontWeight: 'bold',
              background: 'linear-gradient(45deg, #fc466b, #3f5efb)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mb: 1.5,
            }}
          >
            500
          </Typography>

          {/* Error Message */}
          <Typography
            variant="h5"
            sx={{
              fontWeight: 'bold',
              color: theme.palette.text.primary,
              mb: 1.5,
              fontSize: { xs: '1.2rem', md: '1.5rem' },
            }}
          >
            Internal Server Error
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: theme.palette.text.secondary,
              mb: 3,
              maxWidth: 500,
              mx: 'auto',
              lineHeight: 1.5,
              fontSize: { xs: '0.9rem', md: '1rem' },
            }}
          >
            Oops! Something went wrong on our end. Please try again later.
          </Typography>

          {/* Buttons */}
          <MotionBox
            sx={{
              display: 'flex',
              gap: 1.5,
              justifyContent: 'center',
              flexWrap: 'wrap',
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.6 }}
          >
            <Button
              variant="contained"
              size="medium"
              startIcon={<RefreshIcon />}
              onClick={handleRefresh}
              sx={{ px: 3, py: 1, borderRadius: 2, fontSize: '1rem' }}
            >
              Try Again
            </Button>
            <Button
              variant="outlined"
              size="medium"
              startIcon={<HomeIcon />}
              onClick={handleGoHome}
              sx={{ px: 3, py: 1, borderRadius: 2, fontSize: '1rem' }}
            >
              Go Home
            </Button>
            <Button
              variant="text"
              size="medium"
              startIcon={<ContactIcon />}
              onClick={handleReportBug}
              sx={{ px: 3, py: 1, borderRadius: 2, fontSize: '1rem' }}
            >
              Report Bug
            </Button>
          </MotionBox>
        </MotionPaper>
      </Container>
    </Box>
  );
};

export default ServerError;
