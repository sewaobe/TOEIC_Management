import { Box, CssBaseline, ThemeProvider } from "@mui/material";
import { useState, useMemo } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import { lightTheme, darkTheme } from "../../theme";
import FloatingWindowManager from "../../components/global/FloatingWindowManager"; // ✅ import Manager

const CollaboratorLayout = () => {
  const [mode, setMode] = useState<"light" | "dark">("light");

  const theme = useMemo(
    () => (mode === "light" ? lightTheme : darkTheme),
    [mode]
  );

  const toggleTheme = () => {
    setMode((prev) => (prev === "light" ? "dark" : "light"));
  };

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
        {/* Sidebar cố định */}
        <Sidebar />

        {/* Khu vực chính */}
        <Box sx={{ display: "flex", flexDirection: "column", flex: 1 }}>
          <Header toggleTheme={toggleTheme} isDarkMode={mode === "dark"} />

          <Box
            sx={{ flex: 1, overflow: "auto", p: 2 }}
            id="layout_container"
          >
            <Outlet /> {/* React Router render nội dung con */}
          </Box>
        </Box>

        {/* ✅ Cửa sổ nổi toàn cục (render xuyên route) */}
        <FloatingWindowManager />
      </Box>
    </ThemeProvider>
  );
};

export default CollaboratorLayout;
