import React, { useEffect, useMemo, useState } from "react";
import {
    Box,
    Card,
    CardHeader,
    CardContent,
    Typography,
    Tabs,
    Tab,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Switch,
    Tooltip,
    IconButton,
    Button,
    Divider,
    Chip,
    Snackbar,
    Alert,
    TextField,
    InputAdornment,
    MenuItem,
    CircularProgress,
} from "@mui/material";
import {
    SecurityOutlined,
    LockOutlined,
    SaveOutlined,
    UndoOutlined,
    AdminPanelSettingsOutlined,
    GroupOutlined,
    Search as SearchIcon,
} from "@mui/icons-material";

// ===================== Types =====================
type Role = "student" | "collaborator" | "admin";

type Permission =
    | "LESSON_VIEW"
    | "LESSON_CREATE"
    | "LESSON_EDIT"
    | "LESSON_APPROVE"
    | "USER_VIEW"
    | "USER_INVITE"
    | "USER_EDIT"
    | "ROLE_VIEW"
    | "ROLE_EDIT"
    | "REPORT_VIEW"
    | "REPORT_EXPORT"
    | "BILLING_VIEW";

type PermissionGroup = {
    key: string;
    label: string;
    items: { code: Permission; label: string; hint?: string }[];
};

const PERMISSION_GROUPS: PermissionGroup[] = [
    {
        key: "lessons",
        label: "Bài học",
        items: [
            { code: "LESSON_VIEW", label: "Xem bài học" },
            { code: "LESSON_CREATE", label: "Tạo bài học" },
            { code: "LESSON_EDIT", label: "Sửa bài học" },
            { code: "LESSON_APPROVE", label: "Duyệt/Phát hành", hint: "Quyền xuất bản, chuyển trạng thái" },
        ],
    },
    {
        key: "users",
        label: "Người dùng",
        items: [
            { code: "USER_VIEW", label: "Xem người dùng" },
            { code: "USER_INVITE", label: "Mời cộng tác viên" },
            { code: "USER_EDIT", label: "Sửa hồ sơ / khóa tài khoản" },
        ],
    },
    {
        key: "roles",
        label: "Phân quyền",
        items: [
            { code: "ROLE_VIEW", label: "Xem vai trò" },
            { code: "ROLE_EDIT", label: "Sửa quyền (không áp dụng cho Admin)" },
        ],
    },
    {
        key: "reports",
        label: "Báo cáo",
        items: [
            { code: "REPORT_VIEW", label: "Xem báo cáo" },
            { code: "REPORT_EXPORT", label: "Xuất báo cáo" },
        ],
    },
    {
        key: "billing",
        label: "Thanh toán",
        items: [{ code: "BILLING_VIEW", label: "Xem gói/đơn hàng" }],
    },
];

type RolePermissions = Record<Role, Set<Permission>>;

type UserRow = {
    _id: string;
    fullname: string;
    email: string;
    role: Role;
    isAdmin?: boolean; // nếu true => khóa chỉnh sửa
};

// ===================== Mock API =====================
// 👉 Thay thế các hàm này bằng call thực tới server của bạn.
async function fetchPermissions(): Promise<RolePermissions> {
    // Giả lập network delay
    await new Promise((r) => setTimeout(r, 400));
    return {
        admin: new Set<Permission>([
            "LESSON_VIEW",
            "LESSON_CREATE",
            "LESSON_EDIT",
            "LESSON_APPROVE",
            "USER_VIEW",
            "USER_INVITE",
            "USER_EDIT",
            "ROLE_VIEW",
            "ROLE_EDIT",
            "REPORT_VIEW",
            "REPORT_EXPORT",
            "BILLING_VIEW",
        ]),
        collaborator: new Set<Permission>([
            "LESSON_VIEW",
            "LESSON_CREATE",
            "LESSON_EDIT",
            "USER_VIEW",
            "ROLE_VIEW",
            "REPORT_VIEW",
        ]),
        student: new Set<Permission>(["LESSON_VIEW", "REPORT_VIEW", "BILLING_VIEW"]),
    };
}

async function savePermissions(payload: RolePermissions): Promise<void> {
    await new Promise((r) => setTimeout(r, 500));
    // demo: không trả gì
}

