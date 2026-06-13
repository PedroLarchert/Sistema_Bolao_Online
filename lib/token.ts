export const AUTH_TOKEN_COOKIE = 'bola_jwt'

export function getBrowserToken() {
  if (typeof document === 'undefined') {
    return null
  }

  const cookie = document.cookie
    .split('; ')
    .find((entry) => entry.startsWith(`${AUTH_TOKEN_COOKIE}=`))

  return cookie ? decodeURIComponent(cookie.split('=')[1] ?? '') : null
}

export function setBrowserToken(token: string) {
  document.cookie = `${AUTH_TOKEN_COOKIE}=${encodeURIComponent(token)}; path=/; max-age=${60 * 60 * 24 * 7}; samesite=lax`
}

export function clearBrowserToken() {
  document.cookie = `${AUTH_TOKEN_COOKIE}=; path=/; max-age=0; samesite=lax`
}