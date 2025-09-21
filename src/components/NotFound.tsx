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
  SearchOff as SearchOffIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const MotionBox = motion(Box);
const MotionPaper = motion(Paper);

const NotFound = () => {
  const navigate = useNavigate();
  const theme = useTheme();

  const handleGoHome = () => {
    navigate('/home');
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
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
          top: '10%',
          left: '10%',
          width: 100,
          height: 100,
          borderRadius: '50%',
          background: 'rgba(255, 255, 255, 0.1)',
        }}
        animate={{
          y: [0, -20, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      <MotionBox
        sx={{
          position: 'absolute',
          top: '60%',
          right: '15%',
          width: 60,
          height: 60,
          borderRadius: '50%',
          background: 'rgba(255, 255, 255, 0.08)',
        }}
        animate={{
          y: [0, 15, 0],
          x: [0, 10, 0],
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
          bottom: '20%',
          left: '20%',
          width: 80,
          height: 80,
          borderRadius: '50%',
          background: 'rgba(255, 255, 255, 0.06)',
        }}
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, 180, 360],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'linear',
        }}
      />

      <Container maxWidth="md">
        <MotionPaper
          elevation={20}
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
          {/* 404 Icon */}
          <MotionBox
            sx={{ mb: 2 }}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, duration: 0.6, type: 'spring' }}
          >
            <SearchOffIcon
              sx={{
                fontSize: { xs: 60, md: 80 },   // nhỏ hơn
                color: theme.palette.primary.main,
                filter: 'drop-shadow(0 3px 6px rgba(0,0,0,0.1))',
              }}
            />
          </MotionBox>

          {/* 404 Text */}
          <Typography
            variant="h1"
            sx={{
              fontSize: { xs: '3rem', md: '4rem' }, // nhỏ hơn
              fontWeight: 'bold',
              background: 'linear-gradient(45deg, #667eea, #764ba2)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mb: 1.5,
            }}
          >
            404
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
            Oops! Page Not Found
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
            The page you're looking for doesn't exist or has been moved.
            Don't worry, let's get you back on track!
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
                fontSize: '1rem',
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
          </MotionBox>
        </MotionPaper>
      </Container>
    </Box>
  );
};

export default NotFound;
