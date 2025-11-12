'use client';

// Strict authentication credentials
const ALLOWED_EMAIL = 'kethugroups@hotmail.com';
const ALLOWED_PASSWORD = 'kethu@Kethu1';

const AUTH_KEY = 'kethu_auth_token';
const AUTH_TOKEN = 'kethu_authenticated_2024';

export function login(email: string, password: string): boolean {
  if (email === ALLOWED_EMAIL && password === ALLOWED_PASSWORD) {
    if (typeof window !== 'undefined') {
      localStorage.setItem(AUTH_KEY, AUTH_TOKEN);
    }
    return true;
  }
  return false;
}

export function logout(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(AUTH_KEY);
    // Also clear module selection on logout
    localStorage.removeItem('kethu_selected_module');
  }
}

export function isAuthenticated(): boolean {
  if (typeof window === 'undefined') {
    return false;
  }
  const token = localStorage.getItem(AUTH_KEY);
  return token === AUTH_TOKEN;
}

export function checkAuth(): boolean {
  return isAuthenticated();
}

