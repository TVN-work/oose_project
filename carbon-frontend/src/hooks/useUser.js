import { useQuery } from '@tanstack/react-query';
import userService from '../services/user/userService';

/**
 * Hook to fetch user by ID
 * @param {string} userId - User ID
 */
export const useUser = (userId) => {
  return useQuery({
    queryKey: ['user', userId],
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
    queryKey: ['users', params],
    queryFn: () => userService.getAllUsers(params),
    staleTime: 30000, // 30 seconds
    retry: 1,
  });
};
