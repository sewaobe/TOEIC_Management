import axiosClient from "./axiosClient";
import { ApiResponse } from "../types/api";
import { MediaFolder } from "../types/mediaFolder";
import { Media } from "../types/media";

const mediaFolderService = {
  /* ===============================
     📁 FOLDER CRUD
  =============================== */

  create: (data: Partial<MediaFolder>) =>
    axiosClient.post<ApiResponse<MediaFolder>>("/ctv/folders", data),

  getById: (id: string) =>
    axiosClient.get<ApiResponse<MediaFolder>>(`/ctv/folders/${id}`),

  getTree: () =>
    axiosClient.get<ApiResponse<MediaFolder[]>>("/ctv/folders/tree"),

  update: (id: string, data: Partial<MediaFolder>) =>
    axiosClient.put<ApiResponse<MediaFolder>>(`/ctv/folders/${id}`, data),

  delete: (id: string) =>
    axiosClient.delete<ApiResponse<null>>(`/ctv/folders/${id}`),

  /* ===============================
     🎬 MEDIA trong Folder
  =============================== */

  // ➕ Thêm media mới vào folder
  addMedia: (folderId: string, data: Partial<Media>) =>
    axiosClient.post<ApiResponse<Media>>(
      `/ctv/folders/${folderId}/medias`,
      data
    ),

  // 🧾 Lấy danh sách media trong folder (có phân trang)
  getMedias: (folderId: string, page = 1, limit = 12) =>
    axiosClient.get<ApiResponse<{ items: Media[]; total: number }>>(
      `/ctv/folders/${folderId}/medias?page=${page}&limit=${limit}`
    ),

  // 🕵️‍♀️ Tìm kiếm media toàn hệ thống (có phân trang)
  searchMedias: (query: string, page = 1, limit = 12) =>
    axiosClient.get<ApiResponse<{ items: Media[]; total: number }>>(
      `/ctv/folders/medias/search?query=${encodeURIComponent(query)}&page=${page}&limit=${limit}`
    ),

  // ✏️ Cập nhật thông tin media
  updateMedia: (mediaId: string, data: Partial<Media>) =>
    axiosClient.put<ApiResponse<Media>>(`/ctv/folders/media/${mediaId}`, data),

  // 🗑️ Xóa media
  deleteMedia: (mediaId: string) =>
    axiosClient.delete<ApiResponse<null>>(`/ctv/folders/media/${mediaId}`),
};

export default mediaFolderService;
