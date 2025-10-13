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
  Chip,
  Divider,
} from "@mui/material"
import {
  ArticleOutlined,
  SchoolOutlined,
  ExpandMore,
  ExpandLess,
  DashboardOutlined,
  PeopleAltOutlined,
  BarChartOutlined,
} from "@mui/icons-material"
import { motion, AnimatePresence } from "framer-motion"
import { useTheme } from "@mui/material/styles"
import { Link, useLocation } from "react-router-dom"

export const sidebarStructure = [
  {
    main: { text: "Dashboard", icon: <DashboardOutlined />, to: "/ctv/dashboard" },
  },
  {
    main: { text: "Học viên", icon: <PeopleAltOutlined />, to: "/ctv/students", badge: 24 },
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
      { text: "Bài học tổng hợp", to: "/ctv/integrated-lessons", badge: 3 },
      { text: "Video bài giảng", to: "/ctv/video-lectures", badge: 3 },
      { text: "Lý thuyết & Ngữ pháp", to: "/ctv/grammar", badge: 2 },
      { text: "Chủ đề từ vựng", to: "/ctv/topics", badge: 2 },
      {
        text: "Bài tập vận dụng",
        badge: 1,
        children: [
          { text: "Quiz", to: "/ctv/quiz" },
          { text: "Nghe chép chính tả", to: "/ctv/dictation", badge: 1 },
          { text: "Shadowing", to: "/ctv/shadowing", badge: 1 },
        ],
      },
    ],
  },
  {
    main: { text: "Báo cáo", icon: <BarChartOutlined /> },
    subItems: [
      { text: "Tổng quan", to: "/ctv/reports" },
      { text: "Báo lỗi", to: "/ctv/report/error", badge: 2 },
      { text: "Bình luận", to: "/ctv/report/comment", badge: 2 },
    ],
  },
]

const Sidebar: React.FC = () => {
  const [open, setOpen] = useState<{ [key: string]: boolean }>({})
  const theme = useTheme()
  const location = useLocation()

  const handleClick = (key: string) =>
    setOpen((prev) => ({ ...prev, [key]: !prev[key] }))

  const matchPath = (to?: string) =>
    !!to && (location.pathname === to || location.pathname.startsWith(to + "/"))

  // --- ACTIVE LOGIC ---
  const isParentActive = (item: any) =>
    item.subItems?.some(
      (sub: any) =>
        matchPath(sub.to) ||
        sub.children?.some((ch: any) => matchPath(ch.to))
    ) || false

  const isSubActive = (sub: any) => sub.to && matchPath(sub.to)
  const isSubExpanded = (sub: any) =>
    sub.children?.some((ch: any) => matchPath(ch.to))
  const isSubSubActive = (child: any) => matchPath(child.to)
  const isMainItemDirectlyActive = (item: any) =>
    item.main.to && matchPath(item.main.to)

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
              <SchoolOutlined sx={{ color: "white", fontSize: 24 }} />
            </Box>
            <Box>
              <Typography
                variant="h6"
                sx={{ fontWeight: 700, letterSpacing: "-0.5px" }}
              >
                TOEIC Pro
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Cộng tác viên
              </Typography>
            </Box>
          </Box>
        </motion.div>
      </Box>

      <Divider sx={{ mx: 2, mb: 2 }} />

      {/* Scrollable menu */}
      <Box sx={{ flexGrow: 1, overflowY: "auto", px: 2, pb: 3 }}>
        <List sx={{ py: 0 }}>
          {sidebarStructure.map((item, index) => {
            const active =
              (item.main.to && matchPath(item.main.to)) || isParentActive(item)
            const showMainIndicator = isMainItemDirectlyActive(item)

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                whileHover={{ x: 4 }} // 👈 hover animation restored
              >
                <Box sx={{ position: "relative", mb: 0.5 }}>
                  {/* Level 1 active bar */}
                  <AnimatePresence>
                    {showMainIndicator && (
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

                  {/* Level 1 button */}
                  <ListItemButton
                    component={item.main.to ? Link : "div"}
                    to={item.main.to || ""}
                    onClick={() => item.subItems && handleClick(item.main.text)}
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
                </Box>

                {/* Level 2 */}
                {item.subItems && (
                  <Collapse
                    in={open[item.main.text] || isParentActive(item)}
                    timeout="auto"
                    unmountOnExit
                  >
                    <List component="div" disablePadding>
                      {item.subItems.map((subItem: any, subIndex: number) => {
                        const subActive = isSubActive(subItem)
                        const subExpanded = isSubExpanded(subItem)
                        const hasChildren = !!subItem.children?.length

                        return (
                          <motion.div key={subIndex} whileHover={{ x: 4 }}>
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
                                component={subItem.to ? Link : "div"}
                                to={subItem.to || ""}
                                onClick={() => hasChildren && handleClick(subItem.text)}
                                sx={{
                                  borderRadius: 2,
                                  pl: 7,
                                  pr: 1.5,
                                  py: 1,
                                  color:
                                    subActive || subExpanded
                                      ? theme.palette.primary.main
                                      : theme.palette.text.secondary,
                                  bgcolor: subActive
                                    ? `${theme.palette.primary.main}12`
                                    : subExpanded
                                    ? `${theme.palette.primary.main}05`
                                    : "transparent",
                                  "&:hover": {
                                    bgcolor: subActive
                                      ? `${theme.palette.primary.main}18`
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
                                    bgcolor:
                                      subActive || subExpanded
                                        ? theme.palette.primary.main
                                        : theme.palette.text.disabled,
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
                                {hasChildren &&
                                  (open[subItem.text] ? (
                                    <ExpandLess sx={{ fontSize: 18 }} />
                                  ) : (
                                    <ExpandMore sx={{ fontSize: 18 }} />
                                  ))}
                              </ListItemButton>

                              {/* Level 3 */}
                              {hasChildren && (
                                <Collapse
                                  in={open[subItem.text]}
                                  timeout="auto"
                                  unmountOnExit
                                >
                                  <List component="div" disablePadding>
                                    {subItem.children.map(
                                      (child: any, childIndex: number) => {
                                        const subSubActive = isSubSubActive(child)
                                        return (
                                          <ListItemButton
                                            key={childIndex}
                                            component={Link}
                                            to={child.to}
                                            sx={{
                                              position: "relative",
                                              borderRadius: 2,
                                              pl: 10,
                                              pr: 1.5,
                                              py: 0.8,
                                              color: subSubActive
                                                ? theme.palette.primary.main
                                                : theme.palette.text.secondary,
                                              bgcolor: subSubActive
                                                ? `${theme.palette.primary.main}08`
                                                : "transparent",
                                              "&:hover": {
                                                bgcolor: subSubActive
                                                  ? `${theme.palette.primary.main}12`
                                                  : theme.palette.action.hover,
                                              },
                                              "&::before": {
                                                content: '""',
                                                position: "absolute",
                                                left: 45,
                                                top: "20%",
                                                width: 3,
                                                height: "60%",
                                                borderRadius: 2,
                                                bgcolor: subSubActive
                                                  ? theme.palette.primary.main
                                                  : "transparent",
                                              },
                                            }}
                                          >
                                            <ListItemText
                                              primary={child.text}
                                              primaryTypographyProps={{
                                                fontWeight: subSubActive
                                                  ? 600
                                                  : 400,
                                                fontSize: "0.8rem",
                                              }}
                                            />
                                          </ListItemButton>
                                        )
                                      }
                                    )}
                                  </List>
                                </Collapse>
                              )}
                            </Box>
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
  )
}

export default Sidebar
