import authService from '../services/auth.service';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../stores/store';
import { getUserThunk, logout, setAuth } from '../stores/userSlice';
import { toast } from "sonner";
import { useNavigate } from 'react-router-dom';

export const useAuthViewModel = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();


  // -------- LoginWithGoogle ----------
  const loginWithGoogle = async (tokenId: string) => {
    return toast.promise(
      (async () => {
        try {
          const res = await authService.loginWithGoogle(tokenId);
          // Kiểm tra quyền truy cập
          if (!res?.success || res?.meta?.role_name === "student" || !res?.meta?.user_id) {
            throw new Error("Unauthorized");
          }
          localStorage.setItem("activeUserId", res.meta.user_id);
          // Cập nhật redux & load user
          dispatch(setAuth(true));
          await dispatch(getUserThunk());
          // Điều hướng sau khi login thành công
          navigate('/ctv/dashboard');
        } catch (error: any) {
          console.error("Login error:", error);
          // Logout local nếu xảy ra lỗi
          await authService.logout();
          dispatch(logout());
          navigate('/auth')
          throw error; // để toast.promise catch được và hiển thị error toast
        }
      })(),
      {
        loading: "Đang đăng nhập bằng Google...",
        success: "Đăng nhập thành công 🎉",
        error: "Đăng nhập thất bại. Vui lòng thử lại!",
      }
    );
  };


  return {
    loginWithGoogle
  };
};
