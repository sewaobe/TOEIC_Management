import type React from "react"
import { useState } from "react"
import {
  Box,
  Typography,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
  Avatar,
  Chip,
  Divider,
  IconButton,
  Tooltip,
} from "@mui/material"
import {
  ArticleOutlined,
  SchoolOutlined,
  ExpandMore,
  ExpandLess,
  DashboardOutlined,
  PeopleAltOutlined,
  BarChartOutlined,
  SettingsOutlined,
  HelpOutlineOutlined,
  LogoutOutlined,
  NotificationsOutlined,
} from "@mui/icons-material"
import { motion, AnimatePresence } from "framer-motion"
import { useTheme } from "@mui/material/styles"
import { Link, useLocation } from "react-router-dom"

// ===== Cấu trúc menu với link và badges =====
export const sidebarStructure = [
  {
    main: {
      text: "Dashboard",
      icon: <DashboardOutlined />,
      to: "/ctv/dashboard",
    },
  },
  {
    main: {
      text: "Học viên",
      icon: <PeopleAltOutlined />,
      to: "/ctv/students",
      badge: 24, // Added badge counter
    },
  },
  {
    main: { text: "Đề thi", icon: <ArticleOutlined />, badge: 12 },
    subItems: [
      { text: "Đề thi lớn (Full test)", to: "/ctv/full-tests", badge: 5 },
      { text: "Đề thi nhỏ (Minitest)", to: "/ctv/minitests", badge: 7 },
      { text: "Ngân hàng câu hỏi", to: "/ctv/questions", badge: 156 },
    ],
  },
  {
    main: { text: "Bài học", icon: <SchoolOutlined />, badge: 8 },
    subItems: [
      { text: "Video bài giảng", to: "/ctv/video-lectures", badge: 3 },
      { text: "Lý thuyết & Ngữ pháp", to: "/ctv/grammar", badge: 2 },
      { text: "Chủ đề từ vựng", to: "/ctv/topics", badge: 2 },
      { text: "Bài tập vận dụng", to: "/ctv/practice", badge: 1 },
    ],
  },
  {
    main: { text: "Báo cáo", icon: <BarChartOutlined /> },
    subItems: [
      { text: "Tổng quan", to: "/ctv/reports"},
      { text: "Báo lỗi", to: "/ctv/report/error", badge: 2 },
      { text: "Bình luận", to: "/ctv/report/comment", badge: 2 },
    ]
  },
]

