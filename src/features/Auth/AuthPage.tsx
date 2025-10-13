import { useState } from "react"
import { Box, Container, Paper, Button, Typography, Avatar, CircularProgress } from "@mui/material"
import { Google as GoogleIcon, Facebook as FacebookIcon } from "@mui/icons-material"
import { useAuthViewModel } from "../../viewmodels/useAuthViewModel"
import { signInWithGoogle } from "../../hooks/useFirebaseAuth"

const AuthPage = () => {
  const [googleLoading, setGoogleLoading] = useState(false)
  const [facebookLoading, setFacebookLoading] = useState(false)

  const { loginWithGoogle } = useAuthViewModel()

  const handleGoogleLogin = async () => {
    try {
      setGoogleLoading(true)
      const cred = await signInWithGoogle()
      if (cred) {
        const { user } = cred
        const idToken = await user.getIdToken()
        console.log(idToken);
        loginWithGoogle(idToken)
      }
    } catch (err: any) {
      console.error("Google login failed:", err)
      if (err.code === "auth/popup-closed-by-user") {
        console.warn("User closed the popup.");
      }
    } finally {
      setGoogleLoading(false)
    }
  }

  const handleFacebookLogin = async () => {
    try {
      setFacebookLoading(true)
      // TODO: Implement Facebook login
      console.log("Facebook login not implemented yet")
    } catch (err) {
      console.error("Facebook login failed:", err)
    } finally {
      setFacebookLoading(false)
    }
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 2,
      }}
    >
      <Container maxWidth="xs">
        <Paper
          elevation={8}
          sx={{
            padding: 5,
            borderRadius: 3,
            backgroundColor: "white",
            maxWidth: 420,
            mx: "auto",
          }}
        >
          {/* Logo/Brand */}
          <Box display="flex" flexDirection="column" alignItems="center" mb={4}>
            <Avatar
              sx={{
                width: 64,
                height: 64,
                backgroundColor: "#2563EB",
                mb: 2,
                boxShadow: "0 4px 12px rgba(37, 99, 235, 0.3)",
              }}
            >
              <Typography variant="h4" color="white" fontWeight="bold">
                T
              </Typography>
            </Avatar>
            <Typography
              variant="h5"
              sx={{
                color: "#1e293b",
                fontWeight: "bold",
                mb: 1,
              }}
            >
              TOEIC Management
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: "#64748b",
                textAlign: "center",
              }}
            >
              Contributor Portal
            </Typography>
          </Box>

          {/* Welcome Message */}
          <Box mb={4} textAlign="center">
            <Typography
              variant="h6"
              sx={{
                color: "#334155",
                fontWeight: 600,
                mb: 1,
              }}
            >
              Welcome back!
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: "#64748b",
              }}
            >
              Sign in to continue managing your TOEIC content
            </Typography>
          </Box>

          {/* Social Login Buttons */}
          <Box sx={{ mb: 3 }}>
            {/* Google Login */}
            <Button
              fullWidth
              variant="contained"
              startIcon={
                googleLoading ? null : (
                  <GoogleIcon sx={{ fontSize: 24, color: "white" }} />
                )
              }
              onClick={handleGoogleLogin}
              disabled={googleLoading || facebookLoading}
              sx={{
                py: 1.5,
                mb: 2,
                fontSize: "1rem",
                fontWeight: 600,
                textTransform: "none",
                borderRadius: 2,
                backgroundColor: "#EA4335",
                color: "white",
                "&:hover": {
                  backgroundColor: "#C62828",
                },
                "&:disabled": {
                  backgroundColor: "#fca5a5",
                  color: "#f3f4f6",
                },
              }}
            >
              {googleLoading ? (
                <CircularProgress size={20} sx={{ color: "white" }} />
              ) : (
                "Continue with Google"
              )}
            </Button>

            {/* Facebook Login */}
            <Button
              fullWidth
              variant="contained"
              startIcon={facebookLoading ? null : <FacebookIcon />}
              onClick={handleFacebookLogin}
              disabled={googleLoading || facebookLoading}
              sx={{
                py: 1.5,
                fontSize: "1rem",
                fontWeight: 600,
                backgroundColor: "#1877F2",
                color: "white",
                textTransform: "none",
                borderRadius: 2,
                boxShadow: "0 1px 3px rgba(24, 119, 242, 0.3)",
                "&:hover": {
                  backgroundColor: "#166fe5",
                  boxShadow: "0 2px 6px rgba(24, 119, 242, 0.4)",
                },
                "&:disabled": {
                  backgroundColor: "#94a3b8",
                  color: "white",
                },
              }}
            >
              {facebookLoading ? <CircularProgress size={20} sx={{ color: "white" }} /> : "Continue with Facebook"}
            </Button>
          </Box>

          {/* Footer Note */}
          <Box textAlign="center" mt={4}>
            <Typography
              variant="caption"
              sx={{
                color: "#94a3b8",
                display: "block",
                lineHeight: 1.6,
              }}
            >
              By continuing, you agree to our Terms of Service and Privacy Policy
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  )
}

export default AuthPage