async function fetchUsers(): Promise<UserRow[]> {
    await new Promise((r) => setTimeout(r, 400));
    return [
        { _id: "u1", fullname: "Nguyễn Văn A", email: "a@example.com", role: "admin", isAdmin: true },
        { _id: "u2", fullname: "Trần Thị B", email: "b@example.com", role: "collaborator" },
        { _id: "u3", fullname: "Lê Văn C", email: "c@example.com", role: "student" },
        { _id: "u4", fullname: "Phạm D", email: "d@example.com", role: "collaborator" },
        { _id: "u5", fullname: "Đỗ E", email: "e@example.com", role: "student" },
    ];
}

async function updateUserRole(userId: string, nextRole: Role): Promise<void> {
    await new Promise((r) => setTimeout(r, 350));
}

// ===================== Helper =====================
const roleLabel: Record<Role, string> = {
    admin: "Admin",
    collaborator: "Collaborator",
    student: "Student",
};

const roleColor: Record<Role, "default" | "primary" | "secondary" | "success" | "warning" | "info" | "error"> = {
    admin: "error",
    collaborator: "info",
    student: "success",
};

function deepClonePermissions(src: RolePermissions): RolePermissions {
    return {
        admin: new Set(src.admin),
        collaborator: new Set(src.collaborator),
        student: new Set(src.student),
    };
}

