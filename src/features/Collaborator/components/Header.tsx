import type React from "react"
import { useState } from "react"
import {
  AppBar,
  Toolbar,
  IconButton,
  Tooltip,
  Avatar,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Box,
  Typography,
  Badge,
} from "@mui/material"
import {
  FlashOnOutlined,
  DarkModeOutlined,
  LightModeOutlined,
  SettingsOutlined,
  PersonOutline,
  LogoutOutlined,
  NotificationsOutlined,
} from "@mui/icons-material"

interface HeaderProps {
  toggleTheme: () => void
  isDarkMode: boolean
}

const Header: React.FC<HeaderProps> = ({ toggleTheme, isDarkMode }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleLogout = () => {
    handleClose()
    // Add logout logic here
    console.log("Logout clicked")
  }

  const handleProfile = () => {
    handleClose()
    // Add profile navigation logic here
    console.log("Profile clicked")
  }

  return (
    <AppBar
      position="static"
      elevation={0}
      sx={{
        backgroundColor: "background.paper",
        color: "text.primary",
        borderBottom: "1px solid",
        borderColor: (theme) => (theme.palette.mode === "dark" ? "grey.800" : "grey.200"),
      }}
    >
      <Toolbar sx={{ justifyContent: "space-between", gap: 1 }}>
        {/* Left side - can add breadcrumbs or page title here if needed */}
        <Box />

        {/* Right side - Actions and User Profile */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Tooltip title="Thông báo">
            <IconButton color="default">
              <Badge badgeContent={3} color="error">
                <NotificationsOutlined />
              </Badge>
            </IconButton>
          </Tooltip>

          <Tooltip title="Chế độ Blitz">
            <IconButton color="primary">
              <FlashOnOutlined />
            </IconButton>
          </Tooltip>

          <Tooltip title="Chủ đề tùy chỉnh">
            <IconButton
              onClick={toggleTheme}
              sx={{
                transition: "transform 0.2s",
                "&:hover": { transform: "scale(1.1)" },
              }}
            >
              {isDarkMode ? <LightModeOutlined /> : <DarkModeOutlined />}
            </IconButton>
          </Tooltip>

          <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />

          <Tooltip title="Tài khoản">
            <Box
              onClick={handleClick}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1.5,
                cursor: "pointer",
                padding: "6px 12px",
                borderRadius: "12px",
                transition: "all 0.2s",
                "&:hover": {
                  backgroundColor: (theme) =>
                    theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.04)",
                },
              }}
            >
              <Avatar
                sx={{
                  width: 36,
                  height: 36,
                  background: "linear-gradient(135deg, #2563EB 0%, #3B82F6 100%)",
                  fontSize: "14px",
                  fontWeight: 600,
                }}
              >
                NV
              </Avatar>
              <Box sx={{ display: { xs: "none", sm: "block" } }}>
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 600,
                    lineHeight: 1.2,
                    color: "text.primary",
                  }}
                >
                  Nguyễn Văn A
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    color: "text.secondary",
                    lineHeight: 1.2,
                  }}
                >
                  Cộng tác viên
                </Typography>
              </Box>
            </Box>
          </Tooltip>

          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            onClick={handleClose}
            PaperProps={{
              elevation: 3,
              sx: {
                minWidth: 220,
                mt: 1.5,
                borderRadius: 2,
                overflow: "visible",
                filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.1))",
                "&:before": {
                  content: '""',
                  display: "block",
                  position: "absolute",
                  top: 0,
                  right: 14,
                  width: 10,
                  height: 10,
                  bgcolor: "background.paper",
                  transform: "translateY(-50%) rotate(45deg)",
                  zIndex: 0,
                },
              },
            }}
            transformOrigin={{ horizontal: "right", vertical: "top" }}
            anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
          >
            <Box sx={{ px: 2, py: 1.5 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                Nguyễn Văn A
              </Typography>
              <Typography variant="caption" color="text.secondary">
                nguyenvana@example.com
              </Typography>
            </Box>
            <Divider />
            <MenuItem onClick={handleProfile} sx={{ py: 1.5 }}>
              <ListItemIcon>
                <PersonOutline fontSize="small" />
              </ListItemIcon>
              <ListItemText>Hồ sơ của tôi</ListItemText>
            </MenuItem>
            <MenuItem onClick={handleClose} sx={{ py: 1.5 }}>
              <ListItemIcon>
                <SettingsOutlined fontSize="small" />
              </ListItemIcon>
              <ListItemText>Cài đặt</ListItemText>
            </MenuItem>
            <Divider />
            <MenuItem
              onClick={handleLogout}
              sx={{
                py: 1.5,
                color: "error.main",
                "&:hover": {
                  backgroundColor: "error.lighter",
                },
              }}
            >
              <ListItemIcon>
                <LogoutOutlined fontSize="small" color="error" />
              </ListItemIcon>
              <ListItemText>Đăng xuất</ListItemText>
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  )
}

export default Header
