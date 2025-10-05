import { createTheme } from "@mui/material/styles"
import { alpha } from "@mui/material"

declare module "@mui/material/styles" {
  interface Palette {
    infoCard: Palette["primary"]
    warningCard: Palette["primary"]
    dangerCard: Palette["primary"]
    neutralCard: Palette["primary"]
  }
  interface PaletteOptions {
    infoCard?: PaletteOptions["primary"]
    warningCard?: PaletteOptions["primary"]
    dangerCard?: PaletteOptions["primary"]
    neutralCard?: PaletteOptions["primary"]
  }
}

/* 🌞 LIGHT THEME — Bright Academic Dashboard */
export const lightTheme = createTheme({
  palette: {
    mode: "light",

    // 🔵 Xanh học thuật - tạo cảm giác chuyên nghiệp & tin cậy
    primary: {
      main: "#1D4ED8",
      light: "#60A5FA",
      dark: "#1E3A8A",
      contrastText: "#FFFFFF",
    },

    // 🟠 Cam năng lượng - nhấn mạnh sự năng động, hành động
    secondary: {
      main: "#F97316",
      light: "#FDBA74",
      dark: "#C2410C",
      contrastText: "#FFFFFF",
    },

    // 🟢 Thành công - tươi mới & truyền cảm hứng
    success: {
      main: "#10B981",
      light: "#A7F3D0",
      dark: "#065F46",
      contrastText: "#FFFFFF",
    },

    // 🟡 Cảnh báo - nhẹ nhàng, ấm áp
    warning: {
      main: "#F59E0B",
      light: "#FEF3C7",
      dark: "#B45309",
      contrastText: "#FFFFFF",
    },

    // 🔴 Lỗi - rõ ràng nhưng không gắt
    error: {
      main: "#EF4444",
      light: "#FEE2E2",
      dark: "#991B1B",
      contrastText: "#FFFFFF",
    },

    // 🎨 Các thẻ card pastel gradient
    infoCard: {
      main: "#3B82F6",
      light: alpha("#DBEAFE", 0.95),
    },
    warningCard: {
      main: "#F59E0B",
      light: alpha("#FEF3C7", 0.95),
    },
    dangerCard: {
      main: "#EF4444",
      light: alpha("#FEE2E2", 0.95),
    },
    neutralCard: {
      main: "#6B7280",
      light: alpha("#F3F4F6", 0.95),
    },

    // 🌤 Nền sáng, tươi và dễ chịu cho mắt
    background: {
      default: "#F8FAFC",
      paper: "#FFFFFF",
    },

    // ✍️ Màu chữ rõ ràng
    text: {
      primary: "#111827",
      secondary: "#6B7280",
    },
  },

  typography: {
    fontFamily: "Inter, sans-serif",
    h1: { fontFamily: "Montserrat, sans-serif", fontWeight: 700 },
    h2: { fontFamily: "Montserrat, sans-serif", fontWeight: 700 },
    h3: { fontFamily: "Montserrat, sans-serif", fontWeight: 700 },
    button: { fontFamily: "Montserrat, sans-serif", fontWeight: 600 },
  },

  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          transition: "all 0.3s ease",
          "&:hover": { boxShadow: "0 4px 20px rgba(0,0,0,0.08)" },
        },
      },
    },
  },
})

/* 🌚 DARK THEME — Elegant Night Mode */
export const darkTheme = createTheme({
  palette: {
    mode: "dark",

    // 🔵 Xanh sáng - giữ tông học thuật, không quá chói
    primary: {
      main: "#60A5FA",
      light: "#93C5FD",
      dark: "#1E3A8A",
      contrastText: "#FFFFFF",
    },

    // 🟠 Cam trầm - vẫn năng lượng nhưng ít sáng hơn
    secondary: {
      main: "#F59E0B",
      light: "#FBBF24",
      dark: "#92400E",
      contrastText: "#FFFFFF",
    },

    // 🟢 Thành công - ngọc sáng, phù hợp nền tối
    success: {
      main: "#34D399",
      light: "#6EE7B7",
      dark: "#065F46",
      contrastText: "#FFFFFF",
    },

    // 🟡 Cảnh báo - vàng ấm, nhẹ nhàng trên nền đen
    warning: {
      main: "#FBBF24",
      light: "#FCD34D",
      dark: "#92400E",
      contrastText: "#111827",
    },

    // 🔴 Lỗi - đỏ neon vừa phải
    error: {
      main: "#F87171",
      light: "#FCA5A5",
      dark: "#7F1D1D",
      contrastText: "#FFFFFF",
    },

    // 🌌 Các card pastel tương phản nhẹ nhàng hơn
    infoCard: {
      main: "#60A5FA",
      light: alpha("#1E3A8A", 0.85),
    },
    warningCard: {
      main: "#FBBF24",
      light: alpha("#78350F", 0.85),
    },
    dangerCard: {
      main: "#F87171",
      light: alpha("#7F1D1D", 0.85),
    },
    neutralCard: {
      main: "#9CA3AF",
      light: alpha("#1F2937", 0.9),
    },

    // 🌑 Nền đen pha xanh – sang và dễ nhìn
    background: {
      default: "#0F172A",
      paper: "#1E293B",
    },

    // ✍️ Văn bản sáng, dịu mắt
    text: {
      primary: "#F9FAFB",
      secondary: "#CBD5E1",
    },
  },

  typography: {
    fontFamily: "Inter, sans-serif",
    h1: { fontFamily: "Montserrat, sans-serif", fontWeight: 700 },
    h2: { fontFamily: "Montserrat, sans-serif", fontWeight: 700 },
    h3: { fontFamily: "Montserrat, sans-serif", fontWeight: 700 },
    button: { fontFamily: "Montserrat, sans-serif", fontWeight: 600 },
  },

  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          backgroundImage: "none",
          transition: "all 0.3s ease",
          "&:hover": { boxShadow: "0 4px 20px rgba(255,255,255,0.05)" },
        },
      },
    },
  },
})
