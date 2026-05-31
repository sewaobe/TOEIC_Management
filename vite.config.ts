import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5174
  },

  esbuild: {
    drop: ["console", "debugger"]
  },

  build: {
    // Tăng giới hạn cảnh báo dung lượng chunk (mặc định 500kb)
    chunkSizeWarningLimit: 1000,

    rollupOptions: {
      output: {
        manualChunks: {
          // 1. Core React & State Management
          react_core: [
            "react",
            "react-dom",
            "react-router-dom",
            "react-redux",
            "@reduxjs/toolkit"
          ],

          // 2. Base UI & Styling (Thường dùng ở mọi nơi)
          mui_base: [
            "@mui/material",
            "@mui/icons-material",
            "@emotion/react",
            "@emotion/styled"
          ],

          // 3. Advanced UI (Nặng, chỉ load ở màn hình biểu đồ hoặc chọn ngày)
          mui_pro: [
            "@mui/x-charts",
            "@mui/x-date-pickers-pro"
          ],

          // 4. Quản lý Form & Validation
          forms: [
            "react-hook-form",
            "@hookform/resolvers",
            "zod"
          ],

          // 5. Kéo thả (Drag & Drop)
          dnd: [
            "@dnd-kit/core",
            "@dnd-kit/modifiers",
            "@dnd-kit/sortable",
            "@dnd-kit/utilities"
          ],

          // 6. Trình soạn thảo (Cực kỳ nặng)
          editors: [
            "@milkdown/crepe",
            "@milkdown/react",
            "@milkdown/kit",
            "react-quill",
            "quill",
            "quill-image-resize-module-react",
            "@uiw/react-md-editor",
            "@uiw/react-markdown-preview"
          ],

          // 7. Media, Animations & UI Utils
          media_motion: [
            "video.js",
            "videojs-youtube",
            "lottie-web",
            "framer-motion",
            "swiper",
            "react-joyride",
            "sonner"
          ],

          // 8. Dịch vụ bên thứ 3 (Nặng và thường cập nhật độc lập)
          sentry: ["@sentry/react"],

          // 9. Tiện ích và Mạng
          utils: [
            "axios",
            "socket.io-client",
            "date-fns",
            "idb-keyval"
          ]
        }
      }
    }
  }
});