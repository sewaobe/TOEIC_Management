import "@xyflow/react/dist/style.css";

import {
  Background,
  Controls,
  Handle,
  MarkerType,
  MiniMap,
  NodeProps,
  Position,
  ReactFlow,
  ReactFlowProvider,
  type Edge,
  type Node,
} from "@xyflow/react";
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  Divider,
  FormControlLabel,
  IconButton,
  MenuItem,
  Paper,
  Stack,
  Switch,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import {
  Close,
  Fullscreen,
  InfoOutlined,
  OpenInNew,
  Refresh,
  TravelExplore,
} from "@mui/icons-material";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import {
  NodeRoleLabel,
  STATUS_COLOR_MAP,
  TestStatus,
  TestStatusLabel,
  UnitTypeLabel,
} from "../../../../types/LessonManager";
import adminLessonService, {
  AdminLessonGraphEdge,
  AdminLessonGraphNode,
  AdminLessonGraphResponse,
  AdminLessonGraphParams,
} from "./services/adminLesson.service";

type GraphNodeData = {
  node: AdminLessonGraphNode;
  highlightState: "highlighted" | "neighbor" | "dimmed" | "normal";
};

type GraphHighlightState = GraphNodeData["highlightState"];

type LayoutNode = {
  node: AdminLessonGraphNode;
  position: { x: number; y: number };
  state: GraphHighlightState;
};

type PartRowData = {
  part: number;
  width: number;
  height: number;
};

type ScoreHeaderData = {
  score: number;
  width: number;
};

type ScoreSeparatorData = {
  height: number;
};

const partOptions = [1, 2, 3, 4, 5, 6, 7];
const statusOptions: TestStatus[] = [
  "draft",
  "pending",
  "approved",
  "open",
  "closed",
  "rejected",
];
const unitTypeOptions = [
  "foundation",
  "skill_drill",
  "mixed_practice",
  "exam_practice",
  "remedial",
];
const nodeRoleOptions = ["entry", "normal", "target", "support"];
const SCORE_BUCKET_SIZE = 100;
const SCORE_MIN = 200;
const NODE_WIDTH = 156;
const NODE_GAP_X = 220;
const NODE_GAP_Y = 112;
const SCORE_SECTION_GAP = 72;
const ROW_GAP = 84;
const HEADER_HEIGHT = 30;
const PART_LABEL_WIDTH = 78;
const ROW_START_X = 28;
const ROW_START_Y = 42;

const edgeStyleMap = {
  next: { stroke: "#64748b", strokeWidth: 1.35 },
  prerequisite: { stroke: "#3b82f6", strokeWidth: 1.1, strokeDasharray: "7 5" },
  auxiliary: { stroke: "#10b981", strokeWidth: 1.1, strokeDasharray: "3 5" },
};

const compactUnitLabel = (unitType: string) =>
  UnitTypeLabel[unitType as keyof typeof UnitTypeLabel] || unitType || "-";

const statusLabel = (status: string) =>
  TestStatusLabel[status as TestStatus] || status || "-";

const statusColor = (status: string) =>
  STATUS_COLOR_MAP[status as TestStatus] || "default";

const getScoreBucket = (node: AdminLessonGraphNode) => {
  const scoreAnchor =
    Number.isFinite(node.score_band?.from) && node.score_band?.from
      ? node.score_band.from
      : ((node.score_band?.from ?? 0) + (node.score_band?.to ?? 0)) / 2;
  return Math.max(SCORE_MIN, Math.floor(scoreAnchor / SCORE_BUCKET_SIZE) * SCORE_BUCKET_SIZE);
};

