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

  return res.json();
}

// --- AUTH ---

export async function register(data: any) {
  const result = await fetchWithAuth('/auth/register', {
    method: 'POST',
    body: JSON.stringify(data),
  });

  // If your backend auto-logs in after registration
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

// --- SERVICES ---

export async function getCategories() {
  return fetchWithAuth('/services/categories', { method: 'GET' });
}

export async function getServices(categoryId?: string) {
  const query = categoryId ? `?categoryId=${categoryId}` : '';
  return fetchWithAuth(`/services${query}`, { method: 'GET' });
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

// --- USERS / ADMIN ---

export async function getUsers() {
  return fetchWithAuth('/users', { method: 'GET' });
}

export async function getProviders() {
  return fetchWithAuth('/users?role=provider', { method: 'GET' });
}

export async function getDashboardStats() {
  return fetchWithAuth('/admin/dashboard', { method: 'GET' });
}

export async function getAllJobs(params?: Record<string, string>) {
  const query = params ? '?' + new URLSearchParams(params).toString() : '';
  return fetchWithAuth(`/admin/jobs${query}`, { method: 'GET' });
}
