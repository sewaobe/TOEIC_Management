import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { RootState } from "../stores/store";
import { Box, CircularProgress, Typography } from "@mui/material";

interface RouteWrapperProps {
  element: React.ReactNode;
  guard?: { role?: "admin" | "collaborator" };
  requireAuth?: boolean;
}

export const RouteWrapper = ({ element, guard, requireAuth = false }: RouteWrapperProps) => {
  const { user, isAuthenticated, loading, initialized } = useSelector((state: RootState) => state.user);
  console.log(user, isAuthenticated);
  // Show loading while checking authentication
  if (!initialized) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        }}
      >
        <CircularProgress size={60} sx={{ color: 'white', mb: 2 }} />
        <Typography variant="h6" sx={{ color: 'white' }}>
          Đang tải...
        </Typography>
      </Box>
    );
  }

  // If route requires authentication but user is not authenticated
  if (requireAuth && !isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  // If user is authenticated and trying to access auth page, redirect to home
  if (isAuthenticated && (window.location.pathname === '/auth' || window.location.pathname === '/login')) {
    return <Navigate to="/home" replace />;
  }
  // Nếu route có yêu cầu role mà user không hợp lệ -> redirect
  if (guard?.role && user?.role_name !== guard.role) {
    return <Navigate to="/401" replace />;
  }

  return <>{element}</>;
};