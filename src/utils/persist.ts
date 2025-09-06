
export const loadCart = (): { items: any[] } | null => {
  try {
    const raw = localStorage.getItem('cart')
    if (!raw) return null
    const data = JSON.parse(raw)


    if (Array.isArray(data)) return { items: data }


    if (data && Array.isArray((data as any).items)) {
      return { items: (data as any).items }
    }
    return null
  } catch {
    return null
  }
}


export const saveCart = (state: { items: any[] }) => {
  try {
    localStorage.setItem('cart', JSON.stringify({ items: state.items }))
  } catch {}
}
