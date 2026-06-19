import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { usersApi } from '../services/api';
import type { 
  User, 
  UserDetail, 
  UserListQuery, 
  UserListResponse,
  UserStatusUpdate,
  UserAction 
} from '../types';

// User List Hook
export const useUsers = (query: UserListQuery) => {
  return useQuery({
    queryKey: ['users', query.page, query.limit, query.search, query.role, query.status],
    queryFn: () => usersApi.getUsers(query),
    select: (response) => response.data,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

// User Detail Hook
export const useUserDetail = (userId: string) => {
  return useQuery({
    queryKey: ['users', userId, 'detail'],
    queryFn: () => usersApi.getUserDetail(userId),
    select: (response) => response.data,
    enabled: !!userId,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

// User Statistics Hook
export const useUserStats = () => {
  return useQuery({
    queryKey: ['users', 'stats'],
    queryFn: () => usersApi.getUserStats(),
    select: (response) => response.data,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

// User Activity Hook
export const useUserActivity = (userId: string) => {
  return useQuery({
    queryKey: ['users', userId, 'activity'],
    queryFn: () => usersApi.getUserActivity(userId),
    select: (response) => response.data,
    enabled: !!userId,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

// User Bookings Hook
export const useUserBookings = (userId: string, page = 1, limit = 20) => {
  return useQuery({
    queryKey: ['users', userId, 'bookings', page, limit],
    queryFn: () => usersApi.getUserBookings(userId, page, limit),
    select: (response) => response.data,
    enabled: !!userId,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

// User Login History Hook
export const useUserLoginHistory = (userId: string, page = 1, limit = 20) => {
  return useQuery({
    queryKey: ['users', userId, 'login-history', page, limit],
    queryFn: () => usersApi.getUserLoginHistory(userId, page, limit),
    select: (response) => response.data,
    enabled: !!userId,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

// User Devices Hook
export const useUserDevices = (userId: string) => {
  return useQuery({
    queryKey: ['users', userId, 'devices'],
    queryFn: () => usersApi.getUserDevices(userId),
    select: (response) => response.data,
    enabled: !!userId,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

// Mutations
export const useSuspendUser = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ userId, data }: { userId: string; data: UserStatusUpdate }) => 
      usersApi.suspendUser(userId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['users', 'stats'] });
    },
  });
};

export const useReactivateUser = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ userId, data }: { userId: string; data: UserStatusUpdate }) => 
      usersApi.reactivateUser(userId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['users', 'stats'] });
    },
  });
};

export const useBulkUpdateUsers = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (updates: Array<{ userId: string; action: 'suspend' | 'reactivate'; reason?: string }>) => 
      usersApi.bulkUpdateUsers(updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['users', 'stats'] });
    },
  });
};

// Search Users Hook
export const useSearchUsers = (filters: {
  search?: string;
  role?: string;
  status?: string;
  registrationDate?: string;
  lastLogin?: string;
}) => {
  return useQuery({
    queryKey: ['users', 'search', filters],
    queryFn: () => usersApi.searchUsers(filters),
    select: (response) => response.data,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

// Export Users Hook
export const useExportUsers = () => {
  return useMutation({
    mutationFn: ({ format, filters }: { format: 'csv' | 'excel' | 'json'; filters?: any }) => 
      usersApi.exportUsers(format, filters),
  });
};

// User Status Hook
export const useUserStatus = (userId: string) => {
  return useQuery({
    queryKey: ['users', userId, 'status'],
    queryFn: () => Promise.resolve({ status: 'active' }), // Placeholder - implement actual status check
    select: (response) => response.status,
    enabled: !!userId,
    staleTime: 1 * 60 * 1000, // 1 minute - more frequent updates for status
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Real-time User Updates Hook
export const useRealtimeUserUpdates = () => {
  return useQuery({
    queryKey: ['users', 'realtime'],
    queryFn: () => Promise.resolve({ updates: [] }), // Placeholder - implement WebSocket connection
    select: (response) => response.updates,
    refetchInterval: 30000, // Refetch every 30 seconds
    staleTime: 0,
    gcTime: 1 * 60 * 1000, // 1 minute
  });
};

// User Performance Hook
export const useUserPerformance = (userId: string) => {
  return useQuery({
    queryKey: ['users', userId, 'performance'],
    queryFn: () => Promise.resolve({ data: null }), // Placeholder - implement performance tracking
    select: (response) => response.data,
    enabled: !!userId,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};