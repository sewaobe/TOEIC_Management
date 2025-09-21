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
  Block as BlockIcon,
  ContactSupport as ContactIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const MotionBox = motion(Box);
const MotionPaper = motion(Paper);

const Forbidden = () => {
  const navigate = useNavigate();
  const theme = useTheme();

  const handleGoHome = () => {
    navigate('/home');
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleContactSupport = () => {
    // You can implement contact support logic here
    window.open('mailto:support@toeicmanagement.com', '_blank');
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
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
          left: '10%',
          width: 100,
          height: 100,
          borderRadius: '50%',
          background: 'rgba(255, 255, 255, 0.1)',
        }}
        animate={{
          y: [0, -30, 0],
          scale: [1, 1.2, 1],
          rotate: [0, 180, 360],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      <MotionBox
        sx={{
          position: 'absolute',
          bottom: '25%',
          right: '20%',
          width: 60,
          height: 60,
          borderRadius: '50%',
          background: 'rgba(255, 255, 255, 0.08)',
        }}
        animate={{
          y: [0, 25, 0],
          x: [0, -20, 0],
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
              background: 'linear-gradient(90deg, #f093fb, #f5576c, #f093fb)',
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

          {/* Block Icon */}
          <MotionBox
            sx={{ mb: 3 }}
            initial={{ scale: 0, rotate: 180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.3, duration: 0.8, type: 'spring' }}
          >
            <BlockIcon
              sx={{
                fontSize: { xs: 80, md: 120 },
                color: '#f5576c',
                filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.1))',
              }}
            />
          </MotionBox>

          {/* 403 Text */}
          <MotionBox
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            <Typography
              variant="h1"
              sx={{
                fontSize: { xs: '4rem', md: '6rem' },
                fontWeight: 'bold',
                background: 'linear-gradient(45deg, #f093fb, #f5576c)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                mb: 2,
                textShadow: '0 4px 8px rgba(0,0,0,0.1)',
              }}
            >
              403
            </Typography>
          </MotionBox>

          {/* Error Message */}
          <MotionBox
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.6 }}
          >
            <Typography
              variant="h4"
              sx={{
                fontWeight: 'bold',
                color: theme.palette.text.primary,
                mb: 2,
                fontSize: { xs: '1.5rem', md: '2rem' },
              }}
            >
              Forbidden
            </Typography>
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
              You don't have sufficient privileges to access this resource. 
              This action requires higher level permissions.
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
            transition={{ delay: 0.9, duration: 0.6 }}
          >
            <Button
              variant="contained"
              size="large"
              startIcon={<HomeIcon />}
              onClick={handleGoHome}
              sx={{
                px: 4,
                py: 1.5,
                borderRadius: 3,
                fontSize: '1.1rem',
                fontWeight: 'bold',
                background: 'linear-gradient(45deg, #f093fb, #f5576c)',
                boxShadow: '0 4px 15px rgba(240, 147, 251, 0.4)',
                '&:hover': {
                  background: 'linear-gradient(45deg, #e91e63, #f06292)',
                  boxShadow: '0 6px 20px rgba(240, 147, 251, 0.6)',
                  transform: 'translateY(-2px)',
                },
                transition: 'all 0.3s ease',
              }}
            >
              Go Home
            </Button>
            <Button
              variant="outlined"
              size="large"
              startIcon={<ArrowBackIcon />}
              onClick={handleGoBack}
              sx={{
                px: 4,
                py: 1.5,
                borderRadius: 3,
                fontSize: '1.1rem',
                fontWeight: 'bold',
                borderColor: '#f5576c',
                color: '#f5576c',
                borderWidth: 2,
                '&:hover': {
                  borderWidth: 2,
                  backgroundColor: '#f5576c',
                  color: 'white',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 4px 15px rgba(245, 87, 108, 0.3)',
                },
                transition: 'all 0.3s ease',
              }}
            >
              Go Back
            </Button>
            <Button
              variant="text"
              size="large"
              startIcon={<ContactIcon />}
              onClick={handleContactSupport}
              sx={{
                px: 4,
                py: 1.5,
                borderRadius: 3,
                fontSize: '1.1rem',
                fontWeight: 'bold',
                color: theme.palette.text.secondary,
                '&:hover': {
                  backgroundColor: 'rgba(245, 87, 108, 0.1)',
                  color: '#f5576c',
                  transform: 'translateY(-2px)',
                },
                transition: 'all 0.3s ease',
              }}
            >
              Contact Support
            </Button>
          </MotionBox>

          {/* Permission tip */}
          <MotionBox
            sx={{ mt: 4, pt: 3, borderTop: '1px solid #e0e0e0' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.1, duration: 0.6 }}
          >
            <Typography
              variant="body2"
              sx={{
                color: theme.palette.text.secondary,
                fontStyle: 'italic',
              }}
            >
              🛡️ Tip: Contact your administrator to request access to this resource.
            </Typography>
          </MotionBox>
        </MotionPaper>
      </Container>
    </Box>
  );
};

export default Forbidden;
