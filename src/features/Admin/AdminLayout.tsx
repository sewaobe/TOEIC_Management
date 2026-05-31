import { Box, CssBaseline, ThemeProvider } from "@mui/material";
import { useState, useMemo } from "react";
import { Outlet } from "react-router-dom";
import AdminSidebar from "./components/AdminSidebar.tsx";
import Header from "../Collaborator/components/Header"; // 🔁 tái sử dụng header
import { lightTheme, darkTheme } from "../../theme";
import FloatingWindowManager from "../../components/global/FloatingWindowManager";
import GlobalFab from "../../components/global/GlobalFab";
import { useSelector } from "react-redux";
import { RootState } from "../../stores/store";
import { AnimatePresence } from "framer-motion";
import { FadeUp } from "../../components/animations/motionWrappers";

export default function AdminLayout() {
  const [mode, setMode] = useState<"light" | "dark">("light");
  const theme = useMemo(() => (mode === "light" ? lightTheme : darkTheme), [mode]);
  const toggleTheme = () => setMode((prev) => (prev === "light" ? "dark" : "light"));

  const visibleGlobalFab = useSelector((state: RootState) => state.fab.visible);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          display: "flex",
          height: "100vh",
          bgcolor: theme.palette.background.default,
          color: theme.palette.text.primary,
          overflow: "hidden",
        }}
      >
        <AdminSidebar /> {/* 🔁 Sidebar riêng cho Admin */}
        <Box sx={{ display: "flex", flexDirection: "column", flex: 1, minWidth: 0 }}>
          <Header toggleTheme={toggleTheme} isDarkMode={mode === "dark"} />
          <Box
            sx={{
              flex: 1,
              minWidth: 0,
              maxWidth: "100%",
              overflow: "auto",
              p: 2,
              boxSizing: "border-box",
            }}
            id="layout_container"
          >
            <Outlet /> {/* Render nội dung từng trang */}
          </Box>
        </Box>

        <FloatingWindowManager />
        <AnimatePresence>
          {visibleGlobalFab && (
            <FadeUp>
              <GlobalFab />
            </FadeUp>
          )}
        </AnimatePresence>
      </Box>
    </ThemeProvider>
  );
}
