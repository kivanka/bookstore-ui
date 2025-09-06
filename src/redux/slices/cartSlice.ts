import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { BookSummary } from '../../types/book'
import { parsePrice } from '../../utils/price'
import { loadCart, saveCart } from '../../utils/persist'

export interface CartItem extends BookSummary { qty: number; priceNum: number }
type State = { items: CartItem[] }

const initialState: State = loadCart() ?? { items: [] }

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart(state, action: PayloadAction<BookSummary>) {
      if (!Array.isArray(state.items)) state.items = []
      const b = action.payload
      const i = state.items.findIndex(x => x.isbn13 === b.isbn13)
      if (i >= 0) state.items[i].qty += 1
      else state.items.push({ ...b, qty: 1, priceNum: parsePrice(b.price) })
      saveCart(state)
    },
    clearCart(state) { state.items = []; saveCart(state) },
    removeFromCart(state, action: PayloadAction<string>) {
      state.items = state.items.filter(x => x.isbn13 !== action.payload)
      saveCart(state)
    },
    setQty(state, action: PayloadAction<{ isbn13: string; qty: number }>) {
      const item = state.items.find(x => x.isbn13 === action.payload.isbn13)
      if (item) item.qty = Math.max(1, Math.floor(action.payload.qty) || 1)
      saveCart(state)
    },
  },
})
export const { addToCart, clearCart, removeFromCart, setQty } = cartSlice.actions
export default cartSlice.reducer
