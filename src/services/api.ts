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
  return { data: result }; // Wrapped to match RegisterForm expectation
}

export interface LoginPayload {
  email: string;
  password: string;
}

export async function login(payload: LoginPayload) {
  // Map frontend fields to match backend DTO strictly (identifier instead of email)
  const cleanPayload = {
    identifier: payload.email,
    password: payload.password,
  };
  
  console.log('Login Payload:', cleanPayload);
  
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

// --- JOBS ---

export async function getJobs(params?: Record<string, string>) {
  const query = params ? '?' + new URLSearchParams(params).toString() : '';
  return fetchWithAuth(`/jobs${query}`, { method: 'GET' });
}

export async function getJobById(id: string) {
  return fetchWithAuth(`/jobs/${id}`, { method: 'GET' });
}

export async function createJob(data: any) {
  return fetchWithAuth('/jobs', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updateJob(id: string, data: any) {
  return fetchWithAuth(`/jobs/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}

// --- PROVIDERS ---

export async function getProviders(params?: Record<string, string>) {
  const query = params ? '?' + new URLSearchParams(params).toString() : '';
  return fetchWithAuth(`/providers${query}`, { method: 'GET' });
}

export async function getProviderById(id: string) {
  return fetchWithAuth(`/providers/${id}`, { method: 'GET' });
}
