import type React from "react"
import { useTheme } from "@mui/material/styles"
import {
  Box,
  Typography,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Chip,
  Divider,
} from "@mui/material"
import {
  DashboardOutlined,
  PeopleAltOutlined,
  SchoolOutlined,
  ArticleOutlined,
  BarChartOutlined,
} from "@mui/icons-material"
import { motion, AnimatePresence } from "framer-motion"
import { Link, useLocation } from "react-router-dom"

export interface AdminSidebarItem {
  main: {
    text: string
    icon: React.ReactNode
    to: string
    badge?: number
  }
}

export const adminSidebarStructure: AdminSidebarItem[] = [
  {
    main: { text: "Tổng quan", icon: <DashboardOutlined />, to: "/admin/dashboard" },
  },
  {
    main: { text: "Quản lý tài khoản", icon: <PeopleAltOutlined />, to: "/admin/users", badge: 18 },
  },
  {
    main: { text: "Quản lý cộng tác viên", icon: <SchoolOutlined />, to: "/admin/collaborators", badge: 6 },
  },
  {
    main: { text: "Duyệt đề thi", icon: <ArticleOutlined />, to: "/admin/tests", badge: 5 },
  },
  {
    main: { text: "Duyệt bài học tổng hợp", icon: <BarChartOutlined />, to: "/admin/lessons", badge: 3 },
  },
]

const AdminSidebar: React.FC = () => {
  const theme = useTheme()
  const location = useLocation()

  const matchPath = (to?: string) =>
    !!to && (location.pathname === to || location.pathname.startsWith(to + "/"))

  return (
    <Box
      sx={{
        height: "100vh",
        width: 280,
        display: "flex",
        flexDirection: "column",
        bgcolor: theme.palette.background.paper,
        borderRight: `1px solid ${theme.palette.divider}`,
      }}
    >
      {/* Gradient top background */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 200,
          maxWidth: "280px",
          background: `linear-gradient(135deg, ${theme.palette.primary.main}15 0%, transparent 100%)`,
          pointerEvents: "none",
        }}
      />

      {/* Header */}
      <Box sx={{ p: 3, pb: 2 }}>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: 2,
                background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: `0 4px 12px ${theme.palette.primary.main}40`,
              }}
            >
              <DashboardOutlined sx={{ color: "white", fontSize: 24 }} />
            </Box>
            <Box>
              <Typography
                variant="h6"
                sx={{ fontWeight: 700, letterSpacing: "-0.5px" }}
              >
                TOEIC Pro
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Quản trị viên
              </Typography>
            </Box>
          </Box>
        </motion.div>
      </Box>

      <Divider sx={{ mx: 2, mb: 2 }} />

      {/* Menu items */}
      <Box sx={{ flexGrow: 1, overflowY: "auto", px: 2, pb: 3 }}>
        <List sx={{ py: 0 }}>
          {adminSidebarStructure.map((item, index) => {
            const active =
              item.main.to && (location.pathname === item.main.to || location.pathname.startsWith(item.main.to))
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                whileHover={{ x: 4 }}
              >
                <Box sx={{ position: "relative", mb: 0.5 }}>
                  <AnimatePresence>
                    {active && (
                      <motion.div
                        initial={{ scaleY: 0 }}
                        animate={{ scaleY: 1 }}
                        exit={{ scaleY: 0 }}
                        style={{
                          position: "absolute",
                          left: 0,
                          top: "20%",
                          transform: "translateY(-50%)",
                          width: 4,
                          height: "70%",
                          background: `linear-gradient(180deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                          borderRadius: "0 4px 4px 0",
                          zIndex: 1,
                        }}
                      />
                    )}
                  </AnimatePresence>

                  <ListItemButton
                    component={Link}
                    to={item.main.to}
                    sx={{
                      borderRadius: 2,
                      pl: 2,
                      pr: 1.5,
                      py: 1.25,
                      color: active
                        ? theme.palette.primary.main
                        : theme.palette.text.secondary,
                      bgcolor: active
                        ? `${theme.palette.primary.main}12`
                        : "transparent",
                      "&:hover": {
                        bgcolor: active
                          ? `${theme.palette.primary.main}18`
                          : theme.palette.action.hover,
                      },
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 40,
                        color: active
                          ? theme.palette.primary.main
                          : theme.palette.text.secondary,
                      }}
                    >
                      {item.main.icon}
                    </ListItemIcon>
                    <ListItemText
                      primary={item.main.text}
                      primaryTypographyProps={{
                        fontWeight: active ? 600 : 500,
                        fontSize: "0.9rem",
                      }}
                    />
                    {item.main.badge && (
                      <Chip
                        label={item.main.badge}
                        size="small"
                        sx={{
                          height: 20,
                          fontSize: "0.7rem",
                          fontWeight: 600,
                          bgcolor: active
                            ? theme.palette.primary.main
                            : theme.palette.action.selected,
                          color: active ? "white" : theme.palette.text.secondary,
                        }}
                      />
                    )}
                  </ListItemButton>
                </Box>
              </motion.div>
            )
          })}
        </List>
      </Box>
    </Box>
  )
}

export default AdminSidebar
