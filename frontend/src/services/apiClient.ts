
const API_BASE_URL = (import.meta.env.VITE_API_URL ?? '').replace(/\/+$/, '');

type RequestOptions = {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  body?: unknown;
  headers?: Record<string, string>;
};

export class ApiError extends Error {
  status: number;
  data: unknown;
  constructor(message: string, status: number, data?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

function buildUrl(endpoint: string): string {
  if (!API_BASE_URL) {
    throw new Error('Thiếu cấu hình VITE_API_URL.');
  }

  const normalizedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  return `${API_BASE_URL}${normalizedEndpoint}`;
}

async function getErrorMessage(response: Response): Promise<string> {
  const responseText = await response.text().catch(() => '');
  if (!responseText) return 'Đã có lỗi xảy ra';

  try {
    const errorData: unknown = JSON.parse(responseText);
    if (typeof errorData === 'object' && errorData !== null && 'message' in errorData) {
      const message = errorData.message;
      if (typeof message === 'string' && message.trim()) return message;
    }
  } catch {
    // Response có thể là text hoặc HTML thay vì JSON.
  }

  return responseText.length <= 200 ? responseText : 'Đã có lỗi xảy ra';
}

async function request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const hasBody = options.body !== undefined;
  const response = await fetch(buildUrl(endpoint), {
    method: options.method ?? 'GET',
    headers: {
      Accept: 'application/json',
      ...(hasBody ? { 'Content-Type': 'application/json' } : {}),
      ...options.headers,
    },
    credentials: 'include',
    ...(hasBody ? { body: JSON.stringify(options.body) } : {}),
  });

  if (!response.ok) {
    throw new ApiError(await getErrorMessage(response), response.status);
  }

  const responseText = await response.text();
  if (!responseText.trim()) return undefined as T;

  try {
    return JSON.parse(responseText) as T;
  } catch {
    throw new ApiError('Phản hồi từ máy chủ không đúng định dạng JSON', response.status);
  }
}

export const apiClient = {
  get: <T>(endpoint: string) => request<T>(endpoint),
  post: <T>(endpoint: string, body: unknown) => request<T>(endpoint, { method: 'POST', body }),
  put: <T>(endpoint: string, body: unknown) => request<T>(endpoint, { method: 'PUT', body }),
  delete: <T>(endpoint: string) => request<T>(endpoint, { method: 'DELETE' }),
};
