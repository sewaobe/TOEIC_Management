export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  meta?: any;
}
