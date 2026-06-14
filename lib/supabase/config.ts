export function getSupabaseConfig() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim()
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim()

  if (!url || !anonKey) {
    throw new Error('Missing Supabase environment variables')
  }

  return { url, anonKey }
}

function hasHeaderBreakingCharacters(value: string) {
  if (/[\r\n]/.test(value)) return true

  try {
    return /[\r\n]/.test(decodeURIComponent(value))
  } catch {
    return false
  }
}

export function isValidSupabaseCookie(cookie: { value: string }) {
  return !hasHeaderBreakingCharacters(cookie.value)
}

export function isSupabaseCookie(name: string) {
  return name.startsWith('sb-')
}
