/**
 * 🖼️ Kiểu dữ liệu Media (ảnh, video, audio)
 * Dùng cho FE để hiển thị hoặc gắn vào folder
 */
export interface Media {
  _id: string;
  url: string;
  type: "IMAGE" | "VIDEO" | "AUDIO";
  name?: string;
  topic?: string;
  transcript?: string;
  created_at?: string;
}
