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
  // Absolute URLs pass through unchanged
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  // Always use relative paths for /api/* and /pdfs/* routes.
  // • On Vercel production: vercel.json rewrites /api/* → https://scriptiq-backend.onrender.com/api/*
  // • On local dev: vite.config.ts proxy forwards /api/* → http://localhost:8000
  // Prepending VITE_API_BASE_URL would double the /api prefix if it includes /api, causing 404.
  if (cleanPath.startsWith('/api/') || cleanPath.startsWith('/pdfs/') || cleanPath.startsWith('/assets/')) {
    return cleanPath;
  }
  // For any other path, honour the configured base URL
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
