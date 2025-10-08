import * as React from "react";
import { useState, useEffect, useRef } from "react";
import {
  Box,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Typography,
  Divider,
  Slide,
} from "@mui/material";
import { ArrowBackIosNewOutlined, ChevronRightOutlined } from "@mui/icons-material";
import type { MenuItemType } from "../types/MenuItemType";

interface NestedMenuProps {
  anchorEl: HTMLElement | null;
  onClose: () => void;
  menuData: MenuItemType[];
  width?: number;
}

type Layer = { menu: MenuItemType[]; title?: string; nodeId?: string };

const NestedMenu: React.FC<NestedMenuProps> = ({
  anchorEl,
  onClose,
  menuData,
  width = 260,
}) => {
  const [stack, setStack] = useState<Layer[]>([{ menu: menuData }]);
  const [direction, setDirection] = useState<"left" | "right">("left");
  const [menuHeight, setMenuHeight] = useState<number | "auto">("auto");
  const containerRef = useRef<HTMLDivElement>(null);
  const open = Boolean(anchorEl);

  // Reset về cấp đầu khi đóng
  useEffect(() => {
    if (!open) setStack([{ menu: menuData }]);
  }, [open, menuData]);

  // Tự động đo chiều cao layer hiện tại
  useEffect(() => {
    const el = containerRef.current;
    if (el) {
      const activeLayer = el.querySelector(".menu-layer-active") as HTMLElement | null;
      if (activeLayer) {
        setMenuHeight(activeLayer.offsetHeight);
      }
    }
  }, [stack]);

  const handleItemClick = (item: MenuItemType) => {
    if (item.children?.length) {
      setDirection("left");
      setStack((prev) => [
        ...prev,
        { menu: item.children!, title: item.label, nodeId: item.id },
      ]);
    } else if (item.action) {
      item.action();
      onClose();
    }
  };

  const handleBack = () => {
    setDirection("right");
    setStack((prev) => prev.slice(0, -1));
  };

  return (
    <Menu
      anchorEl={anchorEl}
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width,
          borderRadius: 2,
          overflow: "hidden",
          boxShadow: "0px 6px 16px rgba(0,0,0,0.12)",
          transition: "height 0.25s ease",
          height: menuHeight === "auto" ? "auto" : `${menuHeight}px`,
        },
      }}
    >
      <Box ref={containerRef} sx={{ position: "relative", width }}>
        {stack.map((layer, idx) => (
          <Slide
            key={idx}
            in={idx === stack.length - 1}
            direction={direction}
            mountOnEnter
            unmountOnExit
            timeout={250}
          >
            <Box
              className={idx === stack.length - 1 ? "menu-layer-active" : ""}
              sx={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                bgcolor: "background.paper",
                p: 1,
              }}
            >
              {idx > 0 && (
                <>
                  <MenuItem
                    onClick={handleBack}
                    sx={{
                      py: 1.2,
                      color: "text.secondary",
                      fontWeight: 600,
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      borderBottom: "1px solid",
                      borderColor: "divider",
                    }}
                  >
                    <ArrowBackIosNewOutlined sx={{ fontSize: 16 }} />
                    <Typography variant="body2">Quay lại {layer.title}</Typography>
                  </MenuItem>
                  <Divider />
                </>
              )}

              {layer.menu.map((item) => {
                const content =
                  typeof item.component === "function"
                    ? (item.component as () => React.ReactNode)()
                    : item.component;

                if (content) {
                  return (
                    <Box key={item.id} sx={{ p: 0.5 }}>
                      {content}
                    </Box>
                  );
                }

                return (
                  <MenuItem
                    key={item.id}
                    onClick={() => handleItemClick(item)}
                    sx={{
                      py: 1,
                      borderRadius: 1,
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      "&:hover": { backgroundColor: "action.hover" },
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1.2 }}>
                      {item.icon && (
                        <ListItemIcon sx={{ minWidth: 30 }}>{item.icon}</ListItemIcon>
                      )}
                      <ListItemText
                        primary={
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            {item.label}
                          </Typography>
                        }
                      />
                    </Box>
                    {item.children && (
                      <ChevronRightOutlined sx={{ fontSize: 18, opacity: 0.6 }} />
                    )}
                  </MenuItem>
                );
              })}
            </Box>
          </Slide>
        ))}
      </Box>
    </Menu>
  );
};

export default NestedMenu;