// ===================== Main Page =====================
export default function RBACRolesPage() {
    const [tab, setTab] = useState(0);

    // Permissions matrix state
    const [loadingPerm, setLoadingPerm] = useState(true);
    const [basePerms, setBasePerms] = useState<RolePermissions | null>(null);
    const [perms, setPerms] = useState<RolePermissions | null>(null);
    const [savingPerm, setSavingPerm] = useState(false);
    const dirty = useMemo(() => {
        if (!perms || !basePerms) return false;
        const roles: Role[] = ["student", "collaborator", "admin"];
        return roles.some((r) => {
            const a = basePerms[r];
            const b = perms[r];
            if (a.size !== b.size) return true;
            for (const p of a) if (!b.has(p)) return true;
            return false;
        });
    }, [perms, basePerms]);

    // Users assign role state
    const [loadingUsers, setLoadingUsers] = useState(true);
    const [users, setUsers] = useState<UserRow[]>([]);
    const [search, setSearch] = useState("");
    const [savingUserId, setSavingUserId] = useState<string | null>(null);

    // Snackbar
    const [snack, setSnack] = useState<{ open: boolean; msg: string; severity: "success" | "error" | "info" }>({
        open: false,
        msg: "",
        severity: "success",
    });

    useEffect(() => {
        (async () => {
            setLoadingPerm(true);
            const data = await fetchPermissions();
            setBasePerms(data);
            setPerms(deepClonePermissions(data));
            setLoadingPerm(false);

            setLoadingUsers(true);
            const list = await fetchUsers();
            setUsers(list);
            setLoadingUsers(false);
        })();
    }, []);

    const handleToggle = (role: Role, permission: Permission) => {
        if (!perms) return;
        if (role === "admin") return; // chặn admin
        setPerms((prev) => {
            if (!prev) return prev;
            const next = deepClonePermissions(prev);
            const set = next[role];
            if (set.has(permission)) set.delete(permission);
            else set.add(permission);
            return next;
        });
    };

    const handleSavePerms = async () => {
        if (!perms || !basePerms) return;
        // Bảo vệ: ép admin full quyền trước khi lưu (trong trường hợp có can thiệp devtools)
        const enforced = deepClonePermissions(perms);
        enforced.admin = new Set(basePerms.admin); // hoặc gộp full quyền tuỳ backend
        setSavingPerm(true);
        try {
            await savePermissions(enforced);
            setBasePerms(deepClonePermissions(enforced));
            setPerms(deepClonePermissions(enforced));
            setSnack({ open: true, msg: "Đã lưu thay đổi quyền.", severity: "success" });
        } catch (e) {
            setSnack({ open: true, msg: "Lỗi khi lưu. Vui lòng thử lại.", severity: "error" });
        } finally {
            setSavingPerm(false);
        }
    };

    const handleResetPerms = () => {
        if (!basePerms) return;
        setPerms(deepClonePermissions(basePerms));
    };

    const filteredUsers = useMemo(() => {
        const q = search.trim().toLowerCase();
        if (!q) return users;
        return users.filter(
            (u) => u.fullname.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)
        );
    }, [users, search]);

    const handleChangeUserRole = async (u: UserRow, nextRole: Role) => {
        if (u.isAdmin) return; // chặn hạ quyền admin
        setSavingUserId(u._id);
        try {
            await updateUserRole(u._id, nextRole);
            setUsers((prev) =>
                prev.map((x) => (x._id === u._id ? { ...x, role: nextRole } : x))
            );
            setSnack({ open: true, msg: `Đã cập nhật vai trò cho ${u.fullname}.`, severity: "success" });
        } catch (e) {
            setSnack({ open: true, msg: "Cập nhật vai trò thất bại.", severity: "error" });
        } finally {
            setSavingUserId(null);
        }
    };

    return (
        <Box className="p-4 md:p-6">
            <Box className="mb-4 flex items-center gap-3">
                <SecurityOutlined />
                <Typography variant="h5" className="font-semibold">
                    Phân quyền (RBAC)
                </Typography>
                <Chip icon={<AdminPanelSettingsOutlined />} label="Admin khóa chỉnh sửa" color="error" size="small" className="ml-2" />
            </Box>

            <Card className="rounded-2xl shadow-lg">
                <CardHeader
                    title={
                        <Box className="flex items-center justify-between gap-3">
                            <Tabs value={tab} onChange={(_, v) => setTab(v)} aria-label="RBAC tabs">
                                <Tab label="Ma trận quyền" />
                                <Tab label="Gán vai trò cho người dùng" />
                            </Tabs>

                            {tab === 0 && (
                                <Box className="flex items-center gap-2">
                                    <Tooltip title={dirty ? "Hoàn tác thay đổi chưa lưu" : "Không có thay đổi"}>
                                        <span>
                                            <Button
                                                variant="outlined"
                                                startIcon={<UndoOutlined />}
                                                disabled={!dirty}
                                                onClick={handleResetPerms}
                                            >
                                                Hoàn tác
                                            </Button>
                                        </span>
                                    </Tooltip>
                                    <Button
                                        variant="contained"
                                        startIcon={<SaveOutlined />}
                                        disabled={!dirty || savingPerm}
                                        onClick={handleSavePerms}
                                    >
                                        {savingPerm ? "Đang lưu..." : "Lưu thay đổi"}
                                    </Button>
                                </Box>
                            )}
                        </Box>
                    }
                />
                <Divider />

                <CardContent>
                    {tab === 0 ? (
                        <PermissionsMatrix
                            loading={loadingPerm}
                            perms={perms}
                            onToggle={handleToggle}
                        />
                    ) : (
                        <AssignRolesTab
                            loading={loadingUsers}
                            users={filteredUsers}
                            search={search}
                            onSearch={setSearch}
                            onChangeRole={handleChangeUserRole}
                            savingUserId={savingUserId}
                        />
                    )}
                </CardContent>
            </Card>

            <Snackbar
                open={snack.open}
                autoHideDuration={2200}
                onClose={() => setSnack((s) => ({ ...s, open: false }))}
                anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            >
                <Alert severity={snack.severity} variant="filled">
                    {snack.msg}
                </Alert>
            </Snackbar>
        </Box>
    );
}

