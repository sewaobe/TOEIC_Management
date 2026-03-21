import React, { useState, useEffect, useMemo, useRef, useCallback } from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Tooltip,
  Avatar,
  Divider,
  Box,
  Typography,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Switch,
  Alert,
  Slide,
} from "@mui/material";
import {
  FlashOnOutlined,
  DarkModeOutlined,
  LightModeOutlined,
  SettingsOutlined,
  PersonOutline,
  LogoutOutlined,
  SendOutlined,
  ArrowBackIosNewOutlined,
  ChevronRightOutlined,
} from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../stores/store";
import { logout } from "../../../stores/userSlice";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import authService from "../../../services/auth.service";
import NotificationDropdown from "../../../components/NotificationDropdown";
import { useNotificationWPViewModel } from "../../../viewmodels/useNotificationWPViewModel";

// ====================
// 🧩 Interface
// ====================
interface HeaderProps {
  toggleTheme: () => void;
  isDarkMode: boolean;
}

interface MenuItemType {
  id: string;
  label: string;
  icon?: React.ReactNode;
  action?: () => void;
  children?: MenuItemType[];
  component?: React.ReactNode | (() => React.ReactNode);
}

// ====================
// 🧩 Component Header
// ====================
const Header: React.FC<HeaderProps> = ({ toggleTheme, isDarkMode }) => {
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state.user.user);
  const navigate = useNavigate();

  const vapidKey = import.meta.env.VITE_VAPID_PUBLIC_KEY!;
  const { subscribed, loading, enableNotifications, disableNotifications, sendTest } =
    useNotificationWPViewModel(user ? user._id : "", vapidKey);

  // --- State for Optimistic UI ---
  const [isToggling, setIsToggling] = useState(false);
  const [optimisticSubscribed, setOptimisticSubscribed] = useState(subscribed);

  // Sync optimistic state with the real state from the hook
  useEffect(() => {
    setOptimisticSubscribed(subscribed);
  }, [subscribed]);

  // --- Handlers (wrapped in useCallback for optimization) ---
  const handleToggleNotif = useCallback(async () => {
    if (Notification.permission === "denied") {
      toast.warning("Vui lòng bật lại quyền thông báo trong trình duyệt!");
      return;
    }

    // Fast path: Disabling notification
    if (optimisticSubscribed) {
      setIsToggling(true);
      await disableNotifications().catch(() => { /* Handle potential error */ });
      // The useEffect will sync `optimisticSubscribed` to the new `subscribed` value
      setIsToggling(false);
      toast.info("Đã tắt thông báo Web Push");
      return;
    }

    // Slow path: Enabling notification with Optimistic UI
    setIsToggling(true);
    setOptimisticSubscribed(true); // INSTANT UI UPDATE

    try {
      await enableNotifications(); // Run the 5-second action in the background
      toast.success("Đã bật thông báo Web Push");
    } catch {
      toast.error("Không thể bật thông báo, vui lòng thử lại.");
      setOptimisticSubscribed(false); // ROLLBACK on failure
    } finally {
      setIsToggling(false);
    }
  }, [optimisticSubscribed, disableNotifications, enableNotifications]);
  
  const handleSendTest = useCallback(async () => {
    try {
      await sendTest();
      toast.success("Đã gửi thử thông báo");
    } catch {
      toast.error("Không thể gửi thử thông báo");
    }
  }, [sendTest]);

  const handleLogout = useCallback(async () => {
    await toast.promise(
      (async () => {
        try {
          await authService.logout();
        } finally {
          dispatch(logout());
          navigate("/");
        }
      })(),
      {
        loading: "Đang đăng xuất...",
        success: "Đăng xuất thành công 👋",
        error: "Đăng xuất thất bại, vui lòng thử lại!",
      }
    );
  }, [dispatch, navigate]);
  
  // ====================
  // 🧩 MENU_STRUCTURE (Single Source of Truth)
  // ====================
  const MENU_STRUCTURE: MenuItemType[] = useMemo(
    () => [
      {
        id: "profile",
        label: "Hồ sơ của tôi",
        icon: <PersonOutline />,
        action: () => toast.info("Đi đến hồ sơ cá nhân"),
      },
      {
        id: "settings",
        label: "Cài đặt",
        icon: <SettingsOutlined />,
        children: [
          {
            id: "webpush",
            label: "Thông báo Web Push",
            component: (
              <Box>
                {Notification.permission === "denied" && (
                  <Alert severity="warning" sx={{ mb: 1, fontSize: 12 }}>
                    Bạn đã chặn quyền thông báo. Hãy bật lại trong trình duyệt!
                  </Alert>
                )}
                <MenuItem
                  disabled={isToggling || loading}
                  sx={{ justifyContent: "space-between", "&:hover": { backgroundColor: "transparent" } }}
                >
                  <ListItemText
                    primary="Thông báo Web Push"
                    secondary={
                      isToggling && optimisticSubscribed
                        ? "Đang bật..."
                        : optimisticSubscribed
                        ? "Đã bật"
                        : "Đã tắt"
                    }
                  />
                  <Switch
                    checked={optimisticSubscribed}
                    disabled={isToggling || loading}
                    onChange={handleToggleNotif}
                    onClick={(e) => e.stopPropagation()}
                    size="small"
                  />
                </MenuItem>
                <MenuItem onClick={handleSendTest} disabled={!optimisticSubscribed || isToggling || loading}>
                  <ListItemText primary="Gửi thử thông báo" />
                  <SendOutlined fontSize="small" />
                </MenuItem>
              </Box>
            ),
          },
        ],
      },
      {
        id: "logout",
        label: "Đăng xuất",
        icon: <LogoutOutlined color="error" />,
        action: handleLogout,
      },
    ],
    [subscribed, loading, handleToggleNotif, isToggling, optimisticSubscribed, handleSendTest, handleLogout]
  );
  
  // ====================
  // 🧩 Menu Navigation Logic using "path"
  // ====================
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [path, setPath] = useState<string[]>([]);
  const [direction, setDirection] = useState<"left" | "right">("left");
  const [menuHeight, setMenuHeight] = useState<number | "auto">("auto");
  const menuLayerRef = useRef<HTMLDivElement>(null);
  const open = Boolean(anchorEl);
  
  const { currentMenu } = useMemo(() => {
    let menu = MENU_STRUCTURE;
    for (const id of path) {
      const parentItem = menu.find((item) => item.id === id);
      if (parentItem?.children) {
        menu = parentItem.children;
      }
    }
    return { currentMenu: menu };
  }, [path, MENU_STRUCTURE]);

  useEffect(() => {
    if (menuLayerRef.current) {
      setMenuHeight(menuLayerRef.current.offsetHeight);
    }
  }, [currentMenu]);
  
  const handleClick = (e: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(e.currentTarget);
  };
  
  const handleClose = () => {
    setAnchorEl(null);
    setTimeout(() => setPath([]), 250);
  };

  const handleItemClick = (item: MenuItemType) => {
    if (item.children?.length) {
      setDirection("left");
      setPath((p) => [...p, item.id]);
    } else if (item.action) {
      item.action();
      handleClose();
    }
  };
  
  const handleBack = () => {
    setDirection("right");
    setPath((p) => p.slice(0, -1));
  };
  
  return (
    <AppBar position="static" elevation={0} sx={{ backgroundColor: "background.paper", color: "text.primary", borderBottom: "1px solid", borderColor: "divider" }}>
      <Toolbar sx={{ justifyContent: "space-between", gap: 1 }}>
        <Box />
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <NotificationDropdown />
          <Tooltip title="Chế độ Blitz">
            <IconButton color="primary">
              <FlashOnOutlined />
            </IconButton>
          </Tooltip>
          <Tooltip title="Chủ đề tùy chỉnh">
            <IconButton onClick={toggleTheme}>
              {isDarkMode ? <LightModeOutlined /> : <DarkModeOutlined />}
            </IconButton>
          </Tooltip>
          <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />
          <Tooltip title="Tài khoản">
            <Box onClick={handleClick} sx={{ display: "flex", alignItems: "center", gap: 1.5, cursor: "pointer", p: "6px 12px", borderRadius: "12px", "&:hover": { backgroundColor: "action.hover" } }}>
              <Avatar src={user ? user.profile.avatar : "*"} sx={{ width: 36, height: 36, background: "linear-gradient(135deg, #2563EB 0%, #3B82F6 100%)", fontSize: "14px", fontWeight: 600, }}></Avatar>
              <Box sx={{ display: { xs: "none", sm: "block" } }}>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>{user ? user.profile.fullname : "Cộng tác viên"}</Typography>
                <Typography variant="caption" color="text.secondary">{user?.role_name === "admin" ? "Quản trị viên" : "Cộng tác viên"}</Typography>
              </Box>
            </Box>
          </Tooltip>
          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            PaperProps={{
              sx: {
                width: 260,
                borderRadius: 2,
                overflow: "hidden",
                boxShadow: "0px 6px 16px rgba(0,0,0,0.12)",
                transition: "height 0.25s ease",
                height: menuHeight === "auto" ? "auto" : `${menuHeight}px`,
              },
            }}
          >
            <Box sx={{ position: "relative", width: 260 }}>
              <Slide direction={direction} in={true} mountOnEnter unmountOnExit timeout={250}>
                <Box ref={menuLayerRef} sx={{ width: "100%", bgcolor: "background.paper", p: 1 }}>
                  {path.length > 0 && (
                    <>
                      <MenuItem onClick={handleBack} sx={{ py: 1.2, color: "text.secondary", fontWeight: 600, display: "flex", alignItems: "center", gap: 1 }}>
                        <ArrowBackIosNewOutlined sx={{ fontSize: 16 }} />
                        <Typography variant="body2">Quay lại</Typography>
                      </MenuItem>
                      <Divider sx={{ mx: -1, mb: 1 }} />
                    </>
                  )}
                  {currentMenu.map((item) => {
                    const content =
                      typeof item.component === "function"
                        ? (item.component as () => React.ReactNode)()
                        : item.component;

                    if (content) {
                      return <Box key={item.id}>{content}</Box>;
                    }

                    return (
                      <MenuItem
                        key={item.id}
                        onClick={() => handleItemClick(item)}
                        sx={{ py: 1, borderRadius: 1, display: "flex", justifyContent: "space-between", alignItems: "center" }}
                      >
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1.2 }}>
                          {item.icon && <ListItemIcon sx={{ minWidth: 30 }}>{item.icon}</ListItemIcon>}
                          <ListItemText primary={<Typography variant="body2" sx={{ fontWeight: 500 }}>{item.label}</Typography>} />
                        </Box>
                        {item.children && <ChevronRightOutlined sx={{ fontSize: 18, opacity: 0.6 }} />}
                      </MenuItem>
                    );
                  })}
                </Box>
              </Slide>
            </Box>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;