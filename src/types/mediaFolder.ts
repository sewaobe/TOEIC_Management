import { Media } from "./media";

/**
 * 🧩 Kiểu dữ liệu thư mục media (BE & FE dùng chung)
 * Một thư mục có thể:
 *  - có parent (nếu không phải gốc)
 *  - có nhiều con (subfolders)
 *  - chứa danh sách media (ảnh, video,...)
 */
export interface MediaFolder {
  _id: string;
  id: string;
  name: string; // Tên thư mục hiển thị
  path: string; // Ví dụ: "Ngữ pháp cơ bản/Thì hiện tại đơn"
  parent?: string | null; // ID của thư mục cha, nếu có
  subfolders?: MediaFolder[]; // Cây con (recursive)
  media?: Media[]; // Danh sách file trong thư mục
  created_at?: string;
  updated_at?: string;
}

/**
 * Dữ liệu dùng khi tạo / cập nhật folder
 */
export interface MediaFolderPayload {
  name: string;
  parent?: string | null;
  path: string;
}
