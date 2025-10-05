import { useState, useEffect, useRef, ReactNode } from "react";
import { Box, Paper, IconButton, Tooltip } from "@mui/material";
import { OpenInNew, Close, Minimize, OpenInFull } from "@mui/icons-material";

interface FloatingWindowProps {
  title?: string;
  children: ReactNode;
  width?: string | number;
  height?: string | number;
  defaultFloating?: boolean;
}

export default function FloatingWindow({
  title = "Cửa sổ nổi",
  children,
  width = "80vw",
  height = "80vh",
  defaultFloating = false,
}: FloatingWindowProps) {
  const [isFloating, setIsFloating] = useState(defaultFloating);
  const [isMinimized, setIsMinimized] = useState(false);
  const [position, setPosition] = useState({ x: 100, y: 80 });
  const [size, setSize] = useState({
    width: typeof width === "string" ? 800 : Number(width),
    height: typeof height === "string" ? 600 : Number(height),
  });
  const [dragging, setDragging] = useState(false);
  const [resizing, setResizing] = useState(false);
  const offset = useRef({ x: 0, y: 0 });
  const resizeStart = useRef({ x: 0, y: 0, w: 0, h: 0 });

  // ======= Handle Drag =======
  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      if (dragging) {
        setPosition({
          x: e.clientX - offset.current.x,
          y: e.clientY - offset.current.y,
        });
      }
      if (resizing) {
        const dx = e.clientX - resizeStart.current.x;
        const dy = e.clientY - resizeStart.current.y;
        setSize({
          width: Math.max(300, resizeStart.current.w + dx),
          height: Math.max(200, resizeStart.current.h + dy),
        });
      }
    };
    const handleUp = () => {
      setDragging(false);
      setResizing(false);
    };
    document.addEventListener("mousemove", handleMove);
    document.addEventListener("mouseup", handleUp);
    return () => {
      document.removeEventListener("mousemove", handleMove);
      document.removeEventListener("mouseup", handleUp);
    };
  }, [dragging, resizing]);

  // ======= Normal Mode =======
  if (!isFloating) {
    return (
      <Box className="relative h-full w-full">
        <Tooltip title="Mở dạng cửa sổ nổi">
          <IconButton
            onClick={() => setIsFloating(true)}
            sx={{
              position: "absolute",
              top: 8,
              right: 8,
              zIndex: 20,
              bgcolor: "white",
              border: "1px solid #ddd",
              "&:hover": { bgcolor: "grey.100" },
            }}
          >
            <OpenInNew fontSize="small" />
          </IconButton>
        </Tooltip>

        {children}
      </Box>
    );
  }

  // ======= Floating Mode =======
  return (
    <Paper
      elevation={8}
      className="fixed z-50 shadow-lg rounded-xl border bg-white overflow-hidden"
      sx={{
        width: isMinimized ? 260 : size.width,
        height: isMinimized ? 60 : size.height,
        left: position.x,
        top: position.y,
        transition: dragging || resizing ? "none" : "width 0.25s, height 0.25s",
        cursor: dragging ? "grabbing" : "default",
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
          cursor: "grab",
          userSelect: "none",
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
        <Box className="flex items-center">
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
          <Tooltip title="Đóng cửa sổ nổi">
            <IconButton
              size="small"
              sx={{ color: "white" }}
              onClick={() => setIsFloating(false)}
            >
              <Close fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {/* Content */}
      {!isMinimized && (
        <Box className="h-full overflow-auto bg-gray-50">{children}</Box>
      )}

      {/* ✅ Resize handle (góc phải dưới) */}
      {!isMinimized && (
        <Box
          onMouseDown={(e) => {
            setResizing(true);
            resizeStart.current = {
              x: e.clientX,
              y: e.clientY,
              w: size.width,
              h: size.height,
            };
          }}
          sx={{
            position: "absolute",
            right: 0,
            bottom: 0,
            width: 16,
            height: 16,
            cursor: "nwse-resize",
            bgcolor: "transparent",
          }}
        />
      )}
    </Paper>
  );
}
