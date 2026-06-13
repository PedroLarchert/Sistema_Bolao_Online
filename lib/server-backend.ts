import { cookies } from 'next/headers'
import { AUTH_TOKEN_COOKIE } from './token'

export const SERVER_API_BASE_URL =
  process.env.API_INTERNAL_URL ?? process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001'

export async function getServerToken() {
  const cookieStore = await cookies()
  return cookieStore.get(AUTH_TOKEN_COOKIE)?.value ?? null
}

export async function serverApiRequest<T>(path: string, init: RequestInit = {}) {
  const token = await getServerToken()

  const response = await fetch(`${SERVER_API_BASE_URL}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(init.headers ?? {}),
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