import { z } from 'zod';
import { useAuthStore } from '@/store/authStore';

export interface APIResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

export function getApiUrl(path: string): string {
  if (!path) return '';
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${API_BASE_URL}${cleanPath}`;
}

export async function fetchAndValidate<T>(
  url: string,
  options: RequestInit = {},
  schema?: z.ZodSchema<T>
): Promise<{ success: boolean; data?: T; error?: string }> {
  try {
    const token = useAuthStore.getState().token;
    const headers = new Headers(options.headers || {});
    if (token && !headers.has('Authorization')) {
      headers.set('Authorization', `Bearer ${token}`);
    }

    const fullUrl = getApiUrl(url);
    const res = await fetch(fullUrl, { ...options, headers });
    if (res.status === 401) {
      console.warn('[apiClient] 401 Unauthorized — Logging out user');
      useAuthStore.getState().logout();
      window.location.href = '/login';
      return { success: false, error: 'Session expired. Please log in again.' };
    }

    if (!res.ok) {
      const errText = await res.text();
      return { success: false, error: `Server Error (${res.status}): ${errText}` };
    }

    const json: APIResponse<T> = await res.json();
    if (!json.success) {
      return { success: false, error: json.error || 'Request failed on server' };
    }

    if (schema && json.data) {
      const parsed = schema.safeParse(json.data);
      if (!parsed.success) {
        console.warn('[apiClient] Zod schema validation warning:', parsed.error.format());
        // Return data with schema warning log
        return { success: true, data: json.data };
      }
      return { success: true, data: parsed.data };
    }

    return { success: true, data: json.data };
  } catch (err: any) {
    console.error('[apiClient] Fetch error:', err);
    return { success: false, error: err.message || 'Network error' };
  }
}
