import React, { useState } from "react";
import {
  Box,
  Typography,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
} from "@mui/material";
import {
  ArticleOutlined,
  SchoolOutlined,
  ExpandMore,
  ExpandLess,
  DashboardOutlined,
  PeopleAltOutlined,
  BarChartOutlined,
} from "@mui/icons-material";
import { motion } from "framer-motion";
import { useTheme } from "@mui/material/styles";
import { Link, useLocation } from "react-router-dom";

// ===== Cấu trúc menu với link =====
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
    },
  },
  {
    main: { text: "Đề thi", icon: <ArticleOutlined /> },
    subItems: [
      { text: "Đề thi lớn (Full test)", to: "/ctv/full-tests" },
      { text: "Đề thi nhỏ (Minitest)", to: "/ctv/minitests" },
      { text: "Ngân hàng câu hỏi", to: "/ctv/questions" }, // 🆕 thêm mục này
    ],
  },
  {
    main: { text: "Bài học", icon: <SchoolOutlined /> },
    subItems: [
      { text: "Video bài giảng", to: "/ctv/video-lectures" },
      { text: "Lý thuyết & Ngữ pháp", to: "/ctv/grammar" },
      { text: "Từ vựng", to: "/ctv/vocabulary" },
      { text: "Bài tập vận dụng", to: "/ctv/practice" },
    ],
  },
  {
    main: { text: "Báo cáo", icon: <BarChartOutlined />, to: "/ctv/reports" },
  },
];

const Sidebar: React.FC = () => {
  const [open, setOpen] = useState<{ [key: string]: boolean }>({});
  const theme = useTheme();
  const location = useLocation();

  const handleClick = (mainItemText: string) => {
    setOpen((prevOpen) => ({
      ...prevOpen,
      [mainItemText]: !prevOpen[mainItemText],
    }));
  };

  // check xem đường dẫn hiện tại có thuộc group con không
  const isParentActive = (item: any) => {
    if (!item.subItems) return false;
    return item.subItems.some(
      (sub: any) =>
        location.pathname === sub.to ||
        location.pathname.startsWith(sub.to + "/")
    );
  };

  // check active cho subItem
  const isSubActive = (sub: any) => {
    return (
      location.pathname === sub.to || location.pathname.startsWith(sub.to + "/")
    );
  };

  return (
    <Box
      sx={{
        height: "100vh",
        width: 256,
        p: 2,
        display: "flex",
        flexDirection: "column",
        bgcolor: theme.palette.background.paper,
        borderRight: `1px solid ${theme.palette.divider}`,
      }}
    >
      {/* Logo */}
      <Box className="flex items-center space-x-2 mb-8">
        <Typography
          variant="h6"
          sx={{ fontWeight: "bold", color: theme.palette.primary.main }}
        >
          Sitemark
        </Typography>
      </Box>

      {/* Section Title */}
      <Typography
        variant="subtitle2"
        sx={{
          fontSize: "0.75rem",
          fontWeight: 600,
          textTransform: "uppercase",
          color: theme.palette.text.secondary,
          mb: 2,
        }}
      >
        Quản lý nội dung
      </Typography>

      {/* Menu Items */}
      <List sx={{ flexGrow: 1 }}>
        {sidebarStructure.map((item, index) => {
          const active =
            (item.main.to &&
              (location.pathname === item.main.to ||
                location.pathname.startsWith(item.main.to + "/"))) ||
            isParentActive(item);

          return (
            <div key={index}>
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <ListItemButton
                  component={item.main.to ? Link : "div"}
                  to={item.main.to || ""}
                  onClick={() => {
                    if (item.subItems) handleClick(item.main.text);
                  }}
                  sx={{
                    borderRadius: 2,
                    mb: 0.5,
                    color: active
                      ? theme.palette.primary.main
                      : theme.palette.text.secondary,
                    bgcolor: active
                      ? theme.palette.action.selected
                      : "transparent",
                    "&:hover": { bgcolor: theme.palette.action.hover },
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
                  <ListItemText primary={item.main.text} />
                  {item.subItems &&
                    (open[item.main.text] || isParentActive(item) ? (
                      <ExpandLess />
                    ) : (
                      <ExpandMore />
                    ))}
                </ListItemButton>
              </motion.div>

              {/* Sub Items */}
              {item.subItems && (
                <Collapse
                  in={open[item.main.text] || isParentActive(item)}
                  timeout="auto"
                  unmountOnExit
                >
                  <List component="div" disablePadding>
                    {item.subItems.map((subItem, subIndex) => {
                      const subActive = isSubActive(subItem);
                      return (
                        <motion.div
                          key={subIndex}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <ListItemButton
                            component={Link}
                            to={subItem.to}
                            sx={{
                              borderRadius: 2,
                              pl: 4,
                              mb: 0.5,
                              color: subActive
                                ? theme.palette.primary.main
                                : theme.palette.text.secondary,
                              bgcolor: subActive
                                ? theme.palette.action.selected
                                : "transparent",
                              "&:hover": {
                                bgcolor: theme.palette.action.hover,
                              },
                            }}
                          >
                            <ListItemText primary={subItem.text} />
                          </ListItemButton>
                        </motion.div>
                      );
                    })}
                  </List>
                </Collapse>
              )}
            </div>
          );
        })}
      </List>
    </Box>
  );
};

export default Sidebar;
