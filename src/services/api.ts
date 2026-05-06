const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/v1';

// Helper to get token from localStorage
const getAuthHeaders = () => {
  if (typeof window === 'undefined') return { 'Content-Type': 'application/json' };
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
  };
};

async function fetchWithAuth(url: string, options: RequestInit = {}) {
  const res = await fetch(`${API_URL}${url}`, {
    ...options,
    headers: {
      ...getAuthHeaders(),
      ...options.headers,
    },
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
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
    body: JSON.stringify(data),
  });

  if (result.accessToken) {
    localStorage.setItem('token', result.accessToken);
    localStorage.setItem('user', JSON.stringify(result.user));
  }
  return { data: result };
}

export interface LoginPayload {
  email: string;
  password: string;
}

export async function login(payload: LoginPayload) {
  const cleanPayload = {
    identifier: payload.email,
    password: payload.password,
  };

  const result = await fetchWithAuth('/auth/login', {
    method: 'POST',
    body: JSON.stringify(cleanPayload),
  });

  if (result.accessToken) {
    localStorage.setItem('token', result.accessToken);
    localStorage.setItem('user', JSON.stringify(result.user));
  }
  return result;
}

export async function getCurrentUser() {
  return fetchWithAuth('/auth/me', { method: 'GET' });
}

export function logout() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
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
  return fetchWithAuth(`/reviews/provider/${providerId}?page=${page}&limit=${limit}`, { method: 'GET' });
}

// --- JOBS (CUSTOMER) ---

export async function getMyJobs(params?: Record<string, string>) {
  const query = params ? '?' + new URLSearchParams(params).toString() : '';
  return fetchWithAuth(`/jobs/my-jobs${query}`, { method: 'GET' });
}

export async function createJob(data: any) {
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
  serviceId: string;
  providerId?: string;
  title?: string;
  description?: string;
  address: string;
  latitude?: number;
  longitude?: number;
  scheduledDate?: string;
  scheduledTime?: string;
  notes?: string;
}

export async function createBooking(data: CreateBookingPayload) {
  return fetchWithAuth('/jobs', {
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
  serviceId: string;
  title: string;
  description: string;
  budgetMin?: number;
  budgetMax?: number;
  address?: string;
  deadline?: string;
  images?: string[];
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
  price: number;
  message?: string;
  estimatedDays?: number;
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

  const token = localStorage.getItem('token');
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
