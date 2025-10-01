import React from "react";
import { AppBar, Toolbar, IconButton, Tooltip} from "@mui/material";
import {
  FlashOnOutlined,
  DarkModeOutlined,
  LightModeOutlined,
  SettingsOutlined,
} from "@mui/icons-material";

interface HeaderProps {
  toggleTheme: () => void;
  isDarkMode: boolean;
}

const Header: React.FC<HeaderProps> = ({ toggleTheme, isDarkMode }) => {
  return (
    <AppBar
      position="static"
      elevation={0}
      sx={{
        backgroundColor: "background.paper",
        color: "text.primary",
        borderBottom: "1px solid",
        borderColor: (theme) =>
          theme.palette.mode === "dark" ? "grey.800" : "grey.200",
      }}
    >
      <Toolbar sx={{ justifyContent: "flex-end", gap: 1 }}>
        <Tooltip title="Chế độ Blitz">
          <IconButton color="primary">
            <FlashOnOutlined />
          </IconButton>
        </Tooltip>

        <Tooltip title="Chủ đề tùy chỉnh">
          <IconButton
            onClick={toggleTheme}
            sx={{
              transition: "transform 0.2s",
              "&:hover": { transform: "scale(1.1)" },
            }}
          >
            {isDarkMode ? <LightModeOutlined /> : <DarkModeOutlined />}
          </IconButton>
        </Tooltip>

        <Tooltip title="Cài đặt">
          <IconButton>
            <SettingsOutlined />
          </IconButton>
        </Tooltip>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