function LessonGraphNode({ data }: NodeProps<Node<GraphNodeData>>) {
  const { node, highlightState } = data;
  const emphasized = highlightState === "highlighted";
  const neighbor = highlightState === "neighbor";
  const dimmed = highlightState === "dimmed";

  return (
    <Box
      sx={{
        width: emphasized ? 190 : 156,
        p: emphasized ? 1.1 : 0.85,
        borderRadius: 1.5,
        border: "1px solid",
        borderColor: emphasized ? "primary.main" : neighbor ? "primary.light" : "divider",
        bgcolor: "background.paper",
        boxShadow: emphasized
          ? "0 12px 28px rgba(37, 99, 235, 0.32)"
          : neighbor
            ? "0 6px 16px rgba(37, 99, 235, 0.16)"
            : "0 4px 12px rgba(15, 23, 42, 0.08)",
        opacity: dimmed ? 0.34 : 1,
      }}
    >
      <Handle type="target" position={Position.Left} style={{ opacity: 0 }} />
      <Handle type="source" position={Position.Right} style={{ opacity: 0 }} />
      <Typography variant="body2" fontWeight={800} noWrap title={node.title} fontSize={emphasized ? 13 : 12}>
        {node.title}
      </Typography>
      <Typography variant="caption" color="text.secondary" noWrap fontSize={11}>
        Part {node.part_type} • {node.score_band?.from ?? "-"}-
        {node.score_band?.to ?? "-"}
      </Typography>
      <Stack direction="row" gap={0.5} sx={{ mt: 0.6 }}>
        <Chip
          size="small"
          label={compactUnitLabel(node.unit_type)}
          color={emphasized ? "primary" : "default"}
          sx={{ maxWidth: emphasized ? 92 : 76, height: 18, fontSize: 10.5 }}
        />
        <Chip
          size="small"
          label={statusLabel(node.status)}
          color={statusColor(node.status)}
          sx={{ maxWidth: 70, height: 18, fontSize: 10.5 }}
        />
      </Stack>
    </Box>
  );
}

function PartRowNode({ data }: NodeProps<Node<PartRowData>>) {
  return (
    <Box
      sx={{
        width: data.width,
        height: data.height,
        borderRadius: 2,
        bgcolor: "rgba(248,250,252,0.62)",
        border: "1px solid rgba(148,163,184,0.18)",
        borderLeft: "3px solid rgba(37,99,235,0.42)",
        position: "relative",
      }}
    >
      <Typography
        variant="body2"
        fontWeight={900}
        color="text.secondary"
        sx={{
          position: "absolute",
          left: 14,
          top: HEADER_HEIGHT + 18,
        }}
      >
        Part {data.part}
      </Typography>
    </Box>
  );
}

function ScoreHeaderNode({ data }: NodeProps<Node<ScoreHeaderData>>) {
  return (
    <Box
      sx={{
        width: data.width,
        height: HEADER_HEIGHT,
        borderRadius: 1.25,
        bgcolor: "rgba(255,255,255,0.92)",
        border: "1px solid rgba(148,163,184,0.32)",
        display: "flex",
        alignItems: "center",
        px: 1.2,
        boxShadow: "0 3px 8px rgba(15,23,42,0.05)",
      }}
    >
      <Typography variant="caption" fontWeight={900} color="primary.main">
        {data.score}
      </Typography>
    </Box>
  );
}

function ScoreSeparatorNode({ data }: NodeProps<Node<ScoreSeparatorData>>) {
  return (
    <Box
      sx={{
        width: 1,
        height: data.height,
        borderLeft: "1px solid rgba(148,163,184,0.28)",
      }}
    />
  );
}

const nodeTypes = {
  lessonCard: LessonGraphNode,
  partRow: PartRowNode,
  scoreHeader: ScoreHeaderNode,
  scoreSeparator: ScoreSeparatorNode,
};

const getConnectedIds = (edges: AdminLessonGraphEdge[], nodeId?: string) => {
  if (!nodeId) return new Set<string>();
  const connected = new Set<string>();
  edges.forEach((edge) => {
    if (edge.source === nodeId) connected.add(edge.target);
    if (edge.target === nodeId) connected.add(edge.source);
  });
  return connected;
};