// ===================== Permissions Matrix =====================
function PermissionsMatrix({
    loading,
    perms,
    onToggle,
}: {
    loading: boolean;
    perms: RolePermissions | null;
    onToggle: (role: Role, p: Permission) => void;
}) {
    if (loading || !perms) {
        return (
            <Box className="flex items-center justify-center py-16">
                <CircularProgress />
            </Box>
        );
    }

    const roles: Role[] = ["student", "collaborator", "admin"];

    return (
        <Box className="space-y-8">
            {PERMISSION_GROUPS.map((group) => (
                <Card key={group.key} className="rounded-2xl border border-gray-200">
                    <CardHeader
                        title={
                            <Box className="flex items-center gap-2">
                                <Typography variant="h6" className="font-semibold">
                                    {group.label}
                                </Typography>
                            </Box>
                        }
                    />
                    <Divider />
                    <CardContent>
                        <Table size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell className="font-bold">Quyền</TableCell>
                                    {roles.map((r) => (
                                        <TableCell key={r} align="center" className="font-bold">
                                            <Box className="flex items-center justify-center gap-1">
                                                <Chip label={roleLabel[r]} color={roleColor[r]} size="small" />
                                                {r === "admin" && (
                                                    <Tooltip title="Admin luôn full quyền — khóa chỉnh sửa">
                                                        <LockOutlined fontSize="small" />
                                                    </Tooltip>
                                                )}
                                            </Box>
                                        </TableCell>
                                    ))}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {group.items.map((it) => (
                                    <TableRow key={it.code} hover>
                                        <TableCell>
                                            <Box className="flex items-center gap-2">
                                                <Typography>{it.label}</Typography>
                                                {it.hint && (
                                                    <Typography variant="caption" color="text.secondary">
                                                        · {it.hint}
                                                    </Typography>
                                                )}
                                            </Box>
                                        </TableCell>

                                        {/* student */}
                                        <TableCell align="center">
                                            <Switch
                                                checked={perms.student.has(it.code)}
                                                onChange={() => onToggle("student", it.code)}
                                                inputProps={{ "aria-label": `${it.label} - student` }}
                                            />
                                        </TableCell>

                                        {/* collaborator */}
                                        <TableCell align="center">
                                            <Switch
                                                checked={perms.collaborator.has(it.code)}
                                                onChange={() => onToggle("collaborator", it.code)}
                                                inputProps={{ "aria-label": `${it.label} - collaborator` }}
                                            />
                                        </TableCell>

                                        {/* admin (locked) */}
                                        <TableCell align="center">
                                            <Tooltip title="Admin khóa chỉnh sửa">
                                                <span>
                                                    <Switch checked={true} disabled />
                                                </span>
                                            </Tooltip>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            ))}
        </Box>
    );
}

// ===================== Assign Roles Tab =====================
function AssignRolesTab({
    loading,
    users,
    search,
    onSearch,
    onChangeRole,
    savingUserId,
}: {
    loading: boolean;
    users: UserRow[];
    search: string;
    onSearch: (v: string) => void;
    onChangeRole: (u: UserRow, next: Role) => void;
    savingUserId: string | null;
}) {
    return (
        <Box>
            <Box className="flex items-center gap-3 mb-4">
                <TextField
                    value={search}
                    onChange={(e) => onSearch(e.target.value)}
                    placeholder="Tìm theo tên hoặc email…"
                    size="small"
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon fontSize="small" />
                            </InputAdornment>
                        ),
                    }}
                />
                <Chip icon={<GroupOutlined />} label={`${users.length} người dùng`} size="small" />
            </Box>

            <Card className="rounded-2xl border border-gray-200">
                <CardContent>
                    {loading ? (
                        <Box className="flex items-center justify-center py-12">
                            <CircularProgress />
                        </Box>
                    ) : (
                        <Table size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Họ tên</TableCell>
                                    <TableCell>Email</TableCell>
                                    <TableCell align="right">Vai trò</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {users.map((u) => {
                                    const disabled = u.isAdmin === true;
                                    return (
                                        <TableRow key={u._id} hover>
                                            <TableCell className="font-medium">{u.fullname}</TableCell>
                                            <TableCell>
                                                <Typography variant="body2" color="text.secondary">
                                                    {u.email}
                                                </Typography>
                                            </TableCell>
                                            <TableCell align="right">
                                                <Box className="flex items-center justify-end gap-2">
                                                    {disabled && <LockOutlined fontSize="small" />}
                                                    <Tooltip title={disabled ? "Không thể đổi vai trò Admin" : ""}>
                                                        <TextField
                                                            select
                                                            size="small"
                                                            value={u.role}
                                                            disabled={disabled || savingUserId === u._id}
                                                            onChange={(e) => onChangeRole(u, e.target.value as Role)}
                                                            sx={{ minWidth: 180 }}
                                                        >
                                                            <MenuItem value="student">Student</MenuItem>
                                                            <MenuItem value="collaborator">Collaborator</MenuItem>
                                                            <MenuItem value="admin" disabled>
                                                                Admin (khóa)
                                                            </MenuItem>
                                                        </TextField>
                                                    </Tooltip>
                                                    {savingUserId === u._id && <CircularProgress size={20} />}
                                                </Box>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>
        </Box>
    );
}
