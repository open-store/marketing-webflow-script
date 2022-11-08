/**
 * Iterates over the values for the provided cookie string
 * @param str A raw cookie string from request or response headers
 * @yields A tuple of the cookie key and value. If the value is a comma separated array, the first value is taken
 */
function* eachCookie(str: string) {
  if (!str) {
    return
  }
  for (const cookie of str.split(';')) {
    const [key, val] = cookie.trim().split('=')
    if (!key || !val) {
      continue
    }
    yield [key, val?.split(',')[0]]
  }
}

/**
 * Parses a cookie string into a dictionary
 * @param str A raw cookie string from request or response headers
 * @returns A dictionary of cookie keys to values. If the value is a comma separated array, the first value is taken
 */
export function parseCookie(str: string) {
  const parsed: Record<string, string> = {}
  for (const [key, val] of eachCookie(str)) {
    parsed[key] = val
  }
  return parsed
}