const Sidebar: React.FC = () => {
  const [open, setOpen] = useState<{ [key: string]: boolean }>({})
  const theme = useTheme()
  const location = useLocation()

  console.log("[v0] Current pathname:", location.pathname)

  const handleClick = (mainItemText: string) => {
    setOpen((prevOpen) => ({
      ...prevOpen,
      [mainItemText]: !prevOpen[mainItemText],
    }))
  }

  // check xem đường dẫn hiện tại có thuộc group con không
  const isParentActive = (item: any) => {
    if (!item.subItems) return false
    return item.subItems.some((sub: any) => location.pathname === sub.to || location.pathname.startsWith(sub.to + "/"))
  }

  // check active cho subItem
  const isSubActive = (sub: any) => {
    const result = location.pathname === sub.to || location.pathname.startsWith(sub.to + "/")
    console.log("[v0] isSubActive for", sub.text, ":", result)
    return result
  }

  const isMainItemDirectlyActive = (item: any) => {
    if (!item.main.to) {
      console.log("[v0] Main item", item.main.text, "has no 'to' property, returning false")
      return false
    }
    const result = location.pathname === item.main.to || location.pathname.startsWith(item.main.to + "/")
    console.log("[v0] isMainItemDirectlyActive for", item.main.text, ":", result)
    return result
  }
  

  return (
    <Box
      sx={{
        height: "100vh",
        width: 280,
        display: "flex",
        flexDirection: "column",
        bgcolor: theme.palette.background.paper,
        borderRight: `1px solid ${theme.palette.divider}`,
        position: "relative",
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "200px",
          background: `linear-gradient(135deg, ${theme.palette.primary.main}15 0%, transparent 100%)`,
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      <Box sx={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", height: "100%" }}>
        <Box sx={{ p: 3, pb: 2 }}>
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <Box className="flex items-center space-x-3">
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
                <SchoolOutlined sx={{ color: "white", fontSize: 24 }} />
              </Box>
              <Box>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 700,
                    color: theme.palette.text.primary,
                    letterSpacing: "-0.5px",
                  }}
                >
                  TOEIC Pro
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    color: theme.palette.text.secondary,
                    fontSize: "0.7rem",
                  }}
                >
                  Cộng tác viên
                </Typography>
              </Box>
            </Box>
          </motion.div>
        </Box>

        <Divider sx={{ mx: 2, mb: 2 }} />

        <Box sx={{ flexGrow: 1, overflowY: "auto", px: 2, pb: 2 }}>
          <List sx={{ py: 0 }}>
            {sidebarStructure.map((item, index) => {
              const active =
                (item.main.to &&
                  (location.pathname === item.main.to || location.pathname.startsWith(item.main.to + "/"))) ||
                isParentActive(item)

              const showMainItemIndicator = isMainItemDirectlyActive(item)

              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <Box sx={{ position: "relative", mb: 0.5 }}>
                    <AnimatePresence>
                      {showMainItemIndicator && (
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

                    <motion.div whileHover={{ x: 4 }} whileTap={{ scale: 0.98 }} transition={{ duration: 0.2 }}>
                      <ListItemButton
                        component={item.main.to ? Link : "div"}
                        to={item.main.to || ""}
                        onClick={() => {
                          if (item.subItems) handleClick(item.main.text)
                        }}
                        sx={{
                          borderRadius: 2,
                          pl: 2,
                          pr: 1.5,
                          py: 1.25,
                          color: active ? theme.palette.primary.main : theme.palette.text.secondary,
                          bgcolor: active ? `${theme.palette.primary.main}12` : "transparent",
                          "&:hover": {
                            bgcolor: active ? `${theme.palette.primary.main}18` : theme.palette.action.hover,
                          },
                          transition: "all 0.2s ease",
                        }}
                      >
                        <ListItemIcon
                          sx={{
                            minWidth: 40,
                            color: active ? theme.palette.primary.main : theme.palette.text.secondary,
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
                              bgcolor: active ? theme.palette.primary.main : theme.palette.action.selected,
                              color: active ? "white" : theme.palette.text.secondary,
                              mr: item.subItems ? 1 : 0,
                            }}
                          />
                        )}
                        {item.subItems &&
                          (open[item.main.text] || isParentActive(item) ? (
                            <ExpandLess sx={{ fontSize: 20 }} />
                          ) : (
                            <ExpandMore sx={{ fontSize: 20 }} />
                          ))}
                      </ListItemButton>
                    </motion.div>
                  </Box>

                  {item.subItems && (
                    <Collapse in={open[item.main.text] || isParentActive(item)} timeout="auto" unmountOnExit>
                      <List component="div" disablePadding>
                        {item.subItems.map((subItem, subIndex) => {
                          const subActive = isSubActive(subItem)
                          return (
                            <motion.div
                              key={subIndex}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ duration: 0.2, delay: subIndex * 0.05 }}
                            >
                              <motion.div whileHover={{ x: 4 }} whileTap={{ scale: 0.98 }}>
                                <Box sx={{ position: "relative", mb: 0.5 }}>
                                  <AnimatePresence>
                                    {subActive && (
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
                                    to={subItem.to}
                                    sx={{
                                      borderRadius: 2,
                                      pl: 7,
                                      pr: 1.5,
                                      py: 1,
                                      color: subActive ? theme.palette.primary.main : theme.palette.text.secondary,
                                      bgcolor: subActive ? `${theme.palette.primary.main}08` : "transparent",
                                      "&:hover": {
                                        bgcolor: subActive
                                          ? `${theme.palette.primary.main}12`
                                          : theme.palette.action.hover,
                                      },
                                      position: "relative",
                                      "&::before": {
                                        content: '""',
                                        position: "absolute",
                                        left: 32,
                                        top: "50%",
                                        transform: "translateY(-50%)",
                                        width: 6,
                                        height: 6,
                                        borderRadius: "50%",
                                        bgcolor: subActive ? theme.palette.primary.main : theme.palette.text.disabled,
                                        transition: "all 0.2s ease",
                                      },
                                    }}
                                  >
                                    <ListItemText
                                      primary={subItem.text}
                                      primaryTypographyProps={{
                                        fontWeight: subActive ? 600 : 400,
                                        fontSize: "0.85rem",
                                      }}
                                    />
                                    {subItem.badge && (
                                      <Chip
                                        label={subItem.badge}
                                        size="small"
                                        sx={{
                                          height: 18,
                                          fontSize: "0.65rem",
                                          fontWeight: 600,
                                          bgcolor: subActive
                                            ? `${theme.palette.primary.main}20`
                                            : theme.palette.action.selected,
                                          color: subActive ? theme.palette.primary.main : theme.palette.text.secondary,
                                        }}
                                      />
                                    )}
                                  </ListItemButton>
                                </Box>
                              </motion.div>
                            </motion.div>
                          )
                        })}
                      </List>
                    </Collapse>
                  )}
                </motion.div>
              )
            })}
          </List>
        </Box>
      </Box>
    </Box>
  )
}

export default Sidebar
