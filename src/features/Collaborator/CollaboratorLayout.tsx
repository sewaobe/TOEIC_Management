import { Box, CssBaseline, ThemeProvider } from "@mui/material";
import { useState, useMemo, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import { lightTheme, darkTheme } from "../../theme";
import { initSocket } from "../../services/socket.service";

const CollaboratorLayout = () => {
  const [mode, setMode] = useState<"light" | "dark">("light");
  const theme = useMemo(
    () => (mode === "light" ? lightTheme : darkTheme),
    [mode]
  );

  const toggleTheme = () => {
    setMode((prev) => (prev === "light" ? "dark" : "light"));
  };

  useEffect(() => {
    const socket = initSocket()

    // 🔔 Lắng nghe sự kiện receiveNotification từ server
    socket?.on("receiveNotification", (data) => {
      console.log("📩 Notification received:", data)
      // Bạn có thể show toast, snackbar, hoặc update redux store ở đây
    })

    // Dọn dẹp event khi unmount
    return () => {
      socket?.off("receiveNotification")
    }
  }, [])

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          display: "flex",
          height: "100vh",
          bgcolor: theme.palette.background.default,
          color: theme.palette.text.primary,
          overflow: "hidden"
        }}
      >
        <Sidebar /> {/* Sidebar cố định */}
        <Box sx={{ display: "flex", flexDirection: "column", flex: 1 }}>
          <Header toggleTheme={toggleTheme} isDarkMode={mode === "dark"} />
          <Box sx={{ flex: 1, overflow: "auto", p: 2 }} id="layout_container">
            <Outlet /> {/* React Router render nội dung con */}
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default CollaboratorLayout;
