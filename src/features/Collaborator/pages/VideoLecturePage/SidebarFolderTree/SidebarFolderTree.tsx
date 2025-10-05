import {
  Box,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
  IconButton,
  Tooltip,
  Divider,
  Menu,
  MenuItem,
} from "@mui/material";
import {
  Folder,
  ExpandLess,
  ExpandMore,
  Add,
  Delete,
  Edit,
  MoreVert,
} from "@mui/icons-material";
import { useState } from "react";
import { toast } from "sonner";
import { useFetchList } from "../../../../../hooks/useFetchList";
import SimpleInputDialog from "./dialogs/SimpleInputDialog";
import ConfirmDeleteDialog from "./dialogs/ConfirmDeleteDialog";
import mediaFolderService from "../../../../../services/mediaFolder.service";
import { MediaFolder } from "../../../../../types/mediaFolder";

// ============================
// 🔧 Helper: normalize cây folder
// ============================
function normalizeFolderTree(data: any[]): MediaFolder[] {
  return data.map((f) => ({
    ...f,
    id: f._id,
    subfolders: f.children ? normalizeFolderTree(f.children) : [], // ✅ chuẩn: children → subfolders
  }));
}

// ============================
// 🔹 Props
// ============================
interface Props {
  selectedFolderId: string | null;
  setSelectedFolderId: (id: string | null, name: string) => void;
}

