export type TestStatus = "pending" | "approved" | "rejected";
export type TestType = "FULL_TEST" | "MINI_TEST";

export interface TestItem {
  id: string;
  title: string;
  topic: string;
  type: TestType;
  creator: string;
  created_at: string;
  status: TestStatus;
  countComment: number;
  countSubmit: number;
}

export const mockTests: TestItem[] = [
  {
    id: "1",
    title: "Full Test 001",
    topic: "Office",
    type: "FULL_TEST",
    creator: "Trần Minh Quân",
    created_at: "2025-01-15",
    status: "pending",
    countComment: 3,
    countSubmit: 42,
  },
  {
    id: "2",
    title: "Mini Test 01",
    topic: "Travel",
    type: "MINI_TEST",
    creator: "Lê Thị Hà",
    created_at: "2025-01-20",
    status: "approved",
    countComment: 5,
    countSubmit: 85,
  },
  {
    id: "3",
    title: "Full Test 002",
    topic: "Shopping",
    type: "FULL_TEST",
    creator: "Phạm Thảo My",
    created_at: "2025-01-25",
    status: "rejected",
    countComment: 1,
    countSubmit: 17,
  },
];
