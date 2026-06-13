import { getBrowserToken } from './token'

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? process.env.API_INTERNAL_URL ?? 'http://localhost:3001'

type RequestOptions = RequestInit & {
  token?: string | null
}

function getAuthHeaders(token?: string | null) {
  const resolvedToken = token ?? getBrowserToken()
  return resolvedToken ? { Authorization: `Bearer ${resolvedToken}` } : {}
}

export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { token, headers, ...rest } = options

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...rest,
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(token),
      ...(headers ?? {}),
    },
    cache: 'no-store',
  })

  if (!response.ok) {
    const errorBody = await response.json().catch(() => null)
    const message = errorBody?.message || `Request failed with status ${response.status}`
    throw new Error(Array.isArray(message) ? message.join(', ') : message)
  }

  if (response.status === 204) {
    return undefined as T
  }

  return response.json() as Promise<T>
}