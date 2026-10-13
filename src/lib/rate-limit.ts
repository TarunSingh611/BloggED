const hits = new Map<string, { count: number; reset: number }>()

export function clientIp(req: Request) {
  const forwarded = req.headers.get('x-forwarded-for')
  return forwarded?.split(',')[0]?.trim() || 'local'
}

export function rateLimit(key: string, limit: number, windowMs: number) {
  const now = Date.now()
  const current = hits.get(key)
  if (!current || current.reset < now) {
    hits.set(key, { count: 1, reset: now + windowMs })
    return true
  }
  if (current.count >= limit) return false
  current.count += 1
  return true
}
