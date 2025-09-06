export const parsePrice = (s: string): number => {
  if (!s) return 0
  if (s.toLowerCase() === 'free') return 0
  const n = Number(s.replace(/[^0-9.]/g, ''))
  return isFinite(n) ? n : 0
}

export const formatUSD = (n: number) =>
  `${n.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} $`