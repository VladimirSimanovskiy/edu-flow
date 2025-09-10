import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../lib/api';
import type { LoginRequest, RegisterRequest, AuthUser } from '../../../shared/types/api';

export const useAuth = () => {
  const queryClient = useQueryClient();

  const { data: user, isLoading: isLoadingUser } = useQuery({
    queryKey: ['auth', 'me'],
    queryFn: () => apiClient.getCurrentUser(),
    select: (data) => data.user,
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: !!localStorage.getItem('access_token'), // Only fetch if we have a token
  });

  const loginMutation = useMutation({
    mutationFn: (credentials: LoginRequest) => apiClient.login(credentials),
    onSuccess: (data) => {
      // Обновляем кэш с данными пользователя
      queryClient.setQueryData(['auth', 'me'], { user: data.user });
    },
  });

  const registerMutation = useMutation({
    mutationFn: (userData: RegisterRequest) => apiClient.register(userData),
  });

  const logoutMutation = useMutation({
    mutationFn: () => apiClient.logout(),
    onSuccess: () => {
      console.log('Logout successful');
      // Очищаем кэш и localStorage
      queryClient.clear();
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      // Принудительно обновляем кэш пользователя
      queryClient.setQueryData(['auth', 'me'], null);
      // Принудительно обновляем страницу
      window.location.reload();
    },
    onError: (error) => {
      console.error('Logout error:', error);
    },
  });

  const logout = async () => {
    await logoutMutation.mutateAsync();
  };

  return {
    user,
    isLoadingUser,
    login: loginMutation.mutateAsync,
    register: registerMutation.mutateAsync,
    logout,
    isLoggingIn: loginMutation.isPending,
    isRegistering: registerMutation.isPending,
    isLoggingOut: logoutMutation.isPending,
    loginError: loginMutation.error,
    registerError: registerMutation.error,
    logoutError: logoutMutation.error,
  };
};
