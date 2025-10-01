import React, { useState } from 'react';
import {
  Box,
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  IconButton,
  InputAdornment,
  Divider,
  Checkbox,
  FormControlLabel,
  Link,
  Avatar,
  CircularProgress,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Google as GoogleIcon,
  Facebook as FacebookIcon,
} from '@mui/icons-material';
import { Controller } from 'react-hook-form';
import { useAuthViewModel } from '../../viewmodels/useAuthViewModel';
import { signInWithGoogle } from '../../hooks/useFirebaseAuth';
import authService from '../../services/auth.service';
import { ApiResponse } from '../../types/ApiResponse';
import { User } from '../../types/User';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState(false); // riêng cho social
  const [rememberMe, setRememberMe] = useState(false);

  const { useLoginForm, useRegisterForm, login, register, loginWithGoogle } = useAuthViewModel();

  const loginForm = useLoginForm();
  const registerForm = useRegisterForm();

  const handleSubmit = async (data: any) => {
    setIsLoading(true);
    try {
      if (isLogin) {
        await login(data);
      } else {
        await register(data, () => setIsLogin(true));
      }
    } finally {
      setIsLoading(false);
    }
  };

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
    loginForm.reset();
    registerForm.reset();
  };

  const handleGoogleLogin = async () => {
    try {
      setSocialLoading(true);
      const cred = await signInWithGoogle();
      if (cred) {
        const { user } = cred;
        const idToken = await user.getIdToken();
        loginWithGoogle(idToken)
      }
    } catch (err) {
      console.error('Google login failed:', err);
    } finally {
      setSocialLoading(false);
    }
  };
  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundColor: '#f5f5f5',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 2,
      }}
    >
      <Container maxWidth="xs">
        <Paper
          elevation={3}
          sx={{
            padding: 4,
            borderRadius: 2,
            backgroundColor: 'white',
            maxWidth: 400,
            mx: 'auto',
          }}
        >
          {/* Logo/Brand */}
          <Box display="flex" alignItems="center" justifyContent="center" mb={1}>
            <Avatar
              sx={{
                width: 32,
                height: 32,
                backgroundColor: '#1976d2',
                mr: 1,
              }}
            >
              <Typography variant="body2" color="white" fontWeight="bold">
                T
              </Typography>
            </Avatar>
            <Typography
              variant="h6"
              sx={{
                color: '#1976d2',
                fontWeight: 'bold',
              }}
            >
              TOEIC Management
            </Typography>
          </Box>

          {/* Title */}
          <Typography
            variant="h4"
            component="h1"
            sx={{
              textAlign: 'center',
              fontWeight: 'bold',
              color: '#333',
              mb: 3,
            }}
          >
            {isLogin ? 'Sign in' : 'Sign up'}
          </Typography>

          {/* Form */}
          <Box
            component="form"
            onSubmit={
              isLogin
                ? loginForm.handleSubmit(handleSubmit)
                : registerForm.handleSubmit(handleSubmit)
            }
            noValidate
          >
            {/* --- Login Fields --- */}
            {isLogin ? (
              <>
                <Controller
                  name="username"
                  control={loginForm.control}
                  render={({ field, fieldState: { error } }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Username"
                      variant="outlined"
                      margin="normal"
                      error={!!error}
                      helperText={error?.message}
                      disabled={isLoading}
                      sx={{ mb: 2 }}
                    />
                  )}
                />

                <Controller
                  name="password"
                  control={loginForm.control}
                  render={({ field, fieldState: { error } }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Password"
                      type={showPassword ? 'text' : 'password'}
                      variant="outlined"
                      margin="normal"
                      error={!!error}
                      helperText={error?.message}
                      disabled={isLoading}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={() => setShowPassword(!showPassword)}
                              edge="end"
                              disabled={isLoading}
                            >
                              {showPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                      sx={{ mb: 2 }}
                    />
                  )}
                />

                {/* Remember Me */}
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      color="primary"
                      size="small"
                    />
                  }
                  label={
                    <Typography variant="body2" color="text.secondary">
                      Remember me
                    </Typography>
                  }
                  sx={{ mb: 2 }}
                />
              </>
            ) : (
              /* --- Register Fields --- */
              <>
                <Controller
                  name="username"
                  control={registerForm.control}
                  render={({ field, fieldState: { error } }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Username"
                      variant="outlined"
                      margin="normal"
                      error={!!error}
                      helperText={error?.message}
                      disabled={isLoading}
                      sx={{ mb: 2 }}
                    />
                  )}
                />

                <Controller
                  name="email"
                  control={registerForm.control}
                  render={({ field, fieldState: { error } }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Email"
                      type="email"
                      variant="outlined"
                      margin="normal"
                      error={!!error}
                      helperText={error?.message}
                      disabled={isLoading}
                      sx={{ mb: 2 }}
                    />
                  )}
                />

                <Controller
                  name="fullname"
                  control={registerForm.control}
                  render={({ field, fieldState: { error } }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Full Name"
                      variant="outlined"
                      margin="normal"
                      error={!!error}
                      helperText={error?.message}
                      disabled={isLoading}
                      sx={{ mb: 2 }}
                    />
                  )}
                />

                <Controller
                  name="password"
                  control={registerForm.control}
                  render={({ field, fieldState: { error } }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Password"
                      type={showPassword ? 'text' : 'password'}
                      variant="outlined"
                      margin="normal"
                      error={!!error}
                      helperText={error?.message}
                      disabled={isLoading}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={() => setShowPassword(!showPassword)}
                              edge="end"
                              disabled={isLoading}
                            >
                              {showPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                      sx={{ mb: 2 }}
                    />
                  )}
                />
              </>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={isLoading}
              sx={{
                py: 1.5,
                fontSize: '1rem',
                fontWeight: 'bold',
                backgroundColor: '#1976d2',
                color: 'white',
                borderRadius: 1,
                textTransform: 'none',
                '&:hover': { backgroundColor: '#1565c0' },
                '&:disabled': { backgroundColor: '#ccc' },
                mb: 2,
              }}
            >
              {isLoading ? (
                <CircularProgress size={20} color="inherit" />
              ) : isLogin ? (
                'Sign In'
              ) : (
                'Sign Up'
              )}
            </Button>

            {/* Forgot Password */}
            {isLogin && (
              <Box textAlign="center" mb={2}>
                <Link
                  href="#"
                  variant="body2"
                  color="primary"
                  sx={{ textDecoration: 'none' }}
                >
                  Forgot your password?
                </Link>
              </Box>
            )}

            {/* Divider */}
            <Divider sx={{ my: 2 }}>
              <Typography variant="body2" color="text.secondary">
                or
              </Typography>
            </Divider>

            {/* Social Login */}
            <Box sx={{ mb: 3 }}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<GoogleIcon />}
                onClick={handleGoogleLogin}
                disabled={socialLoading}
                sx={{ py: 1.2, mb: 1 }}
              >
                {socialLoading ? <CircularProgress size={20} /> : 'Sign in with Google'}
              </Button>

              <Button fullWidth variant="outlined" startIcon={<FacebookIcon />}
                sx={{ py: 1.2 }}>
                Sign in with Facebook
              </Button>
            </Box>

            {/* Toggle Auth Mode */}
            <Box textAlign="center">
              <Typography variant="body2" color="text.secondary">
                {isLogin ? "Don't have an account? " : 'Already have an account? '}
                <Link component="button" type="button" variant="body2" color="primary"
                  onClick={toggleAuthMode} sx={{ fontWeight: 'bold' }}>
                  {isLogin ? 'Sign up' : 'Sign in'}
                </Link>
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default AuthPage;