const layoutNodes = (
  graphNodes: AdminLessonGraphNode[],
  graphEdges: AdminLessonGraphEdge[],
  activeNodeId?: string
): LayoutNode[] => {
  const connected = getConnectedIds(graphEdges, activeNodeId);
  const partRows = buildCurriculumRows(graphNodes);
  const positionById = new Map<string, { x: number; y: number }>();

  partRows.forEach((row) => {
    row.sections.forEach((section) => {
      section.nodes.forEach((node, index) => {
        const col = index % section.cols;
        const line = Math.floor(index / section.cols);
        positionById.set(node.id, {
          x: section.x + col * NODE_GAP_X,
          y: row.yNodes + line * NODE_GAP_Y,
        });
      });
    });
  });

  return graphNodes.map((node) => {
    const state: GraphHighlightState =
      activeNodeId && node.id === activeNodeId
        ? "highlighted"
        : activeNodeId && connected.has(node.id)
          ? "neighbor"
          : "normal";

    return {
      node,
      position: positionById.get(node.id) || { x: ROW_START_X + PART_LABEL_WIDTH, y: ROW_START_Y },
      state,
    };
  });
};

const buildCurriculumRows = (graphNodes: AdminLessonGraphNode[]) => {
  let rowY = ROW_START_Y;

  return partOptions.map((part) => {
    const nodesByBucket = new Map<number, AdminLessonGraphNode[]>();
    graphNodes
      .filter((node) => node.part_type === part)
      .sort(
        (a, b) =>
          getScoreBucket(a) - getScoreBucket(b) ||
          (a.score_band?.from ?? 0) - (b.score_band?.from ?? 0) ||
          a.title.localeCompare(b.title)
      )
      .forEach((node) => {
        const bucket = getScoreBucket(node);
        const bucketNodes = nodesByBucket.get(bucket) || [];
        bucketNodes.push(node);
        nodesByBucket.set(bucket, bucketNodes);
      });

    const buckets = Array.from(nodesByBucket.keys()).sort((a, b) => a - b);
    const sections = buckets.map((bucket) => {
      const nodes = nodesByBucket.get(bucket) || [];
      const cols = Math.min(3, Math.max(1, nodes.length));
      const rows = Math.max(1, Math.ceil(nodes.length / cols));
      const width = Math.max(230, cols * NODE_WIDTH + (cols - 1) * (NODE_GAP_X - NODE_WIDTH) + 18);
      return { bucket, nodes, cols, rows, width, x: 0 };
    });

    let xCursor = ROW_START_X + PART_LABEL_WIDTH;
    sections.forEach((section) => {
      section.x = xCursor;
      xCursor += section.width + SCORE_SECTION_GAP;
    });

    const maxSectionRows = Math.max(1, ...sections.map((section) => section.rows));
    const rowHeight = HEADER_HEIGHT + 12 + maxSectionRows * NODE_GAP_Y + 28;
    const yHeader = rowY;
    const yNodes = rowY + HEADER_HEIGHT + 12;
    const width = Math.max(820, xCursor - ROW_START_X);
    const currentRowY = rowY;
    rowY += rowHeight + ROW_GAP;

    return {
      part,
      y: currentRowY,
      yHeader,
      yNodes,
      height: rowHeight,
      width,
      sections,
    };
  });
};

const buildEdgeCounts = (edges: AdminLessonGraphEdge[], nodeId?: string) => ({
  next: nodeId
    ? edges.filter((edge) => edge.type === "next" && edge.source === nodeId).length
    : 0,
  prerequisite: nodeId
    ? edges.filter((edge) => edge.type === "prerequisite" && edge.target === nodeId).length
    : 0,
  auxiliary: nodeId
    ? edges.filter((edge) => edge.type === "auxiliary" && edge.source === nodeId).length
    : 0,
});

