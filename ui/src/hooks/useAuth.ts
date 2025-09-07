import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../lib/api';
import type { LoginRequest, RegisterRequest } from '../types/api';

export const useAuth = () => {
  const queryClient = useQueryClient();

  const { data: user, isLoading: isLoadingUser } = useQuery({
    queryKey: ['auth', 'me'],
    queryFn: () => apiClient.getCurrentUser(),
    select: (data) => data.user,
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const loginMutation = useMutation({
    mutationFn: (credentials: LoginRequest) => apiClient.login(credentials),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['auth'] });
    },
  });

  const registerMutation = useMutation({
    mutationFn: (userData: RegisterRequest) => apiClient.register(userData),
  });

  const logout = () => {
    apiClient.logout();
    queryClient.clear();
  };

  return {
    user,
    isLoadingUser,
    login: loginMutation.mutate,
    register: registerMutation.mutate,
    logout,
    isLoggingIn: loginMutation.isPending,
    isRegistering: registerMutation.isPending,
    loginError: loginMutation.error,
    registerError: registerMutation.error,
  };
};
