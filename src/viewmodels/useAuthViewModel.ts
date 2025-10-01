// viewmodels/useAuthViewModel.ts
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { LoginFormInputs, loginSchema } from '../models/schemas/loginSchema';
import {
  RegisterFormInputs,
  registerSchema,
} from '../models/schemas/registerSchema';
import { useNavigateToast } from '../hooks/useNavigateToast';
import authService from '../services/auth.service';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../stores/store';
import { getUserThunk, setAuth } from '../stores/userSlice';

export const useAuthViewModel = () => {
  const { showToastAndRedirect } = useNavigateToast();
  const dispatch = useDispatch<AppDispatch>();

  // -------- Login ----------
  const useLoginForm = () => {
    return useForm<LoginFormInputs>({
      resolver: zodResolver(loginSchema),
      defaultValues: { username: '', password: '' },
    });
  };

  // -------- Register ----------
  const useRegisterForm = () => {
    return useForm<RegisterFormInputs>({
      resolver: zodResolver(registerSchema),
      defaultValues: { username: '', email: '', password: '', fullname: '' },
    });
  };

  // -------- Login ----------
  const login = async (data: LoginFormInputs) => {
    try {
      const res = await authService.login(data) as any;
      if(res?.meta?.role_name === "student") {
        throw new Error("Unauthorized");
      }
      dispatch(setAuth(true));
      dispatch(getUserThunk());
      showToastAndRedirect(
        'success',
        'Bạn đã đăng nhập thành công',
        '/home',
        'login-toast',
      );
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || 'Đăng nhập thất bại!';
      showToastAndRedirect(
        'error',
        errorMessage,
        '',
        'login-toast',
      );
      console.error(error);
      throw error; // Re-throw để component có thể handle loading state
    }
  };

  // -------- Register ----------
  const register = async (data: RegisterFormInputs, onSwitch: () => void) => {
    try {
      await authService.register(data);
      showToastAndRedirect(
        'success',
        'Bạn đã đăng ký thành công',
        '',
        'register-toast',
      );
      onSwitch();
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || 'Đăng ký thất bại!';
      showToastAndRedirect('error', errorMessage, '', 'register-toast');
      console.error(error);
      throw error; // Re-throw để component có thể handle loading state
    }
  };

  // -------- LoginWithGoolg ----------
  const loginWithGoogle = async (tokenId: string) => {
    try {
      const success = await authService.loginWithGoogle(tokenId);
      if(!success) {
        throw new Error("Unauthorized");
      }
      dispatch(setAuth(true));
      await dispatch(getUserThunk());
      showToastAndRedirect(
        'success',
        'Bạn đã đăng nhập thành công',
        '/home',
        'login-toast',
      );
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || 'Đăng nhập thất bại!';
      showToastAndRedirect(
        'error',
        errorMessage,
        '',
        'login-toast',
      );
      console.error(error);
      throw error; // Re-throw để component có thể handle loading state
    }
  };


  return {
    useLoginForm,
    useRegisterForm,
    login,
    register,
    loginWithGoogle
  };
};
