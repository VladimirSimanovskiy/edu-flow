import React from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../lib/api';
import type { LoginRequest, RegisterRequest } from '../../../shared/types/api';

export const useAuth = () => {
  const queryClient = useQueryClient();

  const { data: user, isLoading: isLoadingUser, error: authError } = useQuery({
    queryKey: ['auth', 'me'],
    queryFn: () => apiClient.getCurrentUser(),
    select: (data) => data.user,
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: !!localStorage.getItem('access_token'), // Only fetch if we have a token
  });

  // Handle auth errors
  React.useEffect(() => {
    if (authError) {
      const error = authError as any;
      // If we get 403 or 401, clear the tokens and stop trying
      if (error?.message?.includes('Invalid or expired token') || 
          error?.message?.includes('Session expired') ||
          error?.status === 403 || 
          error?.status === 401) {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        queryClient.setQueryData(['auth', 'me'], null);
      }
    }
  }, [authError, queryClient]);

  const loginMutation = useMutation({
    mutationFn: (credentials: LoginRequest) => apiClient.login(credentials),
    onSuccess: (data) => {
      // Обновляем кэш с данными пользователя
      queryClient.setQueryData(['auth', 'me'], { user: data.user });
      // Инвалидируем запрос, чтобы React Query обновил данные
      queryClient.invalidateQueries({ queryKey: ['auth', 'me'] });
    },
  });

  const registerMutation = useMutation({
    mutationFn: (userData: RegisterRequest) => apiClient.register(userData),
  });

  const logoutMutation = useMutation({
    mutationFn: () => apiClient.logout(),
    onSuccess: () => {
      // Очищаем кэш и localStorage
      queryClient.clear();
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      // Принудительно обновляем кэш пользователя
      queryClient.setQueryData(['auth', 'me'], null);
      // Принудительно обновляем страницу
      window.location.reload();
    },
    onError: () => {
      // Error is handled by the hook
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
