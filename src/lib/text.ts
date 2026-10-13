export function plainText(value: unknown, max: number) {
  if (typeof value !== 'string') return ''
  return value.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim().slice(0, max)
}

export function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}
