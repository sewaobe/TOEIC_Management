import React from "react";
import { Box, MenuItem, ListItemText, Switch, Alert } from "@mui/material";
import { SendOutlined } from "@mui/icons-material";

interface WebPushSettingsProps {
  subscribed: boolean;
  loading: boolean;
  handleToggleNotif: () => void;
  handleSendTest: () => void;
}

export const WebPushSettings: React.FC<WebPushSettingsProps> = ({
  subscribed,
  loading,
  handleToggleNotif,
  handleSendTest,
}) => (
  <Box sx={{ p: 1 }}>
    {Notification.permission === "denied" && (
      <Alert severity="warning" sx={{ mb: 1, fontSize: 12 }}>
        Bạn đã chặn quyền thông báo. Hãy bật lại trong trình duyệt!
      </Alert>
    )}
    <MenuItem
      disabled={loading}
      sx={{
        display: "flex",
        justifyContent: "space-between",
        borderRadius: 1,
        py: 1.5,
        px: 1.5,
        "&:hover": { backgroundColor: "transparent" },
      }}
    >
      <ListItemText
        primary="Thông báo Web Push"
        secondary={subscribed ? "Đã bật" : "Đã tắt"}
        primaryTypographyProps={{ fontSize: 14, fontWeight: 500 }}
        secondaryTypographyProps={{ fontSize: 12 }}
      />
      <Switch
        checked={subscribed}
        onClick={(e) => e.stopPropagation()}
        onMouseDown={(e) => e.stopPropagation()}
        onChange={(e) => {
          e.stopPropagation();
          void handleToggleNotif();
        }}
        color="primary"
        size="small"
      />
    </MenuItem>

    <MenuItem
      onClick={(e) => {
        e.stopPropagation();
        void handleSendTest();
      }}
      disabled={!subscribed}
      sx={{
        mt: 0.5,
        py: 1.5,
        px: 1.5,
        borderRadius: 1,
        "&:hover": { backgroundColor: "action.hover" },
      }}
    >
      <ListItemText
        primary="Gửi thử thông báo"
        primaryTypographyProps={{ fontSize: 14, fontWeight: 500 }}
      />
      <SendOutlined fontSize="small" />
    </MenuItem>
  </Box>
);
