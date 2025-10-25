import { useState } from "react";
import { Collaborator, UserDetail } from "../types";
import { toast } from "sonner";

// 🔹 Mock danh sách cộng tác viên
const mockCollaborators: Collaborator[] = [
  { id: "1", name: "Trần Minh Quân", email: "quan.tran@example.com", requested_at: "2024-09-05", status: "pending" },
  { id: "2", name: "Lê Thị Hà", email: "ha.le@example.com", requested_at: "2024-08-20", joined_at: "2024-09-10", status: "approved" },
  { id: "3", name: "Nguyễn Phúc Long", email: "long.nguyen@example.com", requested_at: "2024-09-01", status: "rejected" },
];

// 🔹 Mock chi tiết user
const mockUserDetails: Record<string, UserDetail> = {
  "1": {
    id: "1",
    email: "quan.tran@example.com",
    status: "pending",
    profile: { fullname: "Trần Minh Quân", avatar: "https://i.pravatar.cc/300?img=12" },
    badges: [{ title: "Top Learner" }, { title: "Grammar Master" }, { title: "Vocabulary Builder" }],
    master_parts: [
      { part_name: "Part 1", accuracy: 92 },
      { part_name: "Part 2", accuracy: 88 },
      { part_name: "Part 3", accuracy: 79 },
      { part_name: "Part 4", accuracy: 85 },
    ],
    topic_vocabularies: [{ title: "Business Emails" }, { title: "Office Meetings" }, { title: "Travel" }],
  },
  "2": {
    id: "2",
    email: "ha.le@example.com",
    status: "approved",
    profile: { fullname: "Lê Thị Hà", avatar: "https://i.pravatar.cc/300?img=45" },
    badges: [{ title: "Listening Expert" }],
    master_parts: [
      { part_name: "Part 1", accuracy: 95 },
      { part_name: "Part 2", accuracy: 90 },
    ],
    topic_vocabularies: [{ title: "Marketing" }, { title: "Finance" }],
  },
  "3": {
    id: "3",
    email: "long.nguyen@example.com",
    status: "rejected",
    profile: { fullname: "Nguyễn Phúc Long", avatar: "https://i.pravatar.cc/300?img=22" },
    badges: [],
    master_parts: [],
    topic_vocabularies: [],
  },
};

export const useCollaboratorViewModel = () => {
  const [collaborators] = useState<Collaborator[]>(mockCollaborators);
  const [selectedUser, setSelectedUser] = useState<UserDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [openDrawer, setOpenDrawer] = useState(false);

  const handleViewDetail = async (userId: string) => {
    setLoading(true);
    setTimeout(() => {
      setSelectedUser(mockUserDetails[userId]);
      setOpenDrawer(true);
      setLoading(false);
    }, 700);
  };

  const handleApprove = (id: string) => {
    toast.success("✅ Đã duyệt cộng tác viên!");
    setSelectedUser((prev) => (prev ? { ...prev, status: "approved" } : prev));
  };

  const handleReject = (id: string) => {
    toast.error("❌ Đã từ chối cộng tác viên!");
    setSelectedUser((prev) => (prev ? { ...prev, status: "rejected" } : prev));
  };

  const handleCloseDrawer = () => setOpenDrawer(false);

  return {
    collaborators,
    selectedUser,
    loading,
    openDrawer,
    handleViewDetail,
    handleCloseDrawer,
    handleApprove,
    handleReject,
  };
};
