import * as React from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  SpeedDial,
  SpeedDialIcon,
  SpeedDialAction,
  Popover,
  List,
  ListItemButton,
  ListItemText,
  Typography,
  Divider,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import SubtitlesIcon from "@mui/icons-material/Subtitles";
import HeadphonesIcon from "@mui/icons-material/Headphones";
import DeleteSweepIcon from "@mui/icons-material/DeleteSweep";
import useLocalStorage from "../../hooks/useLocalStorage";
import { VocabularyDraftMap } from "../../hooks/useVocabularyForm";

import VideoLibraryIcon from "@mui/icons-material/VideoLibrary";
import { useDispatch } from "react-redux"; // dùng Redux
import { openVideoManager } from "../../stores/floatingWindowSlice"; // action mở cửa sổ nổi

function ActionIcon({
  children,
  showDot,
  color,
}: {
  children: React.ReactNode;
  showDot?: boolean;
  color?: string;
}) {
  return (
    <Box
      sx={{
        position: "relative",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {children}
      {showDot && (
        <Box
          sx={{
            position: "absolute",
            top: -4,
            right: -4,
            width: 10,
            height: 10,
            borderRadius: "50%",
            bgcolor: color || "error.main",
            border: "2px solid white",
          }}
        />
      )}
    </Box>
  );
}

export default function GlobalFab() {
  const navigate = useNavigate();

  const dispatch = useDispatch();

  const [open, setOpen] = React.useState(false);

  // 📦 lấy toàn bộ bản nháp
  const [vocabDrafts, setVocabDrafts] = useLocalStorage<VocabularyDraftMap>(
    "draft_vocab",
    {}
  );
  const [dictationDraft] = useLocalStorage<any>("draft_dictation", null);

  const vocabKeys = Object.keys(vocabDrafts || {});
  const hasVocabDraft = vocabKeys.length > 0;
  const hasDictationDraft = !!dictationDraft?.topic;
  const hasAnyDraft = hasVocabDraft || hasDictationDraft;

  // 🪟 submenu hiển thị danh sách draft
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);
  const openMenu = Boolean(anchorEl);

  const handleOpenMenu = (e: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(e.currentTarget);
  };
  const handleCloseMenu = () => setAnchorEl(null);

  const handleNavigate = (path: string) => {
    handleCloseMenu();
    setOpen(false);
    navigate(path);
  };

  // 🗑 Xóa toàn bộ bản nháp
  const handleClearAllDrafts = () => {
    localStorage.removeItem("draft_vocab");
    setVocabDrafts({});
    handleCloseMenu();
  };

  const actions = [
    {
      key: "vocab",
      name: hasVocabDraft
        ? `Tiếp tục ${vocabKeys.length} bản nháp từ vựng`
        : "Thêm từ vựng mới",
      icon: (
        <ActionIcon showDot={hasVocabDraft} color="#f59e0b">
          <SubtitlesIcon sx={{ color: "#f59e0b" }} />
        </ActionIcon>
      ),
      onClick: (e: React.MouseEvent<HTMLElement>) => {
        if (!hasVocabDraft) {
          setOpen(false);
          navigate("/ctv/topics");
        } else if (vocabKeys.length === 1) {
          handleNavigate(vocabKeys[0]);
        } else {
          handleOpenMenu(e);
        }
      },
    },
    {
      key: "dictation",
      name: hasDictationDraft
        ? "Tiếp tục bản nháp bài nghe"
        : "Thêm bài nghe mới",
      icon: (
        <ActionIcon showDot={hasDictationDraft} color="#0284c7">
          <HeadphonesIcon sx={{ color: "#0284c7" }} />
        </ActionIcon>
      ),
      onClick: () => {
        setOpen(false);
        navigate("/dictation/new");
      },
    },
    {
      key: "video",
      name: "Mở trình quản lý Video",
      icon: (
        <ActionIcon color="#22c55e">
          <VideoLibraryIcon sx={{ color: "#22c55e" }} />
        </ActionIcon>
      ),
      onClick: () => {
        setOpen(false); // đóng menu FAB
        dispatch(openVideoManager()); // 🚀 mở cửa sổ video qua Redux
      },
    },
  ];

  return (
    <>
      <Box sx={{ position: "fixed", bottom: 32, right: 32, zIndex: 2000 }}>
        <SpeedDial
          ariaLabel="Thêm nội dung mới"
          icon={<SpeedDialIcon icon={<AddIcon />} openIcon={<CloseIcon />} />}
          onOpen={() => setOpen(true)}
          onClose={() => setOpen(false)}
          open={open}
          FabProps={{
            sx: {
              width: 64,
              height: 64,
              background: "linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)",
              boxShadow: "0 8px 24px rgba(37, 99, 235, 0.4)",
              "&:hover": {
                background: "linear-gradient(135deg, #1E40AF 0%, #1E3A8A 100%)",
              },
              "&::after": hasAnyDraft
                ? {
                    content: '""',
                    position: "absolute",
                    top: 8,
                    right: 8,
                    width: 12,
                    height: 12,
                    borderRadius: "50%",
                    bgcolor: "error.main",
                    border: "2px solid white",
                  }
                : {},
            },
          }}
        >
          {actions.map((action) => (
            <SpeedDialAction
              key={action.key}
              icon={action.icon}
              onClick={action.onClick}
              slotProps={{
                tooltip: {
                  title: action.name,
                  placement: "left",
                },
              }}
            />
          ))}
        </SpeedDial>
      </Box>

      {/* Submenu hiển thị danh sách bản nháp từ vựng */}
      <Popover
        open={openMenu}
        anchorEl={anchorEl}
        onClose={handleCloseMenu}
        anchorOrigin={{ vertical: "center", horizontal: "left" }}
        transformOrigin={{ vertical: "center", horizontal: "right" }}
        PaperProps={{
          sx: {
            p: 0,
            borderRadius: 2,
            minWidth: 240,
            boxShadow: "0 8px 24px rgba(0,0,0,0.25)",
          },
        }}
      >
        <List dense disablePadding>
          {vocabKeys.map((url) => {
            const draft = vocabDrafts[url];
            const word = draft?.word || "(Chưa đặt tên)";
            return (
              <ListItemButton key={url} onClick={() => handleNavigate(url)}>
                <ListItemText
                  primary={
                    <Typography fontWeight={600} fontSize="0.9rem">
                      {word}
                    </Typography>
                  }
                  secondary={
                    <Typography color="text.secondary" fontSize="0.8rem">
                      {url.replace("/vocabulary/", "")}
                    </Typography>
                  }
                />
              </ListItemButton>
            );
          })}
          {hasVocabDraft && (
            <>
              <Divider />
              <ListItemButton
                onClick={handleClearAllDrafts}
                sx={{
                  color: "error.main",
                  "&:hover": { bgcolor: "error.lighter", opacity: 0.9 },
                }}
              >
                <DeleteSweepIcon fontSize="small" sx={{ mr: 1 }} />
                <ListItemText
                  primary="Xóa tất cả bản nháp"
                  primaryTypographyProps={{ fontWeight: 600 }}
                />
              </ListItemButton>
            </>
          )}
        </List>
      </Popover>
    </>
  );
}
