import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import userService from '../services/user/userService';
import toast from 'react-hot-toast';

// Query Keys
export const userKeys = {
  all: ['users'],
  lists: () => [...userKeys.all, 'list'],
  list: (params) => [...userKeys.lists(), params],
  details: () => [...userKeys.all, 'detail'],
  detail: (id) => [...userKeys.details(), id],
};

/**
 * Hook to fetch user by ID
 * @param {string} userId - User ID
 */
export const useUser = (userId) => {
  return useQuery({
    queryKey: userKeys.detail(userId),
    queryFn: () => userService.getUserById(userId),
    enabled: !!userId,
    staleTime: 60000, // 1 minute
    retry: 1,
  });
};

/**
 * Hook to fetch all users with pagination
 * @param {Object} params - Query parameters (page, entry, field, sort)
 */
export const useUsers = (params = {}) => {
  return useQuery({
    queryKey: userKeys.list(params),
    queryFn: () => userService.getAllUsers(params),
    staleTime: 30000, // 30 seconds
    retry: 1,
  });
};

/**
 * Hook to update user information
 */
export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, userData }) => userService.updateUser(userId, userData),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
      queryClient.invalidateQueries({ queryKey: userKeys.detail(variables.userId) });
      toast.success('💾 Đã cập nhật thông tin người dùng');
    },
    onError: (error) => {
      toast.error(error.message || '❌ Lỗi khi cập nhật người dùng');
    },
  });
};

/**
 * Hook to lock user account
 */
export const useLockUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (userId) => userService.lockUser(userId),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
      queryClient.invalidateQueries({ queryKey: userKeys.detail(variables) });
      toast.warning('🔒 Đã khóa tài khoản người dùng');
    },
    onError: (error) => {
      toast.error(error.message || '❌ Lỗi khi khóa tài khoản');
    },
  });
};

/**
 * Hook to unlock user account
 */
export const useUnlockUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (userId) => userService.unlockUser(userId),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
      queryClient.invalidateQueries({ queryKey: userKeys.detail(variables) });
      toast.success('🔓 Đã mở khóa tài khoản người dùng');
    },
    onError: (error) => {
      toast.error(error.message || '❌ Lỗi khi mở khóa tài khoản');
    },
  });
};

/**
 * Hook to delete user
 */
export const useDeleteUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (userId) => userService.deleteUser(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
      toast.success('🗑️ Đã xóa người dùng');
    },
    onError: (error) => {
      toast.error(error.message || '❌ Lỗi khi xóa người dùng');
    },
  });
};