// ============================
// 🔹 Component chính
// ============================
export default function SidebarFolderTree({
  selectedFolderId,
  setSelectedFolderId,
}: Props) {
  const {
    items: tree,
    addItem,
    updateItem,
    deleteItem,
    isLoading,
  } = useFetchList<MediaFolder>({
    fetchFn: async () => {
      const res = await mediaFolderService.getTree();
      const normalized = normalizeFolderTree(res.data || []);
      return { items: normalized, pageCount: 1, total: normalized.length };
    },
    createFn: async (item) => {
      const res = await mediaFolderService.create(item);
      return { ...res.data, id: res.data._id, subfolders: [] };
    },
    updateFn: async (id, item) => {
      const res = await mediaFolderService.update(id, item);
      return { ...res.data, id: res.data._id, subfolders: [] };
    },
    deleteFn: async (id) => {
      await mediaFolderService.delete(id);
    },
  });

  const [openFolders, setOpenFolders] = useState<Record<string, boolean>>({});
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const [menuFolder, setMenuFolder] = useState<MediaFolder | null>(null);

  const [renameTarget, setRenameTarget] = useState<MediaFolder | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<MediaFolder | null>(null);
  const [addTarget, setAddTarget] = useState<
    MediaFolder | { isRoot: true } | null
  >(null);
  const [inputValue, setInputValue] = useState("");

  // ============================
  // 🔹 Toggle mở folder
  // ============================
  const toggleFolder = (id: string) => {
    setOpenFolders((p) => ({ ...p, [id]: !p[id] }));
  };

  // ============================
  // 🔹 CRUD
  // ============================
  const handleAdd = async () => {
    if (!inputValue.trim()) return;
    const name = inputValue.trim();

    try {
      if (addTarget && "isRoot" in addTarget) {
        await addItem({ name, path: name } as Partial<MediaFolder>);
      } else if (addTarget && "_id" in addTarget) {
        await addItem({
          name,
          parent: addTarget._id,
          path: `${addTarget.path}/${name}`,
        } as Partial<MediaFolder>);
      }
      setAddTarget(null);
      setInputValue("");
    } catch {
      toast.error("Không thể thêm thư mục");
    }
  };

  const handleRename = async () => {
    if (!renameTarget || !inputValue.trim()) return;
    await updateItem(renameTarget._id, { name: inputValue.trim() });
    setRenameTarget(null);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    await deleteItem(deleteTarget._id);
    setDeleteTarget(null);
  };

  // ============================
  // 🔹 Menu 3 chấm
  // ============================
  const openMenu = (
    e: React.MouseEvent<HTMLButtonElement>,
    folder: MediaFolder
  ) => {
    e.stopPropagation();
    setMenuAnchor(e.currentTarget);
    setMenuFolder(folder);
  };

  const closeMenu = () => {
    setMenuAnchor(null);
    setMenuFolder(null);
  };

  // ============================
  // 🔹 Render node đệ quy
  // ============================
  const renderNode = (folder: MediaFolder, depth = 0) => (
    <Box key={folder._id}>
      <ListItem disablePadding sx={{ position: "relative" }}>
        <ListItemButton
          onClick={() => {
            toggleFolder(folder._id);
            setSelectedFolderId(folder._id, folder.name); // ✅ truyền cả tên
          }}
          selected={selectedFolderId === folder._id}
          sx={{
            pl: 2 + depth * 2,
            "&.Mui-selected": { bgcolor: (t) => t.palette.action.selected },
            "&:hover": { bgcolor: (t) => t.palette.action.hover },
          }}
        >
          <ListItemIcon sx={{ minWidth: 36 }}>
            <Folder
              sx={{
                color: (t) =>
                  selectedFolderId === folder._id
                    ? t.palette.primary.main
                    : t.palette.text.secondary,
              }}
            />
          </ListItemIcon>
          <ListItemText
            primary={folder.name}
            primaryTypographyProps={{ fontWeight: 500 }}
          />
          {folder.subfolders?.length ? (
            openFolders[folder._id] ? (
              <ExpandLess />
            ) : (
              <ExpandMore />
            )
          ) : null}
          <IconButton size="small" onClick={(e) => openMenu(e, folder)}>
            <MoreVert fontSize="small" />
          </IconButton>
        </ListItemButton>
      </ListItem>

      {folder.subfolders && folder.subfolders.length > 0 && (
        <Collapse in={openFolders[folder._id]} timeout="auto" unmountOnExit>
          <List disablePadding>
            {folder.subfolders.map((child) => renderNode(child, depth + 1))}
          </List>
        </Collapse>
      )}
    </Box>
  );

  // ============================
  // 🔹 Render chính
  // ============================
  return (
    <>
      <Paper
        className="w-72 border-r overflow-y-auto rounded-md"
        sx={{
          bgcolor: (t) => t.palette.background.paper,
          borderRight: (t) => `1px solid ${t.palette.divider}`,
        }}
      >
        <Box className="flex items-center justify-between px-3 py-3">
          <Typography variant="h6" fontWeight={700} color="primary">
            Thư viện Media
          </Typography>
          <Tooltip title="Thêm thư mục gốc">
            <IconButton
              size="small"
              color="primary"
              onClick={() => {
                setAddTarget({ isRoot: true });
                setInputValue("");
              }}
            >
              <Add fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>

        <Divider />

        {isLoading ? (
          <Typography className="p-4 text-sm text-gray-500">
            Đang tải thư mục...
          </Typography>
        ) : (
          <List dense disablePadding>
            {tree.map((folder) => renderNode(folder))}
          </List>
        )}
      </Paper>

      {/* Menu ba chấm */}
      <Menu anchorEl={menuAnchor} open={!!menuAnchor} onClose={closeMenu}>
        <MenuItem
          onClick={() => {
            closeMenu();
            if (menuFolder) setAddTarget(menuFolder);
          }}
        >
          <Add fontSize="small" className="mr-2" /> Thêm mục con
        </MenuItem>
        <MenuItem
          onClick={() => {
            closeMenu();
            if (menuFolder) {
              setRenameTarget(menuFolder);
              setInputValue(menuFolder.name);
            }
          }}
        >
          <Edit fontSize="small" className="mr-2" /> Đổi tên
        </MenuItem>
        <MenuItem
          sx={{ color: "error.main" }}
          onClick={() => {
            closeMenu();
            if (menuFolder) setDeleteTarget(menuFolder);
          }}
        >
          <Delete fontSize="small" className="mr-2" /> Xóa
        </MenuItem>
      </Menu>

      {/* Dialogs */}
      <SimpleInputDialog
        open={!!addTarget}
        title={
          addTarget && "isRoot" in addTarget
            ? "Thêm thư mục gốc"
            : `Thêm mục con trong "${(addTarget as MediaFolder)?.name || ""}"`
        }
        label="Tên thư mục"
        value={inputValue}
        onChange={setInputValue}
        onCancel={() => setAddTarget(null)}
        onConfirm={handleAdd}
      />

      <SimpleInputDialog
        open={!!renameTarget}
        title="Đổi tên thư mục"
        label="Tên mới"
        value={inputValue}
        onChange={setInputValue}
        onCancel={() => setRenameTarget(null)}
        onConfirm={handleRename}
      />

      <ConfirmDeleteDialog
        open={!!deleteTarget}
        name={deleteTarget?.name || ""}
        type="folder"
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
      />
    </>
  );
}
