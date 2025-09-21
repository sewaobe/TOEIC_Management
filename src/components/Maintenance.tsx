import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Paper,
  useTheme,
  LinearProgress,
  Chip,
} from '@mui/material';
import {
  Build as BuildIcon,
  Refresh as RefreshIcon,
  Schedule as ScheduleIcon,
  Notifications as NotificationIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';

const MotionBox = motion(Box);
const MotionPaper = motion(Paper);

const Maintenance = () => {
  const theme = useTheme();
  const [progress, setProgress] = useState(0);

  // Simulate maintenance progress
  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((oldProgress) => {
        if (oldProgress === 100) {
          return 0;
        }
        const diff = Math.random() * 10;
        return Math.min(oldProgress + diff, 100);
      });
    }, 500);

    return () => {
      clearInterval(timer);
    };
  }, []);

  const handleRefresh = () => {
    window.location.reload();
  };

  const handleNotifyMe = () => {
    // You can implement notification logic here
    alert('We will notify you when maintenance is complete!');
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
          top: '20%',
          left: '20%',
          width: 100,
          height: 100,
          borderRadius: '50%',
          background: 'rgba(255, 255, 255, 0.1)',
        }}
        animate={{
          y: [0, -20, 0],
          scale: [1, 1.1, 1],
          rotate: [0, 180, 360],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      <MotionBox
        sx={{
          position: 'absolute',
          bottom: '30%',
          right: '15%',
          width: 80,
          height: 80,
          borderRadius: '50%',
          background: 'rgba(255, 255, 255, 0.08)',
        }}
        animate={{
          y: [0, 25, 0],
          x: [0, -15, 0],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      <Container maxWidth="md">
        <MotionPaper
          elevation={24}
          sx={{
            padding: { xs: 4, md: 6 },
            borderRadius: 4,
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(20px)',
            textAlign: 'center',
            position: 'relative',
            overflow: 'hidden',
          }}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          {/* Decorative gradient overlay */}
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: 4,
              background: 'linear-gradient(90deg, #667eea, #764ba2, #667eea)',
              backgroundSize: '200% 100%',
              animation: 'gradient 3s ease infinite',
              '@keyframes gradient': {
                '0%, 100%': {
                  backgroundPosition: '0% 50%',
                },
                '50%': {
                  backgroundPosition: '100% 50%',
                },
              },
            }}
          />

          {/* Status Chip */}
          <MotionBox
            sx={{ mb: 3 }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <Chip
              icon={<ScheduleIcon />}
              label="Under Maintenance"
              color="warning"
              variant="filled"
              sx={{
                fontSize: '1rem',
                fontWeight: 'bold',
                px: 2,
                py: 1,
              }}
            />
          </MotionBox>

          {/* Build Icon */}
          <MotionBox
            sx={{ mb: 3 }}
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.3, duration: 0.8, type: 'spring' }}
          >
            <BuildIcon
              sx={{
                fontSize: { xs: 80, md: 120 },
                color: theme.palette.primary.main,
                filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.1))',
              }}
            />
          </MotionBox>

          {/* Title */}
          <MotionBox
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            <Typography
              variant="h3"
              sx={{
                fontSize: { xs: '2rem', md: '3rem' },
                fontWeight: 'bold',
                background: 'linear-gradient(45deg, #667eea, #764ba2)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                mb: 2,
                textShadow: '0 4px 8px rgba(0,0,0,0.1)',
              }}
            >
              We'll Be Right Back!
            </Typography>
          </MotionBox>

          {/* Message */}
          <MotionBox
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.6 }}
          >
            <Typography
              variant="h6"
              sx={{
                color: theme.palette.text.secondary,
                mb: 4,
                maxWidth: 600,
                mx: 'auto',
                lineHeight: 1.6,
                fontSize: { xs: '1rem', md: '1.25rem' },
              }}
            >
              We're currently performing scheduled maintenance to improve your experience. 
              We'll be back online shortly. Thank you for your patience!
            </Typography>
          </MotionBox>

          {/* Progress Bar */}
          <MotionBox
            sx={{ mb: 4 }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.9, duration: 0.6 }}
          >
            <Typography
              variant="body1"
              sx={{
                color: theme.palette.text.secondary,
                mb: 2,
                fontWeight: 'medium',
              }}
            >
              Maintenance Progress
            </Typography>
            <LinearProgress
              variant="determinate"
              value={progress}
              sx={{
                height: 8,
                borderRadius: 4,
                backgroundColor: 'rgba(102, 126, 234, 0.2)',
                '& .MuiLinearProgress-bar': {
                  borderRadius: 4,
                  background: 'linear-gradient(45deg, #667eea, #764ba2)',
                },
              }}
            />
            <Typography
              variant="body2"
              sx={{
                color: theme.palette.text.secondary,
                mt: 1,
              }}
            >
              {Math.round(progress)}% Complete
            </Typography>
          </MotionBox>

          {/* Action Buttons */}
          <MotionBox
            sx={{
              display: 'flex',
              gap: 2,
              justifyContent: 'center',
              flexWrap: 'wrap',
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1, duration: 0.6 }}
          >
            <Button
              variant="contained"
              size="large"
              startIcon={<RefreshIcon />}
              onClick={handleRefresh}
              sx={{
                px: 4,
                py: 1.5,
                borderRadius: 3,
                fontSize: '1.1rem',
                fontWeight: 'bold',
                background: 'linear-gradient(45deg, #667eea, #764ba2)',
                boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
                '&:hover': {
                  background: 'linear-gradient(45deg, #5a6fd8, #6a42a0)',
                  boxShadow: '0 6px 20px rgba(102, 126, 234, 0.6)',
                  transform: 'translateY(-2px)',
                },
                transition: 'all 0.3s ease',
              }}
            >
              Check Again
            </Button>
            <Button
              variant="outlined"
              size="large"
              startIcon={<NotificationIcon />}
              onClick={handleNotifyMe}
              sx={{
                px: 4,
                py: 1.5,
                borderRadius: 3,
                fontSize: '1.1rem',
                fontWeight: 'bold',
                borderColor: theme.palette.primary.main,
                color: theme.palette.primary.main,
                borderWidth: 2,
                '&:hover': {
                  borderWidth: 2,
                  backgroundColor: theme.palette.primary.main,
                  color: 'white',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)',
                },
                transition: 'all 0.3s ease',
              }}
            >
              Notify Me
            </Button>
          </MotionBox>

          {/* ETA */}
          <MotionBox
            sx={{ mt: 4, pt: 3, borderTop: '1px solid #e0e0e0' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.3, duration: 0.6 }}
          >
            <Typography
              variant="body2"
              sx={{
                color: theme.palette.text.secondary,
                fontStyle: 'italic',
              }}
            >
              ⏰ Estimated completion time: 2-3 hours
            </Typography>
          </MotionBox>
        </MotionPaper>
      </Container>
    </Box>
  );
};

export default Maintenance;
