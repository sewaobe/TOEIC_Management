import {
  Box,
  Button,
  Chip,
  CircularProgress,
  Divider,
  IconButton,
  MenuItem,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { Add, Delete } from "@mui/icons-material";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import {
  LessonManagerGraphNode,
  NodeRoleLabel,
  STATUS_COLOR_MAP,
  TestStatus,
  TestStatusLabel,
  UnitTypeLabel,
} from "../../../../../../types/LessonManager";
import { LessonManagerDetail } from "../../../../../../types/LessonManagerDetail";
import adminLessonService from "../../services/adminLesson.service";

type EdgeKey = "next_unit_ids" | "prerequisite_unit_ids" | "auxiliary_unit_ids";

interface EdgeConfig {
  key: EdgeKey;
  title: string;
}

const edgeConfigs: EdgeConfig[] = [
  { key: "next_unit_ids", title: "Bài học tiếp theo" },
  { key: "prerequisite_unit_ids", title: "Điều kiện tiên quyết" },
  { key: "auxiliary_unit_ids", title: "Bài bổ trợ" },
];

const statusOptions: TestStatus[] = [
  "draft",
  "pending",
  "approved",
  "open",
  "closed",
  "rejected",
];

const nodeMeta = (node: LessonManagerGraphNode) =>
  `Part ${node.part_type} • ${node.score_band?.from ?? "-"}-${node.score_band?.to ?? "-"} • ${
    node.unit_type ? UnitTypeLabel[node.unit_type] : "-"
  } • ${node.node_role ? NodeRoleLabel[node.node_role] : "-"}`;

const uniqueNodes = (nodes: LessonManagerGraphNode[]) => {
  const seen = new Set<string>();
  return nodes.filter((node) => {
    if (seen.has(node._id)) return false;
    seen.add(node._id);
    return true;
  });
};

export default function TabGraphEdges({
  lessonManager,
  onSaved,
}: {
  lessonManager: LessonManagerDetail;
  onSaved: () => Promise<void>;
}) {
  const [selected, setSelected] = useState<Record<EdgeKey, LessonManagerGraphNode[]>>({
    next_unit_ids: uniqueNodes(lessonManager.next_unit_ids || []),
    prerequisite_unit_ids: uniqueNodes(lessonManager.prerequisite_unit_ids || []),
    auxiliary_unit_ids: uniqueNodes(lessonManager.auxiliary_unit_ids || []),
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setSelected({
      next_unit_ids: uniqueNodes(lessonManager.next_unit_ids || []),
      prerequisite_unit_ids: uniqueNodes(lessonManager.prerequisite_unit_ids || []),
      auxiliary_unit_ids: uniqueNodes(lessonManager.auxiliary_unit_ids || []),
    });
  }, [lessonManager]);

  const selectedIds = useMemo(
    () => ({
      next_unit_ids: selected.next_unit_ids.map((node) => node._id),
      prerequisite_unit_ids: selected.prerequisite_unit_ids.map((node) => node._id),
      auxiliary_unit_ids: selected.auxiliary_unit_ids.map((node) => node._id),
    }),
    [selected]
  );

  const addNode = (key: EdgeKey, node: LessonManagerGraphNode) => {
    setSelected((prev) => {
      if (prev[key].some((item) => item._id === node._id)) return prev;
      return { ...prev, [key]: [...prev[key], node] };
    });
  };

  const removeNode = (key: EdgeKey, nodeId: string) => {
    setSelected((prev) => ({
      ...prev,
      [key]: prev[key].filter((node) => node._id !== nodeId),
    }));
  };

  const validate = () => {
    for (const config of edgeConfigs) {
      const ids = selected[config.key].map((node) => node._id);
      if (ids.includes(lessonManager._id)) {
        toast.error(`${config.title}: không được trỏ tới chính nó`);
        return false;
      }
      if (new Set(ids).size !== ids.length) {
        toast.error(`${config.title}: có node bị trùng`);
        return false;
      }
      const partMismatch = selected[config.key].find(
        (node) => node.part_type !== lessonManager.part_type
      );
      if (partMismatch) {
        toast.error(`${config.title}: node phải cùng Part với bài hiện tại`);
        return false;
      }
    }

    const invalidNext = selected.next_unit_ids.find(
      (node) => (node.score_band?.to ?? 0) <= (lessonManager.score_band?.to ?? 0)
    );
    if (invalidNext) {
      toast.error("Bài học tiếp theo phải có score_band.to lớn hơn bài hiện tại");
      return false;
    }

    return true;
  };

  const handleSave = async () => {
    if (!validate()) return;
    try {
      setSaving(true);
      await adminLessonService.updateGraph(lessonManager._id, selectedIds);
      toast.success("Đã lưu graph edges");
      await onSaved();
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || "Lưu graph edges thất bại"
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <Box sx={{ mt: 3 }}>
      <Stack spacing={2.5}>
        {edgeConfigs.map((config) => (
          <EdgeSection
            key={config.key}
            config={config}
            currentLesson={lessonManager}
            selected={selected[config.key]}
            onAdd={(node) => addNode(config.key, node)}
            onRemove={(nodeId) => removeNode(config.key, nodeId)}
          />
        ))}
      </Stack>

      <Box sx={{ mt: 3, display: "flex", justifyContent: "flex-end" }}>
        <Button variant="contained" onClick={handleSave} disabled={saving}>
          {saving ? "Đang lưu..." : "Save graph edges"}
        </Button>
      </Box>
    </Box>
  );
}

function EdgeSection({
  config,
  currentLesson,
  selected,
  onAdd,
  onRemove,
}: {
  config: EdgeConfig;
  currentLesson: LessonManagerDetail;
  selected: LessonManagerGraphNode[];
  onAdd: (node: LessonManagerGraphNode) => void;
  onRemove: (nodeId: string) => void;
}) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<TestStatus | "">("");
  const [options, setOptions] = useState<LessonManagerGraphNode[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let active = true;
    const timer = window.setTimeout(async () => {
      try {
        setLoading(true);
        const res: any = await adminLessonService.getOptions({
          query,
          status,
          part_type: currentLesson.part_type,
          exclude_id: currentLesson._id,
          limit: 20,
        });
        if (active) setOptions(res.items || []);
      } catch {
        if (active) setOptions([]);
      } finally {
        if (active) setLoading(false);
      }
    }, 250);

    return () => {
      active = false;
      window.clearTimeout(timer);
    };
  }, [query, status, currentLesson._id, currentLesson.part_type]);

  const selectedIdSet = useMemo(
    () => new Set(selected.map((node) => node._id)),
    [selected]
  );

  return (
    <Paper sx={{ p: 2.5, borderRadius: 2 }}>
      <Stack spacing={2}>
        <Box>
          <Typography variant="h6" fontWeight={700}>
            {config.title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {selected.length} node đã chọn
          </Typography>
        </Box>

        <Stack direction="row" gap={1.5} flexWrap="wrap">
          {selected.length === 0 && (
            <Typography variant="body2" color="text.secondary">
              Chưa chọn node nào.
            </Typography>
          )}
          {selected.map((node) => (
            <Paper key={node._id} variant="outlined" sx={{ p: 1.25, minWidth: 260 }}>
              <Stack direction="row" alignItems="flex-start" gap={1}>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography fontWeight={700} noWrap title={node.title}>
                    {node.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {nodeMeta(node)}
                  </Typography>
                  <Chip
                    label={TestStatusLabel[node.status] || node.status}
                    color={STATUS_COLOR_MAP[node.status] || "default"}
                    size="small"
                    sx={{ mt: 0.75 }}
                  />
                </Box>
                <IconButton size="small" color="error" onClick={() => onRemove(node._id)}>
                  <Delete fontSize="small" />
                </IconButton>
              </Stack>
            </Paper>
          ))}
        </Stack>

        <Divider />

        <Stack direction={{ xs: "column", md: "row" }} gap={1.5}>
          <TextField
            label="Tìm node"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            sx={{ flex: 1 }}
          />
          <TextField
            label="Trạng thái"
            select
            value={status}
            onChange={(event) => setStatus(event.target.value as TestStatus | "")}
            sx={{ width: { xs: "100%", md: 180 } }}
          >
            <MenuItem value="">Tất cả</MenuItem>
            {statusOptions.map((value) => (
              <MenuItem key={value} value={value}>
                {TestStatusLabel[value]}
              </MenuItem>
            ))}
          </TextField>
        </Stack>

        <Stack spacing={1}>
          {loading && (
            <Stack direction="row" gap={1} alignItems="center">
              <CircularProgress size={18} />
              <Typography variant="body2" color="text.secondary">
                Đang tải options...
              </Typography>
            </Stack>
          )}
          {!loading &&
            options.map((node) => (
              <Paper key={node._id} variant="outlined" sx={{ p: 1.25 }}>
                <Stack
                  direction={{ xs: "column", md: "row" }}
                  gap={1}
                  alignItems={{ xs: "stretch", md: "center" }}
                >
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography fontWeight={700}>{node.title}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {nodeMeta(node)}
                    </Typography>
                  </Box>
                  <Chip
                    label={TestStatusLabel[node.status] || node.status}
                    color={STATUS_COLOR_MAP[node.status] || "default"}
                    size="small"
                  />
                  <Button
                    startIcon={<Add />}
                    variant="outlined"
                    size="small"
                    disabled={selectedIdSet.has(node._id)}
                    onClick={() => onAdd(node)}
                  >
                    Thêm
                  </Button>
                </Stack>
              </Paper>
            ))}
          {!loading && options.length === 0 && (
            <Typography variant="body2" color="text.secondary">
              Không có node phù hợp.
            </Typography>
          )}
        </Stack>
      </Stack>
    </Paper>
  );
}
