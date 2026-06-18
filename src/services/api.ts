import { useAuthStore } from '@/features/auth/stores/useAuthStore';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

const getAuthHeaders = () => {
  if (typeof window === 'undefined') return { 'Content-Type': 'application/json' };
  const token = useAuthStore.getState().token;
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
  };
};

async function fetchWithAuth(url: string, options: RequestInit = {}) {
  const res = await fetch(`${API_URL}${url}`, {
    ...options,
    credentials: 'include', // required to send httpOnly refresh token cookie cross-origin
    headers: {
      ...getAuthHeaders(),
      ...options.headers,
    },
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    
    // EMERGENCY FIX: Skip automatic logout on 401 errors
    if (res.status === 401) {
      console.error('Authentication failed - EMERGENCY FIX: Not clearing auth state');
      // Don't clear auth state or force logout
      throw new Error('Authentication failed. Please login again.');
    }
    
    // Handle 403 Forbidden
    if (res.status === 403) {
      console.error('Access forbidden - insufficient permissions');
      throw new Error('Access denied. Insufficient permissions.');
    }
    
    // Handle 404 Not Found
    if (res.status === 404) {
      console.error('API endpoint not found:', url);
      throw new Error('Resource not found.');
    }
    
    throw new Error(error.message || 'API request failed');
  }

  const result = await res.json();
  // Unwrap the data property from TransformInterceptor
  return result && typeof result === 'object' && 'data' in result ? result.data : result;
}

// --- AUTH ---

export async function register(data: any) {
  const result = await fetchWithAuth('/auth/register', {
    method: 'POST',
    body: JSON.stringify({
      ...data,
      role: data.role?.toLowerCase(),
    }),
  });

  if (result.accessToken) {
    useAuthStore.getState().login(result.user, result.accessToken);
  }
  return { data: result };
}

export interface LoginPayload {
  email: string;
  password: string;
}

export async function login(payload: LoginPayload) {
  const cleanPayload = {
    email: payload.email,
    password: payload.password,
  };

  const result = await fetchWithAuth('/auth/login', {
    method: 'POST',
    body: JSON.stringify(cleanPayload),
  });

  if (result.accessToken) {
    useAuthStore.getState().login(result.user, result.accessToken);
  }
  return result;
}

export async function getCurrentUser() {
  return fetchWithAuth('/users/me', { method: 'GET' });
}

export async function refreshToken() {
  return fetchWithAuth('/auth/refresh', { method: 'POST' });
}

export async function logout() {
  try {
    await fetchWithAuth('/auth/logout', { method: 'POST' });
  } catch {
    // Proceed with local logout even if backend is unavailable
  }
  if (typeof window !== 'undefined') {
    useAuthStore.getState().logout();
  }
}

export async function updateProfile(data: {
  firstName?: string;
  lastName?: string;
  phone?: string;
  avatarUrl?: string;
}) {
  return fetchWithAuth('/users/me', {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}

// --- SERVICES / CATEGORIES ---

export async function getCategories() {
  return fetchWithAuth('/services/categories', { method: 'GET' });
}

export async function getServices(categoryId?: string) {
  const query = categoryId ? `?categoryId=${categoryId}` : '';
  return fetchWithAuth(`/services${query}`, { method: 'GET' });
}

export async function getServiceById(id: string) {
  return fetchWithAuth(`/services/${id}`, { method: 'GET' });
}

// --- PROVIDERS / TECHNICIANS ---

export interface ProviderSearchParams {
  search?: string;
  serviceId?: string;
  minRating?: number;
  isAvailable?: boolean;
  latitude?: number;
  longitude?: number;
  radiusKm?: number;
  maxPrice?: number;
  page?: number;
  limit?: number;
  sortBy?: 'rating' | 'price' | 'reviews';
}

export async function searchProviders(params?: ProviderSearchParams) {
  const query = params ? '?' + new URLSearchParams(
    Object.fromEntries(
      Object.entries(params)
        .filter(([, v]) => v !== undefined && v !== null && v !== '')
        .map(([k, v]) => [k, String(v)])
    )
  ).toString() : '';
  return fetchWithAuth(`/providers/search${query}`, { method: 'GET' });
}

export async function getProviderById(id: string) {
  return fetchWithAuth(`/providers/${id}`, { method: 'GET' });
}

export async function getProviders() {
  return fetchWithAuth('/providers/search', { method: 'GET' });
}

export async function getProviderReviews(providerId: string, page = 1, limit = 10) {
  return fetchWithAuth(`/providers/${providerId}/reviews?page=${page}&limit=${limit}`, { method: 'GET' });
}

// --- JOBS (CUSTOMER) ---

export async function getMyJobs(params?: Record<string, string>) {
  const query = params ? '?' + new URLSearchParams(params).toString() : '';
  return fetchWithAuth(`/jobs/my-jobs${query}`, { method: 'GET' });
}

export interface CreateJobPayload {
  title: string;
  description: string;
  categoryId: string;
  latitude: number;
  longitude: number;
  address?: string;
  budget?: number;
  scheduledDate?: string;
}

export async function createJob(data: CreateJobPayload) {
  return fetchWithAuth('/jobs', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function getJobById(id: string) {
  return fetchWithAuth(`/jobs/${id}`, { method: 'GET' });
}

export async function cancelJob(id: string, reason?: string) {
  return fetchWithAuth(`/jobs/${id}/cancel`, {
    method: 'POST',
    body: JSON.stringify({ reason }),
  });
}

// --- BOOKING ---

export interface CreateBookingPayload {
  serviceListingId: string;
  providerId: string;
  scheduledDate: string;
  description?: string;
  location?: {
    address: string;
    latitude: number;
    longitude: number;
  };
}

export async function createBooking(data: CreateBookingPayload) {
  return fetchWithAuth('/bookings', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

// --- JOBS (PROVIDER) ---

export async function getAssignedJobs(params?: Record<string, string>) {
  const query = params ? '?' + new URLSearchParams(params).toString() : '';
  return fetchWithAuth(`/jobs/assigned${query}`, { method: 'GET' });
}

export async function getAvailableJobs(lat: number, lng: number, radius?: number) {
  const query = `?latitude=${lat}&longitude=${lng}${radius ? `&radiusKm=${radius}` : ''}`;
  return fetchWithAuth(`/jobs/available${query}`, { method: 'GET' });
}

export async function acceptJob(assignmentId: string, quotedPrice?: number) {
  return fetchWithAuth('/jobs/assignments/accept', {
    method: 'POST',
    body: JSON.stringify({ assignmentId, quotedPrice }),
  });
}

export async function rejectJob(assignmentId: string, rejectionReason?: string) {
  return fetchWithAuth(`/jobs/assignments/${assignmentId}/reject`, {
    method: 'POST',
    body: JSON.stringify({ rejectionReason }),
  });
}

export async function updateJobStatus(id: string, status: string) {
  return fetchWithAuth(`/jobs/${id}/status`, {
    method: 'POST',
    body: JSON.stringify({ status }),
  });
}

// --- FAVORITES (client-side persisted, API-ready) ---
// The backend doesn't have a dedicated favorites table; we store locally and sync when available.

export function getFavoriteIds(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    return JSON.parse(localStorage.getItem('herfa_favorites') || '[]');
  } catch {
    return [];
  }
}

export function toggleFavoriteLocal(technicianId: string): boolean {
  const favorites = getFavoriteIds();
  const exists = favorites.includes(technicianId);
  const updated = exists
    ? favorites.filter((id) => id !== technicianId)
    : [...favorites, technicianId];
  localStorage.setItem('herfa_favorites', JSON.stringify(updated));
  return !exists; // returns new isFavorite state
}

// --- TENDERS ---

export interface CreateTenderPayload {
  title: string;
  description: string;
  budget: number;
  deadline?: string;
}

export async function createTender(data: CreateTenderPayload) {
  return fetchWithAuth('/tenders', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function getMyTenders() {
  return fetchWithAuth('/tenders', { method: 'GET' });
}

export async function getOpenTenders() {
  return fetchWithAuth('/tenders/open', { method: 'GET' });
}

export async function getTenderById(id: string) {
  return fetchWithAuth(`/tenders/${id}`, { method: 'GET' });
}

export async function updateTender(id: string, data: any) {
  return fetchWithAuth(`/tenders/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}

export async function cancelTender(id: string) {
  return fetchWithAuth(`/tenders/${id}/cancel`, { method: 'POST' });
}

// --- OFFERS ---

export interface CreateOfferPayload {
  amount: number;
  notes?: string;
}

export async function submitOffer(tenderId: string, data: CreateOfferPayload) {
  return fetchWithAuth(`/tenders/${tenderId}/offers`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function getTenderOffers(tenderId: string) {
  return fetchWithAuth(`/tenders/${tenderId}/offers`, { method: 'GET' });
}

export async function acceptOffer(offerId: string) {
  return fetchWithAuth(`/tenders/offers/${offerId}/accept`, { method: 'PATCH' });
}

export async function rejectOffer(offerId: string) {
  return fetchWithAuth(`/tenders/offers/${offerId}/reject`, { method: 'PATCH' });
}

export async function getMyOffersTechnician() {
  return fetchWithAuth('/tenders/technician/my-offers', { method: 'GET' });
}

// --- MESSAGES ---

export async function getMyMessages() {
  return fetchWithAuth('/messages', { method: 'GET' });
}

export async function getConversation(otherUserId: string) {
  return fetchWithAuth(`/messages/${otherUserId}`, { method: 'GET' });
}

export async function sendMessage(receiverId: string, content: string, relatedType?: string, relatedId?: string) {
  return fetchWithAuth('/messages', {
    method: 'POST',
    body: JSON.stringify({ receiverId, content, relatedType, relatedId }),
  });
}

export async function markMessageRead(messageId: string) {
  return fetchWithAuth(`/messages/${messageId}/read`, { method: 'PATCH' });
}

// --- VERIFICATION ---

export async function submitVerification(data: any) {
  return fetchWithAuth('/verification/submit', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function getVerificationStatus() {
  return fetchWithAuth('/verification/status', { method: 'GET' });
}

export async function uploadFile(file: File) {
  const formData = new FormData();
  formData.append('file', file);

  const token = useAuthStore.getState().token;
  const response = await fetch(`${API_URL}/uploads`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Upload failed');
  }

  return response.json();
}

// --- USERS / ADMIN ---

export async function getUsers() {
  return fetchWithAuth('/users', { method: 'GET' });
}

export async function getDashboardStats() {
  return fetchWithAuth('/admin/dashboard', { method: 'GET' });
}

export async function getAllJobs(params?: Record<string, string>) {
  const query = params ? '?' + new URLSearchParams(params).toString() : '';
  return fetchWithAuth(`/admin/jobs${query}`, { method: 'GET' });
}

// --- NOTIFICATIONS ---

export async function getNotifications(page = 1, limit = 10, filters?: { isRead?: boolean; type?: string }) {
  const params = new URLSearchParams({ page: String(page), limit: String(limit) });
  if (filters?.isRead !== undefined) params.set('isRead', String(filters.isRead));
  if (filters?.type) params.set('type', filters.type);
  return fetchWithAuth(`/notifications?${params.toString()}`, { method: 'GET' });
}

export async function getUnreadNotificationsCount() {
  return fetchWithAuth('/notifications/unread-count', { method: 'GET' });
}

export async function markNotificationAsRead(id: string) {
  return fetchWithAuth(`/notifications/${id}/read`, {
    method: 'PATCH',
  });
}

export async function markAllNotificationsAsRead() {
  return fetchWithAuth('/notifications/read-all', {
    method: 'PATCH',
  });
}

export async function markNotificationsAsRead(notificationIds: string[]) {
  return fetchWithAuth('/notifications/mark-read', {
    method: 'POST',
    body: JSON.stringify({ notificationIds }),
  });
}

export async function deleteNotification(id: string) {
  return fetchWithAuth(`/notifications/${id}`, {
    method: 'DELETE',
  });
}
