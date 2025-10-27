import { User } from "./types";

export const users: User[] = [
  {
    id: 1,
    name: "Nguyễn Văn A",
    email: "a.nguyen@example.com",
    role_id: { _id: "68fbe4e8c00763d5e9ca2ab3", name: "admin" },
    status: "active",
    avatar: "https://i.pravatar.cc/100?img=1",
    created_at: "2024-05-10",
    last_active: "2025-10-25",
    master_parts: [
      { part_name: "Part 1", accuracy: 95 },
      { part_name: "Part 2", accuracy: 80 },
    ],
  },
  {
    id: 2,
    name: "Trần Thị B",
    email: "b.tran@example.com",
    role_id: { _id: "68d01fd658e349d39cd704af", name: "collaborator" },
    status: "active",
    avatar: "https://i.pravatar.cc/100?img=2",
    created_at: "2024-06-12",
    last_active: "2025-10-20",
    master_parts: [
      { part_name: "Part 3", accuracy: 75 },
      { part_name: "Part 4", accuracy: 88 },
    ],
  },
  {
    id: 3,
    name: "Phạm Văn C",
    email: "c.pham@example.com",
    role_id: { _id: "68addc56f5a59b170fe47c03", name: "student" },
    status: "suspended",
    avatar: "https://i.pravatar.cc/100?img=3",
    created_at: "2024-07-08",
    last_active: "2025-08-12",
    master_parts: [
      { part_name: "Part 5", accuracy: 40 },
      { part_name: "Part 6", accuracy: 60 },
    ],
  },
  {
    id: 4,
    name: "Lê Thị D",
    email: "d.le@example.com",
    role_id: { _id: "68addc56f5a59b170fe47c03", name: "student" },
    status: "active",
    avatar: "https://i.pravatar.cc/100?img=4",
    created_at: "2024-09-03",
    last_active: "2025-10-10",
    master_parts: [
      { part_name: "Part 1", accuracy: 65 },
      { part_name: "Part 2", accuracy: 70 },
    ],
  },
  {
    id: 5,
    name: "Hoàng Văn E",
    email: "e.hoang@example.com",
    role_id: { _id: "68d01fd658e349d39cd704af", name: "collaborator" },
    status: "inactive",
    avatar: "https://i.pravatar.cc/100?img=5",
    created_at: "2024-08-25",
    last_active: "2025-09-02",
    master_parts: [
      { part_name: "Part 7", accuracy: 55 },
      { part_name: "Part 3", accuracy: 68 },
    ],
  },
];
