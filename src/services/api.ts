const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

// Helper to get token from localStorage
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
  };
};

export async function register(data: any) {
  const res = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  const result = await res.json();
  if (result.token) {
    localStorage.setItem('token', result.token);
    localStorage.setItem('user', JSON.stringify(result.user));
  }
  return result;
}

export async function login(data: any) {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  const result = await res.json();
  if (result.token) {
    localStorage.setItem('token', result.token);
    localStorage.setItem('user', JSON.stringify(result.user));
  }
  return result;
}

export async function getCurrentUser() {
  const res = await fetch(`${API_URL}/auth/me`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });

  return res.json();
}

export function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
}