export default function LessonManagerGraphPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const highlightFromUrl = searchParams.get("highlight") || "";
  const [filters, setFilters] = useState<AdminLessonGraphParams>({});
  const [graph, setGraph] = useState<AdminLessonGraphResponse>({
    nodes: [],
    edges: [],
  });
  const [loading, setLoading] = useState(false);
  const [selectedNodeId, setSelectedNodeId] = useState<string>(highlightFromUrl);
  const [highlightMode, setHighlightMode] = useState(Boolean(highlightFromUrl));
  const [edgeVisibility, setEdgeVisibility] = useState({
    next: true,
    prerequisite: false,
    auxiliary: false,
  });
  const [refreshKey, setRefreshKey] = useState(0);

  const fetchGraph = useCallback(async () => {
    try {
      setLoading(true);
      const result = await adminLessonService.getGraph({
        ...filters,
        highlight_id: highlightFromUrl || undefined,
      });
      setGraph(result);
      if (highlightFromUrl && result.highlightedNodeId) {
        setSelectedNodeId(result.highlightedNodeId);
        setHighlightMode(true);
      }
    } catch {
      toast.error("Không tải được dữ liệu graph");
      setGraph({ nodes: [], edges: [] });
    } finally {
      setLoading(false);
    }
  }, [filters, highlightFromUrl]);

  useEffect(() => {
    fetchGraph();
  }, [fetchGraph, refreshKey]);

  const activeNodeId = selectedNodeId || graph.highlightedNodeId;

  const flowNodes: Node[] = useMemo(() => {
    const rowNodes: Node[] = [];

    buildCurriculumRows(graph.nodes).forEach((row) => {
      rowNodes.push({
        id: `part-row-${row.part}`,
        type: "partRow",
        position: { x: ROW_START_X, y: row.y },
        selectable: false,
        draggable: false,
        focusable: false,
        data: { part: row.part, width: row.width, height: row.height },
        style: { zIndex: -2 },
      });

      row.sections.forEach((section, index) => {
        rowNodes.push({
          id: `part-${row.part}-score-${section.bucket}`,
          type: "scoreHeader",
          position: { x: section.x, y: row.yHeader },
          selectable: false,
          draggable: false,
          focusable: false,
          data: { score: section.bucket, width: section.width },
          style: { zIndex: -1 },
        });

        if (index < row.sections.length - 1) {
          rowNodes.push({
            id: `part-${row.part}-separator-${section.bucket}`,
            type: "scoreSeparator",
            position: { x: section.x + section.width + SCORE_SECTION_GAP / 2, y: row.y },
            selectable: false,
            draggable: false,
            focusable: false,
            data: { height: row.height },
            style: { zIndex: -1 },
          });
        }
      });
    });

    const lessonNodes = layoutNodes(graph.nodes, graph.edges, highlightMode ? activeNodeId : undefined).map(
      ({ node, position, state }) => {
        const highlightState: GraphHighlightState = highlightMode
          ? state === "normal" && activeNodeId
            ? "dimmed"
            : state
          : "normal";

        return {
          id: node.id,
          type: "lessonCard",
          position,
          draggable: true,
          data: {
            node,
            highlightState,
          },
        };
      }
    );

    return [...rowNodes, ...lessonNodes];
  }, [activeNodeId, graph.edges, graph.nodes, highlightMode]);

  const flowEdges: Edge[] = useMemo(
    () =>
      graph.edges.flatMap((edge) => {
        const directlyConnected =
          Boolean(activeNodeId) &&
          (edge.source === activeNodeId || edge.target === activeNodeId);
        const visibleByToggle = edgeVisibility[edge.type];
        if (!visibleByToggle && !(highlightMode && directlyConnected)) {
          return [];
        }

        const defaultOpacity =
          edge.type === "next" ? 0.38 : edge.type === "prerequisite" ? 0.1 : 0.1;

        return [{
          id: edge.id,
          source: edge.source,
          target: edge.target,
          type: "smoothstep",
          animated: highlightMode && directlyConnected,
          markerEnd: { type: MarkerType.ArrowClosed, color: edgeStyleMap[edge.type].stroke },
          style: {
            ...edgeStyleMap[edge.type],
            strokeWidth:
              highlightMode && directlyConnected
                ? edgeStyleMap[edge.type].strokeWidth + 0.7
                : edgeStyleMap[edge.type].strokeWidth,
            opacity:
              highlightMode && activeNodeId
                ? directlyConnected
                  ? 1
                  : 0.08
                : defaultOpacity,
          },
        }];
      }),
    [activeNodeId, edgeVisibility, graph.edges, highlightMode]
  );

  const selectedNode = useMemo(
    () => graph.nodes.find((node) => node.id === activeNodeId),
    [activeNodeId, graph.nodes]
  );
  const counts = useMemo(
    () => buildEdgeCounts(graph.edges, selectedNode?.id),
    [graph.edges, selectedNode?.id]
  );

  const updateFilter = (key: keyof AdminLessonGraphParams, value: string | number) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const toggleEdgeVisibility = (type: keyof typeof edgeVisibility) => {
    setEdgeVisibility((prev) => ({ ...prev, [type]: !prev[type] }));
  };

  const handleShowAll = () => {
    setSearchParams({});
    setSelectedNodeId("");
    setHighlightMode(false);
  };

  return (
    <ReactFlowProvider>
      <Box
        sx={{
          height: { xs: "auto", xl: "calc(100vh - 120px)" },
          minHeight: { xs: "auto", xl: 760 },
          display: "flex",
          flexDirection: "column",
          gap: 2,
          minWidth: 0,
        }}
      >
        <Stack
          direction={{ xs: "column", lg: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "stretch", lg: "flex-start" }}
          gap={2}
        >
          <Box>
            <Typography variant="h5" fontWeight={700}>
              Graph trực quan lộ trình bài học
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Khám phá mối quan hệ giữa các node bài học trong toàn bộ hệ thống,
              giúp quản trị viên hiểu cấu trúc lộ trình và kiểm tra độ liên kết.
            </Typography>
          </Box>
          <Stack direction="row" gap={1} flexWrap="wrap">
            {highlightFromUrl && (
              <Chip
                icon={<TravelExplore />}
                color="primary"
                variant="outlined"
                label="Từ detail: đang highlight"
              />
            )}
            <Tooltip title="Làm mới">
              <IconButton
                onClick={() => setRefreshKey((key) => key + 1)}
                sx={{
                  border: 1,
                  borderColor: "divider",
                  bgcolor: "background.paper",
                }}
              >
                <Refresh />
              </IconButton>
            </Tooltip>
            <Tooltip title="Xem toàn bộ">
              <IconButton
                onClick={handleShowAll}
                sx={{
                  bgcolor: "primary.main",
                  color: "primary.contrastText",
                  "&:hover": { bgcolor: "primary.dark" },
                }}
              >
                <Fullscreen />
              </IconButton>
            </Tooltip>
          </Stack>
        </Stack>

        <Paper sx={{ p: 1.5, borderRadius: 2 }}>
          <Stack direction="row" gap={1.25} alignItems="center" flexWrap="wrap">
            <TextField label="Part" select value={filters.part_type ?? ""} onChange={(e) => updateFilter("part_type", e.target.value === "" ? "" : Number(e.target.value))} sx={{ width: 130 }}>
              <MenuItem value="">Tất cả</MenuItem>
              {partOptions.map((part) => <MenuItem key={part} value={part}>Part {part}</MenuItem>)}
            </TextField>
            <TextField label="Trạng thái" select value={filters.status ?? ""} onChange={(e) => updateFilter("status", e.target.value)} sx={{ width: 160 }}>
              <MenuItem value="">Tất cả</MenuItem>
              {statusOptions.map((status) => <MenuItem key={status} value={status}>{statusLabel(status)}</MenuItem>)}
            </TextField>
            <TextField label="Unit type" select value={filters.unit_type ?? ""} onChange={(e) => updateFilter("unit_type", e.target.value)} sx={{ width: 170 }}>
              <MenuItem value="">Tất cả</MenuItem>
              {unitTypeOptions.map((unit) => <MenuItem key={unit} value={unit}>{compactUnitLabel(unit)}</MenuItem>)}
            </TextField>
            <TextField label="Node role" select value={filters.node_role ?? ""} onChange={(e) => updateFilter("node_role", e.target.value)} sx={{ width: 160 }}>
              <MenuItem value="">Tất cả</MenuItem>
              {nodeRoleOptions.map((role) => <MenuItem key={role} value={role}>{NodeRoleLabel[role as keyof typeof NodeRoleLabel]}</MenuItem>)}
            </TextField>
            <TextField label="Từ khóa" placeholder="Tìm node, tags..." value={filters.query ?? ""} onChange={(e) => updateFilter("query", e.target.value)} sx={{ flex: "1 1 240px", minWidth: 220 }} />
            <FormControlLabel
              control={<Switch checked={edgeVisibility.next} onChange={() => toggleEdgeVisibility("next")} />}
              label="Show Next"
            />
            <FormControlLabel
              control={<Switch checked={edgeVisibility.prerequisite} onChange={() => toggleEdgeVisibility("prerequisite")} />}
              label="Show Prerequisite"
            />
            <FormControlLabel
              control={<Switch checked={edgeVisibility.auxiliary} onChange={() => toggleEdgeVisibility("auxiliary")} />}
              label="Show Auxiliary"
            />
            <InfoOutlined color="action" />
          </Stack>
        </Paper>

        <Box
          sx={{
            flex: 1,
            display: "grid",
            gridTemplateColumns: { xs: "1fr", xl: "minmax(0, 1fr) 330px" },
            gridTemplateRows: { xs: "440px auto", md: "520px auto", xl: "minmax(0, 1fr)" },
            gap: 2,
            minHeight: { xs: "auto", xl: 0 },
            minWidth: 0,
          }}
        >
          <Paper
            sx={{
              position: "relative",
              borderRadius: 2,
              overflow: "hidden",
              minHeight: 0,
              minWidth: 0,
              height: "100%",
            }}
          >
            {loading && (
              <Box sx={{ position: "absolute", inset: 0, zIndex: 5, display: "grid", placeItems: "center", bgcolor: "rgba(255,255,255,0.72)" }}>
                <CircularProgress />
              </Box>
            )}
            {!loading && graph.nodes.length === 0 ? (
              <Box sx={{ height: "100%", display: "grid", placeItems: "center", p: 4 }}>
                <Typography color="text.secondary">
                  Chưa có dữ liệu graph phù hợp với bộ lọc hiện tại.
                </Typography>
              </Box>
            ) : (
              <ReactFlow
                nodes={flowNodes}
                edges={flowEdges}
                nodeTypes={nodeTypes}
                fitView
                fitViewOptions={{ padding: 0.42, minZoom: 0.12, maxZoom: 0.8 }}
                defaultViewport={{ x: 0, y: 0, zoom: 0.18 }}
                minZoom={0.12}
                maxZoom={1.5}
                nodesDraggable={false}
                nodesConnectable={false}
                edgesFocusable={false}
                elementsSelectable
                onNodeClick={(_, clickedNode) => {
                  if (clickedNode.type !== "lessonCard") return;

                  setSelectedNodeId(clickedNode.id);
                  setHighlightMode(true);
                }}
                proOptions={{ hideAttribution: true }}
              >
                <Background gap={22} size={1} color="#e2e8f0" />
                <Controls showInteractive={false} />
                <Box sx={{ display: { xs: "none", xl: "block" } }}>
                  <MiniMap pannable zoomable nodeStrokeWidth={2} />
                </Box>
              </ReactFlow>
            )}
            <Legend />
          </Paper>
          <NodeInfoPanel
            node={selectedNode}
            counts={counts}
            onClose={() => setSelectedNodeId("")}
            onOpenDetail={() => selectedNode && navigate(`/admin/lessons/${selectedNode.id}`)}
          />
        </Box>
      </Box>
    </ReactFlowProvider>
  );
}

