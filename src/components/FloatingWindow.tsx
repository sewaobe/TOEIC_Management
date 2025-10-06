import { useState, useEffect, useRef, ReactNode } from "react";
import { Box, Paper, IconButton, Tooltip, Zoom } from "@mui/material";
import { OpenInNew, Close, Minimize, OpenInFull } from "@mui/icons-material";

interface FloatingWindowProps {
  title?: string;
  children: ReactNode;
  width?: string | number;
  height?: string | number;
  defaultFloating?: boolean;
  onFloatChange?: (isFloating: boolean) => void; // ✅ thêm dòng này
  onClose?: () => void; // ✅ callback đóng (nếu cần)
}


type ResizeDirection =
  | "right"
  | "bottom"
  | "left"
  | "top"
  | "top-left"
  | "top-right"
  | "bottom-left"
  | "bottom-right"
  | null;

export default function FloatingWindow({
  title = "Cửa sổ nổi",
  children,
  width = "80vw",
  height = "80vh",
  defaultFloating = false,
  onFloatChange,
  onClose,
}: FloatingWindowProps) {
  const [isFloating, setIsFloating] = useState(defaultFloating);
  const [isMinimized, setIsMinimized] = useState(false);
  const [position, setPosition] = useState({ x: 100, y: 80 });
  const [size, setSize] = useState({
    width: typeof width === "string" ? 800 : Number(width),
    height: typeof height === "string" ? 600 : Number(height),
  });
  const [dragging, setDragging] = useState(false);
  const [resizeDir, setResizeDir] = useState<ResizeDirection>(null);

  const offset = useRef({ x: 0, y: 0 });
  const resizeStart = useRef({ x: 0, y: 0, w: 0, h: 0, px: 0, py: 0 });

  // ======= Handle Drag & Resize =======
  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      // Drag
      if (dragging) {
        setPosition({
          x: e.clientX - offset.current.x,
          y: e.clientY - offset.current.y,
        });
      }

      // Resize
      if (resizeDir) {
        const dx = e.clientX - resizeStart.current.x;
        const dy = e.clientY - resizeStart.current.y;

        let newWidth = resizeStart.current.w;
        let newHeight = resizeStart.current.h;
        let newX = resizeStart.current.px;
        let newY = resizeStart.current.py;

        if (resizeDir.includes("right")) newWidth = resizeStart.current.w + dx;
        if (resizeDir.includes("bottom"))
          newHeight = resizeStart.current.h + dy;
        if (resizeDir.includes("left")) {
          newWidth = resizeStart.current.w - dx;
          newX = resizeStart.current.px + dx;
        }
        if (resizeDir.includes("top")) {
          newHeight = resizeStart.current.h - dy;
          newY = resizeStart.current.py + dy;
        }

        setSize({
          width: Math.max(300, newWidth),
          height: Math.max(200, newHeight),
        });
        setPosition({ x: newX, y: newY });
      }
    };

    const handleUp = () => {
      setDragging(false);
      setResizeDir(null);
    };

    document.addEventListener("mousemove", handleMove);
    document.addEventListener("mouseup", handleUp);
    return () => {
      document.removeEventListener("mousemove", handleMove);
      document.removeEventListener("mouseup", handleUp);
    };
  }, [dragging, resizeDir]);

  // ======= Normal Mode =======
  if (!isFloating) {
    return (
      <Box className="relative h-full w-full">
        {/* ✅ Nút mở dạng cửa sổ nổi */}
        <Zoom in timeout={400}>
          <Tooltip title="Mở dạng cửa sổ nổi">
            <IconButton
              onClick={() => {
                setIsFloating(true);
                onFloatChange?.(true); // ✅ báo ra ngoài rằng đang nổi
              }}
              sx={{
                position: "fixed",
                bottom: 32,
                right: 32,
                zIndex: 1500,
                bgcolor: "primary.main",
                color: "white",
                boxShadow: 4,
                transition: "transform 0.25s ease-in-out",
                "&:hover": {
                  bgcolor: "primary.dark",
                  transform: "scale(1.1)",
                },
              }}
            >
              <OpenInNew />
            </IconButton>
          </Tooltip>
        </Zoom>

        {/* Nội dung gốc trong trang */}
        {children}
      </Box>
    );
  }

  // ======= Floating Mode =======
  return (
    <Paper
      elevation={8}
      className="fixed z-[9999] shadow-lg rounded-xl border bg-white overflow-hidden"
      sx={{
        width: isMinimized ? 260 : size.width,
        height: isMinimized ? 60 : size.height,
        left: position.x,
        top: position.y,
        transition:
          dragging || resizeDir ? "none" : "width 0.25s, height 0.25s",
        cursor: "default",
      }}
    >
      {/* Header draggable */}
      <Box
        sx={{
          bgcolor: "primary.main",
          color: "white",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          p: 1,
          userSelect: "none",
          cursor: "default",
        }}
        onMouseDown={(e) => {
          setDragging(true);
          offset.current = {
            x: e.clientX - position.x,
            y: e.clientY - position.y,
          };
        }}
      >
        <Box className="font-semibold text-sm ml-2">{title}</Box>

        {/* Nút chức năng */}
        <Box className="flex items-center">
          {/* Thu nhỏ / phóng to */}
          <Tooltip title={isMinimized ? "Phóng to" : "Thu nhỏ"}>
            <IconButton
              size="small"
              sx={{ color: "white" }}
              onClick={() => setIsMinimized((p) => !p)}
            >
              {isMinimized ? (
                <OpenInFull fontSize="small" />
              ) : (
                <Minimize fontSize="small" />
              )}
            </IconButton>
          </Tooltip>

          {/* Đóng */}
          <Tooltip title="Đóng cửa sổ nổi">
            <IconButton
              size="small"
              sx={{ color: "white" }}
              onClick={() => {
                setIsFloating(false);
                onFloatChange?.(false); // ✅ báo ra ngoài rằng đã tắt nổi
                onClose?.(); // ✅ callback riêng (nếu có)
              }}
            >
              <Close fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {/* Nội dung */}
      {!isMinimized && (
        <Box className="h-full overflow-auto bg-gray-50">{children}</Box>
      )}

      {/* ✅ Resize Handles (8 hướng) */}
      {[
        { dir: "top", style: { top: 0, left: 0, right: 0, height: 8, cursor: "ns-resize" } },
        { dir: "bottom", style: { bottom: 0, left: 0, right: 0, height: 8, cursor: "ns-resize" } },
        { dir: "left", style: { top: 0, bottom: 0, left: 0, width: 8, cursor: "ew-resize" } },
        { dir: "right", style: { top: 0, bottom: 0, right: 0, width: 8, cursor: "ew-resize" } },
        { dir: "top-left", style: { top: 0, left: 0, width: 12, height: 12, cursor: "nwse-resize" } },
        { dir: "top-right", style: { top: 0, right: 0, width: 12, height: 12, cursor: "nesw-resize" } },
        { dir: "bottom-left", style: { bottom: 0, left: 0, width: 12, height: 12, cursor: "nesw-resize" } },
        { dir: "bottom-right", style: { bottom: 0, right: 0, width: 12, height: 12, cursor: "nwse-resize" } },
      ].map((handle) => (
        <Box
          key={handle.dir}
          onMouseDown={(e) => {
            setResizeDir(handle.dir as ResizeDirection);
            resizeStart.current = {
              x: e.clientX,
              y: e.clientY,
              w: size.width,
              h: size.height,
              px: position.x,
              py: position.y,
            };
          }}
          sx={{
            position: "absolute",
            ...handle.style,
            zIndex: 10,
          }}
        />
      ))}
    </Paper>
  );
}