function Legend() {
  return (
    <Paper sx={{ position: "absolute", left: 16, bottom: 16, zIndex: 4, p: 1.5, borderRadius: 2 }}>
      <Typography fontWeight={800} variant="body2" mb={1}>Chú thích</Typography>
      <Stack spacing={0.75}>
        <LegendRow color="#64748b" label="Next (Tiếp theo)" />
        <LegendRow color="#3b82f6" label="Prerequisite (Tiền đề)" dashed />
        <LegendRow color="#10b981" label="Auxiliary (Hỗ trợ)" dashed />
      </Stack>
    </Paper>
  );
}

function LegendRow({ color, label, dashed }: { color: string; label: string; dashed?: boolean }) {
  return (
    <Stack direction="row" gap={1} alignItems="center">
      <Box sx={{ width: 28, borderTop: `2px ${dashed ? "dashed" : "solid"} ${color}` }} />
      <Typography variant="caption">{label}</Typography>
    </Stack>
  );
}

function NodeInfoPanel({
  node,
  counts,
  onClose,
  onOpenDetail,
}: {
  node?: AdminLessonGraphNode;
  counts: { next: number; prerequisite: number; auxiliary: number };
  onClose: () => void;
  onOpenDetail: () => void;
}) {
  return (
    <Paper
      sx={{
        borderRadius: 2,
        p: 2,
        minHeight: 0,
        minWidth: 0,
        height: { xs: "auto", xl: "100%" },
      }}
    >
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Typography fontWeight={800}>Node đang highlight</Typography>
        <IconButton size="small" onClick={onClose}><Close fontSize="small" /></IconButton>
      </Stack>
      {!node ? (
        <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
          Chọn một node trên graph để xem metadata.
        </Typography>
      ) : (
        <Stack spacing={2} sx={{ mt: 2 }}>
          <Box>
            <Typography fontWeight={800} noWrap title={node.title}>
              {node.title}
            </Typography>
            <Chip size="small" label={statusLabel(node.status)} color={statusColor(node.status)} sx={{ mt: 1 }} />
          </Box>
          <InfoRow label="Part" value={`Part ${node.part_type}`} />
          <InfoRow label="Score band" value={`${node.score_band?.from ?? "-"}-${node.score_band?.to ?? "-"}`} />
          <InfoRow label="Unit type" value={compactUnitLabel(node.unit_type)} />
          <InfoRow label="Node role" value={NodeRoleLabel[node.node_role as keyof typeof NodeRoleLabel] || node.node_role} />
          <Box>
            <Typography variant="caption" color="text.secondary">Target tags</Typography>
            <Stack direction="row" gap={0.75} flexWrap="wrap" sx={{ mt: 0.75, minWidth: 0 }}>
              {(node.target_tags || []).slice(0, 5).map((tag) => (
                <Chip
                  key={tag}
                  size="small"
                  label={tag}
                  variant="outlined"
                  sx={{ maxWidth: 135 }}
                />
              ))}
              {(node.target_tags || []).length > 5 && <Chip size="small" label={`+${node.target_tags.length - 5}`} />}
            </Stack>
          </Box>
          <InfoRow label="Thời gian dự kiến" value={`${node.planned_completion_time ?? 0} phút`} />
          <InfoRow label="Weight" value={Number(node.weight ?? 0).toFixed(2)} />
          <Divider />
          <Stack direction="row" justifyContent="space-around">
            <CountBox label="Next" value={counts.next} color="text.primary" />
            <CountBox label="Prerequisite" value={counts.prerequisite} color="primary.main" />
            <CountBox label="Auxiliary" value={counts.auxiliary} color="success.main" />
          </Stack>
          <Button variant="contained" endIcon={<OpenInNew />} onClick={onOpenDetail}>Mở chi tiết bài học</Button>
        </Stack>
      )}
    </Paper>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <Stack direction="row" justifyContent="space-between" gap={2} sx={{ minWidth: 0 }}>
      <Typography variant="body2" color="text.secondary" sx={{ flexShrink: 0 }}>
        {label}
      </Typography>
      <Typography
        variant="body2"
        fontWeight={700}
        textAlign="right"
        noWrap
        title={value}
        sx={{ minWidth: 0 }}
      >
        {value}
      </Typography>
    </Stack>
  );
}

function CountBox({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <Box textAlign="center">
      <Typography variant="caption" color="text.secondary">{label}</Typography>
      <Typography fontWeight={900} color={color}>{value}</Typography>
    </Box>
  );
}
